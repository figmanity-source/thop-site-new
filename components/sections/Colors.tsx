"use client";
import { useRef, useState } from "react";
import { heroSlides, heroCta } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pinLayer, useFx } from "@/lib/useFx";
import { NE } from "../Icons";
import { BrandType } from "../BrandType";
import { useEnquiry } from "../Enquiry";

/** The colour-swap section → the six THOP hero slides; models swap per slide. */
export default function Colors() {
  const ref = useRef<HTMLElement>(null);
  const openEnquiry = useEnquiry();
  const [sel, setSel] = useState(0);
  const selRef = useRef(0);

  useFx(ref, (el) => {
    const wrapper = el.querySelector<HTMLElement>(".content-wrapper");
    pinLayer(el, wrapper, "block");
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.5 } })
      .fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0)
      .to(wrapper, { opacity: 0, duration: 0.05 }, 0.95);
    const apply = (i: number) => {
      const s = heroSlides[i];
      gsap.to(el, { "--first-color": s.colors[0], "--second-color": s.colors[1], duration: 1, ease: "power2.inOut" });
      el.querySelectorAll<HTMLElement>(".texts-w h4").forEach((h, k) => {
        if (k === i) gsap.fromTo(h, { display: "block", opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" });
        else gsap.to(h, { opacity: 0, duration: 0.4, onComplete: () => { if (selRef.current !== k) h.style.display = "none"; } });
      });
    };
    apply(0);
    ScrollTrigger.create({
      trigger: el, start: "top top", end: "bottom bottom",
      onUpdate: (st) => {
        const i = Math.min(heroSlides.length - 1, Math.floor(st.progress * heroSlides.length));
        if (i !== selRef.current) { selRef.current = i; setSel(i); apply(i); }
      },
    });
  });

  const s = heroSlides[sel];
  const total = String(heroSlides.length).padStart(2, "0");
  return (
    <section data-section="Colors" id="steps" ref={ref}>
      <div className="content-wrapper">
        <div className="texts-w">
          {heroSlides.map((h) => (
            <h4
              key={h.key}
              data-config={h.key}
              style={{
                ["--text-first-color" as string]: "#ffffff",
                ["--text-second-color" as string]: h.colors[0],
              }}
            >
              <BrandType text={h.center} />
            </h4>
          ))}
        </div>
        <div className="info-w">
          <div className="name">
            {heroSlides.map((h, i) => <p key={h.key} data-config={h.key} className={i === sel ? "selected" : ""}>{h.tag}</p>)}
          </div>
          <div className="counter">
            <div className="config-w">
              {heroSlides.map((h, i) => <div key={h.key} data-config={h.key} className={i === sel ? "selected" : ""}>{String(i + 1).padStart(2, "0")}</div>)}
            </div>
            <div>&nbsp;/ {total}</div>
          </div>
        </div>
        <div className="colors-copy" key={s.key}>
          <p className="colors-left">{s.left}</p>
          <p className="colors-body">{s.body}</p>
        </div>
        <div className="colors-right" key={`r${s.key}`}>
          <p>{s.right[0]}<br />{s.right[1]}</p>
          <button className="pill light" onClick={() => openEnquiry("THOP")}>{heroCta} <NE /></button>
          <p className="colors-sub">{s.sub}</p>
        </div>
      </div>
    </section>
  );
}
