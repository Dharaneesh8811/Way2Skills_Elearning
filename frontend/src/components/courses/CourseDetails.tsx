"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, BookOpen, Check } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import CourseImage from "@/components/courses/CourseImage";
import { courseRequest, type Course } from "@/lib/coursesApi";

type CourseDetailsProps = {
  slug: string;
};

export default function CourseDetails({ slug }: CourseDetailsProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const benefits = course?.benefits
    ?.split(/\r?\n/)
    .map((benefit) => benefit.trim())
    .filter(Boolean);
  const curriculumOverview = course?.curriculum?.trim()
    ? course.curriculum
    : course?.syllabus.join("\n") ?? "";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    courseRequest<Course>(`/api/courses/${encodeURIComponent(slug)}`)
      .then((record) => {
        if (active) setCourse(record);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Course details could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F5FAFD] text-slate-900">
      <Navbar />
      <section className="px-4 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          {loading ? (
            <p className="text-center text-sm text-slate-600" role="status">
              Loading course details…
            </p>
          ) : error || !course ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
              <p className="text-sm text-amber-950" role="alert">
                {error ?? "This course is not currently available."}
              </p>
              <Link
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                href="/"
              >
                Back to homepage
              </Link>
            </div>
          ) : (
            <>
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-sky-800">
                {course.category} · {course.course_type}
              </p>
              <h1 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-5xl">
                {course.title}
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-7 text-slate-700">
                {course.full_description}
              </p>
              <CourseImage
                alt={`${course.title} course`}
                className="mx-auto mt-8 aspect-[16/9] w-full max-w-3xl rounded-2xl object-cover shadow-sm"
                fallback={
                  <div
                    aria-hidden="true"
                    className="mx-auto mt-8 flex aspect-[16/9] w-full max-w-3xl items-center justify-center rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-100 via-white to-blue-100 text-sky-700"
                  >
                    <BookOpen aria-hidden="true" size={40} />
                  </div>
                }
                src={course.image_url}
              />
              <dl className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Duration", course.duration],
                  ["Level", course.level],
                  ["Delivery", course.delivery_mode],
                  ["Category", course.category],
                ].map(([label, value]) => (
                  <div
                    className="rounded-xl border border-sky-100 bg-white p-4"
                    key={label}
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
              {curriculumOverview.trim() && (
                <section className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_12px_28px_rgba(15,40,80,0.08)] sm:p-7">
                  <h2 className="text-xl font-bold">Curriculum Overview</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                    {curriculumOverview}
                  </p>
                </section>
              )}
              {(benefits && benefits.length > 0 ||
                course.certificates.length > 0) && (
                <div
                  className={`mt-6 grid min-w-0 grid-cols-1 gap-6 ${
                    benefits && benefits.length > 0 &&
                    course.certificates.length > 0
                      ? "md:grid-cols-2"
                      : ""
                  }`}
                >
                  {benefits && benefits.length > 0 && (
                    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_12px_28px_rgba(15,40,80,0.08)] sm:p-7">
                      <h2 className="text-xl font-bold">
                        Course / Internship / Program Benefits
                      </h2>
                      <ul className="mt-4 space-y-3">
                        {benefits.map((benefit, index) => (
                          <li
                            className="flex min-w-0 gap-3 text-sm leading-6 text-slate-700"
                            key={`${index}-${benefit}`}
                          >
                            <Check
                              aria-hidden="true"
                              className="mt-1 shrink-0 text-emerald-700"
                              size={16}
                            />
                            <span className="min-w-0 break-words">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {course.certificates.length > 0 && (
                    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_12px_28px_rgba(15,40,80,0.08)] sm:p-7">
                      <h2 className="text-xl font-bold">Certificates</h2>
                      <ul className="mt-4 grid min-w-0 gap-3">
                        {course.certificates.map((certificate) => (
                          <li
                            className="flex min-w-0 items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/60 p-3 text-sm font-medium leading-6 text-slate-700"
                            key={certificate}
                          >
                            <Award
                              aria-hidden="true"
                              className="mt-0.5 shrink-0 text-sky-700"
                              size={18}
                            />
                            <span className="min-w-0 break-words">
                              {certificate}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {course.course_type === "internship" ? (
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    href="/contact"
                  >
                    Enquire about this internship
                  </Link>
                ) : (
                  <Link
                    className="inline-flex min-h-11 items-center rounded-full bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    href={`/admissions?course=${encodeURIComponent(course.slug)}`}
                  >
                    Enquire about this programme
                  </Link>
                )}
                <Link
                  className="inline-flex min-h-11 items-center rounded-full border border-sky-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-sky-50"
                  href="/"
                >
                  Explore more
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
