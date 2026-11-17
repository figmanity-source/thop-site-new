import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import Hallmarks from "@/components/Hallmarks";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Science — BIOVITY",
  description: "This page explains the science behind what we do. No jargon. Just the ideas that matter.",
};

const topics = [
  "Biological ageing and biomarkers",
  "Cellular biology",
  "Metabolic health",
  "Nutrition and your genes",
  "Antioxidants and carotenoids",
  "Telomeres",
  "Sugars and ageing (glycobiology)",
  "Regenerative medicine",
  "Recovery and movement",
];

export default function SciencePage() {
  return (
    <PageFrame>
      <SheetHero word="Science" title="Beyond the surface. Into the biology.">
        <p className="sheet-lead">Technology is not the goal. Understanding you is.</p>
        <p className="sheet-lead">This page explains the science behind what we do. No jargon. Just the ideas that matter.</p>
      </SheetHero>
      <SheetBand title="Your birthday tells one story. Your cells tell another." lead="Your chronological age is how many birthdays you’ve had. Your biological age is how old your body behaves. Two people born in the same year can age at very different speeds. Genes play a part. But so do food, sleep, stress and exercise. And many of those can be changed." />
      <SheetBand title="Scientists have mapped 12 ways the body ages." lead="In 2023, researchers listed twelve connected changes that happen as we age. They help us know where to look. Tap any one to learn more." night>
        <Hallmarks />
        <p className="home-lead">López-Otín C. et al. Hallmarks of aging: An expanding universe. Cell, 2023.</p>
      </SheetBand>
      <SheetBand title="How our tests work.">
        <ul className="value-grid">
          <li>
            <h3>Light</h3>
            <p>Light can tell us about your cells. Our fingertip scanner shines light through your skin and takes more than 700,000 readings. It measures carotenoids: antioxidants from colourful fruit and vegetables that help protect your cells.</p>
          </li>
          <li>
            <h3>Blood</h3>
            <p>Your blood carries signals from every organ. One blood draw shows us how your metabolism, organs and cells are working.</p>
          </li>
          <li>
            <h3>Genes</h3>
            <p>Your genes don’t change. But knowing them helps you choose the food, exercise and sleep that suit your body best.</p>
          </li>
        </ul>
      </SheetBand>
      <SheetBand title="Stem cells: your body’s repair team." lead="Stem cells can turn into other types of cells. They help your body repair itself. They live in special spots called niches, such as your bone marrow. As we age, they become fewer and slower. That’s why DOX prepares your body first. And why CELLUTION uses your own cells.">
        <p className="home-lead">Your platelets, tiny cells in your blood, carry growth factors. These are signals that tell your body to start repairing. CELLUTION uses both: your own repair signals and your own repair cells.</p>
      </SheetBand>
      <SheetBand lead="Each test has a specific job. No single result tells the whole story of your health.">
        <ul className="topic-row">
          {topics.map((topic) => <li key={topic}>{topic}</li>)}
        </ul>
      </SheetBand>
    </PageFrame>
  );
}
