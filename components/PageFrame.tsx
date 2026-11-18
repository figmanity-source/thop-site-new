"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { brand, contact } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import Header from "./Header";
import { EnquiryProvider } from "./Enquiry";
import EnquireButton from "./EnquireButton";
import StageMotion from "./StageMotion";
import { FooterColumns, WhatsAppFloat } from "./SiteFooter";
import SectionTransition from "./home/SectionTransition";
import "../styles/inner-pages.css";

const InnerStage = dynamic(() => import("./three/InnerStage"), { ssr: false });

/** Shared chrome for the pages behind each navigation item. */
export default function PageFrame({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [hasModels, setHasModels] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const update = () => setHasModels(desktop.matches && !!root.current?.querySelector("[data-object]"));
    update(); desktop.addEventListener("change", update);
    return () => desktop.removeEventListener("change", update);
  }, [pathname]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const hash = window.location.hash;
    const dest = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (dest) lenis.scrollTo(dest, { immediate: true });
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [pathname]);

  return (
    <EnquiryProvider>
      <div className="inner-experience" ref={root}>
      <a href="#inner-content" className="inner-skip">Skip to content</a>
      <div className="inner-progress" aria-hidden="true"><i /></div>
      {hasModels && <InnerStage />}
      <StageMotion />
      <Header variant="inner" />
      <WhatsAppFloat />
      <main className="subpage" id="inner-content">{children}</main>
      <footer className="subpage-footer">
        <SectionTransition />
        <div className="inner-footer-intro">
          <p className="caption-dark">{contact.eyebrow}</p>
          <p className="footer-title">{contact.title}</p>
          <p className="footer-body">{contact.body}</p>
          <div className="footer-buttons">
            <EnquireButton interest="THOP">{contact.primary}</EnquireButton>
            <a className="pill" href={brand.whatsapp} target="_blank" rel="noreferrer">{contact.secondary}</a>
          </div>
        </div>
        <FooterColumns />
      </footer>
      </div>
    </EnquiryProvider>
  );
}
