import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero } from "@/components/Sheet";

export const metadata: Metadata = { title: "404 — BIOVITY" };

export default function NotFound() {
  return (
    <PageFrame>
      <SheetHero word="404" title="404" />
    </PageFrame>
  );
}
