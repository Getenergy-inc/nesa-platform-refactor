// Africa regional zones used by Africa Regional award nomination forms.
//
// Each Africa Regional category is split into 8 region-specific forms so that
// nominators only see countries and subcategories from their own region.
//
// Canonical source of truth: src/config/regions/africaRegions.ts.
// This module re-shapes the canonical 8-region model into the legacy
// { slug, name, countries } shape consumed by the nomination-form builder
// (`africaRegionalBuilder.ts`) and the Google-Form/Sheet metadata pipeline.

import {
  AFRICA_REGIONS as CANONICAL_AFRICA_REGIONS,
} from "@/config/regions/africaRegions";

export interface AfricaRegionDef {
  /** kebab-case slug used in ?region= query */
  slug: string;
  /** Display region name */
  name: string;
  /** Country dropdown for the region */
  countries: string[];
}

// Derived from the canonical 8-region source of truth.
// Order matches canonical `order` field:
//   1. North Africa
//   2. West Africa
//   3. Central Africa
//   4. East Africa
//   5. Horn of Africa
//   6. Southern Africa
//   7. Sahel Region
//   8. Indian Ocean Islands
export const AFRICA_REGIONS: AfricaRegionDef[] = CANONICAL_AFRICA_REGIONS
  .slice()
  .sort((a, b) => a.order - b.order)
  .map((r) => ({
    slug: r.slug,
    name: r.name,
    countries: [...r.countries],
  }));

export function getAfricaRegion(slug: string): AfricaRegionDef | undefined {
  return AFRICA_REGIONS.find((r) => r.slug === slug);
}
