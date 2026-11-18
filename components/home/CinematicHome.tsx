"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { scene, type ModelKey } from "@/lib/scene";
import { brand, heroSlides, heroCta, seeSteps, healthspan, why, protocol, journey, blueprint, twin, dox, cellution, howCellution, continuum, biology, founder, team, centre, faqs, contact, type Interest } from "@/lib/content";
import { EnquiryProvider, useEnquiry } from "../Enquiry";
import { FooterColumns } from "../SiteFooter";
import { BrandType } from "../BrandType";
import Loader from "../Loader";
import SectionTransition from "./SectionTransition";
import { buildPulzMotion } from "./PulzMotion";
import { useHeaderEntrance } from "../useHeaderEntrance";
import { useHeaderDock } from "../useHeaderDock";
import "../../styles/home.css";
import "../../styles/reference-theme.css";
import "../../styles/product-sections.css";
import "../../styles/narrative.css";
import "../../styles/pulz-theme.css";
import "../../styles/header-motion.css";

const Scene = dynamic(() => import("../three/Scene"), { ssr: false });
const heroFilmCaptions = heroSlides.slice(1).map(slide => ({ name: slide.center, line: slide.left }));
const homepageFaqs = faqs;
const stages = ["discover", "bioblueprint", "dox", "cellution", "continuum"] as const;

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true" style={down ? { transform: "rotate(135deg)" } : undefined}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;
}

function Action({ children, interest = "THOP", secondary = false }: { children: ReactNode; interest?: Interest; secondary?: boolean }) {
  const open = useEnquiry();
  return <button type="button" className={`cine-button${secondary ? " secondary" : ""}`} onClick={() => open(interest)}>{children}<Arrow /></button>;
}

function Chapter({ id, number, label, title, lead, children, model, light = false, className = "" }: {
  id: string; number?: string; label: string; title: string; lead?: string; children?: ReactNode; model?: ModelKey; light?: boolean; className?: string;
}) {
  return (
    <section id={id} data-cinema-model={model ?? "none"} className={`cine-section ${light ? "cine-light" : ""} ${className}`}>
      {["discover", "dox"].includes(id) && <SectionTransition />}
      <div className="cine-section-top"><span>{label}</span>{number && <span>{number}</span>}</div>
      <div className="cine-section-body">
        <div className="cine-heading" data-cine-reveal>
          {number && <span className="cine-chapter-number" aria-hidden="true">{number}</span>}
          <h2 data-model-fade=""><BrandType text={title} /></h2>
          {lead && <p className="cine-lead">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}


function Home() {
  const headerReady = useHeaderEntrance(true);
  const headerRef = useRef<HTMLElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [chapter, setChapter] = useState("intro");
  const headerDocked = useHeaderDock(headerRef, chapter !== "intro", headerReady);
  const [zone, setZone] = useState(0);
  const [comparison, setComparison] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lightStage, setLightStage] = useState(true);


  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    root.current?.classList.toggle("motion-paused", paused);
  }, [paused]);

  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenu(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menu]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const previousBackground = document.documentElement.style.background;
    document.documentElement.style.background = "#e7e7e4";
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lenis = media.matches ? null : new Lenis({ lerp: 0.07, smoothWheel: true, wheelMultiplier: 0.85, anchors: { offset: -96 } });
    setLenis(lenis);
    const tick = (time: number) => lenis?.raf(time * 1000);
    lenis?.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    let context: gsap.Context | undefined;
    let cleanWords: (() => void) | undefined;
    let built = false;
    const activators = new Map<HTMLElement, () => void>();
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        for (const [section, activate] of activators) {
          const box = section.getBoundingClientRect();
          if (box.top <= innerHeight * .52 && box.bottom > innerHeight * .52) { activate(); break; }
        }
      }, 200);
    };
    const build = () => {
      if (built) return;
      built = true;
      context = gsap.context(() => {
        const mobile = window.innerWidth < 768;
        const initial = { x: 0, y: mobile ? -.35 : -.05, s: mobile ? 1.1 : 1.38 };
        gsap.set(scene.dna, { x: 1.35, y: .1, s: .82, z: 0, rx: .12, ry: 0, rz: -.22, o: 0 });
        gsap.set(scene.cell, { o: 0, s: .65, x: 1.5, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
        gsap.set(scene.twin, { ...initial, o: 1, z: 0, rx: 0, ry: -.16, rz: 0 });
        gsap.set(scene, { explode: 0, focus: -1, particles: .025, links: 0, linksOffset: 0 });

        element.querySelectorAll<HTMLElement>("[data-cinema-model]").forEach((section) => {
          const activate = () => {
            const key = section.dataset.cinemaModel;
            const light = section.classList.contains("cine-light") || !!section.closest(".cine-light");
            const identity = section.id;
            element.dataset.activeScene = identity;
            setLightStage(light);
            setChapter(identity);
            const modelKeys: ModelKey[] = ["dna", "cell", "twin"];
            modelKeys.forEach((model) => gsap.to(scene[model], { o: model === key ? 1 : 0, duration: media.matches ? 0 : .85, overwrite: "auto" }));
            if (key === "dna" || key === "cell" || key === "twin") {
              const compact = window.innerWidth < 768;
              gsap.to(scene[key], {
                x: section.id === "intro" ? 0 : compact ? 0 : 1.4,
                y: section.id === "intro" ? (compact ? -.35 : -.05) : compact ? 0 : key === "twin" ? -.1 : .05,
                s: section.id === "intro" ? (compact ? 1.1 : 1.38) : compact ? .58 : key === "twin" ? 1.05 : key === "cell" ? .82 : .7,
                ...(section.id === "intro" ? { ry: -.16 } : {}),
                rz: key === "dna" ? -.2 : 0, rx: key === "dna" ? .12 : 0,
                duration: media.matches ? 0 : 1.4, ease: "power3.inOut", overwrite: "auto",
              });
              if (!media.matches && section.id !== "intro") gsap.to(scene[key], { ry: "+=1.2", duration: 1.8, ease: "power2.inOut" });
            }
            gsap.to(scene, { particles: section.id === "intro" ? (light ? .025 : .16) : key === "none" ? 0 : light ? .012 : .045, links: 0, duration: media.matches ? 0 : 1.2, overwrite: "auto" });
          };
          activators.set(section, activate);
          ScrollTrigger.create({ trigger: section, start: "top 52%", end: "bottom 52%", onEnter: activate, onEnterBack: activate
          });
        });
        cleanWords = buildPulzMotion(element, media.matches);
      }, element);
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash && document.getElementById(hash.slice(1))) {
        if (lenis) lenis.scrollTo(hash, { offset: -96, immediate: true });
        else document.getElementById(hash.slice(1))?.scrollIntoView();
      }
    };
    window.addEventListener("thop:ready", build, { once: true });
    window.addEventListener("resize", onResize);
    const fallback = window.setTimeout(build, 16000);
    const pointer = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      element.style.setProperty("--pointer-x", `${event.clientX / Math.max(rect.width, 1) * 100}%`);
    };
    element.addEventListener("pointermove", pointer, { passive: true });
    return () => {
      window.clearTimeout(fallback); window.removeEventListener("thop:ready", build);
      window.clearTimeout(resizeTimer); window.removeEventListener("resize", onResize);
      element.removeEventListener("pointermove", pointer);
      context?.revert(); gsap.killTweensOf([scene, scene.dna, scene.cell, scene.twin]);
      cleanWords?.();
      gsap.ticker.remove(tick); lenis?.destroy(); setLenis(null);
      document.documentElement.style.background = previousBackground;
    };
  }, []);

  return (
    <div className={`cinematic-home${headerDocked ? " past-intro" : ""}`} ref={root}>
      <a className="cine-skip" href="#home-content">Skip to content</a>
      <Loader />
      <Scene cinematic paused={paused || reduce} lightBackground={lightStage} />
      <div className="cine-progress" aria-hidden="true"><div className="cine-progress-fill" /></div>
      <header ref={headerRef} data-animated-header="" data-header-ready={headerReady} className={`cine-header ${menu ? "is-open" : ""}`}>
        <Link href="/" className="cine-brand" aria-label="BIOVITY home"><span>BIOVITY</span></Link>
        <nav className={menu ? "open" : ""} id="cinema-navigation" aria-label="Main navigation">
          {[ ["THOP", "/#five-steps"], ["Pathways", "/pathways"], ["Science", "/science"], ["Your Journey", "/your-journey"], ["About", "/about"], ["Journal", "/journal"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenu(false)}>{label}</Link>)}
        </nav>
        <div className="cine-header-actions"><Link className="cine-login" href="/member-login" aria-label="Member sign in"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="8" r="3" stroke="currentColor" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" stroke="currentColor" /></svg></Link><Action>{heroCta}</Action><button className="cine-menu" aria-label={menu ? "Close menu" : "Open menu"} aria-expanded={menu} aria-controls="cinema-navigation" onClick={() => setMenu(!menu)}><span /><span /></button></div>
      </header>

      <main id="home-content" className="cine-main">
        <section className="cine-hero cine-section cine-light" id="intro" data-cinema-model="twin">
          <div className="cine-hero-grid" aria-hidden="true" />
          <div className="cine-hero-word" aria-hidden="true">BIOVITY</div>
          <div className="cine-hero-copy">
            <p className="cine-label"><span className="cine-live-dot" />{heroSlides[0].tag}</p>
            <h1>{heroSlides[0].left}</h1>
            <p className="cine-hero-manifesto">{heroSlides[0].right[0]} <span>{heroSlides[0].right[1]}</span></p>
            <p className="cine-hero-body">{heroSlides[0].body}</p>
            <div className="cine-actions"><Action>{heroCta}</Action><a href="#five-steps" className="cine-text-link">{seeSteps}<Arrow down /></a></div>
          </div>
          <div className="cine-orbit" aria-hidden="true"><div /><div /><i /></div>
          <div className="cine-specimen-label" aria-hidden="true"><i /></div>
          <div className="cine-hero-footer"><span>{brand.protocolLong}</span><a href="#healthspan" aria-label="Scroll to the healthspan section"><span className="cine-scroll-line" /><Arrow down /></a><button onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume ambient motion" : "Pause ambient motion"}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">{paused ? <path d="m4 2 9 6-9 6Z" fill="currentColor" /> : <path d="M5 2v12M11 2v12" stroke="currentColor" strokeWidth="2" />}</svg></button></div>
        </section>

        <div className="cine-model-index" aria-label="The five THOP steps">
          {heroFilmCaptions.map((caption, index) => <a href={`#${stages[index]}`} key={caption.name}><span>{String(index + 1).padStart(2, "0")} {caption.name}</span><strong>{caption.line}</strong><Arrow /></a>)}
        </div>

        <section id="healthspan" className="cine-section cine-healthspan" data-cinema-model="none">
          <div className="cine-section-top"><span>HEALTHSPAN</span></div>
          <div className="cine-health-grid">
            <div data-cine-reveal><h2>{healthspan.title[0]}<br /><span>{healthspan.title[1]}</span></h2></div>
            <div data-cine-reveal><p className="cine-lead">{healthspan.body}</p><div className="cine-life-chart" role="img" aria-label="Conceptual comparison of lifespan and healthspan, not population data">{healthspan.labels.map((label, index) => <div key={label}><span>{label}</span><i className={`life-bar life-bar-${index}`} /></div>)}</div></div>
          </div>
          <div className="cine-why" id="why" data-cine-reveal><svg className="cine-why-network" viewBox="0 0 600 320" fill="none" aria-hidden="true"><path d="M80 90 300 160 510 60M100 270 300 160 520 260M300 160 320 30" />{[[80,90],[300,160],[510,60],[100,270],[520,260],[320,30]].map(([x,y], i)=><g key={i}><circle cx={x} cy={y} r={i===1 ? 34 : 18} /><circle cx={x} cy={y} r={i===1 ? 26 : 11} /></g>)}</svg><span className="cine-label">WHY BIOVITY</span><h3>{why.title}</h3><p>{why.body}</p><p className="cine-statement">{why.note}</p></div>
        </section>

        <section id="five-steps" className="cine-section cine-light cine-protocol" data-cinema-model="none">
          <div className="cine-section-top"><span>THE HUMAN OPTIMISATION PROTOCOL</span></div>
          <div className="cine-narrow" data-cine-reveal><p className="cine-label">THE HUMAN OPTIMISATION PROTOCOL</p><h2><BrandType text={protocol.title} /></h2><p className="cine-lead">{protocol.body}</p></div>
          <div className="cine-stage-list">{protocol.steps.map(([number, name, line], index) => <a key={name} href={`#${stages[index]}`} data-cine-reveal><span className={`cine-stage-symbol symbol-${index}`} aria-hidden="true"><i /><i /><i /></span><span className="cine-stage-index">{number}</span><span className="cine-stage-title">{name}</span><span className="cine-stage-description">{line}</span><Arrow /></a>)}</div>
        </section>

        <Chapter id="discover" number="01" label={heroSlides[1].tag} title={journey.steps[0].line} lead={journey.steps[0].text} model="dna" light className="cine-discover">
          <div className="cine-copy-panel" data-cine-reveal><p className="cine-label">{journey.steps[0].leavesLabel}</p><ul className="cine-check-list">{journey.steps[0].leaves?.map((item) => <li key={item}><span>↗</span>{item}</li>)}</ul><Action>{journey.steps[0].cta}</Action></div>
        </Chapter>

        <Chapter id="bioblueprint" number="02" label={blueprint.eyebrow} title={blueprint.title.join(" ")} lead={blueprint.intro} model="cell" light className="cine-blueprint">
          <div className="cine-test-grid">{blueprint.tests.map((test, index) => <article className="cine-test-card" key={test.label} data-cine-reveal><div className="cine-test-card-top"><span>0{index + 1}</span><span className="cine-mini-orbit" aria-hidden="true" /></div><p className="cine-label">{test.label}</p><h3>{test.caption}</h3><p>{test.text}</p></article>)}</div>
          <p className="cine-footnote" data-cine-reveal>{blueprint.smallPrint}</p>
        </Chapter>

        <Chapter id="twin" label="Your dashboard" title={twin.title} lead={twin.dashboard} model="twin" className="cine-twin">
          <div className="cine-copy-panel" data-cine-reveal><p className="cine-label">YOUR TWIN</p><p>{twin.twin}</p><div className="cine-zone-tabs" role="group" aria-label="Sample body zones">{biology.zones.map((name, index) => <button key={name} aria-pressed={zone === index} onClick={() => setZone(index)}>{name}<span aria-hidden="true">+</span></button>)}</div><p className="cine-sample" aria-live="polite">{twin.sample} — {biology.zones[zone]}</p><p className="cine-label">YOUR REVEAL</p><p>{twin.reveal}</p><Action interest="BIOBLUEPRINT">{twin.cta}</Action></div>
        </Chapter>

        <Chapter id="dox" number="03" label={dox.eyebrow} title={dox.title} lead={dox.body} model="dna" light className="cine-dox">
          <div className="cine-split-cards">{dox.parts.map((part) => <article key={part.label} data-cine-reveal><p className="cine-label">{part.label}</p><p>{part.text}</p></article>)}</div>
          <div className="cine-copy-panel" data-cine-reveal><p className="cine-label">AT THE END</p><p>{dox.atEnd}</p><p className="cine-label">WHO IT’S FOR</p><p>{dox.who}</p><p className="cine-disclaimer">{dox.disclaimer}</p><Action interest="DOX">{dox.cta}</Action></div>
        </Chapter>

        <Chapter id="cellution" number="04" label={cellution.eyebrow} title={cellution.title} lead={cellution.body} model="cell" className="cine-cellution">
          <div className="cine-split-cards">{cellution.parts.map((part) => <article key={part.label} data-cine-reveal><p className="cine-label">{part.label}</p><p>{part.text}</p></article>)}</div>
          <div className="cine-rule-list" data-cine-reveal>{cellution.rules.map((rule) => <div key={rule.label}><span className="cine-rule-mark" aria-hidden="true">○</span><div><h3>{rule.label}</h3><p>{rule.text}</p></div></div>)}</div>
          <p className="cine-body-note" data-cine-reveal><strong>Who it’s for</strong> {cellution.who}</p>
        </Chapter>

        <section id="how-cellution" className="cine-section cine-light cine-process" data-cinema-model="none">
          <div className="cine-section-top"><span>{howCellution.eyebrow}</span></div><h2 data-cine-reveal>{howCellution.title}</h2>
          <ol className="cine-process-list">{howCellution.steps.map((step) => <li key={step.n} data-cine-reveal><span>{step.n}</span><div><h3>{step.name}</h3><p>{step.text}</p></div></li>)}</ol>
          <div className="cine-process-end" data-cine-reveal><div><p className="cine-label">THREE AREAS</p><ul>{howCellution.areas.map((area) => <li key={area}>{area}</li>)}</ul></div><div><p>{howCellution.disclaimer}</p><Action interest="CELLUTION">{howCellution.cta}</Action></div></div>
        </section>

        <Chapter id="continuum" number="05" label={continuum.eyebrow} title={continuum.title} lead={continuum.body} model="dna" light className="cine-continuum">
          <div className="cine-copy-panel" data-cine-reveal><p className="cine-label">IT CAN INCLUDE</p><ul className="cine-membership-list">{continuum.items.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><p>{continuum.welcome}</p><p className="cine-footnote">{continuum.note}</p><Action interest="CONTINUUM">{continuum.cta}</Action></div>
          <div className="cine-gallery" data-cine-reveal>{continuum.images.map((src, index) => <figure key={src}><img src={src} alt={`THOP visual ${index + 1}`} loading="lazy" /></figure>)}</div>
        </Chapter>

        <section id="biology" className="cine-section cine-dashboard" data-cinema-model="none">
          <div className="cine-section-top"><span>{biology.sample}</span></div><div className="cine-narrow" data-cine-reveal><h2>{biology.headline}</h2><p className="cine-lead">{biology.body}</p></div>
          <div className="cine-dashboard-grid">{[biology.start, biology.later].map((label, index) => <article key={label} data-selected={comparison === index} data-cine-reveal><button type="button" className="cine-label cine-comparison-select" aria-pressed={comparison === index} onClick={() => setComparison(index)}>{label}</button><div className="cine-dashboard-orbit" aria-hidden="true"><span /><i /><i /></div>{biology.zones.map((name) => <div className="cine-data-row" key={name}><span>{name}</span><small>{twin.sample}</small></div>)}</article>)}</div><p className="cine-footnote">{biology.sample}</p>
        </section>


        <section id="founder" className="cine-section cine-light cine-founder" data-cinema-model="none"><SectionTransition />
          <div className="cine-section-top"><span>The founder</span></div><div className="cine-founder-grid"><div className="cine-founder-art" aria-hidden="true"><i /></div><div data-cine-reveal><p className="cine-label">THE FOUNDER</p><h2>{founder.headline}</h2><p className="cine-founder-name">{founder.name}</p><p className="cine-label">{founder.title}</p><p>{founder.body}</p><Link className="cine-text-link" href="/founder">MEET THE FOUNDER<Arrow /></Link></div></div>
          <div className="cine-team" id="team" data-cine-reveal><p className="cine-label">OUR TEAM</p><h3>{team.headline}</h3><p>{team.body}</p></div>
        </section>

        <section id="centre" className="cine-section cine-centre" data-cinema-model="none"><div className="cine-section-top"><span>{centre.label}</span></div><div className="cine-centre-grid"><div data-cine-reveal><p className="cine-label">{centre.label}</p><h2>{centre.title}</h2><p className="cine-lead">{centre.body}</p><Link href={centre.href} className="cine-button">{centre.cta}<Arrow /></Link></div><figure data-cine-reveal><img src={centre.image} alt="BIOVITY Centre visual" loading="lazy" /><figcaption>{centre.eyebrow}</figcaption></figure></div></section>

        <section id="questions" className="cine-section cine-light cine-faq" data-cinema-model="none"><SectionTransition /><div className="cine-section-top"><span>Questions people ask</span></div><div className="cine-faq-grid"><h2 data-cine-reveal>Questions<br />people ask.</h2><div>{homepageFaqs.map((faq, index) => <details key={faq.q} data-cine-reveal><summary><span>0{index + 1}</span>{faq.q}<i>+</i></summary><p>{faq.a}</p></details>)}</div></div></section>

        <footer id="contact" className="cine-section cine-footer" data-cinema-model="dna"><div className="cine-section-top"><span>{contact.eyebrow}</span></div><div className="cine-footer-opening" data-cine-reveal><h2>{contact.title}</h2><p className="cine-lead">{contact.body}</p><div className="cine-actions"><Action>{contact.primary}</Action><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="cine-text-link">{contact.secondary}<Arrow /></a></div></div><FooterColumns /><div className="cine-footer-word" aria-hidden="true">BIOVITY</div></footer>
      </main>

      <aside className="cine-chapter-rail" aria-label="Jump to a THOP step">{stages.map((id, index) => <a key={id} href={`#${id}`} className={chapter === id ? "active" : ""} aria-current={chapter === id ? "step" : undefined}><span>0{index + 1}</span><i /><span>{id}</span></a>)}</aside>
      <a className="cine-concierge" href={brand.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp BIOVITY"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" stroke="currentColor" strokeWidth="1.4" /><path d="M8 7c0 5 3 8 8 9" stroke="currentColor" strokeWidth="1.4" /></svg><span>WhatsApp BIOVITY</span></a>
    </div>
  );
}

export default function CinematicHome() {
  return <EnquiryProvider><Home /></EnquiryProvider>;
}
