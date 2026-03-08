/**
 * NESA Africa — Education Development Index (EDI) Scoring Engine
 * 5-Pillar evaluation system for nominee impact assessment
 * 
 * Pillars & Weights:
 *   Access to Education        — 20%
 *   Learning Quality           — 25%
 *   Institutional Strength     — 20%
 *   Innovation & Technology    — 20%
 *   Sustainability & Inclusion — 15%
 */

export interface EDIPillarScore {
  pillar: string;
  key: EDIPillarKey;
  weight: number;
  score: number;        // 0–100
  weightedScore: number; // score * weight
  description: string;
}

export type EDIPillarKey = 
  | "access"
  | "quality"
  | "institutional"
  | "innovation"
  | "sustainability";

export interface EDIScorecard {
  nomineeId: number;
  overallScore: number;     // 0–100 weighted composite
  grade: EDIGrade;
  pillars: EDIPillarScore[];
  generatedAt: string;
}

export type EDIGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";

const PILLAR_CONFIG: Record<EDIPillarKey, { label: string; weight: number; description: string }> = {
  access: {
    label: "Access to Education",
    weight: 0.20,
    description: "Reach, enrollment growth, scholarships, infrastructure expansion, and geographic coverage.",
  },
  quality: {
    label: "Learning Quality",
    weight: 0.25,
    description: "Curriculum development, teacher training, learning outcomes, assessment standards, and pedagogical innovation.",
  },
  institutional: {
    label: "Institutional Strength",
    weight: 0.20,
    description: "Governance, accreditation, organizational capacity, policy influence, and system-level impact.",
  },
  innovation: {
    label: "Innovation & Technology",
    weight: 0.20,
    description: "EdTech adoption, digital literacy, creative methodologies, research output, and scalable solutions.",
  },
  sustainability: {
    label: "Sustainability & Inclusion",
    weight: 0.15,
    description: "Gender equity, disability inclusion, environmental consciousness, long-term viability, and community ownership.",
  },
};

const PILLAR_KEYS: EDIPillarKey[] = ["access", "quality", "institutional", "innovation", "sustainability"];

function gradeFromScore(score: number): EDIGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  return "D";
}

/**
 * Deterministic EDI score generation based on nominee attributes.
 * Uses a seeded hash so the same nominee always gets the same scores.
 */
function seededRandom(seed: number, offset: number): number {
  const x = Math.sin(seed * 9301 + offset * 49297 + 233280) * 49297;
  return x - Math.floor(x);
}

function generatePillarScore(nomineeId: number, pillarIndex: number, achievement: string, category: string): number {
  // Base score from seeded random (55–95 range for realistic distribution)
  const base = 55 + seededRandom(nomineeId, pillarIndex) * 40;
  
  // Category-based bonuses
  const cat = category.toLowerCase();
  const bonuses: Record<EDIPillarKey, string[]> = {
    access: ["infrastructure", "school", "built", "constructed", "scholarship", "enrollment"],
    quality: ["training", "teacher", "curriculum", "learning", "pedagogy", "mentorship"],
    institutional: ["policy", "government", "state", "ministry", "governance", "accreditation"],
    innovation: ["technology", "digital", "ict", "stem", "innovation", "e-learning", "platform"],
    sustainability: ["inclusion", "gender", "disability", "community", "sustainable", "environment"],
  };
  
  const key = PILLAR_KEYS[pillarIndex];
  const relevantKeywords = bonuses[key];
  const achievementLower = (achievement + " " + cat).toLowerCase();
  const keywordHits = relevantKeywords.filter(kw => achievementLower.includes(kw)).length;
  const bonus = Math.min(keywordHits * 3, 10);
  
  return Math.min(Math.round(base + bonus), 100);
}

export function calculateEDIScorecard(nomineeId: number, achievement: string, category: string): EDIScorecard {
  const pillars: EDIPillarScore[] = PILLAR_KEYS.map((key, index) => {
    const config = PILLAR_CONFIG[key];
    const score = generatePillarScore(nomineeId, index, achievement, category);
    return {
      pillar: config.label,
      key,
      weight: config.weight,
      score,
      weightedScore: Math.round(score * config.weight * 100) / 100,
      description: config.description,
    };
  });

  const overallScore = Math.round(pillars.reduce((sum, p) => sum + p.weightedScore, 0));
  
  return {
    nomineeId,
    overallScore,
    grade: gradeFromScore(overallScore),
    pillars,
    generatedAt: new Date().toISOString(),
  };
}

export function getGradeColor(grade: EDIGrade): string {
  switch (grade) {
    case "A+": return "text-emerald-400";
    case "A": return "text-emerald-500";
    case "B+": return "text-blue-400";
    case "B": return "text-blue-500";
    case "C+": return "text-amber-400";
    case "C": return "text-amber-500";
    case "D": return "text-red-400";
  }
}

export function getGradeBg(grade: EDIGrade): string {
  switch (grade) {
    case "A+": return "bg-emerald-500/15 border-emerald-500/30";
    case "A": return "bg-emerald-500/10 border-emerald-500/20";
    case "B+": return "bg-blue-500/15 border-blue-500/30";
    case "B": return "bg-blue-500/10 border-blue-500/20";
    case "C+": return "bg-amber-500/15 border-amber-500/30";
    case "C": return "bg-amber-500/10 border-amber-500/20";
    case "D": return "bg-red-500/10 border-red-500/20";
  }
}

export function getPillarColor(key: EDIPillarKey): string {
  switch (key) {
    case "access": return "#10b981";      // emerald
    case "quality": return "#3b82f6";     // blue
    case "institutional": return "#f59e0b"; // amber
    case "innovation": return "#8b5cf6";  // violet
    case "sustainability": return "#06b6d4"; // cyan
  }
}

export { PILLAR_CONFIG, PILLAR_KEYS };
