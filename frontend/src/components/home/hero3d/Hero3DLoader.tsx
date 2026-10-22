"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

/**
 * Lightweight, CSS-only placeholder shown while the 3D bundle downloads
 * (and kept as the permanent fallback if WebGL is unavailable).
 */
function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative aspect-square w-[62%] max-w-[420px]">
        <div className="absolute inset-0 rounded-full bg-sky-300/25 blur-2xl motion-safe:animate-pulse" />
        <div className="absolute inset-[8%] rounded-full border border-sky-400/50 bg-gradient-to-br from-sky-200/40 to-cyan-300/10" />
        <div className="absolute inset-[22%] rounded-full border border-cyan-300/40" />
        <div className="absolute bottom-[6%] left-1/2 h-4 w-[55%] -translate-x-1/2 rounded-full bg-slate-900/30 blur-md" />
      </div>
    </div>
  );
}

// Loaded only in the browser, so Three.js never runs during SSR.
const Hero3DScene = dynamic(() => import("./Hero3DScene"), {
  ssr: false,
});

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero3DLoader({ className = "" }: { className?: string }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setShouldMount(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapper}
      aria-hidden="true"
      className={`pointer-events-none relative h-full w-full ${className}`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <SceneFallback />
      </div>
      {shouldMount && webgl && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <Hero3DScene active={inView} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
