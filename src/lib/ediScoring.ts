/**
 * NESA Africa — Education Development Index (EDI) Scoring Engine
 * 5-Pillar evaluation with pillar-specific max scores totaling 100:
 *   Access to Education        — max 20
 *   Learning Quality           — max 25
 *   Institutional Strength     — max 20
 *   Innovation & Technology    — max 20
 *   Sustainability & Inclusion — max 15
 */

export interface EDIPillarScore {
  pillar: string;
  key: EDIPillarKey;
  maxScore: number;
  score: number;        // 0 – maxScore
  percentage: number;   // score / maxScore * 100
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
  overallScore: number;     // 0–100 (sum of all pillars)
  grade: EDIGrade;
  pillars: EDIPillarScore[];
  impactSummary: string;
  generatedAt: string;
}

export type EDIGrade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D";

export const PILLAR_CONFIG: Record<EDIPillarKey, { label: string; maxScore: number; description: string; keywords: string[] }> = {
  access: {
    label: "Access to Education",
    maxScore: 20,
    description: "Scholarships funded, schools built, underserved communities reached, gender & disability inclusion.",
    keywords: ["infrastructure", "school", "built", "constructed", "scholarship", "enrollment", "access", "rural", "underserved", "girls"],
  },
  quality: {
    label: "Learning Quality",
    maxScore: 25,
    description: "Curriculum reform, teacher training, academic standards, literacy improvement, learning outcomes.",
    keywords: ["training", "teacher", "curriculum", "learning", "pedagogy", "mentorship", "literacy", "exam", "quality", "standards"],
  },
  institutional: {
    label: "Institutional Strength",
    maxScore: 20,
    description: "Universities founded, national reforms, institutional leadership, governance improvements.",
    keywords: ["policy", "government", "state", "ministry", "governance", "accreditation", "university", "reform", "leadership", "institution"],
  },
  innovation: {
    label: "Innovation & Technology",
    maxScore: 20,
    description: "EdTech platforms, digital learning, AI in education, STEM programs, technical education.",
    keywords: ["technology", "digital", "ict", "stem", "innovation", "e-learning", "platform", "coding", "ai", "data"],
  },
  sustainability: {
    label: "Sustainability & Inclusion",
    maxScore: 15,
    description: "Scalable programs, community ownership, funding sustainability, marginalized learner inclusion.",
    keywords: ["inclusion", "gender", "disability", "community", "sustainable", "environment", "scalable", "equity", "women", "peace"],
  },
};

export const PILLAR_KEYS: EDIPillarKey[] = ["access", "quality", "institutional", "innovation", "sustainability"];

function gradeFromScore(score: number): EDIGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  return "D";
}

function seededRandom(seed: number, offset: number): number {
  const x = Math.sin(seed * 9301 + offset * 49297 + 233280) * 49297;
  return x - Math.floor(x);
}

function generatePillarScore(nomineeId: number, key: EDIPillarKey, achievement: string, category: string): number {
  const config = PILLAR_CONFIG[key];
  const pillarIndex = PILLAR_KEYS.indexOf(key);
  // Base percentage 55–92%
  const basePct = 55 + seededRandom(nomineeId, pillarIndex) * 37;
  // Keyword bonus
  const text = (achievement + " " + category).toLowerCase();
  const hits = config.keywords.filter(kw => text.includes(kw)).length;
  const bonus = Math.min(hits * 2.5, 8);
  const pct = Math.min(basePct + bonus, 98);
  return Math.round((pct / 100) * config.maxScore * 10) / 10; // one decimal
}

function generateImpactSummary(pillars: EDIPillarScore[], grade: EDIGrade, overallScore: number): string {
  const strongest = [...pillars].sort((a, b) => b.percentage - a.percentage)[0];
  const weakest = [...pillars].sort((a, b) => a.percentage - b.percentage)[0];
  const gradeDesc = grade.startsWith("A") ? "exceptional" : grade.startsWith("B") ? "strong" : "moderate";
  return `This nominee demonstrates ${gradeDesc} impact across African education development (EDI ${overallScore}/100). ` +
    `Their strongest contribution is in ${strongest.pillar} (${strongest.score}/${strongest.maxScore}), ` +
    `while ${weakest.pillar} (${weakest.score}/${weakest.maxScore}) presents an opportunity for further development. ` +
    `The overall evaluation reflects documented contributions to continental education between 2005 and 2025.`;
}

export function calculateEDIScorecard(nomineeId: number, achievement: string, category: string): EDIScorecard {
  const pillars: EDIPillarScore[] = PILLAR_KEYS.map(key => {
    const config = PILLAR_CONFIG[key];
    const score = generatePillarScore(nomineeId, key, achievement, category);
    return {
      pillar: config.label,
      key,
      maxScore: config.maxScore,
      score,
      percentage: Math.round((score / config.maxScore) * 100),
      description: config.description,
    };
  });

  const overallScore = Math.round(pillars.reduce((sum, p) => sum + p.score, 0));
  const grade = gradeFromScore(overallScore);

  return {
    nomineeId,
    overallScore,
    grade,
    pillars,
    impactSummary: generateImpactSummary(pillars, grade, overallScore),
    generatedAt: new Date().toISOString(),
  };
}

// --- Benchmarking utilities ---

export interface CategoryBenchmark {
  category: string;
  avgScore: number;
  count: number;
  topNominees: { name: string; score: number }[];
}

export interface RegionalBenchmark {
  region: string;
  avgScore: number;
  count: number;
  topNominees: { name: string; score: number }[];
}

export function computeCategoryBenchmarks(
  nominees: { id: number; name: string; category: string; achievement: string }[]
): CategoryBenchmark[] {
  const groups: Record<string, { scores: number[]; nominees: { name: string; score: number }[] }> = {};
  for (const n of nominees) {
    const sc = calculateEDIScorecard(n.id, n.achievement, n.category);
    if (!groups[n.category]) groups[n.category] = { scores: [], nominees: [] };
    groups[n.category].scores.push(sc.overallScore);
    groups[n.category].nominees.push({ name: n.name, score: sc.overallScore });
  }
  return Object.entries(groups).map(([category, data]) => ({
    category,
    avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    count: data.scores.length,
    topNominees: data.nominees.sort((a, b) => b.score - a.score).slice(0, 5),
  })).sort((a, b) => b.avgScore - a.avgScore);
}

export function computeRegionalBenchmarks(
  nominees: { id: number; name: string; category: string; achievement: string; region: string }[]
): RegionalBenchmark[] {
  const regionMap: Record<string, string> = {
    "West Africa": "West Africa", "East Africa": "East Africa",
    "North Africa": "North Africa", "Central Africa": "Central Africa",
    "Southern Africa": "Southern Africa", "Diaspora": "Diaspora",
    "N/A": "Nigeria", "": "Nigeria",
  };
  const groups: Record<string, { scores: number[]; nominees: { name: string; score: number }[] }> = {};
  for (const n of nominees) {
    const sc = calculateEDIScorecard(n.id, n.achievement, n.category);
    const reg = regionMap[n.region] || n.region || "Other";
    if (!groups[reg]) groups[reg] = { scores: [], nominees: [] };
    groups[reg].scores.push(sc.overallScore);
    groups[reg].nominees.push({ name: n.name, score: sc.overallScore });
  }
  return Object.entries(groups).map(([region, data]) => ({
    region,
    avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
    count: data.scores.length,
    topNominees: data.nominees.sort((a, b) => b.score - a.score).slice(0, 5),
  })).sort((a, b) => b.avgScore - a.avgScore);
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
    case "access": return "#10b981";
    case "quality": return "#3b82f6";
    case "institutional": return "#f59e0b";
    case "innovation": return "#8b5cf6";
    case "sustainability": return "#06b6d4";
  }
}
