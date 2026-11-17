"use client";
import { useRef } from "react";
import { brand, why, protocol } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { pinLayer, useFx } from "@/lib/useFx";
export default function VerticalText() {
  const ref = useRef<HTMLElement>(null);
  useFx(ref, (el) => {
    const inner = el.querySelector(".fps-vertical-inner");
    pinLayer(el, inner, "flex");
    const fades = el.querySelectorAll("[data-fade]");
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } })
      .fromTo(fades, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.25 }, 0)
      .to(el.querySelector(".fps-right-infos-wrapper"), { yPercent: -12, duration: 1 }, 0)
      .to(fades, { opacity: 0, stagger: 0.04, duration: 0.15 }, 0.85);
  });
  return (
    <section data-section="VerticalText" id="why" ref={ref}>
      <div className="fps-vertical-inner">
        <div className="fps-left-infos-wrapper">
          <div className="fps-mechanism-wrapper" data-fade="">
            <p className="fps-movement-title small-title"><b data-model-fade="">{why.title}</b></p>
            <p className="fps-movement-title small-title vt-body readable">{why.body}</p>
            <p className="fps-movement-title small-title vt-body readable">{why.note}</p>
          </div>
          <div className="fps-movement-wrapper" data-fade="">
            <p className="fps-movement-title small-title"><b data-model-fade="">{protocol.title}</b></p>
            <p className="fps-movement-title small-title vt-body readable">{protocol.body}</p>
            <ol className="step-lines">
              {protocol.steps.map(([n, name, line]) => (
                <li key={n}><span>{n} {name}</span> {line}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="fps-right-infos-wrapper" data-fade="">
          <p data-model-fade="">{brand.name}</p>
        </div>
      </div>
    </section>
  );
}
