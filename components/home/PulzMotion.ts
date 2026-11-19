"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scene, type ModelKey } from "@/lib/scene";

/** Homepage reveals, scroll-linked details, and media motion. */
export function buildPulzMotion(root: HTMLElement, reduced: boolean) {
  const originals: { wrapper: HTMLElement; text: string }[] = [];
  const disclosures: { details: HTMLDetailsElement; summary: HTMLElement; click: (event: MouseEvent) => void }[] = [];
  if (reduced) return () => {};

  const hero = root.querySelector(".cine-hero");
  if (hero && window.scrollY < hero.clientHeight && !window.location.hash) {
    const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
    intro.fromTo(hero.querySelector(".cine-hero-word"), { clipPath: "inset(0 0 100% 0)", y: 20 },
      { clipPath: "inset(0 0 0% 0)", y: 0, duration: 1.05, clearProps: "clipPath,transform" }, .18);
    const helix = hero.querySelector(".cine-hero-helix");
    if (helix) intro.from(helix, { opacity: 0, duration: 1, clearProps: "opacity" }, .24);
    intro.fromTo(hero.querySelectorAll(".cine-hero-copy > *"), { opacity: .35, y: 20 },
      { opacity: 1, y: 0, duration: .85, stagger: .07, clearProps: "opacity,transform" }, .35);
  }

  // Wrap text nodes rather than replacing the heading HTML: BrandType remains intact.
  root.querySelectorAll<HTMLElement>(".cine-section:not(.cine-hero) h2, .cine-why h3").forEach(heading => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      for (const word of (node.textContent || "").split(/(\s+)/)) {
        if (!word.trim()) { fragment.append(document.createTextNode(word)); continue; }
        const mask = document.createElement("span");
        mask.className = "pulz-word-mask";
        const inner = document.createElement("span"); inner.textContent = word;
        mask.append(inner); fragment.append(mask);
        originals.push({ wrapper: mask, text: word });
      }
      node.replaceWith(fragment);
    });
    gsap.fromTo(heading.querySelectorAll(".pulz-word-mask > span"),
      { yPercent: 115, rotate: 3 },
      { yPercent: 0, rotate: 0, duration: .95, stagger: { amount: .28 }, ease: "power4.out", clearProps: "transform", scrollTrigger: { trigger: heading, start: "top 91%", once: true } });
  });

  root.querySelectorAll<HTMLElement>(".cine-section-top > span:first-child").forEach(label => {
    gsap.fromTo(label, { clipPath: "inset(0 100% 0 0)" }, {
      clipPath: "inset(0 0% 0 0)", duration: .72, ease: "power3.out", clearProps: "clipPath",
      scrollTrigger: { trigger: label, start: "top 94%", once: true },
    });
  });

  root.querySelectorAll<HTMLElement>("[data-cine-reveal]").forEach((item) => {
    if (item.classList.contains("cine-heading")) return;
    if (item.matches(".cine-footnote,.cine-disclaimer,.cine-process-end") || item.querySelector(".cine-disclaimer")) return;
    const list = item.matches(".cine-stage-list > a, .cine-test-card, .cine-process-list li, .cine-rule-list > div");
    const picture = item.tagName === "FIGURE";
    if (picture) {
      gsap.fromTo(item, { clipPath: "inset(12% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.15, ease: "power4.out", clearProps: "clipPath", scrollTrigger: { trigger: item, start: "top 92%", once: true } });
    } else {
      gsap.fromTo(item, { opacity: .6, x: list ? -18 : 0, y: list ? 0 : 26 },
        { opacity: 1, x: 0, y: 0, duration: .85, ease: "power4.out", clearProps: "opacity,transform", scrollTrigger: { trigger: item, start: "top 94%", once: true } });
    }
  });

  const teamSlots = [...root.querySelectorAll<HTMLElement>(".cine-team-cards > li")];
  teamSlots.forEach((slot, index) => {
    const card = slot.querySelector(".cine-team-reflector");
    if (!card) return;
    // Only stagger cards that share a visual row. Stacked cards reveal on their own.
    const rowOffset = () => teamSlots.slice(0, index).filter((other) => other.offsetTop === slot.offsetTop).length;
    gsap.fromTo(card, {
      opacity: .18,
      rotationX: -76,
      rotationY: (index - 1) * 6,
      transformPerspective: 1100,
      transformOrigin: "center top",
    }, {
      opacity: 1,
      rotationX: 0,
      rotationY: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: slot,
        start: () => `top ${96 - rowOffset() * 6}%`,
        end: () => `top ${68 - rowOffset() * 6}%`,
        scrub: .3,
      },
    });
  });

  root.querySelectorAll<HTMLElement>(".pulz-transition").forEach(band => {
    gsap.fromTo(band.children, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", stagger: .065, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom 55%", scrub: .35 } });
  });
  root.querySelectorAll<HTMLElement>(".cine-centre-grid img").forEach(image => {
    gsap.fromTo(image, { scale: 1.1, yPercent: -4 }, { scale: 1.1, yPercent: 4, ease: "none", scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: .6 } });
  });
  const founderImage = root.querySelector(".cine-founder-image");
  if (founderImage) gsap.fromTo(founderImage, { clipPath: "inset(10% 0 10% 0)" }, {
    clipPath: "inset(0% 0 0% 0)", duration: 1.15, ease: "power4.out", clearProps: "clipPath",
    scrollTrigger: { trigger: founderImage, start: "top 93%", once: true },
  });
  root.querySelectorAll<HTMLElement>(".cine-life-chart, .cine-why-network").forEach(item => {
    gsap.fromTo(item, { "--draw": 0 }, { "--draw": 1, ease: "none", scrollTrigger: { trigger: item, start: "top 90%", end: "bottom 45%", scrub: .5 } });
  });
  root.querySelectorAll<HTMLElement>("[data-cinema-model]").forEach(section => {
    const key = section.dataset.cinemaModel as ModelKey;
    if (section.id === "intro" || !["dna", "cell", "twin"].includes(key)) return;
    ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onUpdate: self => {
      if (root.dataset.activeScene !== section.id) return;
      scene[key].z = Math.sin(self.progress * Math.PI) * .28;
    } });
  });
  root.querySelectorAll<HTMLDetailsElement>(".cine-faq details").forEach(details => {
    const summary = details.querySelector("summary");
    if (!summary) return;
    const click = (event: MouseEvent) => {
      event.preventDefault();
      const height = details.getBoundingClientRect().height;
      const closing = details.open && details.dataset.motion !== "closing";
      gsap.killTweensOf(details);
      details.dataset.motion = closing ? "closing" : "opening";
      details.open = true;
      details.style.height = "auto";
      const target = closing ? summary.getBoundingClientRect().height + 1 : details.getBoundingClientRect().height;
      details.style.height = `${height}px`;
      details.style.overflow = "hidden";
      gsap.to(details, { height: target, duration: .45, ease: "power2.inOut", onComplete: () => {
        details.open = !closing;
        details.style.removeProperty("height"); details.style.removeProperty("overflow"); delete details.dataset.motion;
      } });
    };
    summary.addEventListener("click", click);
    disclosures.push({ details, summary, click });
  });
  gsap.to(root.querySelector(".cine-progress-fill"), { scaleX: 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: .3 } });
  return () => {
    originals.forEach(({ wrapper, text }) => wrapper.replaceWith(document.createTextNode(text)));
    disclosures.forEach(({ details, summary, click }) => {
      summary.removeEventListener("click", click); gsap.killTweensOf(details);
      details.style.removeProperty("height"); details.style.removeProperty("overflow"); delete details.dataset.motion;
    });
  };
}
