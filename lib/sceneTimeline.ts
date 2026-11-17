"use client";
import { gsap, ScrollTrigger } from "./gsap";
import { scene, type ModelKey } from "./scene";
import { heroSlides } from "./content";

/**
 * Master WebGL choreography.
 * One GSAP timeline whose time unit is *scroll pixels*, scrubbed by a single
 * ScrollTrigger over the whole page. Every tween is placed at the pixel offset
 * of the section that drives it, mirroring the per-section scenes of the
 * original (Intro → Timeless → VerticalText → Disassembly → Mechanism →
 * Movement → Curves → MovementWatchRight → Hands → Straps → Images → Colors →
 * Parts → Footer).
 */
export function buildSceneTimeline() {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const sec = (name: string) => {
    const el = document.querySelector<HTMLElement>(`[data-section="${name}"]`);
    if (!el) throw new Error(`missing section ${name}`);
    const top = el.getBoundingClientRect().top + window.scrollY;
    return { top, h: el.offsetHeight, end: top + el.offsetHeight };
  };
  const S = {
    Intro: sec("Intro"), Timeless: sec("Timeless"), VerticalText: sec("VerticalText"),
    Disassembly: sec("Disassembly"), Mechanism: sec("Mechanism"), Movement: sec("Movement"),
    Curves: sec("Curves"), MWR: sec("MovementWatchRight"), Hands: sec("Hands"), Straps: sec("Straps"),
    Images: sec("Images"), Colors: sec("Colors"), Parts: sec("Parts"), Footer: sec("Footer"),
  };

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power1.inOut" } });
  const K = (target: object, vars: gsap.TweenVars, from: number, to: number, ease?: string) =>
    tl.to(target, { ...vars, duration: Math.max(1, to - from), ...(ease ? { ease } : {}) }, Math.max(0, from));
  const PI = Math.PI;
  const { dna, cell, twin } = scene;

  // reset to the intro pose
  tl.set(dna, { x: 0, y: 0, z: 0, rx: 0.15, ry: 0, rz: -0.2, s: 1, o: 1 }, 0);
  tl.set(cell, { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 0.4, o: 0 }, 0);
  tl.set(twin, { x: 0, y: -0.1, z: 0, rx: 0, ry: 0, rz: 0, s: 0.4, o: 0 }, 0);
  tl.set(scene, { explode: 0, particles: 0, links: 0, linksOffset: 0 }, 0);

  // Intro → Timeless: model slides up-right next to the big text
  K(dna, { x: 1.35, y: 0.45, s: 0.62, rx: 0.35, rz: 0.25 }, 0, S.Timeless.top + vh * 0.4);
  // Timeless → VerticalText: back to centre, tilting
  // Stay upright and a little smaller so the helix stays in the centre gutter
  // while the Why BIOVITY copy is readable on either side.
  K(dna, { x: 0, y: 0, s: 0.78, rx: 0.06, rz: -0.1 }, S.Timeless.end - vh * 1.1, S.VerticalText.top + vh * 0.7);
  K(dna, { rz: 0.1, ry: PI }, S.VerticalText.top + vh * 0.7, S.VerticalText.end - vh);
  // Disassembly: lie the helix down and pull the five THOP segments apart
  K(dna, { rz: PI / 2, rx: 0, ry: PI * 1.5, s: 0.9, y: -0.05 }, S.VerticalText.end - vh, S.Disassembly.top + vh * 0.35);
  K(scene, { explode: 1 }, S.Disassembly.top + vh * 0.2, S.Disassembly.top + vh * 0.9);
  // Disassembly → Mechanism: the helix dissolves into the cell + particle vortex
  K(dna, { o: 0, s: 0.35 }, S.Disassembly.end - vh * 0.8, S.Disassembly.end - vh * 0.1);
  K(cell, { o: 1, s: 0.7, ry: 0.5, x: 1.55, y: 0.12 }, S.Disassembly.end - vh * 0.5, S.Mechanism.top + vh * 0.45);
  K(scene, { particles: 1 }, S.Mechanism.top - vh * 0.2, S.Mechanism.top + vh * 0.8);
  K(cell, { ry: PI * 2, s: 0.74, x: 1.55, y: 0.12 }, S.Mechanism.top + vh * 0.6, S.Mechanism.end - vh);
  // Movement: cell gives way to the Biological Twin behind the big type
  K(cell, { o: 0, s: 0.3 }, S.Mechanism.end - vh, S.Mechanism.end - vh * 0.2);
  K(twin, { o: 1, s: 1.05, y: -0.15, ry: -0.4 }, S.Mechanism.end - vh * 0.5, S.Movement.top + vh * 0.5);
  K(twin, { ry: 0.4 }, S.Movement.top + vh * 0.5, S.Movement.end - vh);
  K(scene, { particles: 0 }, S.Movement.top + vh * 1.2, S.Movement.end - vh * 0.6);
  // Curves: big, low, front-facing (like the dial close-up)
  K(twin, { y: -1.15, s: 1.55, ry: 0, x: 0 }, S.Movement.end - vh, S.Curves.top + vh);
  // MovementWatchRight: model to the right of the copy
  K(twin, { x: 1.25, y: -0.05, s: 1.05, ry: -0.6 }, S.Curves.end - vh, S.MWR.top + vh);
  // Hands: figure stands in the right gutter so the widened CELLUTION copy stays clear.
  const handsNarrow = window.innerWidth < 900;
  K(twin, {
    x: handsNarrow ? 0.2 : 1.75,
    y: handsNarrow ? -1.15 : -0.12,
    s: handsNarrow ? 0.52 : 0.72,
    ry: 0.2,
  }, S.MWR.end - vh, S.Hands.top + vh * 0.55);
  // Straps: twin out, molecule chain in and travelling
  K(twin, { o: 0, s: 0.8 }, S.Hands.end - vh, S.Hands.end - vh * 0.3);
  K(scene, { links: 1 }, S.Hands.end - vh * 0.6, S.Straps.top + vh * 0.4);
  K(scene, { linksOffset: 1 }, S.Straps.top, S.Straps.end - vh, "none");
  K(scene, { links: 0 }, S.Straps.end - vh * 1.1, S.Straps.end - vh * 0.5);
  // Images: small helix floating while the gallery passes
  tl.set(dna, { x: 0, y: 0, rx: 0.2, ry: 0, rz: -0.2, s: 0.3 }, S.Straps.end - vh * 0.6);
  tl.set(scene, { explode: 0 }, S.Straps.end - vh * 0.6);
  K(dna, { o: 1, s: 0.62 }, S.Straps.end - vh * 0.5, S.Images.top + vh * 0.2);
  K(dna, { rz: 0.25, y: 0.1 }, S.Images.top + vh * 0.2, S.Colors.top);

  // Colors: one slide per THOP step; models swap with a spin, like the colour swap
  const usable = S.Colors.h - vh;
  const per = usable / heroSlides.length;
  const swap = vh * 0.22;
  K(dna, { s: 0.95, y: 0, x: 0, rz: 0 }, S.Colors.top - vh * 0.5, S.Colors.top + vh * 0.2);
  for (let i = 1; i < heroSlides.length; i++) {
    const t = S.Colors.top + per * i;
    const prev = heroSlides[i - 1].model as ModelKey;
    const next = heroSlides[i].model as ModelKey;
    const P = scene[prev];
    const N = scene[next];
    K(P, { o: 0, s: 0.35, ry: `+=${PI}` }, t - swap, t);
    tl.set(N, { x: 0, y: next === "twin" ? -0.1 : 0, rx: 0, rz: 0, ry: -PI, s: 0.35 }, t - 1);
    K(N, { o: 1, s: next === "twin" ? 1.1 : 0.95, ry: 0 }, t, t + swap * 1.4);
  }
  // Parts: clear the stage
  const last = scene[heroSlides[heroSlides.length - 1].model as ModelKey];
  K(last, { o: 0, s: 0.4 }, S.Colors.end - vh * 0.9, S.Colors.end - vh * 0.35);

  // Footer: three models in the open band under the wordmark and above the contact copy.
  // Kept smaller and closer together so they clear the headline and the right-hand details.
  const phone = window.innerWidth < 700;
  const compact = window.innerWidth < 900;
  // Phone viewports pull X toward the centre, so the lineup is authored wider and lower, under the buttons.
  const fy = phone ? -0.62 : compact ? 0.22 : 0.1;
  const lineup: [ModelKey, number, number][] = [
    ["dna", phone ? -1.85 : compact ? -0.72 : -1.25, phone ? 0.16 : compact ? 0.2 : 0.26],
    ["cell", 0, phone ? 0.2 : compact ? 0.28 : 0.34],
    ["twin", phone ? 1.95 : compact ? 0.78 : 1.35, phone ? 0.2 : compact ? 0.28 : 0.32],
  ];
  lineup.forEach(([k, x, s], i) => {
    tl.set(scene[k], { x, y: fy - 0.45, rx: 0, ry: k === "dna" ? 0 : -0.3, rz: 0, s: s * 0.5 }, S.Parts.top);
    // The helix is taller than the other two, so it sits a little lower to clear the wordmark.
    const y = k === "dna" ? fy - 0.2 : fy;
    K(scene[k], { o: 1, s, y }, S.Footer.top - vh * 1.1 + i * 60, S.Footer.top - vh * 0.05, "power3.out");
  });

  tl.set({}, {}, max); // timeline length == scrollable length

  const st = ScrollTrigger.create({ start: 0, end: max, scrub: 0.8, animation: tl });
  return () => { st.kill(); tl.kill(); };
}
