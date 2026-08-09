// ============================================================================
// NESA-Africa Education Social Impact — CANONICAL brand + navigation source.
// ============================================================================
//
// Brand architecture (locked, do not re-order or re-parent):
//
//   NESA-Africa
//     └── NESA-Africa Education Social Impact
//           └── Funded and supported by Friends of EduAid-Africa
//                 └── Education interventions across Africa
//                       └── Impact reports, stories and measurable outcomes
//
// CRITICAL: the navigation must NEVER read as "EduAid-Africa → Impact".
// EduAid-Africa is the programme infrastructure and funding community, never
// the parent brand. Supporters are collectively "Friends of EduAid-Africa" —
// they are not repeatedly referred to as "donors".
//
// Payment ownership is NOT defined here — it is read from SERVICE_OWNERS in
// `src/config/brandHierarchy.ts`. Do not fork those rules.

import { PROGRAMME_END_LABEL, PROGRAMME_END_LONG_LABEL } from "@/config/programme";
import { AFRICA_REGIONS, type AfricaRegionDefinition } from "@/config/regions/africaRegions";

/* -------------------------------------------------------------------------- */
/* 1. Positioning copy                                                        */
/* -------------------------------------------------------------------------- */

export const IMPACT_BRAND = {
  /** Full institutional name — used as page H1 and dropdown heading. */
  name: "NESA-Africa Education Social Impact",
  /** Short navigation label. */
  navLabel: "Education Impact",
  positioning:
    "Turning education recognition into measurable community impact across Africa.",
  supportingLine:
    "NESA-Africa connects education recognition with practical social impact by supporting verified interventions that improve schools, learning environments, inclusion, access and educational opportunity across Africa.",
  fundingLine: "Funded and supported by Friends of EduAid-Africa.",
  overviewHeadline: "Recognition That Creates Real Education Impact.",
  overviewMessage:
    "Friends of EduAid-Africa fund the impact. NESA-Africa documents, connects and showcases the impact.",
  /** How EduAid-Africa must be described everywhere in this section. */
  eduaidPositioning:
    "EduAid-Africa is part of the Santos Creations Educational Foundation education-support ecosystem and provides the programme infrastructure through which eligible education-support initiatives may be developed and implemented.",
  /** Collective name for supporters. Never say "donors" in this section. */
  supporterCollective: "Friends of EduAid-Africa",
} as const;

/* -------------------------------------------------------------------------- */
/* 2. Trust & governance statements (must appear on the overview page)        */
/* -------------------------------------------------------------------------- */

export const IMPACT_TRUST_STATEMENTS: { title: string; body: string }[] = [
  {
    title: "Eligibility and verification",
    body: "Education interventions are subject to programme eligibility, verification, governance and implementation procedures. Funding does not guarantee award recognition, nomination outcomes or any other recognition status.",
  },
  {
    title: "Independence of recognition",
    body: "Sponsorship, funding or support of an education intervention never influences award outcomes. Nomination review, judging and ratification remain independent of every funding relationship.",
  },
  {
    title: "Programme infrastructure",
    body: IMPACT_BRAND.eduaidPositioning,
  },
  {
    title: "Supporter privacy",
    body: "Impact reporting publishes funds received, allocation and delivered outcomes. Private information about individual Friends of EduAid-Africa is never published without their consent.",
  },
];

/* -------------------------------------------------------------------------- */
/* 3. Three priority pathways (dropdown + overview cards)                     */
/* -------------------------------------------------------------------------- */

export interface ImpactPriorityCard {
  id: string;
  title: string;
  tagline: string;
  cta: string;
  href: string;
}

export const IMPACT_PRIORITY_CARDS: ImpactPriorityCard[] = [
  {
    id: "rebuild",
    title: "Rebuild My School Africa",
    tagline: "Transform a school. Change an education environment.",
    cta: "Rebuild a School →",
    href: "/eduaid-africa/rebuild-my-school",
  },
  {
    id: "special-needs",
    title: "Support a Special-Needs School",
    tagline: "Advance inclusive education.",
    cta: "Support a Special-Needs School →",
    href: "/impact/special-needs-schools",
  },
  {
    id: "regional",
    title: "Regional School Interventions",
    tagline: "Discover Education Impact Across Africa.",
    cta: "Explore Regional Impact →",
    href: "/impact/regional",
  },
];

/* -------------------------------------------------------------------------- */
/* 4. Dropdown / section navigation (single source — no competing structure)  */
/* -------------------------------------------------------------------------- */

export const IMPACT_NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Education Social Impact Overview", href: "/impact" },
  { label: "Rebuild My School Africa", href: "/eduaid-africa/rebuild-my-school" },
  { label: "Support a Special-Needs School", href: "/impact/special-needs-schools" },
  { label: "Regional School Interventions", href: "/impact/regional" },
  { label: "Afri-EduTourism 2027", href: "/afri-edutourism" },
  { label: "Impact Reports", href: "/impact/reports" },
  { label: "Impact Stories & Media", href: "/impact/stories" },
  { label: `Gala 2026 · ${PROGRAMME_END_LABEL}`, href: "/gala" },
];

/** Rendered at the bottom of the dropdown. Never place payment details here. */
export const IMPACT_NAV_FOOTER = {
  note: "Funded by Friends of EduAid-Africa",
  ctaLabel: "Become a Friend of EduAid-Africa →",
  /** Movement page — payment routing is resolved downstream, not in the menu. */
  ctaHref: "/impact/friends-of-eduaid-africa",
} as const;

/** Gala label always derives from the authoritative programme config. */
export const IMPACT_GALA = {
  label: `Gala 2026 · ${PROGRAMME_END_LABEL}`,
  longLabel: PROGRAMME_END_LONG_LABEL,
  href: "/gala",
} as const;

/* -------------------------------------------------------------------------- */
/* 5. Intervention areas — Rebuild My School Africa                           */
/* -------------------------------------------------------------------------- */

export const INTERVENTION_AREAS: { id: string; label: string; description: string }[] = [
  { id: "classroom-rehab", label: "Classroom rehabilitation", description: "Repairing and restoring unsafe or unusable teaching spaces." },
  { id: "infrastructure", label: "School infrastructure", description: "Roofing, walls, flooring, furniture and core school buildings." },
  { id: "wash", label: "Water, sanitation & hygiene (WASH)", description: "Clean water points, toilets and handwashing facilities." },
  { id: "solar", label: "Solar power", description: "Reliable off-grid electricity for classrooms and learning devices." },
  { id: "connectivity", label: "Connectivity", description: "Internet access enabling digital teaching and learning." },
  { id: "learning-materials", label: "Learning materials", description: "Textbooks, libraries, laboratory and classroom resources." },
  { id: "digital-learning", label: "Digital learning", description: "Devices, digital content and teacher digital-skills support." },
  { id: "accessibility", label: "Accessibility", description: "Ramps, accessible entrances, pathways and sanitation." },
  { id: "special-needs-facilities", label: "Special-needs facilities", description: "Assistive equipment, sensory rooms and inclusive learning spaces." },
  { id: "teacher-support", label: "Teacher-support facilities", description: "Staff rooms, preparation spaces and teaching resources." },
  { id: "safe-environments", label: "Safe learning environments", description: "Perimeter safety, lighting, safeguarding and child protection." },
];

/** School → Location → Need → Intervention → Funding → Progress → Outcome. */
export const INTERVENTION_JOURNEY = [
  "School",
  "Location",
  "Need",
  "Intervention",
  "Funding",
  "Progress",
  "Outcome",
] as const;

/** Inclusive-education record fields surfaced where verified data exists. */
export const SPECIAL_NEEDS_FIELDS = [
  "School",
  "Country",
  "Region",
  "Learner population",
  "Identified need",
  "Accessibility requirements",
  "Intervention required",
  "Funding target",
  "Progress",
  "Outcome",
] as const;

/** Impact-report disclosure fields. */
export const IMPACT_REPORT_FIELDS = [
  "Funds received",
  "Funding purpose",
  "Project allocation",
  "Intervention delivered",
  "Beneficiaries",
  "Location",
  "Status",
  "Evidence",
  "Outcomes",
  "Remaining needs",
] as const;

/* -------------------------------------------------------------------------- */
/* 6. Regional structure — REUSED, not redefined                              */
/* -------------------------------------------------------------------------- */

/**
 * The approved NESA-Africa regional taxonomy already implemented platform-wide
 * (`src/config/regions/africaRegions.ts` — 8 Africa regions + African Diaspora).
 * This module deliberately re-exports it rather than introducing a new one.
 */
export const IMPACT_REGIONS: AfricaRegionDefinition[] = AFRICA_REGIONS;

/* -------------------------------------------------------------------------- */
/* 7. Approved CTA vocabulary                                                 */
/* -------------------------------------------------------------------------- */

export const IMPACT_CTAS = {
  explore: "Explore Education Impact",
  rebuild: "Rebuild a School",
  specialNeeds: "Support a Special-Needs School",
  regional: "Explore Regional Impact",
  reports: "Read Impact Reports",
  stories: "Read Impact Stories",
  friend: "Become a Friend of EduAid-Africa",
  supportThisSchool: "Support This School →",
} as const;

/* -------------------------------------------------------------------------- */
/* 9. Friends of EduAid-Africa — the global funding & support movement        */
/* -------------------------------------------------------------------------- */

/** Canonical route for the movement page. Referenced by nav + impact pages. */
export const FRIENDS_ROUTE = "/impact/friends-of-eduaid-africa";

export const FRIENDS_BRAND = {
  name: "Friends of EduAid-Africa",
  headline: "A Global Movement Supporting Education for All Across Africa.",
  /** Short description — reuse anywhere a one-liner is needed. */
  shortDescription:
    "Friends of EduAid-Africa — The global funding and support movement helping advance Education for All across Africa.",
  body:
    "Friends of EduAid-Africa is the global community of individuals, families, organisations, companies, foundations, diaspora Africans, philanthropists, education advocates, and friends of Africa who support practical education impact across the continent. The movement provides the funding and support that enables EduAid-Africa services under Santos Creations Educational Foundation (SCEF) to support education interventions, while NESA-Africa Education Social Impact documents, connects, communicates and showcases the resulting impact.",
  featureMessage:
    "You don't have to build a school yourself to help transform one. Through Friends of EduAid-Africa, people around the world can contribute to verified education interventions and follow how their support helps create measurable change.",
} as const;

/** Ecosystem chain — visualised as a stepper. Payment ownership stays in SERVICE_OWNERS. */
export const FRIENDS_ECOSYSTEM_CHAIN: { title: string; note: string }[] = [
  { title: "Santos Creations Educational Foundation (SCEF)", note: "Institutional foundation." },
  { title: "EduAid-Africa Services", note: "Delivers education-support services and programme infrastructure." },
  { title: "Friends of EduAid-Africa", note: "Global funding and support community." },
  { title: "Education Social Impact Projects", note: "Verified interventions, subject to eligibility and governance." },
  { title: "Schools · Learners · Teachers · Communities", note: "Where the impact lands." },
  { title: "NESA-Africa Education Social Impact", note: "Recognition, storytelling, documentation and accountability." },
];

/** Role clarity — these four lines must never be blurred. */
export const FRIENDS_ROLE_CLARITY: { actor: string; role: string }[] = [
  { actor: "Friends of EduAid-Africa", role: "Fund and support the movement." },
  { actor: "EduAid-Africa", role: "Delivers education-support services." },
  { actor: "SCEF", role: "Provides the institutional foundation." },
  { actor: "NESA-Africa", role: "Communicates, recognises and showcases the wider education impact." },
];

export const FRIENDS_SUPPORT_AREAS: string[] = [
  "Rebuild My School Africa",
  "Special-needs and inclusive education",
  "Learning materials and educational resources",
  "Solar, WASH and school-environment improvements",
  "Digital learning and connectivity",
  "Teacher development and training",
  "Scholarships and education access",
  "Regional education interventions",
  "Afri-EduTourism",
  "Education impact research, reporting and storytelling",
];

export const FRIENDS_WHO_CAN_JOIN: string[] = [
  "Individual supporters",
  "Families",
  "Students and young professionals",
  "African diaspora communities",
  "Corporate organisations",
  "CSR and ESG partners",
  "Foundations and philanthropists",
  "NGOs and development organisations",
  "International partners",
  "Education advocates",
  "Friends of Africa",
];

/**
 * Three page CTAs. All funding routes through the existing EduAid-Africa
 * support flow (`/donate`) — never through a NESA-Africa payment surface.
 */
export const FRIENDS_CTAS: { label: string; description: string; href: string }[] = [
  {
    label: "Become a Friend of EduAid-Africa",
    description: "Join the global community supporting education impact.",
    href: "/donate",
  },
  {
    label: "Fund an Education Intervention",
    description: "Support a verified school, learner, teacher or community intervention.",
    href: "/eduaid-africa/rebuild-my-school",
  },
  {
    label: "See the Impact",
    description: "Explore projects, impact stories and published reports.",
    href: "/impact/stories",
  },
];
