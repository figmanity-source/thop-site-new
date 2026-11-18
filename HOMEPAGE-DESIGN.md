# Cinematic homepage

The existing `/` route now uses `components/home/CinematicHome.tsx`.
`/thop` continues to redirect to `/`. Other page routes retain their current designs.
The previous homepage component remains in the repository.

- Silver editorial hero with a central chrome Tesla Bot, oversized BIOVITY type,
  orbital graphics and restrained depth particles, following the supplied references.
- Five numbered THOP chapters, connected through model transitions and a jump rail.
- Existing DNA, cell, Tesla Bot and molecule models; no replacement model downloads.
- GSAP model fades, rotation transitions, content reveals and reading progress.
- Lenis smooth scrolling, with native document flow for all text. No nested content scrollbars.
- GPU-driven ambient particles: 4,200 desktop / 1,200 mobile, plus a denser adaptive vortex.
- Pause control for ambient animation and reduced-motion handling.
- Silver/off-white chapters and graphite feature sections with chrome models.
- Existing homepage copy is read from `lib/content.ts`, including all tests,
  programme details, disclaimers, memberships, founder/team, Centre and FAQs.
- Existing enquiry form, contact destinations, consent and delivery behaviour retained.
- Responsive navigation, sample Twin controls and approved FAQ disclosures.

Scoped styles live in `styles/home.css`, `styles/reference-theme.css` and
`styles/product-sections.css`. The product-section stylesheet leaves the approved
hero, model index and healthspan opening untouched. Subsequent sections use open,
full-width architectural surfaces, unframed 3D models and fine horizontal rules.
The protocol is a continuous typographic index; tests, programme details, process,
memberships and dashboards use editorial columns without enclosed cards. Images
are unframed and monochrome. No shadows or additional visible wording are added.
No wording in `lib/content.ts` was changed. The approved-only content pass is
documented in `CONTENT-REVIEW.md`: 66 approved passages are browser-checked;
the unconfirmed FAQ is retained in source for review rather than published.
Scene options default to the previous
behaviour when the cinematic flag is absent. The Tesla Bot is a static mesh;
scroll transitions move the figure without fabricating a skeletal animation.
The founder illustration is abstract artwork, not an invented portrait.

Verification: production build, TypeScript, browser checks at 360, 768, 1280 and
1440px, content coverage, 3D canvas, mobile navigation, booking modal, unchecked
consent, FAQs, sample controls, reduced motion and no horizontal/internal overflow.
Run `node scripts/check-cinematic-home.mjs` against a local production server on
port 3005 (or set `BIOVITY_PREVIEW_URL`). Chrome uses a separate temporary profile.
Screenshots and results are saved in `artifacts/cinematic-home/`.

Content-density refinement: BIOBLUEPRINT tests now read as successive editorial
rows; CELLUTION supporting rules use aligned label/copy rows; process steps use
three comfortable desktop columns and one mobile column. DOX and CONTINUUM
supporting text has more separation. Biology comparisons omit decorative orbits.
These sections use the existing typography tokens and official Paper/Graphite
surfaces. Ambient particles are reduced below the hero and disabled in text-only
sections. Hero markup and content-source hashes were compared before/after.

## Cinematic narrative transformation

The hero remains unchanged. The post-hero experience now uses `styles/narrative.css`
and `components/three/NarrativeObjects.tsx` alongside the existing canvas/studio.
No packages, remote assets, patient data or additional marketing copy were added.

- THOP: five reflective rings respond to stage progress in a continuous index.
- Healthspan/Why: drawn conceptual timelines and a connected-system line study,
  using the existing labels and explanatory content without numerical claims.
- BIOBLUEPRINT: three natural-flow scroll scenes, with a conceptual scan sculpture,
  a laboratory-vial sculpture and the existing genetic visualisation.
- Twin: the repository's human mesh is used only in this section; the hero retains
  Tesla Bot. Eight sample-zone focus buttons share state with the text controls.
- DOX: five reflective seed/leaf layers unfold with section progress.
- CONTINUUM: a rounded cast-metal box with a hinged lid responds to scroll.
- Biology: selectable sample comparison columns, with no fabricated results.
- Founder/team: editorial type remains without an invented portrait.
- Centre: existing image and its existing caption remain together in a wide view.
- Closing: an atmospheric metal-light rule and the existing CTA composition.

All sculptures are conceptual illustrations, not actual device/product depictions.
The membership box is an abstract sculpture rather than an approved product render;
no product specifications are implied. The human mesh has the detail available in
our existing asset; no new clinical anatomy or scans were fabricated.

Motion uses section-specific poses, progressive object changes, masked chapter
reveals and image parallax. No additional pinned scroll regions or nested scrollers.
Reduced motion uses static poses; ambient pause continues to work. Shared studio
lighting and the hero camera are unchanged. Existing content source and hero markup
hashes match the baseline. Browser checks additionally cover focus-marker state,
three test scenes and the sample comparison control.

The subsequent request to remove newly added 3D elements supersedes the sculpture
list above: NarrativeObjects and its scroll state were removed. The original
DNA/cell/Tesla Bot section models are restored, including the original hero.
The newly substituted human Twin and its focus-marker overlay were also removed.
The editorial layouts, approved copy and non-3D refinements remain.

## Pulz reference adaptation

Reference reviewed: https://www.pulz.ai/ (desktop scroll screenshots in
`artifacts/pulz-reference/`). The user explicitly confirmed preserving the hero.
The original implementation adapts the reference's bottom navigation dock,
asymmetric compositions, contrasting full-width surfaces, stripe transitions,
word-mask typography, crop reveals, parallax imagery, hover movement and animated
FAQ disclosures. It uses BIOVITY's Paper/Graphite palette and existing models,
content and images rather than Pulz branding, device imagery or medical copy.

`styles/pulz-theme.css`, `components/home/PulzMotion.ts` and
`components/home/SectionTransition.tsx` implement this pass. The initial hero and
header are untouched; the floating dock activates only below the opening. The
previously removed sculptures remain absent. No new packages were added.
Supporting content stays in native document flow. Medical disclaimers and small
print are excluded from entrance effects. Reduced motion shows all content
without split-word or scrub effects and retains native FAQ disclosures.
Verification includes both surface colours and the mobile dock menu's viewport
bounds, in addition to the existing content and interaction checks.

The latest content reference is https://thop-site.vercel.app/. The matching pass
restored its six navigation links, five FAQs and footer placeholders, superseding
the earlier approved-only exclusions. See CONTENT-REVIEW.md and the source audit.
