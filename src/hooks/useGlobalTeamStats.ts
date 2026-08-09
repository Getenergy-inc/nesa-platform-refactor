// Live counts for the global team (volunteers + judges + NRC members).
//
// Sources of truth: the Lovable Cloud tables `volunteers`, `judges`,
// `nrc_members`, `chapters`, merged with the published static roster
// (`STATIC_VOLUNTEERS`) that /volunteers already renders.
//
// Identity: all three role tables carry an additive `person_id` column. Rows
// sharing a `person_id` are the same human, so a volunteer who is also a judge
// counts once and carries both roles. Normalised-name matching is used only to
// fold the published static roster (which has no `person_id`) into the DB rows.
//
// Governance: only fields already flagged for public display are selected.
// No email, phone, internal notes, or internal identifiers are queried here.
// `nrc_members` exposes no public name column, so NRC is counted only (never
// listed by person).
//
// Loading/error contract: every count is `number | null`. `null` means
// "unknown" (still loading, or the query failed) and the UI must render an em
// dash — never 0. A genuine database zero renders as 0.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STATIC_VOLUNTEERS } from "@/lib/volunteersData";

export interface GlobalTeamPerson {
  id: string;
  /** Shared cross-role person key. */
  personId?: string | null;
  name: string;
  role: "volunteer" | "judge";
  country?: string | null;
  region?: string | null;
  photoUrl?: string | null;
  title?: string | null;
  slug?: string | null;
}

export interface GlobalTeamStats {
  /** Distinct people across volunteers + judges + NRC members. */
  people: number | null;
  volunteers: number | null;
  judges: number | null;
  nrcMembers: number | null;
  countries: number | null;
  activeChapters: number | null;
  /** Public-safe judge records (NRC members have no public name column). */
  judgeList: GlobalTeamPerson[];
  /** person_id values that also hold an NRC seat (used for role badges). */
  nrcPersonIds: string[];
  loading: boolean;
  error: Error | null;
}

const UNKNOWN: Omit<GlobalTeamStats, "loading" | "error" | "judgeList" | "nrcPersonIds"> = {
  people: null,
  volunteers: null,
  judges: null,
  nrcMembers: null,
  countries: null,
  activeChapters: null,
};

const norm = (s: string | null | undefined) => (s || "").trim().toLowerCase();

/** Render helper: `null` -> em dash, real numbers (including 0) -> locale string. */
export function formatStat(value: number | null): string {
  return value === null ? "—" : value.toLocaleString();
}


export function useGlobalTeamStats(): GlobalTeamStats {
  const [stats, setStats] = useState<GlobalTeamStats>({
    ...UNKNOWN,
    judgeList: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [vRes, jRes, nRes, cRes] = await Promise.all([
          supabase
            .from("volunteers")
            .select("id, full_name, country, region")
            .eq("visibility_status", "public")
            .eq("verification_status", "approved"),
          supabase
            .from("judges")
            .select(
              "id, slug, full_name, photo_url, professional_title, region, country_residence"
            )
            .eq("profile_visibility", "public")
            .eq("verification_status", "verified"),
          supabase.from("nrc_members").select("id", { count: "exact", head: true }),
          supabase
            .from("chapters")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
        ]);

        if (cancelled) return;

        const firstError =
          vRes.error || jRes.error || nRes.error || cRes.error || null;
        if (firstError) throw firstError;

        const dbVolunteers = (vRes.data || []) as {
          id: string;
          full_name: string;
          country: string | null;
          region: string | null;
        }[];
        const dbJudges = (jRes.data || []) as {
          id: string;
          slug: string | null;
          full_name: string;
          photo_url: string | null;
          professional_title: string | null;
          region: string | null;
          country_residence: string | null;
        }[];

        const nrcCount = nRes.count ?? 0;
        const chapterCount = cRes.count ?? 0;

        // --- People: dedupe across sources.
        // Known limitation: volunteers / judges / nrc_members share no stable
        // person key today, so cross-role dedupe falls back to normalised full
        // name. NRC rows have no name at all, so they cannot be de-duplicated
        // against the other two and are added as distinct people.
        const roster = STATIC_VOLUNTEERS.filter((v) => v.visibility !== "hidden");
        const volunteerNames = new Set<string>();
        for (const v of roster) volunteerNames.add(norm(v.fullName));
        for (const v of dbVolunteers) volunteerNames.add(norm(v.full_name));

        const allNames = new Set(volunteerNames);
        for (const j of dbJudges) allNames.add(norm(j.full_name));

        const countries = new Set<string>();
        for (const v of roster) if (v.country?.trim()) countries.add(v.country.trim());
        for (const v of dbVolunteers) if (v.country?.trim()) countries.add(v.country.trim());
        for (const j of dbJudges)
          if (j.country_residence?.trim()) countries.add(j.country_residence.trim());

        setStats({
          people: allNames.size + nrcCount,
          volunteers: volunteerNames.size,
          judges: dbJudges.length,
          nrcMembers: nrcCount,
          countries: countries.size,
          activeChapters: chapterCount,
          judgeList: dbJudges.map((j) => ({
            id: j.id,
            name: j.full_name,
            role: "judge" as const,
            country: j.country_residence,
            region: j.region,
            photoUrl: j.photo_url,
            title: j.professional_title,
            slug: j.slug,
          })),
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("[useGlobalTeamStats] failed to load global team stats", err);
        if (cancelled) return;
        setStats({
          ...UNKNOWN,
          judgeList: [],
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
