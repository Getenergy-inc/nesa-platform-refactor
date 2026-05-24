import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Coins, Users, LayoutGrid, ArrowRight, Heart } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const onCta = (cta: string, to: string) => () =>
  trackEvent("hero_cta_click", { cta, to, location: "hero" });

/**
 * HeroCTAStack — Compact premium CTA system
 *
 * Hierarchy (subtle, not loud):
 *  1. PRIMARY    — Nominate a Changemaker (gold fill)
 *  2. SECONDARY  — Earn AGC Voting Points (gold outline + coin)
 *  3. TERTIARY   — Explore Existing Nominees (gold outline + users)
 *  4. QUATERNARY — View Award Categories (ghost outline)
 *
 * Layout:
 *  - Mobile: 2x2 grid, all CTAs above the fold
 *  - Desktop: single horizontal row, compact and balanced
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const baseBtn =
  "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 sm:px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

export function HeroCTAStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto lg:mx-0"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* PRIMARY */}
        <motion.div variants={item}>
          <Link
            to="/nominate"
            aria-label="Nominate for 2026"
            onClick={onCta("nominate", "/nominate")}
            className={`${baseBtn} bg-gold text-charcoal font-semibold shadow-[0_6px_18px_-8px_hsl(var(--gold)/0.7)] hover:bg-gold-dark hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_hsl(var(--gold)/0.85)]`}
          >
            <Trophy className="h-4 w-4" />
            <span className="truncate">Nominate for 2026</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* SECONDARY */}
        <motion.div variants={item}>
          <Link
            to="/earn-agc"
            aria-label="Earn AGC Voting Points"
            onClick={onCta("earn_agc", "/earn-agc")}
            className={`${baseBtn} border border-gold/50 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:-translate-y-0.5`}
          >
            <Coins className="h-4 w-4 text-gold" />
            <span className="truncate">Earn AGC</span>
          </Link>
        </motion.div>

        {/* TERTIARY — Explore Nominees (kept highly visible) */}
        <motion.div variants={item}>
          <Link
            to="/nominees"
            aria-label="Explore Existing Nominees"
            onClick={onCta("explore_nominees", "/nominees")}
            className={`${baseBtn} border border-gold/40 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <Users className="h-4 w-4 text-gold/90 group-hover:text-gold" />
            <span className="truncate">Explore Nominees</span>
          </Link>
        </motion.div>

        {/* QUATERNARY */}
        <motion.div variants={item}>
          <Link
            to="/categories"
            aria-label="View Award Categories"
            onClick={onCta("categories", "/categories")}
            className={`${baseBtn} border border-white/15 bg-transparent text-white/85 hover:border-gold/50 hover:text-gold hover:-translate-y-0.5`}
          >
            <LayoutGrid className="h-4 w-4 text-white/70 group-hover:text-gold" />
            <span className="truncate">Categories</span>
          </Link>
        </motion.div>
      </div>

      {/* Volunteer conversion pill */}
      <motion.div variants={item} className="mt-3 flex justify-center lg:justify-start">
        <Link
          to="/volunteer"
          onClick={onCta("become_volunteer", "/volunteer")}
          className="group inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium text-gold/90 hover:border-gold hover:bg-gold/10 hover:text-gold transition"
        >
          <Heart className="h-3.5 w-3.5" />
          Become a Volunteer
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      {/* Subtle helper line */}
      <p className="mt-3 text-center lg:text-left text-[11px] text-white/45">
        Nominate · Earn AGC · Discover changemakers · Volunteer
      </p>
    </motion.div>
  );
}
