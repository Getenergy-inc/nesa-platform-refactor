/**
 * MobileCategoryRail
 * Mobile-only horizontal swipe carousel for top award categories.
 * Replaces the dense category grid on small screens with thumb-friendly cards.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { NESA_CATEGORIES, TIER_INFO } from "@/config/nesaCategories";
import { categoryIconMap } from "@/config/categoryIconMap";
import { getCategoryImage } from "@/config/categoryImages";

const FEATURED_SLUGS = [
  "africa-education-icon",
  "best-overall-school",
  "best-overall-tertiary-institution",
  "tech-innovation-in-education",
  "africa-lifetime-education-icon",
  "best-overall-edutech-company",
];

export function MobileCategoryRail() {
  const items = FEATURED_SLUGS
    .map((slug) => NESA_CATEGORIES.find((c) => c.slug === slug))
    .filter(Boolean)
    .slice(0, 8) as typeof NESA_CATEGORIES;

  if (!items.length) return null;

  return (
    <section className="md:hidden bg-charcoal py-10">
      <div className="px-4 mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-gold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">
              Discover
            </span>
          </div>
          <h2 className="font-display text-xl font-bold text-ivory leading-tight">
            Award Categories
          </h2>
        </div>
        <Link
          to="/categories"
          className="text-xs font-semibold text-gold inline-flex items-center gap-1 shrink-0"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 px-4 -mx-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Award categories"
      >
        {items.map((cat) => {
          const Icon = categoryIconMap[cat.iconName] || GraduationCap;
          const img = getCategoryImage(cat.slug);
          const tierLabel = cat.tierApplicability.blueGarnet
            ? TIER_INFO["blue-garnet"].shortName
            : cat.tierApplicability.icon
            ? TIER_INFO.icon.shortName
            : TIER_INFO.platinum.shortName;
          return (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              role="listitem"
              className="snap-start shrink-0 w-[72vw] max-w-[280px] rounded-2xl overflow-hidden border border-gold/15 bg-white/5 active:scale-[0.98] transition-transform"
            >
              <div className="relative h-32 w-full overflow-hidden bg-charcoal">
                {img ? (
                  <img
                    src={img}
                    alt={cat.shortName}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gold/10">
                    <Icon className="w-10 h-10 text-gold/50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                <span className="absolute top-2 left-2 text-[10px] uppercase tracking-wider font-semibold text-gold bg-charcoal/70 backdrop-blur px-2 py-0.5 rounded-full border border-gold/30">
                  {tierLabel}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-ivory leading-snug line-clamp-2">
                  {cat.name}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] text-ivory/60">
                  <span>{cat.subcategories.length} subcategories</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default MobileCategoryRail;
