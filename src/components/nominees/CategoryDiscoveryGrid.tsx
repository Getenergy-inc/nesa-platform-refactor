/**
 * CategoryDiscoveryGrid — mobile-first, reusable category discovery surface.
 *
 * Layouts:
 *   - "grid"     → /nominees primary surface (1-col mobile, 2-col tablet, 3-col desktop)
 *   - "carousel" → landing page horizontal snap-scroll rail
 *
 * Applies the global CTA rule from src/config/nomineeCategories.ts:
 *   - Primary CTA   = "Explore Nominees"  → /nominees/category/{slug}
 *   - Secondary CTA = "Vote" (Blue Garnet) | "Re-nominate" (all others)
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, ArrowRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import {
  getSecondaryCtaLabel,
  getSecondaryCtaHref,
  getTierStyle,
} from "@/config/nomineeCategories";
import { getCategoryImage } from "@/config/categoryImages";

export interface CategoryEntry {
  slug: string;
  name: string;
  count: number;
  topNominees: EnrichedDatabaseNominee[];
}

interface CategoryDiscoveryGridProps {
  layout?: "grid" | "carousel";
  /** Hard cap for visible categories. */
  limit?: number;
  /** Optional pre-computed list — otherwise derived from useNominees. */
  categories?: CategoryEntry[];
  /** Optional search filter (matches name). */
  search?: string;
  /** Section heading shown above the grid/carousel. Pass null to hide. */
  heading?: string | null;
  /** Subhead under the heading. */
  subheading?: string | null;
  /** "See all" link, e.g. /nominees. Pass null to hide. */
  seeAllHref?: string | null;
  className?: string;
}

export function CategoryDiscoveryGrid({
  layout = "grid",
  limit,
  categories: categoriesProp,
  search,
  heading = "Browse by Award Category",
  subheading = "Every nominee belongs to an award track. Pick one to explore, vote, or re-nominate.",
  seeAllHref,
  className = "",
}: CategoryDiscoveryGridProps) {
  const { data: nominees, isLoading } = useNominees();

  const categories = useMemo<CategoryEntry[]>(() => {
    if (categoriesProp) return categoriesProp;
    if (!nominees) return [];
    const valid = nominees.filter(
      (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending",
    );
    const map = new Map<string, CategoryEntry>();
    for (const n of valid) {
      const e = map.get(n.categorySlug) ?? {
        slug: n.categorySlug,
        name: n.categoryName,
        count: 0,
        topNominees: [],
      };
      e.count++;
      if (e.topNominees.length < 3) e.topNominees.push(n);
      map.set(n.categorySlug, e);
    }
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [categoriesProp, nominees]);

  const visible = useMemo(() => {
    let list = categories;
    if (search?.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return limit ? list.slice(0, limit) : list;
  }, [categories, search, limit]);

  const loading = !categoriesProp && isLoading;

  return (
    <section className={className}>
      {(heading || seeAllHref) && (
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            {heading && (
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-ivory flex items-center gap-2">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-gold" /> {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-ivory/60 text-xs md:text-sm mt-1 max-w-2xl">{subheading}</p>
            )}
          </div>
          {seeAllHref && (
            <Link
              to={seeAllHref}
              className="text-xs md:text-sm text-gold hover:text-gold/80 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
            >
              See all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <SkeletonRow layout={layout} />
      ) : visible.length === 0 ? (
        <div className="text-center py-12 text-ivory/60">
          <Users className="w-10 h-10 mx-auto text-gold/30 mb-2" />
          No categories yet.
        </div>
      ) : layout === "carousel" ? (
        <div
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-2"
          role="region"
          aria-label="Award categories carousel"
        >
          {visible.map((cat, i) => (
            <div
              key={cat.slug}
              className="snap-start flex-shrink-0 w-[78%] sm:w-[44%] md:w-[32%] lg:w-[26%]"
            >
              <CategoryCard cat={cat} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {visible.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────
function CategoryCard({ cat, index }: { cat: CategoryEntry; index: number }) {
  const tierStyle = getTierStyle(cat.slug);
  const secondaryLabel = getSecondaryCtaLabel(cat.slug);
  const secondaryHref = getSecondaryCtaHref(cat.slug);
  const heroImg = getCategoryImage(cat.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
      className={`group relative h-full flex flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-lg ${tierStyle.cardBorderClass} ${tierStyle.cardBgClass}`}
    >
      {/* Category hero image — restores visual identity per card */}
      <Link
        to={`/nominees/category/${cat.slug}`}
        className="relative block aspect-[16/9] overflow-hidden bg-charcoal-light"
        aria-label={`Explore ${cat.name}`}
      >
        {heroImg ? (
          <img
            src={heroImg}
            alt={cat.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${tierStyle.accentSoftClass}`}>
            <Trophy className={`w-10 h-10 ${tierStyle.accentTextClass}`} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
        <Badge className={`absolute top-2 right-2 text-[10px] border ${tierStyle.className}`}>{tierStyle.label}</Badge>
      </Link>

      <div className="flex flex-col flex-1 p-4 md:p-5">


      <Link
        to={`/nominees/category/${cat.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-gold/60 rounded"
        aria-label={`Explore nominees in ${cat.name}`}
      >
        <h3 className="font-display text-base md:text-lg font-bold text-ivory group-hover:text-gold transition-colors line-clamp-2 mb-2">
          {cat.name}
        </h3>
      </Link>

      <div className="flex items-center gap-2 text-[11px] text-ivory/60 mb-4">
        <Users className="w-3.5 h-3.5 text-gold/70" />
        <span>{cat.count.toLocaleString()} nominees</span>
      </div>

      {cat.topNominees.length > 0 && (
        <div className="flex -space-x-2 mb-4">
          {cat.topNominees.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className="w-8 h-8 rounded-full border-2 border-charcoal overflow-hidden bg-charcoal-light"
              title={n.name}
            >
              <img
                src={n.photoUrl}
                alt=""
                className={
                  n.imageType === "logo"
                    ? "object-contain w-full h-full p-1 bg-white/90"
                    : "object-cover w-full h-full"
                }
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* CTA stack — vertical on mobile to respect 44pt tap target */}
      <div className="mt-auto flex flex-col gap-2">
        <Button
          asChild
          size="sm"
          className="w-full bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full gap-2 min-h-[40px]"
        >
          <Link to={`/nominees/category/${cat.slug}`}>
            Explore Nominees <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant="outline"
          className={`w-full rounded-full font-semibold min-h-[40px] ${tierStyle.secondaryCtaClass}`}
        >
          <Link to={secondaryHref}>{secondaryLabel}</Link>
        </Button>
      </div>
      </div>
    </motion.article>
  );
}

function SkeletonRow({ layout }: { layout: "grid" | "carousel" }) {
  if (layout === "carousel") {
    return (
      <div className="flex gap-3 overflow-hidden -mx-4 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-[78%] sm:w-[44%] md:w-[32%] lg:w-[26%] rounded-2xl flex-shrink-0" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-2xl" />
      ))}
    </div>
  );
}

export default CategoryDiscoveryGrid;
