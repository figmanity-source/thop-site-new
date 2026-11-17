"use client";
import { useRef } from "react";
import Link from "next/link";
import { centre } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";
import { Plus } from "../Icons";
import { Split } from "../Split";

/** "MODEL 146GR" + parts list → The BIOVITY Centre + THOP step/membership list. */
export default function Parts() {
  const ref = useRef<HTMLElement>(null);
  useFx(ref, (el) => {
    const chars = el.querySelectorAll("h3 .st-char");
    gsap.fromTo(chars, { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none reverse" } });
    gsap.fromTo(el.querySelectorAll(".img-w, .centre-copy"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" } });
    el.querySelectorAll<HTMLElement>("ul li").forEach((li) => {
      gsap.timeline({ scrollTrigger: { trigger: li, start: "top 92%", toggleActions: "play none none reverse" } })
        .fromTo(li, { "--bar-scale": 0 }, { "--bar-scale": 1, duration: 1.1, ease: "power3.inOut" })
        .fromTo(li.querySelectorAll("p"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.06 }, 0.3);
    });
  });
  return (
    <section data-section="Parts" id="centre" ref={ref}>
      <div className="top-w">
        <h3>
          <span className="grey"><Split text="THE" wrap /></span><br />
          <span><Split text="CENTRE" wrap /></span>
        </h3>
        <div className="img-w">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={centre.eyebrow} src={centre.image} />
          <div className="description-w">
            <div className="left">
              <div className="circle"></div>
              <p>{centre.eyebrow}<br /><span>{centre.label}</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className="centre-copy">
        <p className="caption-dark">{centre.label}</p>
        <p className="centre-title">{centre.title}</p>
        <p className="centre-body">{centre.body}</p>
        <Link className="pill" href={centre.href}>{centre.cta}</Link>
      </div>
      <ul>
        {centre.rows.map((r) => (
          <li key={r.index}>
            <p className="name"><span className="plus-wrapper hide-mobile hide-tablet"><Plus /></span> {r.name}</p>
            <p className="index">{r.index}</p>
            <p className="type">{r.type}</p>
            <p className="weight">{r.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
