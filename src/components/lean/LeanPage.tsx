// Shared presentation blocks for the lean public pages, aligned to the established About design.
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { AboutSeo } from "@/pages/about/AboutSeo";
import { Button } from "@/components/ui/button";
import africanSchoolImage from "@/assets/african-school-classroom.jpg";

export interface LeanCta { label: string; href: string; primary?: boolean }

export function LeanHero({ title, path, seoTitle, description, canonicalUrl, children }: {
  title: string; path: string; seoTitle: string; description: string; canonicalUrl?: string; children?: ReactNode;
}) {
  return (
    <>
      <AboutSeo title={seoTitle} description={description} path={path} canonicalUrl={canonicalUrl} />
      <section className="relative flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={africanSchoolImage} alt="African students learning in a classroom" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/70" />
        </div>
        <div className="container relative z-10 mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2">
            <GraduationCap className="h-4 w-4 text-gold" aria-hidden="true" />
            <span className="text-sm font-medium text-gold">SCEF · NESA-Africa</span>
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight text-ivory md:text-5xl lg:text-6xl">{title}</h1>
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-ivory/80 md:text-lg">{children}</div>
        </div>
      </section>
    </>
  );
}

export function LeanSection({ title, children, tone = "light", id }: {
  title?: string; children: ReactNode; tone?: "light" | "dark"; id?: string;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} className={`scroll-mt-28 border-t border-gold/10 ${dark ? "bg-charcoal-light" : "bg-charcoal"}`}>
      <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        {title && <h2 className="font-display text-2xl font-bold leading-tight text-ivory md:text-4xl">{title}</h2>}
        <div className={`${title ? "mt-8" : ""} space-y-4 leading-relaxed text-ivory/80`}>{children}</div>
      </div>
    </section>
  );
}

export function LeanList({ items, ordered }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return <Tag className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2`}>{items.map((item, i) => <li key={i}>{item}</li>)}</Tag>;
}

export function LeanCtas({ ctas }: { ctas: LeanCta[] }) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {ctas.map((c) => (
        <Button key={c.label} asChild variant={c.primary ? "default" : "outline"}
          className={c.primary ? "rounded-full bg-gold text-charcoal hover:bg-gold/90 font-semibold" : "rounded-full border-gold/50 text-gold hover:bg-gold/10 hover:text-gold"}>
          <Link to={c.href}>{c.label}</Link>
        </Button>
      ))}
    </div>
  );
}
