"use client";
import { useRef } from "react";
import { team } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";

/** H-14. Fields only. No invented people or registrations. */
export default function Team() {
  const ref = useRef<HTMLElement>(null);
  useFx(ref, (el) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el.querySelectorAll("[data-reveal]"), { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 78%", toggleActions: "play none none reverse" },
    });
  });
  return (
    <section className="home-block surface-gallery" id="team" data-section="Team" ref={ref}>
      <div className="home-inner">
        <h2 data-reveal="">{team.headline}</h2>
        <p className="home-lead" data-reveal="">{team.body}</p>
      </div>
    </section>
  );
}
