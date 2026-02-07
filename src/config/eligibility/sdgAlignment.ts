/**
 * NESA-Africa 2025 — SDG 4 & AU Agenda 2063 Alignment
 * Strategic mapping for all Super Categories
 */

export interface SDGTarget {
  id: string;
  code: string;
  label: string;
  description: string;
  indicators: string[];
}

export interface AU2063Goal {
  id: string;
  aspiration: number;
  label: string;
  description: string;
  educationFocus: string[];
}

// SDG 4 Targets
export const SDG4_TARGETS: SDGTarget[] = [
  {
    id: "sdg4_1",
    code: "4.1",
    label: "Free Primary & Secondary Education",
    description: "Foundational learning or secondary completion gains",
    indicators: [
      "Completion rates (primary, lower secondary, upper secondary)",
      "Minimum proficiency in reading and mathematics",
      "Out-of-school rates by age group",
    ],
  },
  {
    id: "sdg4_2",
    code: "4.2",
    label: "Early Childhood Development",
    description: "Early childhood access and quality",
    indicators: [
      "Participation rate in organized learning (one year before primary)",
      "Developmentally on track in health, learning and psychosocial well-being",
      "Pre-primary education gross enrolment ratio",
    ],
  },
  {
    id: "sdg4_3",
    code: "4.3",
    label: "TVET & Tertiary Access",
    description: "TVET/skills/tertiary access or employability",
    indicators: [
      "Participation rate in formal and non-formal education",
      "Gross enrolment ratio for tertiary education",
      "TVET graduation rates",
    ],
  },
  {
    id: "sdg4_4",
    code: "4.4",
    label: "Skills for Employment",
    description: "Relevant skills for employment",
    indicators: [
      "Youth/adults with ICT skills by type",
      "Youth/adults with technical and vocational skills",
      "Employment rates of graduates",
    ],
  },
  {
    id: "sdg4_5",
    code: "4.5",
    label: "Equity & Inclusion",
    description: "Equity and inclusion improvements",
    indicators: [
      "Parity indices (female/male, rural/urban, wealth quintile, disability)",
      "Percentage of students receiving financial aid",
      "Inclusion rates for marginalized groups",
    ],
  },
  {
    id: "sdg4_a",
    code: "4.a",
    label: "Safe Learning Environments",
    description: "Safe, inclusive learning spaces and infrastructure",
    indicators: [
      "Schools with electricity, internet, computers",
      "Schools with adapted infrastructure for disabilities",
      "Schools with access to WASH facilities",
    ],
  },
  {
    id: "sdg4_c",
    code: "4.c",
    label: "Qualified Teachers",
    description: "Teacher training and quality",
    indicators: [
      "Proportion of teachers with minimum qualifications",
      "Pupil-to-qualified-teacher ratio",
      "Teachers receiving in-service training",
    ],
  },
];

// AU Agenda 2063 Education Goals
export const AU_2063_GOALS: AU2063Goal[] = [
  {
    id: "au_aspiration1",
    aspiration: 1,
    label: "A Prosperous Africa",
    description: "Based on inclusive growth and sustainable development",
    educationFocus: [
      "Well-educated citizens and skills revolution underpinned by science, technology and innovation",
      "Human capital development as social and economic catalyst",
      "Expanded access to quality education at all levels",
    ],
  },
  {
    id: "au_aspiration2",
    aspiration: 2,
    label: "An Integrated Continent",
    description: "Politically united and based on the ideals of Pan Africanism",
    educationFocus: [
      "Harmonized education curricula and mutual recognition of qualifications",
      "Continental education frameworks and standards",
      "Student and teacher mobility programs",
    ],
  },
  {
    id: "au_aspiration6",
    aspiration: 6,
    label: "People-Driven Development",
    description: "Relying on the potential of African people, especially women and youth",
    educationFocus: [
      "Youth empowerment through education and skills training",
      "TVET expansion and alignment with labor market needs",
      "Girls' education and gender parity",
    ],
  },
];

// SCEF / NESA-Africa / EduAid-Africa Strategic Alignment
export const STRATEGIC_OBJECTIVES = {
  scef: {
    name: "SCEF (Scholarship Council for Education Foundation)",
    objectives: [
      "Scholarships & micro-grants",
      "School upgrades & safe learning spaces",
      "Evidence-driven excellence",
      "Governance firewalls",
      "Partnership funding to continuously raise standards",
    ],
  },
  nesaAfrica: {
    name: "NESA-Africa",
    objectives: [
      "Recognition of educational excellence across Africa",
      "Quality, equity, inclusion benchmarks",
      "Transparent, competitive verification processes",
      "Public engagement in educational recognition",
    ],
  },
  eduAidAfrica: {
    name: "EduAid-Africa",
    objectives: [
      "Scholarships & micro-grants distribution",
      "School infrastructure improvements",
      "Teacher professional development support",
      "Community education initiatives",
    ],
  },
};

// Blue Garnet Gold SDG/AU Alignment (meet ≥2)
export const GOLD_SDG_ALIGNMENT_CHECKS = [
  { targetCode: "4.1", description: "Foundational learning or secondary completion gains" },
  { targetCode: "4.2", description: "Early childhood access/quality" },
  { targetCode: "4.3/4.4", description: "TVET/skills/tertiary access or employability" },
  { targetCode: "4.5", description: "Equity/inclusion improvements" },
  { targetCode: "4.a", description: "Safe/inclusive learning spaces & infrastructure" },
  { targetCode: "4.c", description: "Teacher training/quality" },
];

export const MINIMUM_SDG_ALIGNMENT = 2;

/**
 * Validate SDG alignment meets minimum requirement
 */
export function validateSDGAlignment(selectedTargets: string[]): boolean {
  return selectedTargets.length >= MINIMUM_SDG_ALIGNMENT;
}
