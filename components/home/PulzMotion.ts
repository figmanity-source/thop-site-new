"use client";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scene, type ModelKey } from "@/lib/scene";

/** Original motion implementation based on the public reference's interaction patterns. */
export function buildPulzMotion(root: HTMLElement, reduced: boolean) {
  const originals: { wrapper: HTMLElement; text: string }[] = [];
  const disclosures: { details: HTMLDetailsElement; summary: HTMLElement; click: (event: MouseEvent) => void }[] = [];
  if (reduced) return () => {};

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
      { yPercent: 110, rotate: 2 },
      { yPercent: 0, rotate: 0, duration: 1.05, stagger: .045, ease: "power3.out", scrollTrigger: { trigger: heading, start: "top 91%", once: true } });
  });

  root.querySelectorAll<HTMLElement>("[data-cine-reveal]").forEach(item => {
    if (item.classList.contains("cine-heading")) return;
    if (item.matches(".cine-footnote,.cine-disclaimer,.cine-process-end") || item.querySelector(".cine-disclaimer")) return;
    const list = item.matches(".cine-stage-list > a, .cine-test-card, .cine-process-list li, .cine-rule-list > div");
    const picture = item.tagName === "FIGURE" || item.classList.contains("cine-gallery");
    if (picture) {
      gsap.fromTo(item, { clipPath: "inset(9% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 92%", once: true } });
    } else {
      gsap.fromTo(item, { opacity: .12, x: list ? -22 : 0, y: list ? 0 : 30 },
        { opacity: 1, x: 0, y: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 94%", once: true } });
    }
  });

  root.querySelectorAll<HTMLElement>(".pulz-transition").forEach(band => {
    gsap.fromTo(band.children, { scaleY: 0 }, { scaleY: 1, transformOrigin: "bottom", stagger: .065, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom 55%", scrub: .35 } });
  });
  root.querySelectorAll<HTMLElement>(".cine-gallery img, .cine-centre-grid img").forEach(image => {
    gsap.fromTo(image, { scale: 1.12, yPercent: -5 }, { scale: 1.02, yPercent: 5, ease: "none", scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: .6 } });
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
