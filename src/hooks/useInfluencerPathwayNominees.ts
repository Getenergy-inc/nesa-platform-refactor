// Live nominee data for the three Influencer Education Impact pathways.
//
// Source of truth is the database only: `categories` → `subcategories` →
// the public `public_nominees` view (published records, PII-free columns).
// No static or seeded content is ever substituted — a pathway with no
// eligible record resolves to an empty bucket so the UI can be honest.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const INFLUENCER_PATHWAYS = [
  {
    categorySlug: "africa-music-influencer-education",
    title: "Africa Music Influencer Education Support",
    short: "Music",
    nominateHref: "/nominate?tier=influencer-2026&track=music",
  },
  {
    categorySlug: "africa-social-media-influencer-education",
    title: "Africa Social Media Influencer Education Support",
    short: "Social Media",
    nominateHref: "/nominate?tier=influencer-2026&track=social-media",
  },
  {
    categorySlug: "africa-sports-influencer-education",
    title: "Africa Sports Influencer Education Support",
    short: "Sports",
    nominateHref: "/nominate?tier=influencer-2026&track=sports",
  },
] as const;

export type InfluencerPathwaySlug = (typeof INFLUENCER_PATHWAYS)[number]["categorySlug"];

export interface InfluencerNomineeEntry {
  id: string;
  name: string;
  slug: string;
  href: string;
  imageUrl: string | null;
  imageKind: "photo" | "logo";
  categoryName: string;
  subcategoryName: string | null;
  country: string | null;
  region: string | null;
  categorySlug: string;
}

export interface InfluencerPathwayBucket {
  categorySlug: string;
  categoryName: string;
  title: string;
  short: string;
  nominateHref: string;
  nominees: InfluencerNomineeEntry[];
}

const PER_PATHWAY_LIMIT = 24;

function normaliseUrl(url: string | null | undefined): string | null {
  const u = (url || "").trim();
  if (!u) return null;
  if (/placeholder|no-image|default-avatar/i.test(u)) return null;
  if (/^https?:\/\//i.test(u) || u.startsWith("/")) return u;
  return null;
}

async function fetchInfluencerPathways(): Promise<InfluencerPathwayBucket[]> {
  const slugs = INFLUENCER_PATHWAYS.map((p) => p.categorySlug);

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, slug, name")
    .in("slug", slugs);
  if (catErr) throw catErr;

  const catById = new Map((cats || []).map((c: any) => [c.id, c]));

  const { data: subs, error: subErr } = await supabase
    .from("subcategories")
    .select("id, name, category_id")
    .in("category_id", (cats || []).map((c: any) => c.id));
  if (subErr) throw subErr;

  const subMeta = new Map<string, { name: string | null; categorySlug: string }>();
  const subIdsByCategory = new Map<string, string[]>();
  for (const s of (subs || []) as any[]) {
    const cat = catById.get(s.category_id);
    if (!cat) continue;
    subMeta.set(s.id, { name: s.name ?? null, categorySlug: cat.slug });
    const list = subIdsByCategory.get(cat.slug) || [];
    list.push(s.id);
    subIdsByCategory.set(cat.slug, list);
  }

  // One query per pathway so a larger pathway can never starve a smaller one.
  const results = await Promise.all(
    INFLUENCER_PATHWAYS.map(async (p) => {
      const subIds = subIdsByCategory.get(p.categorySlug) || [];
      if (subIds.length === 0) return { categorySlug: p.categorySlug, rows: [] as any[] };
      const { data, error } = await supabase
        .from("public_nominees")
        .select(
          "id, name, slug, country, region, photo_url, logo_url, subcategory_id, profile_completion_score",
        )
        .eq("publication_status", "published")
        .in("subcategory_id", subIds)
        .order("profile_completion_score", { ascending: false, nullsFirst: false })
        .limit(PER_PATHWAY_LIMIT);
      if (error) throw error;
      return { categorySlug: p.categorySlug, rows: (data || []) as any[] };
    }),
  );

  const rowsByCategory = new Map(results.map((r) => [r.categorySlug, r.rows]));

  return INFLUENCER_PATHWAYS.map((p) => {
    const cat = (cats || []).find((c: any) => c.slug === p.categorySlug) as any;
    const nominees: InfluencerNomineeEntry[] = (rowsByCategory.get(p.categorySlug) || [])
      .filter((r: any) => r.name && r.slug)
      .map((r: any) => {
        const photo = normaliseUrl(r.photo_url);
        const logo = normaliseUrl(r.logo_url);
        const imageUrl = photo || logo;
        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          href: `/nominees/${encodeURIComponent(r.slug)}`,
          imageUrl,
          imageKind: imageUrl && imageUrl === logo ? "logo" : "photo",
          categoryName: cat?.name || p.title,
          subcategoryName: subMeta.get(r.subcategory_id)?.name ?? null,
          country: r.country ?? null,
          region: r.region ?? null,
          categorySlug: p.categorySlug,
        } satisfies InfluencerNomineeEntry;
      });

    return {
      categorySlug: p.categorySlug,
      categoryName: cat?.name || p.title,
      title: p.title,
      short: p.short,
      nominateHref: p.nominateHref,
      nominees,
    };
  });
}

export function useInfluencerPathwayNominees() {
  const q = useQuery({
    queryKey: ["influencer-pathway-nominees"],
    queryFn: fetchInfluencerPathways,
    staleTime: 1000 * 60 * 10,
  });

  const pathways = q.data ?? [];
  const total = pathways.reduce((sum, p) => sum + p.nominees.length, 0);

  return {
    pathways,
    total,
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
  };
}
