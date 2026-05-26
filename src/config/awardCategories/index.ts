import { BLUE_GARNET_CATEGORIES } from "./blueGarnet";
import { PLATINUM_CATEGORIES } from "./platinum";
import { ICON_CATEGORY } from "./icon";
import { INFLUENCERS_CATEGORIES } from "./influencers";
import type { AwardCategoryConfig, CategoryGroup } from "./types";

export { INTEGRITY_DISCLAIMER, SPONSOR_DISCLAIMER } from "./disclaimers";
export { GROUP_META } from "./types";
export type { AwardCategoryConfig, CategoryGroup, CategoryFaq } from "./types";

export const ALL_CATEGORIES: AwardCategoryConfig[] = [
  ...BLUE_GARNET_CATEGORIES,
  ...PLATINUM_CATEGORIES,
  ICON_CATEGORY,
  ...INFLUENCERS_CATEGORIES,
];

export {
  BLUE_GARNET_CATEGORIES,
  PLATINUM_CATEGORIES,
  ICON_CATEGORY,
  INFLUENCERS_CATEGORIES,
};

export function getCategoriesByGroup(group: CategoryGroup): AwardCategoryConfig[] {
  return ALL_CATEGORIES.filter((c) => c.group === group);
}

export function getCategoryBySlug(slug: string): AwardCategoryConfig | undefined {
  return ALL_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Build redirect map: legacy URL → canonical URL.
 * Consumed by App.tsx to register <Navigate /> entries.
 */
export function buildRedirectMap(): Array<{ from: string; to: string }> {
  const out: Array<{ from: string; to: string }> = [];
  for (const c of ALL_CATEGORIES) {
    for (const from of c.mergedFrom ?? []) {
      out.push({ from, to: c.url });
    }
  }
  return out;
}
