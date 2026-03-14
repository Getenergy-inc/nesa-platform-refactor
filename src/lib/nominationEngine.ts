/**
 * Nomination Processing Engine
 * Handles: duplicate detection, auto-classification, NRC workflow routing,
 * re-nomination detection, and intake status management
 */

import { getAllMasterNominees, type MasterNominee } from "@/lib/nomineeMasterData";

// ═══════════════════════════════════════════════════════════════════
// INTAKE STATUS TYPES
// ═══════════════════════════════════════════════════════════════════

export type IntakeStatus =
  | "draft"
  | "submitted"
  | "duplicate_check"
  | "under_screening"
  | "documentation_incomplete"
  | "under_nrc_review"
  | "cleared"
  | "returned_for_clarification"
  | "declined"
  | "archived";

export type NominationType =
  | "new_nominee"
  | "existing_nominee"
  | "re_nominated"
  | "duplicate_submission"
  | "incomplete_submission"
  | "pending_nrc_review";

export interface IntakeStatusConfig {
  label: string;
  color: string;
  icon: string;
  step: number;
  description: string;
}

export const INTAKE_STATUS_CONFIG: Record<IntakeStatus, IntakeStatusConfig> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: "📝", step: 0, description: "Nomination saved as draft." },
  submitted: { label: "Submitted", color: "bg-blue-500/20 text-blue-400", icon: "📥", step: 1, description: "Nomination received and queued for processing." },
  duplicate_check: { label: "Duplicate Check", color: "bg-amber-500/20 text-amber-400", icon: "🔍", step: 2, description: "Checking for existing records and duplicates." },
  under_screening: { label: "Under Screening", color: "bg-orange-500/20 text-orange-400", icon: "📋", step: 3, description: "Automated eligibility screening in progress." },
  documentation_incomplete: { label: "Documentation Incomplete", color: "bg-red-500/20 text-red-300", icon: "⚠️", step: 3, description: "Missing required evidence or documentation." },
  under_nrc_review: { label: "Under NRC Review", color: "bg-purple-500/20 text-purple-400", icon: "🏛", step: 4, description: "Assigned to NRC reviewer for expert evaluation." },
  cleared: { label: "Cleared", color: "bg-emerald-500/20 text-emerald-400", icon: "✅", step: 5, description: "Nomination cleared and nominee approved." },
  returned_for_clarification: { label: "Returned for Clarification", color: "bg-orange-500/20 text-orange-400", icon: "↩️", step: 3, description: "Additional information required from nominator." },
  declined: { label: "Declined", color: "bg-red-500/20 text-red-400", icon: "❌", step: 0, description: "Nomination did not meet eligibility requirements." },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground", icon: "📦", step: 0, description: "Nomination archived for historical records." },
};

export const NOMINATION_TYPE_CONFIG: Record<NominationType, { label: string; color: string; description: string }> = {
  new_nominee: { label: "New Nominee", color: "bg-emerald-500/20 text-emerald-400", description: "First-time nomination in the NESA system." },
  existing_nominee: { label: "Existing Nominee", color: "bg-blue-500/20 text-blue-400", description: "Nominee already exists in the database." },
  re_nominated: { label: "Re-Nominated", color: "bg-purple-500/20 text-purple-400", description: "Existing nominee submitted for a new review cycle." },
  duplicate_submission: { label: "Duplicate Submission", color: "bg-amber-500/20 text-amber-400", description: "Duplicate of an existing nomination." },
  incomplete_submission: { label: "Incomplete", color: "bg-red-500/20 text-red-300", description: "Nomination missing required fields or evidence." },
  pending_nrc_review: { label: "Pending NRC Review", color: "bg-purple-500/20 text-purple-400", description: "Awaiting NRC expert assessment." },
};

// ═══════════════════════════════════════════════════════════════════
// DUPLICATE DETECTION ENGINE
// ═══════════════════════════════════════════════════════════════════

export interface DuplicateMatch {
  nominee: MasterNominee;
  matchType: "exact" | "close" | "category_country" | "historical";
  confidence: number; // 0–100
  matchDetails: string;
}

function normalizeStr(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function nameSimilarity(a: string, b: string): number {
  const na = normalizeStr(a);
  const nb = normalizeStr(b);
  if (na === nb) return 100;
  const maxLen = Math.max(na.length, nb.length);
  if (maxLen === 0) return 0;
  const dist = levenshtein(na, nb);
  return Math.round((1 - dist / maxLen) * 100);
}

export function detectDuplicates(
  name: string,
  country?: string,
  category?: string,
): DuplicateMatch[] {
  const allNominees = getAllMasterNominees();
  const matches: DuplicateMatch[] = [];
  const normalizedName = normalizeStr(name);

  if (!normalizedName || normalizedName.length < 3) return [];

  for (const nominee of allNominees) {
    const similarity = nameSimilarity(name, nominee.name);

    // Exact match
    if (similarity >= 95) {
      matches.push({
        nominee,
        matchType: "exact",
        confidence: similarity,
        matchDetails: `Exact name match: "${nominee.name}"`,
      });
      continue;
    }

    // Close match
    if (similarity >= 75) {
      matches.push({
        nominee,
        matchType: "close",
        confidence: similarity,
        matchDetails: `Similar name (${similarity}% match): "${nominee.name}"`,
      });
      continue;
    }

    // Category + Country match with partial name
    if (
      similarity >= 50 &&
      country &&
      category &&
      normalizeStr(nominee.country) === normalizeStr(country) &&
      normalizeStr(nominee.category).includes(normalizeStr(category).slice(0, 15))
    ) {
      matches.push({
        nominee,
        matchType: "category_country",
        confidence: similarity + 10,
        matchDetails: `Same country & category with partial name match: "${nominee.name}"`,
      });
    }
  }

  return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
}

// ═══════════════════════════════════════════════════════════════════
// AUTO-CLASSIFICATION ENGINE
// ═══════════════════════════════════════════════════════════════════

export interface ClassificationResult {
  nominationType: NominationType;
  intakeStatus: IntakeStatus;
  duplicateMatches: DuplicateMatch[];
  isReNomination: boolean;
  existingNomineeId?: number;
  flags: string[];
  autoDecisions: string[];
}

export function classifyNomination(input: {
  name: string;
  country: string;
  category: string;
  subcategory: string;
  justification: string;
  evidenceCount: number;
  isReNomination?: boolean;
  existingNomineeId?: number;
}): ClassificationResult {
  const flags: string[] = [];
  const autoDecisions: string[] = [];
  const duplicateMatches = detectDuplicates(input.name, input.country, input.category);

  // Check completeness
  if (!input.justification || input.justification.length < 50) {
    flags.push("Justification too short (< 50 chars)");
  }
  if (input.evidenceCount === 0) {
    flags.push("No evidence documents uploaded");
  }

  // Determine nomination type
  let nominationType: NominationType;
  let intakeStatus: IntakeStatus;
  let isReNomination = input.isReNomination || false;
  let existingNomineeId = input.existingNomineeId;

  if (input.isReNomination && input.existingNomineeId) {
    nominationType = "re_nominated";
    intakeStatus = "under_screening";
    autoDecisions.push("Identified as re-nomination of existing nominee");
  } else if (duplicateMatches.some(m => m.matchType === "exact")) {
    const exact = duplicateMatches.find(m => m.matchType === "exact")!;
    nominationType = "duplicate_submission";
    intakeStatus = "duplicate_check";
    existingNomineeId = exact.nominee.id;
    autoDecisions.push(`Exact match found: "${exact.nominee.name}" (ID: ${exact.nominee.id})`);
    autoDecisions.push("Routing to duplicate review queue");
  } else if (duplicateMatches.some(m => m.confidence >= 80)) {
    nominationType = "existing_nominee";
    intakeStatus = "duplicate_check";
    autoDecisions.push("Close match detected — routing to duplicate review");
  } else if (flags.length > 0 && input.evidenceCount === 0) {
    nominationType = "incomplete_submission";
    intakeStatus = "documentation_incomplete";
    autoDecisions.push("Incomplete submission — missing evidence");
  } else {
    nominationType = "new_nominee";
    intakeStatus = "under_screening";
    autoDecisions.push("New nominee — proceeding to eligibility screening");
  }

  // Auto-route based on completeness
  if (intakeStatus === "under_screening" && flags.length === 0 && input.evidenceCount >= 1 && input.justification.length >= 100) {
    autoDecisions.push("Documentation complete — advancing to NRC review queue");
    intakeStatus = "under_nrc_review";
  }

  return {
    nominationType,
    intakeStatus,
    duplicateMatches,
    isReNomination,
    existingNomineeId,
    flags,
    autoDecisions,
  };
}

// ═══════════════════════════════════════════════════════════════════
// EDI PRE-SCORING PLACEHOLDERS
// ═══════════════════════════════════════════════════════════════════

export interface EDIReadiness {
  access: number | null;
  learning: number | null;
  institutional: number | null;
  innovation: number | null;
  sustainability: number | null;
  readyForReview: boolean;
}

export function generateEDIReadiness(justification: string, evidenceCount: number): EDIReadiness {
  const hasContent = justification.length > 100;
  const hasEvidence = evidenceCount > 0;
  return {
    access: null,
    learning: null,
    institutional: null,
    innovation: null,
    sustainability: null,
    readyForReview: hasContent && hasEvidence,
  };
}

// ═══════════════════════════════════════════════════════════════════
// SIMULATED INTAKE RECORDS (for dashboard display)
// ═══════════════════════════════════════════════════════════════════

export interface IntakeRecord {
  id: string;
  nomineeName: string;
  country: string;
  category: string;
  pathway: string;
  nominationType: NominationType;
  intakeStatus: IntakeStatus;
  nominatorName: string;
  nominatorEmail: string;
  submittedAt: string;
  lastUpdated: string;
  assignedReviewer: string | null;
  duplicateMatchId: number | null;
  flags: string[];
  evidenceCount: number;
  justificationLength: number;
}

const SAMPLE_NOMINATORS = [
  { name: "Dr. Amina Osei", email: "a.osei@edu.org" },
  { name: "Prof. Kwame Asante", email: "k.asante@unilag.edu" },
  { name: "Sarah Johnson", email: "s.johnson@foundation.org" },
  { name: "Ibrahim Danladi", email: "i.danladi@ngo.org" },
  { name: "Grace Nwankwo", email: "g.nwankwo@school.ng" },
];

const SAMPLE_REVIEWERS = [
  "Dr. F. Okonkwo", "Prof. A. Diallo", "Dr. M. Hassan",
  "Prof. L. Mensah", "Dr. R. Kimani", null,
];

export function generateIntakeRecords(): IntakeRecord[] {
  const nominees = getAllMasterNominees();
  const records: IntakeRecord[] = [];

  // Generate ~40 intake records from existing nominees
  const sample = nominees.slice(0, 40);
  const statusDistribution: IntakeStatus[] = [
    "submitted", "submitted", "submitted", "submitted", "submitted",
    "duplicate_check", "duplicate_check", "duplicate_check",
    "under_screening", "under_screening", "under_screening", "under_screening",
    "documentation_incomplete", "documentation_incomplete",
    "under_nrc_review", "under_nrc_review", "under_nrc_review", "under_nrc_review", "under_nrc_review",
    "cleared", "cleared", "cleared",
    "returned_for_clarification", "returned_for_clarification",
    "declined",
  ];

  const typeDistribution: NominationType[] = [
    "new_nominee", "new_nominee", "new_nominee", "new_nominee", "new_nominee",
    "existing_nominee", "existing_nominee", "existing_nominee",
    "re_nominated", "re_nominated", "re_nominated",
    "duplicate_submission", "duplicate_submission",
    "incomplete_submission", "incomplete_submission",
    "pending_nrc_review", "pending_nrc_review",
  ];

  for (let i = 0; i < sample.length; i++) {
    const n = sample[i];
    const nominator = SAMPLE_NOMINATORS[i % SAMPLE_NOMINATORS.length];
    const status = statusDistribution[i % statusDistribution.length];
    const type = typeDistribution[i % typeDistribution.length];
    const flags: string[] = [];

    if (type === "incomplete_submission") flags.push("Missing evidence documents");
    if (type === "duplicate_submission") flags.push("Potential duplicate detected");
    if (status === "documentation_incomplete") flags.push("Justification too short");

    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const submitted = new Date();
    submitted.setDate(submitted.getDate() - daysAgo);

    records.push({
      id: `intake-${n.id}-${i}`,
      nomineeName: n.name,
      country: n.country || "Nigeria",
      category: n.category,
      pathway: n.pathway,
      nominationType: type,
      intakeStatus: status,
      nominatorName: nominator.name,
      nominatorEmail: nominator.email,
      submittedAt: submitted.toISOString(),
      lastUpdated: new Date().toISOString(),
      assignedReviewer: SAMPLE_REVIEWERS[i % SAMPLE_REVIEWERS.length],
      duplicateMatchId: type === "duplicate_submission" ? n.id : null,
      flags,
      evidenceCount: Math.floor(Math.random() * 5),
      justificationLength: Math.floor(Math.random() * 500) + 50,
    });
  }

  return records;
}

// ═══════════════════════════════════════════════════════════════════
// INTAKE STATS
// ═══════════════════════════════════════════════════════════════════

export interface IntakeStats {
  total: number;
  newNominees: number;
  existingNominees: number;
  reNominations: number;
  duplicates: number;
  incomplete: number;
  pendingScreening: number;
  pendingDuplicateCheck: number;
  pendingDocReview: number;
  pendingNRCReview: number;
  cleared: number;
  declined: number;
  returned: number;
  flagged: number;
}

export function computeIntakeStats(records: IntakeRecord[]): IntakeStats {
  const stats: IntakeStats = {
    total: records.length,
    newNominees: 0, existingNominees: 0, reNominations: 0,
    duplicates: 0, incomplete: 0,
    pendingScreening: 0, pendingDuplicateCheck: 0, pendingDocReview: 0,
    pendingNRCReview: 0, cleared: 0, declined: 0, returned: 0, flagged: 0,
  };

  for (const r of records) {
    if (r.nominationType === "new_nominee") stats.newNominees++;
    if (r.nominationType === "existing_nominee") stats.existingNominees++;
    if (r.nominationType === "re_nominated") stats.reNominations++;
    if (r.nominationType === "duplicate_submission") stats.duplicates++;
    if (r.nominationType === "incomplete_submission") stats.incomplete++;

    if (r.intakeStatus === "submitted") stats.pendingScreening++;
    if (r.intakeStatus === "duplicate_check") stats.pendingDuplicateCheck++;
    if (r.intakeStatus === "documentation_incomplete") stats.pendingDocReview++;
    if (r.intakeStatus === "under_nrc_review") stats.pendingNRCReview++;
    if (r.intakeStatus === "cleared") stats.cleared++;
    if (r.intakeStatus === "declined") stats.declined++;
    if (r.intakeStatus === "returned_for_clarification") stats.returned++;
    if (r.flags.length > 0) stats.flagged++;
  }

  return stats;
}
