/**
 * NRC (Nominee Research Corps) Configuration
 * NESA-Africa 2025 - Automated Verification System
 */

// =====================================================
// WORKFLOW STATUS DEFINITIONS
// =====================================================

export type NRCWorkflowStatus =
  | "DRAFT"
  | "SUBMITTED_PENDING_ACCEPTANCE"
  | "DECLINED"
  | "ACCEPTED_PENDING_NRC"
  | "NRC_ASSIGNED"
  | "NRC_IN_REVIEW"
  | "NRC_QUERY_SENT"
  | "VERIFIED_BY_NRC"
  | "REJECTED_BY_NRC"
  | "PUBLISHED_FOR_VOTING";

export const WORKFLOW_STATUS_LABELS: Record<NRCWorkflowStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED_PENDING_ACCEPTANCE: "Awaiting Acceptance",
  DECLINED: "Declined",
  ACCEPTED_PENDING_NRC: "Accepted - Pending Review",
  NRC_ASSIGNED: "Assigned to Reviewers",
  NRC_IN_REVIEW: "Under Review",
  NRC_QUERY_SENT: "Clarification Requested",
  VERIFIED_BY_NRC: "Verified by NRC",
  REJECTED_BY_NRC: "Not Eligible",
  PUBLISHED_FOR_VOTING: "Published for Voting",
};

export const WORKFLOW_STATUS_COLORS: Record<NRCWorkflowStatus, string> = {
  DRAFT: "gray",
  SUBMITTED_PENDING_ACCEPTANCE: "yellow",
  DECLINED: "red",
  ACCEPTED_PENDING_NRC: "blue",
  NRC_ASSIGNED: "indigo",
  NRC_IN_REVIEW: "purple",
  NRC_QUERY_SENT: "orange",
  VERIFIED_BY_NRC: "green",
  REJECTED_BY_NRC: "red",
  PUBLISHED_FOR_VOTING: "emerald",
};

// =====================================================
// NRC REVIEWER ROLES
// =====================================================

export type NRCReviewerRole = "nrc_reviewer" | "nrc_lead" | "nrc_auditor";

export const NRC_ROLE_LABELS: Record<NRCReviewerRole, string> = {
  nrc_reviewer: "NRC Reviewer",
  nrc_lead: "NRC Lead",
  nrc_auditor: "NRC Auditor",
};

export const NRC_ROLE_PERMISSIONS: Record<NRCReviewerRole, string[]> = {
  nrc_reviewer: ["view_queue", "submit_review", "request_evidence"],
  nrc_lead: ["view_queue", "submit_review", "request_evidence", "resolve_split", "reassign", "view_all_queues"],
  nrc_auditor: ["view_queue", "view_reviews", "view_logs", "export_reports"],
};

// =====================================================
// AI ASSESSMENT CONFIGURATION
// =====================================================

export type AIRecommendation =
  | "RECOMMEND_ELIGIBLE"
  | "RECOMMEND_INELIGIBLE"
  | "NEEDS_MORE_EVIDENCE"
  | "FLAG_FOR_RISK_REVIEW";

export const AI_RECOMMENDATION_LABELS: Record<AIRecommendation, string> = {
  RECOMMEND_ELIGIBLE: "Eligible",
  RECOMMEND_INELIGIBLE: "Not Eligible",
  NEEDS_MORE_EVIDENCE: "More Evidence Needed",
  FLAG_FOR_RISK_REVIEW: "Risk Review Required",
};

export const AI_RECOMMENDATION_ICONS: Record<AIRecommendation, string> = {
  RECOMMEND_ELIGIBLE: "CheckCircle",
  RECOMMEND_INELIGIBLE: "XCircle",
  NEEDS_MORE_EVIDENCE: "AlertCircle",
  FLAG_FOR_RISK_REVIEW: "ShieldAlert",
};

// =====================================================
// NRC REVIEW DECISION OPTIONS
// =====================================================

export type NRCReviewDecision =
  | "APPROVE"
  | "REJECT"
  | "REQUEST_MORE_EVIDENCE"
  | "RECLASSIFY"
  | "ESCALATE";

export const NRC_DECISION_LABELS: Record<NRCReviewDecision, string> = {
  APPROVE: "Approve",
  REJECT: "Reject",
  REQUEST_MORE_EVIDENCE: "Request Evidence",
  RECLASSIFY: "Reclassify",
  ESCALATE: "Escalate to Lead",
};

export const NRC_DECISION_COLORS: Record<NRCReviewDecision, string> = {
  APPROVE: "green",
  REJECT: "red",
  REQUEST_MORE_EVIDENCE: "yellow",
  RECLASSIFY: "blue",
  ESCALATE: "purple",
};

// =====================================================
// VERIFICATION FAQ / CHECKLIST ITEMS
// =====================================================

export interface VerificationChecklistItem {
  id: string;
  category: "identity" | "category_fit" | "evidence" | "risk";
  question: string;
  failTrigger: string;
  required: boolean;
  aiAssistEnabled: boolean;
}

export const NRC_VERIFICATION_CHECKLIST: VerificationChecklistItem[] = [
  // Identity & Existence
  {
    id: "identity_exists",
    category: "identity",
    question: "Does the nominee exist as a real entity/person?",
    failTrigger: "Fake profile, mismatched identity, unverifiable entity",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "identity_reference",
    category: "identity",
    question: "Is there at least one independent reference (website, official profile, publication)?",
    failTrigger: "No verifiable references found",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "identity_consistent",
    category: "identity",
    question: "Is the nominee name/identity consistent across references?",
    failTrigger: "Inconsistent identity information",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "identity_contact",
    category: "identity",
    question: "Are contact identifiers present (email/phone/official channels)?",
    failTrigger: "No contact method available",
    required: true,
    aiAssistEnabled: false,
  },

  // Category Fit
  {
    id: "category_fit",
    category: "category_fit",
    question: "Does the nominee clearly fit the selected category/subcategory?",
    failTrigger: "Wrong category placement",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "category_sdg4",
    category: "category_fit",
    question: "Is the work relevant to 'Education for All / SDG4' outcomes?",
    failTrigger: "No SDG4/education relevance",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "category_geography",
    category: "category_fit",
    question: "Is the geography/region tag correct?",
    failTrigger: "Wrong region assignment",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "category_timeframe",
    category: "category_fit",
    question: "Is the timeframe within the required window for that tier?",
    failTrigger: "Outside eligibility timeframe",
    required: true,
    aiAssistEnabled: true,
  },

  // Evidence Sufficiency
  {
    id: "evidence_exists",
    category: "evidence",
    question: "Is there evidence of activities/projects (not just claims)?",
    failTrigger: "Marketing-only, no documents",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "evidence_readable",
    category: "evidence",
    question: "Is evidence attached and readable (files, links, photos, reports)?",
    failTrigger: "Broken links, unreadable files",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "evidence_multiple",
    category: "evidence",
    question: "Are at least two evidence types present?",
    failTrigger: "Single evidence type only",
    required: false,
    aiAssistEnabled: true,
  },
  {
    id: "evidence_metrics",
    category: "evidence",
    question: "Are impact metrics present (reach, beneficiaries, outputs)?",
    failTrigger: "No measurable impact",
    required: true,
    aiAssistEnabled: true,
  },

  // Risk Checks
  {
    id: "risk_fraud",
    category: "risk",
    question: "Any evidence of fraud, manipulation, or falsified documents?",
    failTrigger: "Forged documents, high-risk flags",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "risk_coi",
    category: "risk",
    question: "Conflict-of-interest indicators present?",
    failTrigger: "Self-nomination patterns, suspicious activity",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "risk_safeguarding",
    category: "risk",
    question: "Safeguarding risks (harmful practices, exploitation claims)?",
    failTrigger: "Safeguarding concerns detected",
    required: true,
    aiAssistEnabled: true,
  },
  {
    id: "risk_reputation",
    category: "risk",
    question: "Reputation red flags from credible sources?",
    failTrigger: "Documented reputation issues",
    required: true,
    aiAssistEnabled: true,
  },
];

// =====================================================
// SLA & AUTOMATION RULES
// =====================================================

export const NRC_SLA_CONFIG = {
  reviewDeadlineHours: 72,
  escalationHours: 96,
  minReviewers: 2,
  maxReviewers: 3,
  quorumRequired: 2, // 2 of 3 for decision
  maxQueryAttempts: 3,
  queryResponseDays: 7,
  memberCap: 30,
};

export const NRC_EVIDENCE_TYPES = [
  { id: "official_report", label: "Official Report / Annual Report" },
  { id: "project_doc", label: "Project Documentation" },
  { id: "csr_esg", label: "CSR/ESG Report" },
  { id: "mou_letter", label: "MOU / Institutional Letter" },
  { id: "media_coverage", label: "Media Coverage" },
  { id: "photos_videos", label: "Photos/Videos with Date/Location" },
  { id: "beneficiary_records", label: "Beneficiary Records" },
];

// =====================================================
// REASON CODES FOR AI/HUMAN DECISIONS
// =====================================================

export interface ReasonCode {
  code: string;
  category: string;
  description: string;
  severity: "info" | "warning" | "critical";
}

export const NRC_REASON_CODES: ReasonCode[] = [
  // Identity
  { code: "ID_001", category: "identity", description: "Identity verified via official sources", severity: "info" },
  { code: "ID_002", category: "identity", description: "Identity could not be verified", severity: "critical" },
  { code: "ID_003", category: "identity", description: "Possible duplicate nominee detected", severity: "warning" },
  { code: "ID_004", category: "identity", description: "Contact information invalid or unreachable", severity: "warning" },

  // Category
  { code: "CAT_001", category: "category", description: "Category fit confirmed", severity: "info" },
  { code: "CAT_002", category: "category", description: "Category mismatch - reclassification suggested", severity: "warning" },
  { code: "CAT_003", category: "category", description: "Region/geography mismatch", severity: "warning" },
  { code: "CAT_004", category: "category", description: "Timeframe outside eligibility window", severity: "critical" },

  // Evidence
  { code: "EV_001", category: "evidence", description: "Evidence sufficient and verified", severity: "info" },
  { code: "EV_002", category: "evidence", description: "Insufficient evidence provided", severity: "warning" },
  { code: "EV_003", category: "evidence", description: "Evidence links broken or inaccessible", severity: "warning" },
  { code: "EV_004", category: "evidence", description: "No measurable impact metrics", severity: "warning" },
  { code: "EV_005", category: "evidence", description: "Evidence appears falsified", severity: "critical" },

  // Risk
  { code: "RISK_001", category: "risk", description: "No risk flags detected", severity: "info" },
  { code: "RISK_002", category: "risk", description: "Conflict of interest detected", severity: "critical" },
  { code: "RISK_003", category: "risk", description: "Fraud indicators present", severity: "critical" },
  { code: "RISK_004", category: "risk", description: "Safeguarding concerns flagged", severity: "critical" },
  { code: "RISK_005", category: "risk", description: "Reputation concerns from credible sources", severity: "warning" },
];

// =====================================================
// CERTIFICATE LOCK RULES
// =====================================================

export const CERTIFICATE_UNLOCK_THRESHOLD = 200;

export const CERTIFICATE_STATUS_CONFIG = {
  lockMessage: "Certificate download is locked until you receive 200 endorsements/renominations.",
  progressMessage: (current: number) => 
    `You have ${current} of ${CERTIFICATE_UNLOCK_THRESHOLD} endorsements. Keep sharing your referral link!`,
  unlockMessage: "Congratulations! Your certificate is now available for download.",
};

// =====================================================
// NOTIFICATION TEMPLATES
// =====================================================

export const NRC_NOTIFICATION_TYPES = {
  ACCEPTANCE_LETTER: "acceptance_letter",
  RENOMINATION_UPDATE: "renomination_update",
  NRC_STATUS_DAILY: "nrc_status_daily",
  EVIDENCE_REQUEST: "evidence_request",
  VERIFIED: "verified",
  REJECTED: "rejected",
  CERT_UNLOCKED: "cert_unlocked",
  SLA_WARNING: "sla_warning",
  SLA_ESCALATION: "sla_escalation",
} as const;

export type NRCNotificationType = typeof NRC_NOTIFICATION_TYPES[keyof typeof NRC_NOTIFICATION_TYPES];
