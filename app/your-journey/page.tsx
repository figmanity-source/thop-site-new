import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import SelfCheck from "@/components/SelfCheck";
import { EnquiryForm } from "@/components/Enquiry";
import { SheetHero, SheetBand, BookButton, BulletList } from "@/components/Sheet";
import JourneyLine from "@/components/JourneyLine";
import VisitFaq from "@/components/VisitFaq";
import { InlineHelix } from "@/components/three/InnerStage";
import { journeySteps, centreRooms } from "@/lib/pages";
import { brand, centre } from "@/lib/content";

export const metadata: Metadata = {
  title: "Your Journey — BIOVITY",
  description: "Here’s exactly what happens, from your first message to your follow-ups. No surprises. No confusion.",
};

const visitFaqs = [
  ["How long is my first visit?", "[To be confirmed by BIOVITY]."],
  ["Do I need a doctor’s referral?", "[To be confirmed by BIOVITY]."],
  ["Can I bring someone with me?", "[To be confirmed by BIOVITY]."],
  ["What should I bring?", "Any recent reports, a list of your medicines, and your questions."],
] as const;

export default function YourJourneyPage() {
  return (
    <PageFrame>
      <SheetHero
        word="Journey"
        title="Your journey starts with a conversation."
        lead="Here’s exactly what happens, from your first message to your follow-ups. No surprises. No confusion."
      />
      <SheetBand id="steps">
        <JourneyLine rows={journeySteps} />
        <BookButton interest="THOP">BOOK YOUR FIRST CONSULTATION</BookButton>
      </SheetBand>
      <SheetBand title="Advanced science. Personal care." lead="Science can be complicated. Your care shouldn’t be. Here’s what you can count on." night>
        <BulletList items={[
          "One coordinator who looks after you",
          "A clear explanation before every test",
          "Your results explained in person",
          "A written plan you can keep",
          "The right specialists, brought in when needed",
          "Follow-ups and re-tests",
        ]} />
        <p className="home-lead">You’ll never leave with a pile of reports and no idea what they mean.</p>
      </SheetBand>
      <SheetBand id="self-check" title="Not sure where to start?" lead="Answer 12 quick questions. It takes about three minutes. We’ll suggest the best first step for you.">
        <SelfCheck />
      </SheetBand>
      <SheetBand id="centre" kicker={centre.eyebrow} title="A calm space, designed for clarity." lead="Quiet. Private. Discreet. Everything happens under one roof: your consultation, your tests, your results and your treatment." night>
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
      <SheetBand title="Find us in Mumbai." headingVisual={<InlineHelix />}>
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
      <SheetBand id="concierge" kicker="YOUR COORDINATOR" title="One person looks after you." lead="Your coordinator books your visits, answers your questions and keeps everything on track. You can reach them on WhatsApp.">
        <p className="home-lead">Your information stays private. We never send results by WhatsApp or email. You see them in your secure dashboard.</p>
      </SheetBand>
      <SheetBand id="outside-mumbai" title="Coming from another city, or from abroad?" lead="Start with a video consultation. We’ll help you plan your tests and your visit. We can also suggest places to stay nearby.">
        <a className="pill" href={brand.whatsapp} target="_blank" rel="noreferrer">WHATSAPP BIOVITY</a>
      </SheetBand>
      <SheetBand title="Questions people ask">
        <VisitFaq items={visitFaqs} />
        <BookButton interest="THOP">BOOK YOUR FIRST CONSULTATION</BookButton>
      </SheetBand>
      <SheetBand id="book" title="Ready when you are." lead="Leave your details and our coordinator will get back to you. Or message us on WhatsApp if that’s easier." night>
        <EnquiryForm interest="THOP" submitLabel="BOOK YOUR FIRST CONSULTATION" />
        <a className="pill" href={brand.whatsapp} target="_blank" rel="noreferrer">WHATSAPP BIOVITY</a>
      </SheetBand>
    </PageFrame>
  );
}
