// Canonical registry for every NESA-Africa 2026 subcategory page.
//
// Single source of truth for:
//   - Flat slugs used at /nominees/:slug (resolver in App.tsx)
//   - SEO titles + descriptions for the dynamic SubcategoryLandingPage
//   - Tier / parent category / scope mapping
//   - Nominate deep-link generation
//   - Regional permutations (subSlug × 8 Africa regions)
//
// Spec source: user master document "4 Recognition Tiers" + "Africa Regional
// Subcategory Links" + "All 27 CSR for Education Subcategories".

export type RecognitionTier = "icon" | "blue-garnet" | "platinum" | "influencer";
export type Scope = "africa" | "nigeria" | "international" | "africa-regional" | "global";

export interface SubcategoryEntry {
  /** Flat URL slug — unique across the entire registry. */
  slug: string;
  /** SEO <title> + page H1. */
  title: string;
  /** Short label for cards / breadcrumbs (defaults to title). */
  shortLabel?: string;
  /** 1–3 sentence page description. Doubles as meta description. */
  description: string;
  /** Tier this subcategory belongs to. */
  tier: RecognitionTier;
  /** Parent main-category display name. */
  parentCategory: string;
  /** Parent main-category slug (matches existing recognition architecture). */
  parentCategorySlug: string;
  /** Geographic scope. */
  scope: Scope;
  /** Nominate URL query — appended to /nominate?...  */
  nominateQuery: string;
  /** Whether this is a regional permutation (auto-generated). */
  isRegional?: boolean;
  /** Region slug if isRegional. */
  regionSlug?: AfricaRegionSlug;
  /** Region display name if isRegional. */
  regionName?: string;
  /** Base subcategory slug this regional permutation derives from. */
  baseSlug?: string;
}

export type AfricaRegionSlug =
  | "west-africa"
  | "east-africa"
  | "central-africa"
  | "southern-africa"
  | "north-africa"
  | "horn-africa"
  | "sahel"
  | "indian-ocean-islands";

export const AFRICA_REGIONS_8: { slug: AfricaRegionSlug; name: string }[] = [
  { slug: "west-africa", name: "West Africa" },
  { slug: "east-africa", name: "East Africa" },
  { slug: "central-africa", name: "Central Africa" },
  { slug: "southern-africa", name: "Southern Africa" },
  { slug: "north-africa", name: "North Africa" },
  { slug: "horn-africa", name: "Horn of Africa" },
  { slug: "sahel", name: "Sahel Region" },
  { slug: "indian-ocean-islands", name: "Indian Ocean Islands" },
];

// ---------------------------------------------------------------------------
// TIER 1 — Africa Education Icon Award (3 lifetime achievement subcategories)
// ---------------------------------------------------------------------------
const TIER_1: SubcategoryEntry[] = [
  {
    slug: "literary-new-curriculum-advocate-icon",
    title: "Literary & New Curriculum Advocate Icon of the Decade",
    description:
      "Recognising literary pioneers, curriculum innovators, and education advocates whose written or curricular contributions have shaped African learning for a decade or more.",
    tier: "icon",
    parentCategory: "Africa Education Icon Award",
    parentCategorySlug: "africa-education-icon",
    scope: "africa",
    nominateQuery: "category=literary-icon",
  },
  {
    slug: "africa-technical-educator-icon",
    title: "Africa Technical Educator Icon of the Decade",
    description:
      "Recognising pioneers in STEM, technical, vocational, and digital education whose work has transformed skills development across the continent.",
    tier: "icon",
    parentCategory: "Africa Education Icon Award",
    parentCategorySlug: "africa-education-icon",
    scope: "africa",
    nominateQuery: "category=technical-educator-icon",
  },
  {
    slug: "africa-education-philanthropy-icon",
    title: "Africa Education Philanthropy Icon of the Decade",
    description:
      "Recognising individuals and entities whose philanthropy has directly funded, built, or sustained educational access across Africa over the past decade.",
    tier: "icon",
    parentCategory: "Africa Education Icon Award",
    parentCategorySlug: "africa-education-icon",
    scope: "africa",
    nominateQuery: "category=philanthropy-icon",
  },
];

// ---------------------------------------------------------------------------
// TIER 2 — Blue Garnet Award
// ---------------------------------------------------------------------------

// CSR subcategories (Nigeria + Africa Regional share base slugs).
const CSR_SUBS: Array<Omit<SubcategoryEntry, "tier" | "parentCategory" | "parentCategorySlug" | "scope" | "nominateQuery">> = [
  { slug: "banking-finance-csr", title: "Best CSR for Education – Banking & Finance", description: "Recognising banks and financial institutions driving education through scholarships, school adoption programmes, digital learning centres, financial literacy initiatives, and infrastructure development across Africa." },
  { slug: "telecommunications-csr", title: "Best CSR for Education – Telecommunications", description: "Celebrating telecom companies connecting schools to the internet, donating devices, supporting digital literacy, and enabling EdTech solutions for students and teachers." },
  { slug: "oil-gas-csr", title: "Best CSR for Education – Oil & Gas", description: "Honouring oil and gas companies investing in host community schools, STEM education, scholarships, teacher training, and educational infrastructure in energy-producing regions." },
  { slug: "food-beverages-csr", title: "Best CSR for Education – Food & Beverages", description: "Recognising food and beverage companies supporting school feeding programmes, nutrition education, learning materials, and educational infrastructure development." },
  { slug: "aviation-csr", title: "Best CSR for Education – Aviation", description: "Celebrating airlines providing scholarships, aviation-related STEM education, school infrastructure support, and youth career development programmes." },
  { slug: "manufacturing-csr", title: "Best CSR for Education – Manufacturing", description: "Honouring manufacturing companies investing in technical and vocational training, school infrastructure, and STEM education for young Africans." },
  { slug: "fintech-csr", title: "Best CSR for Education – FinTech", description: "Recognising fintech companies advancing financial literacy, digital education, scholarships, and innovative learning solutions across Africa." },
  { slug: "insurance-csr", title: "Best CSR for Education – Insurance", description: "Celebrating insurance companies supporting education through scholarships, school infrastructure, financial literacy, and risk education programmes." },
  { slug: "real-estate-construction-csr", title: "Best CSR for Education – Real Estate & Construction", description: "Recognising real estate and construction companies building schools, renovating classrooms, and supporting educational infrastructure development." },
  { slug: "retail-ecommerce-csr", title: "Best CSR for Education – Retail & E-Commerce", description: "Honouring retail and e-commerce companies supporting school libraries, digital learning, scholarships, and community education initiatives." },
  { slug: "pharmaceuticals-csr", title: "Best CSR for Education – Pharmaceuticals", description: "Celebrating pharmaceutical companies advancing health education, science laboratories, scholarships, and STEM programmes in schools." },
  { slug: "conglomerates-csr", title: "Best CSR for Education – Conglomerates", description: "Recognising large conglomerates making significant multi-sector contributions to education across Africa." },
  { slug: "media-entertainment-csr", title: "Best CSR for Education – Media & Entertainment", description: "Honouring media and entertainment companies producing educational content and supporting learning initiatives." },
  { slug: "agriculture-agribusiness-csr", title: "Best CSR for Education – Agriculture & Agribusiness", description: "Celebrating agribusiness companies promoting agricultural education, school farms, and skills development in rural areas." },
  { slug: "healthcare-hospitals-csr", title: "Best CSR for Education – Health Care & Hospitals", description: "Recognising hospitals and healthcare companies supporting health education, science programmes, and school wellness initiatives." },
  { slug: "professional-services-csr", title: "Best CSR for Education – Professional Services", description: "Honouring consulting, accounting, and professional firms providing mentorship, career guidance, and educational support." },
  { slug: "microfinance-banks-csr", title: "Best CSR for Education – Microfinance Banks", description: "Recognising microfinance institutions supporting education through loans, scholarships, and financial literacy programmes." },
  { slug: "emerging-telecommunications-csr", title: "Best CSR for Education – Emerging Telecommunications", description: "Celebrating emerging telecom providers expanding internet access and digital learning opportunities in underserved areas." },
  { slug: "technology-software-csr", title: "Best CSR for Education – Technology & Software", description: "Recognising tech and software companies donating tools, training teachers, and building digital education platforms." },
  { slug: "real-estate-development-csr", title: "Best CSR for Education – Real Estate Development", description: "Honouring real estate developers constructing schools and educational facilities." },
  { slug: "commercial-retail-csr", title: "Best CSR for Education – Commercial Retail", description: "Celebrating retail chains supporting school supplies, libraries, and educational programmes." },
  { slug: "hotel-csr", title: "Best CSR for Education – Hotels", description: "Recognising hotels and hospitality groups contributing to education through scholarships and community programmes." },
  { slug: "emerging-technology-csr", title: "Best CSR for Education – Emerging Technology", description: "Honouring new technology companies supporting innovation in African education." },
];

const TIER_2: SubcategoryEntry[] = [
  // CSR — full Nigeria + Africa Regional variants share the same flat slug
  // (scope distinguished via region permutation below for regional variants).
  ...CSR_SUBS.map<SubcategoryEntry>((s) => ({
    ...s,
    tier: "blue-garnet",
    parentCategory: "Best CSR for Education",
    parentCategorySlug: "csr-for-education",
    scope: "nigeria",
    nominateQuery: `category=csr-nigeria&subcategory=${s.slug}`,
  })),

  // EduTech (Africa Regional)
  { slug: "edutech-startup", title: "Best EduTech Innovation – Startup", description: "Recognising innovative education technology startups solving learning challenges in Africa.", tier: "blue-garnet", parentCategory: "Best EduTech Innovation for Education", parentCategorySlug: "edutech-innovation", scope: "africa-regional", nominateQuery: "category=edutech&subcategory=startup" },
  { slug: "established-edutech", title: "Best EduTech Innovation – Established Company", description: "Celebrating mature EdTech companies scaling digital learning solutions across the continent.", tier: "blue-garnet", parentCategory: "Best EduTech Innovation for Education", parentCategorySlug: "edutech-innovation", scope: "africa-regional", nominateQuery: "category=edutech&subcategory=established" },
  { slug: "social-impact-edutech", title: "Best EduTech Innovation – Social Impact Initiative", description: "Honouring non-profit or hybrid EdTech initiatives focused on equity and inclusion.", tier: "blue-garnet", parentCategory: "Best EduTech Innovation for Education", parentCategorySlug: "edutech-innovation", scope: "africa-regional", nominateQuery: "category=edutech&subcategory=social-impact" },

  // Media advocacy (Nigeria)
  { slug: "print-media-advocacy", title: "Best Media Organisation for Education Advocacy – Print Media", description: "Recognising print publications driving education advocacy through investigative reporting and education-focused features.", tier: "blue-garnet", parentCategory: "Best Media Organisation for Education Advocacy", parentCategorySlug: "media-advocacy", scope: "nigeria", nominateQuery: "category=media-advocacy&subcategory=print" },
  { slug: "radio-education-advocacy", title: "Best Media Organisation for Education Advocacy – Radio Programme", description: "Celebrating radio stations and programmes amplifying education stories and learner voices.", tier: "blue-garnet", parentCategory: "Best Media Organisation for Education Advocacy", parentCategorySlug: "media-advocacy", scope: "nigeria", nominateQuery: "category=media-advocacy&subcategory=radio" },
  { slug: "television-education-advocacy", title: "Best Media Organisation for Education Advocacy – Television Content", description: "Honouring television networks producing education-centred programming and documentaries.", tier: "blue-garnet", parentCategory: "Best Media Organisation for Education Advocacy", parentCategorySlug: "media-advocacy", scope: "nigeria", nominateQuery: "category=media-advocacy&subcategory=television" },
  { slug: "digital-media-advocacy", title: "Best Media Organisation for Education Advocacy – Digital Media", description: "Recognising digital media outlets transforming the public conversation around African education.", tier: "blue-garnet", parentCategory: "Best Media Organisation for Education Advocacy", parentCategorySlug: "media-advocacy", scope: "nigeria", nominateQuery: "category=media-advocacy&subcategory=digital" },

  // NGO — Nigeria
  { slug: "ngo-infrastructure-nigeria", title: "Best NGO for Education – Infrastructure (Nigeria)", description: "Recognising NGOs building, renovating, and equipping schools and learning facilities across Nigeria.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "nigeria", nominateQuery: "category=ngo-nigeria&subcategory=infrastructure" },
  { slug: "ngo-educational-materials-nigeria", title: "Best NGO for Education – Educational Materials (Nigeria)", description: "Celebrating NGOs providing books, digital devices, uniforms, and learning materials to students and schools.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "nigeria", nominateQuery: "category=ngo-nigeria&subcategory=materials" },
  { slug: "ngo-education-aid-scholarships-nigeria", title: "Best NGO for Education – Education Aid & Scholarships (Nigeria)", description: "Honouring NGOs offering scholarships, bursaries, and direct education financial support to learners.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "nigeria", nominateQuery: "category=ngo-nigeria&subcategory=aid" },
  { slug: "youth-empowerment-ngo", title: "Best NGO for Education – Youth Empowerment (Nigeria)", description: "Recognising NGOs focused on skills development, leadership training, and entrepreneurship for young people.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "nigeria", nominateQuery: "category=ngo-nigeria&subcategory=youth" },
  { slug: "women-girls-education-ngo", title: "Best NGO for Education – Women & Girls (Nigeria)", description: "Celebrating NGOs advancing girls' education, retention, and empowerment in Nigeria.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "nigeria", nominateQuery: "category=ngo-nigeria&subcategory=women-girls" },

  // NGO — Africa Regional
  { slug: "ngo-infrastructure-africa", title: "Best NGO for Education – Infrastructure (Africa)", description: "Recognising NGOs constructing and rehabilitating schools across multiple African countries.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "africa-regional", nominateQuery: "category=ngo-africa&subcategory=infrastructure" },
  { slug: "ngo-education-aid-africa", title: "Best NGO for Education – Education Aid (Africa)", description: "Honouring NGOs providing direct education aid and emergency learning support continent-wide.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "africa-regional", nominateQuery: "category=ngo-africa&subcategory=aid" },
  { slug: "ngo-educational-materials-africa", title: "Best NGO for Education – Educational Materials (Africa)", description: "Celebrating NGOs distributing learning resources across Africa.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "africa-regional", nominateQuery: "category=ngo-africa&subcategory=materials" },
  { slug: "ngo-youth-skills-africa", title: "Best NGO for Education – Youth Skills (Africa)", description: "Recognising NGOs delivering vocational and skills training for African youth.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "africa-regional", nominateQuery: "category=ngo-africa&subcategory=youth-skills" },
  { slug: "ngo-women-girls-advocacy-africa", title: "Best NGO for Education – Women & Girls Advocacy (Africa)", description: "Honouring NGOs advocating for girls' education and gender equity across the continent.", tier: "blue-garnet", parentCategory: "Best NGO for Education Advancement", parentCategorySlug: "ngo-advancement", scope: "africa-regional", nominateQuery: "category=ngo-africa&subcategory=women-girls" },

  // STEM (Africa Regional)
  { slug: "inclusive-stem", title: "Best STEM Education Programme – Inclusive STEM", description: "Recognising STEM programmes that ensure access for all learners, including those with disabilities and from marginalised communities.", tier: "blue-garnet", parentCategory: "Best STEM Education Programme", parentCategorySlug: "stem-programme", scope: "africa-regional", nominateQuery: "category=stem&subcategory=inclusive" },
  { slug: "digital-stem-innovation", title: "Best STEM Education Programme – Digital Innovation", description: "Celebrating programmes using technology, coding, robotics, and digital tools to transform STEM learning.", tier: "blue-garnet", parentCategory: "Best STEM Education Programme", parentCategorySlug: "stem-programme", scope: "africa-regional", nominateQuery: "category=stem&subcategory=digital" },
  { slug: "community-stem-outreach", title: "Best STEM Education Programme – Community Outreach", description: "Honouring STEM initiatives reaching rural, underserved, and out-of-school children through community-based programmes.", tier: "blue-garnet", parentCategory: "Best STEM Education Programme", parentCategorySlug: "stem-programme", scope: "africa-regional", nominateQuery: "category=stem&subcategory=community" },
  { slug: "girls-in-stem", title: "Best STEM Education Programme – Girls in STEM", description: "Recognising programmes specifically designed to increase girls' participation and excellence in Science, Technology, Engineering, and Mathematics.", tier: "blue-garnet", parentCategory: "Best STEM Education Programme", parentCategorySlug: "stem-programme", scope: "africa-regional", nominateQuery: "category=stem&subcategory=girls" },

  // Creative Arts (Nigeria)
  { slug: "nollywood-educational-content", title: "Best Creative Arts – Nollywood Educational Content", description: "Recognising filmmakers and productions creating movies and series that educate, inspire, and address social issues.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=nollywood" },
  { slug: "music-industry-education", title: "Best Creative Arts – Music Industry Contribution", description: "Celebrating musicians and music organisations using songs, concerts, and campaigns to promote education.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=music" },
  { slug: "literature-artistic-works-education", title: "Best Creative Arts – Literature & Artistic Works", description: "Honouring writers, poets, and artists whose works advance education and cultural awareness.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=literature" },
  { slug: "visual-arts-education-impact", title: "Best Creative Arts – Visual Arts Impact", description: "Recognising visual artists using paintings, sculptures, and exhibitions to promote education.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=visual" },
  { slug: "performing-arts-education", title: "Best Creative Arts – Performing Arts", description: "Celebrating theatre, dance, and drama groups using performance to educate communities.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=performing" },
  { slug: "film-media-education", title: "Best Creative Arts – Film & Media", description: "Honouring documentary makers and media producers creating educational content.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=film" },
  { slug: "creative-advocacy-education", title: "Best Creative Arts – Creative Advocacy Campaigns", description: "Recognising creative campaigns using art, music, and media to advocate for education access and reform.", tier: "blue-garnet", parentCategory: "Best Creative Arts Contribution to Education", parentCategorySlug: "creative-arts", scope: "nigeria", nominateQuery: "category=creative-arts&subcategory=advocacy" },

  // Education-Friendly State (Nigeria — 6 zones)
  { slug: "north-central-education-state", title: "Best Education Policy & Implementation State – North Central", description: "Honouring a North Central state demonstrating measurable education policy outcomes.", tier: "blue-garnet", parentCategory: "Best Education Policy & Implementation State", parentCategorySlug: "education-friendly-state", scope: "nigeria", nominateQuery: "category=education-friendly-state&subcategory=north-central" },
  { slug: "north-east-education-state", title: "Best Education Policy & Implementation State – North East", description: "Honouring a North East state demonstrating measurable education policy outcomes.", tier: "blue-garnet", parentCategory: "Best Education Policy & Implementation State", parentCategorySlug: "education-friendly-state", scope: "nigeria", nominateQuery: "category=education-friendly-state&subcategory=north-east" },
  { slug: "north-west-education-state", title: "Best Education Policy & Implementation State – North West", description: "Honouring a North West state demonstrating measurable education policy outcomes.", tier: "blue-garnet", parentCategory: "Best Education Policy & Implementation State", parentCategorySlug: "education-friendly-state", scope: "nigeria", nominateQuery: "category=education-friendly-state&subcategory=north-west" },
  { slug: "south-east-education-state", title: "Best Education Policy & Implementation State – South East", description: "Honouring a South East state demonstrating measurable education policy outcomes.", tier: "blue-garnet", parentCategory: "Best Education Policy & Implementation State", parentCategorySlug: "education-friendly-state", scope: "nigeria", nominateQuery: "category=education-friendly-state&subcategory=south-east" },
  { slug: "south-south-education-state", title: "Best Education Policy & Implementation State – South South", description: "Honouring a South South state demonstrating measurable education policy outcomes.", tier: "blue-garnet", parentCategory: "Best Education Policy & Implementation State", parentCategorySlug: "education-friendly-state", scope: "nigeria", nominateQuery: "category=education-friendly-state&subcategory=south-south" },
  { slug: "south-west-education-state", title: "Best Education Policy & Implementation State – South West", description: "Honouring a South West state demonstrating measurable education policy outcomes.", tier: "blue-garnet", parentCategory: "Best Education Policy & Implementation State", parentCategorySlug: "education-friendly-state", scope: "nigeria", nominateQuery: "category=education-friendly-state&subcategory=south-west" },
];

// ---------------------------------------------------------------------------
// TIER 3 — Platinum Recognition
// ---------------------------------------------------------------------------
const TIER_3: SubcategoryEntry[] = [
  // Library
  { slug: "university-library-public", title: "Best Public University Library", description: "Recognising public university libraries providing excellent resources, digital access, and support for students and researchers.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=university-public" },
  { slug: "university-library-private", title: "Best Private University Library", description: "Recognising private university libraries delivering exemplary research and learning environments.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=university-private" },
  { slug: "polytechnic-library-public", title: "Best Public Polytechnic Library", description: "Celebrating public polytechnic libraries advancing technical and vocational learning.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=polytechnic-public" },
  { slug: "polytechnic-library-private", title: "Best Private Polytechnic Library", description: "Celebrating private polytechnic libraries advancing technical and vocational learning.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=polytechnic-private" },
  { slug: "college-of-education-library-public", title: "Best Public College of Education Library", description: "Recognising public college of education libraries equipping the next generation of teachers.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=coe-public" },
  { slug: "college-of-education-library-private", title: "Best Private College of Education Library", description: "Recognising private college of education libraries equipping the next generation of teachers.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=coe-private" },
  { slug: "college-of-nursing-library-public", title: "Best Public College of Nursing Library", description: "Honouring public college of nursing libraries supporting clinical training and research.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=nursing-public" },
  { slug: "college-of-nursing-library-private", title: "Best Private College of Nursing Library", description: "Honouring private college of nursing libraries supporting clinical training and research.", tier: "platinum", parentCategory: "Best Tertiary Institution Library", parentCategorySlug: "tertiary-library", scope: "nigeria", nominateQuery: "category=tertiary-library&subcategory=nursing-private" },

  // R&D
  { slug: "agricultural-research-institute", title: "Best Agricultural Research Institute", description: "Celebrating agricultural research institutes translating science into food security and farmer education.", tier: "platinum", parentCategory: "Excellence in Research & Development for Education", parentCategorySlug: "research-excellence", scope: "nigeria", nominateQuery: "category=research-excellence&subcategory=agricultural" },
  { slug: "pharmaceutical-research-institute", title: "Best Pharmaceutical & Drug Research Institute", description: "Recognising pharmaceutical research institutes advancing pharmacology and health-sciences education.", tier: "platinum", parentCategory: "Excellence in Research & Development for Education", parentCategorySlug: "research-excellence", scope: "nigeria", nominateQuery: "category=research-excellence&subcategory=pharmaceutical" },
  { slug: "environmental-research-institute", title: "Best Environmental & Ecological Research Institute", description: "Honouring environmental research institutes producing climate, ecology and sustainability education outcomes.", tier: "platinum", parentCategory: "Excellence in Research & Development for Education", parentCategorySlug: "research-excellence", scope: "nigeria", nominateQuery: "category=research-excellence&subcategory=environmental" },

  // Christian
  { slug: "christian-education-infrastructure", title: "Christian Education – Educational Infrastructure Development", description: "Recognising Christian organisations building schools, classrooms, and learning facilities.", tier: "platinum", parentCategory: "Excellence in Christian Education Impact", parentCategorySlug: "christian-education-impact", scope: "africa-regional", nominateQuery: "category=christian-education&subcategory=infrastructure" },
  { slug: "christian-scholarship-program", title: "Christian Education – Scholarship Program", description: "Celebrating Christian scholarship programmes funding students across Africa.", tier: "platinum", parentCategory: "Excellence in Christian Education Impact", parentCategorySlug: "christian-education-impact", scope: "africa-regional", nominateQuery: "category=christian-education&subcategory=scholarship" },
  { slug: "christian-holistic-support", title: "Christian Education – Holistic Educational Support", description: "Honouring Christian organisations providing wraparound educational support to learners.", tier: "platinum", parentCategory: "Excellence in Christian Education Impact", parentCategorySlug: "christian-education-impact", scope: "africa-regional", nominateQuery: "category=christian-education&subcategory=holistic" },
  { slug: "christian-education-advocacy", title: "Christian Education – Advocacy for Reforms & Awareness Campaigns", description: "Recognising Christian-led advocacy advancing education policy reform and access.", tier: "platinum", parentCategory: "Excellence in Christian Education Impact", parentCategorySlug: "christian-education-impact", scope: "africa-regional", nominateQuery: "category=christian-education&subcategory=advocacy" },

  // Islamic
  { slug: "islamic-education-infrastructure", title: "Islamic Education – Educational Infrastructure Development", description: "Recognising Islamic organisations building schools, classrooms, and learning facilities.", tier: "platinum", parentCategory: "Excellence in Islamic Education Impact", parentCategorySlug: "islamic-education-impact", scope: "africa-regional", nominateQuery: "category=islamic-education&subcategory=infrastructure" },
  { slug: "islamic-scholarship-program", title: "Islamic Education – Scholarship Program", description: "Celebrating Islamic scholarship programmes funding students across Africa.", tier: "platinum", parentCategory: "Excellence in Islamic Education Impact", parentCategorySlug: "islamic-education-impact", scope: "africa-regional", nominateQuery: "category=islamic-education&subcategory=scholarship" },
  { slug: "islamic-holistic-support", title: "Islamic Education – Holistic Educational Support", description: "Honouring Islamic organisations providing wraparound educational support to learners.", tier: "platinum", parentCategory: "Excellence in Islamic Education Impact", parentCategorySlug: "islamic-education-impact", scope: "africa-regional", nominateQuery: "category=islamic-education&subcategory=holistic" },
  { slug: "islamic-education-advocacy", title: "Islamic Education – Advocacy for Reforms & Awareness Campaigns", description: "Recognising Islamic-led advocacy advancing education policy reform and access.", tier: "platinum", parentCategory: "Excellence in Islamic Education Impact", parentCategorySlug: "islamic-education-impact", scope: "africa-regional", nominateQuery: "category=islamic-education&subcategory=advocacy" },

  // Political
  { slug: "political-scholarship-program", title: "Political Leadership – Outstanding Scholarship Program", description: "Honouring political leaders running outstanding scholarship programmes (vocational & formal).", tier: "platinum", parentCategory: "Excellence in Political Leadership for Education", parentCategorySlug: "political-leadership", scope: "nigeria", nominateQuery: "category=political-leadership&subcategory=scholarship" },
  { slug: "political-infrastructure-development", title: "Political Leadership – Infrastructure Development & Donations", description: "Recognising political leaders driving exemplary education infrastructure and donations.", tier: "platinum", parentCategory: "Excellence in Political Leadership for Education", parentCategorySlug: "political-leadership", scope: "nigeria", nominateQuery: "category=political-leadership&subcategory=infrastructure" },
  { slug: "political-education-advocacy", title: "Political Leadership – Advocacy & Policy Development", description: "Celebrating political leaders shaping advocacy and policy development for education.", tier: "platinum", parentCategory: "Excellence in Political Leadership for Education", parentCategorySlug: "political-leadership", scope: "nigeria", nominateQuery: "category=political-leadership&subcategory=advocacy" },

  // International
  { slug: "international-embassy-contribution", title: "Best International Embassy Contribution to Education", description: "Recognising embassies funding scholarships, cultural exchanges, and school partnerships across Africa.", tier: "platinum", parentCategory: "Excellence in International Partnership for Education", parentCategorySlug: "international-partnership", scope: "international", nominateQuery: "category=international-partnership&subcategory=embassy" },
  { slug: "bilateral-education-support", title: "Best Bilateral Organization Education Support", description: "Honouring bilateral organisations channelling sustained education support into Africa.", tier: "platinum", parentCategory: "Excellence in International Partnership for Education", parentCategorySlug: "international-partnership", scope: "international", nominateQuery: "category=international-partnership&subcategory=bilateral" },
  { slug: "international-ngo-education", title: "Best International NGO Education Support", description: "Recognising international NGOs delivering measurable education outcomes across Africa.", tier: "platinum", parentCategory: "Excellence in International Partnership for Education", parentCategorySlug: "international-partnership", scope: "international", nominateQuery: "category=international-partnership&subcategory=ingo" },
  { slug: "global-education-grant", title: "Best Educational Grant-Giving Organization", description: "Celebrating global grant-giving organisations financing education projects across Africa.", tier: "platinum", parentCategory: "Excellence in International Partnership for Education", parentCategorySlug: "international-partnership", scope: "international", nominateQuery: "category=international-partnership&subcategory=grant" },
  { slug: "international-airline-education", title: "Best International Airline Education Support", description: "Honouring international airlines investing in education through scholarships and STEM programmes.", tier: "platinum", parentCategory: "Excellence in International Partnership for Education", parentCategorySlug: "international-partnership", scope: "international", nominateQuery: "category=international-partnership&subcategory=airline" },
  { slug: "international-leadership-training", title: "Best International Leadership/Training Organization", description: "Recognising international leadership and training organisations developing African talent.", tier: "platinum", parentCategory: "Excellence in International Partnership for Education", parentCategorySlug: "international-partnership", scope: "international", nominateQuery: "category=international-partnership&subcategory=leadership" },

  // Diaspora
  { slug: "diaspora-association-partnership", title: "Diaspora Association Educational Partnership", description: "Celebrating diaspora associations (e.g. NIDO, alumni groups) channelling collective resources into schools, scholarships, and digital learning back home.", tier: "platinum", parentCategory: "Excellence in Diaspora Educational Impact", parentCategorySlug: "diaspora-impact", scope: "international", nominateQuery: "category=diaspora-impact&subcategory=association" },
  { slug: "outstanding-diaspora-champion", title: "Outstanding Individual Diaspora Education Champion", description: "Recognising individual diaspora champions delivering sustained education impact across Africa.", tier: "platinum", parentCategory: "Excellence in Diaspora Educational Impact", parentCategorySlug: "diaspora-impact", scope: "international", nominateQuery: "category=diaspora-impact&subcategory=individual" },
  { slug: "diaspora-institutional-development", title: "Diaspora-Led Institutional Development & Capacity-Building", description: "Honouring diaspora-led institutional development and capacity-building initiatives.", tier: "platinum", parentCategory: "Excellence in Diaspora Educational Impact", parentCategorySlug: "diaspora-impact", scope: "international", nominateQuery: "category=diaspora-impact&subcategory=institutional" },
  { slug: "diaspora-philanthropy-csr", title: "Diaspora Philanthropy & CSR Impact", description: "Celebrating diaspora philanthropy and CSR delivering measurable African education outcomes.", tier: "platinum", parentCategory: "Excellence in Diaspora Educational Impact", parentCategorySlug: "diaspora-impact", scope: "international", nominateQuery: "category=diaspora-impact&subcategory=philanthropy" },
  { slug: "diaspora-digital-innovation", title: "Diaspora Digital Education Innovation", description: "Recognising diaspora-led digital innovation expanding education access and quality across Africa.", tier: "platinum", parentCategory: "Excellence in Diaspora Educational Impact", parentCategorySlug: "diaspora-impact", scope: "international", nominateQuery: "category=diaspora-impact&subcategory=digital" },
];

// ---------------------------------------------------------------------------
// TIER 4 — Influencers Education Impact (100% public vote)
// ---------------------------------------------------------------------------
const TIER_4: SubcategoryEntry[] = [
  {
    slug: "social-media-education-influencers",
    title: "African Social Media Influencers Education Impact Award",
    description: "Recognising digital creators and influencers advancing education through social media content, campaigns, and learner mobilisation across Africa.",
    tier: "influencer",
    parentCategory: "Influencers Education Impact Award",
    parentCategorySlug: "influencers-education-impact",
    scope: "africa",
    nominateQuery: "category=social-media-influencers",
  },
  {
    slug: "sports-icons-education",
    title: "African Sports Icons Supporting Education",
    description: "Celebrating athletes and sports organisations using sport as a tool for education — scholarships, school building, and youth development.",
    tier: "influencer",
    parentCategory: "Influencers Education Impact Award",
    parentCategorySlug: "influencers-education-impact",
    scope: "africa",
    nominateQuery: "category=sports-icons",
  },
  {
    slug: "music-icons-education",
    title: "African Music Icons Supporting Education",
    description: "Honouring musicians and music industry leaders promoting education awareness, scholarships, and educational campaigns.",
    tier: "influencer",
    parentCategory: "Influencers Education Impact Award",
    parentCategorySlug: "influencers-education-impact",
    scope: "africa",
    nominateQuery: "category=music-icons",
  },
];

// ---------------------------------------------------------------------------
// Africa-Regional permutations: every africa-regional subcategory × 8 regions.
// Produces flat slugs like `csr-banking-finance-west-africa`.
// (Spec uses "csr-banking-finance-<region>" naming, but for the broader set we
// follow the same pattern: <baseSlug>-<regionSlug>.)
// ---------------------------------------------------------------------------
function buildRegionalPermutations(base: SubcategoryEntry[]): SubcategoryEntry[] {
  const regionalBases = base.filter((e) => e.scope === "africa-regional");
  const out: SubcategoryEntry[] = [];
  for (const b of regionalBases) {
    for (const region of AFRICA_REGIONS_8) {
      out.push({
        slug: `${b.slug}-${region.slug}`,
        title: `${b.title} — ${region.name}`,
        description: `${b.description} This recognition is scoped to ${region.name}.`,
        tier: b.tier,
        parentCategory: b.parentCategory,
        parentCategorySlug: b.parentCategorySlug,
        scope: "africa-regional",
        nominateQuery: `${b.nominateQuery}&region=${region.slug}`,
        isRegional: true,
        regionSlug: region.slug,
        regionName: region.name,
        baseSlug: b.slug,
      });
    }
  }
  return out;
}

const ALL_BASE = [...TIER_1, ...TIER_2, ...TIER_3, ...TIER_4];
const ALL_REGIONAL = buildRegionalPermutations(ALL_BASE);

export const SUBCATEGORY_REGISTRY: SubcategoryEntry[] = [...ALL_BASE, ...ALL_REGIONAL];

// O(1) lookup
const REGISTRY_BY_SLUG = new Map(SUBCATEGORY_REGISTRY.map((e) => [e.slug, e]));

export function getSubcategoryBySlug(slug: string): SubcategoryEntry | undefined {
  return REGISTRY_BY_SLUG.get(slug);
}

export function isRegisteredSubcategorySlug(slug: string): boolean {
  return REGISTRY_BY_SLUG.has(slug);
}

export function listSubcategoriesByTier(tier: RecognitionTier): SubcategoryEntry[] {
  return SUBCATEGORY_REGISTRY.filter((e) => e.tier === tier && !e.isRegional);
}

export function listRegionalVariants(baseSlug: string): SubcategoryEntry[] {
  return SUBCATEGORY_REGISTRY.filter((e) => e.baseSlug === baseSlug);
}

export function listSiblingSubcategories(slug: string): SubcategoryEntry[] {
  const me = REGISTRY_BY_SLUG.get(slug);
  if (!me) return [];
  return SUBCATEGORY_REGISTRY.filter(
    (e) => e.parentCategorySlug === me.parentCategorySlug && e.slug !== slug && !e.isRegional,
  );
}

export const TIER_LABELS: Record<RecognitionTier, string> = {
  icon: "Africa Education Icon Award",
  "blue-garnet": "Blue Garnet Award",
  platinum: "Platinum Recognition",
  influencer: "Influencers Education Impact Award",
};
