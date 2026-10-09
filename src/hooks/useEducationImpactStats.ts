// Live Education Social Impact statistics.
//
// Source of truth: the Lovable Cloud aggregate function
// `education_impact_public_stats()`, which returns anonymous programme totals
// only (no supporter names, emails, amounts or any private information).
//
// Loading/error contract — IDENTICAL to `useGlobalTeamStats`:
//   every count is `number | null`. `null` means "unknown" (still loading, or
//   the query failed) and the UI must render an em dash — never 0.
//   A genuine database zero renders as 0.
//
// Fields the backend does not yet capture (teachers supported) stay `null`
// forever rather than being fabricated.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface EducationImpactStats {
  schoolsSupported: number | null;
  learnersReached: number | null;
  teachersSupported: number | null;
  communitiesReached: number | null;
  countries: number | null;
  regions: number | null;
  projectsCompleted: number | null;
  projectsInProgress: number | null;
  schoolsNominated: number | null;
  friendsOfEduAid: number | null;
  loading: boolean;
  error: Error | null;
}

const UNKNOWN: Omit<EducationImpactStats, "loading" | "error"> = {
  schoolsSupported: null,
  learnersReached: null,
  teachersSupported: null,
  communitiesReached: null,
  countries: null,
  regions: null,
  projectsCompleted: null,
  projectsInProgress: null,
  schoolsNominated: null,
  friendsOfEduAid: null,
};

const num = (v: unknown): number | null =>
  v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v);

/** Render helper: `null` -> em dash, real numbers (including 0) -> locale string. */
// Re-export the canonical sitewide formatter rather than re-implementing the
// null="—" contract locally (single source of truth: useGlobalTeamStats).
export { formatStat as formatImpactStat } from "@/hooks/useGlobalTeamStats";

export function useEducationImpactStats(): EducationImpactStats {
  const [stats, setStats] = useState<EducationImpactStats>({
    ...UNKNOWN,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("education_impact_public_stats");
        if (cancelled) return;
        if (error) throw error;

        const d = (data || {}) as Record<string, unknown>;
        setStats({
          schoolsSupported: num(d.schools_supported),
          learnersReached: num(d.learners_reached),
          // Not captured by the programme database yet — never fabricated.
          teachersSupported: null,
          communitiesReached: num(d.communities_reached),
          countries: num(d.countries),
          regions: num(d.regions),
          projectsCompleted: num(d.projects_completed),
          projectsInProgress: num(d.projects_in_progress),
          schoolsNominated: num(d.schools_nominated),
          friendsOfEduAid: num(d.friends_of_eduaid),
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("[useEducationImpactStats] failed to load impact stats", err);
        if (cancelled) return;
        setStats({
          ...UNKNOWN,
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
