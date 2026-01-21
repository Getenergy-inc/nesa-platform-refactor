// Season Configuration - Single Source of Truth
// No hardcoded years in UI - all text derived from this config

export interface Edition {
  key: string; // e.g., "2025"
  name: string; // e.g., "NESA-Africa 2025"
  displayYear: number; // The award year (2025)
  ceremonyYear: number; // When ceremony is hosted (2026)
  tagline: string;
  theme: string;
  nominationsOpen: string; // ISO date
  nominationsClose: string;
  votingOpen: string;
  votingClose: string;
  ceremonyDate: string;
  isActive: boolean;
}

export interface SeasonConfig {
  currentEditionKey: string;
  editions: Record<string, Edition>;
  transitionRules: TransitionRules;
}

export interface TransitionRules {
  // When to show "coming soon" for next edition
  showNextEditionPreview: boolean;
  // Days before ceremony to lock voting
  votingLockoutDays: number;
  // Days after ceremony to allow certificate downloads
  certificateAvailableDays: number;
  // Allow viewing past edition archives
  allowArchiveAccess: boolean;
}

// Default configuration - will be overridden by API
export const DEFAULT_SEASON_CONFIG: SeasonConfig = {
  currentEditionKey: "2025",
  editions: {
    "2025": {
      key: "2025",
      name: "NESA-Africa 2025",
      displayYear: 2025,
      ceremonyYear: 2026,
      tagline: "Honoring Africa's Changemakers",
      theme: "Building the Future of Education",
      nominationsOpen: "2025-01-15",
      nominationsClose: "2025-06-30",
      votingOpen: "2025-07-15",
      votingClose: "2025-11-30",
      ceremonyDate: "2026-06-15",
      isActive: true,
    },
    "2026": {
      key: "2026",
      name: "NESA-Africa 2026",
      displayYear: 2026,
      ceremonyYear: 2027,
      tagline: "Elevating African Excellence",
      theme: "Innovation in Education",
      nominationsOpen: "2026-01-15",
      nominationsClose: "2026-06-30",
      votingOpen: "2026-07-15",
      votingClose: "2026-11-30",
      ceremonyDate: "2027-06-15",
      isActive: false,
    },
  },
  transitionRules: {
    showNextEditionPreview: false,
    votingLockoutDays: 14,
    certificateAvailableDays: 30,
    allowArchiveAccess: true,
  },
};

// Stage action types
export type StageAction =
  | "nominations"
  | "public_voting"
  | "jury_scoring"
  | "results"
  | "certificates";

export interface StageStatus {
  action: StageAction;
  isOpen: boolean;
  opensAt: string | null;
  closesAt: string | null;
}

export interface SeasonStageResponse {
  currentEditionKey: string;
  edition: Edition;
  stages: StageStatus[];
  transitionRules: TransitionRules;
  serverTime: string;
}

export const STAGE_LABELS: Record<StageAction, string> = {
  nominations: "Nominations",
  public_voting: "Public Voting",
  jury_scoring: "Jury Scoring",
  results: "Results",
  certificates: "Certificates",
};

export const STAGE_DESCRIPTIONS: Record<StageAction, string> = {
  nominations: "Submit nominations for outstanding individuals and organizations",
  public_voting: "Cast your vote for your favorite nominees",
  jury_scoring: "Expert jury evaluates Blue Garnet category nominees",
  results: "View the winners and finalists",
  certificates: "Download and verify award certificates",
};

// Helper functions for season-aware text
export function getEditionDisplayName(edition: Edition): string {
  return edition.name;
}

export function getEditionBannerText(edition: Edition, stageOpen: StageAction | null): string {
  const name = edition.name;
  
  if (stageOpen === "nominations") {
    return `${name} — Nominations Open Now`;
  }
  if (stageOpen === "public_voting") {
    return `${name} — Voting Open Now`;
  }
  if (stageOpen === "jury_scoring") {
    return `${name} — Jury Evaluation in Progress`;
  }
  if (stageOpen === "results") {
    return `${name} — Results Announced`;
  }
  if (stageOpen === "certificates") {
    return `${name} — Certificates Available`;
  }
  
  return `${name} — Coming Soon`;
}

export function getCeremonyDateDisplay(edition: Edition): string {
  const date = new Date(edition.ceremonyDate);
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function isEditionUpcoming(edition: Edition): boolean {
  const now = new Date();
  const nominationsOpen = new Date(edition.nominationsOpen);
  return now < nominationsOpen;
}

export function isEditionPast(edition: Edition): boolean {
  const now = new Date();
  const ceremonyDate = new Date(edition.ceremonyDate);
  return now > ceremonyDate;
}

export function getNextEditionKey(config: SeasonConfig): string | null {
  const currentYear = parseInt(config.currentEditionKey);
  const nextKey = (currentYear + 1).toString();
  return config.editions[nextKey] ? nextKey : null;
}

export function getPreviousEditionKey(config: SeasonConfig): string | null {
  const currentYear = parseInt(config.currentEditionKey);
  const prevKey = (currentYear - 1).toString();
  return config.editions[prevKey] ? prevKey : null;
}

// Safe mode: fallback to defaults if edition not found
export function getEditionSafe(config: SeasonConfig, key?: string): Edition {
  const targetKey = key || config.currentEditionKey;
  const edition = config.editions[targetKey];
  
  if (!edition) {
    // Fallback to current edition or first available
    return config.editions[config.currentEditionKey] || Object.values(config.editions)[0];
  }
  
  return edition;
}
