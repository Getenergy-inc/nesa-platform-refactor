/**
 * NESA-Africa API Client - Main Export
 * 
 * Unified export for all API modules.
 */

// HTTP transport layer
export { api, request, ApiError, type ApiResponse, type PaginatedResponse } from "./http";

// Configuration APIs
export { default as configApi, getHealth, getSeason, getStage, configAdmin } from "./config";
export type { HealthStatus, SeasonInfo, SeasonResponse, StageInfo, StageResponse } from "./config";

// NRC Workflow APIs
export { default as nrcApi, getQueue, getStats, assignNomination, submitDecision, approveNomination, rejectNomination, requestInfo, getLogs } from "./nrc";
export type { NominationQueueItem, NRCStats, NRCDecision, NRCDecisionResult, AuditLogItem } from "./nrc";

// Voting APIs
export { default as votingApi, getEligibility, getTally, getMyVotes, castVote, castJuryScore, hasVotedFor } from "./voting";
export type { VotingEligibility, NomineeTally, CategoryTally, TallyResponse, UserVote, VoteResult } from "./voting";

// Certificates APIs
export { default as certificatesApi, verify, getMyCertificates, getById, certificatesAdmin } from "./certificates";
export type { Certificate as CertificateData, VerificationResult, IssueCertificatePayload } from "./certificates";

// Admin APIs
export { default as adminApi, migrations, roles, audit } from "./admin";
export type { ImportNominee, ImportResult, DryRunResult, AuditLog, UserRole } from "./admin";

// Jury APIs
export * from "./jury";

// Payments APIs
export * from "./payments";

// Content/CMS APIs
export * from "./content";

// Uploads APIs
export * from "./uploads";

// Wallet/GFA APIs
export * from "./wallet";

// OLC (Chapter) APIs (excluding getOLCDashboard which is in dashboard.ts)
export { default as olcApi, getChapterMembers, verifyMember, getSettlementHistory, requestSettlement, submitChapterMedia } from "./olc";

// Referrals APIs
export * from "./referrals";

// Dashboard APIs
export * from "./dashboard";
