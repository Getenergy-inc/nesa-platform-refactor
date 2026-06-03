import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ICON_NOMINEES } from "@/data/iconAward";
import { getAllGoldNominees } from "@/data/goldSpecialRecognition";
import { HonoureeImage } from "@/components/honourees/HonoureeImage";

interface CarouselItem {
  slug: string;
  name: string;
  subtitle: string;
  summary?: string;
  image: string;
  href: string;
  badge: string;
  flag?: string;
}

export function EcosystemCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const items = useMemo<CarouselItem[]>(() => {
    const iconItems: CarouselItem[] = ICON_NOMINEES.slice(0, 6).map((n) => ({
      slug: n.slug,
      name: n.name,
      subtitle: n.sector || n.country,
      image: n.image_url,
      href: `/nominees/africa-education-icon/${n.award_subcategory_slug}/${n.classification_slug}/${n.slug}`,
      badge: "Africa Education Icon",
    }));
    const goldItems: CarouselItem[] = getAllGoldNominees()
      .slice(0, 10)
      .map(({ category, nominee }) => ({
        slug: nominee.slug,
        name: nominee.name,
        subtitle: `${nominee.discipline} · ${nominee.country}`,
        summary: nominee.summary,
        image: nominee.image,
        href: `/nominees/gold-special-recognition/${category.slug}/${nominee.slug}`,
        badge: category.shortName,
        flag: nominee.flag,
      }));
    return [...iconItems, ...goldItems];
  }, []);

  if (!items.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section className="relative py-16 md:py-24 bg-charcoal overflow-hidden">
      {/* ambient gold glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 w-[42rem] h-[42rem] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-gold/[0.04] blur-[100px]" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
                The Ecosystem
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-ivory leading-[1.05]">
              Don't Just Applaud Education Changemakers. Nominate Them As The <span className="text-gold">2026 Honourees</span> Shaping <span className="text-gold">Africa's Education Future</span>
            </h2>
            <p className="text-ivory/65 mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
              From Lifetime Icons to today's cultural changemakers — meet the
              people driving the New Education Standard for Africa.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous honourees"
              className="w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next honourees"
              className="w-10 h-10 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              to="/nominees"
              className="ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:gap-2.5 transition-all"
            >
              View directory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 px-4 scrollbar-thin scrollbar-thumb-gold/30 [scrollbar-width:thin]"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.5 }}
              className="snap-start shrink-0 w-[260px] md:w-[300px]"
            >
              <Link
                to={item.href}
                className="block group relative rounded-3xl overflow-hidden border border-gold/15 hover:border-gold/60 bg-charcoal-light transition-all duration-500 hover:shadow-[0_0_60px_-12px_rgba(212,175,55,0.5)] hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal">
                  <HonoureeImage
                    slug={item.slug}
                    name={item.name}
                    fallbackImage={item.image}
                    flag={item.flag}
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />

                  {/* cinematic gradient floor */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent" />

                  {/* badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-charcoal/80 backdrop-blur border border-gold/40 text-[10px] uppercase tracking-wider text-gold font-semibold">
                      {item.badge}
                    </span>
                  </div>

                  {/* bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="font-display text-lg md:text-xl font-bold text-ivory group-hover:text-gold transition-colors line-clamp-2 leading-tight">
                      {item.name}
                    </div>
                    <div className="text-xs text-ivory/70 line-clamp-1 mt-1">
                      {item.flag ? `${item.flag} ` : ""}
                      {item.subtitle}
                    </div>

                    {item.summary && (
                      <div className="overflow-hidden max-h-0 group-hover:max-h-24 transition-[max-height] duration-500">
                        <p className="text-[11px] text-ivory/60 line-clamp-3 mt-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Explore profile <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* gold edge sheen on hover */}
                  <div className="pointer-events-none absolute inset-0 ring-0 group-hover:ring-1 ring-gold/40 rounded-3xl transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden mt-4 text-center">
          <Link
            to="/nominees"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            View full directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EcosystemCarousel;
