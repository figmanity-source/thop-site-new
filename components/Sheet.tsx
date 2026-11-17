import Link from "next/link";
import type { ReactNode } from "react";
import EnquireButton from "./EnquireButton";
import HeroParticles from "./HeroParticles";
import type { Interest } from "@/lib/content";

export function SheetHero({
  word,
  kicker,
  title,
  lead,
  night = false,
  children,
}: {
  word: string;
  kicker?: string;
  title: string;
  lead?: string;
  night?: boolean;
  children?: ReactNode;
}) {
  return (
    <header className={night ? "sheet-hero night" : "sheet-hero"}>
      <HeroParticles night={night} />
      <div className="sheet-hero-copy">
        {kicker ? <p className="home-kicker">{kicker}</p> : null}
        <p className="sheet-word" style={{ fontSize: `clamp(48px, ${Math.min(12, 90 / Math.max(word.length, 6))}vw, 160px)` }}>{word}</p>
        <h1 className="sheet-title">{title}</h1>
        {lead ? <p className="sheet-lead">{lead}</p> : null}
        {children}
      </div>
    </header>
  );
}

export function SheetBand({
  id,
  kicker,
  title,
  lead,
  night = false,
  object,
  children,
}: {
  id?: string;
  kicker?: string;
  title?: string;
  lead?: string;
  night?: boolean;
  object?: "dna" | "cell" | "twin";
  children?: ReactNode;
}) {
  return (
    <section id={id} data-object={object} className={night ? "home-block sheet-band surface-night" : "home-block sheet-band"}>
      <div className="home-inner">
        {kicker ? <p className="home-kicker" data-reveal="">{kicker}</p> : null}
        {title ? <h2 data-reveal="">{title}</h2> : null}
        {lead ? <p className="home-lead" data-reveal="">{lead}</p> : null}
        {children ? <div data-reveal="">{children}</div> : null}
      </div>
    </section>
  );
}

export function Numbered({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <ol className="sheet-steps">
      {rows.map(([n, name, text]) => (
        <li key={n}>
          <span>{n}</span>
          <div>
            <h3>{name}</h3>
            <p>{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="sheet-points">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

export function BookButton({ interest, children }: { interest: Interest; children: ReactNode }) {
  return <EnquireButton interest={interest}>{children}</EnquireButton>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="sheet-text-link" href={href}>{children}</Link>;
}
