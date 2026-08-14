// Recognition-families living gallery — homepage data hook.
//
// Authoritative source: the same `public_nominees` view that powers the
// /nominees directory (and `useLivingGallery`). No new data source, no
// fabricated records. Records are merged across the six recognition families
// and interleaved so the strip mixes families, exactly like the Icon gallery
// interleaves its three pathways.

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RECOGNITION_FAMILIES } from "@/config/brandHierarchy";
import { LIVING_GALLERY_MIN_RECORDS } from "./useLivingGallery";

export { LIVING_GALLERY_MIN_RECORDS };

/** Cards rendered in the strip. */
export const FAMILY_GALLERY_CARD_LIMIT = 36;
/** Records pulled per family before interleaving. */
const PER_FAMILY_LIMIT = 12;

/**
 * Database category slugs behind each public recognition family.
 *
 * The brand config carries the canonical (public) category slugs; the live
 * catalogue uses some historical variants. Both are listed so the query keeps
 * working through the taxonomy cutover — unknown slugs are simply ignored.
 */
const FAMILY_DB_CATEGORY_SLUGS: Record<string, string[]> = {
  "csr-education": ["best-csr-education-africa", "best-csr-education-nigeria"],
  "edutech-innovation": [
    "best-edtech-innovation-africa",
    "best-edutech-organisation-africa",
    "best-stem-education-africa",
  ],
  "media-education": [
    "best-media-education-advocacy-nigeria",
    "best-media-educational-advocacy-nigeria",
  ],
  "ngo-international": [
    "best-ngo-education-nigeria",
    "best-ngo-education-africa",
    "international-partnership-education",
    "international-bilateral-education",
  ],
  "diaspora-impact": ["diaspora-educational-impact", "diaspora-education-impact"],
  // Influencer Education Impact lives in THREE real catalogue categories —
  // the same ones behind the /awards/influencer-education-impact slider
  // (see useInfluencerPathwayNominees). The historical single
  // "influencer-education-impact(-award)" category carries no records and is
  // kept only so legacy rows, if any surface, are not dropped.
  "influencer-education-impact": [
    "africa-music-influencer-education",
    "africa-social-media-influencer-education",
    "africa-sports-influencer-education",
    "influencer-education-impact-award",
    "influencer-education-impact",
  ],
};

export interface FamilyGalleryEntry {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  imageKind: "photo" | "logo";
  country: string | null;
  region: string | null;
  /** The record's ACTUAL award subcategory label, as stored in the database. */
  categoryLabel: string;
  familySlug: string;
  familyName: string;
  /** Role / organisation line, when the record carries one. */
  title: string | null;
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

function normaliseUrl(url: string | null | undefined): string | null {
  const u = (url || "").trim();
  if (!u) return null;
  if (/placeholder|no-image|default-avatar/i.test(u)) return null;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return u;
  return null;
}

async function fetchFamilyBuckets(): Promise<Record<string, FamilyGalleryEntry[]>> {
  const allSlugs = Object.values(FAMILY_DB_CATEGORY_SLUGS).flat();

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, slug, name")
    .in("slug", allSlugs);
  if (catErr) throw catErr;
  if (!cats?.length) return {};

  const catById = new Map<string, { slug: string; name: string }>(
    cats.map((c: any) => [c.id, { slug: c.slug, name: c.name }]),
  );

  const { data: subs, error: subErr } = await supabase
    .from("subcategories")
    .select("id, name, category_id")
    .in(
      "category_id",
      cats.map((c: any) => c.id),
    );
  if (subErr) throw subErr;
  if (!subs?.length) return {};

  // subcategory id -> { label, family }
  const subMeta = new Map<
    string,
    { label: string; familySlug: string; familyName: string }
  >();
  for (const s of subs as any[]) {
    const cat = catById.get(s.category_id);
    if (!cat) continue;
    const family = RECOGNITION_FAMILIES.find((f) =>
      (FAMILY_DB_CATEGORY_SLUGS[f.slug] || []).includes(cat.slug),
    );
    if (!family) continue;
    subMeta.set(s.id, {
      // The specific award subcategory as stored — falls back to the parent
      // category name when the subcategory is unnamed.
      label: (s.name || cat.name || "").trim() || cat.name,
      familySlug: family.slug,
      familyName: family.name,
    });
  }
  if (subMeta.size === 0) return {};

  // One query PER family. A single pooled query would let the large families
  // (CSR, EduTech) consume the row budget and starve the smaller ones, which
  // then render an incorrect "no profile published yet" empty state.
  const familySubIds = new Map<string, string[]>();
  for (const [subId, meta] of subMeta) {
    const list = familySubIds.get(meta.familySlug) || [];
    list.push(subId);
    familySubIds.set(meta.familySlug, list);
  }

  const results = await Promise.all(
    [...familySubIds.entries()].map(async ([familySlug, subIds]) => {
      const { data, error } = await supabase
        .from("public_nominees")
        .select(
          "id, name, slug, country, region, photo_url, logo_url, bio, title, subcategory_id, profile_completion_score",
        )
        .eq("publication_status", "published")
        .in("subcategory_id", subIds)
        .or("photo_url.not.is.null,logo_url.not.is.null")
        .order("profile_completion_score", { ascending: false, nullsFirst: false })
        .limit(PER_FAMILY_LIMIT * 4);
      if (error) throw error;
      return { familySlug, rows: (data || []) as any[] };
    }),
  );

  // Bucket per family, then interleave.
  const buckets = new Map<string, FamilyGalleryEntry[]>();
  for (const { rows } of results) {
    for (const r of rows) {
      if (!r.name || !r.slug) continue;
      const meta = subMeta.get(r.subcategory_id);
      if (!meta) continue;
      const isOrg = looksLikeOrg(r.name);
      const logo = normaliseUrl(r.logo_url);
      const photo = normaliseUrl(r.photo_url);
      const imageUrl = isOrg ? logo || photo : photo || logo;
      if (!imageUrl) continue;
      // A logo must never be cropped like a portrait — key off the field the
      // image actually came from, not just the name heuristic.
      const imageKind: "photo" | "logo" = imageUrl === logo ? "logo" : "photo";
      const bucket = buckets.get(meta.familySlug) || [];
      if (bucket.length >= PER_FAMILY_LIMIT) continue;
      bucket.push({
        id: r.id,
        name: r.name,
        slug: r.slug,
        imageUrl,
        imageKind,
        country: tidy(r.country, 40),
        region: tidy(r.region, 40),
        categoryLabel: meta.label,
        familySlug: meta.familySlug,
        familyName: meta.familyName,
        title: tidy(r.title, 90),
        impact: tidy(r.bio) || tidy(r.title, 90),
        href: `/nominees/${encodeURIComponent(r.slug)}`,
      });
      buckets.set(meta.familySlug, bucket);
    }
  }

  const out: Record<string, FamilyGalleryEntry[]> = {};
  for (const f of RECOGNITION_FAMILIES) out[f.slug] = buckets.get(f.slug) || [];
  return out;
}

/** One shared cached query powers both the strip and the per-family cards. */
function useFamilyBuckets() {
  return useQuery({
    queryKey: ["family-gallery-buckets"],
    queryFn: fetchFamilyBuckets,
    staleTime: 1000 * 60 * 10,
  });
}

function interleave(buckets: Record<string, FamilyGalleryEntry[]>): FamilyGalleryEntry[] {
  const ordered = RECOGNITION_FAMILIES.map((f) => buckets[f.slug] || []).filter(
    (b) => b.length > 0,
  );
  const longest = Math.max(0, ...ordered.map((b) => b.length));
  const out: FamilyGalleryEntry[] = [];
  for (let i = 0; i < longest && out.length < FAMILY_GALLERY_CARD_LIMIT; i++) {
    for (const bucket of ordered) {
      const entry = bucket[i];
      if (!entry) continue;
      out.push(entry);
      if (out.length >= FAMILY_GALLERY_CARD_LIMIT) break;
    }
  }
  return out;
}

export function useFamilyGalleryNominees() {
  const q = useFamilyBuckets();
  const nominees = q.data ? interleave(q.data) : [];
  return {
    nominees,
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
    hasEnough: !q.isLoading && !q.error && nominees.length >= LIVING_GALLERY_MIN_RECORDS,
  };
}

/**
 * One featured, published profile per recognition family.
 *
 * Selection is deterministic (highest profile-completion score first, then a
 * stable slug ordering) and rotates on a weekly cadence so the homepage stays
 * alive without re-rendering a different face on every paint. Families with no
 * eligible published record resolve to `null` — never a substitute from
 * another family.
 */
export function useFamilyFeaturedProfiles() {
  const q = useFamilyBuckets();
  const buckets = q.data;

  // Stable weekly rotation index (UTC weeks since epoch).
  const week = Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));

  const featured: Record<string, FamilyGalleryEntry | null> = {};
  for (const f of RECOGNITION_FAMILIES) {
    const bucket = (buckets?.[f.slug] || [])
      .slice()
      .sort((a, b) => a.slug.localeCompare(b.slug));
    featured[f.slug] = bucket.length ? bucket[week % bucket.length] : null;
  }

  return {
    featured,
    loading: q.isLoading,
    error: (q.error as Error) ?? null,
  };
}

