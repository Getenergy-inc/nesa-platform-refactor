// Schedule Configuration - Single Source of Truth for All Event Dates
// All dates are relative to the current season - NO hardcoded years in UI

import { type StageAction } from "./season";

export interface ScheduledEvent {
  id: string;
  name: string;
  type: "show" | "voting" | "gala" | "legacy" | "deadline" | "webinar";
  /** Date relative to season - will be computed from season config */
  date: Date;
  description?: string;
  venue?: string;
  broadcastPlatforms?: string[];
}

export interface TimelineItem {
  id: string;
  phase: string;
  dateRange: string;
  description: string;
  type: "awareness" | "recognition" | "voting" | "gala" | "legacy" | "deadline";
  stageAction?: StageAction;
  isActive?: boolean;
}

export interface AwardPhaseConfig {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  showDate: string;
  iconName: string;
  features: string[];
  colorHex: string;
}

// Helper to create season-relative dates
// monthDay format: "MM-DD" (e.g., "02-28" for Feb 28)
// year offset: 0 = award year, 1 = ceremony year
export function createSeasonDate(
  awardYear: number,
  monthDay: string,
  yearOffset: 0 | 1 = 1,
  time: string = "18:00:00"
): Date {
  const targetYear = awardYear + yearOffset;
  return new Date(`${targetYear}-${monthDay}T${time}`);
}

// Format date range for display
export function formatDateRange(
  awardYear: number,
  startMonthDay: string,
  endMonthDay: string,
  startYearOffset: 0 | 1 = 1,
  endYearOffset: 0 | 1 = 1
): string {
  const startDate = createSeasonDate(awardYear, startMonthDay, startYearOffset, "00:00:00");
  const endDate = createSeasonDate(awardYear, endMonthDay, endYearOffset, "00:00:00");
  
  const startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  if (startYear === endYear) {
    return `${startDate.getDate()} ${startMonth} – ${endDate.getDate()} ${endMonth} ${startYear}`;
  }
  return `${startDate.getDate()} ${startMonth} ${startYear} – ${endDate.getDate()} ${endMonth} ${endYear}`;
}

export function formatSingleDate(
  awardYear: number,
  monthDay: string,
  yearOffset: 0 | 1 = 1
): string {
  const date = createSeasonDate(awardYear, monthDay, yearOffset, "00:00:00");
  return date.toLocaleDateString("en-US", { 
    day: "numeric", 
    month: "long", 
    year: "numeric" 
  });
}

// Schedule template - dates relative to award year
// This defines WHEN events happen relative to the NESA year
export interface ScheduleTemplate {
  nominationReview: {
    nrcReviewStart: { monthDay: string; yearOffset: 0 | 1 };
    nrcReviewEnd: { monthDay: string; yearOffset: 0 | 1 };
    jurySelectionStart: { monthDay: string; yearOffset: 0 | 1 };
    jurySelectionEnd: { monthDay: string; yearOffset: 0 | 1 };
    juryOnboarding: { monthDay: string; yearOffset: 0 | 1 };
  };
  tvShows: {
    platinumRecognition: { monthDay: string; yearOffset: 0 | 1 };
    africaIconRecognition: { monthDay: string; yearOffset: 0 | 1 };
    goldCertificateWinners: { monthDay: string; yearOffset: 0 | 1 };
  };
  votingWindows: {
    goldVotingOpens: { monthDay: string; yearOffset: 0 | 1 };
    goldVotingCloses: { monthDay: string; yearOffset: 0 | 1 };
    blueGarnetVotingOpens: { monthDay: string; yearOffset: 0 | 1 };
    blueGarnetVotingCloses: { monthDay: string; yearOffset: 0 | 1 };
  };
  galas: {
    blueGarnetGala: { monthDay: string; yearOffset: 0 | 1 };
  };
  legacy: {
    rebuildMySchoolLaunch: { monthDay: string; yearOffset: 0 | 1 };
    rebuildMySchoolEnd: { monthDay: string; yearOffset: 0 | 1 };
  };
  webinars: {
    seriesStart: { monthDay: string; yearOffset: 0 | 1 };
    seriesEnd: { monthDay: string; yearOffset: 0 | 1 };
  };
  deadlines: {
    iconNominationsClose: { monthDay: string; yearOffset: 0 | 1 };
  };
}

// Default schedule template - NESA 2026 official timeline (per 2026 brief)
// Pre-nomination activation 1–30 Jul · Jury onboarding 29 Jun – 10 Sep
// Platinum show 7 Aug · Gold close 10 Aug · Icon opens 27 Jul · Icon show 21 Aug · Icon close 12 Sep
// Gold voting 15 Aug – 15 Sep · Gold winners 16 Sep · Blue Garnet voting 16 Sep – 22 Oct · Gala 22 Oct 2026
export const DEFAULT_SCHEDULE_TEMPLATE: ScheduleTemplate = {
  nominationReview: {
    nrcReviewStart: { monthDay: "05-01", yearOffset: 0 },
    nrcReviewEnd: { monthDay: "06-28", yearOffset: 0 },
    jurySelectionStart: { monthDay: "05-01", yearOffset: 0 },
    jurySelectionEnd: { monthDay: "06-28", yearOffset: 0 },
    juryOnboarding: { monthDay: "06-29", yearOffset: 0 },
  },
  tvShows: {
    platinumRecognition: { monthDay: "08-07", yearOffset: 0 },
    africaIconRecognition: { monthDay: "08-21", yearOffset: 0 },
    goldCertificateWinners: { monthDay: "09-16", yearOffset: 0 },
  },
  votingWindows: {
    goldVotingOpens: { monthDay: "08-15", yearOffset: 0 },
    goldVotingCloses: { monthDay: "09-15", yearOffset: 0 },
    blueGarnetVotingOpens: { monthDay: "09-16", yearOffset: 0 },
    blueGarnetVotingCloses: { monthDay: "10-22", yearOffset: 0 },
  },
  galas: {
    blueGarnetGala: { monthDay: "10-22", yearOffset: 0 },
  },
  legacy: {
    rebuildMySchoolLaunch: { monthDay: "10-23", yearOffset: 0 },
    rebuildMySchoolEnd: { monthDay: "10-22", yearOffset: 1 },
  },
  webinars: {
    seriesStart: { monthDay: "07-01", yearOffset: 0 },
    seriesEnd: { monthDay: "10-22", yearOffset: 0 },
  },
  deadlines: {
    iconNominationsClose: { monthDay: "09-12", yearOffset: 0 },
  },
};

// Build scheduled events from template for a given award year
export function buildScheduledEvents(
  awardYear: number,
  template: ScheduleTemplate = DEFAULT_SCHEDULE_TEMPLATE
): {
  tvShows: ScheduledEvent[];
  votingWindows: ScheduledEvent[];
  galas: ScheduledEvent[];
  legacy: ScheduledEvent[];
} {
  return {
    tvShows: [
      {
        id: "platinum-show",
        name: "Platinum Recognition Show",
        type: "show",
        date: createSeasonDate(awardYear, template.tvShows.platinumRecognition.monthDay, template.tvShows.platinumRecognition.yearOffset),
        description: "3-hour TV Show — Non-competitive baseline recognition of service",
      },
      {
        id: "icon-show",
        name: "Africa Icon Recognition Show",
        type: "show",
        date: createSeasonDate(awardYear, template.tvShows.africaIconRecognition.monthDay, template.tvShows.africaIconRecognition.yearOffset),
        description: "3-hour TV Show — Lifetime impact recognition",
      },
      {
        id: "gold-show",
        name: "Gold Certificate Winners Show",
        type: "show",
        date: createSeasonDate(awardYear, template.tvShows.goldCertificateWinners.monthDay, template.tvShows.goldCertificateWinners.yearOffset),
        description: "3-hour TV Show — 405 Gold Certificate winners announced",
      },
    ],
    votingWindows: [
      {
        id: "gold-voting",
        name: "Gold Public Voting Opens",
        type: "voting",
        date: createSeasonDate(awardYear, template.votingWindows.goldVotingOpens.monthDay, template.votingWindows.goldVotingOpens.yearOffset, "00:00:00"),
        description: "Mass participation voting across 135 sub-categories — Top 3 per subcategory",
      },
      {
        id: "blue-garnet-voting",
        name: "Blue Garnet Voting Opens",
        type: "voting",
        date: createSeasonDate(awardYear, template.votingWindows.blueGarnetVotingOpens.monthDay, template.votingWindows.blueGarnetVotingOpens.yearOffset, "00:00:00"),
        description: "40% public vote + 60% independent jury review",
      },
    ],
    galas: [
      {
        id: "blue-garnet-gala",
        name: "Blue Garnet Awards Gala",
        type: "gala",
        date: createSeasonDate(awardYear, template.galas.blueGarnetGala.monthDay, template.galas.blueGarnetGala.yearOffset),
        description: "Grand ceremony — 9 Blue Garnet winners",
        venue: "Lagos, Nigeria",
      },
    ],
    legacy: [
      {
        id: "rmsa-launch",
        name: "Rebuild My School Africa Launch",
        type: "legacy",
        date: createSeasonDate(awardYear, template.legacy.rebuildMySchoolLaunch.monthDay, template.legacy.rebuildMySchoolLaunch.yearOffset, "09:00:00"),
        description: "Legacy phase: 5 Special Needs facilities across Africa's regions",
      },
    ],
  };
}

// Build timeline from template for a given award year
export function buildTimeline(
  awardYear: number,
  _template: ScheduleTemplate = DEFAULT_SCHEDULE_TEMPLATE,
): TimelineItem[] {
  // NESA-Africa 2026 official timeline — single source of truth.
  const ceremonyYear = awardYear;
  const legacyEndYear = awardYear + 1;

  return [
    {
      id: "kickoff",
      phase: "Public Pre-Nomination Activation",
      dateRange: `1 – 30 July ${ceremonyYear}`,
      description:
        "Early public engagement — pre-nomination forms, graphics, and a weekly storytelling calendar invite Gen Z audiences across Africa, the diaspora and friends of Africa to surface education changemakers before official nominations open.",
      type: "awareness",
      isActive: true,
    },
    {
      id: "webinars",
      phase: "EduAid-Africa Webinars",
      dateRange: `July – Oct ${ceremonyYear}`,
      description: "Public education series on SDG 4, CSR, STEM, inclusion, and NESA standards.",
      type: "awareness",
    },
    {
      id: "jury-onboarding",
      phase: "Jury Onboarding",
      dateRange: `29 June – 10 September ${ceremonyYear}`,
      description: "Orientation, governance review, conflict-of-interest guidance and scoring calibration for selected jury members.",
      type: "recognition",
    },
    {
      id: "icon-nominations",
      phase: "Africa Education Icon Nominations Open",
      dateRange: `27 July – 12 September ${ceremonyYear}`,
      description: "Two-month nomination window for Africa Education Icon — Lifetime Achievement (2006–2026).",
      type: "recognition",
    },
    {
      id: "platinum-show",
      phase: "Platinum Recognition Show",
      dateRange: `7 August ${ceremonyYear}`,
      description: "Launches the public season with baseline recognition of institutional and leadership impact across education.",
      type: "recognition",
    },
    {
      id: "gold-close",
      phase: "Gold Certificate Nominations Close",
      dateRange: `10 August ${ceremonyYear}`,
      description: "Final deadline for Influencers Education Impact Award entries before voting and category review.",
      type: "deadline",
    },
    {
      id: "icon-show",
      phase: "Africa Education Icon Show",
      dateRange: `21 August ${ceremonyYear}`,
      description: "Honours transformational leaders whose work has shaped African education over the past two decades.",
      type: "recognition",
    },
    {
      id: "gold-voting",
      phase: "Gold Certificate AGC Voting",
      dateRange: `15 August – 15 September ${ceremonyYear}`,
      description: "100% public AGC voting for the Influencers Education Impact Award.",
      type: "voting",
      stageAction: "public_voting",
    },
    {
      id: "icon-deadline",
      phase: "Africa Education Icon Nominations Close",
      dateRange: `12 September ${ceremonyYear}`,
      description: "Final deadline for Africa Education Icon (Lifetime Achievement) nominations.",
      type: "deadline",
    },
    {
      id: "gold-show",
      phase: "Gold Certificate Winners Show",
      dateRange: `16 September ${ceremonyYear}`,
      description: "Official announcement of Influencers Education Impact Award 2026 winners — broadcast live as the kick-off of the Blue Garnet voting window.",
      type: "recognition",
    },
    {
      id: "momentum",
      phase: "Momentum Phase",
      dateRange: `16 September – 15 October ${ceremonyYear}`,
      description: "Storytelling, media, partnership and audience-building activations running alongside Blue Garnet voting — carrying visibility from the Gold Winners Show into the final stretch before the Gala.",
      type: "awareness",
    },
    {
      id: "blue-garnet-voting",
      phase: "Blue Garnet Voting",
      dateRange: `16 September – 22 October ${ceremonyYear}`,
      description: "Final competitive voting window — 60% independent jury + 40% public AGC. Closes on Gala day for transparency and suspense.",
      type: "voting",
      stageAction: "jury_scoring",
    },
    {
      id: "blue-garnet-gala",
      phase: "Blue Garnet Awards Gala",
      dateRange: `22 October ${ceremonyYear}`,
      description: "Live ceremony in Lagos — Blue Garnet winners announced.",
      type: "gala",
    },
    {
      id: "rmsa-legacy",
      phase: "Rebuild My School Africa",
      dateRange: `23 Oct ${ceremonyYear} – Oct ${legacyEndYear}`,
      description: "Legacy impact phase: real school transformation across Africa's regions.",
      type: "legacy",
    },
  ];
}

// Award phases configuration
export function buildAwardPhases(awardYear: number): AwardPhaseConfig[] {
  // 2026 single-year cycle
  const ceremonyYear = awardYear;
  
  return [
    {
      id: "platinum",
      title: "Platinum Certificate",
      subtitle: "Baseline Recognition of Service",
      period: `May – June ${ceremonyYear}`,
      showDate: `11 June ${ceremonyYear}`,
      iconName: "Medal",
      features: [
        "Non-competitive entry layer",
        "Verification by NESA Nominee Research Corps (NRC)",
        "Governance & safeguarding checks",
        "Certificate validity: 1 year",
        "Global QR-code authentication",
      ],
      colorHex: "#E5E4E2",
    },
    {
      id: "icon",
      title: "Africa Education Icon",
      subtitle: "Lifetime Impact Recognition",
      period: `May – June ${ceremonyYear}`,
      showDate: `25 June ${ceremonyYear}`,
      iconName: "Crown",
      features: [
        "Honours 9 Icons only",
        `Documented impact 2006–${awardYear}`,
        "African regions + diaspora + Friends of Africa",
        "Non-competitive lifetime recognition",
        "Independent verification",
      ],
      colorHex: "#C4A052",
    },
    {
      id: "gold",
      title: "Gold Certificate",
      subtitle: "Competitive Classification Stage",
      period: `15 August – 15 September ${ceremonyYear}`,
      showDate: `1 October ${ceremonyYear}`,
      iconName: "Trophy",
      features: [
        "9 Award Categories",
        "135 Sub-Categories",
        "1 Gold Winner per Sub-Category",
        "Public voting only — no judges",
        "Transparent digital audit trail",
      ],
      colorHex: "#FFD700",
    },
    {
      id: "blue-garnet",
      title: "Blue Garnet Award",
      subtitle: "Highest Competitive Honour",
      period: `16 September – 22 October ${ceremonyYear}`,
      showDate: `22 October ${ceremonyYear} (Gala)`,
      iconName: "Gem",
      features: [
        "From 135 Gold Certificate winners",
        "9 Blue Garnet Recognition recipients",
        "40% Public Voting + 60% Jury Review",
        "Elite continental honour",
        "Blue Garnet stone in certificate & plaque",
      ],
      colorHex: "#1E3A5F",
    },
  ];
}

// Webinar themes (static content)
export const WEBINAR_THEMES = [
  { id: "sdg4", theme: "Education for All & SDG 4", iconName: "GraduationCap" },
  { id: "csr", theme: "CSR & Private Sector Education Impact", iconName: "Building2" },
  { id: "ngo", theme: "NGOs & Community-Driven Education", iconName: "Heart" },
  { id: "stem", theme: "STEM & Innovation", iconName: "Target" },
  { id: "arts", theme: "Creative Arts & Education", iconName: "Sparkles" },
  { id: "inclusion", theme: "Inclusion, Disability & Special Needs", iconName: "Accessibility" },
];

// Legacy regions (static content)
export const LEGACY_REGIONS = [
  "North Africa",
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
];

// Watch platforms (static content)
export const WATCH_PLATFORMS = [
  { id: "youtube", name: "YouTube", iconName: "Youtube" },
  { id: "facebook", name: "Facebook", iconName: "Facebook" },
  { id: "cast-tv", name: "CAST TV App", iconName: "Tv" },
];
