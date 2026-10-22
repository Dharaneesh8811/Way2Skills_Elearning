import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const terms = [
  {
    number: "01",
    title: "About Our Website",
    content:
      "Way2Skills provides information about technical training programmes, learning resources, and related opportunities. Website content is provided for informational and preview purposes.",
  },
  {
    number: "02",
    title: "Using This Website",
    content:
      "You agree to use this website lawfully and respect intellectual property, security, and the availability of the platform for all users.",
  },
  {
    number: "03",
    title: "Programme Information and Enquiries",
    content:
      "Submitting an enquiry expresses your interest in a programme. It does not create an admission offer or guarantee a training seat.",
  },
  {
    number: "04",
    title: "Admissions and Eligibility",
    content:
      "Participation in our training programmes depends on meeting the published eligibility criteria and applicable admission terms.",
  },
  {
    number: "05",
    title: "Internship Participation",
    content:
      "Internship opportunities are linked to eligible training programmes and require meeting the relevant criteria and performance standards.",
  },
  {
    number: "06",
    title: "Fees and Payments",
    content:
      "Programme fees, payment schedules, and any applicable refund policies will be communicated through official admission channels.",
  },
  {
    number: "07",
    title: "Intellectual Property",
    content:
      "All learning materials, curriculum documents, website content, trademarks, and branding belong to Way2Skills or their respective licensors.",
  },
  {
    number: "08",
    title: "User Conduct and Submissions",
    content:
      "When using our forms or communicating with our team, you agree to provide accurate information and refrain from submitting harmful content.",
  },
  {
    number: "09",
    title: "Disclaimer of Warranties",
    content:
      "We provide website information in good faith, but we cannot guarantee that the site will always be uninterrupted or completely free of errors.",
  },
  {
    number: "10",
    title: "External Links and Services",
    content:
      "The website may link to third-party websites or services. Their content, availability, security, and privacy practices are managed by those providers. Review their applicable terms and privacy policies before using them.",
  },
  {
    number: "11",
    title: "Website Availability and Liability",
    content:
      "We aim to keep website information available and accurate, but uninterrupted access and error-free content cannot be guaranteed. Nothing in these terms excludes or limits any liability or rights that cannot lawfully be excluded or limited under applicable law.",
  },
  {
    number: "12",
    title: "Changes to These Terms",
    content:
      "These Terms and Conditions may be revised when website features, programmes, or applicable requirements change. The updated version and revision date should be published on this page.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F3F6FA] text-slate-800">
      <Navbar />

      <section className="px-4 pb-10 pt-20 sm:px-8 sm:pb-16 sm:pt-28">
        <div className="mx-auto max-w-5xl">
          {/* Centered page heading */}
          <div className="mb-6 text-center sm:mb-7">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Terms and Conditions
            </h1>

            <div className="mx-auto mt-2.5 h-1 w-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 sm:mt-3 sm:w-14" />

            <p className="mx-auto mt-2.5 max-w-xl text-xs leading-5 text-slate-500 sm:mt-3 sm:text-sm sm:leading-6">
              Please review the terms that apply when using the
              Way2Skills website and exploring our programmes.
            </p>

            <p className="mt-2 text-[11px] text-slate-400 sm:mt-3 sm:text-xs">
              Published for information and website preview.
            </p>
          </div>

          {/* Terms cards */}
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {terms.map((item) => (
              <article
                key={item.number}
                className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_5px_20px_rgba(15,40,80,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_12px_28px_rgba(15,40,80,0.08)] sm:rounded-2xl sm:p-6"
              >
                {/* Small card accent */}
                <div className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-sky-400 to-blue-700 transition-transform duration-300 group-hover:scale-y-100" />

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[11px] font-bold text-blue-700 transition-colors group-hover:bg-sky-100 sm:h-10 sm:w-10 sm:rounded-xl sm:text-xs">
                    {item.number}
                  </span>

                  <h2 className="text-sm font-semibold leading-5 text-slate-900 sm:text-base sm:leading-6">
                    {item.title}
                  </h2>
                </div>

                <p className="mt-2.5 text-xs leading-6 text-slate-600 sm:mt-4 sm:text-sm sm:leading-7">
                  {item.content}
                </p>
              </article>
            ))}
          </div>

          {/* Contact card */}
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:p-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                Have questions about our terms?
              </h2>
              <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:mt-1 sm:text-sm sm:leading-6">
                Contact our team for clarification on any of the terms outlined above.
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
            against actual operations and applicable legal requirements
            before publication.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}