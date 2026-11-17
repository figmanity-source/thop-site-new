"use client";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useFx } from "@/lib/useFx";
import { Arrow } from "../Icons";
import { BrandType } from "../BrandType";

type Props = {
  section: "Timeless" | "Images" | "Movement";
  id: string;
  title: readonly [string, string] | readonly string[];
  lines: readonly string[];
  info: { caption: string; title: ReactNode }[];
  dark?: boolean;
  children?: ReactNode;
};

/**
 * Shared layout for the three "big text" sections of the original
 * (Timeless / Movement / Images): giant uppercase lines that light up
 * line-by-line on scroll, plus a two-column info block.
 */
export default function BigText({ section, id, title, lines, info, dark = false, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isMovement = section === "Movement";
  const textCls = isMovement ? "fps-movement-text" : "fps-timeless-text";

  useFx(ref, (el) => {
    // Images keeps a flat white headline. Difference blending (in CSS) is what
    // makes it readable over both the light page and the dark gallery cards.
    if (section !== "Images") {
      const greys = el.querySelectorAll<HTMLElement>(".grey-line");
      const from = dark ? "#323232" : "#ffffff";
      greys.forEach((g, i) => {
        const to = dark ? (i % 2 ? "#8c8c8c" : "#ffffff") : i % 2 ? "#000000" : "#bcbcbc";
        gsap.fromTo(g, { color: from }, {
          color: to, ease: "none",
          scrollTrigger: { trigger: g, start: "top 95%", end: "top 45%", scrub: 0.5 },
        });
      });
    }
    el.querySelectorAll<HTMLElement>(".fps-timeless-informations > div").forEach((d, i) => {
      gsap.fromTo(d, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: i * 0.15, ease: "power2.out", scrollTrigger: { trigger: d, start: "top 85%", toggleActions: "play none none reverse" } });
    });
  });

  const chars = (title[0]?.length ?? 0) + (title[1]?.length ?? 0);
  const fitVw = Math.min(11.2, 74 / (0.62 * Math.max(chars, 1) + 1.2));

  const content = (
    <div className={isMovement ? "fps-movement-content-wrapper" : "fps-timeless-wrapper"}>
      <p className={`fps-watch-title ${textCls} grey-line`} data-model-fade=""><BrandType text={title[0]} /><span></span><BrandType text={title[1]} /></p>
      <div className={`${isMovement ? "fps-movement-content" : "fps-timeless-content"} ${textCls}`}>
        {lines.map((l, i) => (
          <span className="grey-line" data-model-fade="" key={i}>
            {isMovement && i === 1 ? <Arrow /> : null}
            {i > 0 ? <br /> : null}
            <BrandType text={l} />
            {!isMovement && i === lines.length - 1 ? <Arrow /> : null}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section
      className={isMovement ? undefined : "big-text-section"}
      data-section={section}
      id={id}
      ref={ref}
      style={{ ["--big" as string]: `${fitVw.toFixed(2)}vw` }}
    >
      {content}
      <div className={`fps-timeless-informations-wrapper ${dark ? "dark" : ""}`}>
        <div className="fps-timeless-informations">
          {info.map((x, i) => (
            <div key={i} className={i === 0 ? "fps-movement-wrapper" : "fps-informations-wrapper"}>
              {x.caption ? <p className="fps-caption caption">{x.caption}</p> : null}
              <div className={i === 0 ? "fps-movement-title small-title" : "fps-informations-content body-text"}>{x.title}</div>
            </div>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}
