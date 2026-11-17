import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Privacy Policy — BIOVITY",
  description: "What we collect, why, how long we keep it, your rights.",
};

export default function Page() {
  return (
    <PageFrame>
      <SheetHero word="Legal" title="Privacy Policy" lead="What we collect, why, how long we keep it, your rights." />
      <SheetBand>
        <p className="home-lead">A named contact for privacy questions and complaints, as required under the Digital Personal Data Protection Act.</p>
      </SheetBand>
    </PageFrame>
  );
}
