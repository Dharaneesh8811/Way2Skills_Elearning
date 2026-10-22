import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sections = [
  {
    number: "01",
    title: "Information We Collect",
    content:
      "Our website provides information about courses, internships, and admissions. Our enquiry forms request details such as your name, email, phone number, education level, programme, and message. Currently, these forms are frontend previews and do not send or store form entries through an application backend.",
  },
  {
    number: "02",
    title: "How We Use Information",
    content:
      "When our services are connected, information may be used to respond to enquiries, provide programme details, explain admission requirements, and assist with internship-related questions.",
  },
  {
    number: "03",
    title: "Sharing Information",
    content:
      "Personal information should only be shared for appropriate purposes and in accordance with applicable legal requirements. Future third-party services that process personal information should be disclosed in this policy.",
  },
  {
    number: "04",
    title: "Cookies and Technical Information",
    content:
      "Website hosting and technical services may process information such as IP addresses, browser details, and diagnostic logs. Actual cookie and analytics practices must be verified before this policy is finalised.",
  },
  {
    number: "05",
    title: "Data Security and Retention",
    content:
      "Appropriate safeguards should be implemented to protect personal information. Data retention, access controls, and deletion procedures must be established when backend services are introduced.",
  },
  {
    number: "06",
    title: "Your Privacy Rights",
    content:
      "Depending on applicable law, you may have rights relating to access, correction, erasure, consent withdrawal, and grievance redressal. Procedures for handling privacy requests should be established before personal information is collected and stored.",
  },
  {
    number: "07",
    title: "Children's Privacy",
    content:
      "Personal information relating to children must be handled in accordance with applicable legal requirements, including any required consent and safeguards.",
  },
  {
    number: "08",
    title: "Policy Updates",
    content:
      "This policy may be updated when website features, data practices, or applicable legal requirements change. The latest version and update date should be published on this page.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F3F6FA] text-slate-800">
      <Navbar />

      <section className="px-4 pb-10 pt-20 sm:px-8 sm:pb-16 sm:pt-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 text-center sm:mb-7">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Privacy Policy
            </h1>

            <div className="mx-auto mt-2.5 h-1 w-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 sm:mt-3 sm:w-14" />
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <article
                key={section.number}
                className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_5px_20px_rgba(15,40,80,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_12px_28px_rgba(15,40,80,0.08)] sm:rounded-2xl sm:p-6"
              >
                {/* Small card accent */}
                <div className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-sky-400 to-blue-700 transition-transform duration-300 group-hover:scale-y-100" />

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[11px] font-bold text-blue-700 transition-colors group-hover:bg-sky-100 sm:h-10 sm:w-10 sm:rounded-xl sm:text-xs">
                    {section.number}
                  </span>

                  <h2 className="text-sm font-semibold leading-5 text-slate-900 sm:text-base sm:leading-6">
                    {section.title}
                  </h2>
                </div>

                <p className="mt-2.5 text-xs leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                  {section.content}
                </p>
              </article>
            ))}
          </div>

          {/* Preview notice */}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:mt-5 sm:rounded-2xl sm:p-5">
            <p className="text-xs font-semibold text-amber-900 sm:text-sm">
              Current website status
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-800 sm:mt-2 sm:text-sm sm:leading-6">
              The Contact and Admission forms are frontend previews.
              They do not currently send or store entered values through
              an application backend. Update this policy when the actual
              data collection and storage processes are implemented.
            </p>
          </div>

          {/* Contact card */}
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:p-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Have privacy-related questions?
              </h2>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:mt-1 sm:text-sm sm:leading-6">
                Visit our contact page for general enquiries.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 sm:min-h-[44px] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              Contact Us ↗
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400 sm:mt-5 sm:text-xs">
            Last updated: 20 October 2026. This draft should be reviewed
            against actual data practices and applicable legal requirements
            before publication.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}