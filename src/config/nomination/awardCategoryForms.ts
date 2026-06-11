// 46 Award Category Google Forms — NESA-Africa 2026.
//
// Source of truth split (Pass B):
//   - influencerForms.ts      → 3 forms (Influencer Education Impact Award 2026)
//   - iconForms.ts            → 3 audit forms + 1 legacy umbrella (Africa Education Icon)
//   - goldBlueGarnetForms.ts  → 9 categories → 25 forms after regional expansion
//   - platinumForms.ts        → 7 categories → 15 forms after regional expansion
//
// Total audit forms: 3 + 3 + 25 + 15 = 46 (matches nesa_54_forms_audit_v1).
//
// Region expansion is driven by AFRICA_REGIONAL_SLUGS below — categories listed
// here are expanded via `withAfricaRegions(...)` into 5 region-specific
// AwardCategoryRegion variants (North / West / East / Central / Southern).
//
// All forms ship as "Link Pending" until the SCEF / NESA-Africa data team
// pastes Google Form public + embed URLs. Statuses auto-promote to "Active"
// once both URLs are present (see resolveStatus.ts).

import type { AwardCategoryForm, AwardCategoryRegion } from "./types";
import { withResolvedStatus, withResolvedStatuses } from "./resolveStatus";
import { withAfricaRegions } from "./africaRegionalBuilder";
import {
  CSR_REGIONAL_BASE_SUBS,
  EDUTECH_REGIONAL_BASE_SUBS,
  NGO_REGIONAL_BASE_SUBS,
  STEM_REGIONAL_BASE_SUBS,
  FAITH_REGIONAL_BASE_SUBS,
} from "./_shared";
import { INFLUENCER_FORMS } from "./influencerForms";
import { ICON_FORMS } from "./iconForms";
import { GOLD_BLUE_GARNET_FORMS } from "./goldBlueGarnetForms";
import { PLATINUM_FORMS } from "./platinumForms";

// Raw declarations — concatenated from the per-family files.
const AWARD_CATEGORY_FORMS_RAW: AwardCategoryForm[] = [
  ...INFLUENCER_FORMS,
  ...ICON_FORMS,
  ...GOLD_BLUE_GARNET_FORMS,
  ...PLATINUM_FORMS,
];

// Category slugs that must be split into 5 region-specific Google Forms
// (North / West / East / Central / Southern Africa). 4 GBG + 2 Platinum Faith.
const AFRICA_REGIONAL_SLUGS: Record<string, string[]> = {
  "best-csr-for-education-africa-regional": CSR_REGIONAL_BASE_SUBS,
  "best-edutech-innovation-for-education-africa-regional": EDUTECH_REGIONAL_BASE_SUBS,
  "best-ngo-for-education-advancement-africa-regional": NGO_REGIONAL_BASE_SUBS,
  "best-stem-education-programme-africa-regional": STEM_REGIONAL_BASE_SUBS,
  "excellence-in-christian-education-impact-africa-regional": FAITH_REGIONAL_BASE_SUBS,
  "excellence-in-islamic-education-impact-africa-regional": FAITH_REGIONAL_BASE_SUBS,
};

/**
 * Public award-category forms array — statuses already resolved.
 * Africa Regional categories are expanded with `regions` — one form variant
 * per AFRICA_REGION (6 categories × 5 regions = 30 regional variants).
 */
export const AWARD_CATEGORY_FORMS: AwardCategoryForm[] = withResolvedStatuses(
  AWARD_CATEGORY_FORMS_RAW,
).map((form) => {
  const baseSubs = AFRICA_REGIONAL_SLUGS[form.slug];
  if (!baseSubs) return form;
  const expanded = withAfricaRegions({ base: form, baseSubcategories: baseSubs });
  expanded.regions = expanded.regions!.map((r) => withResolvedStatus(r));
  return expanded;
});

/** Raw, unresolved array — for the admin mapping register only. */
export { AWARD_CATEGORY_FORMS_RAW };

export function getCategoryFormBySlug(
  slug: string,
): AwardCategoryForm | undefined {
  return AWARD_CATEGORY_FORMS.find((c) => c.slug === slug);
}

export function getCategoryFormsByFamily(
  family: string,
): AwardCategoryForm[] {
  return AWARD_CATEGORY_FORMS.filter((c) => c.family === family);
}

/** Look up a regional form variant for an Africa Regional category. */
export function getCategoryRegion(
  categorySlug: string,
  regionSlug: string,
): AwardCategoryRegion | undefined {
  const cat = getCategoryFormBySlug(categorySlug);
  if (!cat?.isRegionalCategory || !cat.regions) return undefined;
  return cat.regions.find((r) => r.slug === regionSlug);
}

/**
 * Total number of award forms once regional expansion is applied.
 * Should equal 46 per nesa_54_forms_audit_v1 (excluding the legacy Icon
 * umbrella entry that is not counted in the audit).
 */
export function getTotalAwardFormCount(): number {
  return AWARD_CATEGORY_FORMS.reduce((sum, c) => {
    if (c.isRegionalCategory && c.regions) return sum + c.regions.length;
    return sum + 1;
  }, 0);
}
