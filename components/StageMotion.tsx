"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Homepage motion language, scoped to the shared inner-page frame. */
export default function StageMotion() {
  const pathname = usePathname();
  useIso(() => {
    const root = document.querySelector<HTMLElement>(".inner-experience");
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const originals: { wrapper: HTMLElement; text: string }[] = [];
    const ctx = gsap.context(() => {
      if (media.matches) return;
      root.querySelectorAll<HTMLElement>(".sheet-title,.sheet-band h2,.footer-title").forEach(heading => {
        const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        while (walker.nextNode()) nodes.push(walker.currentNode as Text);
        nodes.forEach(node => {
          const fragment = document.createDocumentFragment();
          for (const word of (node.textContent || "").split(/(\s+)/)) {
            if (!word.trim()) { fragment.append(document.createTextNode(word)); continue; }
            const wrapper = document.createElement("span");
            wrapper.className = "inner-word-mask";
            const inner = document.createElement("span"); inner.textContent = word;
            wrapper.append(inner); fragment.append(wrapper); originals.push({ wrapper, text: word });
          }
          node.replaceWith(fragment);
        });
        gsap.fromTo(heading.querySelectorAll(".inner-word-mask > span"), { yPercent: 110, rotate: 2 }, {
          yPercent: 0, rotate: 0, duration: 1.05, stagger: .045, ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 94%", once: true },
        });
      });
      root.querySelectorAll<HTMLElement>(".sheet-word,.sheet-hero .home-kicker").forEach(item => {
        gsap.fromTo(item, { opacity: .2, y: 16 }, { opacity: 1, y: 0, duration: .8, ease: "power3.out" });
      });
      root.querySelectorAll<HTMLElement>(".subpage [data-reveal]").forEach(item => {
        // Body copy, medical caveats and forms remain readable during reveals.
        gsap.fromTo(item, { y: 24 }, { y: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 94%", once: true } });
      });
      root.querySelectorAll<HTMLElement>(".value-grid > li,.pathway-grid > li,.sheet-steps > li").forEach(item => {
        gsap.fromTo(item, { x: -18 }, { x: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 94%", once: true } });
      });
      root.querySelectorAll<HTMLElement>(".pulz-transition").forEach(band => {
        gsap.fromTo(band.children, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", stagger: .065, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom 55%", scrub: .35 } });
      });
      root.querySelectorAll<HTMLElement>(".subpage-photo").forEach(image => {
        gsap.fromTo(image, { clipPath: "inset(8% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: image, start: "top 94%", once: true } });
      });
      gsap.to(root.querySelector(".inner-progress i"), { scaleX: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .3 } });
    }, root);
    let alive = true;
    document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    return () => {
      alive = false; ctx.revert();
      originals.forEach(({ wrapper, text }) => wrapper.replaceWith(document.createTextNode(text)));
    };
  }, [pathname]);
  return null;
}
