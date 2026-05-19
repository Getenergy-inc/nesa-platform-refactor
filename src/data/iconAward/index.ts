// Africa Education Icon Award — Lifetime Achievement (2006–2026)
// Nested data layer: Subcategory → Classification → Nominee

export type IconSubcategorySlug =
  | "literary-new-curriculum-advocate"
  | "technical-educator-icon"
  | "education-philanthropy-icon";

export type IconClassificationSlug =
  | "africans-in-africa"
  | "diaspora-africans"
  | "friends-of-africa";

export type JuryStatus =
  | "nominated"
  | "verified"
  | "shortlisted"
  | "jury_reviewed"
  | "laureate";

export interface IconNominee {
  id: string;
  name: string;
  slug: string;
  award_subcategory_slug: IconSubcategorySlug;
  classification_slug: IconClassificationSlug;
  country: string;
  region: string;
  residency_status?: string;
  heritage_identity?: string;
  sector?: string;
  impact_area: string[];
  years_of_contribution: string;
  impact_summary: string;
  full_impact_story?: string;
  impact_metrics?: Record<string, string | number>;
  jury_status: JuryStatus;
  verification_status: "pending" | "verified";
  image_url: string;
  banner_url?: string;
  media_gallery?: { type: "image" | "video" | "link"; url: string; title?: string }[];
  previous_categories?: string[];
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
  nomination_year?: number;
}

export interface IconSubcategory {
  slug: IconSubcategorySlug;
  title: string;
  short: string;
  description: string;
  purpose: string;
}

export interface IconClassification {
  slug: IconClassificationSlug;
  title: string;
  short: string;
  description: string;
}

export const ICON_AWARD = {
  slug: "africa-education-icon-award",
  title: "Africa Education Icon Award — Lifetime Achievement",
  yearRange: "2006–2026",
  subtitle:
    "Honouring transformational leaders whose long-term contributions have shaped education across Africa from 2006 to 2026.",
  status: "Jury Selection Only",
};

export const ICON_SUBCATEGORIES: IconSubcategory[] = [
  {
    slug: "literary-new-curriculum-advocate",
    title: "Literary & New Curriculum Advocate Icon of the Decade",
    short: "Literary & Curriculum",
    description:
      "Authors, publishers, curriculum reformers, education policy writers, and knowledge-system builders shaping how Africa learns.",
    purpose:
      "Classify literary leaders, curriculum reformers, writers, education content creators, policy writers, publishers, and knowledge-system builders.",
  },
  {
    slug: "technical-educator-icon",
    title: "Africa Technical Educator Icon of the Decade",
    short: "Technical Educator",
    description:
      "TVET, STEM, vocational and innovation training pioneers preparing Africa for the technical economy of tomorrow.",
    purpose:
      "Classify technical educators, vocational education leaders, STEM/TVET champions, innovation trainers, technology education leaders, and skills-development pioneers.",
  },
  {
    slug: "education-philanthropy-icon",
    title: "Africa Education Philanthropy Icon of the Decade",
    short: "Education Philanthropy",
    description:
      "Foundation leaders, scholarship sponsors, CSR funders and infrastructure backers whose generosity has scaled African education.",
    purpose:
      "Classify philanthropists, foundation leaders, CSR funders, education donors, scholarship sponsors, infrastructure supporters, and social impact investors.",
  },
];

export const ICON_CLASSIFICATIONS: IconClassification[] = [
  {
    slug: "africans-in-africa",
    title: "Africans in Africa",
    short: "Africans in Africa",
    description:
      "African nominees who live and work primarily within Africa, with direct education impact on the continent.",
  },
  {
    slug: "diaspora-africans",
    title: "Diaspora Africans",
    short: "Diaspora",
    description:
      "Nominees of African origin, heritage, or identity who live and work primarily outside Africa but contribute significantly to African education.",
  },
  {
    slug: "friends-of-africa",
    title: "Friends of Africa",
    short: "Friends of Africa",
    description:
      "Non-African individuals, organisations, institutions, or global partners with long-term contributions to African education.",
  },
];

// ---------- Seed nominees (curated baseline; expand via migration script) ----------
const N = (n: IconNominee): IconNominee => n;

export const ICON_NOMINEES: IconNominee[] = [
  // --- Literary & Curriculum ---
  N({
    id: "ICON-LIT-001",
    name: "Prof. Chinua Achebe Legacy Foundation",
    slug: "chinua-achebe-legacy-foundation",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "africans-in-africa",
    country: "Nigeria",
    region: "West Africa",
    sector: "Literature & Curriculum",
    impact_area: ["African Literature", "Curriculum Reform", "Youth Reading"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Sustained the literary canon shaping African secondary and tertiary curricula across the decade.",
    jury_status: "verified",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
    tags: ["literature", "curriculum"],
  }),
  N({
    id: "ICON-LIT-002",
    name: "Dr. Ngũgĩ wa Thiong'o Curriculum Initiative",
    slug: "ngugi-wa-thiongo-curriculum-initiative",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "diaspora-africans",
    country: "United States",
    region: "Diaspora & Global Africa",
    sector: "Literature & Curriculum",
    impact_area: ["Indigenous Language", "Curriculum Reform"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Championed African-language curriculum reform from the diaspora, influencing university programmes continent-wide.",
    jury_status: "nominated",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  N({
    id: "ICON-LIT-003",
    name: "Cambridge Africa Curriculum Partnership",
    slug: "cambridge-africa-curriculum-partnership",
    award_subcategory_slug: "literary-new-curriculum-advocate",
    classification_slug: "friends-of-africa",
    country: "United Kingdom",
    region: "Diaspora & Global Africa",
    sector: "Curriculum Publishing",
    impact_area: ["Curriculum Reform", "Teacher Training"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Two decades of curriculum co-design and teacher training across more than 20 African nations.",
    jury_status: "nominated",
    verification_status: "pending",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  // --- Technical Educator ---
  N({
    id: "ICON-TECH-001",
    name: "Prof. Calestous Juma TVET Network",
    slug: "calestous-juma-tvet-network",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "africans-in-africa",
    country: "Kenya",
    region: "East Africa",
    sector: "TVET & STEM",
    impact_area: ["TVET", "Innovation", "Policy"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Built a continental TVET network advancing technical education and innovation policy.",
    jury_status: "shortlisted",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  N({
    id: "ICON-TECH-002",
    name: "African STEM Diaspora Council",
    slug: "african-stem-diaspora-council",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "diaspora-africans",
    country: "Canada",
    region: "Diaspora & Global Africa",
    sector: "STEM Education",
    impact_area: ["STEM", "Mentorship", "Scholarships"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Diaspora-led STEM mentorship pipelines connecting African universities to global research.",
    jury_status: "nominated",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  N({
    id: "ICON-TECH-003",
    name: "Siemens Stiftung Africa Skills",
    slug: "siemens-stiftung-africa-skills",
    award_subcategory_slug: "technical-educator-icon",
    classification_slug: "friends-of-africa",
    country: "Germany",
    region: "Diaspora & Global Africa",
    sector: "Industrial Skills",
    impact_area: ["Vocational Training", "Industry Partnership"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Sustained vocational and industrial skills programmes embedded in African TVET institutions.",
    jury_status: "nominated",
    verification_status: "pending",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  // --- Philanthropy ---
  N({
    id: "ICON-PHIL-001",
    name: "Aliko Dangote Foundation — Education",
    slug: "aliko-dangote-foundation-education",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "africans-in-africa",
    country: "Nigeria",
    region: "West Africa",
    sector: "Philanthropy",
    impact_area: ["Scholarships", "School Infrastructure"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Two decades of scholarship funding and school infrastructure across West Africa.",
    jury_status: "verified",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  N({
    id: "ICON-PHIL-002",
    name: "Tony Elumelu Diaspora Education Fund",
    slug: "tony-elumelu-diaspora-education-fund",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "diaspora-africans",
    country: "United Kingdom",
    region: "Diaspora & Global Africa",
    sector: "Philanthropy",
    impact_area: ["Scholarships", "Entrepreneurship Education"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Diaspora-led education fund supporting African entrepreneurship and tertiary scholarships.",
    jury_status: "nominated",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
  N({
    id: "ICON-PHIL-003",
    name: "Bill & Melinda Gates Foundation — Africa Education",
    slug: "gates-foundation-africa-education",
    award_subcategory_slug: "education-philanthropy-icon",
    classification_slug: "friends-of-africa",
    country: "United States",
    region: "Diaspora & Global Africa",
    sector: "Global Philanthropy",
    impact_area: ["Literacy", "EdTech", "Teacher Development"],
    years_of_contribution: "2006–2026",
    impact_summary:
      "Sustained multi-billion-dollar investment in African literacy, EdTech, and teacher development.",
    jury_status: "nominated",
    verification_status: "verified",
    image_url: "/placeholder.svg",
    nomination_year: 2026,
  }),
];

// ---------- Selectors ----------
export const getSubcategory = (slug: string): IconSubcategory | undefined =>
  ICON_SUBCATEGORIES.find((s) => s.slug === slug);

export const getClassification = (slug: string): IconClassification | undefined =>
  ICON_CLASSIFICATIONS.find((c) => c.slug === slug);

export const bySubcategory = (sub: IconSubcategorySlug): IconNominee[] =>
  ICON_NOMINEES.filter((n) => n.award_subcategory_slug === sub);

export const byClassification = (
  sub: IconSubcategorySlug,
  cls: IconClassificationSlug
): IconNominee[] =>
  ICON_NOMINEES.filter(
    (n) => n.award_subcategory_slug === sub && n.classification_slug === cls
  );

export const featured = (
  sub: IconSubcategorySlug,
  cls?: IconClassificationSlug,
  n = 3
): IconNominee[] => {
  const pool = cls ? byClassification(sub, cls) : bySubcategory(sub);
  return pool.slice(0, n);
};

export const getIconNominee = (slug: string): IconNominee | undefined =>
  ICON_NOMINEES.find((n) => n.slug === slug);

export const classificationUrl = (
  sub: IconSubcategorySlug,
  cls: IconClassificationSlug
) => `/nominees/africa-education-icon-award/${sub}/${cls}`;

export const subcategoryUrl = (sub: IconSubcategorySlug) =>
  `/nominees/africa-education-icon-award/${sub}`;

export const profileUrl = (slug: string) => `/nominee/${slug}`;
