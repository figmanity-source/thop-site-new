"use client";
import { useEffect, useRef, useState } from "react";
import { brand, heroCta, heroSlides, seeSteps } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";
import { Split } from "../Split";
import { BrandType } from "../BrandType";
import { NE } from "../Icons";
import { scrollToTarget } from "../TransitionOverlay";
import { useEnquiry } from "../Enquiry";

export default function Intro() {
  const ref = useRef<HTMLElement>(null);
  const [sel, setSel] = useState(0);
  const openEnquiry = useEnquiry();

  // auto-advance through the THOP steps, like the hero carousel of the demo
  useEffect(() => {
    const id = window.setInterval(() => setSel((s) => (s + 1) % heroSlides.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  useFx(ref, (el) => {
    const chars = el.querySelectorAll(".fps-watch-title .st-char");
    gsap.set(chars, { yPercent: 105 });
    const reveal = () => {
      gsap.to(chars, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.06, delay: 0.1 });
      gsap.to(el.querySelectorAll("[data-fade]"), { opacity: 1, duration: 1, delay: 0.9, stagger: 0.15 });
    };
    window.addEventListener("thop:intro", reveal, { once: true });
    // leaving the intro: letters fade (scrubbed)
    gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 } })
      .to(el.querySelector(".fps-watch-title"), { scale: 1.08, opacity: 0, ease: "none" }, 0)
      .to(el.querySelectorAll("[data-fade]"), { opacity: 0, ease: "none" }, 0);
    return () => window.removeEventListener("thop:intro", reveal);
  });

  const s = heroSlides[sel];
  return (
    <section data-section="Intro" id="intro" ref={ref}>
      <div className="content-wrapper">
        <h1 className="sr-only">Your biology is your greatest asset. Understand it. Invest in it.</h1>
        <p className="fps-watch-title" aria-hidden="true">
          <Split text={brand.name} wrap />
        </p>
      </div>

      <div className="intro-top-left" data-fade="">
        <div className="fps-color-wrapper">
          <span className="fps-label">{heroSlides[0].tag}</span>
          {heroSlides.map((h, i) => (
            <p key={h.key} data-config={h.key} className={i === sel ? "selected" : ""}>{h.left}</p>
          ))}
        </div>
      </div>

      <div className="fps-bottom-wrapper">
        <div data-fade="">
          <div className="fps-watch-weight-wrapper">
            <p className="fps-watch-weight"><BrandType text={s.center} /></p>
          </div>
        </div>
      </div>

      <div className="intro-right" data-fade="">
        <p className="intro-right-title">{heroSlides[0].right[0]}<br />{heroSlides[0].right[1]}</p>
        <p className="intro-right-body">{heroSlides[0].body}</p>
        <button className="pill" onClick={() => openEnquiry("THOP")}>{heroCta} <NE /></button>
        <button className="pill" onClick={() => scrollToTarget("#why")}>{seeSteps} <NE /></button>
        <p className="intro-sub">{brand.protocolLong}</p>
      </div>
    </section>
  );
}
