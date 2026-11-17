import type { Metadata } from "next";
import Link from "next/link";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";
import { pathways } from "@/lib/pages";

export const metadata: Metadata = {
  title: "Pathways — BIOVITY",
  description: "Everyone comes to us for a different reason. Pick the one that sounds most like you. We’ll show you how THOP works for your goal.",
};

export default function PathwaysPage() {
  return (
    <PageFrame>
      <SheetHero
        word="Pathways"
        title="Different goals. Different journeys."
        lead="Everyone comes to us for a different reason. Pick the one that sounds most like you. We’ll show you how THOP works for your goal."
      >
        <Link className="pill" href="/your-journey#self-check">TAKE THE SELF-CHECK</Link>
      </SheetHero>
      <SheetBand>
        <ul className="pathway-grid">
          {pathways.map((item, i) => (
            <li key={item.slug}>
              <Link href={`/pathways/${item.slug}`}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{item.name}</h3>
                <p>{item.card}</p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="home-kicker">Not sure?</p>
        <p className="home-lead">Most people fit more than one. Take our 3-minute Self-Check and we’ll suggest where to start.</p>
      </SheetBand>
    </PageFrame>
  );
}
