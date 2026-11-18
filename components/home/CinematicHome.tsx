"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { scene, type ModelKey } from "@/lib/scene";
import { brand, heroSlides, heroCta, seeSteps, healthspan, why, protocol, journey, blueprint, twin, dox, cellution, howCellution, continuum, biology, founder, team, centre, faqs, contact, type Interest } from "@/lib/content";
import { useEnquiry } from "../Enquiry";
import { FooterColumns } from "../SiteFooter";
import { BrandType } from "../BrandType";
import { TabularDigits } from "../TabularDigits";
import Loader from "../Loader";
import SectionTransition from "./SectionTransition";
import { buildPulzMotion } from "./PulzMotion";
import ReflectiveCard from "./reflective-card/ReflectiveCard";
import "../../styles/home.css";
import "../../styles/reference-theme.css";
import "../../styles/product-sections.css";
import "../../styles/narrative.css";
import "../../styles/pulz-theme.css";
import "../../styles/header-motion.css";

const Scene = dynamic(() => import("../three/Scene"), { ssr: false });
const InlineHelix = dynamic(() => import("../three/InnerStage").then((module) => module.InlineHelix), { ssr: false });
const heroFilmCaptions = heroSlides.slice(1).map(slide => ({ name: slide.center, line: slide.left }));
const homepageFaqs = faqs;
const demoTeamProfiles = [
  { name: "Dr. Aisha Mehta", role: "Clinical Lead · MBBS, MD", registration: "DEMO-001", portrait: "team-clinical.webp" },
  { name: "Rohan Shah", role: "Laboratory Scientist · MSc, Biochemistry", registration: "DEMO-002", portrait: "team-lab.webp" },
  { name: "Neha Rao", role: "Patient Care Coordinator · BSc, Nursing", registration: "DEMO-003", portrait: "team-care.webp" },
];
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
      <div className="cine-section-top"><span><BrandType text={label} /></span>{number && <span className="cine-numeral"><TabularDigits value={number} /></span>}</div>
      <div className="cine-section-body">
        <div className="cine-heading" data-cine-reveal>
          {number && <span className="cine-chapter-number" aria-hidden="true"><TabularDigits value={number} /></span>}
          <h2 data-model-fade=""><BrandType text={title} /></h2>
          {lead && <p className="cine-lead">{lead}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}


export default function CinematicHome() {
  const root = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState("intro");
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
        gsap.set(scene.dna, { x: 1.35, y: .1, s: .82, z: 0, rx: .12, ry: 0, rz: -.22, o: 0 });
        gsap.set(scene.cell, { o: 0, s: .65, x: 1.5, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
        gsap.set(scene, { explode: 0, focus: -1, particles: .025, links: 0, linksOffset: 0 });

        element.querySelectorAll<HTMLElement>("[data-cinema-model]").forEach((section) => {
          const activate = () => {
            const key = section.dataset.cinemaModel;
            const light = section.classList.contains("cine-light") || !!section.closest(".cine-light");
            const identity = section.id;
            element.dataset.activeScene = identity;
            setLightStage(light);
            setChapter(identity);
            const modelKeys: ModelKey[] = ["dna", "cell"];
            modelKeys.forEach((model) => gsap.to(scene[model], { o: model === key ? 1 : 0, duration: media.matches ? 0 : .85, overwrite: "auto" }));
            if (key === "dna" || key === "cell") {
              const compact = window.innerWidth < 768;
              gsap.to(scene[key], {
                x: compact ? 0 : 1.4,
                y: compact ? 0 : .05,
                s: compact ? .58 : key === "cell" ? .82 : .7,
                rz: key === "dna" ? -.2 : 0, rx: key === "dna" ? .12 : 0,
                duration: media.matches ? 0 : 1.4, ease: "power3.inOut", overwrite: "auto",
              });
              if (!media.matches) gsap.to(scene[key], { ry: "+=1.2", duration: 1.8, ease: "power2.inOut" });
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
    <div className="cinematic-home" ref={root}>
      <a className="cine-skip" href="#home-content">Skip to content</a>
      <Loader />
      <Scene cinematic paused={paused || reduce} lightBackground={lightStage} />
      <div className="cine-progress" aria-hidden="true"><div className="cine-progress-fill" /></div>
      <main id="home-content" className="cine-main">
        <section className="cine-hero cine-section cine-light" id="intro" data-cinema-model="none">
          <div className="cine-hero-grid" aria-hidden="true" />
          <div className="cine-hero-stage" aria-hidden="true">
            <div className="cine-hero-word">BIOVITY</div>
          </div>
          <InlineHelix className="cine-hero-helix" showOnMobile paused={paused || reduce} cameraDistance={5.8} />
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
          {heroFilmCaptions.map((caption, index) => <a href={`#${stages[index]}`} key={caption.name}><span><span className="cine-numeral"><TabularDigits value={String(index + 1).padStart(2, "0")} /></span> {caption.name}</span><strong>{caption.line}</strong><Arrow /></a>)}
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
          <div className="cine-narrow" data-cine-reveal><h2><BrandType text={protocol.title} /></h2><p className="cine-lead">{protocol.body}</p></div>
          <div className="cine-stage-list">{protocol.steps.map(([number, name, line], index) => <a key={name} href={`#${stages[index]}`} data-cine-reveal><span className={`cine-stage-symbol symbol-${index}`} aria-hidden="true"><i /><i /><i /></span><span className="cine-stage-index"><TabularDigits value={number} /></span><span className="cine-stage-title">{name}</span><span className="cine-stage-description">{line}</span><Arrow /></a>)}</div>
        </section>

        <Chapter id="discover" number="01" label={heroSlides[1].tag} title={journey.steps[0].line} lead={journey.steps[0].text} model="dna" light className="cine-discover">
          <div className="cine-copy-panel" data-cine-reveal><p className="cine-label">{journey.steps[0].leavesLabel}</p><ul className="cine-check-list">{journey.steps[0].leaves?.map((item) => <li key={item}><span>↗</span>{item}</li>)}</ul><Action>{journey.steps[0].cta}</Action></div>
        </Chapter>

        <Chapter id="bioblueprint" number="02" label={blueprint.eyebrow} title={blueprint.title.join(" ")} lead={blueprint.intro} model="cell" light className="cine-blueprint">
          <div className="cine-test-grid">{blueprint.tests.map((test, index) => <article className="cine-test-card" key={test.label} data-cine-reveal><div className="cine-test-card-top"><span><TabularDigits value={String(index + 1).padStart(2, "0")} /></span><span className="cine-mini-orbit" aria-hidden="true" /></div><p className="cine-label">{test.label}</p><h3>{test.caption}</h3><p>{test.text}</p></article>)}</div>
          <p className="cine-footnote" data-cine-reveal>{blueprint.smallPrint}</p>
        </Chapter>

        <Chapter id="twin" label="Your dashboard" title={twin.title} lead={twin.dashboard} className="cine-twin">
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
          <ol className="cine-process-list">{howCellution.steps.map((step) => <li key={step.n} data-cine-reveal><span><TabularDigits value={step.n} /></span><div><h3>{step.name}</h3><p>{step.text}</p></div></li>)}</ol>
          <div className="cine-process-end" data-cine-reveal><div><p className="cine-label">THREE AREAS</p><ul>{howCellution.areas.map((area) => <li key={area}>{area}</li>)}</ul></div><div><p>{howCellution.disclaimer}</p><Action interest="CELLUTION">{howCellution.cta}</Action></div></div>
        </section>

        <Chapter id="continuum" number="05" label={continuum.eyebrow} title={continuum.title} lead={continuum.body} model="dna" light className="cine-continuum">
          <div className="cine-copy-panel" data-cine-reveal><p className="cine-label">IT CAN INCLUDE</p><ul className="cine-membership-list">{continuum.items.map((item, index) => <li key={item}><span><TabularDigits value={String(index + 1).padStart(2, "0")} /></span>{item}</li>)}</ul><p>{continuum.welcome}</p><p className="cine-footnote">{continuum.note}</p><Action interest="CONTINUUM">{continuum.cta}</Action></div>
        </Chapter>

        <section id="biology" className="cine-section cine-dashboard" data-cinema-model="none">
          <div className="cine-section-top"><span>{biology.sample}</span></div><div className="cine-narrow" data-cine-reveal><h2>{biology.headline}</h2><p className="cine-lead">{biology.body}</p></div>
          <div className="cine-dashboard-grid">{[biology.start, biology.later].map((label, index) => <article key={label} data-selected={comparison === index} data-cine-reveal><button type="button" className="cine-comparison-select" aria-pressed={comparison === index} onClick={() => setComparison(index)}>{label}</button><div className="cine-dashboard-orbit" aria-hidden="true"><span /><i /><i /></div>{biology.zones.map((name) => <div className="cine-data-row" key={name}><span>{name}</span><small>{twin.sample}</small></div>)}</article>)}</div><p className="cine-footnote">{biology.sample}</p>
        </section>


        <section id="founder" className="cine-section cine-light cine-founder" data-cinema-model="none"><SectionTransition />
          <div className="cine-section-top"><span>The founder</span></div>
          <div className="cine-founder-grid">
            <Image
              className="cine-founder-image"
              src="/images/founder-microscope.webp"
              alt="Microscope lens above a liquid sample"
              width={1448}
              height={1086}
            />
            <div data-cine-reveal>
              <p className="cine-label">THE FOUNDER</p>
              <h2>{founder.headline}</h2>
              <p className="cine-founder-name">{founder.name}</p>
              <p className="cine-label">{founder.title}</p>
              <p>{founder.body}</p>
              <Link className="cine-text-link" href="/founder">MEET THE FOUNDER<Arrow /></Link>
            </div>
          </div>
          <div className="cine-team" id="team" data-cine-reveal>
            <p className="cine-label">OUR TEAM</p>
            <h3>{team.headline}</h3>
            <p>{team.body}</p>
            <ul className="cine-team-cards">
              {demoTeamProfiles.map(({ name, role, registration, portrait }) => (
                <li key={registration}>
                  <ReflectiveCard
                    className="cine-team-reflector"
                    theme="light"
                    name={name}
                    role={role}
                    badge=""
                    status=""
                    idLabel="Demo reg. no."
                    idValue={registration}
                    media={
                      <Image
                        className="cine-team-portrait"
                        src={`/images/${portrait}`}
                        alt=""
                        width={720}
                        height={960}
                      />
                    }
                    showIdIcon={false}
                    width="100%"
                    height={420}
                    radius={22}
                    webcam={false}
                    intro={false}
                    tiltStrength={5}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="centre" className="cine-section cine-centre" data-cinema-model="none"><div className="cine-section-top"><span>{centre.label}</span></div><div className="cine-centre-grid"><div data-cine-reveal><p className="cine-label">{centre.label}</p><h2>{centre.title}</h2><p className="cine-lead">{centre.body}</p><Link href={centre.href} className="cine-button">{centre.cta}<Arrow /></Link></div><figure data-cine-reveal><img src={centre.image} alt="BIOVITY Centre visual" loading="lazy" /><figcaption>{centre.eyebrow}</figcaption></figure></div></section>

        <section id="questions" className="cine-section cine-light cine-faq" data-cinema-model="none"><SectionTransition /><div className="cine-section-top"><span>Questions people ask</span></div><div className="cine-faq-grid"><h2 data-cine-reveal>Questions<br />people ask.</h2><div>{homepageFaqs.map((faq, index) => <details key={faq.q} data-cine-reveal><summary><span><TabularDigits value={String(index + 1).padStart(2, "0")} /></span>{faq.q}<i>+</i></summary><p>{faq.a}</p></details>)}</div></div></section>

        <footer id="contact" className="cine-section cine-footer" data-cinema-model="none">
          <div className="cine-footer-intro">
            <div className="cine-footer-opening" data-cine-reveal>
              <div className="cine-section-top"><span>{contact.eyebrow}</span></div>
              <h2>{contact.title}</h2>
              <p className="cine-lead">{contact.body}</p>
              <div className="cine-actions">
                <Action>{contact.primary}</Action>
                <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="cine-text-link">{contact.secondary}<Arrow /></a>
              </div>
            </div>
            <InlineHelix className="cine-footer-helix" />
          </div>
          <FooterColumns />
          <div className="cine-footer-word" aria-hidden="true">BIOVITY</div>
        </footer>
      </main>

      <aside className="cine-chapter-rail" aria-label="Jump to a THOP step">{stages.map((id, index) => <a key={id} href={`#${id}`} className={chapter === id ? "active" : ""} aria-current={chapter === id ? "step" : undefined}><span><TabularDigits value={String(index + 1).padStart(2, "0")} /></span><i /><span>{id}</span></a>)}</aside>
      <a className="cine-concierge" href={brand.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp BIOVITY"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" stroke="currentColor" strokeWidth="1.4" /><path d="M8 7c0 5 3 8 8 9" stroke="currentColor" strokeWidth="1.4" /></svg><span>WhatsApp BIOVITY</span></a>
    </div>
  );
}
