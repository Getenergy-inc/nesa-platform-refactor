import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getMasterAwards, MASTER_TIERS } from "@/config/awardMaster2026";
import { Button } from "@/components/ui/button";

export function MasterTierGuidance({ tier }: { tier: string }) {
  const entry = MASTER_TIERS.find((t) => t.slug === (tier === "platinum-recognition" ? "platinum" : tier));
  if (!entry) return null;
  return <section className="border-b border-border bg-background py-12 text-foreground"><div className="mx-auto max-w-6xl px-4">
    <p className="text-sm font-medium text-primary">Tier {entry.number} · {entry.name}</p>
    <GuidanceText overview={entry.overview} why={entry.why} evidence={entry.evidence} />
  </div></section>;
}

export function GuidanceText({ overview, why, evidence, examples }: { overview: string; why: string; evidence: string[]; examples?: string }) {
  return <div className="mt-5 grid gap-8 md:grid-cols-2">
    <div className="space-y-5"><div><h2 className="font-playfair text-2xl">Award Overview</h2><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{overview}</p></div>
      <div><h3 className="font-playfair text-xl">Why It Matters</h3><p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{why}</p></div>
      {examples && <div><h3 className="font-playfair text-xl">Examples of Eligible Nominees</h3><p className="mt-3 text-sm text-muted-foreground">{examples}</p></div>}
    </div>
    <div><h3 className="font-playfair text-xl">What Strong Nominations Demonstrate</h3><ul className="mt-4 space-y-3">{evidence.map((item) => <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></div>
  </div>;
}

export function MasterAwardGuidance({ categorySlug, selection, compact = false }: { categorySlug?: string; selection?: string; compact?: boolean }) {
  const awards = getMasterAwards(categorySlug);
  if (!awards.length) return null;
  const chosen = awards.length > 1 && selection ? awards.filter((a) => (a.slug === selection || (selection === "Social Media" && a.slug === "inf-soc") || (selection === "Sports" && a.slug === "inf-spt") || (selection === "Music" && a.slug === "inf-mus"))) : awards;
  return <section aria-label="Master award guidance" className={compact ? "text-foreground" : "border-b border-border bg-background py-12 text-foreground"}>
    <div className={compact ? "space-y-8" : "mx-auto max-w-6xl space-y-10 px-4"}>
      {chosen.map((award) => {
        const sub = award.subcategories.find((s) => s.slug === categorySlug || s.title === selection);
        return <div key={award.number}>
          <p className="text-xs font-semibold uppercase text-primary">{sub ? "Subcategory" : `Award ${String(award.number).padStart(2, "0")}`} · {MASTER_TIERS.find((t) => t.slug === award.tier)?.name}</p>
          <h2 className="mt-2 font-playfair text-2xl">{sub?.title ?? award.title}</h2>
          <GuidanceText overview={sub?.overview ?? award.overview} why={sub?.why ?? award.why} evidence={sub ? sub.evidence.split(/;\s*/) : award.evidence} examples={sub?.examples} />
          {award.number === 22 && <p className="mt-6 border-l-2 border-primary pl-4 text-sm text-muted-foreground">Individual Nigerian states are nominated and assessed. The six geopolitical zones group nominations geographically; they are not nominees.</p>}
          {!compact && !sub && award.subcategories.length > 0 && <div className="mt-8">
            <h3 className="font-playfair text-xl">Subcategories · {award.subcategories.length}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">{award.subcategories.map((s) => <li key={s.number}><Link to={s.href} className="flex items-start justify-between gap-3 border-b border-border py-3 text-sm text-primary"><span>{s.title}</span><ArrowRight className="mt-0.5 h-4 w-4 shrink-0" /></Link></li>)}</ul>
          </div>}
          {!compact && <Button asChild variant="outline" className="mt-6"><Link to={award.nominationHref}>Nominate an Education Enabler<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>}
        </div>;
      })}
      <p className="text-xs leading-relaxed text-muted-foreground">These descriptions guide nominations. Formal eligibility, evidence requirements and approved review rules remain applicable. A nomination does not guarantee recognition.</p>
    </div>
  </section>;
}