/**
 * NESA-Africa 2025 — Evidence Tiers
 * Used across all Super Categories for validation
 */

export type EvidenceTier = "A" | "B" | "C";

export interface EvidenceType {
  id: string;
  tier: EvidenceTier;
  label: string;
  description: string;
  examples: string[];
  weight: number;
}

export const EVIDENCE_TYPES: EvidenceType[] = [
  // Tier A (Strong) - Weight 3
  {
    id: "independent_evaluation",
    tier: "A",
    label: "Independent Evaluation",
    description: "Third-party evaluation or external assessment",
    examples: ["External evaluator report", "Impact assessment by research institution"],
    weight: 3,
  },
  {
    id: "audited_outcomes",
    tier: "A",
    label: "Audited Outcomes",
    description: "Outcomes verified by external auditor",
    examples: ["Audited impact report", "Verified beneficiary count"],
    weight: 3,
  },
  {
    id: "government_datasets",
    tier: "A",
    label: "Government/Agency Datasets",
    description: "Official data from government or multilateral agencies",
    examples: ["Ministry of Education data", "UNESCO/UNICEF statistics", "National exam results"],
    weight: 3,
  },
  {
    id: "peer_reviewed",
    tier: "A",
    label: "Peer-Reviewed Studies",
    description: "Published academic or peer-reviewed research",
    examples: ["Journal articles", "Conference papers", "Research reports"],
    weight: 3,
  },

  // Tier B (Moderate) - Weight 2
  {
    id: "internal_me",
    tier: "B",
    label: "Internal M&E Reports",
    description: "Organization's monitoring and evaluation data",
    examples: ["Quarterly M&E reports", "Annual impact reports", "Progress dashboards"],
    weight: 2,
  },
  {
    id: "platform_analytics",
    tier: "B",
    label: "Platform Analytics",
    description: "Usage and engagement data from digital platforms",
    examples: ["Learning platform analytics", "App usage statistics", "Completion rates"],
    weight: 2,
  },
  {
    id: "financials",
    tier: "B",
    label: "Financial Records",
    description: "Financial statements and budget execution",
    examples: ["Audited financials", "Budget vs actual reports", "Grant expenditure records"],
    weight: 2,
  },
  {
    id: "mou_loa",
    tier: "B",
    label: "MoUs/LoAs",
    description: "Signed memoranda of understanding or letters of agreement",
    examples: ["Partnership MoUs", "Government endorsement letters", "Institutional agreements"],
    weight: 2,
  },

  // Tier C (Supporting) - Weight 1
  {
    id: "testimonials",
    tier: "C",
    label: "Testimonials",
    description: "Written or recorded statements from beneficiaries/stakeholders",
    examples: ["Beneficiary testimonials", "Partner endorsements", "Community feedback"],
    weight: 1,
  },
  {
    id: "press_coverage",
    tier: "C",
    label: "Press/Media Coverage",
    description: "News articles and media mentions",
    examples: ["Newspaper articles", "TV/radio coverage", "Online news mentions"],
    weight: 1,
  },
  {
    id: "photos_videos",
    tier: "C",
    label: "Photos/Videos",
    description: "Visual documentation with consent",
    examples: ["Program photos", "Event videos", "Before/after documentation"],
    weight: 1,
  },
  {
    id: "case_studies",
    tier: "C",
    label: "Case Studies",
    description: "Documented case studies and success stories",
    examples: ["Beneficiary case studies", "Program case studies", "Best practice documentation"],
    weight: 1,
  },
  {
    id: "classroom_artifacts",
    tier: "C",
    label: "Classroom Artifacts",
    description: "Educational materials and classroom documentation",
    examples: ["Lesson plans", "Student work samples", "Curriculum materials"],
    weight: 1,
  },
];

export const TIER_CONFIG = {
  A: {
    label: "Tier A (Strong)",
    color: "emerald",
    minRequired: 1,
    weight: 3,
  },
  B: {
    label: "Tier B (Moderate)",
    color: "blue",
    minRequired: 2,
    weight: 2,
  },
  C: {
    label: "Tier C (Supporting)",
    color: "amber",
    minRequired: 0,
    weight: 1,
  },
};

/**
 * Validates if evidence meets minimum requirements
 * Requirement: At least 1 Tier-A OR 2 Tier-B evidence items
 */
export function validateEvidenceRequirement(evidenceIds: string[]): boolean {
  const types = evidenceIds.map(id => EVIDENCE_TYPES.find(t => t.id === id)).filter(Boolean);
  
  const tierACounts = types.filter(t => t?.tier === "A").length;
  const tierBCounts = types.filter(t => t?.tier === "B").length;
  
  return tierACounts >= 1 || tierBCounts >= 2;
}

/**
 * Calculate total evidence weight score
 */
export function calculateEvidenceScore(evidenceIds: string[]): number {
  return evidenceIds.reduce((total, id) => {
    const type = EVIDENCE_TYPES.find(t => t.id === id);
    return total + (type?.weight || 0);
  }, 0);
}
