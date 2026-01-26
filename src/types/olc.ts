/**
 * OLC (Offline Local Chapter) Types
 * Types for chapter coordinator dashboard and management
 */

export interface Chapter {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  logo_url: string | null;
  referral_code: string | null;
  is_active: boolean;
  lead_user_id: string | null;
  coordinator_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChapterMember {
  id: string;
  chapter_id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  status: "pending" | "verified" | "rejected";
  joined_at: string;
  verified_at: string | null;
  verified_by: string | null;
}

export interface ChapterEvent {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  status: "draft" | "published" | "completed" | "cancelled";
  attendee_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface SettlementRequest {
  id: string;
  chapter_id: string;
  account_id: string;
  amount_agc: number;
  amount_usd: number;
  status: "pending" | "approved" | "rejected" | "completed";
  notes: string | null;
  admin_notes: string | null;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  completed_at: string | null;
}

export interface ChapterPerformance {
  totalSignups: number;
  paidConversions: number;
  nominationsPaid: number;
  votesPaid: number;
  totalEarningsAgc: number;
  conversionRate: number;
}

export interface OLCDashboardData {
  chapter: Chapter;
  balance: {
    agc_total: number;
    agc_withdrawable: number;
    agc_non_withdrawable: number;
    agc_bonus: number;
    usd_balance: number;
  };
  performance: ChapterPerformance;
  recentMembers: ChapterMember[];
  recentEvents: ChapterEvent[];
  pendingSettlements: SettlementRequest[];
}
