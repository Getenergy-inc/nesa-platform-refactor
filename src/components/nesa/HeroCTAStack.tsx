import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Coins, Users, Vote as VoteIcon, ArrowRight, Heart, Compass, LayoutGrid } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const onCta = (cta: string, to: string) => () =>
  trackEvent("hero_cta_click", { cta, to, location: "hero" });

/**
 * HeroCTAStack — Compact premium CTA system
 *
 * Hierarchy:
 *  1. PRIMARY    — Nominate for 2026 (gold fill)
 *  2. SECONDARY  — Discover Africa's Education Changemakers (gold outline)
 *  3. SUPPORT    — Explore Nominees / View Voting Timeline / Learn About AGC / Become a Volunteer (lighter)
 *
 * Layout:
 *  - Mobile: vertical stack, all CTAs above the fold
 *  - Desktop: primary + secondary on top row; 4 support CTAs on second row
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
  "group inline-flex h-[52px] sm:h-12 lg:h-11 w-full items-center justify-center gap-2 rounded-2xl sm:rounded-full px-4 sm:px-5 text-[15px] sm:text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

export function HeroCTAStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto lg:mx-0"
    >
      {/* PRIMARY · EXPLORE EXISTING NOMINEES · CATEGORIES — 3-CTA row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2.5">
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

        {/* SECONDARY — Explore Existing Nominees */}
        <motion.div variants={item}>
          <Link
            to="/nominees"
            aria-label="Explore Existing Nominees"
            onClick={onCta("explore_existing_nominees", "/nominees")}
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <Users className="h-4 w-4 text-gold" />
            <span className="truncate">Explore Existing Nominees</span>
          </Link>
        </motion.div>

        {/* TERTIARY — Explore Award Categories */}
        <motion.div variants={item}>
          <Link
            to="/categories"
            aria-label="Explore Award Categories"
            onClick={onCta("explore_categories", "/categories")}
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <LayoutGrid className="h-4 w-4 text-gold" />
            <span className="truncate">Explore Award Categories</span>
          </Link>
        </motion.div>
      </div>

      {/* SUPPORT CTAs row — visually lighter */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2.5">
        {/* SUPPORT — Discover Changemakers (story-led discovery) */}
        <motion.div variants={item}>
          <Link
            to="/nominees?view=discover"
            aria-label="Discover Africa's Education Changemakers"
            onClick={onCta("discover_changemakers", "/nominees?view=discover")}
            className={`${baseBtn} border border-gold/30 bg-charcoal/30 text-white/90 hover:border-gold/50 hover:bg-gold/5 hover:text-gold hover:-translate-y-0.5`}
          >
            <Compass className="h-4 w-4 text-gold/80 group-hover:text-gold" />
            <span className="truncate">Discover Changemakers</span>
          </Link>
        </motion.div>


        {/* SUPPORT — View Voting Timeline */}
        <motion.div variants={item}>
          <Link
            to="/vote"
            aria-label="View Voting Timeline"
            onClick={onCta("view_voting_timeline", "/vote")}
            className={`${baseBtn} border border-gold/30 bg-charcoal/30 text-white/90 hover:border-gold/50 hover:bg-gold/5 hover:text-gold hover:-translate-y-0.5`}
          >
            <VoteIcon className="h-4 w-4 text-gold/80 group-hover:text-gold" />
            <span className="truncate">View Voting Timeline</span>
          </Link>
        </motion.div>

        {/* SUPPORT — Learn About AGC Voting Points */}
        <motion.div variants={item}>
          <Link
            to="/earn-agc"
            aria-label="Learn About AGC Voting Points"
            onClick={onCta("learn_about_agc", "/earn-agc")}
            className={`${baseBtn} border border-white/15 bg-transparent text-white/80 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5`}
          >
            <Coins className="h-4 w-4 text-white/60 group-hover:text-gold" />
            <span className="truncate">Learn About AGC Voting Points</span>
          </Link>
        </motion.div>

        {/* SUPPORT — Become a Volunteer */}
        <motion.div variants={item}>
          <Link
            to="/volunteer"
            aria-label="Become a Volunteer"
            onClick={onCta("become_volunteer", "/volunteer")}
            className={`${baseBtn} border border-white/15 bg-transparent text-white/80 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5`}
          >
            <Heart className="h-4 w-4 text-white/60 group-hover:text-gold" />
            <span className="truncate">Become a Volunteer</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
