// Lovable Cloud (Supabase) adapter for CMS content.
// Returns objects in the shape defined in `../types.ts` so pages
// remain source-agnostic.

import { supabase } from "@/integrations/supabase/client";
import type { PathwayCard, AwardCategory, NomineeSummary } from "../types";

export async function fetchPathwayCards(): Promise<PathwayCard[]> {
  const { data, error } = await supabase
    .from("pathway_cards")
    .select(
      "id, category, headline, award_line, description, accent_label, cta, href, image_url, visual_gradient, display_order",
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    category: row.category,
    headline: row.headline,
    awardLine: row.award_line,
    description: row.description,
    accentLabel: row.accent_label,
    cta: row.cta,
    href: row.href,
    imageUrl: row.image_url,
    visualGradient: row.visual_gradient,
    displayOrder: row.display_order ?? 0,
  }));
}

export async function fetchCategories(): Promise<AwardCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name, description, icon_name, display_order, is_active")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    iconName: row.icon_name,
    displayOrder: row.display_order ?? 0,
  }));
}

export async function fetchFeaturedNominees(limit = 8): Promise<NomineeSummary[]> {
  const { data, error } = await supabase
    .from("nominees")
    .select(
      "id, slug, name, title, organization, country, region, photo_url, logo_url, is_platinum, public_votes",
    )
    .in("status", ["approved", "platinum"])
    .order("public_votes", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    organization: row.organization,
    country: row.country,
    region: row.region,
    photoUrl: row.photo_url,
    logoUrl: row.logo_url,
    isPlatinum: Boolean(row.is_platinum),
    publicVotes: row.public_votes ?? 0,
  }));
}
