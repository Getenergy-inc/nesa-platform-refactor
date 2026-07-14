import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";


const onCta = (cta: string, to: string) => () =>
  trackEvent("hero_cta_click", { cta, to, location: "hero" });

/**
 * HeroCTAStack — Conversion-focused hero CTAs (max 3).
 *
 *  1. PRIMARY    — Nominate Now (gold fill)
 *  2. SECONDARY  — Explore Award Categories (ivory / gold text)
 *  3. TERTIARY   — Accept Your Nomination (gold outline)
 *
 * Sponsor / Volunteer / Judge / Donate / Wallet CTAs live in the header nav
 * and their dedicated sections lower on the page — kept out of the hero to
 * reduce CTA overload and bounce.
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const heroBtn =
  "group relative inline-flex h-[60px] sm:h-[64px] w-full items-center justify-center gap-2.5 rounded-2xl px-5 text-base font-bold tracking-wide uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

export function HeroCTAStack() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-xl mx-auto lg:mx-0"
    >
      {/* PRIMARY — Nominate an Education Enabler */}
      <motion.div variants={item} className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-2xl bg-gold/35 blur-2xl"
        />
        <Link
          to="/nominate"
          aria-label="Nominate an Education Enabler for NESA-Africa 2026"
          onClick={onCta("nominate_education_enabler", "/nominate")}
          className={`${heroBtn} bg-gold text-charcoal shadow-[0_12px_36px_-8px_hsl(var(--gold)/0.85)] hover:-translate-y-1 hover:bg-amber-400 hover:shadow-[0_18px_44px_-8px_hsl(var(--gold)/1)]`}
        >
          <Trophy className="h-5 w-5" strokeWidth={2.5} />
          <span className="truncate">Nominate an Education Enabler</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
        </Link>
      </motion.div>

      {/* SECONDARY + TERTIARY row */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div variants={item}>
          <Link
            to="/awards"
            aria-label="Explore NESA-Africa 2026 Recognition framework"
            onClick={onCta("explore_recognition_2026", "/awards")}
            className={`${heroBtn} rounded-2xl bg-ivory text-gold border-2 border-ivory hover:-translate-y-1 hover:bg-white`}
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={2.5} />
            <span className="truncate">Explore Recognition 2026</span>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link
            to="/nominees/accept"
            aria-label="Accept your NESA-Africa nomination"
            onClick={onCta("accept_your_nomination", "/nominees/accept")}
            className={`${heroBtn} rounded-2xl border-2 border-gold/60 bg-transparent text-gold hover:-translate-y-1 hover:bg-gold/10`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
            <span className="truncate">Accept Your Nomination</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
