"use client";
import { useRef, useState } from "react";
import { howCellution } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pinLayer, useFx } from "@/lib/useFx";
import { Split } from "../Split";
import { useEnquiry } from "../Enquiry";

/** "Bracelet" scene → How CELLUTION works: molecule chain + 5 steps ticking with scroll. */
export default function Straps() {
  const ref = useRef<HTMLElement>(null);
  const openEnquiry = useEnquiry();
  const [step, setStep] = useState(0);
  useFx(ref, (el) => {
    pinLayer(el, el.querySelector(".fps-single-part-section-wrapper"), "block");
    const chars = el.querySelectorAll(".fps-single-part-section-title .st-char");
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .fromTo(el.querySelector(".fps-single-part-section-pretitle"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.02)
      .fromTo(chars, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, stagger: 0.006, duration: 0.1 }, 0.03)
      .fromTo(el.querySelectorAll(".fps-single-part-section-text, .sp-extra"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.1)
      .to(el.querySelectorAll(".fps-single-part-section-wrapper > *"), { opacity: 0, duration: 0.06 }, 0.92);
    ScrollTrigger.create({
      trigger: el, start: "top top", end: "bottom bottom",
      onUpdate: (s) => setStep(Math.min(howCellution.steps.length - 1, Math.floor(s.progress * howCellution.steps.length))),
    });
  });
  const cur = howCellution.steps[step];
  return (
    <section className="single-part-section" data-section="Straps" id="how-cellution" ref={ref}>
      <div className="fps-single-part-section-wrapper straps-wrapper">
        <div className="fps-single-part-section-pretitle"><span className="sp-pretitle">{howCellution.eyebrow}</span></div>
        <h2 className="fps-single-part-section-title" data-model-fade=""><Split text={howCellution.title} /></h2>
        <div className="fps-single-part-section-text">
          <div className="steps-ticker">
            {howCellution.steps.map((s, i) => (
              <span key={s.n} className={i === step ? "on" : ""}>{s.n}</span>
            ))}
          </div>
          <p className="step-name" key={cur.n}>{cur.n} {cur.name}</p>
          <p className="step-text" key={`t${cur.n}`}>{cur.text}</p>
        </div>
        <div className="sp-extra straps-bottom">
          <div>
            <p className="caption">Three areas</p>
            <ul>{howCellution.areas.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <p className="muted">{howCellution.disclaimer}</p>
          <button className="pill" onClick={() => openEnquiry("CELLUTION")}>{howCellution.cta}</button>
        </div>
      </div>
    </section>
  );
}
