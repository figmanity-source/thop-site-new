"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { brand } from "@/lib/content";
import { Split } from "./Split";

const EVT = "thop:transition";

/** Page transition used by every nav/CTA jump (same gradient sweep + wordmark as the original overlay). */
export function scrollToTarget(target: string) {
  window.dispatchEvent(new CustomEvent(EVT, { detail: target }));
}

export default function TransitionOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  useEffect(() => {
    const el = ref.current!;
    gsap.set(el, { display: "none", y: 0 });
    const onGo = (e: Event) => {
      const target = (e as CustomEvent<string>).detail;
      const dest = document.querySelector<HTMLElement>(target);
      const lenis = getLenis();
      if (!dest || !lenis || busy.current) return;
      busy.current = true;
      const chars = el.querySelectorAll(".st-char");
      gsap.timeline({ onComplete: () => { busy.current = false; gsap.set(el, { display: "none", y: 0 }); } })
        .set(el, { display: "flex", y: 0 })
        .set(chars, { yPercent: 105 })
        .to(el, { y: () => -2 * window.innerHeight, duration: 0.9, ease: "power3.in" })
        .to(chars, { yPercent: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 }, "-=0.35")
        .add(() => { lenis.scrollTo(dest, { immediate: true, force: true }); })
        .to(chars, { yPercent: -105, duration: 0.5, ease: "power2.in", stagger: 0.03 }, "+=0.15")
        .to(el, { y: () => -4 * window.innerHeight, duration: 0.9, ease: "power3.out" }, "-=0.2");
    };
    window.addEventListener(EVT, onGo);
    return () => window.removeEventListener(EVT, onGo);
  }, []);
  return (
    <div id="transition-overlay" ref={ref} aria-hidden>
      <p>
        <Split text={brand.name} wrap />
      </p>
    </div>
  );
}
