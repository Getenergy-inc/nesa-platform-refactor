import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Compass, Heart, Handshake, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const onCta = (cta: string, to: string) => () =>
  trackEvent("hero_cta_click", { cta, to, location: "hero" });

/**
 * HeroCTAStack — movement-first CTAs.
 * PRIMARY:   Nominate a Changemaker
 * SECONDARY: Explore Existing Nominees · Become a Volunteer · Become a Sponsor
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

export function HeroCTAStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto lg:mx-0"
    >
      {/* PRIMARY */}
      <motion.div variants={item} className="mb-3">
        <Link
          to="/nominate"
          aria-label="Nominate a Changemaker"
          onClick={onCta("nominate_changemaker", "/nominate")}
          className={`${baseBtn} bg-gold text-charcoal font-semibold shadow-[0_6px_18px_-8px_hsl(var(--gold)/0.7)] hover:bg-gold-dark hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-8px_hsl(var(--gold)/0.85)]`}
        >
          <Trophy className="h-4 w-4" />
          <span className="truncate">Nominate a Changemaker</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </motion.div>

      {/* SECONDARY — 3 supporting actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2.5">
        <motion.div variants={item}>
          <Link
            to="/nominees"
            aria-label="Explore Existing Nominees"
            onClick={onCta("explore_existing_nominees", "/nominees")}
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <Compass className="h-4 w-4 text-gold" />
            <span className="truncate">Explore Nominees</span>
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

        <motion.div variants={item}>
          <Link
            to="/sponsor"
            aria-label="Become a Sponsor"
            onClick={onCta("become_sponsor", "/sponsor")}
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold hover:-translate-y-0.5`}
          >
            <Handshake className="h-4 w-4 text-gold" />
            <span className="truncate">Become a Sponsor</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
