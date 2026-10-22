"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
};

export default function PortalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const ctx = context;
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1200 : 2400;
    const particles: Particle[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Larger particles with varied sizes
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const ringRadius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * i;

      particles.push({
        x: Math.cos(angle) * ringRadius,
        y,
        z: Math.sin(angle) * ringRadius,
        size: 1.0 + Math.random() * 1.0,
      });
    }

    let width = 0;
    let height = 0;
    let frame = 0;
    let animationFrame = 0;
    let scrollY = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let lastTime = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.8;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseX = (touch.clientX / window.innerWidth - 0.5) * 0.8;
        mouseY = (touch.clientY / window.innerHeight - 0.5) * 0.5;
      }
    };

    const draw = (time: number) => {
      if (!width || !height) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      const delta = lastTime
        ? Math.min((time - lastTime) / 1000, 0.05)
        : 0;

      lastTime = time;

      if (!reducedMotion) {
        frame += delta * 0.16;
        smoothMouseX += (mouseX - smoothMouseX) * 0.035;
        smoothMouseY += (mouseY - smoothMouseY) * 0.035;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.56;
      const radius = Math.min(width * 0.68, height * 0.88, 720);

      const rotationY =
        frame + smoothMouseX + (reducedMotion ? 0 : scrollY * 0.0007);

      const rotationX = smoothMouseY * 0.45 - 0.12;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const projected: {
        x: number;
        y: number;
        z: number;
        size: number;
        alpha: number;
        hue: number;
      }[] = [];

      for (const particle of particles) {
        const rx = particle.x * cosY - particle.z * sinY;
        const rz = particle.x * sinY + particle.z * cosY;

        const ry = particle.y * cosX - rz * sinX;
        const depth = particle.y * sinX + rz * cosX;

        const perspective = 1.0 / (1.65 - depth * 0.35);
        const front = (depth + 1) / 2;

        projected.push({
          x: centerX + rx * radius * perspective,
          y: centerY + ry * radius * perspective,
          z: depth,

          // Bigger dots, with foreground particles appearing larger
          size: particle.size * (0.9 + perspective * 0.85),

          // Stronger visibility against the sky-blue background
          alpha: 0.3 + front * 0.7,

          // Electric blue transitioning to cyan
          hue: 198 + ((rx + 1) / 2) * 25,
        });
      }

      // Draw back particles first and front particles last
      projected.sort((a, b) => a.z - b.z);

      for (const p of projected) {
        const front = (p.z + 1) / 2;

        const saturation = 88 + front * 12;
        const lightness = 30 + front * 34;

        ctx.beginPath();

        ctx.fillStyle = `hsla(
          ${p.hue},
          ${saturation}%,
          ${lightness}%,
          ${p.alpha}
        )`;

        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}