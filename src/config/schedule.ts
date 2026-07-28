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

// Default schedule template - NESA 2026 official timeline (per 2026 Master Timeline)
// Pre-nomination activation 1–31 Jul · Jury onboarding 29 Jun – 10 Sep
// PUBLIC NOMINATIONS OPEN FOR ALL 4 TIERS: 1 August 2026
// Icon nominations 1 Aug – 12 Sep · Platinum show 7 Aug · Icon show 21 Aug
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
    blueGarnetGala: { monthDay: "12-14", yearOffset: 0 },
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
      id: "phase-1-pre-nomination",
      phase: "Phase 1 · Public Pre-Nomination Activation",
      dateRange: `1 – 30 July ${ceremonyYear}`,
      description:
        "Continental awareness campaign introducing NESA-Africa 2026. Volunteer recruitment, nomination education, regional media tours and daily social campaigns invite citizens to identify Education Enablers before official nominations open.",
      type: "awareness",
      isActive: true,
    },
    {
      id: "phase-2-jury-onboarding",
      phase: "Phase 2 · Independent Jury Onboarding",
      dateRange: `29 June – 10 September ${ceremonyYear}`,
      description:
        "Independent judging panels prepared to safeguard the integrity of the recognition process — jury interviews, governance features and transparency campaigns.",
      type: "recognition",
    },
    {
      id: "phase-3-icon-nominations",
      phase: "Phase 3 · Africa Education Icon Nominations",
      dateRange: `1 August – 12 September ${ceremonyYear}`,
      description:
        "Public nominations for all four Recognition Tiers open on 1 August 2026. The Africa Education Icon window closes 12 September — celebrating transformational Education Enablers (2006–2026).",
      type: "recognition",
    },
    {
      id: "webinar-week-1",
      phase: "Webinar Week 1 · Influencer Education Impact FGD",
      dateRange: `3 – 7 August ${ceremonyYear}`,
      description:
        "EduAid-Africa Focus Group Discussion opening the 7-week continental series — spotlighting Sports, Music and Social Media Influencers advancing Education for All across Africa.",
      type: "awareness",
    },
    {
      id: "webinar-week-2",
      phase: "Webinar Week 2 · Africa Education Icon FGD",
      dateRange: `10 – 14 August ${ceremonyYear}`,
      description:
        "Lifetime recognition dialogue celebrating two decades (2006–2026) of transformational Education Enablers — Philanthropy, Literacy and Technical Education leaders.",
      type: "awareness",
    },
    {
      id: "webinar-week-3",
      phase: "Webinar Week 3 · Gold–Blue Garnet I — CSR, STEM & EdTech",
      dateRange: `17 – 21 August ${ceremonyYear}`,
      description:
        "Corporate Social Responsibility, STEM leadership and EdTech innovation Enablers of Education for All Across Africa.",
      type: "awareness",
    },
    {
      id: "webinar-week-4",
      phase: "Webinar Week 4 · Gold–Blue Garnet II — Media, Creative Arts & Policy",
      dateRange: `24 – 28 August ${ceremonyYear}`,
      description:
        "Media, Creative Arts and Public Policy Enablers driving education transformation across the continent.",
      type: "awareness",
    },
    {
      id: "webinar-week-5",
      phase: "Webinar Week 5 · Gold–Blue Garnet III — Partnerships, NGOs & Community Education",
      dateRange: `31 August – 4 September ${ceremonyYear}`,
      description:
        "Partnerships, NGOs and Community Education Enablers extending learning access to the last mile.",
      type: "awareness",
    },
    {
      id: "webinar-week-6",
      phase: "Webinar Week 6 · Platinum Institutions — Government, Universities & Faith-Based",
      dateRange: `7 – 11 September ${ceremonyYear}`,
      description:
        "Platinum Institutional Enablers — Government agencies, Universities and Faith-Based Organisations advancing Education for All.",
      type: "awareness",
    },
    {
      id: "webinar-week-7",
      phase: "Webinar Week 7 · Continental Pre-Voting Forum & AGC Voting Education",
      dateRange: `14 – 15 September ${ceremonyYear}`,
      description:
        "Continental Pre-Voting Forum preparing citizens for the AGC-powered Gold-Blue Garnet voting phases with transparency and integrity training.",
      type: "awareness",
    },
    {
      id: "weekly-news",
      phase: "NESA-Africa Weekly News",
      dateRange: `Every Friday · July – October ${ceremonyYear}`,
      description:
        "Weekly Friday news broadcast tracking nominations, jury updates, regional stories, sponsor features and public voting momentum across the full campaign cycle.",
      type: "awareness",
    },
    {
      id: "platinum-showcase",
      phase: "Platinum Recognition Showcase",
      dateRange: `7 August ${ceremonyYear}`,
      description:
        "EduAid-Africa Week 1 event — celebrating Influencer Education Impact (Sports, Music and Social Media icons supporting education).",
      type: "recognition",
    },
    {
      id: "icon-showcase",
      phase: "Africa Education Icon Showcase",
      dateRange: `21 August ${ceremonyYear}`,
      description:
        "EduAid-Africa Week 3 recognition event honouring two decades of educational leadership across Philanthropy, Literacy and Technical Education.",
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
      id: "phase-4-influencer-winners",
      phase: "Phase 4 · Influencer Education Impact Winners Show",
      dateRange: `16 September ${ceremonyYear}`,
      description:
        "Winners of the Influencer Education Impact Awards are announced, officially launching the final continental campaign toward the Gold–Blue Garnet Awards Gala.",
      type: "recognition",
    },
    {
      id: "daily-momentum",
      phase: "Daily Continental Momentum Campaign",
      dateRange: `16 September – 21 October ${ceremonyYear}`,
      description:
        "Daily activations across the continent — nominee spotlights, regional stories, sponsor features, social takeovers and NESA Africa TV live broadcasts every day for six weeks leading into the Gala.",
      type: "awareness",
    },
    {
      id: "phase-5-momentum",
      phase: "Phase 5 · Continental Momentum Campaign",
      dateRange: `16 September – 21 October ${ceremonyYear}`,
      description:
        "Six weeks of continent-wide visibility combining weekly EduAid webinars (Education Innovation · CSR Partnerships · Higher Education · Creative Arts & Media · Inclusive Education · Recognition→Impact→Legacy), Friday NESA-Africa Weekly News and daily momentum activations.",
      type: "awareness",
    },
    {
      id: "phase-6-blue-garnet-voting",
      phase: "Phase 6 · Gold–Blue Garnet Public Voting",
      dateRange: `16 September – 22 October ${ceremonyYear}`,
      description:
        "Transparent public participation via the AGC framework combined with independent jury review (40% public + 60% jury) determines the final Gold–Blue Garnet honourees.",
      type: "voting",
      stageAction: "jury_scoring",
    },
    {
      id: "phase-7-gala",
      phase: "Phase 7 · Gold–Blue Garnet Awards Gala",
      dateRange: `22 October ${ceremonyYear}`,
      description:
        "Africa's flagship education recognition ceremony on 22 October 2026 celebrating the continent's leading Education Enablers across 15 regions (8 Africa + 7 Global).",
      type: "gala",
    },
    {
      id: "phase-8-impact-legacy",
      phase: "Phase 8 · Recognition → Impact → Legacy",
      dateRange: `October ${ceremonyYear} – October ${legacyEndYear}`,
      description:
        "Recognition transitions into measurable impact: EduAid-Africa · Rebuild My School Africa · Scholarships · Afri-EduTourism · Teacher Capacity Development · Inclusive Education · School Infrastructure · Annual Impact Reporting.",
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
      period: `July – August ${ceremonyYear}`,
      showDate: `7 August ${ceremonyYear}`,
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
      period: `1 August – 12 September ${ceremonyYear}`,
      showDate: `21 August ${ceremonyYear}`,
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
      showDate: `16 September ${ceremonyYear}`,
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

// Webinar themes — 7-week EduAid-Africa Focus Group Series (Aug–Sep 2026)
export const WEBINAR_THEMES = [
  { id: "week-1-influencer", theme: "Week 1 · Influencer Education Impact FGD (3–7 Aug)", iconName: "Sparkles" },
  { id: "week-2-icon", theme: "Week 2 · Africa Education Icon FGD (10–14 Aug)", iconName: "Crown" },
  { id: "week-3-gbg-i", theme: "Week 3 · Gold–Blue Garnet I — CSR, STEM & EdTech (17–21 Aug)", iconName: "Target" },
  { id: "week-4-gbg-ii", theme: "Week 4 · Gold–Blue Garnet II — Media, Creative Arts & Policy (24–28 Aug)", iconName: "Sparkles" },
  { id: "week-5-gbg-iii", theme: "Week 5 · Gold–Blue Garnet III — Partnerships, NGOs & Community (31 Aug–4 Sep)", iconName: "Heart" },
  { id: "week-6-platinum", theme: "Week 6 · Platinum Institutions — Government, Universities & Faith-Based (7–11 Sep)", iconName: "Building2" },
  { id: "week-7-pre-voting", theme: "Week 7 · Continental Pre-Voting Forum & AGC Voting Education (14–15 Sep)", iconName: "GraduationCap" },
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
