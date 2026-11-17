"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/content";
import { useEnquiry } from "./Enquiry";
import { NE } from "./Icons";

const links = [
  { label: "THOP", href: "/" },
  { label: "Pathways", href: "/pathways" },
  { label: "Science", href: "/science" },
  { label: "Your Journey", href: "/your-journey" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
] as const;

const aboutPaths = ["/about", "/founder", "/team", "/ethics-committee"];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const pathname = usePathname();
  const openEnquiry = useEnquiry();
  const close = () => setOpen(false);

  useEffect(() => {
    const band = 64;
    let current = false;
    let frame = 0;
    const overlaps = (node: Element) => {
      const rect = node.getBoundingClientRect();
      return rect.top < band && rect.bottom > 12;
    };
    const check = () => {
      let hit = [...document.querySelectorAll("[data-section='Mechanism'], [data-section='Biology'], .surface-night, .sheet-hero.night")].some(overlaps);
      const movement = document.querySelector("[data-section='Movement']");
      if (movement) {
        const rect = movement.getBoundingClientRect();
        hit = hit || (rect.top < band && rect.top + rect.height * 0.72 > 12);
      }
      const colors = document.querySelector("[data-section='Colors']");
      if (colors) {
        const rect = colors.getBoundingClientRect();
        if (rect.height > 0) {
          const progress = (band - rect.top) / rect.height;
          hit = hit || (progress > 0.18 && progress < 0.8);
        }
      }
      if (hit !== current) {
        current = hit;
        setOnDark(hit);
      }
    };
    const loop = () => {
      check();
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);
    window.addEventListener("resize", check);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => { close(); }, [pathname]);

  const current = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/about") return aboutPaths.includes(pathname);
    if (href === "/pathways") return pathname === "/pathways" || pathname.startsWith("/pathways/");
    return pathname === href;
  };

  return (
    <header id="header" className={[open ? "menu-open" : "", onDark ? "on-dark" : ""].filter(Boolean).join(" ")}>
      <Link className="logo" href="/" onClick={close}>
        <span>{brand.name}</span>
        <small>{brand.tagline}</small>
      </Link>
      <nav className={open ? "open" : ""}>
        {links.map((item) => (
          <Link key={item.href} href={item.href} onClick={close} aria-current={current(item.href) ? "page" : undefined}>{item.label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="sign-in" href="/member-login" aria-label="Sign in" onClick={close}>
          <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden>
            <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" />
            <circle cx="16" cy="12.5" r="3.2" fill="none" stroke="currentColor" />
            <path d="M9.2 23.2c1.5-2.7 3.8-4 6.8-4s5.3 1.3 6.8 4" fill="none" stroke="currentColor" />
          </svg>
        </Link>
        <button className="enquire" onClick={() => { close(); openEnquiry("THOP"); }}>BEGIN YOUR JOURNEY <NE /></button>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
