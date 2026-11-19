import Link from "next/link";
import { brand, contact, exploreLinks, footerThop, legalLinks } from "@/lib/content";
import { pathways } from "@/lib/pages";

export function FooterColumns({ approvedOnly = false }: { approvedOnly?: boolean }) {
  return (
    <div className="footer-columns">
      <div>
        <p className="footer-col-label">THOP</p>
        {footerThop.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </div>
      <div>
        <p className="footer-col-label">Pathways</p>
        {pathways.map((item) => (
          <Link key={item.slug} href={`/pathways/${item.slug}`}>{item.name}</Link>
        ))}
      </div>
      <div>
        <p className="footer-col-label">Explore</p>
        {exploreLinks.filter((item) => !approvedOnly || item.href !== "/ethics-committee").map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
        <Link href="/home-v2">Home V2</Link>
      </div>
      <div>
        <p className="footer-col-label">Contact</p>
        {contact.contactLines.map((line) => (
          <p key={line}>{approvedOnly ? line.replace(/\s*\[to be supplied\]/, "") : line}</p>
        ))}
        <a href={brand.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
      <div className="footer-legal">
        {legalLinks.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </div>
      <p className="footer-disclaimer">{contact.disclaimer}</p>
      <p className="footer-brand">{contact.brandLine}</p>
    </div>
  );
}

export function WhatsAppFloat() {
  return (
    <a className="whatsapp-float" href={brand.whatsapp} target="_blank" rel="noreferrer">
      WhatsApp BIOVITY
    </a>
  );
}
