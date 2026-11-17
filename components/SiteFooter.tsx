import Link from "next/link";
import { brand, contact, exploreLinks, footerThop, legalLinks } from "@/lib/content";
import { pathways } from "@/lib/pages";

export function FooterColumns() {
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
        {exploreLinks.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </div>
      <div>
        <p className="footer-col-label">Contact</p>
        {contact.contactLines.map((line) => (
          <p key={line}>{line}</p>
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
