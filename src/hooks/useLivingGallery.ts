// Living Gallery + Impact Directory stats — homepage data hooks.
//
// Authoritative source: the same `public_nominees` view the /nominees
// directory reads. No separate manually maintained list, no fabricated
// records, no placeholder people.
//
// Loading/error contract mirrors `useGlobalTeamStats`: every count is
// `number | null`; `null` means "unknown" (loading or failed) and must render
// as an em dash — never a false 0. A genuine database zero renders as 0.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Below this many real, renderable records we show pathway cards instead. */
export const LIVING_GALLERY_MIN_RECORDS = 6;

/** Upper bound on images fetched for the homepage gallery. */
export const LIVING_GALLERY_FETCH_LIMIT = 36;

export interface GalleryNominee {
  id: string;
  name: string;
  slug: string;
  /** Absolute or root-relative image URL. Never a placeholder. */
  imageUrl: string;
  imageKind: "photo" | "logo";
  country: string | null;
  region: string | null;
  /** Derived from the record's own category assignment. */
  categoryLabel: string | null;
  /** Short impact statement from the record, trimmed. Null when absent. */
  impact: string | null;
  href: string;
}

const ORG_HINTS = [
  "ltd", "limited", "inc", "llc", "company", "corporation", "corp", "group",
  "foundation", "ministry", "university", "college", "school", "institute",
  "bank", "plc", "ngo", "association", "society", "council", "commission",
  "agency", "authority", "organization", "organisation", "trust", "network",
  "alliance", "centre", "center", "media", "broadcast", "press", "publishing",
];

function looksLikeOrg(name: string) {
  const n = name.toLowerCase();
  return ORG_HINTS.some((k) => n.includes(k));
}

function tidy(value: string | null | undefined, max = 140): string | null {
  const s = (value || "").replace(/\s+/g, " ").trim();
  if (!s) return null;
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

function normaliseUrl(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return u;
  // Anything else (bare filename, placeholder path) is not trustworthy.
  return null;
}

async function fetchGalleryNominees(): Promise<GalleryNominee[]> {
  const { data, error } = await supabase
    .from("public_nominees")
    .select(
      "id, name, slug, country, region, photo_url, logo_url, bio, title, award_family, subcategory_id, profile_completion_score"
    )
    .eq("publication_status", "published")
    .or("photo_url.not.is.null,logo_url.not.is.null")
    .order("profile_completion_score", { ascending: false, nullsFirst: false })
    .limit(LIVING_GALLERY_FETCH_LIMIT);

  if (error) throw error;
  const rows = data || [];
  if (rows.length === 0) return [];

  // Resolve the record's own category label via its subcategory.
  const subIds = [...new Set(rows.map((r: any) => r.subcategory_id).filter(Boolean))];
  const labels = new Map<string, string>();
  if (subIds.length) {
    const { data: subs } = await supabase
      .from("subcategories")
      .select("id, name, categories ( name )")
      .in("id", subIds);
    (subs || []).forEach((s: any) => {
      const label = s.categories?.name || s.name;
      if (label) labels.set(s.id, label);
    });
  }

  const out: GalleryNominee[] = [];
  for (const r of rows as any[]) {
    if (!r.name || !r.slug) continue;
    const isOrg = looksLikeOrg(r.name);
    const raw = isOrg ? r.logo_url || r.photo_url : r.photo_url || r.logo_url;
    const imageUrl = raw ? normaliseUrl(String(raw)) : null;
    if (!imageUrl) continue; // degrade gracefully — never a broken placeholder
    out.push({
      id: r.id,
      name: r.name,
      slug: r.slug,
      imageUrl,
      imageKind: isOrg ? "logo" : "photo",
      country: tidy(r.country, 40),
      region: tidy(r.region, 40),
      categoryLabel: (r.subcategory_id && labels.get(r.subcategory_id)) || tidy(r.award_family, 60),
      impact: tidy(r.bio) || tidy(r.title, 90),
      href: `/nominees/${encodeURIComponent(r.slug)}`,
    });
  }
  return out;
}

export function useLivingGalleryNominees() {
  const q = useQuery({
    queryKey: ["living-gallery-nominees"],
    queryFn: fetchGalleryNominees,
    staleTime: 1000 * 60 * 10,
  });
  const nominees = q.data ?? [];
  return {
    nominees,
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
    /** True only when we have enough real records to make a gallery credible. */
    hasEnough: !q.isLoading && !q.error && nominees.length >= LIVING_GALLERY_MIN_RECORDS,
  };
}

export interface DirectoryStats {
  enablers: number | null;
  countriesAndRegions: number | null;
  categories: number | null;
  impactStories: number | null;
  loading: boolean;
  error: Error | null;
}

async function fetchDirectoryStats() {
  const [total, cats, stories, geo] = await Promise.all([
    supabase
      .from("public_nominees")
      .select("id", { count: "exact", head: true })
      .eq("publication_status", "published"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase
      .from("public_nominees")
      .select("id", { count: "exact", head: true })
      .eq("publication_status", "published")
      .not("bio", "is", null),
    supabase
      .from("public_nominees")
      .select("country, region")
      .eq("publication_status", "published")
      .limit(5000),
  ]);

  const err = total.error || cats.error || stories.error || geo.error;
  if (err) throw err;

  const places = new Set<string>();
  (geo.data || []).forEach((r: any) => {
    const c = (r.country || "").trim();
    const g = (r.region || "").trim();
    if (c) places.add(`c:${c.toLowerCase()}`);
    if (g) places.add(`r:${g.toLowerCase()}`);
  });

  return {
    enablers: total.count ?? null,
    categories: cats.count ?? null,
    impactStories: stories.count ?? null,
    countriesAndRegions: places.size,
  };
}

export function useDirectoryStats(): DirectoryStats {
  const q = useQuery({
    queryKey: ["directory-stats"],
    queryFn: fetchDirectoryStats,
    staleTime: 1000 * 60 * 10,
  });
  const unknown = q.isLoading || !!q.error || !q.data;
  return {
    enablers: unknown ? null : q.data!.enablers,
    countriesAndRegions: unknown ? null : q.data!.countriesAndRegions,
    categories: unknown ? null : q.data!.categories,
    impactStories: unknown ? null : q.data!.impactStories,
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
  };
}
