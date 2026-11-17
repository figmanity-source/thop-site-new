"use client";
import { useRef } from "react";
import Link from "next/link";
import { founder } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";

/** H-13. No generated portrait. */
export default function Founder() {
  const ref = useRef<HTMLElement>(null);
  useFx(ref, (el) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el.querySelectorAll("[data-reveal]"), { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none reverse" },
    });
  });
  return (
    <section className="home-block surface-gallery" id="founder" data-section="Founder" ref={ref}>
      <div className="home-inner founder-grid">
        <div className="founder-portrait" data-reveal="" />
        <div>
          <h2 data-reveal="">{founder.headline}</h2>
          <p className="founder-name" data-reveal="">{founder.name}</p>
          <p className="home-kicker" data-reveal="">{founder.title}</p>
          <p className="home-lead" data-reveal="">{founder.body}</p>
          <p data-reveal=""><Link className="pill" href="/founder">MEET THE FOUNDER</Link></p>
        </div>
      </div>
    </section>
  );
}
