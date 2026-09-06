/**
 * Nominee lane galleries — the eight award lanes that exist TODAY in the live
 * `categories` / `subcategories` taxonomy. No new categories are invented
 * here: every entry points at a real `categories.slug` (optionally narrowed to
 * one real `subcategories.slug`).
 *
 * Route pattern mirrors the Icon award ecosystem:
 *   /nominees/lane/:lane           → gallery
 *   /nominees/lane/:lane/:slug     → shared extended nominee profile
 */

export interface LaneFamily {
  /** Key embedded in the subcategory slug, e.g. "basicprimary" in
   *  `ngo-africa-basicprimary-west-africa`. */
  key: string;
  label: string;
}

export interface LaneRegion {
  /** Slug suffix, e.g. "west-africa". */
  key: string;
  label: string;
}

export interface NomineeLane {
  /** URL segment */
  slug: string;
  /** Public-facing gallery title */
  title: string;
  /** Official category name, kept visible even when the lane label is plainer */
  officialName: string;
  tier: string;
  intro: string;
  /** Real categories.slug */
  categorySlug: string;
  /** Optional real subcategories.slug narrowing the gallery */
  subcategorySlug?: string;
  /** Lane landing page (the /get-involved front door) */
  laneHref: string;
  /** Real nomination entry point */
  nominateHref: string;
  /** Optional focus-area grouping parsed from subcategory slugs
   *  (`<category>-<family>-<region>`). When present the gallery shows
   *  focus-area tabs and a region filter. */
  subFamilies?: LaneFamily[];
  regionSuffixes?: LaneRegion[];
}

export const NOMINEE_LANES: NomineeLane[] = [
  {
    slug: "csr-africa",
    title: "CSR for Education (Africa Regional)",
    officialName: "Best CSR for Education (Africa Regional)",
    tier: "Gold-Blue Garnet Recognition",
    intro:
      "Companies running structured corporate giving, CSR, or ESG education programmes across more than one African country.",
    categorySlug: "best-csr-education-africa",
    laneHref: "/get-involved/csr",
    nominateHref: "/nominate?category=best-csr-for-education-africa-regional",
  },
  {
    slug: "csr-nigeria",
    title: "CSR for Education (Nigeria)",
    officialName: "Best CSR for Education (Nigeria)",
    tier: "Gold-Blue Garnet Recognition",
    intro:
      "Companies whose education CSR work is focused primarily within Nigeria.",
    categorySlug: "best-csr-education-nigeria",
    laneHref: "/get-involved/csr",
    nominateHref: "/nominate?category=best-csr-for-education-nigeria",
  },
  {
    slug: "ngo-nigeria",
    title: "NGO Contribution to Education (Nigeria)",
    officialName: "Best NGO Contribution to Education (Nigeria)",
    tier: "Gold-Blue Garnet Recognition",
    intro:
      "NGOs delivering education programmes at scale inside Nigeria.",
    categorySlug: "best-ngo-education-nigeria",
    laneHref: "/get-involved/ngo",
    nominateHref: "/nominate?category=best-ngo-for-education-nigeria",
  },
  {
    slug: "ngo-africa",
    title: "NGO Contribution to Education for All (Africa Regional)",
    officialName: "Best NGO Contribution to Education for All (Africa Regional)",
    tier: "Gold-Blue Garnet Recognition",
    intro:
      "NGOs delivering education programmes across African regions — from basic and primary education to girl-child education, refugee and displaced children, inclusive education, scholarships, and teacher development. Public nominations for the 2026 season are open.",
    categorySlug: "best-ngo-education-africa",
    laneHref: "/get-involved/ngo",
    nominateHref: "/nominate?category=best-ngo-for-education-africa-regional",
    subFamilies: [
      { key: "basicprimary", label: "Basic & Primary Education" },
      { key: "girlchild", label: "Girl-Child Education" },
      { key: "refugee", label: "Refugee & Displaced Children" },
      { key: "specialneeds", label: "Special Needs & Inclusive Education" },
      { key: "training", label: "Teacher Training & Development" },
      { key: "community", label: "Community Education & Literacy" },
      { key: "materials", label: "Learning Materials & Resources" },
      { key: "scholarship", label: "Scholarships & Sponsorships" },
    ],
    regionSuffixes: [
      { key: "west-africa", label: "West Africa" },
      { key: "east-africa", label: "East Africa" },
      { key: "north-africa", label: "North Africa" },
      { key: "central-africa", label: "Central Africa" },
      { key: "southern-africa", label: "Southern Africa" },
      { key: "sahel-africa", label: "Sahel Africa" },
      { key: "horn-of-africa", label: "Horn of Africa" },
      { key: "indian-ocean-islands", label: "Indian Ocean Islands" },
      { key: "african-diaspora", label: "African Diaspora" },
    ],
  },
  {
    slug: "foundations",
    title: "Africa Education Philanthropy Icon",
    officialName: "Africa Education Philanthropy Icon of the Decade",
    tier: "Africa Education Icon",
    intro:
      "Foundations — family, corporate, and community — with sustained philanthropic giving to African education.",
    categorySlug: "africa-education-icon-award",
    subcategorySlug: "icon-philanthropy",
    laneHref: "/get-involved/foundations",
    nominateHref: "/nominate?category=africa-education-philanthropy-icon",
  },
  {
    slug: "edutech-africa",
    title: "EduTech Organisation (Africa Regional)",
    officialName: "Best EduTech Organisation (Africa Regional)",
    tier: "Gold-Blue Garnet Recognition",
    intro:
      "Organisations building digital learning tools, platforms, and infrastructure for African learners.",
    categorySlug: "best-edutech-organisation-africa",
    laneHref: "/get-involved/edutech",
    nominateHref: "/nominate?category=best-edutech-organisation-africa",
  },
  {
    slug: "influencer-social-media",
    title: "Social Media — Education Impact",
    officialName:
      "Africa Social Media Influencer Education Support Blue Garnet Recognition Award",
    tier: "Influencer Education Impact",
    intro:
      "Digital creators, advocates, and online educators using their platforms for African education.",
    categorySlug: "africa-social-media-influencer-education",
    laneHref: "/get-involved/influencers",
    nominateHref: "/nominate?tier=influencer-2026&track=social-media",
  },
  {
    slug: "influencer-sports",
    title: "Sports — Education Impact",
    officialName:
      "Africa Sports Influencer Education Support Blue Garnet Recognition Award",
    tier: "Influencer Education Impact",
    intro:
      "Athletes, coaches, and sports organisations channelling sport's reach into education.",
    categorySlug: "africa-sports-influencer-education",
    laneHref: "/get-involved/influencers",
    nominateHref: "/nominate?tier=influencer-2026&track=sports",
  },
  {
    slug: "influencer-music",
    title: "Music — Education Impact",
    officialName:
      "Africa Music Influencer Education Support Blue Garnet Recognition Award",
    tier: "Influencer Education Impact",
    intro:
      "Recording artists, producers, and music industry figures funding or campaigning for education.",
    categorySlug: "africa-music-influencer-education",
    laneHref: "/get-involved/influencers",
    nominateHref: "/nominate?tier=influencer-2026&track=music",
  },
];

export const getNomineeLane = (slug?: string) =>
  NOMINEE_LANES.find((l) => l.slug === slug);
