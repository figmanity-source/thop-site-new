import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Meet the team — BIOVITY",
  description: "Every medical decision at BIOVITY is made by a registered doctor. Here’s who you’ll meet, and what they’re qualified to do.",
};

const groups = [
  "Doctors and specialists",
  "Scientists and lab team",
  "Patient care and coordination",
  "Advisers (optional)",
];

export default function TeamPage() {
  return (
    <PageFrame>
      <SheetHero
        word="Team"
        title="The people behind your care."
        lead="Every medical decision at BIOVITY is made by a registered doctor. Here’s who you’ll meet, and what they’re qualified to do."
      />
      <SheetBand>
        <ul className="value-grid">
          {groups.map((group) => (
            <li key={group}><h3>{group}</h3></li>
          ))}
        </ul>
        <p className="home-lead">Our diagnostic and technology partners, with their logos.</p>
      </SheetBand>
    </PageFrame>
  );
}
