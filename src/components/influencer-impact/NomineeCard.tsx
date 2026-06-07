import { Link } from "react-router-dom";
import { CheckCircle2, Clock, MapPin, Share2, Plus, ExternalLink } from "lucide-react";
import {
  CATEGORIES,
  NOMINATE_URL,
  type InfluencerNominee,
} from "@/config/awards/influencerImpact2026";

interface Props {
  nominee: InfluencerNominee;
}

export function NomineeCard({ nominee: n }: Props) {
  const category = CATEGORIES.find((c) => c.id === n.award_category)!;
  const classification =
    n.primary_social_media_platform ?? n.primary_sport_area ?? n.music_genre ?? "—";
  const impactArea =
    n.content_impact_area ??
    n.sports_education_impact_area ??
    n.music_education_impact_area ??
    "—";

  const profileLink =
    n.platform_profile_link ?? n.sports_profile_link ?? n.artist_profile_link;

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-gold/40 transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-charcoal">
        <img
          src={n.image}
          alt={n.nominee_name}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          <Badge tone="gold">{category.shortName}</Badge>
          <Badge tone={n.verification_status === "VERIFIED" ? "emerald" : "amber"}>
            {n.verification_status === "VERIFIED" ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {n.verification_status}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge tone="dark">{n.recognition_class}</Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-lg font-bold text-white leading-tight">
            {n.nominee_name}
          </h3>
          <p className="text-white/55 text-xs flex items-center gap-1.5 mt-0.5">
            <MapPin className="h-3 w-3" />
            <span>{n.flag}</span> {n.nominee_country} · {n.nominee_region}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2 text-[11px]">
          <Field label={category.primaryFieldLabel} value={classification} />
          <Field label="Impact Area" value={impactArea} />
        </dl>

        <p className="text-white/65 text-xs leading-relaxed line-clamp-3">
          {n.education_impact_summary}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-[11px] text-white/55">
            <strong className="text-gold">{n.verified_nominations}</strong> verified
            nominations
          </span>
          <div className="flex gap-1">
            {profileLink && (
              <IconLink href={profileLink} label="View profile">
                <ExternalLink className="h-3.5 w-3.5" />
              </IconLink>
            )}
            <Link
              to={NOMINATE_URL(n.award_category)}
              className="text-white/60 hover:text-gold p-1.5 rounded hover:bg-white/5"
              aria-label="Nominate again"
              title="Nominate Again"
            >
              <Plus className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: n.nominee_name,
                    text: n.education_impact_summary,
                    url: typeof window !== "undefined" ? window.location.href : "",
                  });
                }
              }}
              className="text-white/60 hover:text-gold p-1.5 rounded hover:bg-white/5"
              aria-label="Share profile"
              title="Share Profile"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "gold" | "emerald" | "amber" | "dark";
}) {
  const styles: Record<typeof tone, string> = {
    gold: "bg-gold/90 text-charcoal",
    emerald: "bg-emerald-500/90 text-charcoal",
    amber: "bg-amber-500/90 text-charcoal",
    dark: "bg-charcoal/80 text-white/85 border border-white/10",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-white/45 uppercase tracking-wider text-[9px]">{label}</dt>
      <dd className="text-white/80 mt-0.5 truncate">{value}</dd>
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-white/60 hover:text-gold p-1.5 rounded hover:bg-white/5"
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}
