"use client";
import { useRef } from "react";
import { brand, contact } from "@/lib/content";
import { FooterColumns } from "../SiteFooter";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";
import { Split } from "../Split";
import { NE } from "../Icons";
import { useEnquiry } from "../Enquiry";

/** Final wordmark with the three models lined up + contact CTA. */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const openEnquiry = useEnquiry();
  useFx(ref, (el) => {
    const wrap = el.querySelector<HTMLElement>(".text-wrapper");
    const chars = el.querySelectorAll(".text-wrapper .st-char");
    gsap.set(wrap, { display: "none" });
    gsap.set(chars, { yPercent: 105 });
    ScrollTrigger.create({
      trigger: el, start: "top 60%",
      onEnter: () => { gsap.set(wrap, { display: "flex" }); gsap.to(chars, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.05 }); },
      onLeaveBack: () => gsap.to(chars, { yPercent: 105, duration: 0.5, ease: "power2.in", onComplete: () => { gsap.set(wrap, { display: "none" }); } }),
    });
    gsap.fromTo(el.querySelector(".footer-bar"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 40%", toggleActions: "play none none reverse" } });
  });
  return (
    <section data-section="Footer" id="contact" ref={ref}>
      <div className="text-wrapper" data-model-fade="">
        <Split text={brand.name} wrap />
      </div>
      <div className="footer-bar">
        <div className="footer-cta">
          <p className="caption-dark">{contact.eyebrow}</p>
          <p className="footer-title" data-model-fade="">{contact.title}</p>
          <p className="footer-body">{contact.body}</p>
          <div className="footer-buttons">
            <button className="pill" onClick={() => openEnquiry("THOP")}>{contact.primary} <NE /></button>
            <a className="pill" href={brand.whatsapp} target="_blank" rel="noreferrer">{contact.secondary} <NE /></a>
          </div>
        </div>
        <div className="footer-meta" data-model-fade="">
          <FooterColumns />
        </div>
      </div>
    </section>
  );
}
