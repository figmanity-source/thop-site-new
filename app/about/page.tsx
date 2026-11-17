import type { Metadata } from "next";
import Link from "next/link";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "About us — BIOVITY",
  description: "BIOVITY is a biological longevity centre in Mumbai. We measure what’s happening inside your body. We explain it in plain words. Then we build a plan with you, and stay with you as you change.",
};

const values = [
  ["Curious", "we follow the science"],
  ["Personal", "every plan is built for one person"],
  ["Clear", "we explain everything in plain words"],
  ["Careful", "we use technology responsibly"],
  ["Together", "doctors, scientists and you, working as one team"],
  ["For the long run", "we stay with you over time"],
];

export default function AboutPage() {
  return (
    <PageFrame>
      <SheetHero
        word="About"
        title="We help you understand your body, and act early."
        lead="BIOVITY is a biological longevity centre in Mumbai. We measure what’s happening inside your body. We explain it in plain words. Then we build a plan with you, and stay with you as you change. Everything we do is organised around THOP, our five-step journey."
      />
      <SheetBand kicker="Why we exist" lead="Healthcare is often split up and confusing. We wanted one place where your tests, your doctors and your plan finally connect." />
      <SheetBand kicker="What we believe">
        <ul className="value-grid">
          {values.map(([name, line]) => (
            <li key={name}><h3>{name}</h3><p>{line}</p></li>
          ))}
        </ul>
        <p className="home-lead">Information about your body is only useful when you understand it.</p>
        <div className="sheet-actions">
          <Link className="pill" href="/founder">MEET THE FOUNDER</Link>
          <Link className="pill" href="/team">MEET THE TEAM</Link>
        </div>
      </SheetBand>
    </PageFrame>
  );
}
