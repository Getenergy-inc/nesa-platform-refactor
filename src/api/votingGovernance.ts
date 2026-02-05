/**
 * NESA-Africa 2025 - Voting Governance API Client
 * Public voting, admin controls, fraud detection, results computation
 */

import api from "./http";
import type {
  Contest,
  ComputedResult,
  FraudFlag,
  JurySubmission,
  VotingStageStatus,
  VotingDashboardStats,
  ComputationResult,
  PublishResult,
  VoteRejection,
} from "@/types/votingGovernance";

// ==========================================
// PUBLIC VOTING API
// ==========================================

/**
 * Cast a vote with vote-once enforcement
 * For Gold: one vote per subcategory
 * For Blue Garnet: one vote per category
 */
export async function castVoteWithConstraints(params: {
  nomineeId: string;
  voteType: "gold" | "blue-garnet";
  subcategoryId?: string;
  categoryId?: string;
}) {
  const body: Record<string, unknown> = {
    nomineeId: params.nomineeId,
    voteType: "public",
    voteCount: 1,
  };

  if (params.voteType === "gold" && params.subcategoryId) {
    body.subcategoryId = params.subcategoryId;
  } else if (params.voteType === "blue-garnet" && params.categoryId) {
    body.categoryId = params.categoryId;
  }

  return api.post<{
    success: boolean;
    vote: Record<string, unknown>;
    agcSpent: number;
    newBalance: number;
  }>("voting", "/vote", body);
}

/**
 * Check if user has already voted for a subcategory (Gold) or category (Blue Garnet)
 */
export async function checkVoteEligibility(params: {
  voteType: "gold" | "blue-garnet";
  subcategoryId?: string;
  categoryId?: string;
}) {
  const query: Record<string, string> = { voteType: params.voteType };
  if (params.subcategoryId) query.subcategoryId = params.subcategoryId;
  if (params.categoryId) query.categoryId = params.categoryId;

  return api.get<{
    canVote: boolean;
    reason: string | null;
    existingVoteId?: string;
  }>("voting", "/check-eligibility", query);
}

// ==========================================
// CONTESTS API
// ==========================================

/**
 * Get all active contests for the current season
 */
export async function getActiveContests() {
  return api.get<{ data: Contest[] }>("voting", "/contests");
}

/**
 * Get contest details by ID
 */
export async function getContest(contestId: string) {
  return api.get<Contest>("voting", `/contests/${contestId}`);
}

// ==========================================
// RESULTS API
// ==========================================

/**
 * Get published results (public)
 */
export async function getPublishedResults(params?: {
  contestType?: string;
  categoryId?: string;
}) {
  return api.get<{ data: ComputedResult[] }>("voting", "/results", params);
}

/**
 * Get all results (admin only)
 */
export async function getAllResults(params?: {
  status?: string;
  contestType?: string;
}) {
  return api.get<{ data: ComputedResult[] }>("admin", "/results", params);
}

/**
 * Compute Gold results (admin only)
 */
export async function computeGoldResults() {
  return api.post<ComputationResult>("admin", "/results/compute/gold");
}

/**
 * Compute Blue Garnet results (admin only)
 */
export async function computeBlueGarnetResults() {
  return api.post<ComputationResult>("admin", "/results/compute/blue-garnet");
}

/**
 * Publish results (admin only)
 */
export async function publishResults(contestType: string) {
  return api.post<PublishResult>("admin", "/results/publish", { contestType });
}

// ==========================================
// FRAUD DETECTION API
// ==========================================

/**
 * Get fraud flags (admin only)
 */
export async function getFraudFlags(params?: {
  status?: string;
  severity?: string;
  limit?: number;
}) {
  return api.get<{ data: FraudFlag[] }>("admin", "/fraud-flags", params);
}

/**
 * Update fraud flag status (admin only)
 */
export async function updateFraudFlag(
  flagId: string,
  updates: {
    flag_status?: string;
    admin_notes?: string;
  }
) {
  return api.patch<FraudFlag>("admin", `/fraud-flags/${flagId}`, updates);
}

/**
 * Run fraud detection (admin only)
 */
export async function runFraudDetection() {
  return api.post<{ success: boolean; flags_created: number }>(
    "admin",
    "/fraud-flags/detect"
  );
}

// ==========================================
// VOTE REJECTIONS API (Admin)
// ==========================================

/**
 * Get vote rejection logs (admin only)
 */
export async function getVoteRejections(params?: {
  reason?: string;
  limit?: number;
  offset?: number;
}) {
  return api.get<{ data: VoteRejection[]; total: number }>(
    "admin",
    "/vote-rejections",
    params
  );
}

// ==========================================
// JURY SUBMISSIONS API
// ==========================================

/**
 * Get judge's submission status
 */
export async function getMySubmissionStatus(contestId?: string) {
  const params = contestId ? { contestId } : undefined;
  return api.get<JurySubmission | null>("jury", "/submission-status", params);
}

/**
 * Lock judge submission (finalize scoring)
 */
export async function lockSubmission(contestId?: string) {
  return api.post<JurySubmission>("jury", "/lock-submission", { contestId });
}

/**
 * Get all jury submissions (admin only)
 */
export async function getAllJurySubmissions(params?: { seasonId?: string }) {
  return api.get<{ data: JurySubmission[] }>("admin", "/jury-submissions", params);
}

// ==========================================
// DASHBOARD STATS API
// ==========================================

/**
 * Get voting stage status (admin only)
 */
export async function getVotingStageStatus() {
  return api.get<VotingStageStatus>("admin", "/voting/stages");
}

/**
 * Get voting dashboard stats (admin only)
 */
export async function getVotingDashboardStats() {
  return api.get<VotingDashboardStats>("admin", "/voting/stats");
}

// ==========================================
// STAGE CONTROL API (Admin)
// ==========================================

/**
 * Open a voting stage
 */
export async function openStage(action: string) {
  return api.post<{ success: boolean }>("admin", "/stages/open", { action });
}

/**
 * Close a voting stage
 */
export async function closeStage(action: string) {
  return api.post<{ success: boolean }>("admin", "/stages/close", { action });
}

export default {
  castVoteWithConstraints,
  checkVoteEligibility,
  getActiveContests,
  getContest,
  getPublishedResults,
  getAllResults,
  computeGoldResults,
  computeBlueGarnetResults,
  publishResults,
  getFraudFlags,
  updateFraudFlag,
  runFraudDetection,
  getVoteRejections,
  getMySubmissionStatus,
  lockSubmission,
  getAllJurySubmissions,
  getVotingStageStatus,
  getVotingDashboardStats,
  openStage,
  closeStage,
};
