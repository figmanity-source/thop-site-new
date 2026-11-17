import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Medical Disclaimer — BIOVITY",
  description: "The website gives general information, not medical advice.",
};

export default function Page() {
  return (
    <PageFrame>
      <SheetHero word="Legal" title="Medical Disclaimer" lead="The website gives general information, not medical advice." />
      <SheetBand>
        <p className="home-lead">{contact.disclaimer}</p>
      </SheetBand>
    </PageFrame>
  );
}
