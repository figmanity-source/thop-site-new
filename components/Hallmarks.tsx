"use client";
import { useState } from "react";
import { hallmarks } from "@/lib/pages";

export default function Hallmarks() {
  const [open, setOpen] = useState(0);
  const [title, text] = hallmarks[open];
  return (
    <div className="hallmark-layout">
      <div className="hallmark-ring" role="list">
        {hallmarks.map(([name], i) => (
          <button
            key={name}
            type="button"
            role="listitem"
            className={i === open ? "on" : ""}
            aria-pressed={i === open}
            onClick={() => setOpen(i)}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <article>
        <p className="home-kicker">{String(open + 1).padStart(2, "0")} / 12</p>
        <h3>{title}</h3>
        <p>{text}</p>
      </article>
    </div>
  );
}
