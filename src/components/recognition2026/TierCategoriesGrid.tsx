// Reusable grid that lists all recognition2026 categories for a given tier.
// Each card links to the dedicated /recognition/{tier}/{category} page.
// Data source: src/config/recognition2026/categories

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  getCategoriesForTier,
  getCategoryPath,
} from "@/config/recognition2026/categories";
import { getTier, type TierSlug } from "@/config/recognition2026/tiers";
import { NOMINEE_TYPE_LABELS } from "@/config/recognition2026/nomineeTypes";
import { GEOGRAPHY_MODEL_LABELS } from "@/config/recognition2026/geographyModels";

interface Props {
  tier: TierSlug;
  heading?: string;
  intro?: string;
  className?: string;
}

export default function TierCategoriesGrid({ tier, heading, intro, className = "" }: Props) {
  const tierDef = getTier(tier);
  const cats = getCategoriesForTier(tier);
  if (!tierDef || cats.length === 0) return null;

  return (
    <section
      aria-labelledby="tier-categories-grid-h"
      className={`py-10 ${className}`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-semibold mb-2">
            {tierDef.shortName} · {cats.length} {cats.length === 1 ? "Category" : "Categories"}
          </p>
          <h2
            id="tier-categories-grid-h"
            className="font-display text-2xl md:text-3xl font-bold text-white"
          >
            {heading ?? `Explore ${tierDef.shortName} Categories`}
          </h2>
          {intro && (
            <p className="text-white/70 text-sm md:text-base mt-2 max-w-3xl">{intro}</p>
          )}
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link
                to={getCategoryPath(c)}
                aria-label={`Open ${c.name} category page`}
                className="group h-full flex flex-col rounded-xl border border-gold/20 bg-white/[0.03] hover:bg-white/[0.06] hover:border-gold/50 transition p-5"
              >
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-gold group-hover:text-gold-light">
                    {c.shortName}
                  </h3>
                  <p className="text-white/70 text-sm mt-2 leading-relaxed">{c.summary}</p>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <dt className="text-white/40 uppercase tracking-wide">Nominee</dt>
                    <dd className="text-white/80 mt-0.5">
                      {c.nomineeTypes.map((t) => NOMINEE_TYPE_LABELS[t]).join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/40 uppercase tracking-wide">Geography</dt>
                    <dd className="text-white/80 mt-0.5">
                      {GEOGRAPHY_MODEL_LABELS[c.geographyModel]}
                    </dd>
                  </div>
                </dl>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold group-hover:translate-x-0.5 transition">
                  Open category
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
