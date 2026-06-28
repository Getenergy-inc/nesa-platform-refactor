// Content map for the unified premium award-page system.
// Every entry drives <AwardCategoryStandardPage slug=… /> rendering with the
// same visual/structural standard as /awards/africa-education-icon.

import type { Subcategory } from "@/components/awards/standard/sections";

export type AwardPageContent = {
  slug: string;
  canonicalPath: string;
  seoTitle: string;
  metaDescription: string;
  hero: {
    badge: string;
    title: string;
    titleAccent?: string;
    subhead: string;
    lead?: string;
    statsBuilder?: (counts: { nominees: number; regions: number; subcategories: number; finalists: number }) => { label: string; value: string | number }[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    trustLine?: string;
  };
  recognises: string;
  eligibility: {
    canBeNominated: string[];
    shouldNotBeNominated: string[];
    evidence?: string[];
    region?: string;
    pathway?: string;
  };
  hallFilter: {
    /** Substrings matched against MasterNominee.category (case insensitive). Empty = all. */
    categoryIncludes?: string[];
    /** Pathway filter for "Africans in Africa" / "Africans in Diaspora" / "Friends of Africa". */
    pathways?: string[];
    /** Use Icon hall-of-fame data instead of the master nominee dataset. */
    sourceIcon?: boolean;
  };
  exploreAllHref: string;
  nominateHref: string;
  subcategories: Subcategory[];
  finalCta: {
    heading?: string;
    body?: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. AFRICA EDUCATION ICON (delegates to bespoke page — kept for reference)
// ─────────────────────────────────────────────────────────────────────────────

const ICON: AwardPageContent = {
  slug: "africa-education-icon",
  canonicalPath: "/awards/africa-education-icon",
  seoTitle: "Africa Education Icon Award 2006–2026 | NESA-Africa",
  metaDescription:
    "Continental Hall of Fame for educators, advocates, and philanthropists who reshaped African learning over two decades.",
  hero: {
    badge: "Lifetime Achievement · 2006–2026",
    title: "Africa Education Icon Award",
    titleAccent: "2006–2026",
    subhead:
      "Lifetime recognition for transformational leaders whose contributions have shaped African education across generations — two decades of legacy, three classifications, one continental Hall of Fame.",
    statsBuilder: ({ nominees, subcategories, finalists }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Pathways", value: subcategories || 3 },
      { label: "Classifications", value: 3 },
      { label: "Final Laureates", value: finalists || 9 },
    ],
    primaryCta: { label: "Nominate an Education Icon", href: "/nominate?category=africa-education-icon-award" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees/africa-education-icon-award" },
    trustLine: "Jury-only · No public voting · Independent continental review",
  },
  recognises:
    "Lifetime recognition for transformational leaders whose contributions have shaped African education across generations. The Africa Education Icon Award honours individuals whose life's work — across philanthropy, curriculum reform, literacy, technical education, policy or institutional building — has lasted, scaled, and outlived a single project, classroom, or country.",
  eligibility: {
    canBeNominated: [
      "Education philanthropists with 15+ years of giving",
      "Curriculum reformers and education thinkers",
      "Literacy and reading culture leaders",
      "Technical and vocational education champions",
      "Education policy and institutional builders",
      "Africans in Africa, in the Diaspora, and Friends of Africa",
    ],
    shouldNotBeNominated: [
      "Individuals without documented long-term education impact",
      "Short-term publicity or campaign-led nominations",
      "Purely political nominations without measurable education value",
      "Academic popularity nominations with no wider continental footprint",
    ],
    evidence: [
      "Biography with verifiable citations",
      "15+ years body of education work",
      "Independent third-party endorsements",
    ],
    region: "Open continent-wide. Three classifications: Africans in Africa · Africans in the Diaspora · Friends of Africa.",
    pathway: "Three pathways: Philanthropy · Literary & Curriculum · Technical Educator.",
  },
  hallFilter: { sourceIcon: true },
  exploreAllHref: "/nominees/africa-education-icon-award",
  nominateHref: "/nominate?category=africa-education-icon-award",
  subcategories: [
    {
      slug: "education-philanthropy-icon",
      title: "Africa Education Philanthropy Icon",
      blurb: "Lifetime giving and philanthropic support that has opened education opportunities across Africa.",
      recognises: "Philanthropists, funders, and foundations",
      viewHref: "/awards/africa-education-icon/education-philanthropy-icon",
      nominateHref: "/nominate?category=africa-education-icon-award&track=philanthropy",
    },
    {
      slug: "literary-new-curriculum-advocate",
      title: "Literary & New Curriculum Advocate Icon",
      blurb: "Writers, thinkers, and curriculum advocates shaping what Africa learns.",
      recognises: "Authors, publishers, curriculum reformers",
      viewHref: "/awards/africa-education-icon/literary-new-curriculum-advocate",
      nominateHref: "/nominate?category=africa-education-icon-award&track=curriculum",
    },
    {
      slug: "technical-educator-icon",
      title: "Africa Technical Educator Icon",
      blurb: "Lifetime contributors to technical, vocational, and skills-based education.",
      recognises: "Technical educators, TVET leaders, skills champions",
      viewHref: "/awards/africa-education-icon/technical-educator-icon",
      nominateHref: "/nominate?category=africa-education-icon-award&track=technical",
    },
  ],
  finalCta: {
    heading: "Know an Education Icon?",
    body: "Nominate a lifetime contributor whose work deserves continental recognition.",
    primary: { label: "Nominate an Education Icon", href: "/nominate?category=africa-education-icon-award" },
    secondary: { label: "Explore Existing Nominees", href: "/nominees/africa-education-icon-award" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GOLD-BLUE GARNET AWARDS
// ─────────────────────────────────────────────────────────────────────────────

const GOLD_BLUE_GARNET: AwardPageContent = {
  slug: "gold-blue-garnet",
  canonicalPath: "/awards/blue-garnet",
  seoTitle: "Blue Garnet Award 2026 — Competitive Excellence | NESA-Africa",
  metaDescription:
    "Blue Garnet Award 2026: 9 competitive categories (4 Africa Regional + 5 Nigeria) recognising CSR, EduTech, NGOs, STEM, media, creative arts and education-friendly states. 60% jury + 40% public AGC voting.",
  hero: {
    badge: "Tier 1 · Blue Garnet Award · Competitive Excellence",
    title: "Blue Garnet Award",
    titleAccent: "2026",
    subhead:
      "Africa's competitive recognition for Education Enablers. Gold nominees advance to Blue Garnet, where 60% jury review combines with 40% public AGC voting to honour the corporations, NGOs, EdTech innovators, STEM programmes, media organisations, creative industries and Nigerian states delivering measurable education impact.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Main Categories", value: 9 },
      { label: "Subcategories", value: 63 },
      { label: "Vote Split", value: "60/40" },
    ],
    primaryCta: { label: "Nominate in This Category", href: "/nominate?tier=gold-blue-garnet" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees?tier=blue-garnet" },
    trustLine: "60% Jury + 40% Public AGC Voting · Voting 16 Sep – 22 Oct 2026 · Gala 22 Oct 2026, Lagos",
  },
  recognises:
    "The Blue Garnet Award recognises 9 main categories — 4 Africa Regional and 5 Nigeria-specific — celebrating corporate social responsibility, EduTech innovation, NGO impact, STEM programmes, media advocacy, creative industries and state-level education policy. Across these 9 categories sit 63 subcategories, with Nigeria CSR alone carrying 23 subcategories — the heaviest content load of any region.",
  eligibility: {
    canBeNominated: [
      "Corporations running CSR-for-Education programmes (Africa-wide or Nigeria)",
      "EdTech innovators, platforms and tools advancing African learning",
      "NGOs delivering measurable education access and outcomes",
      "STEM education programmes across Africa",
      "Nigerian media organisations championing education advocacy",
      "Nigerian creative industries (art, music, film, design) advancing education",
      "Nigerian states excelling in education policy and implementation",
    ],
    shouldNotBeNominated: [
      "Organisations with no documented education work",
      "One-off donations or photo-op campaigns without measurable impact",
      "Pure marketing claims without learner outcomes",
      "Sponsors seeking to influence judging or outcomes",
    ],
    evidence: [
      "Programme reports with learner-level outcomes",
      "Independent third-party verification or references",
      "Geographic, beneficiary and time-series impact data",
    ],
    region: "Scope: Africa Regional (4 categories — North, West, East, Central, Southern Africa) and Nigeria-specific (5 categories).",
    pathway: "Gold shortlist → NRC verification → Jury review (60%) + Public AGC voting (40%) → Honouree reveal at the Gala.",
  },
  hallFilter: {
    categoryIncludes: ["csr", "ngo", "edutech", "edtech", "stem", "media", "creative", "policy", "state"],
  },
  exploreAllHref: "/nominees?tier=blue-garnet",
  nominateHref: "/nominate?tier=gold-blue-garnet",
  subcategories: [
    {
      slug: "csr-africa",
      title: "Best CSR for Education (Africa Regional)",
      blurb: "Nominations are open for the Blue Garnet category honouring corporate social responsibility initiatives advancing education across the continent. Know a company doing the work? Nominate them now.",
      recognises: "Corporations running CSR-for-Education programmes across Africa",
      scope: "Africa Regional",
      subcategoryCount: 6,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-csr-for-education-africa-regional",
      nominateHref: "/nominate?category=best-csr-for-education-africa-regional",
    },
    {
      slug: "csr-nigeria",
      title: "Best CSR for Education (Nigeria)",
      blurb: "Calling all Nigerian corporations leading on education CSR — help us celebrate the companies investing in the nation's classrooms across 23 subcategories.",
      recognises: "Nigerian corporations advancing education through CSR",
      scope: "Nigeria",
      subcategoryCount: 23,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-csr-for-education-nigeria",
      nominateHref: "/nominate?category=best-csr-for-education-nigeria",
    },
    {
      slug: "edutech-africa",
      title: "Best EduTech Innovation for Education (Africa Regional)",
      blurb: "Is your edtech innovation transforming how Africa learns? Nominate a platform, app or tool delivering real classroom impact across the continent.",
      recognises: "EdTech platforms, apps and tools",
      scope: "Africa Regional",
      subcategoryCount: 3,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-edutech-innovation-for-education-africa-regional",
      nominateHref: "/nominate?category=best-edutech-innovation-for-education-africa-regional",
    },
    {
      slug: "media-nigeria",
      title: "Best Media Organisation for Education Advocacy (Nigeria)",
      blurb: "Which Nigerian media house is championing education in its coverage? Recognising journalism that puts learning on the front page.",
      recognises: "Nigerian broadcasters, publications and education advocacy outlets",
      scope: "Nigeria",
      subcategoryCount: 4,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-media-organisation-for-education-advocacy-nigeria",
      nominateHref: "/nominate?category=best-media-organisation-for-education-advocacy-nigeria",
    },
    {
      slug: "ngo-nigeria",
      title: "Best NGO for Education Advancement (Nigeria)",
      blurb: "Tell us which non-governmental organisation is making the biggest difference in Nigerian classrooms and communities.",
      recognises: "Nigerian NGOs advancing education access and outcomes",
      scope: "Nigeria",
      subcategoryCount: 5,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-ngo-for-education-advancement-nigeria",
      nominateHref: "/nominate?category=best-ngo-for-education-advancement-nigeria",
    },
    {
      slug: "ngo-africa",
      title: "Best NGO for Education Advancement (Africa Regional)",
      blurb: "From literacy programmes to school infrastructure, NGOs across Africa are closing the education gap. Nominate one for continental recognition.",
      recognises: "NGOs advancing inclusive education across Africa",
      scope: "Africa Regional",
      subcategoryCount: 5,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-ngo-for-education-advancement-africa-regional",
      nominateHref: "/nominate?category=best-ngo-for-education-advancement-africa-regional",
    },
    {
      slug: "stem-africa",
      title: "Best STEM Education Programme (Africa Regional)",
      blurb: "Science, technology, engineering and maths shape Africa's future workforce. Nominate an outstanding STEM initiative for continental honours.",
      recognises: "STEM schools, science programmes, coding & robotics academies",
      scope: "Africa Regional",
      subcategoryCount: 4,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-stem-education-programme-africa-regional",
      nominateHref: "/nominate?category=best-stem-education-programme-africa-regional",
    },
    {
      slug: "creative-arts-nigeria",
      title: "Best Creative Arts Contribution to Education (Nigeria)",
      blurb: "Art, music, film and design are powerful teaching tools. Nominate a Nigerian creative individual or organisation advancing education through the arts.",
      recognises: "Nigerian creative industries contributing to education",
      scope: "Nigeria",
      subcategoryCount: 7,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-creative-arts-contribution-to-education-nigeria",
      nominateHref: "/nominate?category=best-creative-arts-contribution-to-education-nigeria",
    },
    {
      slug: "policy-state-nigeria",
      title: "Best Education Policy & Implementation State (Nigeria)",
      blurb: "Which Nigerian state is getting education policy right? Recognising real implementation, not just paperwork.",
      recognises: "Nigerian state governments delivering on education policy",
      scope: "Nigeria",
      subcategoryCount: 6,
      voteSplit: "60% jury / 40% public",
      viewHref: "/awards/blue-garnet-categories/best-education-policy-and-implementation-state-nigeria",
      nominateHref: "/nominate?category=best-education-policy-and-implementation-state-nigeria",
    },
  ],
  finalCta: {
    heading: "9 categories. 63 subcategories. One continental honour.",
    body: "Nominate a corporation, NGO, EdTech innovator, STEM programme, media house, creative or Nigerian state advancing education across Africa.",
    primary: { label: "Nominate in This Category", href: "/nominate?tier=gold-blue-garnet" },
    secondary: { label: "Explore Existing Nominees", href: "/nominees?tier=blue-garnet" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PLATINUM RECOGNITION
// ─────────────────────────────────────────────────────────────────────────────

const PLATINUM: AwardPageContent = {
  slug: "platinum-recognition",
  canonicalPath: "/awards/platinum",
  seoTitle: "Platinum Award 2026 — Institutional Leadership | NESA-Africa",
  metaDescription:
    "Platinum Award 2026: 7 institutional-leadership categories spanning libraries, R&D, faith-based education, political leadership, international partnerships and diaspora impact. Jury-only recognition.",
  hero: {
    badge: "Tier 2 · Platinum Award · Institutional Leadership",
    title: "Platinum Award",
    titleAccent: "2026",
    subhead:
      "Jury-only institutional recognition for universities, libraries, research bodies, faith-based education institutions, political leaders advancing education, international partners and diaspora organisations shaping Africa's learning systems at scale.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Categories", value: 7 },
      { label: "Subcategories", value: 27 },
      { label: "Vote Mechanic", value: "Jury only" },
    ],
    primaryCta: { label: "Nominate an Institution", href: "/nominate?tier=platinum" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees?tier=platinum" },
    trustLine: "Jury-only recognition · No public vote · Platinum Recognition Show 5 July 2026",
  },
  recognises:
    "Platinum Recognition honours 7 institutional categories: tertiary libraries, R&D in education, Christian and Islamic education impact, political leadership for education, international partnerships, and diaspora educational impact. It celebrates institutions whose policies, programmes, research and leadership create measurable education impact at scale.",
  eligibility: {
    canBeNominated: [
      "Tertiary institution libraries (Nigeria)",
      "Research & development institutions advancing education (Nigeria)",
      "Christian education institutions and leaders (Africa Regional)",
      "Islamic education institutions and leaders (Africa Regional)",
      "Political leaders driving real education policy (Nigeria)",
      "International partner organisations advancing African education",
      "Diaspora organisations investing in African education",
    ],
    shouldNotBeNominated: [
      "Institutions with no documented education work",
      "Political appointments without measurable outcomes",
      "Programmes without independent verification",
    ],
    evidence: [
      "Official institutional records and reports",
      "Independently verifiable learner outcome data",
      "Policy, partnership or programme documentation",
    ],
    region: "Mix of Nigeria-specific (4), Africa Regional (2) and International (1) categories.",
    pathway: "Institutional submission → NRC verification → Jury review → Governance ratification.",
  },
  hallFilter: {
    categoryIncludes: ["library", "research", "christian", "islamic", "political", "international", "diaspora", "platinum"],
  },
  exploreAllHref: "/nominees?tier=platinum",
  nominateHref: "/nominate?tier=platinum",
  subcategories: [
    {
      slug: "library-nigeria",
      title: "Best Tertiary Institution Library (Nigeria)",
      blurb: "Libraries shape how students learn to think. Nominate a Nigerian tertiary institution for excellence in higher-education library services.",
      recognises: "Nigerian tertiary institution libraries",
      scope: "Nigeria",
      subcategoryCount: 8,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/best-tertiary-institution-library-nigeria",
      nominateHref: "/nominate?category=best-tertiary-institution-library-nigeria",
    },
    {
      slug: "research-nigeria",
      title: "Excellence in Research & Development for Education (Nigeria)",
      blurb: "Nominate a Nigerian research institution advancing education through evidence and innovation.",
      recognises: "Universities, research institutes and think-tanks",
      scope: "Nigeria",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-research-and-development-for-education-nigeria",
      nominateHref: "/nominate?category=excellence-in-research-and-development-for-education-nigeria",
    },
    {
      slug: "christian-africa",
      title: "Excellence in Christian Education Impact (Africa Regional)",
      blurb: "Faith-based institutions have shaped African education for generations. Nominate a Christian organisation or leader for continental recognition.",
      recognises: "Christian education institutions and faith leaders",
      scope: "Africa Regional",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-christian-education-impact-africa-regional",
      nominateHref: "/nominate?category=excellence-in-christian-education-impact-africa-regional",
    },
    {
      slug: "islamic-africa",
      title: "Excellence in Islamic Education Impact (Africa Regional)",
      blurb: "Nominate an Islamic institution or leader making a lasting impact on education across Africa.",
      recognises: "Islamic education institutions and faith leaders",
      scope: "Africa Regional",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-islamic-education-impact-africa-regional",
      nominateHref: "/nominate?category=excellence-in-islamic-education-impact-africa-regional",
    },
    {
      slug: "political-nigeria",
      title: "Excellence in Political Leadership for Education (Nigeria)",
      blurb: "Which Nigerian political leader has put education policy into real action? Recognising leadership backed by results, not rhetoric.",
      recognises: "Ministers, legislators and public officials",
      scope: "Nigeria",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-political-leadership-for-education-nigeria",
      nominateHref: "/nominate?category=excellence-in-political-leadership-for-education-nigeria",
    },
    {
      slug: "international-partnership",
      title: "Excellence in International Partnership for Education (Africa)",
      blurb: "International partnerships are accelerating education outcomes across Africa. Nominate a global partner organisation advancing learning on the continent.",
      recognises: "Global partner organisations supporting African education",
      scope: "Africa Regional",
      subcategoryCount: 4,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-international-partnership-for-education-africa",
      nominateHref: "/nominate?category=excellence-in-international-partnership-for-education-africa",
    },
    {
      slug: "diaspora-international",
      title: "Excellence in Diaspora Educational Impact (International)",
      blurb: "From scholarships to school-building, the diaspora is investing in African education from abroad. Nominate a diaspora organisation for institutional recognition.",
      recognises: "Diaspora organisations investing in African education",
      scope: "International",
      subcategoryCount: 3,
      voteSplit: "Jury only",
      viewHref: "/awards/platinum-certificate-categories/excellence-in-diaspora-educational-impact-international",
      nominateHref: "/nominate?category=excellence-in-diaspora-educational-impact-international",
    },
  ],
  finalCta: {
    heading: "Institutional leadership deserves Platinum recognition.",
    body: "Nominate a university, library, research centre, faith institution, political leader, international partner or diaspora organisation shaping African education at scale.",
    primary: { label: "Nominate an Institution", href: "/nominate?tier=platinum" },
    secondary: { label: "Explore Existing Nominees", href: "/nominees?tier=platinum" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. INFLUENCER EDUCATION IMPACT 2026
// ─────────────────────────────────────────────────────────────────────────────

const INFLUENCER: AwardPageContent = {
  slug: "influencer-education-impact-2026",
  canonicalPath: "/awards/influencers-education-impact-2026-recognition",
  seoTitle: "Influencers Education Impact Award 2026 | NESA-Africa",
  metaDescription:
    "Influencers Education Impact Award 2026: 3 categories honouring African social media creators, sports icons and music icons using their platforms to advance education. 100% public AGC voting.",
  hero: {
    badge: "Tier 4 · Influencers Education Impact · Gold Certificate Pathway",
    title: "Influencers Education Impact",
    titleAccent: "2026",
    subhead:
      "Celebrating African social media influencers, sports icons and music icons using their platforms to advance Education for All — funding scholarships, building schools, mentoring learners and producing learning content across Africa and the diaspora.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Categories", value: 3 },
      { label: "Vote Mechanic", value: "100% Public" },
      { label: "Currency", value: "AGC Voting Coin" },
    ],
    primaryCta: { label: "Nominate an Influencer", href: "/nominate?tier=influencer-2026" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees?tier=influencer" },
    trustLine: "100% Public AGC Voting · Nominations close 10 Jul · Voting 15 Aug – 15 Sep · Winners 16 Sep 2026",
  },
  recognises:
    "The Influencers Education Impact Award honours 3 categories — African Social Media Influencers, Sports Icons and Music Icons — whose platforms translate into measurable education action. This Gold Certificate pathway is decided entirely by public AGC voting.",
  eligibility: {
    canBeNominated: [
      "Creators, podcasters, bloggers and digital advocates producing education content",
      "African athletes, academies and sports leaders funding learning",
      "African musicians, performers, producers and music executives backing education",
      "Africans in Africa and Africans in the Diaspora",
    ],
    shouldNotBeNominated: [
      "Public figures without documented education action",
      "Brand-led marketing claims without verified outcomes",
      "One-off appearances or photo opportunities",
    ],
    evidence: [
      "Documented education programmes, scholarships or campaigns",
      "Independent third-party verification",
      "Beneficiary or programme outcome data",
    ],
    region: "Open to Africans in Africa and Africans in the Diaspora.",
    pathway: "Nomination → NRC verification → 100% Public AGC voting → Honouree reveal.",
  },
  hallFilter: {
    categoryIncludes: ["influencer", "social media", "sport", "footballer", "music", "musician"],
  },
  exploreAllHref: "/nominees?tier=influencer",
  nominateHref: "/nominate?tier=influencer-2026",
  subcategories: [
    {
      slug: "social-media",
      title: "African Social Media Influencers Education Impact Award",
      blurb: "Creators, podcasters and online educators are changing how Africa learns. Nominate a social media influencer using their platform for education.",
      recognises: "Creators, podcasters, bloggers, digital advocates",
      scope: "Africa & Diaspora",
      subcategoryCount: 1,
      voteSplit: "100% public AGC",
      viewHref: "/awards/influencers-education-impact/education-content-social-media-influencers",
      nominateHref: "/nominate?tier=influencer-2026&track=social-media",
    },
    {
      slug: "sports",
      title: "African Sports Icons Supporting Education",
      blurb: "From scholarship funds to school-building, athletes are scoring wins for education too. Nominate a sports icon or academy for continental honours.",
      recognises: "Athletes, academies, coaches, sports leaders",
      scope: "Africa & Diaspora",
      subcategoryCount: 1,
      voteSplit: "100% public AGC",
      viewHref: "/awards/influencers-education-impact/african-footballers-supporting-education",
      nominateHref: "/nominate?tier=influencer-2026&track=sports",
    },
    {
      slug: "music",
      title: "African Music Icons Supporting Education",
      blurb: "Music moves culture — and sometimes, it moves whole communities toward education. Nominate a musician or music executive backing learning.",
      recognises: "Musicians, performers, producers, music executives",
      scope: "Africa & Diaspora",
      subcategoryCount: 1,
      voteSplit: "100% public AGC",
      viewHref: "/awards/influencers-education-impact/african-musicians-supporting-education",
      nominateHref: "/nominate?tier=influencer-2026&track=music",
    },
  ],
  finalCta: {
    heading: "Recognise the influencers educating Africa.",
    body: "Nominate a creator, athlete or musician converting influence into measurable education impact across Africa and the diaspora.",
    primary: { label: "Nominate an Influencer", href: "/nominate?tier=influencer-2026" },
    secondary: { label: "Explore Existing Nominees", href: "/nominees?tier=influencer" },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry + helpers
// ─────────────────────────────────────────────────────────────────────────────

const REGISTRY: Record<string, AwardPageContent> = {
  [ICON.slug]: ICON,
  [GOLD_BLUE_GARNET.slug]: GOLD_BLUE_GARNET,
  [PLATINUM.slug]: PLATINUM,
  [INFLUENCER.slug]: INFLUENCER,
};

export function getAwardPageContent(slug: string): AwardPageContent | undefined {
  return REGISTRY[slug];
}

export const AWARD_PAGE_SLUGS = Object.keys(REGISTRY);
