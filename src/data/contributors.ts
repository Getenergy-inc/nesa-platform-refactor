// NESA-Africa Contributors Hall of Fame
// Volunteers, Interns, Judges, BOA, Ambassadors, LCPs, Data Team, Media Hosts — 2021 to date

export type ContributorRole =
  | "Volunteer"
  | "Intern"
  | "Judge"
  | "BOA"
  | "BOT"
  | "BOD"
  | "LCP"               // Local Chapter President
  | "Regional Ambassador"
  | "Ambassador"
  | "TV Presenter"
  | "Webinar Host"
  | "Data Engineer"
  | "Data Scientist"
  | "Data Analyst"
  | "Partner";

/** Functional areas a contributor worked on */
export type ContributionArea =
  | "Logo & Brand Identity"
  | "Graphic Design"
  | "Web Development"
  | "Mobile / PWA"
  | "UI/UX Design"
  | "Content Writing"
  | "Translation & Localization"
  | "Social Media"
  | "Photography"
  | "Videography & Editing"
  | "TV Production & Hosting"
  | "Webinar Production"
  | "Event Production"
  | "Public Relations"
  | "Research & Nominee Vetting"
  | "Judging & Adjudication"
  | "Data Engineering"
  | "Data Science / ML"
  | "Data Analysis & Reporting"
  | "Fundraising"
  | "Partnerships"
  | "Community Outreach"
  | "Chapter Coordination"
  | "Regional Leadership"
  | "Legal & Compliance"
  | "Finance & Operations"
  | "Mentorship"
  | "Technology & DevOps";

export const CONTRIBUTION_AREAS: ContributionArea[] = [
  "Logo & Brand Identity",
  "Graphic Design",
  "Web Development",
  "Mobile / PWA",
  "UI/UX Design",
  "Content Writing",
  "Translation & Localization",
  "Social Media",
  "Photography",
  "Videography & Editing",
  "TV Production & Hosting",
  "Webinar Production",
  "Event Production",
  "Public Relations",
  "Research & Nominee Vetting",
  "Judging & Adjudication",
  "Data Engineering",
  "Data Science / ML",
  "Data Analysis & Reporting",
  "Fundraising",
  "Partnerships",
  "Community Outreach",
  "Chapter Coordination",
  "Regional Leadership",
  "Legal & Compliance",
  "Finance & Operations",
  "Mentorship",
  "Technology & DevOps",
];

export interface ContributorSocials {
  twitter?: string;     // handle without @ or full URL
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  website?: string;
  email?: string;
}

export interface Contributor {
  id: string;
  name: string;
  role: ContributorRole;
  title?: string;
  country?: string;
  region?: string;
  yearStart: number;
  yearEnd?: number; // undefined = present
  imageUrl?: string;
  /** Short tagline shown on cards */
  highlight?: string;
  /** Full biography (plain paragraphs) */
  bio?: string;
  /** Detailed description of what this person did for NESA-Africa */
  contributionDescription?: string;
  contributions?: ContributionArea[];
  /** Personalized appreciation note from NESA-Africa */
  appreciation?: string;
  /** Recommendation letter body (long form). If omitted, a default is generated. */
  recommendation?: string;
  /** Social handles for cross-platform amplification */
  socials?: ContributorSocials;
}

/**
 * Deterministic NESA reference code, e.g. NESA-CTRB-2021-AB12CD
 * Used on appreciation + recommendation letters and shareable URLs.
 */
export function getContributorRefCode(c: Pick<Contributor, "id" | "yearStart">): string {
  let h = 0;
  for (let i = 0; i < c.id.length; i++) h = (h * 31 + c.id.charCodeAt(i)) >>> 0;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  let n = h;
  for (let i = 0; i < 6; i++) {
    code += alphabet[n % alphabet.length];
    n = Math.floor(n / alphabet.length) + (h >>> (i * 3));
  }
  return `NESA-CTRB-${c.yearStart}-${code}`;
}

/** Build a default recommendation letter when an explicit one isn't provided. */
export function buildDefaultRecommendation(c: Contributor): string {
  const tenure =
    c.yearEnd && c.yearEnd !== c.yearStart
      ? `from ${c.yearStart} to ${c.yearEnd}`
      : `from ${c.yearStart} to date`;
  const areas = c.contributions?.length
    ? c.contributions.join(", ")
    : "multiple programme areas";
  return [
    `To Whom It May Concern,`,
    `It is with great pleasure that the New Education Standard Award Africa (NESA-Africa), an initiative of the Santos Creations Educational Foundation (SCEF), recommends ${c.name} — who has served as a ${c.role}${c.title ? ` (${c.title})` : ""} ${tenure}.`,
    `Throughout this period, ${c.name} contributed meaningfully to ${areas}, demonstrating excellence, integrity, and a deep commitment to advancing education across Africa.${c.highlight ? ` Notably, ${c.highlight.toLowerCase()}` : ""}`,
    `${c.name} embodies the values of NESA-Africa — service, scholarship, and African excellence — and we recommend ${c.name} without reservation for any future role, opportunity, or institutional engagement.`,
    `Sincerely,\nThe Convener & Board\nNESA-Africa · SCEF`,
  ].join("\n\n");
}

// Seed list — extend as records are confirmed.
export const CONTRIBUTORS: Contributor[] = [
  // ─── 2021 — Founding cohort ─────────────────────────────────────────
  {
    id: "v-2021-logo",
    name: "NESA Logo Designer",
    role: "Volunteer",
    title: "Founding Brand Designer",
    country: "Nigeria",
    yearStart: 2021,
    contributions: ["Logo & Brand Identity", "Graphic Design", "UI/UX Design"],
    highlight: "Designed the official NESA-Africa logo and founding brand identity.",
  },
  {
    id: "v-2021-web",
    name: "Founding Web Volunteer",
    role: "Volunteer",
    country: "Nigeria",
    yearStart: 2021,
    contributions: ["Web Development", "Technology & DevOps"],
    highlight: "Built the first NESA-Africa website (2021).",
  },
  {
    id: "v-2021-content",
    name: "Founding Content Lead",
    role: "Volunteer",
    country: "Ghana",
    yearStart: 2021,
    contributions: ["Content Writing", "Public Relations"],
  },

  // ─── 2022 ───────────────────────────────────────────────────────────
  {
    id: "j-2022-01",
    name: "Inaugural Judge",
    role: "Judge",
    country: "Kenya",
    yearStart: 2022,
    contributions: ["Judging & Adjudication", "Research & Nominee Vetting"],
    highlight: "Served on the inaugural NESA-Africa jury panel.",
  },
  {
    id: "v-2022-social",
    name: "Social Media Volunteer",
    role: "Volunteer",
    country: "Nigeria",
    yearStart: 2022,
    contributions: ["Social Media", "Graphic Design"],
  },
  {
    id: "v-2022-photo",
    name: "Event Photographer",
    role: "Volunteer",
    country: "Nigeria",
    yearStart: 2022,
    contributions: ["Photography", "Videography & Editing", "Event Production"],
  },
  {
    id: "tv-2022-01",
    name: "NESA TV Presenter",
    role: "TV Presenter",
    title: "Anchor — NESA TV",
    country: "Nigeria",
    yearStart: 2022,
    contributions: ["TV Production & Hosting", "Public Relations"],
  },

  // ─── 2023 ───────────────────────────────────────────────────────────
  {
    id: "boa-2023-01",
    name: "Board of Advisors Member",
    role: "BOA",
    title: "Board of Advisors",
    country: "South Africa",
    yearStart: 2023,
    contributions: ["Mentorship", "Partnerships", "Legal & Compliance"],
  },
  {
    id: "lcp-2023-lagos",
    name: "Lagos Chapter President",
    role: "LCP",
    title: "Local Chapter President — Lagos",
    country: "Nigeria",
    region: "West Africa",
    yearStart: 2023,
    contributions: ["Chapter Coordination", "Community Outreach", "Partnerships"],
  },
  {
    id: "lcp-2023-nairobi",
    name: "Nairobi Chapter President",
    role: "LCP",
    title: "Local Chapter President — Nairobi",
    country: "Kenya",
    region: "East Africa",
    yearStart: 2023,
    contributions: ["Chapter Coordination", "Community Outreach"],
  },
  {
    id: "v-2023-translate",
    name: "Translation Volunteer",
    role: "Volunteer",
    country: "Senegal",
    yearStart: 2023,
    contributions: ["Translation & Localization", "Content Writing"],
    highlight: "Localized NESA content into French and Wolof.",
  },
  {
    id: "v-2023-research",
    name: "Nominee Research Volunteer",
    role: "Volunteer",
    country: "Kenya",
    yearStart: 2023,
    contributions: ["Research & Nominee Vetting"],
  },
  {
    id: "wh-2023-01",
    name: "Webinar Series Host",
    role: "Webinar Host",
    country: "Ghana",
    yearStart: 2023,
    contributions: ["Webinar Production", "Public Relations"],
  },

  // ─── 2024 ───────────────────────────────────────────────────────────
  {
    id: "i-2024-design",
    name: "Design Intern",
    role: "Intern",
    country: "Ghana",
    yearStart: 2024,
    contributions: ["UI/UX Design", "Graphic Design"],
  },
  {
    id: "i-2024-dev",
    name: "Engineering Intern",
    role: "Intern",
    country: "Nigeria",
    yearStart: 2024,
    contributions: ["Web Development", "Mobile / PWA", "Technology & DevOps"],
  },
  {
    id: "de-2024-01",
    name: "Lead Data Engineer",
    role: "Data Engineer",
    country: "Nigeria",
    yearStart: 2024,
    contributions: ["Data Engineering", "Technology & DevOps"],
    highlight: "Built the nominee ingestion + dedupe pipeline powering NESA 2025.",
  },
  {
    id: "ds-2024-01",
    name: "Data Scientist",
    role: "Data Scientist",
    country: "Kenya",
    yearStart: 2024,
    contributions: ["Data Science / ML", "Research & Nominee Vetting"],
    highlight: "Modeled the EDI scoring engine and finalist signal weights.",
  },
  {
    id: "da-2024-01",
    name: "Data Analyst",
    role: "Data Analyst",
    country: "South Africa",
    yearStart: 2024,
    contributions: ["Data Analysis & Reporting", "Data Engineering"],
  },
  {
    id: "v-2024-pr",
    name: "PR & Outreach Volunteer",
    role: "Volunteer",
    country: "Rwanda",
    yearStart: 2024,
    contributions: ["Public Relations", "Community Outreach", "Partnerships"],
  },
  {
    id: "lcp-2024-accra",
    name: "Accra Chapter President",
    role: "LCP",
    title: "Local Chapter President — Accra",
    country: "Ghana",
    region: "West Africa",
    yearStart: 2024,
    contributions: ["Chapter Coordination", "Community Outreach"],
  },

  // ─── 2025 ───────────────────────────────────────────────────────────
  {
    id: "ramb-2025-na",
    name: "North Africa Regional Ambassador",
    role: "Regional Ambassador",
    title: "Regional Ambassador — North Africa",
    country: "Egypt",
    region: "North Africa",
    yearStart: 2025,
    contributions: ["Regional Leadership", "Partnerships", "Community Outreach"],
  },
  {
    id: "ramb-2025-sa",
    name: "Southern Africa Regional Ambassador",
    role: "Regional Ambassador",
    title: "Regional Ambassador — Southern Africa",
    country: "South Africa",
    region: "Southern Africa",
    yearStart: 2025,
    contributions: ["Regional Leadership", "Chapter Coordination"],
  },
  {
    id: "ramb-2025-ea",
    name: "East Africa Regional Ambassador",
    role: "Regional Ambassador",
    title: "Regional Ambassador — East Africa",
    country: "Kenya",
    region: "East Africa",
    yearStart: 2025,
    contributions: ["Regional Leadership", "Partnerships"],
  },
  {
    id: "ramb-2025-wa",
    name: "West Africa Regional Ambassador",
    role: "Regional Ambassador",
    title: "Regional Ambassador — West Africa",
    country: "Nigeria",
    region: "West Africa",
    yearStart: 2025,
    contributions: ["Regional Leadership", "Community Outreach"],
  },
  {
    id: "ramb-2025-ca",
    name: "Central Africa Regional Ambassador",
    role: "Regional Ambassador",
    title: "Regional Ambassador — Central Africa",
    country: "Cameroon",
    region: "Central Africa",
    yearStart: 2025,
    contributions: ["Regional Leadership", "Partnerships"],
  },
  {
    id: "ramb-2025-diaspora",
    name: "Diaspora Regional Ambassador",
    role: "Regional Ambassador",
    title: "Regional Ambassador — African Diaspora",
    country: "United Kingdom",
    region: "Diaspora",
    yearStart: 2025,
    contributions: ["Regional Leadership", "Partnerships", "Fundraising"],
  },
  {
    id: "v-2025-finance",
    name: "Finance Volunteer",
    role: "Volunteer",
    country: "Tanzania",
    yearStart: 2025,
    contributions: ["Finance & Operations", "Legal & Compliance"],
  },
  {
    id: "v-2025-video",
    name: "Video Production Volunteer",
    role: "Volunteer",
    country: "Côte d'Ivoire",
    yearStart: 2025,
    contributions: ["Videography & Editing", "Event Production"],
  },
  {
    id: "tv-2025-02",
    name: "NESA TV Co-Anchor",
    role: "TV Presenter",
    title: "Co-Anchor — NESA TV 2025",
    country: "Kenya",
    yearStart: 2025,
    contributions: ["TV Production & Hosting", "Webinar Production"],
  },
  {
    id: "wh-2025-02",
    name: "Education Webinar Host",
    role: "Webinar Host",
    country: "Rwanda",
    yearStart: 2025,
    contributions: ["Webinar Production", "Public Relations"],
  },
];

export const ROLE_TABS: { key: ContributorRole | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Volunteer", label: "Volunteers" },
  { key: "Intern", label: "Interns" },
  { key: "Judge", label: "Judges" },
  { key: "BOA", label: "Board of Advisors" },
  { key: "LCP", label: "Local Chapter Presidents" },
  { key: "Regional Ambassador", label: "Regional Ambassadors" },
  { key: "Ambassador", label: "Ambassadors" },
  { key: "TV Presenter", label: "TV Presenters" },
  { key: "Webinar Host", label: "Webinar Hosts" },
  { key: "Data Engineer", label: "Data Engineers" },
  { key: "Data Scientist", label: "Data Scientists" },
  { key: "Data Analyst", label: "Data Analysts" },
];
