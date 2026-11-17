import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";
import { centreRooms } from "@/lib/pages";
import { brand, centre } from "@/lib/content";

export const metadata: Metadata = {
  title: "The BIOVITY Centre — Mumbai",
  description: "Quiet. Private. Discreet. Everything happens under one roof: your consultation, your tests, your results and your treatment.",
};

export default function CentrePage() {
  return (
    <PageFrame>
      <SheetHero
        word="Centre"
        kicker="THE BIOVITY CENTRE · MUMBAI"
        title="A calm space, designed for clarity."
        lead="Quiet. Private. Discreet. Everything happens under one roof: your consultation, your tests, your results and your treatment."
        night
      />
      <SheetBand>
        <img className="subpage-photo" src={centre.image} alt="" />
      </SheetBand>
      <SheetBand night>
        <ol className="sheet-steps">
          {centreRooms.map(([name, text], i) => (
            <li key={name}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{name}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </SheetBand>
      <SheetBand title="Find us in Mumbai.">
        <ul className="sheet-points">
          <li>Address [to be supplied]</li>
          <li>Opening hours [to be supplied]</li>
          <li>Parking and drop-off [to be supplied]</li>
          <li>Discreet entry [if available]</li>
        </ul>
        <p className="home-lead">Your coordinator sends you everything you need: time, directions, and what to bring.</p>
        <div className="sheet-actions">
          <span className="pill">GET DIRECTIONS</span>
          <a className="pill" href={brand.whatsapp} target="_blank" rel="noreferrer">WHATSAPP BIOVITY</a>
        </div>
      </SheetBand>
    </PageFrame>
  );
}
