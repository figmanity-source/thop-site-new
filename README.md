# BIOVITY · THOP — Next.js rebuild of the "FS 60P" scroll experience

Content from https://thop-demo.vercel.app/ mapped onto the section structure, scroll choreography,
loader and transitions of https://thewatch.60fps.fr/. The watch is replaced by 3 animated 3D models.

## Run
```bash
npm install
npm run dev            # http://localhost:3000
# production
npm run build && npm run start
```
Requires Node 20+ and a WebGL2 browser. Works fully offline (no CDN / HDR downloads).

## Stack
Next.js 16 (App Router, TypeScript) · React 19 · three.js + @react-three/fiber + drei · GSAP ScrollTrigger · Lenis smooth scroll.

- `components/Experience.tsx` – page composition, Lenis ↔ ScrollTrigger wiring
- `lib/sceneTimeline.ts` – master WebGL choreography: one GSAP timeline in *scroll-pixel* time, scrubbed over the page
- `lib/scene.ts` – shared mutable state (GSAP writes, R3F render loop reads)
- `components/three/*` – DNA, Cell, Twin, Particles (vortex), Links (molecule chain), Scene
- `components/sections/*` – the 14 original sections, same class names / data-section attributes
- `styles/sections.css` – section layout CSS derived from the original; `app/globals.css` – additions
- `lib/content.ts` – all THOP copy in one place

## Section mapping (original → THOP)
| Original | THOP content | 3D |
|---|---|---|
| Loader | identical progress-arc loader | – |
| Intro (FS 60P + colour circle) | BIOVITY wordmark, hero slide 1, circle with 6 THOP steps (auto-cycles) | DNA helix |
| Timeless (big text) | The Healthspan Gap | DNA moves right |
| VerticalText | Why BIOVITY + THOP protocol intro | DNA centred, tilting |
| Disassembly (exploded watch, click parts) | THE THOP JOURNEY 01–05 — DNA splits into 5 segments, click a label to open the step | DNA disassembled |
| Mechanism (dark particles + seconds counter) | BioBlueprint: 3 tests, counter 15″→00″ | Stem cell + particle vortex |
| Movement (dark big text) | Biological Twin + sample data | Twin (walking) |
| Curves (single part) | DOX — We prepare your body | Twin, low & large |
| MovementWatchRight | DOX part 1/2 + disclaimer + CTA | Twin right |
| Hands (side profile) | CELLUTION | Twin side view |
| Straps (bracelet links) | How CELLUTION works, 5 steps tick with scroll | Molecule chain ring |
| Images (big text + flying gallery) | CONTINUUM + membership items; gallery = THOP demo visuals | small DNA |
| Colors (swap carousel) | The 6 hero slides (THOP, Discover, BioBlueprint, DOX, Cellution, Continuum); models swap per slide, gradient re-tints; click = next | DNA / Twin / Cell swapping |
| Parts (MODEL 146GR + list) | The BIOVITY Centre + 10-row list of steps & membership | – |
| Footer | BIOVITY wordmark, contact CTA, nav, disclaimers | all 3 models lined up |

Nav / CTA clicks use the original full-screen gradient transition overlay, then jump with Lenis.

## 3D models & credits
1. **DNA double helix** – procedural three.js geometry (this project). Built as 5 segments for the disassembly.
2. **Stem cell** – procedural (glass membrane, chrome nucleus, orbiting organelles + rings, echoing the THOP demo visuals).
3. **Biological Twin** – `public/models/man-base-rigged.glb`, Grab3D “Man Base Mesh” (rigged), **CC0 1.0**.
   Realistic adult figure, re-materialised in chrome; the included walk clip plays in place.

Gallery/centre images in `public/images/` are crops of the THOP demo's own renders (their visuals contain no photos).

## Known gaps
- Fonts: Nekst (display) is a commercial typeface carried over from the original site — license it or swap it before publishing. Inter is OFL.
- Choreography is a hand-built reimplementation of the original (not the original minified code): camera moves, timings and easing are close but not frame-exact.
- The Twin is a CC0 adult base mesh in chrome. Swap the GLB if a custom anatomical scan is supplied.
- Mechanism copy fades in fairly late in the scroll; the hover-label projection in Disassembly is tuned for desktop.
- Mobile layouts reuse the original breakpoints but were only lightly checked; the THOP Dark/Light switcher and the demo's sub-pages (/bioblueprint, /science …) are not reproduced — nav links scroll to the matching sections instead.
- Verified with headless Chrome (software WebGL): build passes, no console errors, no 404s, no external requests.
