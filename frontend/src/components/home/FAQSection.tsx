const faqs = [
  {
    question: "What is the Full Stack Development programme?",
    answer:
      "It is a learning programme focused on developing technical foundations through structured learning and practical project work.",
  },
  {
    question: "How long is the programme?",
    answer:
      "The planned structure includes four months of training followed by a two-month internship, subject to eligibility and applicable terms.",
  },
  {
    question: "Is the internship guaranteed?",
    answer:
      "Internship participation depends on the published eligibility criteria and applicable programme terms.",
  },
  {
    question: "What topics will I learn?",
    answer:
      "Contact the Way2Skills team for the latest approved syllabus and programme details.",
  },
  {
    question: "How can I enquire about admissions?",
    answer:
      "Contact the Way2Skills team to enquire about the programme, eligibility, and application process.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white px-4 py-12 text-[#101820] sm:px-8 sm:py-20 lg:py-24"
    >
      {/* Subtle decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-sky-50 blur-[80px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-50/70 blur-[90px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Frequently Asked
            <span className="block text-sky-700">Questions.</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-lg text-xs leading-6 text-slate-500 sm:mt-4 sm:text-base sm:leading-7">
            Everything you need to know about our programme, learning
            journey, and admissions.
          </p>
        </div>

        {/* FAQ accordion cards */}
        <div className="mt-7 space-y-2.5 sm:mt-14 sm:space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="w2s-faq-card group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all duration-300 open:border-sky-200 open:shadow-[0_12px_35px_rgba(14,116,144,0.08)] hover:border-sky-200 hover:shadow-[0_8px_28px_rgba(14,116,144,0.06)] sm:rounded-2xl"
            >
              {/* Red accent when expanded */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 top-0 w-1 origin-center scale-y-0 bg-red-500 transition-transform duration-300 group-open:scale-y-100"
              />

              <summary className="flex cursor-pointer list-none items-center gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-6 sm:py-6 [&::-webkit-details-marker]:hidden">
                {/* Question number */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-[11px] font-bold tracking-wide text-sky-800 transition-all duration-300 group-open:border-red-100 group-open:bg-red-50 group-open:text-red-600 sm:h-10 sm:w-10 sm:rounded-xl sm:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Question */}
                <span className="flex-1 text-xs font-semibold leading-5 text-slate-800 transition-colors duration-300 group-open:text-sky-800 sm:text-base sm:leading-6">
                  {faq.question}
                </span>

                {/* Expand icon */}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-300 group-hover:border-sky-300 group-hover:text-sky-700 group-open:rotate-45 group-open:border-red-500 group-open:bg-red-500 group-open:text-white sm:h-9 sm:w-9">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>

              {/* Answer */}
              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-open:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 px-3.5 pb-4 pt-3 sm:ml-[76px] sm:mr-6 sm:px-0 sm:pb-6 sm:pt-4">
                    <p className="max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-6 flex flex-col items-center justify-center gap-1.5 text-center sm:mt-8 sm:flex-row sm:gap-3">
          <span className="text-xs text-slate-500 sm:text-sm">
            Still have questions?
          </span>

          <a
            href="/contact"
            className="inline-flex min-h-[38px] items-center gap-1 text-xs font-semibold text-sky-700 transition-colors duration-300 hover:text-red-600 sm:min-h-0 sm:text-sm"
          >
            Contact our team
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}