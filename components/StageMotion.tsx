"use client";

import { useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Same scroll-in motion the homepage sections use, scoped to inner pages. */
export default function StageMotion() {
  useIso(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>(".subpage [data-reveal]").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 28 }, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none reverse" },
        });
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);
  return null;
}
