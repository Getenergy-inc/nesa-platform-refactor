// Compact grid that surfaces the 18-category slots assigned to a given tier.
// Rendered on each tier landing page. Cards link to /awards/18-categories/:slug
// so users can drill into subcategories without leaving the recognition spine.

import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  listCategoriesByTier,
  TIER_LABEL,
  type TierSlug,
} from "@/config/recognition/eighteenCategories";
import { countSubcategoriesFor } from "@/config/recognition/categoryAlias";

export interface TierCategoryCardsProps {
  tier: TierSlug;
  eyebrow?: string;
  heading?: string;
  sub?: string;
}

export function TierCategoryCards({
  tier,
  eyebrow = "18-Category Registry",
  heading,
  sub,
}: TierCategoryCardsProps) {
  const items = listCategoriesByTier(tier);
  if (!items.length) return null;

  const label = TIER_LABEL[tier];
  const defaultHeading = heading ?? `${label} · ${items.length} Award ${items.length === 1 ? "Category" : "Categories"}`;
  const defaultSub =
    sub ??
    `Explore each of the ${items.length} categories under ${label}. Every card links to the full subcategory listing and its Enablers of Education for All Across Africa.`;

  return (
    <section
      aria-labelledby={`tier-categories-${tier}`}
      className="py-14 lg:py-20 border-t border-gold/15"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            {eyebrow}
          </span>
          <h2
            id={`tier-categories-${tier}`}
            className="mt-2 font-display text-3xl md:text-4xl font-bold text-white"
          >
            {defaultHeading}
          </h2>
          <p className="mt-3 text-white/65">{defaultSub}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cat, idx) => {
            const subCount = countSubcategoriesFor(cat.slug);
            const href = cat.meta
              ? tier === "africa-education-icon"
                ? "/awards/africa-education-icon"
                : "/awards/influencer-education-impact"
              : `/awards/18-categories/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                to={href}
                onClick={() =>
                  trackEvent("tier_category_card_click", {
                    tier,
                    slug: cat.slug,
                    position: idx + 1,
                  })
                }
                className="group block rounded-2xl border border-gold/20 bg-gradient-to-b from-charcoal-light to-charcoal p-6 hover:border-gold/45 hover:shadow-[0_0_30px_-12px_rgba(244,196,48,0.35)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                aria-label={`Open ${cat.name}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] text-gold/80">
                    {String(idx + 1).padStart(2, "0")} / {items.length}
                  </span>
                  <div className="flex gap-1.5">
                    {cat.meta ? (
                      <Badge className="bg-gold/15 text-gold border border-gold/30 text-[10px]">
                        Tier Meta
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-gold/30 text-gold/90 text-[10px]">
                        {subCount > 0 ? `${subCount} subs` : "Open call"}
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="font-display text-lg font-bold text-white leading-snug group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-3">
                  {cat.tagline}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-gold/90 group-hover:gap-3 transition-all">
                  <Layers className="h-4 w-4" />
                  View category <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" className="border-gold/40 text-white hover:bg-gold/10 rounded-full">
            <Link to="/awards/18-categories">Browse all 18 categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
