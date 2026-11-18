"use client";
import { useEffect, useState } from "react";

/** Synchronise the home header with its curtain; inner-page docks enter immediately. */
export function useHeaderEntrance(waitForIntro = false) {
  const [ready, setReady] = useState(!waitForIntro);
  useEffect(() => {
    if (!waitForIntro) return;
    let revealTimer = 0;
    const reveal = () => {
      window.clearTimeout(revealTimer);
      revealTimer = window.setTimeout(() => setReady(true), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 600);
    };
    const loader = document.getElementById("loader");
    if (!loader || getComputedStyle(loader).display === "none") setReady(true);
    window.addEventListener("thop:intro", reveal, { once: true });
    const fallback = window.setTimeout(() => setReady(true), 18000);
    return () => {
      window.removeEventListener("thop:intro", reveal);
      window.clearTimeout(revealTimer); window.clearTimeout(fallback);
    };
  }, [waitForIntro]);
  return ready;
}
