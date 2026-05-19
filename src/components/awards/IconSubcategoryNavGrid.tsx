import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import {
  ICON_AWARD,
  ICON_SUBCATEGORIES,
  ICON_CLASSIFICATIONS,
  ICON_NOMINEES,
  type IconSubcategorySlug,
  type IconClassificationSlug,
} from "@/data/iconAward";

interface SubBreakdown {
  slug: IconSubcategorySlug;
  title: string;
  short: string;
  description: string;
  total: number;
  byClassification: Record<IconClassificationSlug, number>;
}

export function IconSubcategoryNavGrid() {
  const breakdown = useMemo<SubBreakdown[]>(() => {
    return ICON_SUBCATEGORIES.map((sub) => {
      const inSub = ICON_NOMINEES.filter((n) => n.award_subcategory_slug === sub.slug);
      const byClassification = ICON_CLASSIFICATIONS.reduce((acc, c) => {
        acc[c.slug] = inSub.filter((n) => n.classification_slug === c.slug).length;
        return acc;
      }, {} as Record<IconClassificationSlug, number>);
      return {
        slug: sub.slug,
        title: sub.title,
        short: sub.short,
        description: sub.description,
        total: inSub.length,
        byClassification,
      };
    });
  }, []);

  return (
    <section className="py-14 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            {ICON_AWARD.yearRange} · Three subcategories
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2">
            Explore Lifetime Honourees
          </h2>
          <p className="text-ivory/60 max-w-2xl mx-auto mt-2 text-sm md:text-base">
            Each subcategory is organised into three classifications: Africans in
            Africa, Diaspora Africans, and Friends of Africa.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {breakdown.map((sub, i) => (
            <motion.div
              key={sub.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/nominees/africa-education-icon-award/${sub.slug}`}
                className="block h-full rounded-2xl border border-gold/20 hover:border-gold/60 bg-gradient-to-br from-charcoal-light to-charcoal p-6 transition-all group hover:shadow-[0_20px_50px_-20px_hsl(42_85%_52%/0.4)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-gold/80 font-semibold">
                    {sub.short}
                  </span>
                  <div className="flex items-center gap-1 text-gold text-xs font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {sub.total}
                  </div>
                </div>
                <h3 className="font-display text-lg md:text-xl font-bold text-ivory mb-2 group-hover:text-gold transition-colors leading-tight">
                  {sub.title}
                </h3>
                <p className="text-xs text-ivory/65 line-clamp-3 mb-4">
                  {sub.description}
                </p>

                <div className="space-y-1.5 border-t border-gold/10 pt-3 mb-4">
                  {ICON_CLASSIFICATIONS.map((c) => (
                    <div
                      key={c.slug}
                      className="flex items-center justify-between text-[11px]"
                    >
                      <span className="text-ivory/55">{c.short}</span>
                      <span className="text-gold font-semibold">
                        {sub.byClassification[c.slug]}
                      </span>
                    </div>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-gold group-hover:gap-2 transition-all">
                  View honourees <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IconSubcategoryNavGrid;
