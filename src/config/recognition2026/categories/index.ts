// Registry of the 18 NESA-Africa 2026 award categories.
// Each entry is the single source of truth for its dedicated page and form.
// Phase 1: metadata + subcategory list + geography model. Form schemas land in Phase 4.

import type { TierSlug } from "../tiers";
import type { GeographyModel } from "../geographyModels";
import type { NomineeType } from "../nomineeTypes";

export interface SubcategoryDef {
  code: string;
  name: string;
  description: string;
  nomineeTypes: NomineeType[];
  geography?: string;
  evidenceSummary: string;
}

export interface CategoryDefinition {
  slug: string;                 // dedicated URL slug under its tier
  tier: TierSlug;
  code: string;                 // used in reference numbers (NESA-2026-{CODE}-000001)
  name: string;
  shortName: string;
  summary: string;              // hero + meta description
  overview: string;             // section 3 body
  nomineeTypes: NomineeType[];
  geographyModel: GeographyModel;
  subcategories: SubcategoryDef[];
  eligibility: string[];
  evidenceRequired: string[];
  exclusions?: string[];
  reviewRoute: string[];
  openingDate: string;          // ISO
  closingDate: string;          // ISO
  seo: { title: string; description: string };
}

const OPEN = "2026-08-01T00:00:00Z";
const CLOSE = "2026-09-12T23:59:59Z";

const COMMON_ELIGIBILITY = [
  "Nominee's contribution must fall within the recognised eligibility period.",
  "Nominee must be a real, identifiable person, organisation or public body.",
  "All submitted evidence must be verifiable and lawfully obtained.",
  "No sponsorship, donation, wallet activity or public popularity may influence the outcome.",
];

// ---------- Tier 1 · Africa Education Icon ----------
const ICON: CategoryDefinition = {
  slug: "africa-education-icon-award",
  tier: "africa-education-icon",
  code: "ICON",
  name: "Africa Education Icon Award 2006–2026",
  shortName: "Africa Education Icon Award",
  summary:
    "Lifetime continental recognition for Education Enablers whose sustained work (2006–2026) has transformed learning across Africa and the Diaspora.",
  overview:
    "The Africa Education Icon Award recognises individuals whose lifetime contribution has visibly and enduringly shifted the education landscape of Africa — through philanthropy, curriculum leadership or technical education. Nominees must demonstrate continental reach, transformed institutions or systems, and a lasting legacy independently verifiable across two decades.",
  nomineeTypes: ["individual"],
  geographyModel: "ICON_CLASSIFICATION",
  subcategories: [
    {
      code: "ICON-PHIL",
      name: "Africa Education Philanthropy Icon",
      description: "Lifetime philanthropic investment that has expanded educational access across Africa.",
      nomineeTypes: ["individual"],
      evidenceSummary: "Independently verified philanthropic records, beneficiary evidence, institutional letters.",
    },
    {
      code: "ICON-LIT",
      name: "Literary and New Curriculum Advocate Icon",
      description: "Sustained scholarly, literary or curriculum leadership that has shaped African education.",
      nomineeTypes: ["individual"],
      evidenceSummary: "Publications, curriculum adoptions, institutional endorsements, citations.",
    },
    {
      code: "ICON-TECH",
      name: "Africa Technical Education Icon",
      description: "Lifetime contribution to technical, vocational and applied education across Africa.",
      nomineeTypes: ["individual"],
      evidenceSummary: "Institutional records, programme outcomes, TVET impact evidence, references.",
    },
  ],
  eligibility: [
    ...COMMON_ELIGIBILITY,
    "Contribution period must span 2006–2026 (a minimum of 15 verifiable active years).",
    "Nominee must be classified as African in Africa, Diaspora African, or Friend of Africa.",
    "Two independent references are required.",
  ],
  evidenceRequired: [
    "Independent references (2)",
    "Institutional letters of endorsement",
    "Verified publications, reports or media coverage",
    "Beneficiary or institutional impact evidence",
    "Integrity declaration",
  ],
  reviewRoute: [
    "NRC Verification",
    "Icon Judge Assignment",
    "Independent Assessment",
    "Moderation",
    "Governance Ratification",
  ],
  openingDate: OPEN,
  closingDate: CLOSE,
  seo: {
    title: "Africa Education Icon Award 2006–2026 | NESA-Africa",
    description:
      "Nominate a verified lifetime Education Enabler for the Africa Education Icon Award across philanthropy, curriculum and technical education.",
  },
};

// ---------- Tier 2 · Influencer Education Impact ----------
const INFLUENCER: CategoryDefinition = {
  slug: "influencer-education-impact-award",
  tier: "influencer-education-impact",
  code: "INF",
  name: "Influencer Education Impact Award",
  shortName: "Influencer Education Impact",
  summary:
    "Recognition for public figures whose platforms have measurably advanced education outcomes across Africa and the Diaspora.",
  overview:
    "This award recognises public figures — social media influencers, sports icons and music icons — whose platforms have been used to mobilise verifiable education outcomes: scholarships raised, learners reached, schools supported, campaigns delivered. Follower numbers alone are not evidence.",
  nomineeTypes: ["public_figure"],
  geographyModel: "AFRICA_REGION_COUNTRY",
  subcategories: [
    {
      code: "INF-SOC",
      name: "African Social Media Influencers Education Impact",
      description: "Social media figures leveraging their platforms for education campaigns and outcomes.",
      nomineeTypes: ["public_figure"],
      evidenceSummary: "Campaign links, partner references, measurable outcomes, beneficiary evidence.",
    },
    {
      code: "INF-SPT",
      name: "African Sports Icons Supporting Education",
      description: "Sports personalities delivering verified education support to African learners.",
      nomineeTypes: ["public_figure"],
      evidenceSummary: "Foundation records, school partnerships, scholarship evidence, media coverage.",
    },
    {
      code: "INF-MUS",
      name: "African Music Icons Supporting Education",
      description: "Music icons whose platforms have mobilised verifiable education outcomes.",
      nomineeTypes: ["public_figure"],
      evidenceSummary: "Campaign evidence, partner letters, beneficiary records, financial disclosures.",
    },
  ],
  eligibility: [
    ...COMMON_ELIGIBILITY,
    "Evidence must go beyond follower counts and show verifiable education outcomes.",
    "Campaign must be documented and independently attributable to the nominee.",
  ],
  evidenceRequired: [
    "Campaign documentation and links",
    "Partner or beneficiary references",
    "Measurable education outcomes",
    "Financial disclosures for scholarships or resources mobilised",
  ],
  reviewRoute: ["NRC Impact Verification", "Governance Approval"],
  openingDate: OPEN,
  closingDate: CLOSE,
  seo: {
    title: "Influencer Education Impact Award | NESA-Africa 2026",
    description:
      "Nominate an African social media, sports or music icon whose platform has delivered measurable education outcomes across Africa.",
  },
};

// ---------- Tier 3 · Platinum Recognition (7 categories) ----------
// Note: subcategory counts per category are populated in Phase 4 (totalling 27 across the tier).
const PLATINUM: CategoryDefinition[] = [
  {
    slug: "best-tertiary-institution-library",
    tier: "platinum",
    code: "PLT-LIB",
    name: "Best Tertiary Institution Library",
    shortName: "Tertiary Institution Library",
    summary: "Recognition for tertiary libraries advancing research, learning access and inclusive scholarship in Africa.",
    overview:
      "This category recognises tertiary institution libraries whose collections, digital resources, accessibility and research support materially raise educational outcomes.",
    nomineeTypes: ["tertiary_library"],
    geographyModel: "AFRICA_REGION_COUNTRY",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Library must be attached to a recognised tertiary institution."],
    evidenceRequired: ["Institutional confirmation", "Collection and usage data", "Accessibility statement", "Research support evidence"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best Tertiary Institution Library | NESA-Africa Platinum Recognition 2026",
      description: "Nominate a tertiary institution library advancing research, access and inclusive scholarship across Africa.",
    },
  },
  {
    slug: "research-development-education",
    tier: "platinum",
    code: "PLT-RND",
    name: "Excellence in Research and Development for Education",
    shortName: "Research & Development for Education",
    summary: "Institutions or teams whose R&D has shaped education policy or practice across Africa.",
    overview: "Recognises research and development outputs adopted by policy makers or institutions to improve education outcomes.",
    nomineeTypes: ["research_institution"],
    geographyModel: "AFRICA_REGION_COUNTRY",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Research must be peer-reviewed or officially adopted."],
    evidenceRequired: ["Publications", "Policy adoption evidence", "Citations", "Adopting institution letters"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Excellence in Research and Development for Education | NESA-Africa Platinum 2026",
      description: "Nominate a research institution whose R&D outputs have shaped education policy or practice across Africa.",
    },
  },
  {
    slug: "christian-education-impact",
    tier: "platinum",
    code: "PLT-CHR",
    name: "Excellence in Christian Education Impact",
    shortName: "Christian Education Impact",
    summary: "Christian institutions and organisations delivering verified education outcomes in Africa.",
    overview: "Recognises churches, dioceses or Christian organisations whose programmes have measurably advanced education in Africa.",
    nomineeTypes: ["faith_based"],
    geographyModel: "AFRICA_REGION_COUNTRY",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must be a registered faith-based organisation.", "Safeguarding standards must be in place."],
    evidenceRequired: ["Registration", "Programme reports", "Safeguarding policy", "Beneficiary evidence"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Excellence in Christian Education Impact | NESA-Africa Platinum 2026",
      description: "Nominate a Christian institution delivering verified education outcomes across Africa.",
    },
  },
  {
    slug: "islamic-education-impact",
    tier: "platinum",
    code: "PLT-ISL",
    name: "Excellence in Islamic Education Impact",
    shortName: "Islamic Education Impact",
    summary: "Islamic institutions and organisations delivering verified education outcomes across Africa.",
    overview: "Recognises Islamic organisations whose combined faith-based and formal education programmes have measurably advanced learning outcomes.",
    nomineeTypes: ["faith_based"],
    geographyModel: "AFRICA_REGION_COUNTRY",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must be a registered faith-based organisation.", "Safeguarding standards must be in place."],
    evidenceRequired: ["Registration", "Programme reports", "Safeguarding policy", "Beneficiary evidence"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Excellence in Islamic Education Impact | NESA-Africa Platinum 2026",
      description: "Nominate an Islamic organisation delivering verified education outcomes across Africa.",
    },
  },
  {
    slug: "political-leadership-education",
    tier: "platinum",
    code: "PLT-POL",
    name: "Excellence in Political Leadership for Education",
    shortName: "Political Leadership for Education",
    summary: "Recognition for political leaders whose tenure delivered verifiable education outcomes.",
    overview: "Recognises office-holders whose policies, budgets and implementation delivered measurable education outcomes in their jurisdiction.",
    nomineeTypes: ["government"],
    geographyModel: "AFRICA_REGION_COUNTRY",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must have held official public office within the recognised period."],
    evidenceRequired: ["Official statistics", "Policy documents", "Budget records", "Independent verification"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Excellence in Political Leadership for Education | NESA-Africa Platinum 2026",
      description: "Nominate a political leader whose tenure delivered verifiable education outcomes.",
    },
  },
  {
    slug: "international-partnership-education",
    tier: "platinum",
    code: "PLT-INT",
    name: "Excellence in International Partnership for Education",
    shortName: "International Partnership for Education",
    summary: "International partners advancing verifiable education outcomes across Africa.",
    overview: "Recognises international organisations whose partnerships with African institutions have delivered documented education outcomes.",
    nomineeTypes: ["international_partner"],
    geographyModel: "INTERNATIONAL_PARTNERSHIP",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Partnership must be documented in signed agreements."],
    evidenceRequired: ["Signed agreements", "Funding disclosures", "Institutional support letters", "Official reports"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Excellence in International Partnership for Education | NESA-Africa Platinum 2026",
      description: "Nominate an international partner delivering verified education outcomes with African institutions.",
    },
  },
  {
    slug: "diaspora-educational-impact",
    tier: "platinum",
    code: "PLT-DIA",
    name: "Excellence in Diaspora Educational Impact",
    shortName: "Diaspora Educational Impact",
    summary: "Diaspora Africans and associations delivering verifiable education support to Africa.",
    overview: "Recognises diaspora individuals or associations whose funding, mentoring and knowledge transfer have measurably supported African education.",
    nomineeTypes: ["diaspora_association", "individual"],
    geographyModel: "DIASPORA_COUNTRY_IMPACT",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must be based in the Diaspora and demonstrably support education in Africa."],
    evidenceRequired: ["Partner verification", "Funding disclosures", "Programme reports", "Beneficiary evidence"],
    reviewRoute: ["Institutional Due Diligence", "NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Excellence in Diaspora Educational Impact | NESA-Africa Platinum 2026",
      description: "Nominate a Diaspora African or association delivering verifiable education support across Africa.",
    },
  },
];

// ---------- Tier 4 · Gold-Blue Garnet Recognition (9 categories) ----------
const GBG: CategoryDefinition[] = [
  {
    slug: "best-csr-education-africa",
    tier: "gold-blue-garnet",
    code: "GBG-CSR-AFR",
    name: "Best CSR for Education — Africa Regional",
    shortName: "CSR for Education (Africa Regional)",
    summary: "Corporate CSR programmes delivering verifiable education outcomes across African regions.",
    overview: "Recognises multi-country corporate CSR programmes with documented education outcomes across African regions.",
    nomineeTypes: ["corporate_organisation", "corporate_foundation"],
    geographyModel: "MULTI_COUNTRY_AFRICA",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Programme must operate in more than one African country."],
    evidenceRequired: ["Programme budget", "Independent evaluation", "Beneficiary records"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best CSR for Education — Africa Regional | NESA-Africa Gold-Blue Garnet 2026",
      description: "Nominate a corporate CSR programme delivering verified education outcomes across African regions.",
    },
  },
  {
    slug: "best-csr-education-nigeria",
    tier: "gold-blue-garnet",
    code: "GBG-CSR-NG",
    name: "Best CSR for Education — Nigeria",
    shortName: "CSR for Education (Nigeria)",
    summary: "Nigerian corporate CSR programmes with verifiable education outcomes.",
    overview: "Recognises Nigerian CSR programmes with documented education outcomes across states and geopolitical zones.",
    nomineeTypes: ["corporate_organisation", "corporate_foundation"],
    geographyModel: "NIGERIA_STATE_ZONE",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Programme must operate in Nigeria."],
    evidenceRequired: ["Programme budget", "Monitoring reports", "Beneficiary records"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best CSR for Education — Nigeria | NESA-Africa Gold-Blue Garnet 2026",
      description: "Nominate a Nigerian corporate CSR programme delivering verifiable education outcomes.",
    },
  },
  {
    slug: "best-edtech-innovation-africa",
    tier: "gold-blue-garnet",
    code: "GBG-EDT-AFR",
    name: "Best EduTech Innovation for Education — Africa Regional",
    shortName: "EduTech Innovation (Africa)",
    summary: "EdTech products with verifiable learning outcomes across African countries.",
    overview: "Recognises EdTech products with documented adoption, learning outcomes and safe data practices across African markets.",
    nomineeTypes: ["edtech_organisation"],
    geographyModel: "MULTI_COUNTRY_AFRICA",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Product must be live and serving verifiable users."],
    evidenceRequired: ["Product demo", "Active user data", "Learning outcomes", "Data protection statement"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best EduTech Innovation for Education — Africa Regional | NESA-Africa 2026",
      description: "Nominate an EdTech product with verifiable learning outcomes across African countries.",
    },
  },
  {
    slug: "best-media-education-advocacy-nigeria",
    tier: "gold-blue-garnet",
    code: "GBG-MED-NG",
    name: "Best Media Organisation for Education Advocacy — Nigeria",
    shortName: "Media Education Advocacy (Nigeria)",
    summary: "Nigerian media organisations advancing education through verifiable campaigns and coverage.",
    overview: "Recognises Nigerian media organisations whose campaigns and coverage delivered documented public or policy impact for education.",
    nomineeTypes: ["media_organisation"],
    geographyModel: "NIGERIA_STATE_ZONE",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must be a registered media organisation operating in Nigeria."],
    evidenceRequired: ["Publication links", "Reach analytics", "Public or policy impact evidence"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best Media Organisation for Education Advocacy — Nigeria | NESA-Africa 2026",
      description: "Nominate a Nigerian media organisation advancing education through verifiable campaigns and coverage.",
    },
  },
  {
    slug: "best-ngo-education-nigeria",
    tier: "gold-blue-garnet",
    code: "GBG-NGO-NG",
    name: "Best NGO for Education Advancement — Nigeria",
    shortName: "NGO for Education (Nigeria)",
    summary: "Nigerian NGOs with verifiable education programmes across states and geopolitical zones.",
    overview: "Recognises Nigerian NGOs whose programmes have delivered documented education outcomes in Nigerian states.",
    nomineeTypes: ["ngo"],
    geographyModel: "NIGERIA_STATE_ZONE",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must be a registered Nigerian NGO."],
    evidenceRequired: ["Registration", "Annual report", "Safeguarding policy", "Beneficiary records"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best NGO for Education Advancement — Nigeria | NESA-Africa 2026",
      description: "Nominate a Nigerian NGO delivering verifiable education outcomes across states and geopolitical zones.",
    },
  },
  {
    slug: "best-ngo-education-africa",
    tier: "gold-blue-garnet",
    code: "GBG-NGO-AFR",
    name: "Best NGO for Education Advancement — Africa Regional",
    shortName: "NGO for Education (Africa)",
    summary: "African NGOs with verifiable education programmes across multiple countries.",
    overview: "Recognises African NGOs whose multi-country programmes deliver documented education outcomes and safeguarding standards.",
    nomineeTypes: ["ngo"],
    geographyModel: "MULTI_COUNTRY_AFRICA",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Programme must operate in more than one African country."],
    evidenceRequired: ["Registration", "Audit", "Safeguarding policy", "Continental impact evidence"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best NGO for Education Advancement — Africa Regional | NESA-Africa 2026",
      description: "Nominate an African NGO delivering verifiable education outcomes across multiple countries.",
    },
  },
  {
    slug: "best-stem-education-programme-africa",
    tier: "gold-blue-garnet",
    code: "GBG-STEM-AFR",
    name: "Best STEM Education Programme — Africa Regional",
    shortName: "STEM Education Programme (Africa)",
    summary: "STEM programmes with verifiable learning outcomes and inclusion across Africa.",
    overview: "Recognises STEM programmes delivering documented learning outcomes and progression, with attention to girls and vulnerable learners.",
    nomineeTypes: ["programme", "ngo"],
    geographyModel: "MULTI_COUNTRY_AFRICA",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Programme must have verifiable learner enrolment and outcomes."],
    evidenceRequired: ["Curriculum", "Learner outcomes", "Equipment and laboratory evidence", "Progression records"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best STEM Education Programme — Africa Regional | NESA-Africa 2026",
      description: "Nominate a STEM programme with verifiable learning outcomes and inclusion across African countries.",
    },
  },
  {
    slug: "best-creative-arts-education-nigeria",
    tier: "gold-blue-garnet",
    code: "GBG-ART-NG",
    name: "Best Creative Arts Contribution to Education — Nigeria",
    shortName: "Creative Arts for Education (Nigeria)",
    summary: "Creative arts programmes advancing education in Nigerian schools and communities.",
    overview: "Recognises creative arts programmes whose curriculum links, learner outcomes and cultural impact advance education in Nigeria.",
    nomineeTypes: ["programme", "ngo"],
    geographyModel: "NIGERIA_STATE_ZONE",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Programme must have documented curriculum linkage."],
    evidenceRequired: ["Curriculum link", "Learner outcomes", "Performance or exhibition records"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best Creative Arts Contribution to Education — Nigeria | NESA-Africa 2026",
      description: "Nominate a creative arts programme advancing education in Nigerian schools and communities.",
    },
  },
  {
    slug: "best-education-policy-state-nigeria",
    tier: "gold-blue-garnet",
    code: "GBG-POL-NG",
    name: "Best Education Policy and Implementation State — Nigeria",
    shortName: "Education Policy State (Nigeria)",
    summary: "Nigerian states with verifiable education policy design and implementation.",
    overview: "Recognises Nigerian states whose policy, budget, infrastructure, teacher recruitment and enrolment outcomes are independently verifiable.",
    nomineeTypes: ["nigerian_state"],
    geographyModel: "NIGERIA_STATE_ZONE",
    subcategories: [],
    eligibility: [...COMMON_ELIGIBILITY, "Nominee must be a Nigerian state government."],
    evidenceRequired: ["Policy documents", "Budget records", "Enrolment and retention data", "Independent verification"],
    reviewRoute: ["NRC Verification", "Governance Approval"],
    openingDate: OPEN,
    closingDate: CLOSE,
    seo: {
      title: "Best Education Policy and Implementation State — Nigeria | NESA-Africa 2026",
      description: "Nominate a Nigerian state with verifiable education policy design and implementation.",
    },
  },
];

export const CATEGORIES: CategoryDefinition[] = [ICON, INFLUENCER, ...PLATINUM, ...GBG];

export function getCategoriesForTier(tier: TierSlug): CategoryDefinition[] {
  return CATEGORIES.filter((c) => c.tier === tier);
}

export function getCategoryByTierAndSlug(tier: TierSlug, slug: string): CategoryDefinition | undefined {
  return CATEGORIES.find((c) => c.tier === tier && c.slug === slug);
}

export function getCategoryPath(c: CategoryDefinition): string {
  return `/recognition/${c.tier}/${c.slug}`;
}
