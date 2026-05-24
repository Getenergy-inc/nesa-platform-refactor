/**
 * NomineeDiscoverySwitcher — landing-page preview surface for /nominees.
 *
 * Tabs: Category · Region · Impact Type · Country.
 * - Category  → reuses CategoryDiscoveryGrid (carousel) [global CTA rule applied]
 * - Region    → 5-card grid linking into /nominees/{region-slug}
 * - Impact    → grouped by RecognitionTier (Blue Garnet, Gold, Icon, Regional)
 * - Country   → top countries by nominee count
 * Every tab carries a "See all" → /nominees CTA.
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Globe2, MapPin, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees } from "@/hooks/useNominees";
import { CategoryDiscoveryGrid } from "@/components/nominees/CategoryDiscoveryGrid";
import {
  getCategoryTier,
  TIER_BADGE_STYLES,
  type RecognitionTier,
} from "@/config/nomineeCategories";

type TabKey = "category" | "region" | "impact" | "country";

const TABS: { key: TabKey; label: string; icon: typeof Trophy }[] = [
  { key: "category", label: "Category", icon: Trophy },
  { key: "region", label: "Region", icon: MapPin },
  { key: "impact", label: "Impact Type", icon: Sparkles },
  { key: "country", label: "Country", icon: Globe2 },
];

const REGIONS = [
  { slug: "west-africa", name: "West Africa", tagline: "Coastal innovation" },
  { slug: "east-africa", name: "East Africa", tagline: "Rift Valley vision" },
  { slug: "north-africa", name: "North Africa", tagline: "Mediterranean heritage" },
  { slug: "central-africa", name: "Central Africa", tagline: "Equatorial heart" },
  { slug: "southern-africa", name: "Southern Africa", tagline: "Cape to Kilimanjaro" },
];

const IMPACT_TIERS: { tier: RecognitionTier; description: string }[] = [
  { tier: "blue_garnet", description: "Africa's most prestigious recognition — public voting open." },
  { tier: "gold", description: "Category excellence across education sectors." },
  { tier: "icon", description: "Lifetime contribution to African education." },
  { tier: "regional", description: "State and regional education leadership." },
];

export function NomineeDiscoverySwitcher() {
  const [tab, setTab] = useState<TabKey>("category");
  const { data: nominees, isLoading } = useNominees();

  const { regionCounts, impactCounts, topCountries } = useMemo(() => {
    const empty = { regionCounts: {} as Record<string, number>, impactCounts: {} as Record<RecognitionTier, number>, topCountries: [] as { name: string; count: number }[] };
    if (!nominees) return empty;
    const valid = nominees.filter((n) => n.status === "approved" || n.status === "platinum" || n.status === "pending");

    const regionCounts: Record<string, number> = {};
    const impactCounts: Record<string, number> = {};
    const countryMap = new Map<string, number>();
    for (const n of valid) {
      const r = (n.geographicCategory || "").toLowerCase();
      if (r) regionCounts[r] = (regionCounts[r] || 0) + 1;
      const tier = getCategoryTier(n.categorySlug);
      impactCounts[tier] = (impactCounts[tier] || 0) + 1;
      if (n.country) countryMap.set(n.country, (countryMap.get(n.country) || 0) + 1);
    }
    const topCountries = Array.from(countryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    return { regionCounts, impactCounts: impactCounts as Record<RecognitionTier, number>, topCountries };
  }, [nominees]);

  return (
    <section className="bg-charcoal py-10 md:py-14">
      <div className="container">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl md:text-3xl font-bold text-ivory flex items-center gap-2">
              <Trophy className="w-5 h-5 md:w-6 md:h-6 text-gold" /> Explore Existing Nominees
            </h2>
            <p className="text-ivory/60 text-xs md:text-sm mt-1 max-w-2xl">
              Discover Africa's education changemakers by category, region, impact type, or country.
            </p>
          </div>
          <Link
            to="/nominees"
            className="text-xs md:text-sm text-gold hover:text-gold/80 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
          >
            See all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab strip — horizontally scrollable on mobile */}
        <div
          role="tablist"
          aria-label="Nominee discovery filters"
          className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-1"
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs md:text-sm font-medium whitespace-nowrap transition-all min-h-[36px] ${
                  active
                    ? "bg-gold text-charcoal border-gold shadow-md shadow-gold/20"
                    : "bg-charcoal-light/60 text-ivory/80 border-gold/25 hover:border-gold/60 hover:text-gold"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "category" && (
              <CategoryDiscoveryGrid
                layout="carousel"
                limit={10}
                heading={null}
                subheading={null}
              />
            )}

            {tab === "region" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {REGIONS.map((r) => {
                  const count =
                    regionCounts[r.slug] ||
                    regionCounts[r.name.toLowerCase()] ||
                    0;
                  return (
                    <Link
                      key={r.slug}
                      to={`/nominees/${r.slug}`}
                      className="group block p-4 rounded-2xl border border-gold/20 bg-charcoal-light/40 hover:border-gold/50 hover:bg-charcoal-light/70 transition-all min-h-[110px]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-base text-ivory group-hover:text-gold transition-colors">{r.name}</h3>
                        <ArrowRight className="w-4 h-4 text-gold/60 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-ivory/55 italic mb-2">{r.tagline}</p>
                      <span className="text-[10px] uppercase tracking-wider text-gold/70">
                        {count.toLocaleString()} nominees
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {tab === "impact" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {IMPACT_TIERS.map(({ tier, description }) => {
                  const style = TIER_BADGE_STYLES[tier];
                  const count = impactCounts[tier] || 0;
                  return (
                    <Link
                      key={tier}
                      to={`/nominees?impact=${tier}`}
                      className="group block p-5 rounded-2xl border border-gold/15 bg-charcoal-light/40 hover:border-gold/50 transition-all min-h-[140px]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`text-[10px] ${style.className}`}>{style.label}</Badge>
                        <ArrowRight className="w-4 h-4 text-gold/60 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <h3 className="font-display text-base font-bold text-ivory group-hover:text-gold transition-colors mb-1">
                        {style.label} Awards
                      </h3>
                      <p className="text-[11px] text-ivory/60 leading-relaxed mb-2 line-clamp-2">{description}</p>
                      <span className="text-[10px] uppercase tracking-wider text-gold/70">
                        {count.toLocaleString()} nominees
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {tab === "country" && (
              <>
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-2xl" />
                    ))}
                  </div>
                ) : topCountries.length === 0 ? (
                  <div className="text-center py-10 text-ivory/60 text-sm">No country data available yet.</div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {topCountries.map((c) => (
                      <Link
                        key={c.name}
                        to={`/nominees?country=${encodeURIComponent(c.name)}`}
                        className="group flex items-center justify-between p-4 rounded-2xl border border-gold/20 bg-charcoal-light/40 hover:border-gold/50 transition-all min-h-[64px]"
                      >
                        <div>
                          <h3 className="font-display text-sm font-bold text-ivory group-hover:text-gold transition-colors">{c.name}</h3>
                          <p className="text-[10px] text-ivory/55">{c.count.toLocaleString()} nominees</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gold/60 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer CTA */}
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-full border-gold/40 text-gold hover:bg-gold/10 font-semibold"
          >
            <Link to="/nominees">
              Browse all nominees <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default NomineeDiscoverySwitcher;
