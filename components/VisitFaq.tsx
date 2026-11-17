"use client";
import { useState } from "react";

export default function VisitFaq({ items }: { items: readonly (readonly [string, string])[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {items.map(([q, a], i) => {
        const on = open === i;
        const panelId = `visit-faq-${i}`;
        return (
          <div key={q} className={on ? "faq-item open" : "faq-item"}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setOpen(on ? -1 : i)}
              >
                {q}
              </button>
            </h3>
            <div id={panelId} role="region" hidden={!on}>
              <p>{a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
