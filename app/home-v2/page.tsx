import type { Metadata } from "next";
import CinematicHome from "@/components/home/CinematicHome";

export const metadata: Metadata = {
  title: "BIOVITY · Home V2",
  alternates: { canonical: "/" },
};

export default function HomeV2Page() {
  return <CinematicHome charcoal />;
}
