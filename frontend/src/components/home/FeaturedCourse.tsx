"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

const categories = [
  {
    icon: "</>",
    title: "Technology",
    description: "Technical skills",
  },
  {
    icon: "{ }",
    title: "Web Development",
    description: "Build for the web",
  },
  {
    icon: "↗",
    title: "Career Programmes",
    description: "Learn and practise",
  },
];

const filters = ["Featured", "Development", "Full Stack"];

const courses = [
  {
    id: "featured-fullstack",
    number: "01",
    title: "Full Stack Development Career Programme",
    category: "Flagship Programme",
    description:
      "Develop your technical foundation through structured training, hands-on practice, and practical development projects.",
    duration: "4 Months",
    internship: "2 Months",
  },
];

export default function FeaturedCourse() {
  const [activeFilter, setActiveFilter] = useState("Featured");
  const [tilts, setTilts] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const handleMouseMove = (
    event: MouseEvent<HTMLElement>,
    index: number,
  ) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTilts((previous) => ({
      ...previous,
      [index]: {
        x: (0.5 - y) * 9.4,
        y: (x - 0.5) * 8.7,
      },
    }));
  };

  const resetTilt = (index: number) => {
    setTilts((previous) => ({
      ...previous,
      [index]: { x: 0, y: 0 },
    }));
  };

  return (
    <section
      id="course"
      className="w2s-course-section relative isolate overflow-hidden px-4 py-12 text-slate-900 sm:px-8 sm:py-20 lg:py-24"
    >
      {/* Background lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 z-0 h-80 w-80 rounded-full bg-sky-300/20 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 z-0 h-80 w-80 rounded-full bg-blue-300/20 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Category heading */}
        <div className="text-center">
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#101820] sm:mt-6 sm:text-4xl lg:text-5xl">
            Explore Our Course
            <span className="block text-sky-700">Categories</span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-xl text-xs leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            Start with the skills you want to develop and move towards
            your career goals.
          </p>

          {/* Category cards */}
          <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 text-left [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:justify-center sm:gap-4 sm:px-0 sm:pb-4">
            {categories.map((category, index) => (
              <Link
                key={category.title}
                href="#featured-fullstack"
                className="w2s-category-card group flex min-w-[190px] shrink-0 items-center gap-3 rounded-xl border border-white/80 bg-white/55 p-3.5 shadow-[0_8px_25px_rgba(15,70,100,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-white/90 hover:shadow-[0_15px_35px_rgba(15,70,100,0.1)] sm:min-w-[220px] sm:gap-4 sm:rounded-2xl sm:p-4"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold transition-all duration-300 group-hover:scale-105 sm:h-12 sm:w-12 sm:text-sm ${
                    index === 2
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-sky-200 bg-sky-50 text-sky-800"
                  }`}
                >
                  {category.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-900 sm:text-sm">
                    {category.title}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
                    {category.description}
                  </span>
                </span>

                <span className="ml-auto text-base text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-sky-700 sm:text-lg">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured programme heading */}
        <div className="mt-10 flex flex-col gap-3 sm:mt-16 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-700 sm:text-xs">
              Featured Programme
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight text-[#101820] sm:mt-3 sm:text-3xl lg:text-4xl">
              Find your next opportunity.
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-6 text-slate-600 sm:mt-3 sm:text-sm sm:leading-7">
              Build practical skills through a structured learning programme.
            </p>
          </div>

          <span className="w-fit rounded-full border border-sky-200 bg-white/60 px-3.5 py-1.5 text-xs font-semibold text-sky-900 sm:px-4 sm:py-2">
            {courses.length} Available Programme
          </span>
        </div>

        {/* Filter buttons */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 min-h-[38px] sm:min-h-[44px] sm:px-5 sm:py-2.5 ${
                  isActive
                    ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-700/20"
                    : "border-white/80 bg-white/50 text-slate-600 hover:border-sky-300 hover:text-sky-800"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Compact 3D course card */}
        <div className="mt-6 grid grid-cols-1 justify-items-center gap-5 sm:mt-7 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const tilt = tilts[index] ?? { x: 0, y: 0 };

            return (
              <article
                key={course.id}
                id={course.id}
                onMouseMove={(event) => handleMouseMove(event, index)}
                onMouseLeave={() => resetTilt(index)}
                className="w2s-course-card w2s-course-blue group relative flex min-h-0 w-full max-w-[440px] flex-col overflow-hidden rounded-2xl border border-white/80 p-5 sm:min-h-[450px] sm:rounded-[30px] sm:p-7"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transition:
                    "transform 180ms ease-out, border-color 300ms ease, box-shadow 300ms ease",
                }}
              >
                {/* Glowing sphere */}
                <div
                  aria-hidden="true"
                  className="w2s-course-orb absolute -right-12 top-16 h-48 w-48 rounded-full"
                />

                {/* Orbit rings */}
                <div
                  aria-hidden="true"
                  className="w2s-course-ring absolute -right-5 top-24 h-40 w-40 rounded-full border"
                />

                <div
                  aria-hidden="true"
                  className="w2s-course-ring absolute right-4 top-32 h-28 w-28 rounded-full border"
                />

                {/* Card header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-white/55 sm:text-xs">
                    W2S / {course.number}
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-md sm:px-3.5 sm:py-2 sm:text-[10px]">
                    Featured
                  </span>
                </div>

                {/* Glass icon */}
                <div className="relative z-10 mt-3.5 flex h-16 items-center sm:mt-6 sm:h-24">
                  <div className="w2s-course-icon flex h-14 w-14 items-center justify-center rounded-2xl sm:h-20 sm:w-20 sm:rounded-[25px]">
                    <span className="text-2xl font-semibold text-white sm:text-3xl">
                      {"</>"}
                    </span>
                  </div>
                </div>

                {/* Course details */}
                <div className="relative z-10 mt-2 sm:mt-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300 sm:text-[10px]">
                    Career Programme
                  </span>

                  <h3 className="mt-1.5 max-w-[310px] text-lg font-bold leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-sky-300 sm:mt-3 sm:text-2xl">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/65 sm:mt-3 sm:text-sm sm:leading-6">
                    {course.description}
                  </p>
                </div>

                {/* Training and internship */}
                <div className="relative z-10 mt-3.5 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 sm:p-3">
                    <p className="text-[9px] uppercase tracking-wider text-white/45 sm:text-[10px]">
                      Training
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white sm:mt-1.5 sm:text-sm">
                      {course.duration}
                    </p>
                  </div>

                  <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.06] p-2.5 sm:p-3">
                    <p className="text-[9px] uppercase tracking-wider text-sky-200/65 sm:text-[10px]">
                      Internship
                    </p>
                    <p className="mt-1 text-xs font-semibold text-sky-200 sm:mt-1.5 sm:text-sm">
                      {course.internship} *
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5 sm:mt-auto sm:pt-5">
                  <Link
                    href="/courses/full-stack-development"
                    className="inline-flex min-h-[38px] items-center gap-1.5 text-xs font-semibold text-sky-300 transition-colors duration-300 hover:text-white sm:text-sm"
                  >
                    View Programme
                    <span aria-hidden="true">↗</span>
                  </Link>

                  <Link
                    href="/admissions"
                    className="w2s-course-view inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white sm:px-4 sm:py-2.5"
                  >
                    Apply Now
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                {/* Animated bottom accent */}
                <div
                  aria-hidden="true"
                  className="w2s-course-accent absolute bottom-0 left-0 h-1 w-full"
                />
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500 sm:mt-7 sm:leading-6">
          * Internship participation is subject to eligibility and applicable
          programme terms.
        </p>
      </div>
    </section>
  );
}