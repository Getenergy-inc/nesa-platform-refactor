// NESA-Africa — Canonical platform copy.
// Single source of truth for positioning statements, region framing,
// CTA labels, and language replacements. Import these instead of hardcoding.

export const PLATFORM_POSITIONING = {
  shortPositioning: "Africa's Education Recognition & Impact Platform",
  fullPositioning:
    "NESA-Africa is Africa's Education Recognition & Impact Platform. We recognise the enablers of Education for All across Eight Africa Regions, Africans in the Diaspora and Friends of Africa.",
  signatureChain:
    "Recognition creates visibility. Visibility builds credibility. Credibility attracts partnerships. Partnerships mobilise investment. Investment delivers educational transformation. Educational transformation becomes Africa's legacy.",
  regionFraming:
    "Across Eight Africa Regions, Africans in the Diaspora and Friends of Africa.",
  expansionNote:
    "Building toward all 54 African countries over the next 5–10 years through regional chapters, partnerships and measurable education impact.",
} as const;

export const RECOGNITION_LEGACY_STEPS = [
  { id: "recognition", label: "Recognition" },
  { id: "visibility", label: "Visibility" },
  { id: "credibility", label: "Credibility" },
  { id: "partnerships", label: "Partnerships" },
  { id: "investment", label: "Investment" },
  { id: "transformation", label: "Educational Transformation" },
  { id: "legacy", label: "Legacy" },
] as const;

// The three primary journeys — every page funnels visitors here.
export const PRIMARY_CTAS = {
  nominate: {
    label: "Nominate an Education Enabler",
    href: "/nominate",
    short: "Nominate Now",
  },
  directory: {
    label: "Explore the Africa Education Impact Directory",
    href: "/nominees",
    short: "Explore Directory",
  },
  joinMovement: {
    label: "Become a Sponsor, Partner or Volunteer",
    href: "/get-involved",
    short: "Join the Movement",
  },
} as const;

export const REGION_FRAMING = {
  africaRegions: [
    "West Africa",
    "East Africa",
    "Central Africa",
    "Southern Africa",
    "North Africa",
    "Horn of Africa",
    "Sahel Region",
    "Indian Ocean Islands",
  ],
  globalCommunities: ["Africans in the Diaspora", "Friends of Africa"],
  headline: "One Continent. Eight Africa Regions. Two Global Communities. One Mission.",
} as const;

export const DIRECTORY_NAME = "Africa Education Impact Directory";

// Single canonical identity sentence — use everywhere a visitor needs to answer
// "What is NESA-Africa?" in one read.
export const PLATFORM_IDENTITY_SENTENCE =
  "NESA-Africa (New Education Standard Award Africa) is Africa's Education Recognition & Impact Platform — a continental ecosystem that identifies, verifies, recognises, connects and supports the people, organisations and institutions enabling Education for All across Africa.";

// Scale-at-a-glance chips for hero and overview rails.
export const RECOGNITION_ARCHITECTURE_SUMMARY = [
  { label: "4 Recognition Tiers", href: "/awards" },
  { label: "18 Award Categories", href: "/awards#categories" },
  { label: "96 Subcategories", href: "/awards#subcategories" },
  { label: "8 African Regions", href: "/regions" },
  { label: "2 Global Communities", href: "/regions#communities" },
  { label: "27 Independent Icon Judges", href: "/judges" },
  { label: "9 Icon Laureate Positions", href: "/awards/africa-education-icon" },
] as const;

// Who NESA-Africa recognises — grouped clusters (scannable replacement for long lists).
export const WHO_WE_RECOGNISE_CLUSTERS = [
  {
    id: "individuals",
    title: "Individuals",
    body: "Education Icons, philanthropists, authors, curriculum advocates, political leaders, researchers, sports icons, music icons and social-media creators.",
    href: "/awards/africa-education-icon",
    ctaLabel: "Explore Individual Recognition",
  },
  {
    id: "organisations",
    title: "Organisations and Institutions",
    body: "Companies, foundations, NGOs, faith-based organisations, universities, libraries, research bodies, media organisations and technology companies.",
    href: "/awards/platinum-recognition",
    ctaLabel: "Explore Institutional Recognition",
  },
  {
    id: "governments",
    title: "Governments and International Partners",
    body: "Government bodies, Nigerian states, development agencies, diplomatic missions, bilateral organisations and multilateral partners.",
    href: "/awards/platinum-recognition",
    ctaLabel: "Explore Public and International Recognition",
  },
] as const;

// One-line trust statement — drop into any page footer/strip.
export const TRUST_STATEMENT =
  "Every nomination undergoes independent research, evidence verification and governance review before recognition. Sponsors, donors and partners do not influence judging or final recognition decisions.";

// Legacy phrases the marketing copy must avoid. Kept here for the dev-only lint helper.
export const DEPRECATED_PHRASES = [
  "Education Excellence",
  "Excellence Awards",
  "Award Winners",
  "Seven Recognition Pillars",
  "7 Recognition Pillars",
  "9 Pillars",
  "9 Recognition Pillars",
  "100+ Subcategories",
  "10 education regions",
  "5+2 Regions",
  "54 African countries",
  "2,500+ nominees",
] as const;
