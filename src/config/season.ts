// Season configuration - single source of truth for current season
export interface SeasonConfig {
  year: number;
  name: string;
  shortName: string;
  tagline: string;
  nominationsOpen: Date;
  nominationsClose: Date;
  votingOpen: Date;
  votingClose: Date;
  ceremonyDate: Date;
}

// This will be fetched from API - fallback defaults
export const DEFAULT_SEASON: SeasonConfig = {
  year: 2025,
  name: "NESA Africa Awards",
  shortName: "NESA 2025",
  tagline: "Celebrating African Excellence",
  nominationsOpen: new Date("2025-01-15"),
  nominationsClose: new Date("2025-03-31"),
  votingOpen: new Date("2025-04-15"),
  votingClose: new Date("2025-05-31"),
  ceremonyDate: new Date("2025-06-15"),
};

export type StageAction = 
  | "nominations" 
  | "public_voting" 
  | "jury_scoring" 
  | "results" 
  | "certificates";

export interface StageStatus {
  action: StageAction;
  isOpen: boolean;
  opensAt?: Date;
  closesAt?: Date;
}

export const STAGE_LABELS: Record<StageAction, string> = {
  nominations: "Nominations",
  public_voting: "Public Voting",
  jury_scoring: "Jury Scoring",
  results: "Results",
  certificates: "Certificates",
};
