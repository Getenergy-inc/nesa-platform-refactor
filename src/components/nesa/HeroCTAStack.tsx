import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Coins, Search, LayoutGrid, ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * HeroCTAStack — Premium 4-CTA engagement architecture
 *
 * Hierarchy:
 *  1. PRIMARY   — Nominate a Changemaker (gold gradient, glow, shimmer)
 *  2. SECONDARY — Earn AGC Voting Points (dark glass + coin pulse)
 *  3. TERTIARY  — Explore Existing Nominees (cinematic discovery)
 *  4. QUATERNARY— View Award Categories (minimal outlined)
 *
 * Layout: 2x2 luxury grid on desktop, staggered stack on mobile.
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function HeroCTAStack() {
  const { t } = useTranslation("pages");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl mx-auto lg:mx-0"
    >
      {/* PRIMARY — Full-width hero conversion */}
      <motion.div variants={item} className="mb-4">
        <Link to="/nominate" className="block group" aria-label="Nominate a Changemaker">
          <div className="relative">
            {/* Ambient pulse glow */}
            <motion.span
              aria-hidden
              className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 via-gold to-amber-500 opacity-60 blur-xl"
              animate={{ opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Button surface */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 via-gold to-amber-500 p-[1.5px] shadow-[0_20px_50px_-15px_hsl(var(--gold)/0.6)] transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-[0_28px_60px_-15px_hsl(var(--gold)/0.75)]">
              <div className="relative flex items-center justify-between gap-4 rounded-[14px] bg-gradient-to-br from-amber-200 via-gold to-amber-400 px-6 py-5 sm:px-7 sm:py-6">
                {/* Shimmer sweep */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full"
                />
                <div className="relative flex items-center gap-4 min-w-0">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal/15 ring-1 ring-charcoal/20 backdrop-blur-sm">
                    <Trophy className="h-6 w-6 text-charcoal" />
                  </span>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-charcoal/70">
                        Primary Action
                      </span>
                      <Sparkles className="h-3 w-3 text-charcoal/70" />
                    </div>
                    <div className="font-display text-lg sm:text-xl font-bold text-charcoal leading-tight">
                      Nominate a Changemaker
                    </div>
                    <div className="text-xs sm:text-sm text-charcoal/75 mt-0.5 truncate">
                      Celebrate Africa's education impact leaders
                    </div>
                  </div>
                </div>
                <ArrowRight className="relative h-5 w-5 shrink-0 text-charcoal transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* SECONDARY ROW — AGC + Explore */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        {/* SECONDARY — Earn AGC (dark glass + coin) */}
        <motion.div variants={item}>
          <Link to="/earn-agc" className="block group h-full" aria-label="Earn AGC Voting Points">
            <div className="relative h-full overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-charcoal-light/80 to-charcoal/90 backdrop-blur-xl px-5 py-4 sm:py-5 transition-all duration-500 hover:border-gold/70 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-15px_hsl(var(--gold)/0.45)]">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gold/20 blur-3xl opacity-60 transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative flex items-center gap-3">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 ring-1 ring-gold/40">
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-gold/30"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Coins className="relative h-5 w-5 text-gold" />
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/80">
                    Reward
                  </div>
                  <div className="font-semibold text-white text-sm sm:text-base leading-tight">
                    Earn AGC Voting Points
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/60 mt-0.5">
                    Get rewarded for supporting changemakers
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* TERTIARY — Explore Nominees */}
        <motion.div variants={item}>
          <Link to="/nominees" className="block group h-full" aria-label="Explore Existing Nominees">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] backdrop-blur-xl px-5 py-4 sm:py-5 transition-all duration-500 hover:border-gold/50 hover:bg-white/[0.06] hover:-translate-y-0.5">
              {/* Spotlight sweep */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), hsl(var(--gold) / 0.18), transparent 45%)",
                }}
              />
              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/15 transition-colors duration-500 group-hover:ring-gold/50 group-hover:bg-gold/10">
                  <Search className="h-5 w-5 text-white/90 transition-transform duration-500 group-hover:scale-110 group-hover:text-gold" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                    Discover
                  </div>
                  <div className="font-semibold text-white text-sm sm:text-base leading-tight">
                    Explore Existing Nominees
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/55 mt-0.5">
                    Discover changemakers across Africa
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-gold" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* QUATERNARY — Categories (minimal full-width) */}
      <motion.div variants={item}>
        <Link to="/categories" className="block group" aria-label="View Award Categories">
          <div className="relative flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-charcoal/40 backdrop-blur-md px-5 py-3 transition-all duration-500 hover:border-gold/40 hover:bg-charcoal/60">
            <div className="flex items-center gap-3 min-w-0">
              <LayoutGrid className="h-4 w-4 text-gold/80 transition-transform duration-500 group-hover:rotate-90" />
              <div className="min-w-0">
                <span className="text-sm font-medium text-white/90 group-hover:text-gold transition-colors">
                  View Award Categories
                </span>
                <span className="hidden sm:inline text-xs text-white/45 ml-2">
                  · Browse all recognition pathways
                </span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-white/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-gold" />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
