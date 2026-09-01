// AwardLanePage — shared template for the /get-involved/* front doors
// (CSR, NGO, Foundations). Plain-language first: lead with what the lane
// means, then link the real award category pages and the live nomination
// flow. No fabricated examples or placeholder recognitions.

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LaneCategory {
  /** Official category name. */
  name: string;
  /** Which tier the category lives under (e.g. "Gold-Blue Garnet Recognition"). */
  tier: string;
  /** Plain-English explanation of who this category is for. */
  whoItsFor: string;
  /** Link to the existing category page. */
  categoryHref: string;
  /** "Nominate in this category" deep link (real /nominate preselection). */
  nominateHref: string;
}

export interface AwardLanePageProps {
  title: string;
  subtitle?: string;
  /** One-sentence plain-English meaning, before any award-process jargon. */
  meaning: string;
  audience: string[];
  categories: LaneCategory[];
  metaDescription: string;
}

export function AwardLanePage({
  title,
  subtitle,
  meaning,
  audience,
  categories,
  metaDescription,
}: AwardLanePageProps) {
  return (
    <div className="min-h-screen bg-charcoal text-ivory">
      <Helmet>
        <title>{`${title} — NESA-Africa 2026`}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          NESA-Africa 2026 · Recognition Lane
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-lg text-gold/90">{subtitle}</p>
        )}
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivory/80">{meaning}</p>

        <div className="mt-8 rounded-xl border border-gold/20 bg-black/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
            This lane is for
          </h2>
          <ul className="mt-3 space-y-2">
            {audience.map((line) => (
              <li key={line} className="flex items-start gap-2 text-ivory/85">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 space-y-6">
          {categories.map((cat) => (
            <article
              key={cat.name}
              className="rounded-xl border border-gold/20 bg-black/40 p-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-gold/70">
                {cat.tier}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold">{cat.name}</h2>
              <p className="mt-3 text-ivory/80">{cat.whoItsFor}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="bg-gold font-semibold text-black hover:bg-gold/90">
                  <Link to={cat.nominateHref}>
                    Nominate in this category
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gold/40 text-gold hover:bg-gold/10"
                >
                  <Link to={cat.categoryHref}>View category details</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-ivory/60">
          Nominations are free and open to anyone who knows an eligible
          organisation — you can nominate your own organisation or another.
        </p>
      </section>
    </div>
  );
}

export default AwardLanePage;
