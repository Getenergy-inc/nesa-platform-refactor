/**
 * NRC Automation API Client
 * NESA-Africa 2025 - Enhanced NRC Endpoints
 */

import api, { type PaginatedResponse } from "./http";
import type {
  AINRCAssessment,
  NRCReview,
  NRCReviewPayload,
  NRCEvidenceQuery,
  NRCEvidenceQueryPayload,
  NRCVerificationSummary,
  NRCQueueItemEnhanced,
  NominationWithWorkflow,
  NRCDashboardStats,
  AssignmentResult,
  QuorumResult,
  AIAssessmentResult,
  ReviewSubmitResult,
  NRCMemberEnhanced,
} from "@/types/nrcAutomation";

// =====================================================
// QUEUE MANAGEMENT
// =====================================================

/**
 * Get NRC review queue with enhanced data
 */
export async function getQueue(params?: {
  status?: string;
  workflow_status?: string;
  page?: number;
  limit?: number;
  include_ai?: boolean;
}) {
  return api.get<PaginatedResponse<NRCQueueItemEnhanced>>("nrc", "/queue", params);
}

/**
 * Get current user's assigned queue
 */
export async function getMyQueue(params?: {
  status?: string;
  include_overdue?: boolean;
}) {
  return api.get<{ data: NRCQueueItemEnhanced[] }>("nrc", "/my-queue", params);
}

/**
 * Get single nomination dossier for review
 */
export async function getNominationDossier(nominationId: string) {
  return api.get<NominationWithWorkflow>("nrc", `/nominations/${nominationId}`);
}

// =====================================================
// AI ASSESSMENT
// =====================================================

/**
 * Request AI assessment for a nomination
 */
export async function requestAIAssessment(nominationId: string) {
  return api.post<AIAssessmentResult>("nrc", `/ai/assess/${nominationId}`, {});
}

/**
 * Get AI assessment for a nomination
 */
export async function getAIAssessment(nominationId: string) {
  return api.get<AINRCAssessment>("nrc", `/ai/report/${nominationId}`);
}

// =====================================================
// HUMAN REVIEW WORKFLOW
// =====================================================

/**
 * Start reviewing a nomination (changes status to in_review)
 */
export async function startReview(nominationId: string) {
  return api.post<{ success: boolean; started_at: string }>("nrc", `/review/${nominationId}/start`, {});
}

/**
 * Submit review checklist and decision
 */
export async function submitReview(payload: NRCReviewPayload) {
  return api.post<ReviewSubmitResult>("nrc", `/review/${payload.nomination_id}`, payload);
}

/**
 * Get all reviews for a nomination
 */
export async function getReviews(nominationId: string) {
  return api.get<{ data: NRCReview[] }>("nrc", `/reviews/${nominationId}`);
}

/**
 * Get verification summary for a nomination
 */
export async function getVerificationSummary(nominationId: string) {
  return api.get<NRCVerificationSummary>("nrc", `/summary/${nominationId}`);
}

// =====================================================
// EVIDENCE QUERIES (CLARIFICATIONS)
// =====================================================

/**
 * Request additional evidence from nominee
 */
export async function requestEvidence(payload: NRCEvidenceQueryPayload) {
  return api.post<{ success: boolean; query: NRCEvidenceQuery }>("nrc", "/query", payload);
}

/**
 * Get pending queries for a nomination
 */
export async function getQueries(nominationId: string) {
  return api.get<{ data: NRCEvidenceQuery[] }>("nrc", `/queries/${nominationId}`);
}

/**
 * Resolve an evidence query
 */
export async function resolveQuery(queryId: string, resolution: "accepted" | "insufficient") {
  return api.post<{ success: boolean }>("nrc", `/query/${queryId}/resolve`, { resolution });
}

// =====================================================
// ASSIGNMENT & ESCALATION
// =====================================================

/**
 * Auto-assign reviewers to a nomination
 */
export async function autoAssign(nominationId: string, numReviewers?: number) {
  return api.post<AssignmentResult>("nrc", "/assign/auto", { nominationId, numReviewers });
}

/**
 * Manually reassign a nomination
 */
export async function reassign(nominationId: string, newReviewerId: string, reason?: string) {
  return api.post<{ success: boolean }>("nrc", "/assign/manual", {
    nominationId,
    newReviewerId,
    reason,
  });
}

/**
 * NRC Lead resolves split decision
 */
export async function resolveSpitDecision(nominationId: string, decision: "verified" | "rejected", notes?: string) {
  return api.post<{ success: boolean; quorum_result: QuorumResult }>("nrc", `/lead/resolve/${nominationId}`, {
    decision,
    notes,
  });
}

/**
 * Check quorum for a nomination
 */
export async function checkQuorum(nominationId: string) {
  return api.post<QuorumResult>("nrc", `/quorum/${nominationId}`, {});
}

// =====================================================
// NRC MEMBERS MANAGEMENT
// =====================================================

/**
 * Get all NRC members with enhanced stats
 */
export async function getMembers() {
  return api.get<{ data: NRCMemberEnhanced[]; total_capacity: number }>("nrc", "/members");
}

/**
 * Update NRC member availability
 */
export async function updateMemberAvailability(memberId: string, isAvailable: boolean) {
  return api.post<{ success: boolean }>("nrc", `/members/${memberId}/availability`, { isAvailable });
}

/**
 * Update NRC member role (lead only)
 */
export async function updateMemberRole(memberId: string, role: string) {
  return api.post<{ success: boolean }>("nrc", `/members/${memberId}/role`, { role });
}

// =====================================================
// DASHBOARD & STATS
// =====================================================

/**
 * Get enhanced NRC dashboard stats
 */
export async function getDashboardStats() {
  return api.get<NRCDashboardStats>("nrc", "/stats");
}

/**
 * Get SLA violations / overdue items
 */
export async function getOverdueItems() {
  return api.get<{ data: NRCQueueItemEnhanced[] }>("nrc", "/overdue");
}

/**
 * Get split decisions awaiting lead resolution
 */
export async function getSplitDecisions() {
  return api.get<{ data: NominationWithWorkflow[] }>("nrc", "/lead/splits");
}

// =====================================================
// AUDIT & REPORTS
// =====================================================

/**
 * Get NRC audit logs
 */
export async function getAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: string;
  reviewer_id?: string;
  from_date?: string;
  to_date?: string;
}) {
  return api.get<PaginatedResponse<any>>("nrc", "/logs", params);
}

/**
 * Export verification summary PDF
 */
export async function exportVerificationSummary(nominationId: string) {
  return api.post<{ pdf_url: string }>("nrc", `/summary/${nominationId}/export`, {});
}

// =====================================================
// WORKFLOW TRANSITIONS (ADMIN/LEAD)
// =====================================================

/**
 * Publish verified nominee for voting
 */
export async function publishForVoting(nominationId: string, targetTier?: "gold" | "platinum") {
  return api.post<{ success: boolean; workflow_status: string }>("nrc", `/publish/${nominationId}`, { targetTier });
}

/**
 * Bulk auto-assign pending nominations
 */
export async function bulkAutoAssign(limit?: number) {
  return api.post<{ assigned_count: number; errors: string[] }>("nrc", "/assign/bulk", { limit });
}

export default {
  // Queue
  getQueue,
  getMyQueue,
  getNominationDossier,
  
  // AI
  requestAIAssessment,
  getAIAssessment,
  
  // Human review
  startReview,
  submitReview,
  getReviews,
  getVerificationSummary,
  
  // Queries
  requestEvidence,
  getQueries,
  resolveQuery,
  
  // Assignment
  autoAssign,
  reassign,
  resolveSpitDecision,
  checkQuorum,
  
  // Members
  getMembers,
  updateMemberAvailability,
  updateMemberRole,
  
  // Dashboard
  getDashboardStats,
  getOverdueItems,
  getSplitDecisions,
  
  // Audit
  getAuditLogs,
  exportVerificationSummary,
  
  // Workflow
  publishForVoting,
  bulkAutoAssign,
};
