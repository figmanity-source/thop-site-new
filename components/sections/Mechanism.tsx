"use client";
import { useRef } from "react";
import { blueprint } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { pinLayer, useFx } from "@/lib/useFx";
/** Dark particle scene ("Mechanical Heart" in the original) → BioBlueprint. */
export default function Mechanism() {
  const ref = useRef<HTMLElement>(null);
  const d1 = useRef<HTMLSpanElement>(null);
  const d2 = useRef<HTMLSpanElement>(null);

  useFx(ref, (el) => {
    const layer = el.querySelector(".fps-mechanism-first");
    pinLayer(el, layer, "flex", "top top", "bottom bottom");
    el.querySelectorAll("[data-fade]").forEach((node) => gsap.set(node, { opacity: 1, y: 0 }));
    const counter = { v: 15 };
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .to(counter, {
        v: 0, duration: 1, ease: "none",
        onUpdate: () => {
          const s = String(Math.round(counter.v)).padStart(2, "0");
          if (d1.current) d1.current.textContent = s[0];
          if (d2.current) d2.current.textContent = s[1];
        },
      }, 0);
  });

  return (
    <section data-section="Mechanism" id="bioblueprint" ref={ref}>
      <div className="fps-mechanism-first">
        <div className="fps-mechanism-first-inner">
          <div className="fps-mechanism-title" data-fade="">
            <span>{blueprint.title[0]}</span><br />{blueprint.title[1]}<br />
          </div>
          <div className="fps-mechanism-wrapper" data-fade="">
            <p className="fps-caption caption">{blueprint.eyebrow}</p>
            <p className="fps-movement-title small-title">{blueprint.intro}</p>
          </div>
          <div className="fps-movement-wrapper mech-tests" data-fade="">
            {blueprint.tests.map((t) => (
              <div key={t.label}>
                <p className="fps-caption caption">{t.label}</p>
                <p className="fps-caption caption">{t.caption}</p>
                <p className="readable">{t.text}</p>
              </div>
            ))}
            <p className="readable">{blueprint.smallPrint}</p>
          </div>
        </div>
        <div className="fps-seconds-wrapper" data-fade="">
          <p className="fps-seconds"><span ref={d1}>1</span><span ref={d2}>5</span>”</p>
        </div>
      </div>
    </section>
  );
}
