import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Poppins } from "next/font/google";
import { EnquiryProvider } from "@/components/Enquiry";
import Header from "@/components/Header";
import "../styles/sections.css";
import "./globals.css";
import "../styles/typography.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIOVITY · THOP",
  description: "THOP is our five-step journey to help you live longer, and live well. First, we understand your body. Then we build a plan around it. And we stay with you as you change.",
  openGraph: { title: "BIOVITY · THOP", description: "THOP is our five-step journey to help you live longer, and live well." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${instrument.variable}`}>
      <body>
        <EnquiryProvider>
          <Header variant="inner" />
          {children}
        </EnquiryProvider>
      </body>
    </html>
  );
}
