import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "The BIOVITY Journal",
  description: "The science of your body, explained simply.",
};

const categories: [string, string[]][] = [
  ["Biological ageing", ["What is biological age?", "What your blood can tell you", "How ageing tests work"]],
  ["Cells", ["Mitochondria, your power stations", "‘Zombie’ cells", "Telomeres", "What are stem cells?"]],
  ["Metabolic health", ["Insulin resistance, explained", "Blood sugar", "Metabolic health in India", "Food and risk"]],
  ["Women’s biology", ["Ovarian reserve", "Perimenopause", "Hormones", "Fertility"]],
  ["Regenerative medicine", ["PRP and growth factors", "BMAC explained", "Your own cells vs donor cells"]],
  ["The THOP journey", ["Inside BIOBLUEPRINT", "Your Biological Twin", "Inside DOX", "What happens at the Reveal"]],
];

const formats = [
  "Longevity, Examined: popular claims, checked against the science",
  "Ask the Scientist: short videos with Dr Praj (cut-downs for Instagram)",
  "Quick Reads: one-page explainers",
  "The BIOVITY Brief: a monthly email newsletter",
];

export default function JournalPage() {
  return (
    <PageFrame>
      <SheetHero word="Journal" title="The BIOVITY Journal." lead="The science of your body, explained simply." />
      <SheetBand kicker="Categories and first topics">
        {categories.map(([name, topics]) => (
          <div key={name}>
            <h3>{name}</h3>
            <ul className="sheet-points">
              {topics.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </div>
        ))}
      </SheetBand>
      <SheetBand kicker="Formats">
        <ul className="sheet-points">
          {formats.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </SheetBand>
    </PageFrame>
  );
}
