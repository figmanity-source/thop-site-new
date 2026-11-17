"use client";
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { brand, contact } from "@/lib/content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import Header from "./Header";
import { EnquiryProvider } from "./Enquiry";
import EnquireButton from "./EnquireButton";
import InnerStage from "./three/InnerStage";
import StageMotion from "./StageMotion";
import { FooterColumns, WhatsAppFloat } from "./SiteFooter";

/** Shared chrome for the pages behind each navigation item. */
export default function PageFrame({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, anchors: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const hash = window.location.hash;
    const dest = hash ? document.querySelector(hash) : null;
    if (dest) lenis.scrollTo(dest, { immediate: true });
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <EnquiryProvider>
      <InnerStage />
      <StageMotion />
      <Header />
      <WhatsAppFloat />
      <main className="subpage">{children}</main>
      <footer className="subpage-footer">
        <div>
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
    </EnquiryProvider>
  );
}
