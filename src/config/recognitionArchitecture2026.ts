// NESA-Africa 2026 — Recognition Architecture (Canonical Spine)
// ----------------------------------------------------------------------------
// Single source of truth for the 4-tier award structure powering:
//   • Awards mega-menu
//   • Tier landing pages (/awards/tier/:tierSlug)
//   • Category pages (/awards/:tierSlug/:categorySlug)
//   • Subcategory pages (/awards/:tierSlug/:categorySlug/:subcategorySlug)
//   • Africa Education Impact Directory filters
//
// Hierarchy: Tier → Category → Subcategory → Region → Country → Nominee
// ----------------------------------------------------------------------------

export type SelectionMethod =
  | "Jury Selected"
  | "Jury + Public Voting"
  | "Invitation / Nomination"
  | "100% Public Recognition";

export type VotingMode = "none" | "public" | "hybrid";

export interface Subcategory2026 {
  slug: string;
  name: string;
  description?: string;
}

export interface Category2026 {
  slug: string;
  name: string;
  tagline: string;
  subcategories: Subcategory2026[];
}

export interface Tier2026 {
  id: 1 | 2 | 3 | 4;
  slug: string;
  shortLabel: string;
  fullName: string;
  tagline: string;
  selectionMethod: SelectionMethod;
  votingMode: VotingMode;
  description: string;
  /** Primary tier landing page URL. */
  url: string;
  /** Sub-pages that hang off the tier. */
  subPages: { label: string; href: string }[];
  categories: Category2026[];
}

const ICON_TIER: Tier2026 = {
  id: 1,
  slug: "africa-education-icon",
  shortLabel: "Africa Education Icon",
  fullName: "Africa Education Icon Award (2006–2026)",
  tagline: "Lifetime Recognition · Jury Selected · No Public Voting",
  selectionMethod: "Jury Selected",
  votingMode: "none",
  description:
    "Recognising individuals whose lifetime contributions have transformed education across Africa and continue to influence future generations.",
  url: "/awards/africa-education-icon",
  subPages: [
    { label: "About", href: "/awards/africa-education-icon" },
    { label: "Categories", href: "/recognition/categories" },
    { label: "Existing Nominees", href: "/awards/africa-education-icon/nominees" },
    { label: "Hall of Fame", href: "/nominees/africa-education-icon-award" },
    { label: "Eligibility", href: "/about/eligibility" },
    { label: "Nominate", href: "/nominate?tier=africa-education-icon" },
  ],
  categories: [
    {
      slug: "icon-of-the-decade",
      name: "Africa Education Icon of the Decade",
      tagline: "Three lifetime subcategories across Africa, Diaspora and Friends of Africa.",
      subcategories: [
        {
          slug: "africa-education-philanthropy-icon-of-the-decade",
          name: "Africa Education Philanthropy Icon of the Decade",
        },
        {
          slug: "literary-and-new-curriculum-advocate-icon-of-the-decade",
          name: "Literary & New Curriculum Advocate Icon of the Decade",
        },
        {
          slug: "africa-technical-educator-icon-of-the-decade",
          name: "Africa Technical Educator Icon of the Decade",
        },
      ],
    },
  ],
};

const BLUE_GARNET_TIER: Tier2026 = {
  id: 2,
  slug: "gold-blue-garnet",
  shortLabel: "Gold-Blue Garnet",
  fullName: "Gold-Blue Garnet Awards",
  tagline: "Africa's Competitive Recognition · Jury + Public Voting",
  selectionMethod: "Jury + Public Voting",
  votingMode: "hybrid",
  description:
    "Competitive recognition for individuals and organisations driving measurable education impact across Africa's eight regions, the Diaspora and Friends of Africa.",
  url: "/awards/gold-blue-garnet",
  subPages: [
    { label: "Award Categories", href: "/awards/gold-blue-garnet/categories" },
    { label: "Existing Nominees", href: "/nominees" },
    { label: "Hall of Fame", href: "/nominees" },
    { label: "Judging", href: "/about/how-it-works" },
    { label: "Eligibility", href: "/about/eligibility" },
    { label: "Nominate", href: "/nominate?tier=gold-blue-garnet" },
  ],
  categories: [
    { slug: "csr-for-education", name: "CSR for Education by Organisations", tagline: "Corporate citizenship advancing African education.", subcategories: [] },
    { slug: "education-philanthropy", name: "Education Philanthropy", tagline: "Philanthropists and foundations funding learning.", subcategories: [] },
    { slug: "institutional-and-bilateral-grants", name: "Institutional & Bilateral Grants", tagline: "Multilateral and bilateral funding for education.", subcategories: [] },
    { slug: "faith-based-organisations", name: "Faith-Based Organisations Advancing Education", tagline: "Religious institutions building schools and scholarships.", subcategories: [] },
    { slug: "ngos-advancing-education", name: "NGOs Advancing Education", tagline: "Civil society organisations transforming learning.", subcategories: [] },
    { slug: "education-policy-and-government", name: "Education Policy & Government Leadership", tagline: "Public officials driving systemic reform.", subcategories: [] },
    { slug: "universities-and-higher-education", name: "Universities & Higher Education", tagline: "Continental excellence in tertiary education.", subcategories: [] },
    { slug: "tvet-and-technical-education", name: "TVET & Technical Education", tagline: "Skills, trade and technical training leaders.", subcategories: [] },
    { slug: "edtech-and-ai-innovation", name: "EdTech & AI Innovation", tagline: "Technology and AI advancing classrooms.", subcategories: [] },
    { slug: "stem-education", name: "STEM Education", tagline: "Science, technology, engineering and mathematics champions.", subcategories: [] },
    { slug: "libraries-and-knowledge-systems", name: "Libraries & Knowledge Systems", tagline: "Custodians of African knowledge.", subcategories: [] },
    { slug: "research-and-curriculum-development", name: "Research & Curriculum Development", tagline: "Researchers and curriculum architects.", subcategories: [] },
    { slug: "media-and-journalism-for-education", name: "Media & Journalism for Education", tagline: "Editorial voices amplifying education.", subcategories: [] },
    { slug: "inclusive-and-special-needs-education", name: "Inclusive & Special Needs Education", tagline: "Accessible, inclusive learning for every child.", subcategories: [] },
    { slug: "early-childhood-education", name: "Early Childhood Education", tagline: "Foundations of lifelong learning.", subcategories: [] },
    { slug: "school-transformation", name: "School Transformation", tagline: "Schools reinvented through bold leadership.", subcategories: [] },
    { slug: "skills-development-and-employability", name: "Skills Development & Employability", tagline: "Bridging learning and the world of work.", subcategories: [] },
    { slug: "regional-education-leadership", name: "Regional Education Leadership", tagline: "Honouring leaders across each African region.", subcategories: [] },
  ],
};

const PLATINUM_TIER: Tier2026 = {
  id: 3,
  slug: "platinum-recognition",
  shortLabel: "Platinum Recognition",
  fullName: "Platinum Recognition",
  tagline: "Institutional Leadership · Invitation / Nomination · Non-Competitive",
  selectionMethod: "Invitation / Nomination",
  votingMode: "none",
  description:
    "Institutional recognition honouring leadership, contribution and transformation by organisations enabling education across Africa. This tier celebrates Education Enablers and Institutional Impact — not competition.",
  url: "/awards/platinum-recognition",
  subPages: [
    { label: "Recognition Categories", href: "/recognition/categories" },
    { label: "Existing Honourees", href: "/awards/platinum-recognition" },
    { label: "Hall of Fame", href: "/nominees" },
    { label: "Eligibility", href: "/about/eligibility" },
    { label: "Recognition Process", href: "/about/how-it-works" },
  ],
  categories: [
    { slug: "international-bilateral-education-partners", name: "International Bilateral Education Partners", tagline: "Bilateral partners enabling African education.", subcategories: [] },
    { slug: "embassies-supporting-african-education", name: "Embassies Supporting African Education", tagline: "Diplomatic missions advancing learning.", subcategories: [] },
    { slug: "development-partners", name: "Development Partners", tagline: "Multilateral development institutions.", subcategories: [] },
    { slug: "un-agencies", name: "UN Agencies", tagline: "United Nations agencies enabling education.", subcategories: [] },
    { slug: "foundations", name: "Foundations", tagline: "Private and public foundations.", subcategories: [] },
    { slug: "religious-organisations", name: "Religious Organisations", tagline: "Faith-based institutional impact.", subcategories: [] },
    { slug: "corporate-foundations", name: "Corporate Foundations", tagline: "Corporate philanthropy at scale.", subcategories: [] },
    { slug: "universities", name: "Universities", tagline: "Higher-education institutional leadership.", subcategories: [] },
    { slug: "research-institutions", name: "Research Institutions", tagline: "Institutions advancing African scholarship.", subcategories: [] },
    { slug: "national-libraries", name: "National Libraries", tagline: "Custodians of national knowledge.", subcategories: [] },
    { slug: "government-ministries", name: "Government Ministries", tagline: "Ministries leading education reform.", subcategories: [] },
    { slug: "education-agencies", name: "Education Agencies", tagline: "Statutory and regulatory bodies.", subcategories: [] },
    { slug: "csr-coalitions", name: "CSR Coalitions", tagline: "Cross-sector CSR alliances.", subcategories: [] },
    { slug: "education-networks", name: "Education Networks", tagline: "Continental education networks.", subcategories: [] },
    { slug: "professional-associations", name: "Professional Associations", tagline: "Educators and professional bodies.", subcategories: [] },
    { slug: "international-ngos", name: "International NGOs", tagline: "Global NGOs serving African education.", subcategories: [] },
    { slug: "african-regional-organisations", name: "African Regional Organisations", tagline: "AU, RECs and regional bodies.", subcategories: [] },
    { slug: "diaspora-organisations", name: "Diaspora Organisations", tagline: "African diaspora networks.", subcategories: [] },
    { slug: "friends-of-africa-organisations", name: "Friends of Africa Organisations", tagline: "Global allies enabling African education.", subcategories: [] },
    { slug: "special-recognition", name: "Special Recognition", tagline: "Honourable institutional citations.", subcategories: [] },
    { slug: "legacy-recognition", name: "Legacy Recognition", tagline: "Long-form institutional legacy.", subcategories: [] },
  ],
};

const INFLUENCER_TIER: Tier2026 = {
  id: 4,
  slug: "influencer-education-impact",
  shortLabel: "Influencer Education Impact",
  fullName: "Influencer Education Impact Award",
  tagline: "100% Public Recognition · Influence Advancing Education for All",
  selectionMethod: "100% Public Recognition",
  votingMode: "public",
  description:
    "Recognising influence that advances Education for All — across social media, sports and music. Public voting only.",
  url: "/awards/influencer-education-impact",
  subPages: [
    { label: "Social Media Education Champions", href: "/nominees/category/social-media" },
    { label: "Sports Icons Supporting Education", href: "/nominees/category/sports" },
    { label: "Music Icons Supporting Education", href: "/nominees/category/music" },
    { label: "Existing Nominees", href: "/awards/influencer-education-impact/nominees" },
    { label: "Hall of Fame", href: "/awards/influencer-education-impact/nominees" },
  ],
  categories: [
    {
      slug: "social-media",
      name: "Social Media Education Champions",
      tagline: "Creators advancing learning across digital platforms.",
      subcategories: [],
    },
    {
      slug: "sports",
      name: "Sports Icons Supporting Education",
      tagline: "Athletes using their platform for African education.",
      subcategories: [],
    },
    {
      slug: "music",
      name: "Music Icons Supporting Education",
      tagline: "Musicians championing learning, advocacy and access.",
      subcategories: [],
    },
  ],
};

export const RECOGNITION_TIERS_2026: Tier2026[] = [
  ICON_TIER,
  BLUE_GARNET_TIER,
  PLATINUM_TIER,
  INFLUENCER_TIER,
];

export function getTierBySlug(slug: string): Tier2026 | undefined {
  return RECOGNITION_TIERS_2026.find((t) => t.slug === slug);
}

export function getCategoryBySlug(
  tierSlug: string,
  categorySlug: string,
): Category2026 | undefined {
  return getTierBySlug(tierSlug)?.categories.find((c) => c.slug === categorySlug);
}

export function getSubcategoryBySlug(
  tierSlug: string,
  categorySlug: string,
  subcategorySlug: string,
): Subcategory2026 | undefined {
  return getCategoryBySlug(tierSlug, categorySlug)?.subcategories.find(
    (s) => s.slug === subcategorySlug,
  );
}

/** Top-level Awards menu items shared by the navigation layer. */
export const AWARDS_EXTRA_LINKS = [
  { label: "Africa Education Impact Directory", href: "/nominees" },
  { label: "Governance & Integrity", href: "/about/governance" },
  { label: "Eligibility & Guidelines", href: "/guidelines/nominators" },
  { label: "Voting Timeline", href: "/timeline" },
] as const;
