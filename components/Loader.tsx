"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene } from "@/lib/scene";
import { getLenis } from "@/lib/lenis";
import { brand, stepLinks } from "@/lib/content";
import { TabularDigits } from "./TabularDigits";

const WORD = brand.name.split("");

/** Full-screen curtain: wordmark reveal, step sequence, then a count to 100. */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = root.querySelectorAll<HTMLElement>(".ld-letter i");
    const digits = root.querySelectorAll<HTMLElement>(".ld-num .type-digit");
    const bar = root.querySelector<HTMLElement>(".ld-bar i");
    const steps = root.querySelectorAll<HTMLElement>(".ld-step");
    const state = { p: 0 };

    const paint = (p: number) => {
      const n = Math.min(100, Math.round(p));
      const count = String(n).padStart(3, "0");
      digits.forEach((digit, index) => { digit.textContent = count[index]; });
      if (bar) bar.style.transform = `scaleX(${n / 100})`;
      const on = Math.min(steps.length, Math.ceil((n / 100) * steps.length));
      steps.forEach((step, i) => step.classList.toggle("on", i < on));
    };

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.fromTo(letters, { yPercent: 120 }, { yPercent: 0, duration: 1.05, stagger: 0.045, ease: "power4.out" });
      } else {
        gsap.set(letters, { yPercent: 0 });
      }
    }, root);

    const climb = gsap.to(state, {
      p: 86,
      duration: reduce ? 0.2 : 1.7,
      ease: "power2.out",
      onUpdate: () => paint(state.p),
    });

    let done = false;
    const t0 = performance.now();
    const fonts = document.fonts?.ready ?? Promise.resolve();
    let fontsOk = false;
    fonts.then(() => { fontsOk = true; });

    const finish = () => {
      if (done) return;
      done = true;
      climb.kill();
      gsap.to(state, {
        p: 100,
        duration: reduce ? 0.05 : 0.45,
        ease: "power3.out",
        onUpdate: () => paint(state.p),
        onComplete: () => {
          window.dispatchEvent(new Event("thop:ready"));
          const leave = gsap.timeline({
            onComplete: () => {
              root.style.display = "none";
              getLenis()?.start();
            },
          });
          if (!reduce) {
            leave.to(letters, { yPercent: -120, duration: 0.55, stagger: 0.03, ease: "power3.in" }, 0.12);
          }
          leave.to(root, {
            yPercent: -100,
            duration: reduce ? 0.01 : 1.05,
            ease: "power4.inOut",
            onStart: () => {
              gsap.to(scene, { intro: 1, duration: 1.6, ease: "expo.out" });
              window.dispatchEvent(new Event("thop:intro"));
            },
          }, reduce ? 0 : 0.28);
        },
      });
    };

    const tick = () => {
      if (done) return;
      const elapsed = performance.now() - t0;
      const minTime = elapsed > (reduce ? 200 : 1700);
      const timeout = elapsed > 15000;
      if ((scene.ready && fontsOk && minTime) || timeout) { finish(); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { done = true; climb.kill(); ctx.revert(); };
  }, []);

  return (
    <div id="loader" ref={ref} role="status" aria-live="polite" aria-label="Loading BIOVITY">
      <div className="ld-top">
        <span>{brand.tagline}</span>
        <span>MUMBAI</span>
      </div>
      <p className="ld-word" aria-hidden>
        {WORD.map((ch, i) => (
          <span className="ld-letter" key={i}><i>{ch}</i></span>
        ))}
      </p>
      <ol className="ld-steps">
        {stepLinks.map((step) => (
          <li className="ld-step" key={step.href}>{step.label}</li>
        ))}
      </ol>
      <div className="ld-foot">
        <span className="ld-protocol">{brand.protocolLong}</span>
        <span className="ld-num"><TabularDigits value="000" /></span>
      </div>
      <div className="ld-bar" aria-hidden><i /></div>
    </div>
  );
}
