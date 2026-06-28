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
