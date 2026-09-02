/**
 * LaneNomineeProfile — shared extended nominee profile for the award lanes.
 * Route: /nominees/lane/:lane/:slug
 *
 * Published records only (reads the public `public_nominees` view via
 * useNomineeProfile). Honest states when a record is unpublished or fails to
 * load. Mirrors NomineeCanonicalProfile's structure for the Icon award.
 */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  Linkedin,
  MapPin,
  Share2,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { NomineeSupportPanel } from "@/components/nominees/NomineeSupportPanel";
import { useNomineeProfile } from "@/hooks/useNomineeProfile";
import { useCategoryNominees } from "@/components/awards/branded/categoryNomineeData";
import { getNomineeLane } from "@/config/nomineeLanes";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { LaneNomineeCard } from "./LaneGalleryPage";

const SITE = "https://nesaafrica.lovable.app";

function extractYouTubeId(url?: string | null): string | undefined {
  if (!url) return undefined;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m?.[1];
}

export default function LaneNomineeProfile() {
  const { lane: laneSlug, slug } = useParams<{ lane: string; slug: string }>();
  const lane = getNomineeLane(laneSlug);
  const { toast } = useToast();
  const { profile, loading, error } = useNomineeProfile(slug);
  const { data: laneData } = useCategoryNominees(lane?.categorySlug ?? "", Boolean(lane));
  const [imgBroken, setImgBroken] = useState(false);

  const related = useMemo(() => {
    if (!laneData || !profile) return [];
    const subs = lane?.subcategorySlug
      ? laneData.subs.filter((s) => s.slug === lane.subcategorySlug)
      : laneData.subs;
    const ids = new Set(subs.map((s) => s.id));
    return laneData.nominees
      .filter(
        (n) =>
          n.slug !== profile.slug && n.subcategory_id && ids.has(n.subcategory_id),
      )
      .slice(0, 4);
  }, [laneData, profile, lane]);

  if (!lane) return <Navigate to="/nominees" replace />;

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ivory">
          {loading
            ? "Loading profile…"
            : error
              ? "We couldn't load this profile"
              : "This profile is not published yet"}
        </h1>
        {!loading && error && <p className="mt-3 text-ivory/60">{error}</p>}
        {!loading && !error && (
          <p className="mt-3 text-ivory/60">
            The nominee record you are looking for is still in verification with the
            Nominee Research Corps, or the link has changed.
          </p>
        )}
        {!loading && (
          <Button asChild className="mt-6 bg-gold text-charcoal hover:bg-gold/90">
            <Link to={`/nominees/lane/${lane.slug}`}>Back to {lane.title}</Link>
          </Button>
        )}
      </div>
    );
  }

  const path = `/nominees/lane/${lane.slug}/${profile.slug ?? slug}`;
  const url = `${SITE}${path}`;
  const title = `${profile.name} | ${lane.title} | NESA-Africa 2026`;
  const description = (profile.bio ?? lane.intro).slice(0, 155);
  const videoId = profile.youtube_video_id ?? extractYouTubeId(profile.video_url);
  const evidence = profile.evidence_urls ?? [];

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: url });
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

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
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: lane.title, href: `/nominees/lane/${lane.slug}` },
              { label: profile.name },
            ]}
          />

          <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
            <aside className="space-y-4">
              <div className="overflow-hidden rounded-2xl border border-gold/20 bg-charcoal-light/50">
                <div className="aspect-square bg-charcoal">
                  {profile.photo_url && !imgBroken ? (
                    <img
                      src={profile.photo_url}
                      alt={profile.name}
                      onError={() => setImgBroken(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-5xl font-bold text-gold/60">
                      {profile.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-4 text-sm">
                  {profile.country && (
                    <p className="flex items-center gap-2 text-ivory/70">
                      <MapPin className="h-4 w-4 text-gold/70" />
                      {profile.country}
                      {profile.region ? ` · ${profile.region}` : ""}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-ivory/70">
                    <Trophy className="h-4 w-4 text-gold/70" /> {lane.tier}
                  </p>
                  {profile.nrc_verified && (
                    <Badge className="border-0 bg-gold/15 text-gold">
                      <ShieldCheck className="mr-1 h-3 w-3" /> NRC verified
                    </Badge>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gold hover:text-gold/80"
                    >
                      <Globe className="h-4 w-4" /> Website
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gold hover:text-gold/80"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={share}
                className="w-full border-gold/40 text-gold hover:bg-gold/10"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share this profile
              </Button>
              <Button asChild className="w-full bg-gold text-charcoal hover:bg-gold/90">
                <Link to={lane.nominateHref}>Nominate a similar organisation</Link>
              </Button>
              <Link
                to={`/nominees/lane/${lane.slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold/80"
              >
                <ArrowLeft className="h-4 w-4" /> Back to {lane.title}
              </Link>
            </aside>

            <main>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">
                {lane.officialName}
              </p>
              <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold text-ivory">
                {profile.name}
              </h1>
              {(profile.title || profile.organization) && (
                <p className="mt-1 text-ivory/60">
                  {[profile.title, profile.organization].filter(Boolean).join(" · ")}
                </p>
              )}

              {profile.bio && (
                <section className="mt-8">
                  <h2 className="font-display text-xl font-bold text-ivory">Overview</h2>
                  <p className="mt-2 whitespace-pre-line text-ivory/75">{profile.bio}</p>
                </section>
              )}

              {profile.work_done && (
                <section className="mt-8">
                  <h2 className="font-display text-xl font-bold text-ivory">
                    Achievements & education impact
                  </h2>
                  <p className="mt-2 whitespace-pre-line text-ivory/75">{profile.work_done}</p>
                </section>
              )}

              {videoId && (
                <section className="mt-8">
                  <h2 className="font-display text-xl font-bold text-ivory">Video</h2>
                  <div className="mt-3 aspect-video overflow-hidden rounded-2xl border border-gold/20">
                    <iframe
                      src={getYouTubeEmbedUrl(videoId)}
                      title={`${profile.name} video`}
                      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                </section>
              )}

              {evidence.length > 0 && (
                <section className="mt-8">
                  <h2 className="font-display text-xl font-bold text-ivory">Evidence & citations</h2>
                  <ul className="mt-3 space-y-2">
                    {evidence.map((e) => (
                      <li key={e}>
                        <a
                          href={e}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 break-all text-sm text-gold hover:text-gold/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0" /> {e}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="mt-10">
                <NomineeSupportPanel nomineeId={profile.id} nomineeName={profile.name} shareUrl={url} />
              </section>

              {related.length > 0 && (
                <section className="mt-12">
                  <h2 className="font-display text-xl font-bold text-ivory">
                    Other nominees in {lane.title}
                  </h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {related.map((n) => (
                      <LaneNomineeCard key={n.id} nominee={n} laneSlug={lane.slug} />
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
