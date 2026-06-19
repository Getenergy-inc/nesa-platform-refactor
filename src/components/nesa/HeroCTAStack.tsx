import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Compass, Heart, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const onCta = (cta: string, to: string) => () =>
  trackEvent("hero_cta_click", { cta, to, location: "hero" });

/**
 * HeroCTAStack — Phase 1 reduction (7 CTAs → 3 primary + 4 secondary text links).
 *
 * PRIMARY (3):  Nominate for 2026 · Discover Changemakers · Become a Volunteer
 * SECONDARY:    Explore Existing Nominees · Award Categories · Voting Timeline · AGC Voting Coin
 *
 * Wallet, sponsor and judge CTAs live in the global utility bar / nav.
 */

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const baseBtn =
  "group inline-flex h-[52px] sm:h-12 lg:h-11 w-full items-center justify-center gap-2 rounded-2xl sm:rounded-full px-4 sm:px-5 text-[15px] sm:text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

const SECONDARY_LINKS: { label: string; to: string; cta: string }[] = [
  { label: "Explore Existing Nominees", to: "/nominees", cta: "explore_existing_nominees" },
  { label: "Explore Award Categories", to: "/awards", cta: "explore_award_categories" },
  { label: "View Voting Timeline", to: "/vote", cta: "view_voting_timeline" },
  { label: "Learn About AGC Voting Coin", to: "/earn-agc", cta: "learn_about_agc" },
];

export function HeroCTAStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto lg:mx-0"
    >
      {/* PRIMARY — 3 CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2.5">
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

        <motion.div variants={item}>
          <Link
            to="/nominees"
            aria-label="Discover Africa's Education Changemakers"
            onClick={onCta("discover_changemakers", "/nominees")}
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <Compass className="h-4 w-4 text-gold" />
            <span className="truncate">Discover Changemakers</span>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link
            to="/volunteer"
            aria-label="Become a Volunteer"
            onClick={onCta("become_volunteer", "/volunteer")}
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <Heart className="h-4 w-4 text-gold" />
            <span className="truncate">Become a Volunteer</span>
          </Link>
        </motion.div>
      </div>

      {/* SECONDARY — smaller text links beneath hero */}
      <motion.nav
        variants={item}
        aria-label="Secondary hero links"
        className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-[13px]"
      >
        {SECONDARY_LINKS.map((l, i) => (
          <span key={l.to} className="flex items-center gap-x-4">
            <Link
              to={l.to}
              onClick={onCta(l.cta, l.to)}
              className="text-white/70 hover:text-gold underline-offset-4 hover:underline transition-colors"
            >
              {l.label}
            </Link>
            {i < SECONDARY_LINKS.length - 1 && (
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold/30" />
            )}
          </span>
        ))}
      </motion.nav>
    </motion.div>
  );
}
