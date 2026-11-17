/**
 * Shared, mutable scene state.
 * GSAP (scroll-scrubbed timelines) writes into it, the react-three-fiber
 * render loop reads from it every frame. Keeping it outside React state
 * avoids re-renders at 60fps — the same pattern the original site uses
 * (DOM/scroll layer drives a separate WebGL layer).
 */
export type ModelKey = "dna" | "cell" | "twin";

export type ModelState = {
  x: number; y: number; z: number;
  rx: number; ry: number; rz: number;
  s: number; // scale
  o: number; // visibility 0..1 (fades + scales in/out)
};

const model = (o = 0, s = 1): ModelState => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s, o });

export const scene = {
  dna: model(1, 1),
  cell: model(0, 0.4),
  twin: model(0, 0.4),
  /** DNA disassembly (0 = assembled helix, 1 = five THOP segments spread apart) */
  explode: 0,
  /** Focused DNA segment when a journey step is opened (-1 = none) */
  focus: -1,
  /** Particle vortex visibility (BioBlueprint / dark sections) */
  particles: 0,
  /** Molecule chain ("bracelet links") visibility + travel */
  links: 0,
  linksOffset: 0,
  /** Global intro reveal (loader -> 1) */
  intro: 0,
  /** Screen-space positions of the 5 DNA segments, written by the scene each frame */
  segScreen: [0, 0, 0, 0, 0].map(() => ({ x: 0, y: 0 })),
  /** Pointer in NDC for subtle parallax */
  pointer: { x: 0, y: 0 },
  /** Set to true by the scene once every model is loaded and rendered once */
  ready: false,
};

export type SceneState = typeof scene;
