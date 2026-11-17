"use client";
import { useEffect, useRef } from "react";

/** Slow spiral, the same idea as the homepage particle field, drawn behind inner-page heroes. */
export default function HeroParticles({ night = false }: { night?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const count = 900;
    const dots = Array.from({ length: count }, (_, i) => {
      const arm = i % 3;
      const r = 0.08 + Math.pow((i % 300) / 300, 0.75) * 0.92;
      const theta = arm * ((Math.PI * 2) / 3) + r * 7 + (i % 17) * 0.02;
      return { r, theta, size: i % 5 === 0 ? 1.6 : 1 };
    });
    let frame = 0;
    let spin = 0;
    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.48;
      ctx.fillStyle = night ? "rgba(255,255,255,0.72)" : "rgba(22,21,20,0.45)";
      for (const dot of dots) {
        const a = dot.theta + spin;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * dot.r * scale, cy + Math.sin(a) * dot.r * scale * 0.72, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const tick = () => {
      spin += 0.0016;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const observer = new ResizeObserver(() => draw());
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    draw();
    if (!reduce) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [night]);

  return <canvas ref={ref} className="hero-particles" aria-hidden="true" />;
}
