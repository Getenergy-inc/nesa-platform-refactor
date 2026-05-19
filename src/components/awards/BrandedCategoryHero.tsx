import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import iconImg from "@/assets/pathway-cards/icon.jpg";
import csrImg from "@/assets/pathway-cards/csr.jpg";
import influencerImg from "@/assets/pathway-cards/influencer.jpg";
import grantsImg from "@/assets/pathway-cards/grants.jpg";

export type BrandedCategoryTheme = "legacy" | "corporate" | "influencer" | "global";

type ThemeTokens = {
  eyebrow: string;
  accent: string;            // text accent class
  accentSoft: string;        // soft bg
  border: string;
  ring: string;
  glow: string;              // blur glow color
  headlineAccent: string;    // gradient for second headline line
  ctaBg: string;             // primary CTA bg
  ctaText: string;
  tagBorder: string;
  tagText: string;
  image: string;
};

const THEMES: Record<BrandedCategoryTheme, ThemeTokens> = {
  legacy: {
    eyebrow: "LEGACY · 2006–2026",
    accent: "text-gold",
    accentSoft: "bg-gold/10",
    border: "border-gold/40",
    ring: "ring-gold/30",
    glow: "bg-gold/20",
    headlineAccent: "bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent",
    ctaBg: "bg-gold hover:bg-gold/90",
    ctaText: "text-charcoal",
    tagBorder: "border-gold/40",
    tagText: "text-gold",
    image: iconImg,
  },
  corporate: {
    eyebrow: "CORPORATE · CONTINENTAL",
    accent: "text-emerald-300",
    accentSoft: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    ring: "ring-emerald-400/30",
    glow: "bg-emerald-500/20",
    headlineAccent: "bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300 bg-clip-text text-transparent",
    ctaBg: "bg-emerald-500 hover:bg-emerald-500/90",
    ctaText: "text-charcoal",
    tagBorder: "border-emerald-500/40",
    tagText: "text-emerald-300",
    image: csrImg,
  },
  influencer: {
    eyebrow: "CREATORS · MUSIC · SPORTS",
    accent: "text-purple-300",
    accentSoft: "bg-purple-500/10",
    border: "border-purple-500/40",
    ring: "ring-purple-400/30",
    glow: "bg-purple-500/20",
    headlineAccent: "bg-gradient-to-r from-purple-300 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent",
    ctaBg: "bg-purple-500 hover:bg-purple-500/90",
    ctaText: "text-white",
    tagBorder: "border-purple-500/40",
    tagText: "text-purple-300",
    image: influencerImg,
  },
  global: {
    eyebrow: "GLOBAL · BILATERAL · MULTILATERAL",
    accent: "text-sky-300",
    accentSoft: "bg-sky-500/10",
    border: "border-sky-500/40",
    ring: "ring-sky-400/30",
    glow: "bg-sky-500/20",
    headlineAccent: "bg-gradient-to-r from-sky-300 via-blue-400 to-sky-300 bg-clip-text text-transparent",
    ctaBg: "bg-sky-500 hover:bg-sky-500/90",
    ctaText: "text-white",
    tagBorder: "border-sky-500/40",
    tagText: "text-sky-300",
    image: grantsImg,
  },
};

export interface BrandedCategoryHeroProps {
  theme: BrandedCategoryTheme;
  headlineLead: string;       // e.g. "Who Will Be Crowned"
  headlineAccent: string;     // e.g. "Africa Education Icon?"
  description: string;
  tags: string[];
  stats?: { label: string; value?: string }[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  watchCta?: { label: string; href: string };
  imageAlt: string;
}

export function BrandedCategoryHero({
  theme,
  headlineLead,
  headlineAccent,
  description,
  tags,
  stats = [],
  primaryCta,
  secondaryCta,
  watchCta,
  imageAlt,
}: BrandedCategoryHeroProps) {
  const t = THEMES[theme];

  return (
    <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-black via-charcoal to-charcoal">
      {/* Glow layers */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute -top-40 -left-32 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-40", t.glow)} />
        <div className={cn("absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-30", t.glow)} />
      </div>

      <div className="container relative mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <Badge
              variant="outline"
              className={cn(
                "mb-5 px-3 py-1 tracking-[0.18em] text-[10px] uppercase",
                t.border,
                t.accentSoft,
                t.accent,
              )}
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              {t.eyebrow}
            </Badge>

            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white">
              {headlineLead}{" "}
              <span className={t.headlineAccent}>{headlineAccent}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base md:text-lg text-white/70">
              {description}
            </p>

            {stats.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={cn(
                      "rounded-xl border bg-white/[0.03] backdrop-blur px-3 py-2.5",
                      t.border,
                    )}
                  >
                    {s.value && (
                      <div className={cn("font-display text-lg font-bold", t.accent)}>
                        {s.value}
                      </div>
                    )}
                    <div className="text-[11px] leading-tight text-white/70">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className={cn("rounded-full px-6 font-semibold", t.ctaBg, t.ctaText)}>
                <Link to={primaryCta.href}>
                  {primaryCta.label} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className={cn("rounded-full px-6", t.border, t.accent, "bg-white/0 hover:bg-white/5")}
                >
                  <Link to={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
              {watchCta && (
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className={cn("rounded-full px-4 gap-2", t.accent, "hover:bg-white/5")}
                >
                  <Link to={watchCta.href}>
                    <Play className="h-4 w-4 fill-current" />
                    {watchCta.label}
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>

          {/* Right: visual + tag cloud */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className={cn(
              "relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-square rounded-3xl overflow-hidden border ring-1",
              t.border, t.ring,
            )}>
              <img
                src={t.image}
                alt={imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
            </div>

            {/* Tag cloud */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border bg-white/[0.03] backdrop-blur",
                    t.tagBorder, t.tagText,
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
