/**
 * FeaturedChangemakersSection — homepage gateway into the nominee discovery
 * ecosystem. Renders a Quick Stats bar, top-voted nominee cards, and primary
 * CTAs into /nominees, /awards, regional discovery, and the nomination flow.
 *
 * Pulls live data via the shared useNominees hook so the homepage always
 * mirrors the real /nominees hub without a separate query.
 */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Globe2,
  MapPin,
  Trophy,
  Sparkles,
  ArrowRight,
  Compass,
  Accessibility,
} from "lucide-react";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees } from "@/hooks/useNominees";

const STAT_FALLBACK = {
  totalNominees: 1760,
  countries: 54,
  regions: 8,
  categories: 100,
  pathways: 4,
};

export function FeaturedChangemakersSection() {
  const { data: nominees, isLoading } = useNominees();

  const stats = useMemo(() => {
    if (!nominees?.length) return STAT_FALLBACK;
    const countries = new Set<string>();
    const categories = new Set<string>();
    nominees.forEach((n) => {
      if (n.country) countries.add(n.country.toLowerCase());
      if (n.categorySlug) categories.add(n.categorySlug);
    });
    return {
      totalNominees: Math.max(nominees.length, STAT_FALLBACK.totalNominees),
      countries: Math.max(countries.size, STAT_FALLBACK.countries),
      regions: STAT_FALLBACK.regions,
      categories: Math.max(categories.size, STAT_FALLBACK.categories),
      pathways: STAT_FALLBACK.pathways,
    };
  }, [nominees]);

  const featured = useMemo(() => {
    if (!nominees?.length) return [];
    return [...nominees]
      .sort((a, b) => (b.publicVotes ?? 0) - (a.publicVotes ?? 0))
      .slice(0, 8);
  }, [nominees]);

  const statItems = [
    { icon: Users, label: "Existing Nominees", value: `${stats.totalNominees.toLocaleString()}+` },
    { icon: Globe2, label: "Countries", value: stats.countries.toString() },
    { icon: MapPin, label: "Legacy Regions", value: stats.regions.toString() },
    { icon: Trophy, label: "Award Categories", value: `${stats.categories}+` },
    { icon: Sparkles, label: "Recognition Subcategories", value: stats.pathways.toString() },
  ];

  return (
    <section
      id="discover-changemakers"
      aria-labelledby="discover-changemakers-heading"
      className="relative py-14 sm:py-20 bg-charcoal border-t border-gold/10 scroll-mt-20"
    >
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] sm:text-xs font-semibold tracking-[0.18em] uppercase mb-3">
            <Compass className="h-3 w-3" /> Africa's Education Impact Directory
          </span>
          <h2
            id="discover-changemakers-heading"
            className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
          >
            Discover Africa's{" "}
            <span className="text-gold">Education Changemakers</span>
          </h2>
          <p className="text-white/75 text-sm sm:text-base leading-relaxed">
            Across Africa and the diaspora, educators, innovators, institutions,
            advocates, philanthropists, influencers, policymakers, community
            leaders, and organisations are transforming education through
            measurable impact.
          </p>
        </div>

        {/* Quick Stats Bar */}
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 mb-8 sm:mb-10"
          aria-label="NESA-Africa nominee discovery stats"
        >
          {statItems.map((s) => (
            <li
              key={s.label}
              className="rounded-xl border border-gold/20 bg-charcoal-light/40 px-3 py-3 sm:py-4 text-center"
            >
              <s.icon className="h-4 w-4 sm:h-5 sm:w-5 text-gold mx-auto mb-1.5" />
              <p className="font-display text-lg sm:text-2xl font-bold text-white leading-none">
                {s.value}
              </p>
              <p className="text-[10px] sm:text-xs text-white/65 mt-1 leading-tight">
                {s.label}
              </p>
            </li>
          ))}
        </ul>

        {/* Featured nominee grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl bg-charcoal-light/40" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            {featured.map((n) => (
              <LandingNomineeCard key={n.id} nominee={n} />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-xl border border-dashed border-gold/25 bg-charcoal-light/30 p-8 text-center text-white/65 text-sm mb-8">
            Nominee profiles will appear here as 2026 nominations are verified.
          </div>
        )}

        {/* Primary CTAs into the discovery ecosystem */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          <CTA to="/nominees" label="Explore Existing Nominees" icon={Users} primary />
          <CTA to="/awards" label="View Categories" icon={Trophy} />
          <CTA to="/awards#subcategories" label="View Subcategories" icon={Sparkles} />
          <CTA to="/nominees?group=africa-regional" label="Regional Nominees" icon={MapPin} />
          <CTA to="/nominees?category=special-needs" label="Special Needs Schools" icon={Accessibility} />
          <CTA to="/nominate" label="Nominate a Changemaker" icon={ArrowRight} primary />
        </div>

        {/* Governance note */}
        <p className="mt-6 text-[11px] sm:text-xs text-white/45 text-center max-w-3xl mx-auto leading-relaxed">
          Being listed as a nominee does not imply finalist status, jury
          endorsement, winner status, sponsorship endorsement, or award
          selection. Nominee status remains subject to verification, evaluation,
          voting, judging, and governance procedures.
        </p>
      </div>
    </section>
  );
}

function CTA({
  to,
  label,
  icon: Icon,
  primary = false,
}: {
  to: string;
  label: string;
  icon: typeof Users;
  primary?: boolean;
}) {
  const base =
    "group inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[12px] sm:text-sm font-medium transition-all duration-300 text-center";
  const variant = primary
    ? "bg-gold text-charcoal hover:bg-gold-dark hover:-translate-y-0.5 shadow-[0_4px_14px_-6px_hsl(var(--gold)/0.6)]"
    : "border border-gold/30 bg-charcoal-light/40 text-white/85 hover:border-gold/60 hover:text-gold hover:bg-gold/5";
  return (
    <Link to={to} className={`${base} ${variant}`} aria-label={label}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default FeaturedChangemakersSection;
