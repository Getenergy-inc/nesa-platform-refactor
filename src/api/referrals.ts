/**
 * NESA-Africa Referrals API Client
 * API methods for referral operations
 */

import { api, type ApiResponse } from "./http";
import type { Referral, ReferralEvent } from "@/types/wallet";

// ============================================================================
// REFERRAL INFO
// ============================================================================

interface MyReferralResponse {
  referral: Referral | null;
  recentEvents: ReferralEvent[];
  earnings: {
    total_agc: number;
    total_referrals: number;
    paid_conversions: number;
  };
}

/**
 * Get current user's referral info
 * GET /referrals/me
 */
export async function getMyReferral(): Promise<ApiResponse<MyReferralResponse>> {
  return api.get<MyReferralResponse>("referrals", "/me");
}

// ============================================================================
// INVITE
// ============================================================================

interface InviteResponse {
  referral_code: string;
  invite_link: string;
  is_active: boolean;
}

/**
 * Generate/get referral invite link
 * POST /referrals/invite
 */
export async function generateInviteLink(): Promise<ApiResponse<InviteResponse>> {
  return api.post<InviteResponse>("referrals", "/invite", {});
}

// ============================================================================
// REFERRAL TREE
// ============================================================================

interface ReferralTreeNode {
  user_id: string;
  full_name: string | null;
  email: string;
  joined_at: string;
  events: ReferralEvent[];
  total_agc: number;
}

/**
 * Get referral tree for user or chapter
 * GET /referrals/tree?scope=user|chapter
 */
export async function getReferralTree(
  scope: "user" | "chapter" = "user"
): Promise<ApiResponse<ReferralTreeNode[]>> {
  return api.get<ReferralTreeNode[]>("referrals", "/tree", { scope });
}

// ============================================================================
// EARNINGS
// ============================================================================

type EarningsByType = Record<string, { count: number; total_agc: number }>;
type EarningsByMonth = Record<string, { count: number; total_agc: number }>;

/**
 * Get earnings grouped by type or month
 * GET /referrals/earnings?groupBy=type|month
 */
export async function getReferralEarnings(
  groupBy: "type" | "month" = "type"
): Promise<ApiResponse<EarningsByType | EarningsByMonth>> {
  return api.get<EarningsByType | EarningsByMonth>("referrals", "/earnings", { groupBy });
}

// ============================================================================
// PUBLIC LOOKUP
// ============================================================================

interface LookupResponse {
  valid: boolean;
  owner_type?: string;
  owner_name?: string;
}

/**
 * Lookup referral code (public, no auth required)
 * GET /referrals/lookup/:code
 */
export async function lookupReferralCode(code: string): Promise<ApiResponse<LookupResponse>> {
  return api.get<LookupResponse>("referrals", `/lookup/${encodeURIComponent(code)}`);
}

// ============================================================================
// Default Export
// ============================================================================

const referralsApi = {
  getMyReferral,
  generateInviteLink,
  getReferralTree,
  getReferralEarnings,
  lookupReferralCode,
};

export default referralsApi;
