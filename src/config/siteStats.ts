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
  /** Taxonomy unit count. Icon 3 + Influencer 3 + Platinum 7 + Gold-Blue Garnet 9 = 22. */
  categories: number;
  /** Distinct public nomination forms on /nominate. 18 total (see per-tier). */
  forms: number;
  /** Curated public-facing subcategory subset (D2). Sum of per-tier counts. */
  subcategories: number;
  /** Per-tier subcategory counts — Section 6, no blended figure. */
  iconSubcategories: number;
  influencerSubcategories: number;
  platinumSubcategories: number;
  goldBlueGarnetSubcategories: number;
  /** 8 African regions per africaRegions.ts. */
  africanRegions: number;
  /** Diaspora + Global (Friends of Africa). */
  globalCommunities: number;
  /** Chapters registered across countries (30). */
  registeredChapters: number;
  /** Chapters with active volunteers (10). */
  activeVolunteerChapters: number;
  /**
   * Backwards-compat alias — legacy consumers referenced `chapters`; keep
   * pointing at active volunteer chapters so existing UI keeps working.
   */
  chapters: number;
  /** Live nominee count in the Directory. */
  directoryNominees: number;
  /** Laureates locked at 9 for the 2026 cycle (1 per pathway × classification). */
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
  subcategories: 9 + 3 + 27 + 63,
  iconSubcategories: 9,
  influencerSubcategories: 3,
  platinumSubcategories: 27,
  goldBlueGarnetSubcategories: 63,
  africanRegions: 8,
  globalCommunities: 2,
  registeredChapters: 30,
  activeVolunteerChapters: 10,
  chapters: 10,
  directoryNominees: 0,
  iconLaureates: 9,
  volunteers: 0,
  volunteerCountries: 0,
  impactStories: 0,
  updatedAt: new Date().toISOString(),
};

/**
 * React hook — hydrates live counts from the `site_stats` table. Never throws.
 * Maps snake_case DB columns to the camelCase interface consumed by components.
 */
export function useSiteStats(): SiteStats {
  const [stats, setStats] = useState<SiteStats>(SITE_STATS_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("site_stats")
          .select("*")
          .limit(1)
          .maybeSingle();
        if (cancelled || error || !data) return;
        const iconSub = data.icon_subcategories ?? SITE_STATS_FALLBACK.iconSubcategories;
        const influencerSub = data.influencer_subcategories ?? SITE_STATS_FALLBACK.influencerSubcategories;
        const platinumSub = data.platinum_subcategories ?? SITE_STATS_FALLBACK.platinumSubcategories;
        const gbgSub = data.gold_blue_garnet_subcategories ?? SITE_STATS_FALLBACK.goldBlueGarnetSubcategories;
        const activeChapters = data.active_volunteer_chapters ?? SITE_STATS_FALLBACK.activeVolunteerChapters;
        setStats({
          ...SITE_STATS_FALLBACK,
          tiers: data.tiers ?? SITE_STATS_FALLBACK.tiers,
          categories: data.total_categories ?? SITE_STATS_FALLBACK.categories,
          forms: data.total_forms ?? SITE_STATS_FALLBACK.forms,
          subcategories: iconSub + influencerSub + platinumSub + gbgSub,
          iconSubcategories: iconSub,
          influencerSubcategories: influencerSub,
          platinumSubcategories: platinumSub,
          goldBlueGarnetSubcategories: gbgSub,
          africanRegions: data.total_regions ?? SITE_STATS_FALLBACK.africanRegions,
          globalCommunities: data.global_communities ?? SITE_STATS_FALLBACK.globalCommunities,
          registeredChapters: data.registered_chapters ?? SITE_STATS_FALLBACK.registeredChapters,
          activeVolunteerChapters: activeChapters,
          chapters: activeChapters,
          directoryNominees: data.directory_nominees ?? SITE_STATS_FALLBACK.directoryNominees,
          iconLaureates: data.icon_laureates ?? SITE_STATS_FALLBACK.iconLaureates,
          volunteers: data.volunteers ?? SITE_STATS_FALLBACK.volunteers,
          volunteerCountries: data.volunteer_countries ?? SITE_STATS_FALLBACK.volunteerCountries,
          impactStories: data.impact_stories ?? SITE_STATS_FALLBACK.impactStories,
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

