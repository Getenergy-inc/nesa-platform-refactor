/**
 * NESA-Africa 2025 - Voting Governance Types
 * Types for contests, results, fraud detection, and admin dashboard
 */

// ==========================================
// ENUMS & CONSTANTS
// ==========================================

export type ContestType = 
  | "GOLD_PUBLIC" 
  | "BLUE_PUBLIC" 
  | "BLUE_JUDGES" 
  | "ICON_LIFETIME_JUDGES";

export type VoteRejectionReason = 
  | "DUPLICATE_VOTE"
  | "STAGE_CLOSED"
  | "NOT_VERIFIED"
  | "NOT_ELIGIBLE"
  | "INSUFFICIENT_BALANCE"
  | "COI_CONFLICT"
  | "RATE_LIMITED";

export type ResultStatus = "PENDING" | "COMPUTED" | "VERIFIED" | "PUBLISHED";

export type FraudFlagType = "BURST" | "DEVICE_REUSE" | "IP_CLUSTER" | "ABNORMAL_PATTERN";
export type FraudSeverity = "low" | "medium" | "high" | "critical";
export type FraudFlagStatus = "pending" | "investigating" | "resolved" | "false_positive";

// ==========================================
// CONTEST TYPES
// ==========================================

export interface Contest {
  id: string;
  season_id: string;
  contest_type: ContestType;
  name: string;
  description: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  opens_at: string | null;
  closes_at: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ==========================================
// VOTE TYPES
// ==========================================

export interface VoteWithMetadata {
  id: string;
  voter_id: string;
  nominee_id: string;
  season_id: string;
  vote_type: "public" | "jury";
  score: number;
  device_hash: string | null;
  ip_hash: string | null;
  contest_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  created_at: string;
}

export interface VoteRejection {
  id: string;
  voter_id: string | null;
  nominee_id: string | null;
  season_id: string | null;
  contest_id: string | null;
  rejection_reason: VoteRejectionReason;
  device_hash: string | null;
  ip_hash: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ==========================================
// RESULT TYPES
// ==========================================

export interface ComputedResult {
  id: string;
  season_id: string;
  contest_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  nominee_id: string;
  public_votes: number;
  public_score: number;
  jury_votes: number;
  jury_score: number;
  final_score: number;
  rank: number | null;
  is_winner: boolean;
  computation_id: string | null;
  computation_inputs: Record<string, unknown>;
  computation_log: string | null;
  result_status: ResultStatus;
  computed_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  published_at: string | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  nominee?: {
    id: string;
    name: string;
    slug: string;
    photo_url: string | null;
    organization: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ComputationResult {
  success: boolean;
  computation_id: string;
  results_count: number;
}

export interface PublishResult {
  success: boolean;
  published_count: number;
  error?: string;
}

// ==========================================
// FRAUD FLAGS
// ==========================================

export interface FraudFlag {
  id: string;
  season_id: string;
  flag_type: FraudFlagType;
  severity: FraudSeverity;
  voter_id: string | null;
  nominee_id: string | null;
  device_hash: string | null;
  ip_hash: string | null;
  vote_count: number | null;
  time_window_seconds: number | null;
  description: string | null;
  evidence: Record<string, unknown>;
  flag_status: FraudFlagStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// JURY SUBMISSION
// ==========================================

export interface JurySubmission {
  id: string;
  judge_user_id: string;
  contest_id: string | null;
  season_id: string;
  submitted_at: string;
  is_locked: boolean;
  total_assignments: number;
  completed_assignments: number;
  recused_assignments: number;
  confirmation_hash: string | null;
  created_at: string;
}

// ==========================================
// ADMIN DASHBOARD TYPES
// ==========================================

export interface VotingStageStatus {
  gold_voting: {
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    total_votes: number;
    unique_voters: number;
  };
  blue_garnet_voting: {
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    total_votes: number;
    unique_voters: number;
  };
  jury_scoring: {
    is_open: boolean;
    opens_at: string | null;
    closes_at: string | null;
    completed_assignments: number;
    pending_assignments: number;
  };
}

export interface VotingDashboardStats {
  total_votes_today: number;
  total_votes_week: number;
  total_votes_season: number;
  active_voters: number;
  fraud_flags_pending: number;
  results_computed: number;
  results_published: number;
}

// ==========================================
// JUDGES PORTAL TYPES
// ==========================================

export interface JudgeAssignmentWithNominee {
  id: string;
  judge_user_id: string;
  nominee_id: string;
  season_id: string;
  category_id: string | null;
  status: "pending" | "completed" | "recused";
  score: number | null;
  comment: string | null;
  assigned_at: string | null;
  scored_at: string | null;
  nominee: {
    id: string;
    name: string;
    slug: string;
    title: string | null;
    organization: string | null;
    bio: string | null;
    photo_url: string | null;
    evidence_urls: string[] | null;
    subcategory: {
      id: string;
      name: string;
      slug: string;
      category: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };
}

export interface JudgeScoringStats {
  total: number;
  completed: number;
  pending: number;
  recused: number;
  averageScore: number;
  completionRate: number;
}

export interface IconLifetimeContest {
  id: string;
  name: string;
  description: string | null;
  nominees: JudgeAssignmentWithNominee[];
  is_active: boolean;
  deadline: string | null;
}
