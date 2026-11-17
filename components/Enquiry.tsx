"use client";
import { createContext, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { enquiry, interests, type Interest } from "@/lib/content";
import { getLenis } from "@/lib/lenis";

const EnquiryContext = createContext<(interest: Interest) => void>(() => {});

export function useEnquiry() {
  return useContext(EnquiryContext);
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [interest, setInterest] = useState<Interest | null>(null);
  return (
    <EnquiryContext.Provider value={setInterest}>
      {children}
      <EnquiryDialog interest={interest} onClose={() => setInterest(null)} />
    </EnquiryContext.Provider>
  );
}

export function EnquiryForm({ interest, submitLabel }: { interest: Interest; submitLabel: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    const name = String(data.get("name") ?? "").trim();
    const mobile = String(data.get("mobile") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const reach = String(data.get("reach") ?? "");
    const chosen = String(data.get("interest") ?? "");
    const consent = data.get("consent");
    if (!name) next.name = "Enter your full name.";
    if (!/^[+\d][\d\s()-]{7,}$/.test(mobile)) next.mobile = "Enter a mobile number with country code.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email.";
    if (!interests.includes(chosen as Interest)) next.interest = "Choose what you are interested in.";
    if (!city) next.city = "Enter your city.";
    if (!["WhatsApp", "Call", "Email"].includes(reach)) next.reach = "Choose how we should reach you.";
    if (!consent) next.consent = "Consent is required before this form can be used.";
    setErrors(next);
    setPending(Object.keys(next).length === 0);
  };

  return (
    <form onSubmit={submit} noValidate>
      <label>Full name<input name="name" autoComplete="name" aria-invalid={!!errors.name} />{errors.name && <span className="enquiry-error">{errors.name}</span>}</label>
      <label>Mobile number (with country code)<input name="mobile" type="tel" autoComplete="tel" aria-invalid={!!errors.mobile} />{errors.mobile && <span className="enquiry-error">{errors.mobile}</span>}</label>
      <label>Email<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />{errors.email && <span className="enquiry-error">{errors.email}</span>}</label>
      <label>I’m interested in
        <select name="interest" defaultValue={interest} aria-invalid={!!errors.interest}>
          {interests.map((item) => <option key={item}>{item}</option>)}
        </select>
        {errors.interest && <span className="enquiry-error">{errors.interest}</span>}
      </label>
      <label>City<input name="city" autoComplete="address-level2" aria-invalid={!!errors.city} />{errors.city && <span className="enquiry-error">{errors.city}</span>}</label>
      <fieldset>
        <legend>Best way to reach you</legend>
        {["WhatsApp", "Call", "Email"].map((way) => (
          <label key={way} className="enquiry-choice"><input type="radio" name="reach" value={way} />{way}</label>
        ))}
        {errors.reach && <span className="enquiry-error">{errors.reach}</span>}
      </fieldset>
      <label>Anything you’d like us to know (optional)<textarea name="note" rows={3} /></label>
      <label className="enquiry-check">
        <input type="checkbox" name="consent" value="yes" />
        <span>I agree to be contacted and to BIOVITY’s <Link href="/privacy">privacy policy</Link></span>
      </label>
      {errors.consent && <span className="enquiry-error">{errors.consent}</span>}
      <button className="pill" type="submit">{submitLabel}</button>
      {pending && <p className="enquiry-status" role="status">{enquiry.notSent}</p>}
    </form>
  );
}

function EnquiryDialog({ interest, onClose }: { interest: Interest | null; onClose: () => void }) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!interest) return;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    const field = panel.current?.querySelector<HTMLElement>("input[name=name]");
    field?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab" || !panel.current) return;
      const items = [...panel.current.querySelectorAll<HTMLElement>("input, select, textarea, button, a")].filter((el) => !el.hasAttribute("disabled"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      prev?.focus();
    };
  }, [interest]);

  if (!interest || typeof document === "undefined") return null;

  return createPortal(
    <div className="enquiry-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="enquiry-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button type="button" className="enquiry-close" onClick={onClose}>Close</button>
        <h2 id={titleId}>{enquiry.headline}</h2>
        <p className="enquiry-body">{enquiry.body}</p>
        <EnquiryForm key={interest} interest={interest} submitLabel="BEGIN YOUR JOURNEY" />
      </div>
    </div>,
    document.body,
  );
}
