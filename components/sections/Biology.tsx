"use client";
import { useRef } from "react";
import { biology } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";

/** H-12. Sample dashboard only. No clinical figures. */
export default function Biology() {
  const ref = useRef<HTMLElement>(null);
  useFx(ref, (el) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parts = el.querySelectorAll("[data-reveal]");
    gsap.fromTo(parts, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" },
    });
  });
  const panel = (label: string) => (
    <article data-reveal="">
      <p className="home-kicker">{label}</p>
      <ul>
        {biology.zones.map((zone) => (
          <li key={zone}><span>{zone}</span><strong>Sample</strong></li>
        ))}
      </ul>
    </article>
  );
  return (
    <section className="home-block surface-night" id="biology" data-section="Biology" ref={ref}>
      <div className="home-inner">
        <h2 data-reveal="">{biology.headline}</h2>
        <p className="home-lead" data-reveal="">{biology.body}</p>
        <div className="biology-compare">
          {panel(biology.start)}
          {panel(biology.later)}
        </div>
        <p className="home-kicker biology-sample" data-reveal="">{biology.sample}</p>
      </div>
    </section>
  );
}
