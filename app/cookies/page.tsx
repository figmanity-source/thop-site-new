import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Cookie Policy — BIOVITY",
  description: "What cookies we use and how to control them.",
};

export default function Page() {
  return (
    <PageFrame>
      <SheetHero word="Legal" title="Cookie Policy" lead="What cookies we use and how to control them." />
    </PageFrame>
  );
}
