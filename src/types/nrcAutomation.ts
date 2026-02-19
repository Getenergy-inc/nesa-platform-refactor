/**
 * NRC Automation Types
 * NESA-Africa 2025 - Enhanced Type Definitions
 */

import type {
  NRCWorkflowStatus,
  AIRecommendation,
  NRCReviewDecision,
  NRCReviewerRole,
} from "@/config/nrcConfig";

// =====================================================
// AI NRC ASSESSMENT TYPES
// =====================================================

export interface AINRCAssessment {
  id: string;
  nomination_id: string;
  recommendation: AIRecommendation;
  evidence_score: number;
  category_fit_score: number;
  risk_score: number;
  identity_verified: boolean;
  reason_codes: string[];
  explanation_summary: string | null;
  model_version: string;
  rubric_version: string;
  processing_time_ms: number | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// NRC REVIEW (HUMAN) TYPES
// =====================================================

export interface NRCReview {
  id: string;
  nomination_id: string;
  reviewer_user_id: string;
  review_type: "identity" | "evidence" | "category" | "full";
  decision: NRCReviewDecision;
  // Checklist scores
  identity_match: boolean | null;
  category_fit: boolean | null;
  evidence_sufficiency: number | null; // 0-5
  evidence_authenticity: "none" | "medium" | "high" | null;
  timeframe_fit: boolean | null;
  duplication_status:
    | "unique"
    | "possible_duplicate"
    | "confirmed_duplicate"
    | null;
  // Notes
  reviewer_notes: string | null;
  suggested_category_id: string | null;
  suggested_subcategory_id: string | null;
  // Timestamps
  started_at: string;
  completed_at: string | null;
  created_at: string;
  // Joined data
  reviewer?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface NRCReviewPayload {
  nomination_id: string;
  review_type: "identity" | "evidence" | "category" | "full";
  decision: NRCReviewDecision;
  identity_match?: boolean;
  category_fit?: boolean;
  evidence_sufficiency?: number;
  evidence_authenticity?: "none" | "medium" | "high";
  timeframe_fit?: boolean;
  duplication_status?: "unique" | "possible_duplicate" | "confirmed_duplicate";
  reviewer_notes?: string;
  suggested_category_id?: string;
  suggested_subcategory_id?: string;
}

// =====================================================
// NRC EVIDENCE QUERY TYPES
// =====================================================

export interface NRCEvidenceQuery {
  id: string;
  nomination_id: string;
  reviewer_user_id: string;
  query_type: "identity" | "evidence" | "category" | "other";
  query_text: string;
  required_evidence_types: string[] | null;
  response_text: string | null;
  response_evidence_urls: string[] | null;
  status: "pending" | "responded" | "expired" | "resolved";
  due_date: string | null;
  responded_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface NRCEvidenceQueryPayload {
  nomination_id: string;
  query_type: "identity" | "evidence" | "category" | "other";
  query_text: string;
  required_evidence_types?: string[];
  due_date?: string;
}

// =====================================================
// NRC VERIFICATION SUMMARY TYPES
// =====================================================

export interface NRCVerificationSummary {
  id: string;
  nomination_id: string;
  nominee_id: string | null;
  final_decision: "verified" | "rejected" | "pending";
  primary_reviewer_id: string | null;
  secondary_reviewer_id: string | null;
  lead_reviewer_id: string | null;
  ai_recommendation: AIRecommendation | null;
  ai_evidence_score: number | null;
  // Aggregated checklist
  identity_verified: boolean;
  category_verified: boolean;
  evidence_verified: boolean;
  risk_cleared: boolean;
  // Counts
  review_count: number;
  approve_count: number;
  reject_count: number;
  // Summary PDF
  summary_pdf_url: string | null;
  summary_generated_at: string | null;
  // Timestamps
  decision_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  primary_reviewer?: { full_name: string | null };
  secondary_reviewer?: { full_name: string | null };
  lead_reviewer?: { full_name: string | null };
}

// =====================================================
// ENHANCED NRC MEMBER TYPES
// =====================================================

export interface NRCMemberEnhanced {
  id: string;
  user_id: string;
  invited_by: string | null;
  status: "pending" | "active" | "suspended" | "removed";
  nrc_role: NRCReviewerRole;
  specialization: string[];
  assigned_region: string | null;
  max_queue_size: number;
  current_assignments: number;
  total_reviews: number;
  review_count: number;
  approval_rate: number;
  avg_review_time_hours: number;
  identity_checks: number;
  evidence_checks: number;
  category_checks: number;
  is_available: boolean;
  joined_at: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined profile data
  profile?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

// =====================================================
// ENHANCED NOMINATION TYPES (with workflow)
// =====================================================

export interface NominationWithWorkflow {
  id: string;
  nominee_name: string;
  nominee_title: string | null;
  nominee_organization: string | null;
  nominee_bio: string | null;
  nominee_photo_url: string | null;
  justification: string | null;
  evidence_urls: string[] | null;
  source: "START_MEMBER" | "NRC" | "PUBLIC";
  status: string;
  workflow_status: NRCWorkflowStatus;
  rubric_version: string;
  query_count: number;
  sla_deadline: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
  ai_assessment?: AINRCAssessment;
  reviews?: NRCReview[];
  queries?: NRCEvidenceQuery[];
  verification_summary?: NRCVerificationSummary;
}

// =====================================================
// NRC QUEUE ENHANCED TYPES
// =====================================================

export interface NRCQueueItemEnhanced {
  id: string;
  nomination_id: string;
  assigned_to: string;
  assigned_by: string | null;
  priority: number;
  status: "assigned" | "in_review" | "completed" | "reassigned";
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Computed
  is_overdue: boolean;
  hours_remaining: number | null;
  // Joined data
  nomination?: NominationWithWorkflow;
  assignee?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

// =====================================================
// NRC DASHBOARD STATS
// =====================================================

export interface NRCDashboardStats {
  // Member stats
  total_members: number;
  active_members: number;
  available_members: number;
  member_capacity: number;
  pending_invitations: number;

  // Queue stats
  total_queue_items: number;
  overdue_items: number;
  completed_reviews: number;

  // Nomination pipeline stats
  pending_acceptance: number;
  accepted_pending_nrc: number;
  in_review: number;
  query_sent: number;
  verified: number;
  rejected: number;

  // Performance stats
  avg_review_time_hours: number;
  avg_evidence_score: number;
  approval_rate: number;
}

// =====================================================
// ASSIGNMENT RESULT TYPES
// =====================================================

export interface AssignmentResult {
  success: boolean;
  error?: string;
  reviewers?: string[];
  sla_deadline?: string;
}

export interface QuorumResult {
  quorum_reached: boolean;
  reason?: string;
  decision?: "verified" | "rejected";
  needs_lead?: boolean;
  approve_count?: number;
  reject_count?: number;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface AIAssessmentResult {
  success: boolean;
  assessment: AINRCAssessment;
  processing_time_ms: number;
}

export interface ReviewSubmitResult {
  success: boolean;
  review: NRCReview;
  quorum_result?: QuorumResult;
  nomination_updated: boolean;
}
