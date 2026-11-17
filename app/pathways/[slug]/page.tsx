import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageFrame from "@/components/PageFrame";
import { SheetHero, SheetBand, BulletList, BookButton } from "@/components/Sheet";
import { pathways } from "@/lib/pages";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return pathways.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = pathways.find((entry) => entry.slug === slug);
  return {
    title: item ? `${item.headline} — BIOVITY` : "Pathways — BIOVITY",
    description: item?.headline,
  };
}

export default async function PathwayPage({ params }: Props) {
  const { slug } = await params;
  const item = pathways.find((entry) => entry.slug === slug);
  if (!item) notFound();
  const interest = item.slug === "joints" ? "CELLUTION" : "THOP";
  return (
    <PageFrame>
      <SheetHero word={item.name} title={item.headline} lead={item.who || undefined} />
      {"panels" in item && item.panels
        ? item.panels.map(([label, text]) => <SheetBand key={label} kicker={label} lead={text} />)
        : null}
      {item.noticing.length > 0 ? (
        <SheetBand kicker="You might be">
          <BulletList items={item.noticing} />
        </SheetBand>
      ) : null}
      <SheetBand kicker="How THOP helps" night>
        <BulletList items={item.helps} />
      </SheetBand>
      {"note" in item && item.note ? <SheetBand kicker="Important" lead={item.note} /> : null}
      {"question" in item && item.question ? (
        <SheetBand title={item.question} lead={"answer" in item ? item.answer : undefined}>
          <BookButton interest={interest}>{item.cta}</BookButton>
        </SheetBand>
      ) : (
        <SheetBand>
          <BookButton interest={interest}>{item.cta}</BookButton>
        </SheetBand>
      )}
    </PageFrame>
  );
}
