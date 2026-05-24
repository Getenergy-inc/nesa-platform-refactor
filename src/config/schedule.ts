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

// Default schedule template - NESA 2026 single-year cycle (Jun → Oct 2026, Legacy through Oct 2027)
export const DEFAULT_SCHEDULE_TEMPLATE: ScheduleTemplate = {
  nominationReview: {
    nrcReviewStart: { monthDay: "05-01", yearOffset: 0 },
    nrcReviewEnd: { monthDay: "06-10", yearOffset: 0 },
    jurySelectionStart: { monthDay: "05-01", yearOffset: 0 },
    jurySelectionEnd: { monthDay: "06-10", yearOffset: 0 },
    juryOnboarding: { monthDay: "06-15", yearOffset: 0 },
  },
  tvShows: {
    platinumRecognition: { monthDay: "06-11", yearOffset: 0 },
    africaIconRecognition: { monthDay: "06-25", yearOffset: 0 },
    goldCertificateWinners: { monthDay: "10-01", yearOffset: 0 },
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
    rebuildMySchoolEnd: { monthDay: "10-22", yearOffset: 1 }, // +1 year from launch (Oct 2027)
  },
  webinars: {
    seriesStart: { monthDay: "06-01", yearOffset: 0 },
    seriesEnd: { monthDay: "10-22", yearOffset: 0 },
  },
  deadlines: {
    iconNominationsClose: { monthDay: "06-20", yearOffset: 0 },
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
  template: ScheduleTemplate = DEFAULT_SCHEDULE_TEMPLATE
): TimelineItem[] {
  // 2026 single-year cycle: all events happen within awardYear; legacy extends to awardYear + 1
  const ceremonyYear = awardYear;
  const legacyEndYear = awardYear + 1;
  
  return [
    {
      id: "webinars",
      phase: "EduAid-Africa Webinars",
      dateRange: `Jun – Oct ${awardYear}`,
      description: "Public education series on SDG 4, CSR, STEM, inclusion, and NESA standards",
      type: "awareness",
      isActive: true,
    },
    {
      id: "nrc-review",
      phase: "NRC Nominee Review",
      dateRange: `1 May – 10 Jun ${ceremonyYear}`,
      description: "Nominee Research Corps verifies all nominations for eligibility and governance compliance",
      type: "recognition",
    },
    {
      id: "jury-selection",
      phase: "Jury Selection & Onboarding",
      dateRange: `May – Jun ${ceremonyYear}`,
      description: "Applications reviewed, jury members selected and onboarded for scoring duties",
      type: "recognition",
    },
    {
      id: "platinum-show",
      phase: "Platinum Recognition Show",
      dateRange: `11 June ${ceremonyYear}`,
      description: "3-hour TV Show — Non-competitive baseline recognition of service",
      type: "recognition",
    },
    {
      id: "icon-show",
      phase: "Africa Education Icon Show",
      dateRange: `25 June ${ceremonyYear}`,
      description: "3-hour TV Show — Lifetime impact recognition (9 Icons)",
      type: "recognition",
    },
    {
      id: "icon-deadline",
      phase: "Icon Nominations Close",
      dateRange: `20 June ${ceremonyYear}`,
      description: "Final deadline for Africa Education Icon nominations",
      type: "deadline",
    },
    {
      id: "gold-voting",
      phase: "Gold Public Voting",
      dateRange: `13 Jul – 25 Sep ${ceremonyYear}`,
      description: "Mass participation voting across 135 sub-categories — Top 3 per subcategory (405 winners)",
      type: "voting",
      stageAction: "public_voting",
    },
    {
      id: "gold-show",
      phase: "Gold Certificate Winners Show",
      dateRange: `1 October ${ceremonyYear}`,
      description: "3-hour TV Show — 405 Gold Certificate winners announced",
      type: "recognition",
    },
    {
      id: "blue-garnet-voting",
      phase: "Blue Garnet Voting",
      dateRange: `2 – 22 October ${ceremonyYear}`,
      description: "40% public vote + 60% independent jury review",
      type: "voting",
      stageAction: "jury_scoring",
    },
    {
      id: "blue-garnet-gala",
      phase: "Blue Garnet Awards Gala",
      dateRange: `22 October ${ceremonyYear}`,
      description: "Grand ceremony in Lagos + live broadcast — 9 Blue Garnet winners",
      type: "gala",
    },
    {
      id: "rmsa-legacy",
      phase: "Rebuild My School Africa",
      dateRange: `Oct ${ceremonyYear} – Oct ${legacyEndYear}`,
      description: "Legacy phase: real school transformation across Africa's regions",
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
        "9 Blue Garnet Award winners",
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
