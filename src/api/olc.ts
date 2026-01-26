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

export async function getOLCDashboard(): Promise<ApiResponse<OLCDashboardData>> {
  return api.get<OLCDashboardData>("wallet", "/dashboard/olc");
}

// ============================================================================
// Members
// ============================================================================

export async function getChapterMembers(chapterId: string): Promise<ApiResponse<ChapterMember[]>> {
  return api.get<ChapterMember[]>("wallet", "/olc/members", { chapter_id: chapterId });
}

export async function verifyMember(
  memberId: string,
  status: "verified" | "rejected"
): Promise<ApiResponse<{ success: boolean }>> {
  return api.post<{ success: boolean }>("wallet", "/olc/members/verify", {
    member_id: memberId,
    status,
  });
}

// ============================================================================
// Events
// ============================================================================

export async function getChapterEvents(chapterId: string): Promise<ApiResponse<ChapterEvent[]>> {
  return api.get<ChapterEvent[]>("wallet", "/olc/events", { chapter_id: chapterId });
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  event_date: string;
  location?: string;
}

export async function createChapterEvent(
  chapterId: string,
  event: CreateEventPayload
): Promise<ApiResponse<ChapterEvent>> {
  return api.post<ChapterEvent>("wallet", "/olc/events", {
    chapter_id: chapterId,
    ...event,
  });
}

export async function updateChapterEvent(
  eventId: string,
  updates: Partial<CreateEventPayload & { status: ChapterEvent["status"] }>
): Promise<ApiResponse<ChapterEvent>> {
  return api.patch<ChapterEvent>("wallet", `/olc/events/${eventId}`, updates);
}

export async function deleteChapterEvent(eventId: string): Promise<ApiResponse<{ success: boolean }>> {
  return api.delete<{ success: boolean }>("wallet", `/olc/events/${eventId}`);
}

// ============================================================================
// Settlements
// ============================================================================

export async function getSettlementHistory(chapterId: string): Promise<ApiResponse<SettlementRequest[]>> {
  return api.get<SettlementRequest[]>("wallet", "/olc/settlements", { chapter_id: chapterId });
}

export async function requestSettlement(
  chapterId: string,
  notes?: string
): Promise<ApiResponse<SettlementRequest>> {
  return api.post<SettlementRequest>("wallet", "/olc/settlements/request", {
    chapter_id: chapterId,
    notes,
  });
}

// ============================================================================
// Referral Tree
// ============================================================================

export interface ReferralTreeNode {
  user_id: string;
  email: string;
  full_name: string | null;
  event_type: string;
  reward_agc: number;
  value_usd: number;
  created_at: string;
}

export async function getChapterReferralTree(chapterId: string): Promise<ApiResponse<ReferralTreeNode[]>> {
  return api.get<ReferralTreeNode[]>("wallet", "/referrals/tree", {
    scope: "chapter",
    chapter_id: chapterId,
  });
}

// ============================================================================
// Default Export
// ============================================================================

const olcApi = {
  getOLCDashboard,
  getChapterMembers,
  verifyMember,
  getChapterEvents,
  createChapterEvent,
  updateChapterEvent,
  deleteChapterEvent,
  getSettlementHistory,
  requestSettlement,
  getChapterReferralTree,
};

export default olcApi;
