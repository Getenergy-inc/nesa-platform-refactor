// Real Africa Education Icon Award counts, computed from the same nominee
// data layer the pathway strips and the living gallery use — never hardcoded.
//
// Loading/error contract matches every other stats surface on the site:
// each value is `number | null`, where `null` renders an em dash.

import { useMemo } from "react";
import { bySubcategory, type IconSubcategorySlug } from "@/data/iconAward";
import { ICON_PATHWAYS } from "@/config/brandHierarchy";

export interface IconAwardStats {
  nominees: number | null;
  countries: number | null;
  regions: number | null;
  impactStories: number | null;
}

export function useIconAwardStats(): IconAwardStats {
  return useMemo(() => {
    try {
      const all = ICON_PATHWAYS.flatMap((p) => bySubcategory(p.slug as IconSubcategorySlug));
      if (!all.length) {
        return { nominees: null, countries: null, regions: null, impactStories: null };
      }
      const countries = new Set(all.map((n) => n.country).filter(Boolean));
      const regions = new Set(all.map((n) => n.region).filter(Boolean));
      const impactStories = all.filter(
        (n) => !!(n.full_impact_story || n.impact_summary)?.trim(),
      ).length;

      return {
        nominees: all.length,
        countries: countries.size,
        regions: regions.size,
        impactStories,
      };
    } catch (err) {
      console.error("[useIconAwardStats] failed to compute Icon stats", err);
      return { nominees: null, countries: null, regions: null, impactStories: null };
    }
  }, []);
}
