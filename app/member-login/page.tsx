import type { Metadata } from "next";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand } from "@/components/Sheet";

export const metadata: Metadata = {
  title: "Sign in — BIOVITY",
  description: "Welcome back.",
};

const roles = [
  ["Patient", "your dashboard, Biological Twin, reports and appointments"],
  ["Team", "clinical, lab and patient coordination staff"],
  ["Admin", "management and settings"],
];

export default function MemberLoginPage() {
  return (
    <PageFrame>
      <SheetHero word="Sign in" title="Welcome back." night />
      <SheetBand kicker="Choose who you are">
        <ul className="value-grid">
          {roles.map(([name, text]) => (
            <li key={name}><h3>{name}</h3><p>{text}</p></li>
          ))}
        </ul>
        <p className="home-kicker">Patients</p>
        <p className="home-lead">Sign in with your mobile number. We’ll send you a one-time code.</p>
        <p className="home-kicker">Team and admin</p>
        <p className="home-lead">Sign in with your work email, password and a second check (two-factor).</p>
      </SheetBand>
    </PageFrame>
  );
}
