// NESA-Africa Contributors Hall of Fame
// Volunteers, Interns, Judges, BOA, Ambassadors — 2021 to date
// Includes the specific contribution areas each volunteer led.

export type ContributorRole =
  | "Volunteer"
  | "Intern"
  | "Judge"
  | "BOA"
  | "Ambassador"
  | "Partner";

/** Functional areas a volunteer/intern contributed to */
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
  | "Event Production"
  | "Public Relations"
  | "Research & Nominee Vetting"
  | "Judging & Adjudication"
  | "Fundraising"
  | "Partnerships"
  | "Community Outreach"
  | "Chapter Coordination"
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
  "Event Production",
  "Public Relations",
  "Research & Nominee Vetting",
  "Judging & Adjudication",
  "Fundraising",
  "Partnerships",
  "Community Outreach",
  "Chapter Coordination",
  "Legal & Compliance",
  "Finance & Operations",
  "Mentorship",
  "Technology & DevOps",
];

export interface Contributor {
  id: string;
  name: string;
  role: ContributorRole;
  title?: string;
  country?: string;
  yearStart: number;
  yearEnd?: number; // undefined = present
  imageUrl?: string;
  bio?: string;
  /** Functional areas this contributor worked on */
  contributions?: ContributionArea[];
  /** Optional headline credit, e.g. "Designed the official NESA-Africa logo" */
  highlight?: string;
}

// Seed list — extend as records are confirmed.
export const CONTRIBUTORS: Contributor[] = [
  // ─── 2021 ───────────────────────────────────────────────────────────
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
    highlight: "Drafted the founding award narratives and press copy.",
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
    id: "v-2024-pr",
    name: "PR & Outreach Volunteer",
    role: "Volunteer",
    country: "Rwanda",
    yearStart: 2024,
    contributions: ["Public Relations", "Community Outreach", "Partnerships"],
  },

  // ─── 2025 ───────────────────────────────────────────────────────────
  {
    id: "amb-2025-01",
    name: "Regional Ambassador",
    role: "Ambassador",
    country: "Egypt",
    yearStart: 2025,
    contributions: ["Community Outreach", "Chapter Coordination", "Partnerships"],
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
];

export const ROLE_TABS: { key: ContributorRole | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Volunteer", label: "Volunteers" },
  { key: "Intern", label: "Interns" },
  { key: "Judge", label: "Judges" },
  { key: "BOA", label: "Board of Advisors" },
  { key: "Ambassador", label: "Ambassadors" },
];
