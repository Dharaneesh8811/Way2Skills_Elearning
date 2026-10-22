import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const learningAreas = [
  "Frontend development",
  "Backend fundamentals",
  "Database concepts",
  "Practical project work",
];

const benefits = [
  "Structured technical learning",
  "Hands-on development practice",
  "Project-based experience",
  "Internship opportunity, subject to eligibility",
];

const certificates = [
  "Course completion — Way2Skills",
  "Internship completion — Durozen Technologies",
  "Project completion — Durozen Technologies",
];

const applicationDetails = [
  "Confirm the approved course syllabus",
  "Check upcoming batch availability",
  "Understand admission requirements",
  "Ask about internship eligibility",
];

const cardStyle =
  "group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-sky-300 hover:shadow-[0_16px_35px_rgba(14,116,204,0.12)] before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px] before:origin-left before:scale-x-0 before:bg-sky-500 before:transition-transform before:duration-300 hover:before:scale-x-100 motion-reduce:transform-none motion-reduce:transition-none";

const labelStyle =
  "text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-blue-700";

export default function FullStackDevelopmentPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5FAFD] text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="px-4 pb-6 pt-20 sm:px-8 sm:pb-8 sm:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            Way2Skills Career Programme
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:mt-3 sm:text-4xl lg:text-5xl">
            Full Stack Development
          </h1>

          <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Learn development fundamentals, build practical projects,
            and strengthen your technical foundation through structured
            learning and hands-on practice.
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
            <Link
              href="#learning"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-blue-700 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 sm:w-auto sm:py-3 sm:text-sm"
            >
              Explore Curriculum
            </Link>

            <Link
              href="/contact"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-sky-200 bg-white px-6 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-sky-50 sm:w-auto sm:py-3 sm:text-sm"
            >
              Enquire Now ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Programme overview */}
      <section className="px-4 pb-8 sm:px-8 sm:pb-9">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
          <div className={`${cardStyle} p-3.5 sm:p-5 text-center`}>
            <p className="text-2xl font-bold text-blue-700 transition-colors duration-300 group-hover:text-sky-500 sm:text-3xl">
              04
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-800 sm:mt-2 sm:text-sm">
              Months Training
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
              Build your foundation
            </p>
          </div>

          <div className={`${cardStyle} p-3.5 sm:p-5 text-center`}>
            <p className="text-2xl font-bold text-blue-700 sm:text-3xl">02</p>
            <p className="mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">Months Internship*</p>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
              Gain practical experience
            </p>
          </div>

          <div className={`${cardStyle} col-span-2 p-3.5 sm:col-span-1 sm:p-5 text-center`}>
            <div className="flex h-7 items-center justify-center sm:h-9">
              <span className="text-lg font-bold text-blue-700 sm:text-2xl">
                Learn & Build
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">Career Programme</p>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
              Learn through practical work
            </p>
          </div>
        </div>

        <p className="mx-auto mt-3 max-w-5xl text-center text-[11px] leading-5 text-slate-500 sm:text-xs">
          *Internship is subject to eligibility and applicable programme terms.
        </p>
      </section>

      {/* Curriculum and benefits */}
      <section
        id="learning"
        className="border-y border-sky-100 bg-white/70 px-4 py-8 sm:px-8 sm:py-12"
      >
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 md:grid-cols-2">
          <div className={`${cardStyle} p-4 sm:p-7`}>
            <p className={labelStyle}>Curriculum Overview</p>

            <h2 className="mt-2 text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-blue-700 sm:mt-3 sm:text-xl">
              What You Will Learn
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Develop your technical knowledge through core development
              concepts and practical exercises.
            </p>

            <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-4">
              {learningAreas.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs sm:gap-3 sm:text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-blue-700 sm:h-6 sm:w-6 sm:text-sm">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-500 sm:mt-6 sm:pt-4 sm:text-xs">
              Contact Way2Skills for the approved syllabus and technologies
              covered in the programme.
            </p>
          </div>

          <div className={`${cardStyle} p-4 sm:p-7`}>
            <p className={labelStyle}>Programme Benefits</p>

            <h2 className="mt-2 text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-blue-700 sm:mt-3 sm:text-xl">
              Why This Programme?
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Focus on developing practical skills and building a stronger
              foundation for your technology career.
            </p>

            <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-4">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:gap-3 sm:text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs text-blue-700 sm:h-6 sm:w-6 sm:text-sm">
                    ✓
                  </span>
                  <span className="leading-5 sm:leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Certificates and application information */}
      <section className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 md:grid-cols-2">
          <div className={`${cardStyle} p-4 sm:p-7`}>
            <p className={labelStyle}>Certificates</p>

            <h2 className="mt-2 text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-blue-700 sm:mt-3 sm:text-xl">
              Certificates of Completion
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Certificates associated with successful completion of the
              relevant programme requirements.
            </p>

            <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-4">
              {certificates.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:gap-3 sm:text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs text-blue-700 sm:h-6 sm:w-6 sm:text-sm">
                    ✓
                  </span>
                  <span className="leading-5 sm:leading-6">{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-500 sm:mt-6 sm:pt-4 sm:text-xs">
              Subject to successful completion, evaluation, eligibility,
              and applicable programme requirements.
            </p>
          </div>

          <div className={`${cardStyle} p-4 sm:p-7`}>
            <p className={labelStyle}>Admission Information</p>

            <h2 className="mt-2 text-lg font-bold tracking-tight transition-colors duration-300 group-hover:text-blue-700 sm:mt-3 sm:text-xl">
              Before You Apply
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
              Get the information you need before deciding whether this
              programme is right for you.
            </p>

            <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-4">
              {applicationDetails.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:gap-3 sm:text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs text-blue-700 sm:h-6 sm:w-6 sm:text-sm">
                    ✓
                  </span>
                  <span className="leading-5 sm:leading-6">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 sm:mt-6 sm:px-5 sm:py-3 sm:text-sm"
            >
              Discuss With Our Team ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Enquiry section */}
      <section className="border-y border-sky-100 bg-[#E8F5FC] px-4 py-8 text-center sm:px-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <p className={labelStyle}>Need More Information?</p>

          <h2 className="mt-2 text-xl font-bold tracking-tight sm:mt-3 sm:text-3xl">
            Let&apos;s Talk About Your Learning Goals
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
            Reach out to our team for curriculum details, admission
            requirements, programme schedules, and internship eligibility.
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800 sm:mt-6 sm:py-3 sm:text-sm"
          >
            Contact Way2Skills ↗
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
