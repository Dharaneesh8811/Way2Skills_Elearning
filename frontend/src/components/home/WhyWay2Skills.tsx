"use client";

import { useState, type MouseEvent, type ReactNode } from "react";

const features = [
  {
    number: "01",
    symbol: "✳",
    tag: "BUILD",
    title: "Practical Learning",
    description: "Learn through hands-on exercises and development tasks.",
  },
  {
    number: "02",
    symbol: "</>",
    tag: "CREATE",
    title: "Project-Based Learning",
    description: "Apply your knowledge by building practical projects.",
  },
  {
    number: "03",
    symbol: "↗",
    tag: "GROW",
    title: "Career Preparation",
    description:
      "Strengthen your technical foundation for future opportunities.",
  },
  {
    number: "04",
    symbol: "✦",
    tag: "SUPPORT",
    title: "Learning Support",
    description: "Follow a structured learning path with clear goals.",
  },
];

function TiltCard({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !window.matchMedia("(hover: hover)").matches
    ) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setRotation({
      x: (0.5 - y) * 7,
      y: (x - 0.5) * 7,
    });
  };

  const resetTilt = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className={`w2s-tilt-card ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition:
          "transform 180ms ease-out, border-color 300ms ease, box-shadow 300ms ease",
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function WhyWay2Skills() {
  return (
    <section
      id="about"
      className="w2s-why-section relative isolate overflow-hidden px-4 py-10 text-[#101820] sm:px-8 sm:py-16 lg:py-20"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-72 w-72 rounded-full bg-sky-300/30 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-72 w-72 rounded-full bg-blue-300/25 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Learn with purpose.
            <span className="block text-sky-700">
              Build with confidence.
            </span>
          </h2>

          <p className="mx-auto mt-2.5 max-w-xl text-xs leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            A structured way to learn, practise, and develop your technical
            skills through practical work.
          </p>
        </div>

        {/* Responsive Compact Cards */}
        <div className="mt-7 grid items-stretch gap-3.5 sm:mt-9 sm:grid-cols-2 sm:gap-5 lg:mt-12 lg:grid-cols-4">
          {features.map((feature, index) => (
            <TiltCard
              key={feature.number}
              delay={index * 100}
              className="h-full"
            >
              <article className="w2s-3d-surface w2s-feature-card group relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border p-4 sm:min-h-[285px] sm:rounded-3xl sm:p-6">
                {/* Consistent glow on every card */}
                <div
                  aria-hidden="true"
                  className="w2s-feature-glow pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-300/35 blur-[45px] transition-transform duration-500 group-hover:scale-150"
                />

                {/* Subtle orbit rings */}
                <div
                  aria-hidden="true"
                  className="w2s-feature-orbit absolute -right-7 top-12 h-28 w-28 rounded-full border border-sky-200/70"
                />

                <div
                  aria-hidden="true"
                  className="w2s-feature-orbit absolute -right-1 top-[68px] h-20 w-20 rounded-full border border-sky-200/50"
                />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 sm:text-xs">
                    / {feature.number}
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                    WAY2SKILLS
                  </span>
                </div>

                {/* Compact icon on mobile */}
                <div className="relative z-10 mt-3 flex h-12 items-center sm:mt-5 sm:h-[68px]">
                  <div className="w2s-feature-icon flex h-11 w-11 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl">
                    <span className="w2s-feature-symbol text-xl font-semibold text-sky-800 sm:text-2xl">
                      {feature.symbol}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w2s-depth relative z-10 mt-auto pt-3 sm:pt-5">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sky-700">
                    {feature.tag}
                  </span>

                  <h3 className="mt-1 text-sm font-bold leading-snug tracking-tight text-[#101820] sm:mt-2 sm:text-[17px]">
                    {feature.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:mt-2 sm:text-[13px] sm:leading-6">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent row */}
                <div className="w2s-depth relative z-10 mt-3 flex items-center justify-between border-t border-slate-200 pt-2.5 sm:mt-4 sm:pt-3">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Learn / {feature.number}
                  </span>

                  <span className="w2s-feature-arrow flex h-6 w-6 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-xs text-sky-800 transition-all duration-300 group-hover:translate-x-1 group-hover:border-sky-600 group-hover:bg-sky-600 group-hover:text-white sm:h-7 sm:w-7 sm:text-sm">
                    ↗
                  </span>
                </div>

                {/* Hover accent */}
                <div
                  aria-hidden="true"
                  className="w2s-feature-accent absolute bottom-0 left-0 h-1 w-full"
                />
              </article>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}