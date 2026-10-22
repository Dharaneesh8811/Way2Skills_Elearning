"use client";

import { useState, type MouseEvent } from "react";

export default function Testimonials() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - y) * 7,
      y: (x - 0.5) * 7,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <section
      id="student-stories"
      className="relative isolate overflow-hidden bg-[#EAF7FC] px-4 py-12 text-[#101820] sm:px-8 sm:py-20 lg:py-24"
    >
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-sky-300/35 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-blue-300/25 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Every journey has a story.
            <span className="mt-1 block text-sky-700 sm:mt-2">
              Yours starts here.
            </span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-xl text-xs leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            We look forward to sharing genuine experiences from the
            Way2Skills learning community.
          </p>
        </div>

        {/* Compact 3D review card */}
        <div className="mt-7 flex justify-center sm:mt-14">
          <article
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            className="w2s-review-single-card group relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_24px_65px_rgba(20,80,110,0.12)] backdrop-blur-xl sm:rounded-[28px] sm:p-9"
            style={{
              transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition:
                "transform 180ms ease-out, border-color 300ms ease, box-shadow 300ms ease",
            }}
          >
            {/* Animated top accent */}
            <div
              aria-hidden="true"
              className="w2s-card-accent absolute left-0 top-0 h-1 w-full"
            />

            {/* Decorative glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-sky-300/30 blur-[60px] transition-transform duration-500 group-hover:scale-125"
            />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-100 bg-gradient-to-br from-sky-100 to-white text-2xl font-bold text-sky-700 shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl sm:text-4xl">
                “
              </div>

              <span className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-sky-800 sm:px-3 sm:py-2">
                Learner Stories
              </span>
            </div>

            {/* Default placeholder content */}
            <div className="relative z-10 mt-4 sm:mt-7">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                Your story could be next.
              </h3>

              <p className="mt-2 max-w-lg text-xs leading-5 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
                We're preparing this space for genuine student feedback.
                Published reviews will appear here once learner experiences
                have been collected and approved.
              </p>
            </div>

            {/* Bottom profile-style row */}
            <div className="relative z-10 mt-5 flex items-center gap-3 border-t border-slate-100 pt-3.5 sm:mt-8 sm:gap-4 sm:pt-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-200 bg-gradient-to-br from-sky-100 to-blue-100 text-sm font-bold text-sky-800 shadow-sm sm:h-12 sm:w-12 sm:text-lg">
                W
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 sm:text-sm">
                  Way2Skills Community
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500 sm:mt-1 sm:text-xs">
                  Student feedback space
                </p>
              </div>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sm text-sky-700 transition-all duration-300 group-hover:translate-x-1 group-hover:border-sky-300 sm:h-10 sm:w-10 sm:text-lg">
                ↗
              </span>
            </div>
          </article>
        </div>

        {/* Footer caption */}
        <p className="mt-5 text-center text-xs tracking-wide text-slate-500 sm:mt-7">
          Learn · Create · Grow
        </p>
      </div>
    </section>
  );
}