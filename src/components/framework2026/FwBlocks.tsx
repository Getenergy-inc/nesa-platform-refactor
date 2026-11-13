import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { FwCta } from "@/config/contentFramework2026";

export function FwButton({ cta, primary }: { cta: FwCta; primary?: boolean }) {
  const cls = cn(
    "inline-flex min-h-11 items-center rounded-md px-5 py-2 text-sm font-semibold transition-colors duration-200",
    primary ? "bg-gold text-charcoal hover:bg-gold/90" : "border border-gold/60 text-gold hover:bg-gold/10",
  );
  return cta.external ? (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={cls}>{cta.label}</a>
  ) : (
    <Link to={cta.href} className={cls}>{cta.label}</Link>
  );
}

export function FwCtas({ ctas, className }: { ctas: FwCta[]; className?: string }) {
  return (
    <div className={cn("mt-6 flex flex-wrap gap-3", className)}>
      {ctas.map((c, i) => <FwButton key={c.label} cta={c} primary={i === 0} />)}
    </div>
  );
}

export function FwSection({ id, eyebrow, title, children, light }: { id?: string; eyebrow?: string; title: string; children?: React.ReactNode; light?: boolean }) {
  return (
    <section id={id} className={cn("scroll-mt-28 border-t border-gold/10", light ? "bg-ivory text-charcoal" : "bg-charcoal text-ivory")}>
      <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        {eyebrow && <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-semibold">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold leading-tight">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function FwList({ items, light }: { items: string[]; light?: boolean }) {
  return (
    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
      {items.map((i) => (
        <li key={i} className={cn("rounded-md border px-4 py-3 text-sm", light ? "border-charcoal/15" : "border-gold/20 text-ivory/85")}>{i}</li>
      ))}
    </ul>
  );
}
