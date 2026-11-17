"use client";
import { useRef, useState } from "react";
import { faqs } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";

/** H-16. Approved questions only. */
export default function Faq() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  useFx(ref, (el) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(el.querySelectorAll("[data-reveal]"), { opacity: 0, y: 16 }, {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none reverse" },
    });
  });
  return (
    <section className="home-block surface-gallery" id="faq" data-section="Faq" ref={ref}>
      <div className="home-inner">
        <h2 data-reveal="">Questions people ask</h2>
        <div className="faq-list" data-reveal="">
          {faqs.map((item, i) => {
            const on = open === i;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={item.q} className={on ? "faq-item open" : "faq-item"}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setOpen(on ? -1 : i)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                      e.preventDefault();
                      const buttons = [...e.currentTarget.closest(".faq-list")!.querySelectorAll("button")];
                      const next = buttons[(buttons.indexOf(e.currentTarget) + (e.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length];
                      next?.focus();
                    }}
                  >
                    {item.q}
                  </button>
                </h3>
                <div id={panelId} role="region" hidden={!on}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
