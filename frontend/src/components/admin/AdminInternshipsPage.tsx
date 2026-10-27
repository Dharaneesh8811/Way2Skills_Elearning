"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { useAdminAuth, useAdminPage } from "@/components/admin/AdminAuth";
import { courseRequest, type CoursePage } from "@/lib/coursesApi";

export default function AdminInternshipsPage() {
  const { token } = useAdminAuth();
  useAdminPage("/admin/internships", "Internship");
  const [page, setPage] = useState<CoursePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    courseRequest<CoursePage>(
      "/api/admin/courses?limit=100&course_type=internship",
      token
    )
      .then((result) => {
        if (active) setPage(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Internship records could not be loaded."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Internship offerings
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Internship-type records from the existing course catalogue.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          href="/admin/courses"
        >
          Manage offerings <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>

      {loading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600" role="status">
          Loading internship records…
        </p>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
          Internship information is unavailable. {error}
        </p>
      ) : page?.items.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {page.items.map((internship) => (
            <article
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
              key={internship.id}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-800">
                  <BriefcaseBusiness aria-hidden="true" size={19} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-950">{internship.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {internship.category} · {internship.duration}
                  </p>
                </div>
                <span
                  className={`ml-auto shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    internship.is_published
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {internship.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-700">
                {internship.short_description}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Level</dt>
                  <dd className="mt-1 font-medium text-slate-800">{internship.level}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Delivery</dt>
                  <dd className="mt-1 font-medium text-slate-800">{internship.delivery_mode}</dd>
                </div>
              </dl>
              {internship.syllabus.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Listed learning outcomes
                  </h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
                    {internship.syllabus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="font-semibold text-slate-900">No internship records</h3>
          <p className="mt-1 text-sm text-slate-600">
            There are no internship-type offerings in the database yet. No sample records are shown.
          </p>
          <Link
            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            href="/admin/courses"
          >
            Create an internship offering <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
