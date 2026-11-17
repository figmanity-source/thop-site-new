"use client";
import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Runs GSAP setup scoped to a section element and reverts it on unmount. */
export function useFx<T extends HTMLElement>(ref: RefObject<T | null>, fn: (el: T) => void | (() => void)) {
  useIso(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => { cleanup = fn(el); }, el);
    return () => { cleanup?.(); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Shows a `position: fixed` layer only while its section is pinned on screen (original behaviour). */
export function pinLayer(section: Element, layer: Element | null, display = "block", start = "top top", end = "bottom bottom") {
  if (!layer) return;
  gsap.set(layer, { display: "none" });
  ScrollTrigger.create({
    trigger: section,
    start,
    end,
    onToggle: (s) => gsap.set(layer, { display: s.isActive ? display : "none" }),
  });
}

/** Scrubbed timeline over a section's scroll range. */
export function scrubTl(section: Element, start = "top top", end = "bottom bottom", scrub: number | boolean = 0.6) {
  return gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: section, start, end, scrub } });
}
