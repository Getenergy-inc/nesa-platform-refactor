// Public-safe supported-school records for the Education Social Impact section.
//
// Source: `education_impact_public_schools()` (aggregate/public-safe columns
// only — no school contact details, addresses, GPS or admin notes).
//
// Regions are resolved client-side through the CANONICAL platform taxonomy in
// `src/config/regions/africaRegions.ts` (8 Africa regions + African Diaspora).
// No new regional taxonomy is introduced here.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getRegionByCountry, type AfricaRegionDefinition } from "@/config/regions/africaRegions";

export interface ImpactSchool {
  id: string;
  name: string;
  schoolType: string | null;
  country: string | null;
  region: AfricaRegionDefinition | null;
  studentCount: number | null;
  description: string | null;
  photoUrls: string[];
  interventionStatus: string | null;
  interventionNotes: string | null;
  startDate: string | null;
  endDate: string | null;
  isSupported: boolean;
}

export interface ImpactSchoolsResult {
  schools: ImpactSchool[];
  /** null while loading or on error — never 0 by default. */
  total: number | null;
  loading: boolean;
  error: Error | null;
}

export function useImpactSchools(): ImpactSchoolsResult {
  const [state, setState] = useState<ImpactSchoolsResult>({
    schools: [],
    total: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("education_impact_public_schools");
        if (cancelled) return;
        if (error) throw error;

        const rows = (data || []) as Record<string, unknown>[];
        const schools: ImpactSchool[] = rows.map((r) => ({
          id: String(r.id),
          name: String(r.name ?? ""),
          schoolType: (r.school_type as string) ?? null,
          country: (r.country as string) ?? null,
          region: getRegionByCountry((r.country as string) ?? null),
          studentCount: r.student_count === null || r.student_count === undefined ? null : Number(r.student_count),
          description: (r.description as string) ?? null,
          photoUrls: Array.isArray(r.photo_urls) ? (r.photo_urls as string[]) : [],
          interventionStatus: (r.intervention_status as string) ?? null,
          interventionNotes: (r.intervention_notes as string) ?? null,
          startDate: (r.intervention_start_date as string) ?? null,
          endDate: (r.intervention_end_date as string) ?? null,
          isSupported: Boolean(r.is_supported),
        }));

        setState({ schools, total: schools.length, loading: false, error: null });
      } catch (err) {
        console.error("[useImpactSchools] failed to load impact schools", err);
        if (cancelled) return;
        setState({ schools: [], total: null, loading: false, error: err instanceof Error ? err : new Error(String(err)) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
