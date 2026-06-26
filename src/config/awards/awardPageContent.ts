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
      "Two decades. Three pathways. Nine laureates. A continental Hall of Fame for the educators, advocates, and philanthropists who reshaped African learning.",
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
    "This award recognises individuals whose lifetime work — across philanthropy, curriculum advocacy, technical education, policy reform, or institutional building — has shaped how Africa learns. It honours legacy, not novelty: people whose contribution to African education has lasted, scaled, and outlived a single project, classroom, or country.",
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
  seoTitle: "Gold-Blue Garnet Awards 2026 | NESA-Africa",
  metaDescription:
    "Africa's competitive recognition for education excellence — companies, NGOs, EdTech innovators, faith-based programmes, and STEM leaders, judged by independent jury and amplified by public participation.",
  hero: {
    badge: "Gold-Blue Garnet Awards · Competitive Recognition",
    title: "Gold-Blue Garnet Awards",
    titleAccent: "2026",
    subhead:
      "Competitive continental recognition for companies, NGOs, EdTech innovators, STEM programmes, and faith-based education leaders driving measurable education impact across Africa.",
    statsBuilder: ({ nominees, regions, subcategories }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Regions", value: regions },
      { label: "Subcategories", value: subcategories },
      { label: "Final Honourees", value: "Per category" },
    ],
    primaryCta: { label: "Nominate in This Category", href: "/nominate?tier=gold-blue-garnet" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees?tier=blue-garnet" },
    trustLine: "Jury review + verified public participation · Independent NRC verification",
  },
  recognises:
    "This award recognises organisations, companies, and programmes whose work has created measurable education impact through funding, innovation, advocacy, infrastructure, inclusion, technology, or community action across Africa.",
  eligibility: {
    canBeNominated: [
      "Companies running education-focused CSR programmes",
      "NGOs advancing education access and equity",
      "EdTech startups and digital learning platforms",
      "STEM education programmes",
      "Faith-based education initiatives (Christian & Islamic)",
      "Corporate foundations and public-private partnerships",
    ],
    shouldNotBeNominated: [
      "Organisations with no documented education work",
      "One-off donations without measurable impact",
      "Pure marketing campaigns without learner outcomes",
      "Sponsors seeking to influence judging or outcomes",
    ],
    evidence: [
      "Programme reports with learner-level outcomes",
      "Independent verification or third-party references",
      "Geographic and time-series impact data",
    ],
    region: "Africa Regional categories cover North, West, East, Central, and Southern Africa.",
    pathway: "Competitive: NRC-verified shortlist → Jury review → Public participation → Honouree reveal.",
  },
  hallFilter: {
    categoryIncludes: ["csr", "ngo", "edutech", "edtech", "stem", "faith", "christian", "islamic"],
  },
  exploreAllHref: "/nominees?tier=blue-garnet",
  nominateHref: "/nominate?tier=gold-blue-garnet",
  subcategories: [
    { slug: "csr", title: "Best CSR for Education in Africa", blurb: "Companies whose CSR programmes improve education outcomes across the continent.", recognises: "Banks, telecoms, energy, manufacturing, corporate foundations", viewHref: "/awards/blue-garnet-categories/best-csr-for-education-africa-regional", nominateHref: "/nominate?pillar=csr-for-education" },
    { slug: "edutech", title: "Best EduTech Innovation for Education", blurb: "Digital platforms, tools, and innovators transforming how Africa learns.", recognises: "EdTech startups, learning platforms, AI tools", viewHref: "/awards/blue-garnet-categories/best-edutech-innovation-for-education-africa-regional", nominateHref: "/nominate?pillar=edtech-stem&track=edtech" },
    { slug: "ngo", title: "Best NGO for Education Advancement", blurb: "NGOs advancing education access, equity, and outcomes across Africa.", recognises: "Non-profits and education foundations", viewHref: "/awards/blue-garnet-categories/best-ngo-for-education-advancement-africa-regional", nominateHref: "/nominate?pillar=ngo-education" },
    { slug: "stem", title: "Best STEM Education Programme", blurb: "STEM programmes preparing African learners for science, technology, and innovation.", recognises: "STEM schools, science programmes, coding/robotics academies", viewHref: "/awards/blue-garnet-categories/best-stem-education-programme-africa-regional", nominateHref: "/nominate?pillar=edtech-stem&track=stem" },
    { slug: "christian-faith", title: "Excellence in Christian Education Impact", blurb: "Christian-led education programmes creating learner outcomes across Africa.", recognises: "Schools, missions, and faith-based programmes", viewHref: "/awards/blue-garnet-categories/excellence-in-christian-education-impact-africa-regional", nominateHref: "/nominate?pillar=faith&track=christian" },
    { slug: "islamic-faith", title: "Excellence in Islamic Education Impact", blurb: "Islamic-led education programmes creating learner outcomes across Africa.", recognises: "Schools, madrassas, and faith-based programmes", viewHref: "/awards/blue-garnet-categories/excellence-in-islamic-education-impact-africa-regional", nominateHref: "/nominate?pillar=faith&track=islamic" },
  ],
  finalCta: {
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
  seoTitle: "Platinum Recognition 2026 | NESA-Africa",
  metaDescription:
    "Institutional Platinum Recognition for governments, ministries, universities, and continental institutions advancing African education systems.",
  hero: {
    badge: "Platinum Recognition · Institutional Leadership",
    title: "Platinum Recognition",
    titleAccent: "2026",
    subhead:
      "Honouring governments, ministries, universities, and continental institutions whose policy, leadership, or systems work is advancing education for all across Africa.",
    statsBuilder: ({ nominees, regions, subcategories }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Regions", value: regions },
      { label: "Subcategories", value: subcategories },
      { label: "Final Honourees", value: "Per institution type" },
    ],
    primaryCta: { label: "Nominate in This Category", href: "/nominate?tier=platinum" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees?tier=platinum" },
    trustLine: "Institutional review · Independent jury · Audit-logged decisions",
  },
  recognises:
    "This recognition honours institutions whose policies, programmes, and systems have created measurable education impact at scale — improving access, quality, equity, infrastructure, governance, or learner outcomes across communities, regions, or countries.",
  eligibility: {
    canBeNominated: [
      "Government ministries and education agencies",
      "Universities and tertiary institutions",
      "Continental and regional education bodies",
      "Public-sector education programmes with documented outcomes",
      "Education-friendly states, governors, and policy leaders",
    ],
    shouldNotBeNominated: [
      "Institutions with no documented education work",
      "Political appointments without measurable outcomes",
      "Programmes without independent verification",
    ],
    evidence: [
      "Official institutional records and reports",
      "Independently verifiable learner outcome data",
      "Policy or programme documentation",
    ],
    region: "Open continent-wide and by individual countries where applicable.",
    pathway: "Institutional submission → NRC verification → Jury review → Governance ratification.",
  },
  hallFilter: {
    categoryIncludes: ["political", "leadership", "education-friendly", "state", "governor", "ministry", "university", "academic"],
  },
  exploreAllHref: "/nominees?tier=platinum",
  nominateHref: "/nominate?tier=platinum",
  subcategories: [
    { slug: "education-friendly-state", title: "Education-Friendly State / Governor", blurb: "Recognising governors and states whose policies meaningfully advanced education.", recognises: "State governments and governors", viewHref: "/awards/platinum-certificate-categories/education-friendly-state-of-the-year-nigeria", nominateHref: "/nominate?pillar=platinum&track=state" },
    { slug: "political-leadership", title: "Political Leadership in Education", blurb: "Political leaders whose work has improved learning outcomes.", recognises: "Ministers, legislators, public officials", viewHref: "/awards/platinum-certificate-categories/best-political-leader-supporting-education-nigeria", nominateHref: "/nominate?pillar=platinum&track=political" },
    { slug: "research-development", title: "Research & Development in Education", blurb: "Institutions advancing education research and innovation.", recognises: "Universities, research institutes, think-tanks", viewHref: "/awards/platinum-certificate-categories/best-research-and-development-institution-in-education-nigeria", nominateHref: "/nominate?pillar=platinum&track=research" },
    { slug: "creative-arts", title: "Creative Arts Education", blurb: "Programmes integrating creative arts with education delivery.", recognises: "Creative-arts schools and programmes", viewHref: "/awards/platinum-certificate-categories/best-creative-arts-education-initiative-nigeria", nominateHref: "/nominate?pillar=platinum&track=creative" },
    { slug: "library", title: "Library & Reading Culture", blurb: "Institutions building reading culture and library access.", recognises: "Libraries, reading networks, literacy initiatives", viewHref: "/awards/platinum-certificate-categories/best-library-and-reading-culture-initiative-nigeria", nominateHref: "/nominate?pillar=platinum&track=library" },
    { slug: "media-advocacy", title: "Media Advocacy for Education", blurb: "Media institutions driving education advocacy and visibility.", recognises: "Broadcasters, publications, advocacy outlets", viewHref: "/awards/platinum-certificate-categories/best-media-advocacy-for-education-nigeria", nominateHref: "/nominate?pillar=platinum&track=media" },
  ],
  finalCta: {
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
  seoTitle: "Influencer Education Impact Award 2026 | NESA-Africa",
  metaDescription:
    "Recognising Africans transforming influence into measurable education impact — social media creators, sports icons, and music icons backing learning across Africa and the diaspora.",
  hero: {
    badge: "Influencer Education Impact · 2026",
    title: "Influencer Education Impact",
    titleAccent: "2026",
    subhead:
      "Honouring social media creators, sports icons, and music icons turning their influence into measurable education impact for African learners.",
    statsBuilder: ({ nominees }) => [
      { label: "Verified Nominees", value: nominees },
      { label: "Tracks", value: 3 },
      { label: "Classifications", value: 2 },
      { label: "Final Honourees", value: "Per track" },
    ],
    primaryCta: { label: "Nominate an Influencer", href: "/nominate?tier=influencer-2026" },
    secondaryCta: { label: "Preview Existing Nominees", href: "/nominees?tier=influencer" },
    trustLine: "Verified impact required · Jury + public participation · No purchased recognition",
  },
  recognises:
    "This award recognises public figures whose influence has translated into measurable education action — funding scholarships, building schools, mentoring learners, producing learning content, or advocating for African education at scale.",
  eligibility: {
    canBeNominated: [
      "Social media creators producing learning content",
      "African sports icons funding scholarships or schools",
      "African music icons supporting education programmes",
      "Africans in Africa and in the Diaspora",
    ],
    shouldNotBeNominated: [
      "Public figures without documented education action",
      "Brand-led marketing claims without verified outcomes",
      "One-off appearances or photo opportunities",
    ],
    evidence: [
      "Documented education programmes, scholarships, or campaigns",
      "Independent third-party verification",
      "Beneficiary or programme outcome data",
    ],
    region: "Open to Africans in Africa and Africans in the Diaspora.",
    pathway: "Nomination → NRC verification → Jury review → Public participation → Honouree reveal.",
  },
  hallFilter: {
    categoryIncludes: ["influencer", "social media", "sport", "footballer", "music", "musician"],
  },
  exploreAllHref: "/nominees?tier=influencer",
  nominateHref: "/nominate?tier=influencer-2026",
  subcategories: [
    { slug: "social-media", title: "African Social Media Education Champion", blurb: "Creators using social platforms to teach, mentor, and advance education across Africa.", recognises: "Education-focused content creators", viewHref: "/awards/influencers-education-impact/education-content-social-media-influencers", nominateHref: "/nominate?tier=influencer-2026&track=social-media" },
    { slug: "sports", title: "African Sports Icons Supporting Education", blurb: "Sports icons funding scholarships, schools, and youth education programmes.", recognises: "Footballers, athletes, sports leaders", viewHref: "/awards/influencers-education-impact/african-footballers-supporting-education", nominateHref: "/nominate?tier=influencer-2026&track=sports" },
    { slug: "music", title: "African Music Icons Supporting Education", blurb: "Music icons advancing education through philanthropy and programmes.", recognises: "Musicians, composers, music industry leaders", viewHref: "/awards/influencers-education-impact/african-musicians-supporting-education", nominateHref: "/nominate?tier=influencer-2026&track=music" },
  ],
  finalCta: {
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
