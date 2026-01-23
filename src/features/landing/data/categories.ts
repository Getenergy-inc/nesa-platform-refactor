// Award Categories Data
// Static content for the landing page - will be replaced by API data in future

export interface AwardCategoryDisplay {
  id: string;
  name: string;
  description: string;
  type: "lifetime" | "competitive" | "non-competitive";
  link: string;
}

export interface NominationPath {
  id: string;
  title: string;
  badge: string;
  periodType: "lifetime" | "annual" | "merit";
  description: string;
  features: string[];
  link: string;
  iconName: string;
}

// Helper to build period string based on type
export function buildPeriodString(periodType: NominationPath["periodType"], displayYear: number): string {
  switch (periodType) {
    case "lifetime":
      return `2005–${displayYear}`;
    case "annual":
      return "Annual Competition";
    case "merit":
      return "Merit-Based";
    default:
      return "";
  }
}

// Award categories for display on landing page
export const AWARD_CATEGORIES_DISPLAY: AwardCategoryDisplay[] = [
  {
    id: "africa-icon",
    name: "Africa Icon Blue Garnet Award",
    description: "Lifetime Achievement (10+ years of institutional impact)",
    type: "lifetime",
    link: "/categories/africa-lifetime-education-icon",
  },
  {
    id: "blue-garnet-gold",
    name: "Blue Garnet & Gold Certificate Awards",
    description: "Public voting + expert judging across 135 subcategories",
    type: "competitive",
    link: "/categories",
  },
  {
    id: "platinum",
    name: "Platinum Certificate of Recognition",
    description: "Merit-based recognition through expert panel evaluation",
    type: "non-competitive",
    link: "/categories",
  },
  {
    id: "student",
    name: "Outstanding Student Award",
    description: "Recognizing academic excellence and leadership",
    type: "competitive",
    link: "/categories",
  },
  {
    id: "teacher",
    name: "Teacher of Excellence",
    description: "Honoring educators making exceptional impact",
    type: "competitive",
    link: "/categories",
  },
  {
    id: "innovation",
    name: "Innovation in Education",
    description: "Rewarding creative teaching approaches",
    type: "competitive",
    link: "/categories",
  },
];

// Nomination paths for the landing page
export const NOMINATION_PATHS_DISPLAY: NominationPath[] = [
  {
    id: "lifetime",
    title: "Lifetime Achievement",
    badge: "Africa Icon Blue Garnet Award",
    periodType: "lifetime",
    description: "Reserved for lifetime achievement. Nominees must have 10+ years institutional achievements.",
    features: ["Institutional Achievements", "Long-term Impact", "Legacy Recognition"],
    link: "/categories/africa-lifetime-education-icon",
    iconName: "Crown",
  },
  {
    id: "public-voting",
    title: "Public Voting",
    badge: "Blue Garnet & Gold Certificate Awards",
    periodType: "annual",
    description: "Open competition with public participation through AGC voting and expert judging.",
    features: ["Public Voting", "Expert Judging", "135 Subcategories"],
    link: "/categories",
    iconName: "Vote",
  },
  {
    id: "expert-selection",
    title: "Expert Selection",
    badge: "Platinum Certificate of Recognition",
    periodType: "merit",
    description: "Merit-based recognition through expert panel evaluation and institutional review.",
    features: ["No Voting", "Internal Judging", "Global Nomination"],
    link: "/categories",
    iconName: "Gem",
  },
];

// Programme pillars
export interface ProgrammePillar {
  id: string;
  title: string;
  platform: string;
  description: string;
  iconName: string;
}

export const PROGRAMME_PILLARS: ProgrammePillar[] = [
  {
    id: "education",
    title: "Public Education & Awareness",
    platform: "EduAid-Africa Webinar Series",
    iconName: "Radio",
    description: "Stakeholder education on challenges, standards, and informed participation",
  },
  {
    id: "recognition",
    title: "Recognition & Standards",
    platform: "NESA-Africa Awards Cycle",
    iconName: "Award",
    description: "Standards-based continental education recognition and accountability",
  },
  {
    id: "legacy",
    title: "Legacy Impact",
    platform: "Rebuild My School Africa",
    iconName: "School",
    description: "Post-award infrastructure projects for inclusive education",
  },
];

// Stats for display
export interface StatDisplay {
  value: string;
  label: string;
}

export const STATS_DISPLAY: StatDisplay[] = [
  { value: "15+", label: "Years Running" },
  { value: "54", label: "African Countries" },
  { value: "10,000+", label: "Nominees" },
  { value: "1,000+", label: "Awardees" },
];

// Firewall/integrity items
export interface FirewallItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export const FIREWALL_ITEMS: FirewallItem[] = [
  {
    id: "platinum",
    title: "Platinum",
    description: "Non-competitive. NRC verification + governance checks.",
    iconName: "Shield",
  },
  {
    id: "gold",
    title: "Gold Stage",
    description: "100% public voting only — no judges.",
    iconName: "Vote",
  },
  {
    id: "blue-garnet",
    title: "Blue Garnet",
    description: "60% jury + 40% public. Audit logs & anti-fraud controls.",
    iconName: "Scale",
  },
  {
    id: "sponsors",
    title: "Sponsors",
    description: "Sponsors and endorsers cannot influence or select winners.",
    iconName: "Users",
  },
];

// Get Involved CTAs
export interface InvolvementCTA {
  id: string;
  label: string;
  href: string;
  iconName: string;
  external?: boolean;
}

export const INVOLVEMENT_CTAS: InvolvementCTA[] = [
  { id: "nominate", label: "Nominate", href: "/nominate", iconName: "Award" },
  { id: "vote", label: "Vote", href: "/vote", iconName: "Vote" },
  { id: "tickets", label: "Get Tickets", href: "/tickets", iconName: "Ticket" },
  { id: "donate", label: "Donate", href: "/donate", iconName: "Heart" },
  { id: "partner", label: "Partner", href: "/partner", iconName: "Handshake" },
];

// Quick nav items for hero
export interface QuickNavItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  external?: boolean;
}

export const QUICK_NAV_ITEMS: QuickNavItem[] = [
  { id: "refer", label: "Refer", href: "#refer", iconName: "Users" },
  { id: "nominate", label: "Nominate", href: "/nominate", iconName: "Trophy" },
  { id: "vision", label: "Vision 2035", href: "#vision-2035", iconName: "Eye" },
  { id: "tickets", label: "Tickets", href: "/tickets", iconName: "Calendar" },
  { id: "watch", label: "Watch", href: "#watch", iconName: "Play" },
];

// NESA workflow steps
export const WORKFLOW_STEPS = [
  "Webinar",
  "Platinum",
  "Icon",
  "Gold",
  "Blue Garnet",
  "RMSA Legacy",
];

// Legacy focus areas
export const LEGACY_FOCUS_AREAS = [
  "Inclusive classrooms",
  "Accessibility & assistive facilities",
  "Learning resources for children with disabilities",
];

// Funding channels
export const FUNDING_CHANNELS = [
  "Ticket contributions",
  "EduAid-Africa donations",
  "CSR & partner contributions",
  "Post-award campaigns",
];
