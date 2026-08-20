// Live register for the Influencer Education Impact Award 2026.
//
// Source of truth is `influencer_impact_nominees` (rejected/malformed rows are
// filtered out by RLS). Curated seed entries are merged in only to enrich rows
// that already exist in the database (real portrait, flag, evidence links) and
// to keep the historic curated figures visible until they are ingested.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  SEED_NOMINEES,
  type InfluencerNominee,
  type CategoryId,
  type RegionId,
  type RecognitionClass,
  type VerificationStatus,
} from "@/config/awards/influencerImpact2026";

const seedBySlug = new Map(SEED_NOMINEES.map((n) => [n.slug, n]));

function mapRow(row: any): InfluencerNominee {
  const seed = seedBySlug.get(row.slug);
  return {
    slug: row.slug,
    award_family: row.award_family,
    award_category: row.award_category as CategoryId,
    recognition_class: row.recognition_class as RecognitionClass,
    nominee_name: row.nominee_name,
    nominee_country: row.nominee_country,
    flag: seed?.flag ?? "",
    nominee_region: row.nominee_region as RegionId,
    education_impact_summary: row.education_impact_summary,
    evidence_links: row.evidence_links?.length ? row.evidence_links : (seed?.evidence_links ?? []),
    verification_status: row.verification_status as VerificationStatus,
    verified_nominations: row.verified_nominations ?? 0,
    image: row.image_url || seed?.image || "",
    contact_on_file: Boolean(row.contact_on_file),
    primary_social_media_platform:
      row.primary_social_media_platform ?? seed?.primary_social_media_platform,
    other_platforms: row.other_platforms ?? seed?.other_platforms,
    content_impact_area: row.content_impact_area ?? seed?.content_impact_area,
    follower_count_range: row.follower_count_range ?? seed?.follower_count_range,
    platform_profile_link: row.platform_profile_link ?? seed?.platform_profile_link,
    primary_sport_area: row.primary_sport_area ?? seed?.primary_sport_area,
    club_team_or_foundation: row.club_team_or_foundation ?? seed?.club_team_or_foundation,
    sports_education_impact_area:
      row.sports_education_impact_area ?? seed?.sports_education_impact_area,
    athlete_status: row.athlete_status ?? seed?.athlete_status,
    sports_profile_link: row.sports_profile_link ?? seed?.sports_profile_link,
    music_genre: row.music_genre ?? seed?.music_genre,
    other_music_genres: row.other_music_genres ?? seed?.other_music_genres,
    stage_name: row.stage_name ?? seed?.stage_name,
    label_or_foundation: row.label_or_foundation ?? seed?.label_or_foundation,
    music_education_impact_area:
      row.music_education_impact_area ?? seed?.music_education_impact_area,
    artist_profile_link: row.artist_profile_link ?? seed?.artist_profile_link,
  };
}

async function fetchInfluencerNominees(): Promise<InfluencerNominee[]> {
  const { data, error } = await supabase
    .from("influencer_impact_nominees")
    .select("*")
    .neq("verification_status", "REJECTED")
    .order("verification_status", { ascending: true })
    .order("nominee_name", { ascending: true });
  if (error) throw error;

  const rows = (data ?? []).map(mapRow);
  const present = new Set(rows.map((r) => r.slug));
  const curatedOnly = SEED_NOMINEES.filter((s) => !present.has(s.slug));

  return [...rows, ...curatedOnly];
}

export function useInfluencerNominees() {
  const q = useQuery({
    queryKey: ["influencer-impact-nominees"],
    queryFn: fetchInfluencerNominees,
    staleTime: 1000 * 60 * 10,
  });

  const nominees = q.data ?? SEED_NOMINEES;

  return {
    nominees,
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
  };
}
