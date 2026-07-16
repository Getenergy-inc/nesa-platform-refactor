/**
 * Africa Region Classifier
 * ------------------------------------------------------------------
 * Country-first classification of nominees into the 8 official
 * African regions used by the NESA-Africa 2026 region architecture,
 * plus a 9th classification for the African Diaspora Community.
 *
 * Regions: North, West, Central, East, Horn, Southern, Sahel, Indian
 * Ocean Islands + Diaspora (global community, not a geographic region).
 *
 * Confidence:
 *  - high   : country exact-matches the country→region map
 *  - medium : inferred from region field or category name
 *  - low    : no signal → "unknown" + requiresManualReview
 */

export type AfricaRegion =
  | "north-africa"
  | "west-africa"
  | "central-africa"
  | "east-africa"
  | "horn-of-africa"
  | "southern-africa"
  | "sahel-region"
  | "indian-ocean-islands"
  | "diaspora"
  | "unknown";

export interface RegionMeta {
  slug: Exclude<AfricaRegion, "unknown">;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  countries: string[];
  /** True for the Diaspora entry (global community, not an Africa region). */
  isDiaspora?: boolean;
}

export const AFRICA_REGIONS: RegionMeta[] = [
  {
    slug: "north-africa",
    name: "North Africa",
    shortName: "North",
    tagline: "Mediterranean heritage, Sahara horizon",
    description:
      "Egypt, Morocco, Tunisia, Algeria and Libya — North Africa's nominees are reshaping bilingual education, research and youth innovation across the Maghreb and Nile Valley.",
    countries: ["Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Western Sahara"],
  },
  {
    slug: "west-africa",
    name: "West Africa",
    shortName: "West",
    tagline: "Coastal innovation, continental scale",
    description:
      "From Lagos to Dakar, West Africa anchors the largest education movement on the continent. Discover NESA-Africa nominees driving infrastructure, EdTech, NGO impact and CSR across the region.",
    countries: [
      "Nigeria", "Ghana", "Senegal", "Gambia", "The Gambia", "Sierra Leone", "Liberia",
      "Côte d'Ivoire", "Cote d'Ivoire", "Ivory Coast", "Togo", "Benin",
      "Guinea", "Guinea-Bissau", "Cape Verde", "Cabo Verde",
    ],
  },
  {
    slug: "central-africa",
    name: "Central Africa",
    shortName: "Central",
    tagline: "Equatorial heart of African learning",
    description:
      "From Cameroon and the Congos to Angola and Gabon, Central Africa's nominees are rebuilding schools, expanding literacy and championing youth across the equatorial belt.",
    countries: [
      "Cameroon", "Central African Republic", "CAR",
      "Democratic Republic of Congo", "DR Congo", "DRC",
      "Republic of Congo", "Congo", "Gabon", "Equatorial Guinea",
      "São Tomé and Príncipe", "Sao Tome and Principe", "Angola",
    ],
  },
  {
    slug: "east-africa",
    name: "East Africa",
    shortName: "East",
    tagline: "Rift Valley vision, continental reach",
    description:
      "Kenya, Tanzania, Uganda, Rwanda and Burundi drive East Africa's education renaissance — teacher training, digital learning and community schools across rural and urban communities.",
    countries: ["Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi"],
  },
  {
    slug: "horn-of-africa",
    name: "Horn of Africa",
    shortName: "Horn",
    tagline: "Ancient scholarship, resilient futures",
    description:
      "Ethiopia, Somalia, Eritrea, Djibouti, South Sudan and Sudan — nominees advancing education access, teacher formation and post-conflict school recovery across the Horn.",
    countries: [
      "Ethiopia", "Somalia", "Somaliland", "Eritrea", "Djibouti",
      "South Sudan", "Sudan",
    ],
  },
  {
    slug: "southern-africa",
    name: "Southern Africa",
    shortName: "Southern",
    tagline: "From Cape to Kilimanjaro foothills",
    description:
      "South Africa, Zimbabwe, Botswana, Namibia, Zambia and the SADC bloc anchor a powerful southern education ecosystem — equity, STEM, libraries and lifelong learning.",
    countries: [
      "South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia",
      "Malawi", "Mozambique", "Lesotho", "Eswatini", "Swaziland",
    ],
  },
  {
    slug: "sahel-region",
    name: "Sahel Region",
    shortName: "Sahel",
    tagline: "Desert-edge classrooms, mobile learning",
    description:
      "Mali, Burkina Faso, Niger, Chad and Mauritania — Sahel nominees are pioneering mobile classrooms, girls' education and community resilience across the desert corridor.",
    countries: [
      "Mali", "Burkina Faso", "Niger", "Chad", "Mauritania",
    ],
  },
  {
    slug: "indian-ocean-islands",
    name: "Indian Ocean Islands",
    shortName: "Indian Ocean",
    tagline: "Island scholarship, oceanic bridges",
    description:
      "Madagascar, Mauritius, Seychelles and Comoros — island education leaders advancing multilingual learning, marine science education and cross-archipelago partnerships.",
    countries: ["Madagascar", "Mauritius", "Seychelles", "Comoros"],
  },
  {
    slug: "diaspora",
    name: "African Diaspora",
    shortName: "Diaspora",
    tagline: "Global Africans, continental impact",
    description:
      "Africans in the Diaspora — from North America and Europe to the Caribbean, Middle East, Asia and Oceania — advancing Education for All across the continent from abroad.",
    countries: [],
    isDiaspora: true,
  },
];

// Build reverse country → region lookup (case-insensitive, normalised)
const COUNTRY_TO_REGION = new Map<string, Exclude<AfricaRegion, "unknown">>();
for (const r of AFRICA_REGIONS) {
  for (const c of r.countries) {
    COUNTRY_TO_REGION.set(c.toLowerCase().trim(), r.slug);
  }
}

// Legacy short slug aliases → canonical 8-region slugs
const LEGACY_SLUG_ALIASES: Record<string, Exclude<AfricaRegion, "unknown">> = {
  north: "north-africa",
  west: "west-africa",
  east: "east-africa",
  south: "southern-africa",
  southern: "southern-africa",
  central: "central-africa",
  horn: "horn-of-africa",
  sahel: "sahel-region",
  "indian-ocean": "indian-ocean-islands",
  islands: "indian-ocean-islands",
  "african-diaspora": "diaspora",
  global: "diaspora",
};

export function resolveLegacyRegionSlug(slug: string): Exclude<AfricaRegion, "unknown"> | undefined {
  return LEGACY_SLUG_ALIASES[slug.toLowerCase().trim()];
}

export type RegionConfidence = "high" | "medium" | "low";

export interface RegionClassification {
  region: AfricaRegion;
  confidence: RegionConfidence;
  requiresManualReview: boolean;
  source: "country" | "category" | "region-field" | "none";
}

/**
 * Classify a nominee into an Africa region (or the Diaspora community).
 */
export function classifyRegion(input: {
  country?: string | null;
  region?: string | null;
  categoryName?: string | null;
}): RegionClassification {
  const country = (input.country ?? "").trim().toLowerCase();
  if (country) {
    const hit = COUNTRY_TO_REGION.get(country);
    if (hit) return { region: hit, confidence: "high", requiresManualReview: false, source: "country" };
    const last = country.split(",").pop()?.trim();
    if (last) {
      const hit2 = COUNTRY_TO_REGION.get(last);
      if (hit2) return { region: hit2, confidence: "high", requiresManualReview: false, source: "country" };
    }
  }

  const regionField = (input.region ?? "").trim().toLowerCase();
  if (regionField && regionField !== "n/a") {
    if (regionField.includes("diaspora") || regionField.includes("global"))
      return { region: "diaspora", confidence: "medium", requiresManualReview: false, source: "region-field" };
    for (const r of AFRICA_REGIONS) {
      if (r.isDiaspora) continue;
      if (regionField.includes(r.slug) || regionField.includes(r.name.toLowerCase()) || regionField.includes(r.shortName.toLowerCase())) {
        return { region: r.slug, confidence: "medium", requiresManualReview: false, source: "region-field" };
      }
    }
  }

  const cat = (input.categoryName ?? "").toLowerCase();
  if (cat) {
    if (cat.includes("diaspora"))
      return { region: "diaspora", confidence: "medium", requiresManualReview: false, source: "category" };
    if (cat.includes("nigeria")) return { region: "west-africa", confidence: "medium", requiresManualReview: false, source: "category" };
    for (const r of AFRICA_REGIONS) {
      if (r.isDiaspora) continue;
      if (cat.includes(r.name.toLowerCase()) || cat.includes(r.slug)) {
        return { region: r.slug, confidence: "medium", requiresManualReview: false, source: "category" };
      }
    }
  }

  return { region: "unknown", confidence: "low", requiresManualReview: true, source: "none" };
}

export function getRegionMeta(slug: string): RegionMeta | undefined {
  return AFRICA_REGIONS.find((r) => r.slug === slug);
}

export function isValidRegionSlug(slug: string): slug is Exclude<AfricaRegion, "unknown"> {
  return AFRICA_REGIONS.some((r) => r.slug === slug);
}
