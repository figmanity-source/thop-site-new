"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scene } from "@/lib/scene";
import { getLenis } from "@/lib/lenis";
import { brand, stepLinks } from "@/lib/content";
import { TabularDigits } from "./TabularDigits";

const WORD = brand.name.split("");
const CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"];

/** Full-screen curtain: wordmark reveal, step sequence, then a count to 100. */
export default function Loader({ cinematic = false }: { cinematic?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = root.querySelectorAll<HTMLElement>(".ld-letter i");
    const digits = root.querySelectorAll<HTMLElement>(".ld-num .type-digit");
    const bar = root.querySelector<HTMLElement>(".ld-bar i");
    const steps = root.querySelectorAll<HTMLElement>(".ld-step");
    const markers = root.querySelectorAll<HTMLElement>(".ld-marker");
    const frame = root.querySelector(".ld-frame");
    const lockup = root.querySelector(".ld-lockup");
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
      if (reduce) return;
      const enter = gsap.timeline();
      if (cinematic) {
        enter.from(markers, {
          x: (index) => (index % 2 ? 1 : -1) * Math.min(120, window.innerWidth * .12),
          y: (index) => (index < 2 ? -1 : 1) * Math.min(90, window.innerHeight * .12),
          opacity: 0, rotation: 45, duration: .85, ease: "power3.inOut",
        }, 0);
        if (frame) enter.from(frame, { clipPath: "inset(0 100% 0 0)", duration: .65, ease: "power3.inOut" }, .48);
      }
      enter.fromTo(letters, { yPercent: 115 }, {
        yPercent: 0, duration: cinematic ? .65 : 1.05, stagger: .045, ease: "power4.out",
      }, cinematic ? .55 : 0);
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

    let progressTween: gsap.core.Tween | undefined;
    let introTween: gsap.core.Tween | undefined;
    let exit: gsap.core.Timeline | undefined;
    let frameId = 0;
    const finish = () => {
      if (done) return;
      done = true;
      climb.kill();
      progressTween = gsap.to(state, {
        p: 100,
        duration: reduce ? 0.05 : 0.45,
        ease: "power3.out",
        onUpdate: () => paint(state.p),
        onComplete: () => {
          window.dispatchEvent(new Event("thop:ready"));
          const leave = exit = gsap.timeline({
            onComplete: () => {
              root.style.display = "none";
              getLenis()?.start();
            },
          });
          const revealPage = () => {
            introTween = gsap.to(scene, { intro: 1, duration: reduce ? 0 : 1.3, ease: "expo.out" });
            window.dispatchEvent(new Event("thop:intro"));
          };
          if (cinematic && !reduce && lockup) {
            leave.to(lockup, { scale: 1.8, autoAlpha: 0, duration: .75, ease: "power3.inOut" }, 0);
            leave.to(root, { autoAlpha: 0, duration: .55, ease: "power2.inOut", onStart: revealPage }, .2);
          } else {
            if (!reduce) {
              leave.to(letters, { yPercent: -120, duration: 0.55, stagger: 0.03, ease: "power3.in" }, 0.12);
            }
            leave.to(root, {
              yPercent: reduce ? 0 : -100,
              autoAlpha: 0,
              duration: reduce ? .01 : 1.05,
              ease: "power4.inOut",
              onStart: revealPage,
            }, reduce ? 0 : .28);
          }
        },
      });
    };

    const tick = () => {
      if (done) return;
      const elapsed = performance.now() - t0;
      const minTime = elapsed > (reduce ? 200 : 1700);
      const timeout = elapsed > (cinematic ? (reduce ? 1200 : 4800) : 15000);
      if ((scene.ready && fontsOk && minTime) || timeout) { finish(); return; }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => {
      done = true;
      cancelAnimationFrame(frameId);
      climb.kill();
      progressTween?.kill();
      introTween?.kill();
      exit?.kill();
      ctx.revert();
    };
  }, [cinematic]);

  const wordmark = (
    <p className="ld-word" aria-hidden="true">
      {WORD.map((ch, i) => (
        <span className="ld-letter" key={i}><i>{ch}</i></span>
      ))}
    </p>
  );

  return (
    <div id="loader" ref={ref} role="status" aria-live="polite" aria-label="Loading BIOVITY">
      <div className="ld-top">
        <span>{brand.tagline}</span>
        <span>MUMBAI</span>
      </div>
      {cinematic ? (
        <div className="ld-lockup" aria-hidden="true">
          <div className="ld-frame" />
          {CORNERS.map((corner) => <span className={`ld-marker ld-marker-${corner}`} key={corner} />)}
          {wordmark}
        </div>
      ) : wordmark}
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
