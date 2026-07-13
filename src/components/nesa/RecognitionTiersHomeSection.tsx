import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * Compact "Recognition Architecture at a Glance" table.
 * Replaces the previous 4-card grid because the four tiers are already
 * introduced in detail by <CallForNominationIconAward />.
 */

type Row = {
  tier: string;
  structure: string;
  review: string;
  href: string;
};

const ROWS: Row[] = [
  {
    tier: "Africa Education Icon Award",
    structure: "3 subcategories · 9 laureate positions",
    review: "NRC, Icon Jury and governance",
    href: "/awards/africa-education-icon",
  },
  {
    tier: "Influencer Education Impact",
    structure: "3 subcategories",
    review: "NRC and governance",
    href: "/awards/influencers-education-impact",
  },
  {
    tier: "Platinum Recognition",
    structure: "7 categories · 27 subcategories",
    review: "Due diligence, NRC and governance",
    href: "/awards/platinum-recognition",
  },
  {
    tier: "Gold-Blue Garnet Recognition",
    structure: "9 categories · 63 subcategories",
    review: "NRC and governance",
    href: "/awards/gold-blue-garnet",
  },
];

export function RecognitionTiersHomeSection() {
  return (
    <section
      className="relative py-20 md:py-28 bg-charcoal"
      aria-labelledby="recognition-architecture-heading"
    >
      <div className="container relative z-10 max-w-5xl">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-gold/80 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            NESA-Africa 2026 Recognition
          </p>
          <h2
            id="recognition-architecture-heading"
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Recognition Architecture <span className="text-gold">at a Glance</span>
          </h2>
          <p className="text-white/75 text-base md:text-lg">
            Four tiers · Eighteen categories · Ninety-six subcategories. Each category has its own nomination form, nominee type, evidence requirements and geographic classification.
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-2xl border border-gold/25 bg-charcoal/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-charcoal/80 text-gold/85 uppercase text-[11px] tracking-[0.14em]">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Tier</th>
                <th scope="col" className="px-5 py-3 font-semibold">Structure</th>
                <th scope="col" className="px-5 py-3 font-semibold">Review Route</th>
                <th scope="col" className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <motion.tr
                  key={row.tier}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="border-t border-gold/10 hover:bg-gold/[0.04] transition-colors"
                >
                  <td className="px-5 py-4 font-display text-base font-bold text-white">{row.tier}</td>
                  <td className="px-5 py-4 text-white/75">{row.structure}</td>
                  <td className="px-5 py-4 text-white/65">{row.review}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={row.href}
                      onClick={() =>
                        trackEvent("home_cta_click", {
                          cta: "architecture_row",
                          label: row.tier,
                          to: row.href,
                          section: "recognition_architecture",
                        })
                      }
                      className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:underline"
                    >
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked list */}
        <ul className="md:hidden space-y-3">
          {ROWS.map((row) => (
            <li
              key={row.tier}
              className="rounded-2xl border border-gold/20 bg-charcoal/60 p-4"
            >
              <p className="font-display text-base font-bold text-white">{row.tier}</p>
              <p className="mt-1 text-sm text-white/75">{row.structure}</p>
              <p className="mt-1 text-xs text-white/55">{row.review}</p>
              <Link
                to={row.href}
                onClick={() =>
                  trackEvent("home_cta_click", {
                    cta: "architecture_row",
                    label: row.tier,
                    to: row.href,
                    section: "recognition_architecture",
                  })
                }
                className="mt-3 inline-flex items-center gap-1 text-gold text-sm font-semibold"
              >
                View <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            to="/awards"
            onClick={() =>
              trackEvent("home_cta_click", {
                cta: "explore_recognition_framework",
                to: "/awards",
                section: "recognition_architecture",
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-amber-400 transition"
          >
            Explore the Complete Recognition Framework
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RecognitionTiersHomeSection;
