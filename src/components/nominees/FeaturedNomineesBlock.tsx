import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNominees, type EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { LandingNomineeCard } from "@/components/nesa/LandingNomineeCard";
import { NomineeGovernanceNotice } from "./NomineeGovernanceNotice";
import { normalizeRegion } from "@/lib/regions";

interface Props {
  title?: string;
  subtitle?: string;
  /** Filter by category slug */
  categorySlug?: string;
  /** Filter by subcategory slug */
  subcategorySlug?: string;
  /** Filter by region (normalized substring match) */
  region?: string;
  /** Filter by country */
  country?: string;
  /** Award family slug (icon / influencer / gold-bluegarnet / platinum / rmsa) */
  awardFamily?: string;
  limit?: number;
  showGovernanceNotice?: boolean;
  showViewAllCta?: boolean;
  viewAllHref?: string;
  className?: string;
}

/**
 * Cross-surface reusable nominee carousel/grid.
 * Embeds on category, subcategory, regional, sponsor, judge, and tier pages.
 */
export function FeaturedNomineesBlock({
  title = "Featured Nominees",
  subtitle = "Discover education changemakers helping advance Education for All.",
  categorySlug,
  subcategorySlug,
  region,
  country,
  awardFamily,
  limit = 6,
  showGovernanceNotice = true,
  showViewAllCta = true,
  viewAllHref,
  className,
}: Props) {
  const { data: nominees, isLoading } = useNominees();

  const filtered = useMemo(() => {
    const list = (nominees ?? []).filter(
      (n) => n.status === "approved" || n.status === "platinum" || n.status === "pending",
    );
    return list
      .filter((n) => {
        if (categorySlug && n.categorySlug !== categorySlug) return false;
        if (subcategorySlug && n.subcategorySlug !== subcategorySlug) return false;
        if (country && (n.country ?? "").toLowerCase() !== country.toLowerCase()) return false;
        if (region) {
          const norm = normalizeRegion(n.region ?? "").toLowerCase();
          if (!norm.includes(region.toLowerCase())) return false;
        }
        if (awardFamily) {
          const af = (n as unknown as Record<string, unknown>).awardFamily;
          if (af !== awardFamily) return false;
        }
        return true;
      })
      .sort((a, b) => Number(b.nrcVerified ?? false) - Number(a.nrcVerified ?? false) || a.name.localeCompare(b.name))
      .slice(0, limit);
  }, [nominees, categorySlug, subcategorySlug, region, country, awardFamily, limit]);

  const href = viewAllHref || (() => {
    const p = new URLSearchParams();
    if (categorySlug) p.set("category", categorySlug);
    if (region) p.set("region", region);
    if (country) p.set("country", country);
    if (awardFamily) p.set("awardFamily", awardFamily);
    const q = p.toString();
    return q ? `/nominees?${q}` : "/nominees";
  })();

  return (
    <section className={`py-8 ${className ?? ""}`} aria-label={title}>
      <div className="flex items-end justify-between mb-5 gap-3 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gold mb-1.5">
            <Sparkles className="w-3 h-3" /> Existing Nominees
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-ivory">{title}</h2>
          <p className="text-xs md:text-sm text-ivory/60 mt-1">{subtitle}</p>
        </div>
        {showViewAllCta && (
          <Button asChild variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
            <Link to={href}>
              View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl bg-charcoal-light/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gold/20 bg-charcoal-light/30 p-6 text-center">
          <p className="text-sm text-ivory/60">
            Nominee profiles will appear here as 2026 nominations are verified.
          </p>
          <Button asChild size="sm" className="mt-3 bg-gold text-charcoal hover:bg-gold/90">
            <Link to="/nominate">Nominate a Changemaker</Link>
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((n: EnrichedDatabaseNominee) => (
            <LandingNomineeCard key={n.id} nominee={n} />
          ))}
        </motion.div>
      )}

      {showGovernanceNotice && (
        <div className="mt-5">
          <NomineeGovernanceNotice variant="banner" />
        </div>
      )}
    </section>
  );
}

export default FeaturedNomineesBlock;
