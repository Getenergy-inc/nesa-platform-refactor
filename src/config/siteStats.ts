// D2 (curated public subset) — single source of truth for every count
// rendered on the public site. "18 Categories · 96 Subcategories" stays
// the public-facing framing; the full 250–300+ pathway list lives inside
// nomination forms and NRC tooling via the recognition config.
//
// USAGE
//   const stats = useSiteStats();
//   <span>{stats.categories} Categories · {stats.subcategories} Subcategories</span>
//
// SEEDING
//   Values here are the authoritative fallbacks. When a Supabase view or
//   RPC named `site_stats` exists, useSiteStats hydrates from it and this
//   config becomes the SSR/first-paint value. Never hardcode these numbers
//   in a component — banned-strings CI will flag it.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteStats {
  /** 4 Tiers — 1 flagship (Icon) + 3 Certificate of Recognition. */
  tiers: number;
  /**
   * Conceptual recognition categories in the taxonomy.
   * Icon (3 pathways) + Influencer (3 pathways) + Platinum (7) + Gold-Blue Garnet (9) = 22.
   * A "category" is a taxonomy unit; multiple categories may share one nomination form.
   */
  categories: number;
  /**
   * Distinct public nomination forms on /nominate.
   * Icon = 1 form (pathway dropdown), Influencer = 1 form (pathway dropdown),
   * Platinum = 7 forms, Gold-Blue Garnet = 9 forms → 18 total.
   */
  forms: number;
  /** Curated public-facing subcategory subset (D2). */
  subcategories: number;
  /** 8 African regions per africaRegions.ts. */
  africanRegions: number;
  /** Diaspora + Global (Friends of Africa). */
  globalCommunities: number;
  /** 10 chapters — matches africaRegions + Diaspora + Global. */
  chapters: number;
  /** Live nominee count in the Directory. */
  directoryNominees: number;
  /** Verified icon laureates historical + current cycle. */
  iconLaureates: number;
  /** Volunteer program size. */
  volunteers: number;
  /** Countries with at least one active volunteer/chapter. */
  volunteerCountries: number;
  /** Impact stories published. */
  impactStories: number;
  /** Freshness indicator so consumers can show "as of" text. */
  updatedAt: string;
}

export const SITE_STATS_FALLBACK: SiteStats = {
  tiers: 4,
  categories: 22,
  forms: 18,
  subcategories: 99,
  africanRegions: 8,
  globalCommunities: 2,
  chapters: 10,
  directoryNominees: 0,
  iconLaureates: 140,
  volunteers: 0,
  volunteerCountries: 0,
  impactStories: 0,
  updatedAt: new Date().toISOString(),
};

/**
 * React hook — hydrates live counts from a `site_stats` view/RPC when
 * available, otherwise returns the config fallback. Never throws.
 */
export function useSiteStats(): SiteStats {
  const [stats, setStats] = useState<SiteStats>(SITE_STATS_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Best-effort: try a `site_stats` view. If the view/table doesn't
        // exist yet, silently keep the fallback so the UI never breaks.
        const { data, error } = await (supabase as any)
          .from("site_stats")
          .select("*")
          .limit(1)
          .maybeSingle();
        if (cancelled || error || !data) return;
        setStats({
          ...SITE_STATS_FALLBACK,
          ...data,
          updatedAt: data.updated_at ?? SITE_STATS_FALLBACK.updatedAt,
        });
      } catch {
        // ignore — fallback is fine
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}
