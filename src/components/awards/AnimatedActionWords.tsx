import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { BrandedCategoryTheme } from "./BrandedCategoryHero";

type ThemeTokens = {
  eyebrow: string;
  accent: string;
  border: string;
  glow: string;
  gradient: string;
  chipBorder: string;
  chipText: string;
};

const THEMES: Record<BrandedCategoryTheme, ThemeTokens> = {
  legacy: {
    eyebrow: "text-gold/80",
    accent: "text-gold",
    border: "border-gold/30",
    glow: "bg-gold/15",
    gradient: "bg-gradient-to-r from-amber-200 via-gold to-amber-300 bg-clip-text text-transparent",
    chipBorder: "border-gold/40",
    chipText: "text-gold",
  },
  corporate: {
    eyebrow: "text-emerald-300/80",
    accent: "text-emerald-300",
    border: "border-emerald-500/30",
    glow: "bg-emerald-500/15",
    gradient: "bg-gradient-to-r from-emerald-200 via-emerald-300 to-green-400 bg-clip-text text-transparent",
    chipBorder: "border-emerald-500/40",
    chipText: "text-emerald-300",
  },
  influencer: {
    eyebrow: "text-purple-300/80",
    accent: "text-purple-300",
    border: "border-purple-500/30",
    glow: "bg-purple-500/15",
    gradient: "bg-gradient-to-r from-purple-200 via-fuchsia-300 to-purple-400 bg-clip-text text-transparent",
    chipBorder: "border-purple-500/40",
    chipText: "text-purple-300",
  },
  global: {
    eyebrow: "text-sky-300/80",
    accent: "text-sky-300",
    border: "border-sky-500/30",
    glow: "bg-sky-500/15",
    gradient: "bg-gradient-to-r from-sky-200 via-sky-300 to-blue-400 bg-clip-text text-transparent",
    chipBorder: "border-sky-500/40",
    chipText: "text-sky-300",
  },
  stem: {
    eyebrow: "text-cyan-300/80", accent: "text-cyan-300", border: "border-cyan-500/30", glow: "bg-cyan-500/15",
    gradient: "bg-gradient-to-r from-cyan-200 via-cyan-300 to-sky-400 bg-clip-text text-transparent",
    chipBorder: "border-cyan-500/40", chipText: "text-cyan-300",
  },
  ngo: {
    eyebrow: "text-orange-300/80", accent: "text-orange-300", border: "border-orange-500/30", glow: "bg-orange-500/15",
    gradient: "bg-gradient-to-r from-orange-200 via-amber-300 to-orange-400 bg-clip-text text-transparent",
    chipBorder: "border-orange-500/40", chipText: "text-orange-300",
  },
  media: {
    eyebrow: "text-rose-300/80", accent: "text-rose-300", border: "border-rose-500/30", glow: "bg-rose-500/15",
    gradient: "bg-gradient-to-r from-rose-200 via-pink-300 to-rose-400 bg-clip-text text-transparent",
    chipBorder: "border-rose-500/40", chipText: "text-rose-300",
  },
  regional: {
    eyebrow: "text-teal-300/80", accent: "text-teal-300", border: "border-teal-500/30", glow: "bg-teal-500/15",
    gradient: "bg-gradient-to-r from-teal-200 via-emerald-300 to-teal-400 bg-clip-text text-transparent",
    chipBorder: "border-teal-500/40", chipText: "text-teal-300",
  },
  platinum: {
    eyebrow: "text-zinc-200/80", accent: "text-zinc-200", border: "border-zinc-300/30", glow: "bg-zinc-300/15",
    gradient: "bg-gradient-to-r from-white via-zinc-300 to-white bg-clip-text text-transparent",
    chipBorder: "border-zinc-300/40", chipText: "text-zinc-200",
  },
  bluegarnet: {
    eyebrow: "text-indigo-300/80", accent: "text-indigo-300", border: "border-indigo-500/30", glow: "bg-indigo-500/15",
    gradient: "bg-gradient-to-r from-indigo-200 via-gold to-indigo-300 bg-clip-text text-transparent",
    chipBorder: "border-indigo-500/40", chipText: "text-indigo-300",
  },
  diaspora: {
    eyebrow: "text-violet-300/80", accent: "text-violet-300", border: "border-violet-500/30", glow: "bg-violet-500/15",
    gradient: "bg-gradient-to-r from-violet-200 via-fuchsia-300 to-violet-400 bg-clip-text text-transparent",
    chipBorder: "border-violet-500/40", chipText: "text-violet-300",
  },
};

export interface AnimatedActionWordsProps {
  theme: BrandedCategoryTheme;
  eyebrow?: string;
  lead?: string;
  words: string[];
  intervalMs?: number;
}

export function AnimatedActionWords({
  theme,
  eyebrow = "Words That Move A Continent",
  lead = "This Award Stands For",
  words,
  intervalMs = 1800,
}: AnimatedActionWordsProps) {
  const t = THEMES[theme];
  const reduceMotion = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [words.length, intervalMs, reduceMotion]);

  // Duplicate words for seamless marquee loop
  const marquee = [...words, ...words];

  return (
    <section
      className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-charcoal via-black to-charcoal py-10 lg:py-14"
      aria-label="Animated action words"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30", t.glow)} />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={cn("text-[10px] md:text-xs tracking-[0.32em] uppercase font-semibold", t.eyebrow)}
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-3 font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-white"
        >
          {lead}{" "}
          <span className="relative inline-block align-baseline min-w-[6ch]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={words[i] ?? ""}
                initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn("inline-block whitespace-nowrap font-display", t.gradient)}
              >
                {words[i]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h2>
      </div>

      {/* Edge-faded marquee */}
      <div className="relative mt-8 lg:mt-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-charcoal to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-charcoal to-transparent"
        />

        <div className="overflow-hidden">
          <motion.ul
            className="flex gap-3 whitespace-nowrap will-change-transform"
            animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: Math.max(20, words.length * 3), ease: "linear", repeat: Infinity }
            }
          >
            {marquee.map((w, idx) => {
              const isFeatured = idx % words.length === i;
              return (
                <li
                  key={`${w}-${idx}`}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm bg-white/[0.03] backdrop-blur transition-colors duration-500",
                    t.chipBorder,
                    isFeatured ? cn(t.accent, "bg-white/[0.08]") : t.chipText,
                  )}
                >
                  {w}
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
