// Africa's Education Impact Directory — Canonical Category Matrix.
//
// Renders ALL recognition categories grouped by tier (Icon · GBG · Platinum ·
// Influencer = 43 total) with subcategory counts. Each card links to its
// canonical tier-styled category page:
//   /awards/<tierSlug>/category/<categorySlug>
//
// Drop-in replacement for the previous "Browse by Award Category" section on
// the NomineesHubPage.

import { Link } from "react-router-dom";
import { Award, ArrowRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RECOGNITION_TIERS_2026 } from "@/config/recognitionArchitecture2026";
import { getFormForCategory } from "@/config/awards/categoryToFormMap";
import { trackEvent } from "@/lib/analytics";

const TIER_ACCENT: Record<string, { ring: string; chip: string; label: string }> = {
  "africa-education-icon": {
    ring: "border-amber-400/30 hover:border-amber-300/60",
    chip: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    label: "Lifetime · Jury Only",
  },
  "gold-blue-garnet": {
    ring: "border-gold/20 hover:border-gold/60",
    chip: "bg-gold/10 text-gold border-gold/30",
    label: "Competitive · Jury + Public",
  },
  "platinum-recognition": {
    ring: "border-sky-300/20 hover:border-sky-200/60",
    chip: "bg-sky-300/10 text-sky-200 border-sky-300/30",
    label: "Institutional · Invitation",
  },
  "influencer-education-impact": {
    ring: "border-fuchsia-400/20 hover:border-fuchsia-300/60",
    chip: "bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-400/30",
    label: "Public Voting",
  },
};

export default function DirectoryCategoryMatrix() {
  const totalCategories = RECOGNITION_TIERS_2026.reduce(
    (sum, t) => sum + t.categories.length,
    0,
  );

  return (
    <div className="space-y-12">
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-gold mb-3">
          <Layers className="h-3.5 w-3.5" />
          {totalCategories} Canonical Categories · 100+ Subcategories
        </div>
        <h3 className="font-playfair text-2xl sm:text-3xl text-ivory mb-2">
          Browse every NESA-Africa 2026 recognition category
        </h3>
        <p className="text-ivory/65 text-sm sm:text-base">
          Each card opens a dedicated category page with embedded subcategory
          pathways and a nomination form, styled to match its parent
          recognition tier.
        </p>
      </header>

      {RECOGNITION_TIERS_2026.map((tier) => {
        const accent = TIER_ACCENT[tier.slug] ?? TIER_ACCENT["gold-blue-garnet"];
        return (
          <section key={tier.slug} aria-labelledby={`tier-${tier.slug}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
              <div>
                <Badge variant="outline" className={`${accent.chip} mb-2`}>
                  Tier {tier.id} · {accent.label}
                </Badge>
                <h4
                  id={`tier-${tier.slug}`}
                  className="font-playfair text-xl sm:text-2xl text-ivory"
                >
                  {tier.fullName}
                </h4>
                <p className="text-ivory/55 text-sm mt-1 max-w-2xl">
                  {tier.tagline}
                </p>
              </div>
              <Link
                to={tier.url}
                onClick={() =>
                  trackEvent("directory_tier_open", { tier: tier.slug })
                }
                className="inline-flex items-center gap-1 text-xs text-gold hover:gap-2 transition-all"
              >
                View tier overview <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tier.categories.map((cat) => {
                const form = getFormForCategory(cat.slug);
                const subCount =
                  cat.subcategories.length ||
                  form?.subcategories.length ||
                  0;
                const href = `/awards/${tier.slug}/category/${cat.slug}`;
                return (
                  <li key={cat.slug}>
                    <Link
                      to={href}
                      onClick={() =>
                        trackEvent("directory_category_open", {
                          tier: tier.slug,
                          category: cat.slug,
                        })
                      }
                      className={`group block h-full rounded-2xl border bg-charcoal-light/30 p-4 transition-all ${accent.ring}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Award className="h-5 w-5 text-gold flex-shrink-0" />
                        {subCount > 0 && (
                          <span className="text-[10px] uppercase tracking-wider text-ivory/45">
                            {subCount} subcategor{subCount === 1 ? "y" : "ies"}
                          </span>
                        )}
                      </div>
                      <h5 className="font-medium text-ivory text-sm leading-snug mb-1">
                        {cat.name}
                      </h5>
                      <p className="text-xs text-ivory/55 line-clamp-2">
                        {cat.tagline}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-gold group-hover:gap-2 transition-all">
                        Open category <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
