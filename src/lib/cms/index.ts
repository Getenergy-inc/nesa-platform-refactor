// CMS adapter layer.
//
// Single source of truth abstraction for editorial + reference content.
// The default adapter reads from Lovable Cloud (Supabase). Optional
// adapters for Contentful and Sanity can be enabled per-content-type
// once those connectors are linked and content is authored there.
//
// Why: lets us keep `/awards`, `/nominees`, /region/*, /categories/*
// agnostic to where their copy lives, so we can migrate editorial blocks
// to an external CMS without rewriting routes.
//
// Adapters export the same shape; the page picks the source via
// `getContentSource(kind)`.

import type { PathwayCard, AwardCategory, NomineeSummary } from "./types";
import * as lovableCloud from "./adapters/lovableCloud";

export type ContentKind =
  | "pathway_cards"
  | "categories"
  | "subcategories"
  | "regions"
  | "nominees";

export type ContentSource = "lovable_cloud" | "contentful" | "sanity";

/**
 * Returns which adapter should be used for a given content kind.
 *
 * Defaults to Lovable Cloud (the only source with real data today).
 * Override per-kind via env once Contentful or Sanity content is
 * authored — e.g. VITE_CMS_PATHWAY_CARDS=contentful.
 */
export function getContentSource(kind: ContentKind): ContentSource {
  const override = (import.meta.env[`VITE_CMS_${kind.toUpperCase()}`] ??
    "") as string;
  if (override === "contentful" || override === "sanity") return override;
  return "lovable_cloud";
}

/**
 * Single dispatch surface for fetching pathway cards.
 * Currently always falls through to Lovable Cloud; the switch is here
 * so adding a Contentful adapter is a localised change.
 */
export async function fetchPathwayCards(): Promise<PathwayCard[]> {
  const source = getContentSource("pathway_cards");
  switch (source) {
    case "contentful":
    case "sanity":
      // Adapters will be wired here once those CMSes have content.
      // Falling back to Lovable Cloud keeps the UI working in the meantime.
      return lovableCloud.fetchPathwayCards();
    case "lovable_cloud":
    default:
      return lovableCloud.fetchPathwayCards();
  }
}

export async function fetchCategories(): Promise<AwardCategory[]> {
  return lovableCloud.fetchCategories();
}

export async function fetchFeaturedNominees(limit = 8): Promise<NomineeSummary[]> {
  return lovableCloud.fetchFeaturedNominees(limit);
}

export type { PathwayCard, AwardCategory, NomineeSummary };
