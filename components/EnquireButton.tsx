"use client";
import type { ReactNode } from "react";
import type { Interest } from "@/lib/content";
import { useEnquiry } from "./Enquiry";
import { NE } from "./Icons";

export default function EnquireButton({ interest, children }: { interest: Interest; children: ReactNode }) {
  const open = useEnquiry();
  return (
    <button className="pill" onClick={() => open(interest)}>
      {children} <NE />
    </button>
  );
}
