"use client";
import { useRef } from "react";
import { continuum } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";
import BigText from "./BigText";
import { useEnquiry } from "../Enquiry";

/** Big text + fixed gallery of 4 visuals flying up through the viewport. */
function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  useFx(ref, (el) => {
    const section = el.closest("section")!;
    const imgs = el.querySelectorAll<HTMLImageElement>("img");
    gsap.set(el, { display: "none" });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section, start: "top 60%", end: "bottom top", scrub: 0.4,
        onToggle: (s) => gsap.set(el, { display: s.isActive ? "grid" : "none" }),
      },
    });
    const starts = [0, 0.12, 0.24, 0.36];
    imgs.forEach((img, i) => tl.fromTo(img, { "--translate-progress": 0 }, { "--translate-progress": 1, duration: 0.64 }, starts[i]));
  });
  return (
    <div className="images-w" ref={ref}>
      {continuum.images.map((src) => (
        <div className="single-img-w" key={src}>
          <picture>
            <source media="(min-width: 1024px)" srcSet={src} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="THOP visual" src={src} />
          </picture>
        </div>
      ))}
    </div>
  );
}

export default function Images() {
  const openEnquiry = useEnquiry();
  return (
    <BigText
      section="Images"
      id="continuum"
      title={continuum.big.title}
      lines={continuum.big.lines}
      info={[
        { caption: continuum.eyebrow, title: <><b>{continuum.title}</b><br /><br />{continuum.body}</> },
        {
          caption: "It can include",
          title: (
            <>
              <ul className="inline-list">{continuum.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <p>{continuum.welcome}</p>
              <p className="muted">{continuum.note}</p>
              <button className="pill" onClick={() => openEnquiry("CONTINUUM")}>{continuum.cta}</button>
            </>
          ),
        },
      ]}
    >
      <Gallery />
    </BigText>
  );
}
