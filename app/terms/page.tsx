import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Terms of Use — BIOVITY",
  description: "The rules for using the website.",
};

export default function Page() {
  return (
    <PageFrame>
      <SheetHero word="Legal" title="Terms of Use" lead="The rules for using the website." />
    </PageFrame>
  );
}
