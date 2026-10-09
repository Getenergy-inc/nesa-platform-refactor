// CMS adapter layer.
//
// Single source of truth abstraction for editorial + reference content.
// The default adapter reads from Lovable Cloud (Supabase). Optional
// adapters for Contentful and Sanity can be enabled per-content-type
// once those connectors are linked and content is authored there.

import type {
  PathwayCard,
  AwardCategory,
  Subcategory,
  NomineeSummary,
} from "./types";
import * as lovableCloud from "./adapters/lovableCloud";

export type ContentKind =
  | "pathway_cards"
  | "categories"
  | "subcategories"
  | "regions"
  | "nominees";

export type ContentSource = "lovable_cloud" | "contentful" | "sanity";

export function getContentSource(kind: ContentKind): ContentSource {
  const override = (import.meta.env[`VITE_CMS_${kind.toUpperCase()}`] ??
    "") as string;
  if (override === "contentful" || override === "sanity") return override;
  return "lovable_cloud";
}

export async function fetchPathwayCards(): Promise<PathwayCard[]> {
  return lovableCloud.fetchPathwayCards();
}

export async function fetchCategories(): Promise<AwardCategory[]> {
  return lovableCloud.fetchCategories();
}

export async function fetchSubcategories(
  categorySlug?: string,
): Promise<Subcategory[]> {
  return lovableCloud.fetchSubcategories(categorySlug);
}

export async function fetchFeaturedNominees(limit = 8): Promise<NomineeSummary[]> {
  return lovableCloud.fetchFeaturedNominees(limit);
}

export type { PathwayCard, AwardCategory, Subcategory, NomineeSummary };
