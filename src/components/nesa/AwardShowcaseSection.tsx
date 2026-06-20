// Premium 4-tier award showcase for the NESA-Africa 2026 landing page.
// Mobile-first stacked cards, desktop 2x2 grid. Uses charcoal/gold tokens.

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Trophy, Award, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AwardTier = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  cta: string;
};

const TIERS: AwardTier[] = [
  {
    id: "icon",
    icon: Crown,
    eyebrow: "Tier 1 · Lifetime",
    title: "Africa Education Icon",
    tagline: "Lifetime Impact Recognition",
    description:
      "Continental honour for individuals whose lifetime work has reshaped African education across decades, borders, and generations.",
    href: "/awards/icon",
    cta: "Explore the Icon Award",
  },
  {
    id: "blue-garnet",
    icon: Trophy,
    eyebrow: "Tier 2 · Competitive",
    title: "Blue Garnet Awards",
    tagline: "Competitive Excellence Recognition",
    description:
      "The flagship competitive track — public nominations, AGC voting, expert judging, and the Blue Garnet Gala finale.",
    href: "/awards/blue-garnet",
    cta: "See Blue Garnet Categories",
  },
  {
    id: "platinum",
    icon: Award,
    eyebrow: "Tier 3 · Institutional",
    title: "Platinum Recognition",
    tagline: "Institutional Impact Recognition",
    description:
      "Reserved for institutions, ministries, foundations, and multilateral partners delivering measurable, scaled education impact.",
    href: "/awards/platinum",
    cta: "View Platinum Honours",
  },
  {
    id: "influencer",
    icon: Sparkles,
    eyebrow: "Tier 4 · Creators",
    title: "Influencer Education Impact",
    tagline: "Creators Advancing Education",
    description:
      "Celebrating creators, broadcasters, and digital voices using media to advance education access and learning culture.",
    href: "/awards/influencers",
    cta: "Meet the Creators Track",
  },
];

export function AwardShowcaseSection() {
  return (
    <section
      aria-labelledby="award-showcase-heading"
      className="bg-charcoal py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            <Trophy className="h-3 w-3" />
            Award Architecture
          </p>
          <h2
            id="award-showcase-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3"
          >
            Four Tiers. <span className="text-gold">One Standard.</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            NESA-Africa 2026 recognises education excellence through a four-tier
            architecture spanning lifetime icons, competitive winners, institutional
            impact, and creator influence.
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 sm:grid-cols-2">
          {TIERS.map((tier, idx) => (
            <motion.article
              key={tier.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-gold/20",
                "bg-gradient-to-br from-charcoal-light/60 via-charcoal to-charcoal",
                "p-5 md:p-7 hover:border-gold/50 transition-all duration-300",
                "hover:shadow-[0_18px_60px_-30px_hsl(var(--gold)/0.45)]",
              )}
            >
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 text-gold">
                    <tier.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/70">
                    {tier.eyebrow}
                  </span>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight mb-1">
                  {tier.title}
                </h3>
                <p className="text-gold text-xs md:text-sm font-medium mb-3">
                  {tier.tagline}
                </p>
                <p className="text-white/70 text-sm leading-relaxed mb-5 flex-1">
                  {tier.description}
                </p>

                <Link
                  to={tier.href}
                  className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all"
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-colors"
          >
            View All Award Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AwardShowcaseSection;
