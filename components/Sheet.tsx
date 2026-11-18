import Link from "next/link";
import type { ReactNode } from "react";
import EnquireButton from "./EnquireButton";
import HeroParticles from "./HeroParticles";
import { BrandType } from "./BrandType";
import { TabularDigits } from "./TabularDigits";
import type { Interest } from "@/lib/content";
import SectionTransition from "./home/SectionTransition";

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
        <p className="sheet-word"><BrandType text={word} /></p>
        <h1 className="sheet-title"><BrandType text={title} /></h1>
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
  headingVisual,
  children,
}: {
  id?: string;
  kicker?: string;
  title?: string;
  lead?: string;
  night?: boolean;
  object?: "dna" | "cell" | "twin";
  headingVisual?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} data-object={object} className={night ? "home-block sheet-band surface-night" : "home-block sheet-band"}>
      {night && <SectionTransition />}
      <div className="home-inner">
        {(kicker || title || headingVisual) && <div className="sheet-band-heading">
        {kicker ? <p className="home-kicker" data-reveal="">{kicker}</p> : null}
        {title ? <h2><BrandType text={title} /></h2> : null}
        {headingVisual}
        </div>}
        <div className="sheet-band-content">
        {lead ? <p className="home-lead" data-reveal="">{lead}</p> : null}
        {children ? <div data-reveal="">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}

export function Numbered({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <ol className="sheet-steps">
      {rows.map(([n, name, text]) => (
        <li key={n}>
          <span><TabularDigits value={n} /></span>
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
