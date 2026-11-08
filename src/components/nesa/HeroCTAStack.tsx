import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

const onCta = (cta: string, to: string) => () => trackEvent("hero_cta_click", { cta, to, location: "hero" });
const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };
const heroBtn = "group relative inline-flex h-[60px] sm:h-[64px] w-full items-center justify-center gap-2.5 rounded-2xl px-5 text-base font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

export function HeroCTAStack() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-xl mx-auto lg:mx-0">
      <motion.div variants={item} className="relative">
        <span aria-hidden className="pointer-events-none absolute -inset-1 rounded-2xl bg-gold/35 blur-2xl" />
        <a
          href={PUBLIC_ACTIONS_2026.nominate.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nominate an Education Enabler for NESA-Africa 2026"
          onClick={onCta("nominate_education_enabler", PUBLIC_ACTIONS_2026.nominate.href)}
          className={`${heroBtn} bg-gold text-charcoal shadow-[0_12px_36px_-8px_hsl(var(--gold)/0.85)] hover:-translate-y-1 hover:bg-gold/90`}
        >
          <Trophy className="h-5 w-5" strokeWidth={2.5} />
          <span>Nominate an Education Enabler</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
        </a>
      </motion.div>
      <motion.div variants={item} className="mt-3">
        <Link
          to={PUBLIC_ACTIONS_2026.exploreAwards.href}
          aria-label="Explore the Awards"
          onClick={onCta("explore_awards", PUBLIC_ACTIONS_2026.exploreAwards.href)}
          className={`${heroBtn} rounded-2xl bg-transparent text-gold border-2 border-gold/70 hover:-translate-y-1 hover:bg-gold/10`}
        >
          <Search className="h-5 w-5" strokeWidth={2.5} />
          <span>Explore the Awards</span>
        </Link>
      </motion.div>
      <motion.div variants={item} className="mt-3 text-center lg:text-left">
        <Link to={PUBLIC_ACTIONS_2026.recognitionProcess.href} onClick={onCta("recognition_process", PUBLIC_ACTIONS_2026.recognitionProcess.href)} className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-gold underline-offset-4 hover:underline transition-colors">
          {PUBLIC_ACTIONS_2026.recognitionProcess.label}
        </Link>
      </motion.div>
    </motion.div>
  );
}
