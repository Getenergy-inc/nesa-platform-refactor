import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InitialsAvatar } from "@/components/influencer-impact/InitialsAvatar";
import { useInfluencerNominees } from "@/hooks/useInfluencerNominees";
import {
  CATEGORIES,
  NOMINATE_URL,
  type CategoryId,
  type InfluencerNominee,
} from "@/config/awards/influencerImpact2026";
import { Link } from "react-router-dom";

interface Props {
  category: CategoryId;
  /** Anchor id of the full picture catalogue on the same page. */
  catalogueAnchor?: string;
}

function statusLabel(status: string) {
  if (status === "VERIFIED") return "Verified";
  if (status === "PENDING") return "Pending Review";
  return status;
}

/**
 * Featured Enablers spotlight for a single Influencer Education Impact category.
 *
 * Reads the admin-controlled `is_featured` flag on `influencer_impact_nominees`.
 * Never pads to three: whatever is genuinely featured is what renders.
 */
export function FeaturedInfluencerSpotlight({ category, catalogueAnchor = "existing-nominees" }: Props) {
  const { nominees, loading } = useInfluencerNominees({ dbOnly: true });
  const categoryMeta = CATEGORIES.find((c) => c.id === category);

  const featured = useMemo(
    () =>
      nominees
        .filter((n) => n.award_category === category && n.is_featured)
        .sort((a, b) => a.nominee_name.localeCompare(b.nominee_name))
        .slice(0, 3),
    [nominees, category],
  );

  return (
    <section
      id="featured-enablers"
      aria-labelledby="featured-enablers-h"
      className="scroll-mt-28 py-10 border-b border-gold/10"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">
            <Sparkles className="h-3 w-3" /> Featured Enablers
          </span>
          <h2
            id="featured-enablers-h"
            className="mt-2 font-display text-2xl md:text-3xl font-bold text-white"
          >
            Spotlight ·{" "}
            <span className="text-gold">{categoryMeta?.shortName ?? "Education Enablers"}</span>
          </h2>
        </div>
        <a
          href={`#${catalogueAnchor}`}
          className="text-xs font-semibold text-gold hover:text-gold-light"
        >
          Browse the full catalogue →
        </a>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : featured.length === 0 ? (
        <EmptySpotlight category={category} />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((n, i) => (
              <SpotlightCard key={n.slug} nominee={n} rank={i + 1} />
            ))}
          </div>
          {featured.length < 3 && (
            <p className="mt-4 text-xs text-white/55">
              More Featured Enablers coming as nominations are verified.
            </p>
          )}
        </>
      )}
    </section>
  );
}

function EmptySpotlight({ category }: { category: CategoryId }) {
  const meta = CATEGORIES.find((c) => c.id === category);
  return (
    <div className="rounded-2xl border border-dashed border-gold/25 bg-gold/[0.04] p-8 text-center">
      <p className="text-gold text-sm font-semibold mb-1">No Featured Enablers yet</p>
      <p className="text-white/65 text-xs max-w-md mx-auto">
        No {meta?.shortName ?? "Influencer"} nominee has been verified and featured for 2026 yet.
        Nominations are open — featured spotlights are selected after NRC impact verification.
      </p>
      <Button asChild size="sm" className="mt-4 bg-gold text-charcoal hover:bg-gold/90">
        <Link to={NOMINATE_URL(category)}>Nominate an Education Enabler</Link>
      </Button>
    </div>
  );
}

function SpotlightCard({ nominee: n, rank }: { nominee: InfluencerNominee; rank: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(n.image) && !imageFailed;
  const meta = CATEGORIES.find((c) => c.id === n.award_category);
  const profileLink =
    n.platform_profile_link ?? n.sports_profile_link ?? n.artist_profile_link ?? n.evidence_links?.[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: rank * 0.08 }}
      className="group relative overflow-hidden rounded-2xl border border-gold/20 hover:border-gold/50 transition-all bg-gradient-to-br from-charcoal-light to-charcoal h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        {showImage ? (
          <img
            src={n.image}
            alt={n.nominee_name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <InitialsAvatar name={n.nominee_name} label={meta?.shortName} />
        )}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <Badge className="bg-gold/90 text-charcoal border-none text-[10px] font-semibold">
            #{rank} Featured
          </Badge>
          <Badge
            className={
              n.verification_status === "VERIFIED"
                ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30 text-[10px] gap-1"
                : "bg-amber-500/15 text-amber-200 border-amber-400/30 text-[10px] gap-1"
            }
          >
            {n.verification_status === "VERIFIED" ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {statusLabel(n.verification_status)}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-display text-lg font-bold text-white leading-tight">
          {n.nominee_name}
        </h3>
        <p className="text-white/55 text-xs flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          {n.nominee_country} · {n.nominee_region}
        </p>
        <p className="text-white/70 text-xs leading-relaxed line-clamp-3">
          {n.education_impact_summary}
        </p>
        {profileLink && (
          <a
            href={profileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-[11px] font-semibold text-gold hover:text-gold-light pt-2"
          >
            View public profile / evidence <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export default FeaturedInfluencerSpotlight;
