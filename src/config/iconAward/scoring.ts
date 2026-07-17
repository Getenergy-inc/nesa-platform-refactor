// Africa Education Icon Award — scoring & result framework (client mirror).
export const ICON_SCORING_CRITERIA = [
  { slug: "lifetime-impact", name: "Lifetime Education Impact", weight: 25 },
  { slug: "scale-reach", name: "Scale and Reach", weight: 15 },
  { slug: "sustainability-legacy", name: "Sustainability and Legacy", weight: 15 },
  { slug: "innovation", name: "Innovation or Knowledge Contribution", weight: 10 },
  { slug: "inclusion-equity", name: "Inclusion and Equity", weight: 10 },
  { slug: "leadership-integrity", name: "Leadership and Integrity", weight: 10 },
  { slug: "evidence-quality", name: "Evidence Quality", weight: 10 },
  { slug: "continental-relevance", name: "Continental Relevance", weight: 5 },
] as const;

export const ICON_RECOMMENDATIONS = [
  { value: "laureate_consideration", label: "Recommended for Laureate Consideration" },
  { value: "final_discussion", label: "Recommended for Final Discussion" },
  { value: "strong_not_final", label: "Strong Nominee, Not Final Laureate" },
  { value: "insufficient_evidence", label: "Insufficient Evidence" },
  { value: "recuse", label: "Recuse / Conflict" },
] as const;

export const ICON_CONFLICT_TYPES = [
  "personal","professional","financial","political",
  "institutional","family","prior_collaboration","other",
] as const;

export const ICON_RESULT_STATUSES = [
  "scoring_open","scoring_closed","under_moderation","awaiting_deliberation",
  "recommended","awaiting_governance","approved_laureate","held_for_clarification",
  "not_selected","confidential",
] as const;

export const ICON_MIN_REVIEWERS = 3;

export const ICON_TIE_BREAK_CHAIN = [
  "Lifetime Education Impact score",
  "Sustainability and Legacy score",
  "Evidence Quality score",
  "Median score",
  "Score variance (lower)",
  "Jury deliberation",
  "Governance confirmation",
];
