// Four Recognition Pathways — Tier breakdown with examples.
// Uses charcoal/gold tokens, no custom CSS.

import { motion } from "framer-motion";
import {
  Crown,
  Trophy,
  Award,
  Sparkles,
  ArrowRight,
  User,
  Building2,
  Globe,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const PATHWAYS = [
  {
    id: "icon",
    icon: Crown,
    tier: "Tier 1",
    title: "Africa Education Icon",
    subtitle: "Lifetime recognition for individuals whose contributions have transformed education across generations.",
    examples: [
      { name: "Mo Ibrahim", icon: User },
      { name: "Wole Soyinka", icon: User },
      { name: "Chinua Achebe", icon: User },
      { name: "Strive Masiyiwa", icon: User },
      { name: "Folorunso Alakija", icon: User },
    ],
    href: "/awards/icon",
    cta: "Explore Icon Award",
  },
  {
    id: "blue-garnet",
    icon: Trophy,
    tier: "Tier 2",
    title: "Blue Garnet Awards",
    subtitle:
      "Competitive awards recognising outstanding educational contributions across Africa. 100+ categories including:",
    examples: [
      { name: "CSR", icon: Building2 },
      { name: "STEM", icon: Award },
      { name: "EdTech", icon: Globe },
      { name: "NGO Impact", icon: Building2 },
      { name: "Policy", icon: Award },
      { name: "Media", icon: Palette },
      { name: "Research", icon: Award },
      { name: "Leadership", icon: User },
      { name: "Inclusion", icon: Globe },
    ],
    href: "/awards/blue-garnet",
    cta: "See All Categories",
  },
  {
    id: "platinum",
    icon: Award,
    tier: "Tier 3",
    title: "Platinum Recognition",
    subtitle:
      "Recognition for institutional and systems-level educational contributions.",
    examples: [
      { name: "Governments", icon: Building2 },
      { name: "Development Partners", icon: Globe },
      { name: "Bilateral Agencies", icon: Building2 },
      { name: "Research Institutions", icon: Award },
    ],
    href: "/awards/platinum",
    cta: "View Platinum Honours",
  },
  {
    id: "influencer",
    icon: Sparkles,
    tier: "Tier 4",
    title: "Influencer Education Impact",
    subtitle:
      "Recognising education advocacy through creative and cultural platforms.",
    examples: [
      { name: "Sports", icon: Trophy },
      { name: "Music", icon: Palette },
      { name: "Social Media", icon: Globe },
      { name: "Creative Arts", icon: Palette },
    ],
    href: "/awards/influencers",
    cta: "Meet the Creators Track",
  },
];

export function RecognitionPathwaysSection() {
  return (
    <section
      aria-labelledby="pathways-heading"
      className="bg-gradient-to-b from-charcoal via-charcoal-light/20 to-charcoal py-12 md:py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            <Trophy className="h-3 w-3" />
            Recognition Architecture
          </p>
          <h2
            id="pathways-heading"
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3"
          >
            Four Recognition <span className="text-gold">Pathways</span>
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            NESA-Africa 2026 honours education excellence across four distinct
            tiers — from lifetime icons to creative advocates.
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 sm:grid-cols-2">
          {PATHWAYS.map((pathway, idx) => (
            <motion.article
              key={pathway.id}
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
                    <pathway.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/70">
                    {pathway.tier}
                  </span>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold text-white leading-tight mb-1">
                  {pathway.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {pathway.subtitle}
                </p>

                {/* Examples / Includes */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {pathway.examples.map((ex) => (
                    <span
                      key={ex.name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/5 border border-gold/20 text-white/80 text-xs"
                    >
                      <ex.icon className="h-3 w-3 text-gold/70" />
                      {ex.name}
                    </span>
                  ))}
                </div>

                <Link
                  to={pathway.href}
                  className="mt-auto inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all"
                >
                  {pathway.cta}
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

export default RecognitionPathwaysSection;
