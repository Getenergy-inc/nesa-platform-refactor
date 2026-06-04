/**
 * FeaturedNomineesSection — Landing-page nominee discovery gateway.
 *
 * Renders:
 *  - "Discover Africa's Education Changemakers" header
 *  - Quick Stats Bar (1,760+ nominees · 54 countries · 8 regions · 100+ categories · 4 pathways)
 *  - 6 featured nominee cards (live from useNominees, falls back to skeletons)
 *  - Three CTAs: Explore Existing Nominees · View Categories · Nominate a Changemaker
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, MapPin, Globe2, LayoutGrid, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";

const STATS = [
  { icon: Users, value: "1,760+", label: "Existing Nominees" },
  { icon: Globe2, value: "54", label: "Countries" },
  { icon: MapPin, value: "8", label: "Legacy Regions" },
  { icon: LayoutGrid, value: "100+", label: "Award Categories" },
  { icon: Trophy, value: "4", label: "Recognition Pathways" },
];

const baseBtn =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

export function FeaturedNomineesSection() {
  const { data: nominees, isLoading } = useNominees();

  const featured = (nominees ?? [])
    .filter((n) => n.status === "platinum" || n.status === "approved" || n.status === "pending")
    .sort((a, b) => (b.isPlatinum ? 1 : 0) - (a.isPlatinum ? 1 : 0) || b.publicVotes - a.publicVotes)
    .slice(0, 6);

  return (
    <section
      id="featured-nominees"
      aria-labelledby="featured-nominees-heading"
      className="bg-charcoal py-12 md:py-16"
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <Badge className="mb-3 bg-gold/15 text-gold border border-gold/30">
            <Sparkles className="w-3 h-3 mr-1" /> Africa's Education Impact Directory
          </Badge>
          <h2
            id="featured-nominees-heading"
            className="font-display text-3xl md:text-5xl font-bold text-ivory mb-3"
          >
            Discover Africa's Education{" "}
            <span className="text-gold bg-gradient-to-r from-gold to-amber-400 bg-clip-text text-transparent">
              Changemakers
            </span>
          </h2>
          <p className="text-ivory/75 max-w-3xl mx-auto text-[15px] md:text-base leading-relaxed">
            Across Africa and the diaspora, educators, innovators, institutions, advocates,
            philanthropists, influencers, policymakers, community leaders, and organisations are
            transforming education through measurable impact.
          </p>
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 rounded-2xl border border-gold/20 bg-charcoal-light/40 px-3 py-4 md:px-6 md:py-5"
        >
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label} className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 border border-gold/30">
                    <Icon className="h-4 w-4 text-gold" />
                  </span>
                  <div className="text-left">
                    <div className="font-display text-lg md:text-xl font-bold text-ivory leading-none">
                      {s.value}
                    </div>
                    <div className="text-[11px] md:text-xs text-ivory/65 mt-1">{s.label}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex justify-center">
            <Link
              to="/nominees"
              className="inline-flex items-center gap-1.5 text-gold text-xs md:text-sm font-semibold hover:underline"
            >
              Explore Existing Nominees
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Featured nominee cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {isLoading || featured.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl bg-charcoal-light/40" />
              ))
            : featured.map((n) => <LandingNomineeCard key={n.id} nominee={n} />)}
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/nominees"
            aria-label="Explore Existing Nominees"
            className={`${baseBtn} bg-gold text-charcoal font-semibold hover:bg-gold-dark`}
          >
            <Users className="h-4 w-4" />
            Explore Existing Nominees
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/categories"
            aria-label="View Categories"
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold`}
          >
            <LayoutGrid className="h-4 w-4 text-gold" />
            View Categories
          </Link>
          <Link
            to="/nominate"
            aria-label="Nominate a Changemaker"
            className={`${baseBtn} border border-gold/60 bg-charcoal/40 text-white hover:border-gold hover:bg-gold/10 hover:text-gold`}
          >
            <Trophy className="h-4 w-4 text-gold" />
            Nominate a Changemaker
          </Link>
        </div>

        {/* Governance notice */}
        <p className="mt-6 text-center text-[11px] md:text-xs text-ivory/55 max-w-3xl mx-auto leading-relaxed">
          Being listed as a nominee does not imply finalist status, jury endorsement, winner status,
          sponsorship endorsement, or award selection. Nominee status remains subject to
          verification, evaluation, voting, and governance procedures.
        </p>
      </div>
    </section>
  );
}

export default FeaturedNomineesSection;
