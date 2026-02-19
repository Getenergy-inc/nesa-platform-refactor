/**
 * NESA-Africa API Client - NRC Workflow Endpoints
 *
 * National Review Committee endpoints for nomination review workflow.
 */

import api, { type PaginatedResponse } from "./http";

// ==========================================
// TYPES
// ==========================================

export interface NominationQueueItem {
  id: string;
  nominee_name: string;
  nominee_title: string | null;
  nominee_organization: string | null;
  nominee_bio: string | null;
  nominee_photo_url: string | null;
  justification: string | null;
  evidence_urls: string[] | null;
  status: string;
  created_at: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    categories: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface NRCStats {
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
}

export interface NRCDecision {
  nominationId: string;
  decision: "APPROVE" | "REJECT" | "NEEDS_INFO";
  notes?: string;
  createNominee?: boolean;
}

export interface NRCDecisionResult {
  success: boolean;
  nomination: any;
  createdNomineeId?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  created_at: string;
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Get nominations queue for review
 */
export async function getQueue(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  return api.get<PaginatedResponse<NominationQueueItem>>(
    "nrc",
    "/queue",
    params,
  );
}

/**
 * Get NRC dashboard statistics
 */
export async function getStats() {
  return api.get<NRCStats>("nrc", "/stats");
}

/**
 * Assign nomination to reviewer
 */
export async function assignNomination(
  nominationId: string,
  reviewerId?: string,
) {
  return api.post<{ success: boolean; nomination: any }>("nrc", "/assign", {
    nominationId,
    reviewerId,
  });
}

/**
 * Make decision on nomination
 */
export async function submitDecision(payload: NRCDecision) {
  return api.post<NRCDecisionResult>("nrc", "/decision", payload);
}

/**
 * Approve nomination (convenience method)
 */
export async function approveNomination(nominationId: string, notes?: string) {
  return submitDecision({
    nominationId,
    decision: "APPROVE",
    notes,
    createNominee: true,
  });
}

/**
 * Reject nomination (convenience method)
 */
export async function rejectNomination(nominationId: string, notes?: string) {
  return submitDecision({
    nominationId,
    decision: "REJECT",
    notes,
  });
}

/**
 * Request more information (convenience method)
 */
export async function requestInfo(nominationId: string, notes: string) {
  return submitDecision({
    nominationId,
    decision: "NEEDS_INFO",
    notes,
  });
}

/**
 * Get NRC audit logs
 */
export async function getLogs(params?: { page?: number; limit?: number }) {
  return api.get<PaginatedResponse<AuditLogItem>>("nrc", "/logs", params);
}

export default {
  getQueue,
  getStats,
  assignNomination,
  submitDecision,
  approveNomination,
  rejectNomination,
  requestInfo,
  getLogs,
};
