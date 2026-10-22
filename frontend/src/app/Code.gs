const BRAND_NAME = "Way2Skills";
const SUBMISSION_KEY_PREFIX = "way2skills_submission_";
const CLEANUP_KEY = "way2skills_submission_cleanup_at";
const SUBMISSION_RETENTION_MS = 24 * 60 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 6 * 60 * 60 * 1000;

function doGet() {
  return jsonResponse({
    success: true,
    message: "Way2Skills notification service is running."
  });
}

function authorizeMailService() {
  MailApp.getRemainingDailyQuota();
}

function doPost(e) {
  const requestId = String(e?.parameter?.requestId || "");
  let formType = "unknown";
  let responseOrigin;

  try {
    responseOrigin = validResponseOrigin(e?.parameter?.responseOrigin);
  } catch (error) {
    logFormEvent(formType, "response_origin_rejected", error);
    return jsonResponse({
      success: false,
      message: "The response origin is not configured."
    });
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    return formResponse(
      submissionResponse(
        requestId,
        false,
        "rejected",
        "not_sent",
        "not_required",
        false,
        "The submission identifier is invalid."
      ),
      responseOrigin
    );
  }

  let submission;
  let companyEmail;

  try {
    const contents = e?.parameter?.payload || e?.postData?.contents;
    if (!contents) throw new Error("No submission received.");

    const data = JSON.parse(contents);
    formType = String(data?.formType || "").trim();
    if (formType === "contact") {
      submission = validateContact(data);
    } else if (formType === "admission") {
      submission = validateAdmission(data);
    } else {
      throw new Error("Invalid form type.");
    }

    companyEmail = getCompanyEmail();
  } catch (error) {
    logFormEvent(formType, "validation_or_configuration_failed", error);
    return formResponse(
      submissionResponse(
        requestId,
        false,
        "rejected",
        "not_sent",
        "not_required",
        false,
        "The submission could not be processed. Please check the form and try again."
      ),
      responseOrigin
    );
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
  } catch (error) {
    logFormEvent(formType, "idempotency_lock_failed", error);
    return formResponse(
      submissionResponse(
        requestId,
        false,
        "uncertain",
        "unknown",
        formType === "admission" ? "unknown" : "not_required",
        false,
        "We could not confirm whether this submission is already being processed. Contact us before retrying."
      ),
      responseOrigin
    );
  }

  let companyNotificationStatus = "not_sent";
  let applicantConfirmationStatus =
    formType === "admission" ? "not_sent" : "not_required";

  try {
    const properties = PropertiesService.getScriptProperties();
    pruneExpiredSubmissions(properties);

    const propertyKey = SUBMISSION_KEY_PREFIX + requestId;
    const previous = properties.getProperty(propertyKey);
    if (previous) {
      const response = responseForExistingSubmission(
        requestId,
        formType,
        previous
      );
      logFormEvent(formType, "duplicate_request_suppressed");
      return formResponse(response, responseOrigin);
    }

    const recipientCount = formType === "admission" ? 2 : 1;
    let remainingQuota;
    try {
      remainingQuota = MailApp.getRemainingDailyQuota();
    } catch (error) {
      logFormEvent(formType, "mail_authorization_or_quota_check_failed", error);
      return formResponse(
        submissionResponse(
          requestId,
          false,
          "rejected",
          "not_sent",
          "not_required",
          false,
          "The email service is not authorized or available. Please contact us directly."
        ),
        responseOrigin
      );
    }

    if (remainingQuota < recipientCount) {
      logFormEvent(formType, "daily_recipient_quota_exhausted", null, {
        remainingQuota: remainingQuota
      });
      return formResponse(
        submissionResponse(
          requestId,
          false,
          "rejected",
          "not_sent",
          "not_required",
          false,
          "The email service has reached its daily sending limit. Please contact us directly."
        ),
        responseOrigin
      );
    }

    storeSubmissionStage(properties, requestId, formType, "company_sending");
    logFormEvent(formType, "company_notification_started", null, {
      remainingQuota: remainingQuota
    });

    companyNotificationStatus = "unknown";
    try {
      MailApp.sendEmail(companyNotification(submission, companyEmail));
    } catch (error) {
      logFormEvent(formType, "company_notification_failed", error);
      storeSubmissionStage(
        properties,
        requestId,
        formType,
        "company_uncertain"
      );
      return formResponse(
        submissionResponse(
          requestId,
          false,
          "uncertain",
          "unknown",
          formType === "admission" ? "not_sent" : "not_required",
          false,
          "We could not confirm the company notification. It may have been sent; contact us before retrying."
        ),
        responseOrigin
      );
    }

    companyNotificationStatus = "sent";
    storeSubmissionStage(properties, requestId, formType, "company_sent");
    logFormEvent(formType, "company_notification_accepted");

    if (formType === "contact") {
      storeSubmissionStage(properties, requestId, formType, "complete");
      return formResponse(
        submissionResponse(
          requestId,
          true,
          "complete",
          "sent",
          "not_required",
          false,
          "The contact notification was accepted by the email service. Inbox delivery is not guaranteed."
        ),
        responseOrigin
      );
    }

    storeSubmissionStage(
      properties,
      requestId,
      formType,
      "confirmation_sending"
    );
    logFormEvent(formType, "applicant_confirmation_started");

    applicantConfirmationStatus = "unknown";
    try {
      MailApp.sendEmail(applicantConfirmation(submission));
    } catch (error) {
      logFormEvent(
        formType,
        "applicant_confirmation_failed",
        error
      );
      storeSubmissionStage(
        properties,
        requestId,
        formType,
        "confirmation_uncertain"
      );
      return formResponse(
        submissionResponse(
          requestId,
          false,
          "partial",
          "sent",
          "unknown",
          false,
          "The company notification was accepted, but the applicant confirmation could not be verified. Contact admissions before retrying."
        ),
        responseOrigin
      );
    }

    applicantConfirmationStatus = "sent";
    storeSubmissionStage(properties, requestId, formType, "complete");
    logFormEvent(formType, "applicant_confirmation_accepted");
    return formResponse(
      submissionResponse(
        requestId,
        true,
        "complete",
        "sent",
        "sent",
        false,
        "Both admission notifications were accepted by the email service. Inbox delivery is not guaranteed."
      ),
      responseOrigin
    );
  } catch (error) {
    logFormEvent(formType, "submission_processing_failed", error);
    return formResponse(
      submissionResponse(
        requestId,
        false,
        "uncertain",
        companyNotificationStatus,
        applicantConfirmationStatus,
        false,
        "We could not verify whether the email operation completed. It may have been sent; contact us before retrying."
      ),
      responseOrigin
    );
  } finally {
    lock.releaseLock();
  }
}

function validateContact(data) {
  return {
    formType: "contact",
    name: singleLine(data.name, "Name", 100),
    email: validEmail(data.email),
    phone: optionalSingleLine(data.phone, 20),
    topic: optionalSingleLine(data.topic, 100) || "Other Enquiry",
    message: required(data.message, "Message", 2000)
  };
}

function validateAdmission(data) {
  return {
    formType: "admission",
    name: singleLine(data.name, "Name", 100),
    email: validEmail(data.email),
    phone: singleLine(data.phone, "Phone", 20),
    education: singleLine(data.education, "Education", 100),
    course: singleLine(data.course, "Course", 100),
    message: optional(data.message, 2000)
  };
}

function companyNotification(data, companyEmail) {
  if (data.formType === "contact") {
    return {
      to: companyEmail,
      replyTo: data.email,
      name: BRAND_NAME,
      subject: `[Way2Skills Contact] ${data.topic}`,
      body:
        "A new contact enquiry was submitted.\n\n" +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || "Not provided"}\n` +
        `Topic: ${data.topic}\n\n` +
        `Message:\n${data.message}`
    };
  }

  return {
    to: companyEmail,
    replyTo: data.email,
    name: BRAND_NAME,
    subject: "[Way2Skills Admission] New application",
    body:
      "A new admission application was received.\n\n" +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone}\n` +
      `Education: ${data.education}\n` +
      `Course: ${data.course}\n` +
      `Additional message: ${data.message || "None"}`
  };
}

function applicantConfirmation(data) {
  return {
    to: data.email,
    name: BRAND_NAME,
    subject: "Application received | Way2Skills",
    body:
      `Hi ${data.name},\n\n` +
      "Thank you for applying to Way2Skills.\n\n" +
      `Programme: ${data.course}\n` +
      `Education: ${data.education}\n\n` +
      "We have received your application. Our team will review " +
      "your details and contact you regarding the next steps.\n\n" +
      "Please note that submitting an application does not guarantee " +
      "admission or employment.\n\n" +
      "Regards,\nWay2Skills Team"
  };
}

function getCompanyEmail() {
  const email = PropertiesService.getScriptProperties()
    .getProperty("COMPANY_EMAIL");
  if (!email) throw new Error("COMPANY_EMAIL is not configured.");
  return validEmail(email);
}

function validResponseOrigin(value) {
  const origin = String(value || "");
  const isHttpsOrigin =
    /^https:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}(?::\d{1,5})?$/.test(
      origin
    );
  const isLocalhostOrigin =
    /^http:\/\/localhost(?::\d{1,5})?$/.test(origin);
  const allowedOrigins = String(
    PropertiesService.getScriptProperties()
      .getProperty("ALLOWED_RESPONSE_ORIGINS") || ""
  )
    .split(",")
    .map(function (item) {
      return item.trim();
    })
    .filter(Boolean);

  if (
    (!isHttpsOrigin && !isLocalhostOrigin) ||
    allowedOrigins.indexOf(origin) === -1
  ) {
    throw new Error("The response origin is not on the allowlist.");
  }

  return origin;
}

function responseForExistingSubmission(requestId, formType, storedValue) {
  let stored;
  try {
    stored = JSON.parse(storedValue);
  } catch (error) {
    return submissionResponse(
      requestId,
      false,
      "uncertain",
      "unknown",
      formType === "admission" ? "unknown" : "not_required",
      true,
      "This submission may already have been processed. Contact us before retrying."
    );
  }

  if (stored.formType !== formType) {
    return submissionResponse(
      requestId,
      false,
      "uncertain",
      "unknown",
      formType === "admission" ? "unknown" : "not_required",
      true,
      "This submission identifier is already associated with another form. No additional email was sent."
    );
  }

  if (stored.stage === "complete") {
    return submissionResponse(
      requestId,
      true,
      "complete",
      "sent",
      formType === "admission" ? "sent" : "not_required",
      true,
      "This submission was already processed; no additional email was sent."
    );
  }

  if (formType === "contact" && stored.stage === "company_sent") {
    return submissionResponse(
      requestId,
      true,
      "complete",
      "sent",
      "not_required",
      true,
      "This submission was already processed; no additional email was sent."
    );
  }

  if (
    formType === "admission" &&
    (stored.stage === "company_sent" ||
      stored.stage === "confirmation_sending" ||
      stored.stage === "confirmation_uncertain")
  ) {
    return submissionResponse(
      requestId,
      false,
      "partial",
      "sent",
      stored.stage === "company_sent" ? "not_sent" : "unknown",
      true,
      "The company notification was accepted, but applicant confirmation is not verified. No additional email was sent; contact admissions."
    );
  }

  return submissionResponse(
    requestId,
    false,
    "uncertain",
    "unknown",
    formType === "admission" ? "unknown" : "not_required",
    true,
    "This submission may already have been processed. No additional email was sent; contact us before retrying."
  );
}

function submissionResponse(
  requestId,
  success,
  outcome,
  companyNotification,
  applicantConfirmation,
  duplicate,
  message
) {
  return {
    type: "way2skills-form-response",
    requestId: requestId,
    success: success,
    outcome: outcome,
    companyNotification: companyNotification,
    applicantConfirmation: applicantConfirmation,
    duplicate: duplicate,
    message: message
  };
}

function storeSubmissionStage(properties, requestId, formType, stage) {
  properties.setProperty(
    SUBMISSION_KEY_PREFIX + requestId,
    JSON.stringify({
      updatedAt: Date.now(),
      formType: formType,
      stage: stage
    })
  );
}

function pruneExpiredSubmissions(properties) {
  const now = Date.now();
  const lastCleanup = Number(properties.getProperty(CLEANUP_KEY) || 0);
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  const values = properties.getProperties();
  Object.keys(values).forEach(function (key) {
    if (key.indexOf(SUBMISSION_KEY_PREFIX) !== 0) return;
    try {
      const record = JSON.parse(values[key]);
      if (now - Number(record.updatedAt || 0) > SUBMISSION_RETENTION_MS) {
        properties.deleteProperty(key);
      }
    } catch (error) {
      properties.deleteProperty(key);
    }
  });
  properties.setProperty(CLEANUP_KEY, String(now));
}

function logFormEvent(formType, stage, error, details) {
  const entry = {
    formType: formType,
    stage: stage
  };

  if (details) {
    Object.keys(details).forEach(function (key) {
      entry[key] = details[key];
    });
  }

  if (error) {
    const errorName = error.name ? String(error.name) : "Error";
    const errorMessage = error.message
      ? String(error.message).toLowerCase()
      : String(error).toLowerCase();
    entry.errorName = /^[a-z]{1,40}$/i.test(errorName) ? errorName : "Error";
    entry.errorCategory = safeErrorCategory(errorMessage);
  }

  console.log(JSON.stringify(entry));
}

function safeErrorCategory(message) {
  if (/quota|too many|daily limit/.test(message)) {
    return "quota_or_daily_limit";
  }
  if (/authoriz|permission|scope|access denied/.test(message)) {
    return "authorization_or_permission";
  }
  if (/timeout|timed out|temporar|unavailable/.test(message)) {
    return "timeout_or_service_unavailable";
  }
  if (/invalid|no submission|malformed/.test(message)) {
    return "invalid_request";
  }
  if (/lock|property|script storage/.test(message)) {
    return "lock_or_storage";
  }
  return "unclassified_failure";
}

function singleLine(value, label, maxLength) {
  const result = required(value, label, maxLength);
  if (/[\r\n]/.test(result)) throw new Error(`Invalid ${label}.`);
  return result;
}

function optionalSingleLine(value, maxLength) {
  const result = optional(value, maxLength);
  if (/[\r\n]/.test(result)) throw new Error("A field contains invalid characters.");
  return result;
}

function required(value, label, maxLength) {
  const result = String(value ?? "").trim();
  if (!result || result.length > maxLength) {
    throw new Error(`Invalid ${label}.`);
  }
  return result;
}

function optional(value, maxLength) {
  const result = String(value ?? "").trim();
  if (result.length > maxLength) {
    throw new Error("A field exceeds its allowed length.");
  }
  return result;
}

function validEmail(value) {
  const email = required(value, "Email", 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email address.");
  }
  return email;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function formResponse(data, targetOrigin) {
  const response = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const safeTargetOrigin = JSON.stringify(targetOrigin);

  return HtmlService
    .createHtmlOutput(
      `<script>window.top.postMessage(${response}, ${safeTargetOrigin});</script>`
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
