"use client";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { pinLayer, useFx } from "@/lib/useFx";
import { Split } from "../Split";

/** Centered title + copy over the model (Curves / Hands / Straps in the original). */
export default function SinglePart({ section, id, pretitle, title, text, extra }: {
  section: "Curves" | "Hands" | "Straps"; id: string; pretitle: string; title: string; text: ReactNode; extra?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useFx(ref, (el) => {
    pinLayer(el, el.querySelector(".fps-single-part-section-wrapper"), section === "Hands" ? "flex" : "block");
    const chars = el.querySelectorAll(".fps-single-part-section-title .st-char");
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .fromTo(el.querySelector(".fps-single-part-section-pretitle"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.02)
      .fromTo(chars, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, stagger: 0.008, duration: 0.12 }, 0.04)
      .fromTo(el.querySelectorAll(".fps-single-part-section-text, .sp-extra"), { opacity: 0 }, { opacity: 1, duration: 0.1, stagger: 0.05 }, 0.15)
      .to(chars, { opacity: 0.25, stagger: 0.004, duration: 0.08 }, 0.86)
      .to(el.querySelectorAll(".fps-single-part-section-pretitle, .fps-single-part-section-text, .sp-extra"), { opacity: 0, duration: 0.08 }, 0.9);
  });
  return (
    <section className="single-part-section" data-section={section} id={id} ref={ref}>
      <div className="fps-single-part-section-wrapper">
        <div className="fps-single-part-section-pretitle"><p>{pretitle}</p><span className="sp-pretitle">{pretitle}</span></div>
        <h2 className="fps-single-part-section-title" data-model-fade=""><Split text={title} /></h2>
        <div className="fps-single-part-section-text" data-model-fade="">{text}</div>
        {extra}
      </div>
    </section>
  );
}
