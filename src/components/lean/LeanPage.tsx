// Shared presentation blocks for the lean 2026 public pages (existing charcoal/gold/cream theme).
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { AboutSeo } from "@/pages/about/AboutSeo";
import { Button } from "@/components/ui/button";

export interface LeanCta { label: string; href: string; primary?: boolean }

export function LeanHero({ title, path, seoTitle, description, children }: {
  title: string; path: string; seoTitle: string; description: string; children?: ReactNode;
}) {
  return (
    <>
      <AboutSeo title={seoTitle} description={description} path={path} />
      <section className="bg-charcoal pt-28 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-gold leading-tight">{title}</h1>
          <div className="mt-5 space-y-3 text-white/80 text-base md:text-lg leading-relaxed">{children}</div>
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
    <section id={id} className={dark ? "bg-charcoal py-12 md:py-16" : "bg-background py-12 md:py-16"}>
      <div className="container mx-auto px-4 max-w-4xl">
        {title && <h2 className={`font-display text-2xl md:text-3xl font-bold mb-5 ${dark ? "text-gold" : "text-foreground"}`}>{title}</h2>}
        <div className={`space-y-4 leading-relaxed ${dark ? "text-white/80" : "text-foreground/80"}`}>{children}</div>
      </div>
    </section>
  );
}

export function LeanList({ items, ordered }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`${ordered ? "list-decimal" : "list-disc"} pl-6 space-y-2`}>
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </Tag>
  );
}

export function LeanCtas({ ctas }: { ctas: LeanCta[] }) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      {ctas.map((c) => (
        <Button key={c.label} asChild variant={c.primary ? "default" : "outline"}
          className={c.primary ? "bg-gold text-charcoal hover:bg-gold/90 font-semibold" : "border-gold/60 text-gold hover:bg-gold/10 hover:text-gold"}>
          <Link to={c.href}>{c.label}</Link>
        </Button>
      ))}
    </div>
  );
}
