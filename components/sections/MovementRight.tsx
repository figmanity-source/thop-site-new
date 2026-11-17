"use client";
import { useRef } from "react";
import { dox } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { pinLayer, useFx } from "@/lib/useFx";
import { useEnquiry } from "../Enquiry";

/** Copy on the left, model on the right (MovementWatchRight). */
export default function MovementRight() {
  const ref = useRef<HTMLElement>(null);
  const openEnquiry = useEnquiry();
  useFx(ref, (el) => {
    pinLayer(el, el.querySelector(".fps-vertical-inner"), "flex");
    const items = el.querySelectorAll(".fps-left-infos-wrapper .caption, .fps-left-infos-wrapper .fps-movement-content, .fps-left-infos-wrapper .fps-movement-title, .fps-left-infos-wrapper .pill");
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .fromTo(items, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.04, duration: 0.12 }, 0.05)
      .to(items, { opacity: 0, stagger: 0.02, duration: 0.08 }, 0.85);
  });
  return (
    <section data-section="MovementWatchRight" id="dox-parts" ref={ref}>
      <div className="fps-vertical-inner">
        <div className="fps-left-infos-wrapper">
          {dox.parts.map((p) => (
            <div className="fps-mechanism-wrapper" key={p.label}>
              <p className="fps-caption caption">{p.label}</p>
              <p className="fps-movement-content">{p.text}</p>
            </div>
          ))}
          <div className="fps-movement-wrapper">
            <p className="fps-caption caption">At the end</p>
            <p className="fps-movement-content readable">{dox.atEnd}</p>
            <p className="fps-caption caption">Who it’s for</p>
            <p className="fps-movement-content readable">{dox.who}</p>
            <p className="fps-movement-title small-title readable">{dox.disclaimer}</p>
            <button className="pill" onClick={() => openEnquiry("DOX")}>{dox.cta}</button>
          </div>
        </div>
      </div>
    </section>
  );
}
