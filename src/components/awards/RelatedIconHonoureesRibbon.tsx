import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";
import {
  ICON_NOMINEES,
  type IconSubcategorySlug,
  type IconClassificationSlug,
} from "@/data/iconAward";

interface Props {
  title: string;
  description?: string;
  filterSubcategory?: IconSubcategorySlug;
  filterClassification?: IconClassificationSlug;
  limit?: number;
}

/**
 * Compact ribbon surfacing related Africa Education Icon honourees
 * from the new nominee data layer, scoped by subcategory/classification.
 */
export function RelatedIconHonoureesRibbon({
  title,
  description,
  filterSubcategory,
  filterClassification,
  limit = 6,
}: Props) {
  const honourees = useMemo(() => {
    return ICON_NOMINEES.filter((n) => {
      if (filterSubcategory && n.award_subcategory_slug !== filterSubcategory) return false;
      if (filterClassification && n.classification_slug !== filterClassification) return false;
      return true;
    }).slice(0, limit);
  }, [filterSubcategory, filterClassification, limit]);

  if (!honourees.length) return null;

  return (
    <section className="py-12 md:py-16 bg-charcoal border-t border-gold/10">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-gold mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">
                Related Lifetime Honourees
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory">
              {title}
            </h2>
            {description && (
              <p className="text-ivory/60 mt-1.5 max-w-2xl text-sm">{description}</p>
            )}
          </div>
          <Link
            to="/awards/africa-education-icon"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2 transition-all"
          >
            View all icons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4">
          {honourees.map((n) => (
            <Link
              key={n.id}
              to={`/nominees/africa-education-icon-award/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`}
              className="snap-start shrink-0 w-[200px] block group rounded-xl overflow-hidden border border-gold/15 hover:border-gold/50 bg-charcoal-light transition-all"
            >
              <div className="aspect-square bg-charcoal overflow-hidden">
                <img
                  src={n.image_url}
                  alt={n.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <div className="font-semibold text-sm text-ivory group-hover:text-gold transition-colors line-clamp-1">
                  {n.name}
                </div>
                <div className="text-[11px] text-ivory/55 line-clamp-1 mt-0.5">
                  {n.country} · {n.sector}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedIconHonoureesRibbon;
