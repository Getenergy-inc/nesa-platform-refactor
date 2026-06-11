// Builder for Africa Regional award category form variants.
//
// For every Africa Regional category, we generate 5 region-scoped form
// definitions — one per AFRICA_REGION — each carrying:
//   - its own subcategory list (suffixed with " — <Region>")
//   - its own country dropdown (from AFRICA_REGIONS)
//   - its own Google Form + Sheet metadata (placeholders until URLs land)
//
// Used by `awardCategoryForms.ts` and the /nominate flow.

import type {
  AwardCategoryForm,
  AwardCategoryRegion,
  NominationSubcategory,
} from "./types";
import { AFRICA_REGIONS } from "./africaRegions";

/** Short award-category name (left of " — ") used in form/sheet titles. */
function shortCategoryName(fullName: string): string {
  return fullName.split(" — ")[0].trim();
}

/** kebab-case helper consistent with the rest of the config. */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build region-scoped subcategories. Each base subcategory name is suffixed
 * with " — <Region>" (e.g. "Banking & Finance CSR — West Africa") and gets a
 * region-scoped slug (e.g. "banking-and-finance-csr-west-africa").
 */
function buildRegionalSubs(
  baseNames: string[],
  regionName: string,
): NominationSubcategory[] {
  return baseNames.map((base) => {
    const name = `${base} — ${regionName}`;
    return {
      slug: slugify(name),
      name,
    };
  });
}

export interface RegionalCategorySpec {
  /** Base AwardCategoryForm with `isRegionalCategory: true` and shared metadata. */
  base: AwardCategoryForm;
  /** Base subcategory names (without region suffix). */
  baseSubcategories: string[];
}

/**
 * Returns a new AwardCategoryForm with `regions` populated — one entry per
 * AFRICA_REGION — derived from the base subcategories. URLs are left blank
 * (status "Link Pending") until Google Forms are provisioned.
 */
export function withAfricaRegions(spec: RegionalCategorySpec): AwardCategoryForm {
  const short = shortCategoryName(spec.base.name);
  const regions: AwardCategoryRegion[] = AFRICA_REGIONS.map((r) => ({
    slug: r.slug,
    regionSlug: r.slug,
    name: r.name,
    countries: r.countries,
    subcategories: buildRegionalSubs(spec.baseSubcategories, r.name),
    formPublicUrl: "",
    formEmbedUrl: "",
    sheetTitle: `NESA 2026 — ${short} — Africa Regional — ${r.name} — Responses`,
    status: "Link Pending",
  }));


  return {
    ...spec.base,
    isRegionalCategory: true,
    regions,
  };
}
