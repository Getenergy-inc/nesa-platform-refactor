/**
 * Africa Region Classifier
 * ------------------------------------------------------------------
 * Country-first classification of nominees into the 5 official
 * African regions used by the region-first nominee architecture.
 *
 * Confidence:
 *  - high   : country exact-matches the country→region map
 *  - medium : inferred from category name (e.g. "(Nigeria)", "Diaspora")
 *  - low    : no signal → "unknown" + requiresManualReview
 */

export type AfricaRegion =
  | "west-africa"
  | "east-africa"
  | "north-africa"
  | "central-africa"
  | "southern-africa"
  | "unknown";

export interface RegionMeta {
  slug: Exclude<AfricaRegion, "unknown">;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  countries: string[];
}

export const AFRICA_REGIONS: RegionMeta[] = [
  {
    slug: "west-africa",
    name: "West Africa",
    shortName: "West",
    tagline: "Coastal innovation, continental scale",
    description:
      "From Lagos to Dakar, West Africa anchors the largest education movement on the continent. Discover NESA-Africa nominees driving infrastructure, EdTech, NGO impact and CSR across the region.",
    countries: [
      "Nigeria","Ghana","Senegal","Gambia","Sierra Leone","Liberia","Côte d'Ivoire","Cote d'Ivoire","Ivory Coast",
      "Togo","Benin","Burkina Faso","Mali","Niger","Guinea","Guinea-Bissau","Cape Verde","Cabo Verde",
    ],
  },
  {
    slug: "east-africa",
    name: "East Africa",
    shortName: "East",
    tagline: "Rift Valley vision, Indian Ocean reach",
    description:
      "Kenya, Tanzania, Uganda, Rwanda and the Horn drive East Africa's education renaissance — from teacher training to digital learning across rural and urban communities.",
    countries: [
      "Kenya","Uganda","Tanzania","Rwanda","Burundi","Ethiopia","Somalia","South Sudan","Eritrea",
      "Djibouti","Seychelles","Comoros","Mauritius",
    ],
  },
  {
    slug: "north-africa",
    name: "North Africa",
    shortName: "North",
    tagline: "Mediterranean heritage, Sahara horizon",
    description:
      "Egypt, Morocco, Tunisia, Algeria, Libya and Sudan — North Africa's nominees are reshaping bilingual education, research and youth innovation across the Maghreb and Nile Valley.",
    countries: ["Egypt","Libya","Tunisia","Algeria","Morocco","Sudan","Western Sahara"],
  },
  {
    slug: "central-africa",
    name: "Central Africa",
    shortName: "Central",
    tagline: "Equatorial heart of African learning",
    description:
      "From Cameroon and the Congos to Angola and Gabon, Central Africa's nominees are rebuilding schools, expanding literacy and championing youth across the equatorial belt.",
    countries: [
      "Cameroon","Chad","Central African Republic","CAR","Democratic Republic of Congo","DR Congo","DRC",
      "Republic of Congo","Congo","Gabon","Equatorial Guinea","São Tomé and Príncipe","Sao Tome and Principe","Angola",
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
      "South Africa","Namibia","Botswana","Zimbabwe","Zambia","Malawi","Mozambique","Lesotho","Eswatini","Swaziland","Madagascar",
    ],
  },
];

// Build reverse country → region lookup (case-insensitive, normalised)
const COUNTRY_TO_REGION = new Map<string, Exclude<AfricaRegion, "unknown">>();
for (const r of AFRICA_REGIONS) {
  for (const c of r.countries) {
    COUNTRY_TO_REGION.set(c.toLowerCase().trim(), r.slug);
  }
}

export type RegionConfidence = "high" | "medium" | "low";

export interface RegionClassification {
  region: AfricaRegion;
  confidence: RegionConfidence;
  requiresManualReview: boolean;
  source: "country" | "category" | "region-field" | "none";
}

/**
 * Classify a nominee into an Africa region.
 * Tries: country → region field → category-name heuristic → unknown.
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
    // try last token (e.g. "Lagos, Nigeria")
    const last = country.split(",").pop()?.trim();
    if (last) {
      const hit2 = COUNTRY_TO_REGION.get(last);
      if (hit2) return { region: hit2, confidence: "high", requiresManualReview: false, source: "country" };
    }
  }

  const regionField = (input.region ?? "").trim().toLowerCase();
  if (regionField && regionField !== "n/a") {
    for (const r of AFRICA_REGIONS) {
      if (regionField.includes(r.slug.replace("-africa", "")) || regionField.includes(r.name.toLowerCase())) {
        return { region: r.slug, confidence: "medium", requiresManualReview: false, source: "region-field" };
      }
    }
  }

  const cat = (input.categoryName ?? "").toLowerCase();
  if (cat) {
    if (cat.includes("nigeria")) return { region: "west-africa", confidence: "medium", requiresManualReview: false, source: "category" };
    for (const r of AFRICA_REGIONS) {
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
