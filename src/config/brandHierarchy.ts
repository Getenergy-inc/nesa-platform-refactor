// brandHierarchy.ts — CANONICAL public brand + discovery source of truth.
//
// Everything public-facing (homepage, navigation, recognition family pages,
// nomination routing, catalogue) reads its brand hierarchy, vocabulary,
// recognition families and service ownership from this file. Do not fork or
// hard-code alternative versions of these strings in components.
//
// Underlying award architecture is NOT changed by this file — it is a
// progressive-disclosure layer that sits on top of
// `src/config/recognition2026/categories`.

import { CATEGORIES, type CategoryDefinition } from "@/config/recognition2026/categories";
import {
  PROGRAMME_END_LABEL,
  PROGRAMME_END_LONG_LABEL,
  GALA_COUNTDOWN_DATETIME,
} from "@/config/programme";

// ── 1. Brand hierarchy (locked) ─────────────────────────────────────────────

export const BRAND = {
  /** Master platform. */
  platform: "NESA-Africa",
  platformLong: "New Education Standard Award Africa",
  /** Umbrella programme. */
  programme: "The African Blue-Garnet Awards for Education",
  programmeTagline: "Recognising the Enablers of Education for All Across Africa",
  /** Flagship lifetime recognition. */
  flagship: "Africa Education Icon Award",
  flagshipTagline:
    "Celebrating the people whose lifetime contributions have helped shape African education.",
  cycleLabel: "NESA-Africa 2026",
  nominationsOpenLabel: "30 August 2026",
  galaLabel: PROGRAMME_END_LABEL,
  galaLongLabel: PROGRAMME_END_LONG_LABEL,
  galaCountdownIso: GALA_COUNTDOWN_DATETIME,
} as const;

/** §10 — master public vocabulary. */
export const EDUCATION_ENABLER_DEFINITION =
  "An Education Enabler is an individual, organisation, institution, company, government, community, media organisation, innovator, philanthropist or partner whose work contributes to expanding, improving, supporting or transforming education.";

/** §18 — history must never be misrepresented. */
export const HISTORY_NOTE =
  "Santos Creations Educational Foundation (SCEF) has advanced education across Africa for over two decades. NESA-Africa is SCEF's continental recognition platform — 2026 is its inaugural full public award cycle. The Africa Education Icon Award reviews lifetime contributions made between 2006 and 2026; it does not imply NESA-Africa has run an award programme for that period.";

// ── 2. Five public discovery pathways (§3) ──────────────────────────────────

export interface DiscoveryPathway {
  id: string;
  label: string;
  href: string;
  blurb: string;
}

export const DISCOVERY_PATHWAYS: DiscoveryPathway[] = [
  {
    id: "icon",
    label: "Africa Education Icon",
    href: "/recognition/africa-education-icon",
    blurb: "The flagship lifetime recognition for Africa's greatest Education Enablers.",
  },
  {
    id: "certificates",
    label: "Education Impact Certificates",
    href: "/recognition/certificates",
    blurb: "Six recognition families honouring current education impact across the continent.",
  },
  {
    id: "explore",
    label: "Explore Education Enablers",
    href: "/nominees",
    blurb: "Meet the people and organisations helping advance Education for All across Africa.",
  },
  {
    id: "impact",
    label: "Education Impact",
    href: "/impact",
    blurb: "Recognition → Visibility → Partnerships → Funding → Intervention → Legacy.",
  },
  {
    id: "participate",
    label: "Participate",
    href: "/participate",
    blurb: "Nominate, sponsor, partner, endorse, volunteer or join a chapter.",
  },
];

// ── 3. Icon pathways + recognition communities (§9) ─────────────────────────

/** Canonical Icon Award surface copy — shared by the homepage flagship
 *  section and the award pages. Do not retype these strings in components. */
export const ICON_AWARD_SECTION = {
  eyebrow: "The Africa Education Icon Award",
  title: "Lifetime Achievement, 2006–2026",
  intro:
    "For 20 years, quiet heroes have transformed education across our continent. This highest honour celebrates lifetime impact and legacy as Enablers of Education for All Across Africa.",
  cardBadge: "LIFETIME ACHIEVEMENT · 2006–2026",
  /** Supporting tagline reused wherever the Icon Award is introduced. */
  tagline: "Africa's Flagship Lifetime Education Honour",
  /** Copy for the homepage living gallery of already-nominated Icons. */
  gallery: {
    eyebrow: "Africa's Flagship Lifetime Education Honour",
    title: "Meet Africa's Education Enablers",
    /** `{count}` is replaced with the real nominee total at render time. */
    lede:
      "These are the {count} people and institutions already nominated for the 2026 Africa Education Icon Award — Africans living in Africa, Diaspora Africans and Friends of Africa, enabling education for all across Africa.",
    invite:
      "Join us at the Gala on {date} in Lagos to celebrate the nine eventual Icon laureates drawn from this pool.",
  },
  awardHref: "/awards/africa-education-icon",
  nominateHref: "/nominate/africa-education-icon",
} as const;


export const ICON_PATHWAYS = [
  {
    slug: "education-philanthropy-icon",
    name: "Africa Education Philanthropy Icon",
    blurb:
      "Philanthropy, scholarships, infrastructure and education funding with lasting impact.",
    description:
      "Enablers of Education for All Across Africa who turned wealth into hope — building schools, funding thousands of scholarships, and changing entire systems.",
    nomineesHref: "/nominees/africa-education-icon-award/education-philanthropy-icon",
    nominateHref: "/nominate/africa-education-icon",
    awardHref: "/awards/africa-education-icon",
  },
  {
    slug: "literary-new-curriculum-advocate",
    name: "Literary & New Curriculum Advocate Icon",
    blurb:
      "Authors, publishers, curriculum reformers, education writers and knowledge-system builders.",
    description:
      "Enablers of Education for All Across Africa who reshaped learning and identity — decolonising curricula and championing African stories and indigenous knowledge.",
    nomineesHref: "/nominees/africa-education-icon-award/literary-new-curriculum-advocate",
    nominateHref: "/nominate/africa-education-icon",
    awardHref: "/awards/africa-education-icon",
  },
  {
    slug: "technical-educator-icon",
    name: "Africa Technical Educator Icon",
    blurb: "TVET, STEM, vocational and technical education pioneers.",
    description:
      "Enablers of Education for All Across Africa who taught the continent to build, code, innovate and lead through technical and digital skills.",
    nomineesHref: "/nominees/africa-education-icon-award/technical-educator-icon",
    nominateHref: "/nominate/africa-education-icon",
    awardHref: "/awards/africa-education-icon",
  },
] as const;


export const RECOGNITION_COMMUNITIES = [
  { slug: "africans-in-africa", name: "Africans in Africa" },
  { slug: "diaspora-africans", name: "Diaspora Africans" },
  { slug: "friends-of-africa", name: "Friends of Africa" },
] as const;

/** Icon tier is judged internally — no public voting anywhere. */
export const ICON_NO_PUBLIC_VOTING_NOTE =
  "The Africa Education Icon Award has no public voting. Every Icon is assessed internally by the independent Judges Arena against published evidence criteria.";

/**
 * Icon-specific governance/trust statement. Rendered directly beside the
 * Icon surfaces so trust language is never only on the separate Trust page.
 */
export const ICON_GOVERNANCE_STATEMENT = [
  "Recognition is subject to eligibility, evidence review, verification and the applicable NESA-Africa governance process.",
  "Sponsorship, partnerships and donations do not determine nominee eligibility, judging, recognition or award outcomes.",
] as const;

/**
 * Africa Education Icon Award — 2026 nomination timeline.
 * Dates mirror the canonical programme configuration:
 *   open  30 August 2026, close 12 September 2026 (recognition2026 categories),
 *   Gala  PROGRAMME_END_LABEL (13 December 2026).
 * No selection/finalist date exists in backend config, so that step is
 * intentionally left open-ended rather than fabricated.
 */
export const ICON_NOMINATION_TIMELINE = {
  title: "Africa Education Icon Award — 2026 Nomination Timeline",
  steps: [
    {
      key: "open",
      label: "Public Nominations Open",
      when: "30 August 2026",
      body: "Anyone can nominate an Education Enabler for the flagship lifetime honour.",
    },
    {
      key: "window",
      label: "Nomination Window",
      when: "30 August – 12 September 2026",
      body: "Icon nominations close at 23:59 WAT on 12 September 2026.",
    },
    {
      key: "review",
      label: "Review & Verification",
      when: "After nominations close",
      body: "The Nomination Review Committee and governance processes review submissions, eligibility and supporting evidence.",
    },
    {
      key: "selection",
      label: "Icon Selection",
      when: "Date to be confirmed",
      body: "Following formal review and governance process, successful nominees progress toward final recognition.",
    },
    {
      key: "gala",
      label: "Recognition Gala",
      when: `${PROGRAMME_END_LABEL} · Lagos, Nigeria`,
      body: "Africa Education Icon laureates are celebrated at the NESA-Africa 2026 Gala.",
    },
  ],
} as const;

/** Closing Icon band copy. */
export const ICON_CLOSING_SECTION = {
  title: "Join Africa in Celebrating Its Education Icons",
  body: `On ${PROGRAMME_END_LABEL}, Lagos becomes the meeting point for celebrating the people whose lifetime contributions have helped advance education across Africa.`,
  lines: [
    "Africa Education Icon Award",
    "Africa's Flagship Lifetime Education Honour",
    "Three Pathways. One Continental Mission. A Lifetime of Impact.",
  ],
} as const;

/** Scale/credibility band above the closing message. */
export const ICON_SCALE_SECTION = {
  eyebrow: "Scale of the search",
  title: "A Continental Search for Education Icons",
  sub: "Live counts drawn from the Africa Education Icon nominee record across all three pathways.",
} as const;


// ── 4. Six Education Impact Certificate families (§3 pathway 2) ─────────────

export interface RecognitionFamily {
  slug: string;
  name: string;
  /** One-line public promise. */
  lede: string;
  overview: string;
  whoCanBeNominated: string;
  qualifyingImpact: string;
  /** Underlying category slugs from the authoritative taxonomy. */
  categorySlugs: string[];
  /** Broad impact keywords used by the "Help me choose" router. */
  impactKeys: string[];
}

export const RECOGNITION_FAMILIES: RecognitionFamily[] = [
  {
    slug: "csr-education",
    name: "CSR for Education",
    lede: "Companies and foundations investing corporate resources in education.",
    overview:
      "Corporate social responsibility that measurably expands access, quality or continuity of education — school builds, learning infrastructure, scholarship funds, teacher support and long-term community education programmes.",
    whoCanBeNominated:
      "Companies, corporate foundations, banks, telecoms, energy and consumer brands operating in Africa.",
    qualifyingImpact:
      "Documented, funded education programmes with verifiable beneficiaries and independent citations.",
    categorySlugs: ["best-csr-education-africa", "best-csr-education-nigeria"],
    impactKeys: ["funded-education", "built-schools", "philanthropy"],
  },
  {
    slug: "edutech-innovation",
    name: "EduTech Innovation",
    lede: "Technology that widens access to learning across Africa.",
    overview:
      "Platforms, products and digital learning systems that demonstrably improve learning outcomes, teacher capability or access for underserved learners.",
    whoCanBeNominated:
      "EdTech companies, innovators, research labs, universities and public digital-learning initiatives.",
    qualifyingImpact:
      "Adoption and outcome evidence — learners reached, schools onboarded, measured learning gains.",
    categorySlugs: ["best-edtech-innovation-africa"],
    impactKeys: ["education-technology", "stem", "digital-learning"],
  },
  {
    slug: "media-education",
    name: "Media Organisation for Education",
    lede: "Newsrooms and broadcasters advancing the education agenda.",
    overview:
      "Sustained editorial, broadcast or documentary work that has shifted public understanding, accountability or policy on education.",
    whoCanBeNominated:
      "Broadcasters, newspapers, digital newsrooms, documentary producers and education desks.",
    qualifyingImpact:
      "Published bodies of work with reach evidence and demonstrable education outcomes.",
    categorySlugs: ["best-media-education-advocacy-nigeria"],
    impactKeys: ["media-education", "policy"],
  },
  {
    slug: "ngo-international",
    name: "NGO & International Education Partnership",
    lede: "Civil society and cross-border partnerships delivering education at scale.",
    overview:
      "NGOs, development partners and international collaborations delivering schooling, teacher development, girls' education, inclusive education and emergency education response.",
    whoCanBeNominated:
      "NGOs, CBOs, multilateral agencies, bilateral programmes and international education partnerships.",
    qualifyingImpact:
      "Programme reports, beneficiary data, partner attestations and independent evaluation.",
    categorySlugs: [
      "best-ngo-education-nigeria",
      "best-ngo-education-africa",
      "international-partnership-education",
    ],
    impactKeys: ["supported-teachers", "girls-education", "inclusive-education"],
  },
  {
    slug: "diaspora-impact",
    name: "Diaspora Educational Impact",
    lede: "Africans abroad building education back home.",
    overview:
      "Diaspora individuals, associations and businesses funding, mentoring, equipping or partnering with African education institutions from outside the continent.",
    whoCanBeNominated:
      "Diaspora individuals, hometown and professional associations, diaspora-led businesses and alumni networks.",
    qualifyingImpact:
      "Evidence of sustained education support routed into African institutions or learners.",
    categorySlugs: ["diaspora-educational-impact"],
    impactKeys: ["diaspora"],
  },
  {
    slug: "influencer-education-impact",
    name: "Influencer Education Impact",
    lede: "Public influence converted into real education outcomes.",
    overview:
      "Public figures whose platforms have produced verified education results — funding raised, schools supported, enrolment driven, awareness converted into action. Verified impact, never follower count.",
    whoCanBeNominated:
      "Creators, musicians, athletes, faith and community leaders, and other public figures.",
    qualifyingImpact:
      "Traceable outcomes attributable to the influencer's advocacy or fundraising.",
    categorySlugs: ["influencer-education-impact-award"],
    impactKeys: ["public-influence", "media-education"],
  },
];

export function getRecognitionFamily(slug: string): RecognitionFamily | undefined {
  return RECOGNITION_FAMILIES.find((f) => f.slug === slug);
}

/** Resolve a family's underlying authoritative categories (never duplicated). */
export function getFamilyCategories(family: RecognitionFamily): CategoryDefinition[] {
  return family.categorySlugs
    .map((s) => CATEGORIES.find((c) => c.slug === s))
    .filter((c): c is CategoryDefinition => Boolean(c));
}

/** Categories not surfaced by one of the six families — still fully public. */
export function getUnbundledCategories(): CategoryDefinition[] {
  const claimed = new Set(RECOGNITION_FAMILIES.flatMap((f) => f.categorySlugs));
  claimed.add("africa-education-icon-award"); // flagship, its own pathway
  return CATEGORIES.filter((c) => !claimed.has(c.slug));
}

// ── 5. Nomination routing vocabulary (§6 / §7) ──────────────────────────────

export const NOMINEE_TYPES = [
  "An Individual",
  "An Organisation",
  "A School or Institution",
  "A Company or Foundation",
  "An NGO",
  "A Media Organisation",
  "An Innovator",
  "An Influencer",
  "A Government or Public Institution",
  "A Diaspora Contributor",
  "I'm Not Sure",
] as const;

export interface ImpactChoice {
  key: string;
  label: string;
}

export const IMPACT_CHOICES: ImpactChoice[] = [
  { key: "funded-education", label: "Funded education" },
  { key: "built-schools", label: "Built or improved schools" },
  { key: "supported-teachers", label: "Supported teachers" },
  { key: "education-technology", label: "Created education technology" },
  { key: "stem", label: "Advanced STEM" },
  { key: "girls-education", label: "Supported girls' education" },
  { key: "inclusive-education", label: "Supported inclusive education" },
  { key: "policy", label: "Influenced education policy" },
  { key: "media-education", label: "Used media to advance education" },
  { key: "philanthropy", label: "Supported education through philanthropy" },
  { key: "diaspora", label: "Supported Africa from the diaspora" },
  { key: "public-influence", label: "Used public influence to advance education" },
];

/** Recommend recognition families for a set of selected impact keys. */
export function recommendFamilies(impactKeys: string[]): RecognitionFamily[] {
  if (!impactKeys.length) return [];
  const scored = RECOGNITION_FAMILIES.map((f) => ({
    family: f,
    score: f.impactKeys.filter((k) => impactKeys.includes(k)).length,
  }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.map((s) => s.family);
}

// ── 6. Who can be an Education Enabler (§11 section 4) ──────────────────────

export const ENABLER_AUDIENCES = [
  "Individuals",
  "Organisations",
  "Companies",
  "NGOs",
  "Institutions",
  "Innovators",
  "Media",
  "Influencers",
  "Government",
  "Diaspora",
] as const;

// ── 7. Recognition → Impact chain (§4 / §11 section 6) ──────────────────────

export const IMPACT_CHAIN = [
  { step: "Recognition", body: "Verified education impact is formally recognised." },
  { step: "Visibility", body: "A public, evidence-backed profile in the Impact Directory." },
  { step: "Partnerships", body: "Introductions to institutions, NGOs and corporate partners." },
  { step: "Funding", body: "Exposure to funders looking for verified delivery partners." },
  { step: "Intervention", body: "Deployment into EduAid-Africa programmes on the ground." },
  { step: "Legacy", body: "Long-term contribution recorded in Africa's education register." },
];

// ── 8. Service ownership (§16) — never mix payment routing ──────────────────

export interface ServiceOwner {
  id: "nesa" | "eduaid" | "scef";
  name: string;
  shortName: string;
  handles: string[];
}

export const SERVICE_OWNERS: ServiceOwner[] = [
  {
    id: "nesa",
    name: "NESA-Africa",
    shortName: "NESA-Africa",
    handles: [
      "Awards and recognition",
      "The Awards Gala",
      "Merchandise",
      "Media and broadcast",
      "Sponsorship",
      "Award-related commercial services",
    ],
  },
  {
    id: "eduaid",
    name: "EduAid-Africa",
    shortName: "EduAid-Africa",
    handles: [
      "Rebuild My School Africa",
      "Scholarships",
      "School interventions",
      "Education donations",
      "Teacher and education support programmes",
    ],
  },
  {
    id: "scef",
    name: "Santos Creations Educational Foundation",
    shortName: "SCEF",
    handles: [
      "Membership",
      "Ambassadors",
      "Local chapters",
      "Foundation programmes",
      "Institutional participation",
    ],
  },
];

// ── 9. Trust & integrity pillars (§17) ──────────────────────────────────────

export const TRUST_PILLARS = [
  { title: "Independent governance", body: "A governance board separate from operations ratifies every recognition." },
  { title: "NRC review", body: "The Nominee Research Corps independently verifies every submitted claim." },
  { title: "Evidence requirements", body: "Recognition requires independently verifiable citations and records." },
  { title: "Conflict-of-interest controls", body: "Reviewers and judges declare and are recused from conflicts." },
  { title: "Sponsor independence", body: "Sponsorship, donations, tickets and merchandise never influence outcomes." },
  { title: "Data protection", body: "Nominee personal data is minimised, access-controlled and never sold." },
  { title: "Financial reporting", body: "Programme finances are reported to the foundation's board annually." },
  { title: "Nominee status", body: "Every nominee can see and share their verification status." },
  { title: "Recognition criteria", body: "Criteria are published before nominations open and never changed mid-cycle." },
];
