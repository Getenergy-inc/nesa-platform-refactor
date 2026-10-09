// ============================================================================
// NESA-Africa 2026 — Google Form Data-Cleaning & Database Intake Spec
// ----------------------------------------------------------------------------
// Encodes the fixed contract every Google Form / response sheet must satisfy:
//   • Naming standards (form title, sheet title, folder name)
//   • Award-group + category short codes (used inside record IDs)
//   • Region short codes (used inside RMSA record IDs)
//   • Status enums for nomination, publication, school intervention
//   • Sheet tab column layouts (Cleaned Data → Website Sync Ready)
//   • record_id format builders
//   • Data-quality scoring weights (0–100)
//
// This module is config + helpers only. It is consumed by the admin intake
// dashboard and any future Google Sheets ingest pipeline. It does NOT store
// any Gmail credentials or OAuth tokens.
// ============================================================================

import type { AwardFamilyId } from "./types";

// ---------- Group codes ----------
export const AWARD_GROUP_CODES: Record<AwardFamilyId, string> = {
  "africa-education-icon": "ICON",
  "gold-blue-garnet": "GBG",
  platinum: "PLT",
  influencer: "IEIA",
};

// ---------- Category codes (23 award-category forms) ----------
export const CATEGORY_CODES: Record<string, string> = {
  "education-content-social-media-influencers": "SMI",
  "african-footballers-supporting-education": "FTB",
  "african-musicians-supporting-education": "MUS",
  "africa-education-icon-lifetime-achievement-2006-2026": "ICON",
  "africa-education-philanthropy-icon-of-the-decade": "PHIL",
  "literary-new-curriculum-advocate-icon-of-the-decade": "LITCUR",
  "africa-technical-educator-icon-of-the-decade": "TECH",
  "best-csr-for-education-nigeria": "CSRNG",
  "best-csr-for-education-africa-regional": "CSRAF",
  "best-edutech-innovation-for-education-africa-regional": "EDTECH",
  "best-media-organisation-for-education-advocacy-nigeria": "MEDIA",
  "best-ngo-for-education-advancement-nigeria": "NGONG",
  "best-ngo-for-education-advancement-africa-regional": "NGOAF",
  "best-stem-education-programme-africa-regional": "STEM",
  "best-creative-arts-contribution-to-education-nigeria": "ARTNG",
  "best-education-policy-implementation-state-nigeria": "POLST",
  "best-tertiary-institution-library-nigeria": "LIBNG",
  "excellence-in-research-development-for-education-nigeria": "RDNG",
  "excellence-in-christian-education-impact-africa-regional": "CHRIST",
  "excellence-in-islamic-education-impact-africa-regional": "ISLAM",
  "excellence-in-political-leadership-for-education-nigeria": "POLNG",
  "excellence-in-international-partnership-for-education-africa": "INTPART",
  "excellence-in-diaspora-educational-impact-international": "DIASP",
};

// ---------- Region codes (RMSA / EduAid-Africa) ----------
export const REGION_CODES: Record<string, string> = {
  "west-africa": "WAF",
  "east-africa": "EAF",
  "central-africa": "CAF",
  "southern-africa": "SAF",
  "north-africa": "NAF",
  "sahel-africa": "SAH",
  "horn-of-africa": "HAF",
  "indian-ocean-islands": "IOI",
  "african-diaspora": "DIA",
  "friends-of-africa": "FOA",
};

// ---------- Status enums ----------
export const NOMINATION_STATUSES = [
  "New Submission",
  "Incomplete",
  "Duplicate Suspected",
  "Evidence Missing",
  "Evidence Weak",
  "Evidence Review Pending",
  "Evidence Review Passed",
  "Category Fit Review",
  "Wrong Category",
  "Verification Pending",
  "Verification Passed",
  "Verification Failed",
  "Ready for Admin Review",
  "Approved for Website Sync",
  "Rejected",
  "Archived",
] as const;
export type NominationStatus = (typeof NOMINATION_STATUSES)[number];

export const PUBLICATION_STATUSES = [
  "Not Published",
  "Ready for Draft Profile",
  "Draft Profile Created",
  "Published",
  "Hidden",
  "Removed",
] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];

export const SCHOOL_STATUSES = [
  "New School Submission",
  "Duplicate Suspected",
  "Evidence Missing",
  "Verification Pending",
  "Verification Passed",
  "Regional Review",
  "Regional Shortlist",
  "Selected for Planning",
  "Not Selected",
  "Archived",
] as const;
export type SchoolStatus = (typeof SCHOOL_STATUSES)[number];

export const DUPLICATE_STATUSES = [
  "Not Checked",
  "No Duplicate Found",
  "Possible Duplicate",
  "Confirmed Duplicate",
  "Merged",
  "Keep Separate",
] as const;
export type DuplicateStatus = (typeof DUPLICATE_STATUSES)[number];

export const EVIDENCE_STATUSES = [
  "Evidence Missing",
  "Evidence Weak",
  "Evidence Review Pending",
  "Evidence Review Passed",
] as const;
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

// ---------- Sheet tab layouts ----------
// Column order matters — used to validate Google Sheet headers during ingest.
export const SHEET_TABS = {
  raw: "Raw Form Responses",
  cleaned: "Cleaned Data",
  duplicates: "Duplicate Review",
  evidence: "Evidence Review",
  contact: "Contact Log",
  approved: "Approved Nominee Export",
  websiteSync: "Website Sync Ready",
} as const;

export const CLEANED_DATA_COLUMNS = [
  "record_id",
  "form_type",
  "award_group",
  "award_category",
  "award_subcategory",
  "nominee_name_clean",
  "nominee_type_clean",
  "nominee_country_clean",
  "nominee_region_clean",
  "nominee_city_clean",
  "impact_summary_clean",
  "evidence_status",
  "duplicate_status",
  "verification_status",
  "nomination_status",
  "assigned_reviewer",
  "reviewer_notes",
  "website_sync_status",
] as const;

export const DUPLICATE_REVIEW_COLUMNS = [
  "record_id",
  "nominee_name_clean",
  "country",
  "category",
  "possible_duplicate_record_id",
  "duplicate_reason",
  "decision",
  "reviewer",
  "date_reviewed",
] as const;

export const EVIDENCE_REVIEW_COLUMNS = [
  "record_id",
  "evidence_link_1",
  "evidence_link_2",
  "evidence_type",
  "evidence_quality",
  "evidence_status",
  "reviewer",
  "reviewer_notes",
  "date_reviewed",
] as const;

export const CONTACT_LOG_COLUMNS = [
  "record_id",
  "nominee_name",
  "contact_method",
  "contact_person",
  "email_or_phone",
  "date_contacted",
  "response_status",
  "notes",
] as const;

export const APPROVED_EXPORT_COLUMNS = [
  "nominee_id",
  "display_name",
  "slug",
  "award_group",
  "category",
  "subcategory",
  "country",
  "region",
  "profile_summary",
  "impact_summary",
  "evidence_links",
  "verification_status",
  "publication_status",
] as const;

export const WEBSITE_SYNC_COLUMNS = [
  "nominee_id",
  "slug",
  "name",
  "type",
  "award_family",
  "category",
  "subcategory",
  "country",
  "region",
  "city",
  "short_bio",
  "impact_summary",
  "image_url",
  "evidence_url",
  "verification_badge",
  "status",
] as const;

export const SHEET_TAB_COLUMNS: Record<keyof typeof SHEET_TABS, readonly string[]> = {
  raw: [], // matches Google Form question order — validated upstream
  cleaned: CLEANED_DATA_COLUMNS,
  duplicates: DUPLICATE_REVIEW_COLUMNS,
  evidence: EVIDENCE_REVIEW_COLUMNS,
  contact: CONTACT_LOG_COLUMNS,
  approved: APPROVED_EXPORT_COLUMNS,
  websiteSync: WEBSITE_SYNC_COLUMNS,
};

// ---------- Naming helpers ----------
export function buildAwardFormTitle(categoryName: string): string {
  return `The New Education Standard Award Africa 2026 Public Nomination - ${categoryName}`;
}

export function buildRmsaFormTitle(regionName: string): string {
  return `The New Education Standard Award Africa 2026/2027 Special Needs School Intervention - ${regionName} School Nomination`;
}

export function buildAwardSheetTitle(categoryName: string): string {
  return `NESA 2026 - ${categoryName} - Responses`;
}

export function buildRmsaSheetTitle(regionName: string): string {
  return `NESA 2026-2027 RMSA Special Needs School Intervention - ${regionName} Responses`;
}

export function buildAwardFolderName(groupName: string, categoryName: string): string {
  return `NESA 2026 - ${groupName} - ${categoryName}`;
}

export function buildRmsaFolderName(regionName: string): string {
  return `NESA 2026-2027 - RMSA Special Needs School Intervention - ${regionName}`;
}

// ---------- record_id builders ----------
// Award:  NESA2026-[GROUPCODE]-[CATEGORYCODE]-[YYYYMMDD]-[ROWNUMBER]
// RMSA:   RMSA2027-[REGIONCODE]-[YYYYMMDD]-[ROWNUMBER]
function fmtDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}
function fmtRow(row: number): string {
  return String(Math.max(0, Math.floor(row))).padStart(4, "0");
}

export interface AwardRecordIdInput {
  family: AwardFamilyId;
  categorySlug: string;
  submittedAt: Date;
  rowNumber: number;
}

export function buildAwardRecordId(input: AwardRecordIdInput): string {
  const group = AWARD_GROUP_CODES[input.family];
  const cat = CATEGORY_CODES[input.categorySlug];
  if (!group) throw new Error(`Unknown award family: ${input.family}`);
  if (!cat) throw new Error(`Unknown category slug: ${input.categorySlug}`);
  return `NESA2026-${group}-${cat}-${fmtDate(input.submittedAt)}-${fmtRow(input.rowNumber)}`;
}

export interface RmsaRecordIdInput {
  regionSlug: string;
  submittedAt: Date;
  rowNumber: number;
}

export function buildRmsaRecordId(input: RmsaRecordIdInput): string {
  const region = REGION_CODES[input.regionSlug];
  if (!region) throw new Error(`Unknown region slug: ${input.regionSlug}`);
  return `RMSA2027-${region}-${fmtDate(input.submittedAt)}-${fmtRow(input.rowNumber)}`;
}

// ---------- Data Quality Score (0–100) ----------
// Mirrors §19 of the spec. Each flag worth its listed points.
export interface DataQualityFlags {
  submitterDetailsComplete?: boolean;
  nomineeNameAndTypeComplete?: boolean;
  countryAndRegionComplete?: boolean;
  correctCategoryAndSubcategory?: boolean;
  impactSummaryClear?: boolean;
  evidenceLinkProvided?: boolean;
  evidenceCredible?: boolean;
  contactRouteAvailable?: boolean;
  declarationCompleted?: boolean;
}

export const DATA_QUALITY_WEIGHTS = {
  submitterDetailsComplete: 10,
  nomineeNameAndTypeComplete: 10,
  countryAndRegionComplete: 10,
  correctCategoryAndSubcategory: 15,
  impactSummaryClear: 15,
  evidenceLinkProvided: 15,
  evidenceCredible: 15,
  contactRouteAvailable: 5,
  declarationCompleted: 5,
} as const;

export type DataQualityBand = "strong" | "reviewable" | "weak" | "not_ready";

export function computeDataQualityScore(flags: DataQualityFlags): number {
  let score = 0;
  for (const [k, weight] of Object.entries(DATA_QUALITY_WEIGHTS)) {
    if (flags[k as keyof DataQualityFlags]) score += weight;
  }
  return score;
}

export function bandForScore(score: number): DataQualityBand {
  if (score >= 80) return "strong";
  if (score >= 60) return "reviewable";
  if (score >= 40) return "weak";
  return "not_ready";
}
