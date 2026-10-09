// NESA-Africa 2026 — 18 canonical nomination forms.
// Single source of truth for the /nominate hub and every category shell.
//
// Architecture (from master prompt):
//   Tier 1 — Africa Education Icon        → 1 form  (pathway dropdown, 3 options) — JUDGED
//   Tier 2 — Influencer Education Impact  → 1 form  (pathway dropdown, 3 options) — NRC-verified
//   Tier 3 — Platinum Certificates        → 7 forms (one per category)           — NRC-verified
//   Tier 4 — Gold-Blue Garnet Regional    → 9 forms (one per category)           — NRC-verified
//   ────────────────────────────────────────────────────────────────────────────
//   Total: 18 forms

export type TierSlug =
  | "africa-education-icon"
  | "influencer-education-impact"
  | "platinum"
  | "gold-blue-garnet";

export interface TierMeta {
  slug: TierSlug;
  order: 1 | 2 | 3 | 4;
  name: string;
  tagline: string;
  competitive: boolean;
  verificationRoute: string[];
  formsCount: number;
  hubBadge: string;
  cta: string;
}

export const TIERS_META: TierMeta[] = [
  {
    slug: "africa-education-icon",
    order: 1,
    name: "Africa Education Icon Award",
    tagline:
      "Lifetime Enablers of Education for All Across Africa, 2006–2026. The only judged tier.",
    competitive: true,
    verificationRoute: [
      "Nomination",
      "Nominee Acceptance",
      "NRC Verification",
      "Category EDI Matrix",
      "27 Independent Judges",
      "Grand Jury",
      "Governance Ratification",
      "Nine Laureates",
    ],
    formsCount: 1,
    hubBadge: "Only judged tier • 3 pathways • 3 classifications",
    cta: "Nominate an Africa Education Icon",
  },
  {
    slug: "influencer-education-impact",
    order: 2,
    name: "Influencer Education Impact Recognition",
    tagline:
      "Public-Influence Enablers of Education for All Across Africa. Non-competitive.",
    competitive: false,
    verificationRoute: [
      "Nomination",
      "Nominee Acceptance",
      "NRC Verification",
      "Category EDI Matrix",
      "Governance Approval",
      "Certificate of Recognition",
    ],
    formsCount: 1,
    hubBadge: "3 pathways • No judges • No public voting",
    cta: "Nominate an Influencer Education Enabler",
  },
  {
    slug: "platinum",
    order: 3,
    name: "Platinum Certificates of Recognition",
    tagline:
      "Institutional and Leadership Enablers of Education for All Across Africa. Non-competitive.",
    competitive: false,
    verificationRoute: [
      "Nomination",
      "Nominee Acceptance",
      "NRC Verification",
      "Category EDI Matrix",
      "Governance Approval",
      "Certificate of Recognition",
    ],
    formsCount: 7,
    hubBadge: "7 categories • NRC-verified",
    cta: "Explore Platinum Categories",
  },
  {
    slug: "gold-blue-garnet",
    order: 4,
    name: "Gold-Blue Garnet Regional Certificates of Recognition",
    tagline:
      "Organisational and Regional Enablers of Education for All Across Africa. Non-competitive.",
    competitive: false,
    verificationRoute: [
      "Nomination",
      "Nominee Acceptance",
      "NRC Verification",
      "Category EDI Matrix",
      "Governance Approval",
      "Regional Certificate of Recognition",
    ],
    formsCount: 9,
    hubBadge: "9 categories • Regional & sector-based",
    cta: "Explore Gold-Blue Garnet Categories",
  },
];

export type NomineeAudience =
  | "individual"
  | "organisation"
  | "institution"
  | "programme"
  | "government"
  | "public-figure";

export interface NominationFormMeta {
  id: string;
  tier: TierSlug;
  /** Category slug (used in the URL). For tiers 1 & 2 this matches the tier slug. */
  category: string;
  /** Full public route, e.g. /nominate/platinum/tertiary-institution-library */
  route: string;
  title: string;
  purpose: string;
  nomineeType: NomineeAudience;
  /** Number of pathway/subcategory options users can pick inside the form. */
  optionCount: number;
  /** Short human-readable selector description (shown on category card). */
  selectorLabel: string;
  /** Region-scoped? "africa" = 8 regions + diaspora, "nigeria" = zones+states. */
  regionScope?: "africa" | "nigeria";
  /** True only for Tier 1. */
  judged: boolean;
  /** Optional tags for filtering. */
  tags?: string[];
}

export const NOMINATION_FORMS: NominationFormMeta[] = [
  // ── Tier 1 ────────────────────────────────────────────────────────────────
  {
    id: "form-01",
    tier: "africa-education-icon",
    category: "africa-education-icon",
    route: "/nominate/africa-education-icon",
    title: "Africa Education Icon Award",
    purpose:
      "Lifetime recognition (2006–2026) for continental Enablers of Education for All Across Africa.",
    nomineeType: "individual",
    optionCount: 3,
    selectorLabel: "Pathway dropdown (3 options)",
    judged: true,
    tags: ["lifetime", "judged"],
  },

  // ── Tier 2 ────────────────────────────────────────────────────────────────
  {
    id: "form-02",
    tier: "influencer-education-impact",
    category: "influencer-education-impact",
    route: "/nominate/influencer-education-impact",
    title: "Influencer Education Impact Recognition",
    purpose:
      "Public-influence Enablers advancing Education for All Across Africa through social media, sports or music.",
    nomineeType: "public-figure",
    optionCount: 3,
    selectorLabel: "Pathway dropdown (3 options)",
    judged: false,
    tags: ["influence"],
  },

  // ── Tier 3 — Platinum (7) ────────────────────────────────────────────────
  {
    id: "form-03",
    tier: "platinum",
    category: "tertiary-institution-library",
    route: "/nominate/platinum/tertiary-institution-library",
    title: "Tertiary Institution Library Enablers",
    purpose: "Libraries advancing scholarship and access across African tertiary institutions.",
    nomineeType: "institution",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
  },
  {
    id: "form-04",
    tier: "platinum",
    category: "research-development",
    route: "/nominate/platinum/research-development",
    title: "Research and Development Enablers",
    purpose: "Research bodies advancing evidence, innovation and curriculum reform.",
    nomineeType: "institution",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
  },
  {
    id: "form-05",
    tier: "platinum",
    category: "christian-education-impact",
    route: "/nominate/platinum/christian-education-impact",
    title: "Christian Enablers of Education",
    purpose: "Christian institutions and missions advancing education across Africa.",
    nomineeType: "organisation",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
  },
  {
    id: "form-06",
    tier: "platinum",
    category: "islamic-education-impact",
    route: "/nominate/platinum/islamic-education-impact",
    title: "Islamic Enablers of Education",
    purpose: "Islamic institutions and foundations advancing education across Africa.",
    nomineeType: "organisation",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
  },
  {
    id: "form-07",
    tier: "platinum",
    category: "political-leadership",
    route: "/nominate/platinum/political-leadership",
    title: "Political Leadership Enablers",
    purpose: "Public officials driving systemic education reform.",
    nomineeType: "government",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
  },
  {
    id: "form-08",
    tier: "platinum",
    category: "international-partnership",
    route: "/nominate/platinum/international-partnership",
    title: "International Partnership Enablers",
    purpose: "Bilateral and multilateral partners funding African education.",
    nomineeType: "organisation",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
  },
  {
    id: "form-09",
    tier: "platinum",
    category: "diaspora-education-impact",
    route: "/nominate/platinum/diaspora-education-impact",
    title: "Diaspora Educational Impact Enablers",
    purpose: "Diaspora-led institutions supporting education across the continent.",
    nomineeType: "organisation",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    judged: false,
    tags: ["diaspora"],
  },

  // ── Tier 4 — Gold-Blue Garnet (9) ────────────────────────────────────────
  {
    id: "form-10",
    tier: "gold-blue-garnet",
    category: "africa-regional-csr",
    route: "/nominate/gold-blue-garnet/africa-regional-csr",
    title: "Africa Regional CSR Enablers",
    purpose: "Corporate citizenship advancing education across African regions.",
    nomineeType: "organisation",
    optionCount: 160,
    selectorLabel: "Region (8) + Sector (20)",
    regionScope: "africa",
    judged: false,
  },
  {
    id: "form-11",
    tier: "gold-blue-garnet",
    category: "nigeria-csr",
    route: "/nominate/gold-blue-garnet/nigeria-csr",
    title: "Nigeria CSR Enablers",
    purpose: "Corporate citizenship advancing education across Nigeria's geopolitical zones.",
    nomineeType: "organisation",
    optionCount: 138,
    selectorLabel: "Zone (6) + Sector (23)",
    regionScope: "nigeria",
    judged: false,
  },
  {
    id: "form-12",
    tier: "gold-blue-garnet",
    category: "africa-edutech",
    route: "/nominate/gold-blue-garnet/africa-edutech",
    title: "Africa EduTech Enablers",
    purpose: "EdTech organisations advancing digital learning across Africa.",
    nomineeType: "organisation",
    optionCount: 15,
    selectorLabel: "Subcategory dropdown (15 options) + region",
    regionScope: "africa",
    judged: false,
  },
  {
    id: "form-13",
    tier: "gold-blue-garnet",
    category: "nigeria-media",
    route: "/nominate/gold-blue-garnet/nigeria-media",
    title: "Nigeria Media Enablers",
    purpose: "Media organisations amplifying education across Nigeria.",
    nomineeType: "organisation",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    regionScope: "nigeria",
    judged: false,
  },
  {
    id: "form-14",
    tier: "gold-blue-garnet",
    category: "nigeria-ngo",
    route: "/nominate/gold-blue-garnet/nigeria-ngo",
    title: "Nigeria NGO Enablers",
    purpose: "NGOs advancing education across Nigeria.",
    nomineeType: "organisation",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    regionScope: "nigeria",
    judged: false,
  },
  {
    id: "form-15",
    tier: "gold-blue-garnet",
    category: "africa-regional-ngo",
    route: "/nominate/gold-blue-garnet/africa-regional-ngo",
    title: "Africa Regional NGO Enablers",
    purpose: "NGOs advancing education across African regions.",
    nomineeType: "organisation",
    optionCount: 80,
    selectorLabel: "Region (8) + Programme (10)",
    regionScope: "africa",
    judged: false,
  },
  {
    id: "form-16",
    tier: "gold-blue-garnet",
    category: "africa-stem",
    route: "/nominate/gold-blue-garnet/africa-stem",
    title: "Africa STEM Programme Enablers",
    purpose: "STEM programmes advancing science, technology and mathematics education.",
    nomineeType: "programme",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    regionScope: "africa",
    judged: false,
  },
  {
    id: "form-17",
    tier: "gold-blue-garnet",
    category: "nigeria-creative-arts",
    route: "/nominate/gold-blue-garnet/nigeria-creative-arts",
    title: "Nigeria Creative Arts Enablers",
    purpose: "Creative-arts programmes advancing education across Nigeria.",
    nomineeType: "programme",
    optionCount: 10,
    selectorLabel: "Subcategory dropdown (10 options)",
    regionScope: "nigeria",
    judged: false,
  },
  {
    id: "form-18",
    tier: "gold-blue-garnet",
    category: "nigeria-education-friendly-states",
    route: "/nominate/gold-blue-garnet/nigeria-education-friendly-states",
    title: "Nigeria Education-Friendly States Recognition",
    purpose:
      "Regional Certificate of Recognition for Nigerian states advancing education. Not a competitive ranking.",
    nomineeType: "government",
    optionCount: 12,
    selectorLabel: "Zone (6) + Impact areas (12, multi-select)",
    regionScope: "nigeria",
    judged: false,
  },
];

export function getTierMeta(slug: TierSlug): TierMeta | undefined {
  return TIERS_META.find((t) => t.slug === slug);
}

export function getFormsByTier(slug: TierSlug): NominationFormMeta[] {
  return NOMINATION_FORMS.filter((f) => f.tier === slug);
}

export function getFormByRoute(route: string): NominationFormMeta | undefined {
  return NOMINATION_FORMS.find((f) => f.route === route);
}

export function getFormByTierAndCategory(
  tier: TierSlug,
  category: string,
): NominationFormMeta | undefined {
  return NOMINATION_FORMS.find((f) => f.tier === tier && f.category === category);
}

/** Classifications shown in every form. */
export const CLASSIFICATIONS = [
  {
    id: "african-in-africa",
    label: "African in Africa",
    description:
      "An African individual or African-led organisation based and operating primarily within Africa.",
  },
  {
    id: "diaspora-african",
    label: "Diaspora African",
    description:
      "An African individual or African-led organisation based outside Africa whose work supports education across the continent.",
  },
  {
    id: "friend-of-africa",
    label: "Friend of Africa",
    description:
      "A non-African individual, organisation or institution making a verified contribution to education in Africa.",
  },
] as const;
