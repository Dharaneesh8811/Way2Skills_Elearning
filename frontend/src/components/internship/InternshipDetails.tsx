"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const categories = [
  "All Courses",
  "Full Stack",
  "Frontend",
  "Backend",
  "UI/UX Design",
];

const courses = [
  {
    id: "full-stack",
    number: "01",
    title: "Full Stack Development",
    category: "Career Programme",
    courseType: "Full Stack",
    description:
      "Develop your technical skills through structured learning, hands-on practice, and practical development projects.",
    duration: "4 Months",
    internship: "2 Months",
    symbol: "</>",
  },
];

export default function InternshipDetails() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [tilts, setTilts] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "All Courses" ||
        course.courseType === activeCategory;

      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.courseType.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

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
        x: (0.5 - y) * 7,
        y: (x - 0.5) * 7,
      },
    }));
  };

  const resetTilt = (index: number) => {
    setTilts((previous) => ({
      ...previous,
      [index]: { x: 0, y: 0 },
    }));
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Courses");
  };

  return (
    <main className="w2s-internship-page min-h-screen overflow-x-clip text-[#101820]">
      <Navbar />

      {/* Programme catalogue */}
      <section
        id="programme-overview"
        className="w2s-course-section relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-8 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24"
      >
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Heading */}
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-700 sm:text-xs">
              Find Your Direction
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:mt-3 sm:text-3xl lg:text-4xl">
              Explore Our Programmes
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
              Choose a course to explore its learning path, training
              duration, and programme details.
            </p>
          </div>

          {/* Filters on left + Search on right */}
          <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left side: Category filters */}
            <div
              aria-label="Filter programmes by category"
              className="flex flex-wrap gap-2"
            >
              {categories.map((category) => {
                const active = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-[38px] sm:min-h-[44px] inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 sm:px-4 sm:py-2 sm:text-sm ${
                      active
                        ? "border-blue-700 bg-blue-700 text-white shadow-md shadow-blue-700/20"
                        : "border-white/80 bg-white/60 text-slate-600 hover:border-sky-300 hover:bg-white hover:text-sky-800"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Right side: Search bar */}
            <div className="w-full shrink-0 lg:w-[320px] xl:w-[360px]">
              <label htmlFor="internship-search" className="sr-only">
                Search programmes
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white bg-white/80 px-4 py-2.5 shadow-[0_8px_28px_rgba(15,70,100,0.06)] backdrop-blur-md transition-all focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-200/60 sm:rounded-2xl sm:px-5 sm:py-3.5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 shrink-0 text-sky-700 sm:h-5 sm:w-5"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.2 4.2" />
                </svg>

                <input
                  id="internship-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search programmes..."
                  className="w-full min-w-0 bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="text-xs text-slate-400 transition-colors hover:text-red-500 sm:text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results heading */}
          <div className="mt-7 flex items-end justify-between gap-4 border-b border-sky-200/70 pb-3 sm:mt-10 sm:pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-700">
                Programme Catalogue
              </p>

              <h3 className="mt-1 text-lg font-bold tracking-tight sm:mt-2 sm:text-2xl">
                Available Courses
              </h3>
            </div>

            <span className="shrink-0 rounded-full border border-sky-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-sky-900 sm:py-2">
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "Programme" : "Programmes"}
            </span>
          </div>

          {/* Course cards */}
          {filteredCourses.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 justify-items-center gap-5 sm:mt-7 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course, index) => {
                const tilt = tilts[index] ?? { x: 0, y: 0 };

                return (
                  <article
                    key={course.id}
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
                        {course.category}
                      </span>
                    </div>

                    {/* Glass icon */}
                    <div className="relative z-10 mt-3.5 flex h-16 items-center sm:mt-6 sm:h-24">
                      <div className="w2s-course-icon flex h-14 w-14 items-center justify-center rounded-2xl sm:h-20 sm:w-20 sm:rounded-[25px]">
                        <span className="text-2xl font-semibold text-white sm:text-3xl">
                          {course.symbol}
                        </span>
                      </div>
                    </div>

                    {/* Course details */}
                    <div className="relative z-10 mt-2 sm:mt-3">
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-300 sm:text-[10px]">
                        Career Programme
                      </p>

                      <h3 className="mt-1.5 text-lg font-bold leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-sky-300 sm:mt-3 sm:text-2xl">
                        {course.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-white/65 sm:mt-3 sm:text-sm sm:leading-7">
                        {course.description}
                      </p>
                    </div>

                    {/* Duration information */}
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

                    {/* Card footer */}
                    <div className="relative z-10 mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5 sm:mt-auto sm:pt-5">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/45 sm:text-[10px]">
                        Learn · Build · Grow
                      </span>

                      <Link
                        href="/courses/full-stack-development"
                        className="w2s-course-view inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white sm:min-h-[44px] sm:px-4 sm:py-2.5"
                      >
                        View Programme
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
          ) : (
            <div className="mt-8 rounded-2xl border border-white bg-white/75 px-4 py-8 text-center shadow-[0_12px_35px_rgba(15,70,100,0.05)] sm:rounded-3xl sm:px-5 sm:py-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-xl text-sky-800 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">
                ⌕
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 sm:mt-4 sm:text-lg">
                No programmes found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Try another search or choose a different category.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 sm:min-h-[44px] sm:px-5 sm:py-2.5 sm:text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-xs leading-5 text-slate-500 sm:mt-7 sm:leading-6">
            * Internship participation is subject to eligibility and applicable
            programme terms.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}