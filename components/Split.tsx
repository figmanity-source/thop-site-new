import { Fragment } from "react";

/** Word/char splitter producing the same markup as the original (.st-word > .char-wrapper > .st-char). */
export function Split({ text, wrap = false }: { text: string; wrap?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className={w === "THOP" ? "st-word type-thop" : "st-word"} style={{ display: "inline-block" }}>
            {Array.from(w).map((c, ci) =>
              wrap ? (
                <span className="char-wrapper" key={ci} style={{ display: "inline-block" }}>
                  <span className="st-char" style={{ display: "inline-block" }}>{c}</span>
                </span>
              ) : (
                <span className="st-char" key={ci} style={{ display: "inline-block" }}>{c}</span>
              ),
            )}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
