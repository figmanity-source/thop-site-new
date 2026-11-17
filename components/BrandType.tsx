import { Fragment } from "react";

/** PDF p.5: bold only the THOP word in headings and lockups. */
export function BrandType({ text }: { text: string }) {
  return text.split(/(\bTHOP\b)/g).map((part, index) => (
    <Fragment key={index}>
      {part === "THOP" ? <span className="type-thop">{part}</span> : part}
    </Fragment>
  ));
}
