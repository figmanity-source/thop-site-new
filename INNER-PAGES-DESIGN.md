# Inner-page visual system

The 20 existing inner routes now continue the homepage's Paper/Graphite palette,
Poppins typography scale, floating navigation, pill controls, fine rules and
striped transitions. The homepage is outside the new styles' scope.

Shared implementation:
- `components/PageFrame.tsx`: scoped frame, skip link, progress line, shared dock,
  lazy desktop-only loading of existing stage models and matching closing/footer.
- `components/Sheet.tsx`: open split layouts for section headings and readable copy.
- `components/Header.tsx`: opt-in inner navigation variant with active-page state,
  an upward-opening responsive menu and existing enquiry/sign-in destinations.
- `components/StageMotion.tsx`: word masks, restrained list/copy movement, crop
  reveals and stripes, with cleanup and a static reduced-motion fallback.
- `styles/inner-pages.css`: scoped layouts, editorial indexes, accessible controls,
  dark/light surfaces and mobile single-column presentation. No shadows.

No page copy, route content, programme claims, medical disclaimers or form logic
were rewritten. No new models, portraits, packages or external assets were added.
Existing sign-in and Self-Check placeholders retain their original behaviour;
this styling pass does not add authentication or questionnaire functionality.

Verification compares the exact server-rendered main text on all 20 routes with
`artifacts/inner-pages/content-baseline.json`. Browser checks cover all routes on
desktop, representative pages at 768/360px, Hallmarks selection, journey FAQ,
menu/keyboard closing, enquiry/unchecked consent, reduced motion and client
navigation back to the homepage. Screenshots/results: `artifacts/inner-pages/`.
Run `node scripts/check-inner-pages.mjs` against port 3005. `--smoke` checks the
final desktop/mobile model-loading change while repeating all content comparisons.
