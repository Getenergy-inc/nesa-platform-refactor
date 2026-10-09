/**
 * AwardTiersSummarySection — landing page summary of all 4 award tiers,
 * 18 categories, 96 subcategories for NESA-Africa 2026.
 *
 * Subcategory names are only displayed for confirmed categories; the rest
 * show counts only with a deep link to the dedicated tier route.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Crown, Gem, Medal, Trophy } from "lucide-react";
import { AWARD_TIERS_2026, AWARD_TIERS_TOTALS, type AwardTier2026 } from "@/config/awardTiers2026";

const TIER_ICONS: Record<AwardTier2026["id"], typeof Crown> = {
  "blue-garnet": Gem,
  platinum: Medal,
  icon: Crown,
  influencers: Trophy,
};

function TierCard({ tier }: { tier: AwardTier2026 }) {
  const [open, setOpen] = useState(false);
  const Icon = TIER_ICONS[tier.id];
  const subTotal = tier.categories.reduce((s, c) => s + c.subcategoryCount, 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-gold/25 bg-charcoal/70 overflow-hidden flex flex-col"
    >
      <header className="p-5 border-b border-gold/15">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
            Tier {tier.tierNumber}
          </span>
          <Icon className="h-5 w-5 text-gold" />
        </div>
        <h3 className="font-display text-xl font-bold text-ivory leading-tight">
          {tier.name}
        </h3>
        <p className="text-ivory/65 text-xs mt-1">{tier.subtitle}</p>
      </header>

      <div className="p-5 space-y-3 flex-1">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ivory/50 mb-1">
            Vote mechanic
          </div>
          <div className="text-ivory/85 text-xs leading-relaxed">{tier.voteMechanicLabel}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-ivory/50 mb-1">
            Key dates
          </div>
          <div className="text-gold/90 text-xs leading-relaxed">{tier.keyDates}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="rounded-lg border border-gold/15 bg-charcoal/50 px-3 py-2 text-center">
            <div className="text-gold font-bold text-lg leading-none">{tier.categories.length}</div>
            <div className="text-ivory/55 text-[10px] uppercase tracking-wider mt-1">
              {tier.categories.length === 1 ? "Category" : "Categories"}
            </div>
          </div>
          <div className="rounded-lg border border-gold/15 bg-charcoal/50 px-3 py-2 text-center">
            <div className="text-gold font-bold text-lg leading-none">{subTotal}</div>
            <div className="text-ivory/55 text-[10px] uppercase tracking-wider mt-1">
              Subcategories
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-2 text-left text-ivory/85 hover:text-gold text-xs font-semibold uppercase tracking-wider"
        >
          <span>{open ? "Hide" : "View"} categories</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="space-y-2 text-xs">
            {tier.categories.map((c) => (
              <li key={c.id} className="rounded-md border border-gold/10 bg-charcoal/40 px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-ivory/90 leading-snug">
                    <span className="text-gold/70 font-mono mr-2">
                      {String(c.id).padStart(2, "0")}
                    </span>
                    {c.name}
                  </div>
                  <span className="shrink-0 text-gold text-[10px] font-semibold">
                    {c.subcategoryCount} sub
                  </span>
                </div>
                {c.subcategoryNames && c.subcategoryNames.length > 0 ? (
                  <ul className="mt-2 ml-6 list-disc text-ivory/65 space-y-0.5">
                    {c.subcategoryNames.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 ml-6 text-ivory/45 italic text-[11px]">
                    Subcategory names listed on the platform
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <Link
          to={tier.ctaHref}
          className="block text-center rounded-md bg-gold text-charcoal font-semibold text-sm px-4 py-2 hover:bg-gold/90 transition-colors"
        >
          {tier.cta}
        </Link>
      </div>
    </motion.article>
  );
}

export function AwardTiersSummarySection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-14 md:py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 text-left group"
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
              NESA-Africa 2026
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mt-1 group-hover:text-gold transition-colors">
              Award Tiers Summary
            </h2>
            <p className="text-ivory/70 text-sm mt-2 max-w-2xl">
              {AWARD_TIERS_TOTALS.tiers} tiers · {AWARD_TIERS_TOTALS.categories} categories ·{" "}
              {AWARD_TIERS_TOTALS.subcategories} subcategories. One continental
              recognition platform, four pathways to honor education enablers.
            </p>
          </div>
          <ChevronDown
            className={`h-6 w-6 text-gold shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`grid transition-all duration-500 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-8" : "grid-rows-[0fr] opacity-0 mt-0"}`}
        >
          <div className="overflow-hidden">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {AWARD_TIERS_2026.map((t) => (
                <TierCard key={t.id} tier={t} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/categories" className="text-gold text-sm hover:underline">
                Browse all award categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AwardTiersSummarySection;
