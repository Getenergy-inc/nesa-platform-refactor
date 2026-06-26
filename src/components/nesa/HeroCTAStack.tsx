import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, Vote as VoteIcon, ArrowRight, Heart, Compass, LayoutGrid, Handshake } from "lucide-react";
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

// Hero-level pronounced CTAs — taller, bolder, with persistent glow + pulse halo.
const heroBtn =
  "group relative inline-flex h-[64px] sm:h-[68px] w-full items-center justify-center gap-2.5 rounded-2xl px-5 text-base sm:text-lg font-bold tracking-wide uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

export function HeroCTAStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto lg:mx-0"
    >
      {/* PRIMARY + SECONDARY row — pronounced hero CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {/* PRIMARY — Nominate Now */}
        <motion.div variants={item} className="relative">
          {/* pulsing halo */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gold/40 blur-xl animate-pulse"
          />
          <Link
            to="/nominate"
            aria-label="Nominate an Education Champion for NESA-Africa 2026"
            onClick={onCta("nominate_education_champion", "/nominate")}
            className={`${heroBtn} bg-gradient-to-br from-gold via-amber-400 to-gold text-charcoal shadow-[0_10px_32px_-6px_hsl(var(--gold)/0.85)] hover:-translate-y-1 hover:shadow-[0_18px_42px_-8px_hsl(var(--gold)/1)] ring-2 ring-gold/70 ring-offset-2 ring-offset-charcoal`}
          >
            <Trophy className="h-5 w-5" />
            <span className="truncate">Nominate an Education Champion</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* SECONDARY — Explore the 7 Recognition Pillars */}
        <motion.div variants={item} className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gold/15 blur-xl"
          />
          <Link
            to="/awards/pillars"
            aria-label="Explore the 7 NESA-Africa Recognition Pillars"
            onClick={onCta("explore_recognition_pillars", "/awards/pillars")}
            className={`${heroBtn} border-2 border-gold bg-charcoal/70 text-gold hover:bg-gold hover:text-charcoal hover:-translate-y-1 shadow-[0_10px_28px_-10px_hsl(var(--gold)/0.7)] hover:shadow-[0_16px_36px_-8px_hsl(var(--gold)/0.95)]`}
          >
            <Compass className="h-5 w-5" />
            <span className="truncate">Explore the 7 Recognition Pillars</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>


      {/* SUPPORT CTAs row — visually lighter (5 spec-aligned support links) */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-2.5">

        {/* SUPPORT — Explore Existing Nominees */}
        <motion.div variants={item}>
          <Link
            to="/nominees"
            aria-label="Explore Existing Nominees"
            onClick={onCta("explore_nominees", "/nominees")}
            className={`${baseBtn} border border-gold/30 bg-charcoal/30 text-white/90 hover:border-gold/50 hover:bg-gold/5 hover:text-gold hover:-translate-y-0.5`}
          >
            <Users className="h-4 w-4 text-gold/80 group-hover:text-gold" />
            <span className="truncate">Explore Nominees</span>
          </Link>
        </motion.div>

        {/* SUPPORT — View Award Categories */}
        <motion.div variants={item}>
          <Link
            to="/awards"
            aria-label="View Award Categories"
            onClick={onCta("view_award_categories", "/awards")}
            className={`${baseBtn} border border-gold/30 bg-charcoal/30 text-white/90 hover:border-gold/50 hover:bg-gold/5 hover:text-gold hover:-translate-y-0.5`}
          >
            <LayoutGrid className="h-4 w-4 text-gold/80 group-hover:text-gold" />
            <span className="truncate">Award Categories</span>
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
            <span className="truncate">Voting Timeline</span>
          </Link>
        </motion.div>

        {/* SUPPORT — Become a Sponsor */}
        <motion.div variants={item}>
          <Link
            to="/sponsors"
            aria-label="Become a Sponsor"
            onClick={onCta("become_sponsor", "/sponsors")}
            className={`${baseBtn} border border-white/15 bg-transparent text-white/80 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5`}
          >
            <Handshake className="h-4 w-4 text-white/60 group-hover:text-gold" />
            <span className="truncate">Become a Sponsor</span>
          </Link>
        </motion.div>

        {/* SUPPORT — Join as Volunteer */}
        <motion.div variants={item}>
          <Link
            to="/volunteer"
            aria-label="Join as a Volunteer"
            onClick={onCta("join_volunteer", "/volunteer")}
            className={`${baseBtn} border border-white/15 bg-transparent text-white/80 hover:border-gold/40 hover:text-gold hover:-translate-y-0.5`}
          >
            <Heart className="h-4 w-4 text-white/60 group-hover:text-gold" />
            <span className="truncate">Join as Volunteer</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
