import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Founder — BIOVITY",
  description: "Dr Praj Shendge, Founder & Scientific Director, BIOVITY. Founder, THOP.",
};

const before = [
  "My journey into longevity started long before BIOVITY.",
  "I studied and worked in biotechnology, embryology, stem cells and regenerative medicine. I spent more than ten years doing this in the United Kingdom.",
  "Along the way, one question stayed with me.",
];

const after = [
  "Science has come so far. We understand genes, cells and metabolism better than ever. But for patients, care still feels split up. Lots of tests. Lots of specialists. Very little that connects.",
  "I wanted to build something different. That became BIOVITY. And from BIOVITY came THOP, The Human Optimisation Protocol: five clear steps, from understanding your body to staying with you over time.",
  "I believe health should be about more than treating illness. It should be about understanding the biology that shapes your life. That’s what BIOVITY is here to do.",
];

export default function FounderPage() {
  return (
    <PageFrame>
      <SheetHero word="Founder" title="A vision shaped by science, and by people." lead="Dr Praj Shendge · Founder & Scientific Director, BIOVITY · Founder, THOP" />
      <SheetBand>
        {before.map((paragraph) => <p className="home-lead" key={paragraph}>{paragraph}</p>)}
        <blockquote className="sheet-quote">What if we looked at the whole person, instead of one part at a time?</blockquote>
        {after.map((paragraph) => <p className="home-lead" key={paragraph}>{paragraph}</p>)}
        <p className="home-kicker">Dr Praj Shendge · Founder & Scientific Director, BIOVITY</p>
      </SheetBand>
    </PageFrame>
  );
}
