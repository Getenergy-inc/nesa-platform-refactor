import { motion } from "framer-motion";
import { Clock, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCountdown } from "@/hooks/useCountdown";

/**
 * MAIN LANDING-PAGE COUNTDOWN
 *
 * Hard-locked to: Gold-Blue Garnet Awards Gala — 22 October 2026, 18:00 WAT.
 * Do NOT reintroduce "first future event" auto-selection here.
 * Other intermediate milestones (TV shows, voting windows) live in
 * <UpcomingEventsSection /> and have their own countdowns.
 */
const GALA_TARGET = new Date("2026-10-22T18:00:00+01:00");
const GALA_LABEL = "NESA-Africa 2026 Gold-Blue Garnet Awards Gala";
const SEASON_BADGE = "NESA-Africa 2026";

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-charcoal-light border border-gold/30 sm:h-18 sm:w-18">
        <span className="text-2xl font-bold text-gold tabular-nums sm:text-3xl">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-1.5 text-[10px] font-medium uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}

export function CountdownSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(GALA_TARGET);

  return (
    <section className="relative py-10 sm:py-14 bg-charcoal overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-3xl mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 mb-5">
          <Clock className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            {SEASON_BADGE}
          </span>
        </div>

        <h2 className="flex items-center justify-center gap-2 text-lg sm:text-xl font-bold text-white mb-2">
          <Trophy className="h-5 w-5 text-gold" />
          {GALA_LABEL}
        </h2>
        <p className="text-xs sm:text-sm text-white/60 mb-2">
          22 October 2026 · Lagos, Nigeria
        </p>
        <p className="text-xs sm:text-sm text-white/55 mb-6 max-w-xl mx-auto">
          Africa's flagship education recognition moment celebrating the Enablers of Education for All across Africa, the Diaspora and Friends of Africa.
        </p>

        {isExpired ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/40 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
              Gala Live / Completed
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <CountdownBlock value={days} label="Days" />
            <span className="text-xl font-bold text-gold/40 mt-[-18px]">:</span>
            <CountdownBlock value={hours} label="Hours" />
            <span className="text-xl font-bold text-gold/40 mt-[-18px]">:</span>
            <CountdownBlock value={minutes} label="Min" />
            <span className="text-xl font-bold text-gold/40 mt-[-18px]">:</span>
            <CountdownBlock value={seconds} label="Sec" />
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/gala"
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20 transition-colors"
          >
            View Gala Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
