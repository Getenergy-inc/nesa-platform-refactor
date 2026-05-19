import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { ICON_NOMINEES } from "@/data/iconAward";
import { getAllGoldNominees } from "@/data/goldSpecialRecognition";

interface CarouselItem {
  name: string;
  subtitle: string;
  image: string;
  href: string;
  badge: string;
}

export function EcosystemCarousel() {
  const items = useMemo<CarouselItem[]>(() => {
    const iconItems: CarouselItem[] = ICON_NOMINEES.slice(0, 6).map((n) => ({
      name: n.name,
      subtitle: n.sector || n.country,
      image: n.image_url,
      href: `/nominees/africa-education-icon/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`,
      badge: "Africa Education Icon",
    }));
    const goldItems: CarouselItem[] = getAllGoldNominees()
      .slice(0, 6)
      .map(({ category, nominee }) => ({
        name: nominee.name,
        subtitle: `${nominee.discipline} · ${nominee.country}`,
        image: nominee.image,
        href: `/nominees/gold-special-recognition/${category.slug}/${nominee.slug}`,
        badge: category.shortName,
      }));
    return [...iconItems, ...goldItems];
  }, []);

  if (!items.length) return null;

  return (
    <section className="py-14 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-gold mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.18em] font-semibold">
                The Ecosystem
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory">
              Honourees Shaping Africa's Future
            </h2>
            <p className="text-ivory/60 mt-2 max-w-2xl text-sm md:text-base">
              From Lifetime Icons to today's cultural changemakers — meet the
              people driving the New Education Standard for Africa.
            </p>
          </div>
          <Link
            to="/nominees"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5 transition-all"
          >
            View directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gold/30">
          {items.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="snap-start shrink-0 w-[240px] md:w-[260px]"
            >
              <Link
                to={item.href}
                className="block group rounded-2xl overflow-hidden border border-gold/15 hover:border-gold/50 bg-charcoal-light transition-all"
              >
                <div className="aspect-[4/5] overflow-hidden bg-charcoal">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-wider text-gold/80 mb-1">
                    {item.badge}
                  </div>
                  <div className="font-semibold text-ivory group-hover:text-gold transition-colors line-clamp-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-ivory/55 line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EcosystemCarousel;
