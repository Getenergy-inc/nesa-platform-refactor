/**
 * NESA-Africa Dashboard API Client
 * API methods for dashboard data across all user types
 */

import { api, type ApiResponse } from "./http";
import type { WalletAccount, WalletBalance, WalletLedgerEntry, Referral } from "@/types/wallet";

// ============================================================================
// USER DASHBOARD
// ============================================================================

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  phone: string | null;
  bio: string | null;
}

interface UserRole {
  role: string;
  role_code: string | null;
}

interface StageStatus {
  action: string;
  is_open: boolean;
}

interface Season {
  id: string;
  name: string;
  year: number;
  is_active: boolean;
}

interface RevenueSplit {
  split_key: string;
  percent: number;
  destination_description: string | null;
}

interface UserDashboardData {
  profile: UserProfile | null;
  wallet: {
    account: WalletAccount;
    balance: WalletBalance;
  } | null;
  recentTransactions: WalletLedgerEntry[];
  referral: Referral | null;
  roles: UserRole[];
  stages: StageStatus[];
  season: Season | null;
  revenueSplits: RevenueSplit[];
}

/**
 * Get user dashboard data
 * GET /dashboard/user
 */
export async function getUserDashboard(): Promise<ApiResponse<UserDashboardData>> {
  return api.get<UserDashboardData>("dashboard", "/user");
}

// ============================================================================
// OLC DASHBOARD
// ============================================================================

interface ChapterInfo {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  logo_url: string | null;
  referral_code: string | null;
  is_active: boolean;
}

interface ChapterMemberInfo {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: UserRole[];
}

interface ChapterPerformance {
  total_signups: number;
  paid_conversions: number;
  total_agc_earned: number;
}

interface OLCDashboardData {
  chapter: ChapterInfo | null;
  wallet: {
    account: WalletAccount;
    balance: WalletBalance;
  } | null;
  recentTransactions: WalletLedgerEntry[];
  referral: Referral | null;
  performance: ChapterPerformance;
  members: ChapterMemberInfo[];
  memberCount: number;
}

/**
 * Get OLC coordinator dashboard data
 * GET /dashboard/olc
 */
export async function getOLCDashboard(): Promise<ApiResponse<OLCDashboardData>> {
  return api.get<OLCDashboardData>("dashboard", "/olc");
}

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

interface FinanceOverview {
  total_agc_circulation: number;
  total_usd_equivalence: number;
  fx_rate: number;
  revenue_by_category: {
    nomination: number;
    vote: number;
    donation: number;
    ticket: number;
  };
  transactions_summary: {
    daily: number;
    weekly: number;
  };
}

interface NominationStats {
  total: number;
  pending: number;
}

interface VoteStats {
  total: number;
}

interface ChapterPerformanceAdmin {
  id: string;
  name: string;
  country: string;
  total_signups: number;
  total_agc_earned: number;
}

interface StageConfig {
  id: string;
  action: string;
  is_open: boolean;
  opens_at: string | null;
  closes_at: string | null;
}

interface RevenueSplitAdmin {
  id: string;
  split_key: string;
  percent: number;
  destination_description: string | null;
  is_active: boolean;
}

interface AuditLogEntry {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  user_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
}

interface AdminDashboardData {
  season: Season | null;
  finance: FinanceOverview;
  nominations: NominationStats;
  votes: VoteStats;
  topChapters: ChapterPerformanceAdmin[];
  stages: StageConfig[];
  revenueSplits: RevenueSplitAdmin[];
  recentAuditLogs: AuditLogEntry[];
}

/**
 * Get admin dashboard data
 * GET /dashboard/admin
 */
export async function getAdminDashboard(): Promise<ApiResponse<AdminDashboardData>> {
  return api.get<AdminDashboardData>("dashboard", "/admin");
}

// ============================================================================
// Default Export
// ============================================================================

const dashboardApi = {
  getUserDashboard,
  getOLCDashboard,
  getAdminDashboard,
};

export default dashboardApi;
