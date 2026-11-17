"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/** Custom cursor (desktop only): circle that grows over interactive scenes and shows a label. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current!;
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      el.classList.add("visible");
      const hit = document.elementsFromPoint(e.clientX, e.clientY).find((n) => (n as HTMLElement).dataset?.cursorLabel || (n as HTMLElement).dataset?.hoverId);
      const h = hit as HTMLElement | undefined;
      setLabel(h ? h.dataset.cursorLabel ?? "OPEN" : null);
    };
    const click = (e: PointerEvent) => {
      const colors = document.querySelector<HTMLElement>('[data-section="Colors"]');
      if (!colors) return;
      const r = colors.getBoundingClientRect();
      if (r.top <= 0 && r.bottom >= window.innerHeight && !(e.target as HTMLElement).closest("button,a")) {
        const per = (colors.offsetHeight - window.innerHeight) / 6;
        const top = colors.offsetTop;
        const i = Math.floor((window.scrollY - top) / per);
        const next = top + per * Math.min(5, i + 1) + per * 0.1;
        getLenis()?.scrollTo(i >= 5 ? top + per * 0.1 : next, { duration: 1.2 });
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", click);
    document.documentElement.addEventListener("mouseleave", () => el.classList.remove("visible"));
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", click); };
  }, []);
  return (
    <div data-cursor="" ref={ref} className={label ? "large" : ""}>
      <svg viewBox="0 0 40 40"><circle className="circle" cx="20" cy="20" r="19" fill="#fff" stroke="#000" strokeOpacity=".4" /></svg>
      <p className="cursor-label">{label}</p>
    </div>
  );
}
