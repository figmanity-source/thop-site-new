import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand, BulletList } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Ethics Committee — BIOVITY",
  description: "New treatments need careful oversight. Our Ethics Committee makes sure every clinical programme at BIOVITY puts your safety, your rights and your informed consent first.",
};

export default function EthicsPage() {
  return (
    <PageFrame>
      <SheetHero
        word="Ethics"
        title="Independent eyes on everything we do."
        lead="New treatments need careful oversight. Our Ethics Committee makes sure every clinical programme at BIOVITY puts your safety, your rights and your informed consent first."
      />
      <SheetBand kicker="What it does">
        <BulletList items={[
          "Reviews every new clinical protocol before it starts",
          "Checks that consent forms are clear and complete",
          "Monitors safety and reports from patients",
          "Can pause or stop a programme if needed",
        ]} />
      </SheetBand>
      <SheetBand kicker="Who sits on it" lead="A mix of doctors, scientists, a legal expert and independent members from outside BIOVITY." />
      <SheetBand kicker="Registration" lead="[Registration number and registering body, to be supplied]" />
      <SheetBand kicker="Raise a concern" lead="Have a question or concern about your care? Contact the Ethics Committee directly at [email to be supplied]." />
    </PageFrame>
  );
}
