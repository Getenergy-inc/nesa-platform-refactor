import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PILLARS } from "@/data/pillars";
import { trackEvent } from "@/lib/analytics";

/**
 * NinePillarsHomeSection — Landing-page summary of the 9 Recognition Pillars.
 * Data sourced from /src/data/pillars.ts. Each card deep-links to its pillar page.
 * (File name retained for import stability; export alias provided below.)
 */
export function SevenPillarsHomeSection() {
  return (
    <section className="relative py-20 md:py-28 bg-charcoal" aria-labelledby="seven-pillars-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-light/10 to-charcoal" />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold tracking-[0.18em] uppercase mb-4">
            Recognition Architecture
          </span>
          <h2
            id="seven-pillars-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Nine Recognition Pillars. <span className="text-gold">One Continental Mission.</span>
          </h2>
          <p className="text-white/75 text-base md:text-lg">
            NESA-Africa organises its recognition framework through nine simple pillars — clear doorways for
            nominees, sponsors, partners, volunteers, governments, media organisations and development institutions
            to participate in advancing Education for All.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/awards/pillars/${p.slug}`}
                  onClick={() =>
                    trackEvent("home_cta_click", {
                      cta: "pillar_card",
                      label: p.shortTitle,
                      to: `/awards/pillars/${p.slug}`,
                      section: "seven_pillars",
                    })
                  }
                  className="group relative block h-full rounded-2xl border border-gold/20 bg-charcoal/70 p-6 hover:border-gold/60 transition-all overflow-hidden"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${p.accent}`} />
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <span className="text-gold/70 text-xs font-bold tracking-wider uppercase">
                      Pillar {p.number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-gold transition">
                    {p.shortTitle}
                  </h3>
                  <p className="text-gold/90 text-sm italic mb-3">{p.sellLine}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{p.bannerSummary}</p>
                  <span className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold">
                    {p.bannerCta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/awards/pillars"
            onClick={() =>
              trackEvent("home_cta_click", {
                cta: "view_all_pillars",
                to: "/awards/pillars",
                section: "seven_pillars",
              })
            }
            className="inline-flex items-center gap-2 rounded-full border-2 border-gold/60 px-6 py-3 text-gold font-semibold hover:bg-gold hover:text-charcoal transition"
          >
            Explore All 9 Recognition Pillars
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export const NinePillarsHomeSection = SevenPillarsHomeSection;
export default SevenPillarsHomeSection;
