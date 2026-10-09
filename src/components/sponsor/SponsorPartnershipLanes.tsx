// SponsorPartnershipLanes — 12 partnership lane cards with amounts and limits.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SPONSOR_LANE_CARDS } from "@/config/sponsorPricing";
import { trackEvent } from "@/lib/analytics";

export function SponsorPartnershipLanes() {
  return (
    <section
      id="partnership-lanes"
      className="bg-charcoal py-14 md:py-20 border-t border-gold/10 scroll-mt-24"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 md:mb-10 max-w-2xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-2">
            Choose your partnership lane
          </h2>
          <p className="text-ivory/65 text-sm md:text-base">
            Twelve structured ways for corporates, foundations, development partners, media
            institutions, universities and diaspora organisations to partner with NESA-Africa 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SPONSOR_LANE_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
            >
              <Link
                to={card.href}
                onClick={() =>
                  trackEvent("sponsor_lane_click", { title: card.title, from: "lanes_grid" })
                }
                className="group relative flex h-full flex-col rounded-2xl border border-gold/20 hover:border-gold/60 bg-charcoal/60 p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_hsl(var(--gold)/0.5)]"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-gold/80 font-semibold mb-2">
                  {card.startingAmount}
                </div>
                <h3 className="font-display text-lg font-semibold text-ivory leading-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-ivory/65 text-sm leading-relaxed mb-3 flex-1">
                  {card.description}
                </p>
                {card.limit && (
                  <div className="text-[11px] text-ivory/55 mb-3">
                    Sponsor limit: <span className="text-ivory/75">{card.limit}</span>
                  </div>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-gold font-semibold mt-auto">
                  {card.ctaLabel}{" "}
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorPartnershipLanes;
