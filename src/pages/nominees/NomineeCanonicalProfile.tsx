import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBreadcrumbs, NomineeCard } from "@/components/iconAward/shared";
import { NomineeSupportPanel } from "@/components/nominees/NomineeSupportPanel";
import { useNomineeProfile } from "@/hooks/useNomineeProfile";
import {
  ICON_AWARD,
  byClassification,
  classificationUrl,
  getClassification,
  getIconNominee,
  getSubcategory,
  subcategoryUrl,
} from "@/data/iconAward";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { NesaTvLink } from "@/components/common/NesaTvLink";
import { ExternalLink, MapPin, ShieldCheck, Trophy } from "lucide-react";

const SITE = "https://nesaafrica.lovable.app";

function extractYouTubeId(url?: string | null): string | undefined {
  if (!url) return undefined;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m?.[1];
}

/**
 * Canonical nominee profile:
 *   /nominees/:award/:category/:classification/:slug
 *
 * Static Icon Award data is the baseline; any approved Cloud record for the
 * same slug overrides it, so nominee-submitted (NRC-approved) edits win.
 */
export default function NomineeCanonicalProfile() {
  const { category, classification, slug } = useParams<{
    award: string;
    category: string;
    classification: string;
    slug: string;
  }>();

  const staticNominee = slug ? getIconNominee(slug) : undefined;
  const { profile, loading } = useNomineeProfile(slug);

  const sub = getSubcategory(staticNominee?.award_subcategory_slug ?? category ?? "");
  const cls = getClassification(staticNominee?.classification_slug ?? classification ?? "");

  if (!staticNominee && !profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-white">
          {loading ? "Loading profile…" : "This profile is not published yet"}
        </h1>
        {!loading && (
          <>
            <p className="mt-3 text-white/60">
              The nominee record you are looking for is still in verification with the
              Nominee Research Corps, or the link has changed.
            </p>
            <Button asChild className="mt-6">
              <Link to="/nominees">Explore existing nominees</Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  const name = profile?.name ?? staticNominee!.name;
  const photo = profile?.photo_url ?? staticNominee?.image_url;
  const country = profile?.country ?? staticNominee?.country;
  const region = profile?.region ?? staticNominee?.region;
  const summary =
    profile?.bio ?? staticNominee?.impact_summary ?? "";
  const story = profile?.work_done ?? staticNominee?.full_impact_story ?? "";
  const evidence = profile?.evidence_urls ?? [];
  const videoId =
    profile?.youtube_video_id ?? extractYouTubeId(profile?.video_url);
  const verified = profile?.nrc_verified ?? staticNominee?.verification_status === "verified";

  const path = `/nominees/africa-education-icon-award/${sub?.slug ?? category}/${cls?.slug ?? classification}/${slug}`;
  const url = `${SITE}${path}`;
  const title = staticNominee?.seo_title ?? `${name} | ${sub?.title ?? "Nominee"} | NESA-Africa 2026`;
  const description = (staticNominee?.seo_description ?? summary).slice(0, 155);

  const related = sub && cls
    ? byClassification(sub.slug, cls.slug).filter((n) => n.slug !== slug).slice(0, 3)
    : [];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name,
            description: summary,
            nationality: country,
            award: ICON_AWARD.title,
            url,
            image: photo,
          })}
        </script>
      </Helmet>

      <div className="bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-10">
          {sub && cls && (
            <IconBreadcrumbs
              items={[
                { label: "Nominees", href: "/nominees" },
                { label: ICON_AWARD.title, href: "/nominees/africa-education-icon-award" },
                { label: sub.title, href: subcategoryUrl(sub.slug) },
                { label: cls.title, href: classificationUrl(sub.slug, cls.slug) },
                { label: name },
              ]}
            />
          )}

          {/* Hero */}
          <header className="mt-6 grid gap-8 md:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-gold/20 bg-black/40">
              <img
                src={photo || "/images/africaicons/placeholder-icon.svg"}
                alt={`Portrait of ${name}`}
                className="aspect-[4/5] w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/images/africaicons/placeholder-icon.svg";
                }}
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {sub && (
                  <Badge className="bg-gold/90 text-charcoal">
                    <Trophy className="mr-1 h-3 w-3" /> {sub.title}
                  </Badge>
                )}
                {cls && (
                  <Badge variant="outline" className="border-gold/30 text-gold/90">
                    {cls.title}
                  </Badge>
                )}
                {verified && (
                  <Badge variant="outline" className="border-emerald-400/40 text-emerald-300">
                    <ShieldCheck className="mr-1 h-3 w-3" /> NRC verified
                  </Badge>
                )}
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">
                {name}
              </h1>
              {(profile?.title || profile?.organization) && (
                <p className="mt-1 text-white/70">
                  {[profile?.title, profile?.organization].filter(Boolean).join(" · ")}
                </p>
              )}
              {(country || region) && (
                <p className="mt-2 flex items-center gap-1 text-sm text-white/60">
                  <MapPin className="h-4 w-4" /> {[country, region].filter(Boolean).join(" · ")}
                </p>
              )}
              <p className="mt-5 max-w-2xl leading-relaxed text-white/80">{summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/nominate">Nominate an enabler</Link>
                </Button>
                <Button asChild variant="outline" className="border-gold/30 text-gold">
                  <Link to="/nominee-portal">Is this you? Claim this profile</Link>
                </Button>
                <NesaTvLink videoId={videoId} name={name} />
              </div>
            </div>
          </header>

          {/* Story */}
          {story && (
            <section className="mt-12 rounded-2xl border border-white/10 bg-charcoal-light p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-white">
                Contribution to education
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-white/75">{story}</p>
            </section>
          )}

          {/* Video */}
          {videoId && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-semibold text-white">Nominee video</h2>
              <div className="mt-3 aspect-video overflow-hidden rounded-2xl border border-gold/15">
                <iframe
                  src={getYouTubeEmbedUrl(videoId)}
                  title={`${name} — nominee video`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Evidence */}
          {evidence.length > 0 && (
            <section className="mt-8 rounded-2xl border border-white/10 bg-charcoal-light p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold text-white">
                Verifiable evidence
              </h2>
              <ul className="mt-3 space-y-2">
                {evidence.map((href) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="break-all">{href}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-8">
            <NomineeSupportPanel nomineeId={profile?.id} nomineeName={name} shareUrl={url} />
          </div>

          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-xl font-semibold text-white">
                Others in this pathway
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <NomineeCard key={n.slug} nominee={n} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
