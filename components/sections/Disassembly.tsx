"use client";
import { useEffect, useRef, useState } from "react";
import { journey } from "@/lib/content";
import { useEnquiry } from "../Enquiry";
import { scene } from "@/lib/scene";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";

/** DNA "disassembly": five segments = the five THOP steps; click a label to open it. */
export default function Disassembly() {
  const ref = useRef<HTMLElement>(null);
  const openEnquiry = useEnquiry();
  const hoverRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(-1);

  useEffect(() => { scene.focus = open; }, [open]);

  // follow the projected 3D segment positions
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const nodes = hoverRefs.current;
      const n = nodes.length;
      const xs = nodes.map((_, i) => scene.segScreen[i]?.x ?? 0);
      const span = Math.max(...xs) - Math.min(...xs);
      // Vertical labels are narrow. While the helix is still stacked they share
      // one screen x and paint on top of each other, so fall back to an even row.
      const gap = Math.min(120, (window.innerWidth * 0.46) / Math.max(n - 1, 1));
      const follow = span > gap * (n - 1) * 0.85 && Math.min(...xs) > 1;
      nodes.forEach((h, i) => {
        if (!h) return;
        const x = follow ? xs[i] - window.innerWidth / 2 : (i - (n - 1) / 2) * gap;
        h.style.transform = `translate3d(${x}px,0,0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useFx(ref, (el) => {
    const hovers = el.querySelector<HTMLElement>(".hovers-w");
    const bg = el.querySelector<HTMLElement>(".background");
    ScrollTrigger.create({
      trigger: el, start: "top 40%", end: "bottom 60%",
      onToggle: (s) => {
        gsap.set(hovers, { display: s.isActive ? "block" : "none" });
        el.classList.toggle("active", s.isActive);
        bg?.classList.toggle("active", s.isActive);
        setOpen((current) => (s.isActive ? (current < 0 ? 0 : current) : -1));
      },
    });
    gsap.fromTo(el.querySelector(".background-text"), { yPercent: 0 }, {
      yPercent: 35, ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  return (
    <section data-section="Disassembly" id="discover" ref={ref}>
      <div className="hovers-w" style={{ display: "none" }}>
        <div className="hovers-second-w">
          {journey.steps.map((s, i) => (
            <div key={s.id} data-hover-id={s.id} ref={(el) => { hoverRefs.current[i] = el; }} onClick={() => setOpen(i)} className={open === i ? "open" : ""}>
              <p>{s.title.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {journey.steps.map((s, i) => (
        <div key={s.id} data-mesh={s.id} style={{ display: open === i ? "flex" : "none" }}>
          <div className="content">
            <p className="caption">Step {String(i + 1).padStart(2, "0")} / 05</p>
            <h4 className="small-title">{s.title}</h4>
            <p className="caption">{s.line}</p>
            <p className="body-text">{s.text}</p>
            {"leaves" in s && s.leaves ? (
              <div className="discover-extra">
                <p className="caption">{s.leavesLabel}</p>
                <ul>
                  {s.leaves.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <button className="pill" type="button" onClick={() => openEnquiry("THOP")}>{s.cta}</button>
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <div className="background">
        <svg className="cut-circle" viewBox="0 0 200 200" fill="none">
          <circle className="circle" cx="100" cy="100" r="99" stroke="currentColor" strokeWidth=".3" />
          <path className="line" d="M0 100h200" stroke="currentColor" strokeWidth=".3" />
        </svg>
        <button data-direction="1" aria-label="previous step" onClick={() => setOpen((o) => (o <= 0 ? 4 : o - 1))}></button>
        <button data-direction="-1" aria-label="next step" onClick={() => setOpen((o) => (o + 1) % 5)}></button>
      </div>

      <div className="background-text" aria-hidden>
        {["P", "O", "H", "T"].map((c, i) => <span key={`a${i}`}>{c}</span>)}
        <div></div>
        {["P", "O", "H", "T"].map((c, i) => <span key={`b${i}`}>{c}</span>)}
      </div>
    </section>
  );
}
