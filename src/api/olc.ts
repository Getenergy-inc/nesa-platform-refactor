/**
 * OLC (Offline Local Chapter) API Client
 * API functions for chapter coordinator operations
 */

import { api, type ApiResponse } from "./http";
import type {
  Chapter,
  ChapterMember,
  ChapterEvent,
  SettlementRequest,
  OLCDashboardData,
} from "@/types/olc";

// ============================================================================
// Dashboard
// ============================================================================

/**
 * Get OLC coordinator dashboard data
 * GET /dashboard/olc
 */
export async function getOLCDashboard(): Promise<ApiResponse<OLCDashboardData>> {
  return api.get<OLCDashboardData>("dashboard", "/olc");
}

// ============================================================================
// Members
// ============================================================================

/**
 * Get chapter members
 * GET /olc/members
 */
export async function getChapterMembers(
  page = 1,
  limit = 20,
  status?: string
): Promise<ApiResponse<ChapterMember[]>> {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  return api.get<ChapterMember[]>("olc", "/members", params);
}

/**
 * Verify a chapter member
 * POST /olc/members/verify
 */
export async function verifyMember(
  memberUserId: string,
  status: "verified" | "rejected"
): Promise<ApiResponse<{ verified: boolean; member_user_id: string }>> {
  return api.post<{ verified: boolean; member_user_id: string }>("olc", "/members/verify", {
    member_user_id: memberUserId,
    status,
  });
}

// ============================================================================
// Settlements
// ============================================================================

/**
 * Get settlement requests history
 * GET /olc/settlements
 */
export async function getSettlementHistory(): Promise<ApiResponse<SettlementRequest[]>> {
  return api.get<SettlementRequest[]>("olc", "/settlements");
}

/**
 * Request a settlement
 * POST /olc/settlements/request
 */
export async function requestSettlement(
  amountUsd: number,
  notes?: string
): Promise<ApiResponse<{ request_id: string; status: string; amount_usd: number; agc_amount: number }>> {
  return api.post<{ request_id: string; status: string; amount_usd: number; agc_amount: number }>(
    "olc",
    "/settlements/request",
    { amount_usd: amountUsd, notes }
  );
}

// ============================================================================
// Media
// ============================================================================

/**
 * Submit media for the chapter
 * POST /olc/media/submit
 */
export async function submitChapterMedia(
  url: string,
  title: string,
  description?: string,
  mediaType?: string
): Promise<ApiResponse<{ media_id: string; status: string; message: string }>> {
  return api.post<{ media_id: string; status: string; message: string }>("olc", "/media/submit", {
    url,
    title,
    description,
    media_type: mediaType,
  });
}

// ============================================================================
// Default Export
// ============================================================================

const olcApi = {
  getOLCDashboard,
  getChapterMembers,
  verifyMember,
  getSettlementHistory,
  requestSettlement,
  submitChapterMedia,
};

export default olcApi;
