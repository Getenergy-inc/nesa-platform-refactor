// NESA-Africa 2026 — Generic 10-indicator Education Development Index (EDI) Matrix.
// Rendered alongside every nomination form as a Phase-1 placeholder.
// TODO(phase-2): Replace with 18 category-specific EDI matrices authored by NRC.

export interface EDIIndicator {
  id: string;
  label: string;
  description: string;
}

export const EDI_MATRIX_VERSION = "v1.0-generic-2026";

export const EDI_MATRIX_GENERIC: EDIIndicator[] = [
  {
    id: "access-participation",
    label: "Access & Participation",
    description:
      "Number of learners reached, geographic spread, and removal of barriers to enrolment.",
  },
  {
    id: "quality",
    label: "Quality",
    description: "Rigor of teaching, curriculum standards, and demonstrable learning outcomes.",
  },
  {
    id: "scale-reach",
    label: "Scale & Reach",
    description: "Programme size, replication, and cross-region or cross-country footprint.",
  },
  {
    id: "inclusion-equity",
    label: "Inclusion & Equity",
    description:
      "Gender balance, support for learners with disabilities, and inclusion of underserved populations.",
  },
  {
    id: "innovation-relevance",
    label: "Innovation & Relevance",
    description: "Novel approaches, technology adoption, and alignment with 21st-century skills.",
  },
  {
    id: "sustainability-continuity",
    label: "Sustainability & Continuity",
    description: "Longevity of impact, funding resilience, and institutional continuity.",
  },
  {
    id: "evidence-quality",
    label: "Evidence Quality",
    description:
      "Strength of documentation: reports, audits, publications, independent verification.",
  },
  {
    id: "partnerships",
    label: "Partnerships",
    description: "Multilateral, bilateral, private-sector and community collaborations.",
  },
  {
    id: "leadership-integrity",
    label: "Leadership & Integrity",
    description: "Governance record, transparency, and ethical stewardship.",
  },
  {
    id: "outcomes-legacy",
    label: "Measurable Outcomes & Legacy",
    description: "Long-term change in learners, communities, or systems attributable to the work.",
  },
];
