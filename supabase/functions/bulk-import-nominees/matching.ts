/**
 * Reusable matching + normalisation helpers for admin bulk imports.
 * Kept free of Deno/Supabase imports so it can be unit tested anywhere.
 */

export const BOILERPLATE_PHRASES = [
  "the overall best",
  "overall best",
  "best of the best",
  "special recognition",
  "recognition award",
  "award category",
];

export const BOILERPLATE_WORDS = new Set([
  "award",
  "awards",
  "awardee",
  "recognition",
  "recognitions",
  "category",
  "categories",
  "subcategory",
  "sub",
  "class",
  "classification",
  "prize",
  "honour",
  "honor",
  "overall",
  "best",
  "the",
  "of",
  "for",
  "in",
  "on",
  "and",
  "to",
  "a",
  "an",
  "nesa",
  "nigeria",
  "nigerian",
  "africa",
  "african",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
]);

/** Region canonical names used across the platform. */
export const CANONICAL_REGIONS = [
  "West Africa",
  "East Africa",
  "North Africa",
  "Central Africa",
  "Southern Africa",
] as const;

export type CanonicalRegion = (typeof CANONICAL_REGIONS)[number];

const REGION_ALIASES: Record<string, CanonicalRegion> = {
  "west africa": "West Africa",
  west: "West Africa",
  "western africa": "West Africa",
  "east africa": "East Africa",
  east: "East Africa",
  "eastern africa": "East Africa",
  "north africa": "North Africa",
  north: "North Africa",
  "northern africa": "North Africa",
  "central africa": "Central Africa",
  central: "Central Africa",
  "southern africa": "Southern Africa",
  // "South Africa" as a REGION value is an alias for Southern Africa
  "south africa": "Southern Africa",
  south: "Southern Africa",
  "south afrika": "Southern Africa",
};

export function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Canonicalise a free-text region value. Returns null when unrecognised. */
export function normaliseRegion(raw: string | null | undefined): CanonicalRegion | null {
  if (!raw) return null;
  const key = stripDiacritics(String(raw))
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!key) return null;
  if (REGION_ALIASES[key]) return REGION_ALIASES[key];
  for (const [alias, canonical] of Object.entries(REGION_ALIASES)) {
    if (key.includes(alias)) return canonical;
  }
  return null;
}

/** Lowercase, de-accent, strip punctuation and boilerplate words. */
export function normaliseTitle(raw: string | null | undefined): string {
  if (!raw) return "";
  let text = stripDiacritics(String(raw)).toLowerCase();
  // Remove any parenthetical region suffix before scoring
  text = text.replace(/\(([^)]*)\)/g, " ");
  for (const phrase of BOILERPLATE_PHRASES) text = text.replaceAll(phrase, " ");
  text = text.replace(/[^a-z0-9\s]/g, " ");
  const tokens = text
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !BOILERPLATE_WORDS.has(t));
  return tokens.join(" ");
}

export function tokenSet(raw: string | null | undefined): Set<string> {
  const normalised = normaliseTitle(raw);
  return new Set(normalised.split(" ").filter(Boolean));
}

/** 0..1 similarity: token containment blended with Jaccard overlap. */
export function similarity(a: string, b: string): number {
  const na = normaliseTitle(a);
  const nb = normaliseTitle(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const sa = new Set(na.split(" "));
  const sb = new Set(nb.split(" "));
  let shared = 0;
  for (const t of sa) if (sb.has(t)) shared += 1;
  if (shared === 0) return 0;
  const jaccard = shared / (sa.size + sb.size - shared);
  const containment = shared / Math.min(sa.size, sb.size);
  const substring = na.includes(nb) || nb.includes(na) ? 0.15 : 0;
  return Math.min(1, jaccard * 0.5 + containment * 0.5 + substring);
}

/** Extract "(West Africa)"-style region suffix from a subcategory name. */
export function subcategoryRegion(name: string): CanonicalRegion | null {
  const matches = [...String(name).matchAll(/\(([^)]*)\)/g)];
  for (const m of matches) {
    const region = normaliseRegion(m[1]);
    if (region) return region;
  }
  // also allow trailing " - West Africa"
  const dash = String(name).split(/\s[-–]\s/).pop();
  if (dash && dash !== name) return normaliseRegion(dash);
  return null;
}

const PLACEHOLDER_PATTERNS = [
  /^nominee\s*\d+$/i,
  /^nominees?\s*[-_#]?\s*\d+$/i,
  /^organisation\s*\d+$/i,
  /^organization\s*\d+$/i,
  /^name\s*\d+$/i,
  /^tbd$/i,
  /^tba$/i,
  /^n\/?a$/i,
  /^unknown$/i,
  /^placeholder/i,
  /^xxx+$/i,
];

export function isPlaceholderName(name: string): boolean {
  const trimmed = String(name || "").trim();
  if (!trimmed) return true;
  return PLACEHOLDER_PATTERNS.some((re) => re.test(trimmed));
}

export function slugify(value: string): string {
  return stripDiacritics(String(value))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function randomSuffix(len = 6): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < len; i += 1) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export function buildSlug(name: string): string {
  const base = slugify(name) || "nominee";
  return `${base}-${randomSuffix()}`;
}

/** Header aliases -> canonical field keys. */
const FIELD_ALIASES: Record<string, string[]> = {
  name: [
    "name",
    "nominee",
    "nominee name",
    "nominees name",
    "full name",
    "fullname",
    "organisation",
    "organization",
    "organisation name",
    "organization name",
    "nominee organisation",
    "nominee/organisation",
    "nominee / organisation",
    "company",
    "institution",
  ],
  category: [
    "category",
    "award",
    "award title",
    "award category",
    "category title",
    "award name",
    "main category",
    "parent category",
  ],
  subcategory: [
    "subcategory",
    "sub category",
    "sub-category",
    "classification",
    "class",
    "subcategory title",
    "sub category title",
    "award subcategory",
  ],
  region: ["region", "zone", "african region", "region name"],
  country: ["country", "nation", "country of origin"],
  bio: [
    "bio",
    "biography",
    "achievement",
    "achievements",
    "contribution",
    "contributions",
    "impact",
    "profile",
    "description",
    "about",
    "achievement/contribution",
    "work done",
    "citation",
  ],
  email: ["email", "primary email", "email address", "e-mail", "contact email"],
  additional_emails: [
    "additional emails",
    "additional email",
    "other emails",
    "other email",
    "secondary email",
    "alt email",
    "email 2",
  ],
  phone: [
    "phone",
    "phone number",
    "phone numbers",
    "telephone",
    "mobile",
    "contact",
    "contact number",
    "whatsapp",
  ],
  source_image: [
    "image",
    "image path",
    "source image",
    "source image path",
    "photo",
    "photo path",
    "picture",
    "image file",
  ],
};

function headerKey(header: string): string {
  return stripDiacritics(String(header))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface MappedRow {
  name: string;
  category: string;
  subcategory: string;
  region: string;
  country: string;
  bio: string;
  email: string;
  additional_emails: string;
  phone: string;
  source_image: string;
}

/** Map an arbitrary spreadsheet row object onto our canonical field names. */
export function mapRow(row: Record<string, unknown>): MappedRow {
  const out: Record<string, string> = {
    name: "",
    category: "",
    subcategory: "",
    region: "",
    country: "",
    bio: "",
    email: "",
    additional_emails: "",
    phone: "",
    source_image: "",
  };

  const entries = Object.entries(row).map(([k, v]) => [headerKey(k), v] as const);

  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    // exact alias first, then partial contains
    let value: unknown;
    for (const alias of aliases) {
      const hit = entries.find(([k]) => k === alias);
      if (hit && hit[1] != null && String(hit[1]).trim() !== "") {
        value = hit[1];
        break;
      }
    }
    if (value === undefined) {
      for (const alias of aliases) {
        const hit = entries.find(([k]) => k.includes(alias));
        if (hit && hit[1] != null && String(hit[1]).trim() !== "") {
          value = hit[1];
          break;
        }
      }
    }
    if (value !== undefined) out[field] = String(value).trim();
  }

  return out as unknown as MappedRow;
}

export interface CategoryLike {
  id: string;
  name: string;
  slug?: string | null;
}

export interface SubcategoryLike {
  id: string;
  category_id: string;
  name: string;
  slug?: string | null;
}

export interface MatchResult<T> {
  match: T | null;
  score: number;
  confident: boolean;
}

export const CONFIDENT_THRESHOLD = 0.55;
export const WEAK_THRESHOLD = 0.34;

export function matchCategory(
  title: string,
  categories: CategoryLike[],
): MatchResult<CategoryLike> {
  let best: CategoryLike | null = null;
  let bestScore = 0;
  for (const c of categories) {
    const score = Math.max(similarity(title, c.name), similarity(title, c.slug ?? ""));
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  if (bestScore < WEAK_THRESHOLD) return { match: null, score: bestScore, confident: false };
  return { match: best, score: bestScore, confident: bestScore >= CONFIDENT_THRESHOLD };
}

export function matchSubcategory(
  title: string,
  subcategories: SubcategoryLike[],
  region: CanonicalRegion | null,
): MatchResult<SubcategoryLike> {
  const eligible = subcategories.filter((s) => {
    const suffix = subcategoryRegion(s.name);
    if (suffix) return region !== null && suffix === region;
    return true;
  });
  const pool = eligible.length > 0 ? eligible : subcategories;

  let best: SubcategoryLike | null = null;
  let bestScore = 0;
  for (const s of pool) {
    let score = Math.max(similarity(title, s.name), similarity(title, s.slug ?? ""));
    if (region && subcategoryRegion(s.name) === region) score += 0.1;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }

  // Single unambiguous option for this region still counts as a usable match
  if (!best && pool.length === 1) {
    return { match: pool[0], score: 0.4, confident: false };
  }
  if (bestScore < WEAK_THRESHOLD) {
    if (pool.length === 1 && eligible.length === 1) {
      return { match: pool[0], score: 0.4, confident: false };
    }
    return { match: null, score: bestScore, confident: false };
  }
  return { match: best, score: Math.min(bestScore, 1), confident: bestScore >= CONFIDENT_THRESHOLD };
}
