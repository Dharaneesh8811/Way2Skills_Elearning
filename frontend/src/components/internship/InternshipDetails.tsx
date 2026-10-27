"use client";

import { useEffect, useMemo, useState } from "react";
import CourseCard from "@/components/courses/CourseCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { courseRequest, type Course } from "@/lib/coursesApi";

export default function InternshipDetails() {
  const [internships, setInternships] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All internships");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    courseRequest<Course[]>("/api/internships")
      .then((items) => {
        if (active) setInternships(items);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Internships could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All internships", ...new Set(internships.map((item) => item.category))],
    [internships]
  );
  const visibleInternships = useMemo(() => {
    const query = search.trim().toLowerCase();
    return internships.filter((internship) => {
      const matchesCategory =
        activeCategory === "All internships" || internship.category === activeCategory;
      const matchesSearch =
        !query ||
        [
          internship.title,
          internship.short_description,
          internship.full_description,
          internship.category,
          internship.duration,
        ].some((value) => value.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, internships, search]);

  return (
    <main className="w2s-internship-page min-h-screen overflow-x-clip text-[#101820]">
      <Navbar />
      <section
        id="programme-overview"
        className="w2s-course-section relative isolate overflow-hidden px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:pt-32"
      >
        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-800">
              Way2Skills Opportunities
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
              Internship Opportunities
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Explore currently published internship offerings and their listed
              details.
            </p>
          </header>

          {!loading && !error && (
            <div className="mt-7 flex flex-col gap-4 sm:mt-9 lg:flex-row lg:items-center lg:justify-between">
              <div
                aria-label="Filter internships by category"
                className="flex flex-wrap gap-2"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 ${
                      activeCategory === category
                        ? "border-blue-700 bg-blue-700 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="w-full lg:max-w-sm">
                <span className="sr-only">Search internships</span>
                <input
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search internships..."
                  type="search"
                  value={search}
                />
              </label>
            </div>
          )}

          {loading ? (
            <p className="mt-8 text-center text-sm text-slate-600" role="status">
              Loading internships…
            </p>
          ) : error ? (
            <p
              className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-800"
              role="alert"
            >
              Internship offerings are temporarily unavailable. {error}
            </p>
          ) : visibleInternships.length === 0 ? (
            <p className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
              {internships.length === 0
                ? "No published internship offerings are available right now."
                : "No internships match your search."}
            </p>
          ) : (
            <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {visibleInternships.map((internship) => (
                <CourseCard
                  course={internship}
                  index={internships.findIndex((item) => item.id === internship.id)}
                  key={internship.id}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
