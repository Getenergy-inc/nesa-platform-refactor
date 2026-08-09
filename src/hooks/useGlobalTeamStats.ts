// Live counts for the global team band (volunteers + judges + NRC members).
//
// Sources of truth, in order:
//   1. Lovable Cloud tables: `volunteers`, `judges`, `nrc_members`, `chapters`.
//   2. The published static roster (`STATIC_VOLUNTEERS`, derived from
//      src/data/contributors.ts) which is what /volunteers actually renders
//      today — used as a floor so the band never shows a placeholder 0 while
//      the tables are still being populated.
//
// Nothing here is a hardcoded literal: every number is derived from real
// records at load time.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { STATIC_VOLUNTEERS } from "@/lib/volunteersData";

export interface GlobalTeamStats {
  /** Volunteers + judges + NRC members (the whole global team). */
  people: number;
  volunteers: number;
  judges: number;
  nrcMembers: number;
  /** Distinct countries represented across that population. */
  countries: number;
  /** Active chapters from the `chapters` table. */
  activeChapters: number;
  loading: boolean;
}

function staticBaseline() {
  const roster = STATIC_VOLUNTEERS.filter((v) => v.visibility !== "hidden");
  const countries = new Set(
    roster.map((v) => (v.country || "").trim()).filter(Boolean)
  );
  return { people: roster.length, countries };
}

export function useGlobalTeamStats(): GlobalTeamStats {
  const base = staticBaseline();
  const [stats, setStats] = useState<GlobalTeamStats>({
    people: base.people,
    volunteers: base.people,
    judges: 0,
    nrcMembers: 0,
    countries: base.countries.size,
    activeChapters: 0,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [vRes, jRes, nRes, cRes] = await Promise.all([
          supabase
            .from("volunteers")
            .select("id, full_name, country")
            .eq("visibility_status", "public")
            .eq("verification_status", "approved"),
          supabase
            .from("judges")
            .select("id, full_name, country_residence")
            .eq("profile_visibility", "public")
            .eq("verification_status", "verified"),
          supabase.from("nrc_members").select("id", { count: "exact", head: true }),
          supabase
            .from("chapters")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
        ]);

        if (cancelled) return;

        const dbVolunteers = (vRes.data || []) as { full_name: string; country: string | null }[];
        const dbJudges = (jRes.data || []) as { full_name: string; country_residence: string | null }[];
        const nrcCount = nRes.count || 0;
        const chapterCount = cRes.count || 0;

        // Volunteers: DB rows merged with the published roster (dedupe by name).
        const names = new Set(
          STATIC_VOLUNTEERS.filter((v) => v.visibility !== "hidden").map((v) =>
            v.fullName.trim().toLowerCase()
          )
        );
        for (const v of dbVolunteers) names.add((v.full_name || "").trim().toLowerCase());

        const countries = new Set(base.countries);
        for (const v of dbVolunteers) if (v.country?.trim()) countries.add(v.country.trim());
        for (const j of dbJudges)
          if (j.country_residence?.trim()) countries.add(j.country_residence.trim());

        const volunteers = names.size;
        const judges = dbJudges.length;

        setStats({
          people: volunteers + judges + nrcCount,
          volunteers,
          judges,
          nrcMembers: nrcCount,
          countries: countries.size,
          activeChapters: chapterCount,
          loading: false,
        });
      } catch {
        if (!cancelled) setStats((s) => ({ ...s, loading: false }));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return stats;
}
