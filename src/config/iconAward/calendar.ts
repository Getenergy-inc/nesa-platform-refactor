/**
 * Africa Education Icon Award 2026 — canonical calendar.
 * Single source of truth for every jury phase deadline used by
 * the client UI. The server enforces the same windows via
 * platform_config and the ballot/shortlist RPCs.
 */

export const ICON_CALENDAR = {
  screeningOpen:      new Date("2026-09-14T00:00:00Z"),
  screeningClose:     new Date("2026-09-30T23:59:59Z"),
  grandJuryOpen:      new Date("2026-10-01T00:00:00Z"),
  grandJuryClose:     new Date("2026-10-07T23:59:59Z"),
  governanceOpen:     new Date("2026-10-08T00:00:00Z"),
  governanceClose:    new Date("2026-10-15T23:59:59Z"),
  gala:               new Date("2026-10-22T18:00:00Z"),
} as const;

export type IconPhase =
  | "pre_screening"
  | "screening"
  | "grand_jury"
  | "governance_review"
  | "post_gala";

export interface IconPhaseInfo {
  phase: IconPhase;
  label: string;
  currentStart: Date | null;
  nextStart: Date | null;
  nextLabel: string | null;
}

export function getCurrentIconPhase(now: Date = new Date()): IconPhaseInfo {
  const c = ICON_CALENDAR;
  if (now < c.screeningOpen) {
    return {
      phase: "pre_screening",
      label: "NRC Verification",
      currentStart: null,
      nextStart: c.screeningOpen,
      nextLabel: "Specialist Panel Screening opens",
    };
  }
  if (now <= c.screeningClose) {
    return {
      phase: "screening",
      label: "Specialist Panel Screening",
      currentStart: c.screeningOpen,
      nextStart: c.grandJuryOpen,
      nextLabel: "Grand Jury Voting opens",
    };
  }
  if (now <= c.grandJuryClose) {
    return {
      phase: "grand_jury",
      label: "Grand Jury Voting",
      currentStart: c.grandJuryOpen,
      nextStart: c.governanceOpen,
      nextLabel: "Governance Review begins",
    };
  }
  if (now <= c.governanceClose) {
    return {
      phase: "governance_review",
      label: "Governance Review",
      currentStart: c.governanceOpen,
      nextStart: c.gala,
      nextLabel: "Africa Education Icon Awards Gala",
    };
  }
  return {
    phase: "post_gala",
    label: "Laureates Announced",
    currentStart: c.gala,
    nextStart: null,
    nextLabel: null,
  };
}

export const ICON_PHASE_TIMELINE: Array<{ key: IconPhase; label: string; date: Date }> = [
  { key: "pre_screening",      label: "NRC Verification",             date: ICON_CALENDAR.screeningOpen },
  { key: "screening",          label: "Specialist Panel Screening",   date: ICON_CALENDAR.screeningClose },
  { key: "grand_jury",         label: "Grand Jury Voting",            date: ICON_CALENDAR.grandJuryClose },
  { key: "governance_review",  label: "Governance Review",            date: ICON_CALENDAR.governanceClose },
  { key: "post_gala",          label: "Awards Gala",                  date: ICON_CALENDAR.gala },
];

export const ICON_ARENA_STATS = {
  judges: 27,
  pathways: 3,
  panels: 9,
  finalists: 27,
  laureates: 9,
  minNominees: 500,
} as const;
