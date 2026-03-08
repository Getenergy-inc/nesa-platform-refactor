/**
 * NESA Master Nominee Data Layer — 2025 Season
 * Source of truth: src/data/nominees-2025.ts (GitHub-stored)
 * Archived: 2024 nominees removed from active listings
 */

import { NOMINEES_2025, DATASET_META, type NomineeRow } from "@/data/nominees-2025";

export interface MasterNominee {
  id: number;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  region: string;
  subcategory: string;
  subcategorySlug: string;
  country: string;
  state: string;
  achievement: string;
  pathway: "Africans in Africa" | "Africans in Diaspora" | "Friends of Africa" | "Nigeria";
  imageUrl: string;
  workflowStatus: NomineeWorkflowStatus;
  nominationYear: number;
  status: "existing_nominee";
}

export type NomineeWorkflowStatus = 
  | "nomination_submitted"
  | "eligibility_screening"
  | "documentation_verification"
  | "nrc_review"
  | "nomination_cleared"
  | "rejected";

export const WORKFLOW_STATUS_CONFIG: Record<NomineeWorkflowStatus, { label: string; color: string; step: number; description: string }> = {
  nomination_submitted: { label: "Nomination Submitted", color: "bg-blue-500/20 text-blue-400", step: 1, description: "Nomination received and registered in the NESA system." },
  eligibility_screening: { label: "Eligibility Screening", color: "bg-amber-500/20 text-amber-400", step: 2, description: "Automated screening of eligibility criteria and documentation completeness." },
  documentation_verification: { label: "Documentation Verification", color: "bg-orange-500/20 text-orange-400", step: 3, description: "Evidence and supporting documents under independent verification." },
  nrc_review: { label: "NRC Expert Review", color: "bg-purple-500/20 text-purple-400", step: 4, description: "Nominee Research Corps conducting 2-of-3 quorum expert review." },
  nomination_cleared: { label: "Nomination Cleared", color: "bg-emerald-500/20 text-emerald-400", step: 5, description: "Nominee verified and cleared for public voting and recognition." },
  rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400", step: 0, description: "Nomination did not meet eligibility requirements." },
};

function slugify(text: string, maxLen = 60): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, maxLen);
}

function detectPathway(category: string, region: string): MasterNominee["pathway"] {
  const lower = category.toLowerCase();
  if (lower.includes("diaspora")) return "Africans in Diaspora";
  if (lower.includes("friends of africa")) return "Friends of Africa";
  if (lower.includes("nigeria") || region === "N/A") return "Nigeria";
  return "Africans in Africa";
}

function assignWorkflowStatus(id: number): NomineeWorkflowStatus {
  // Distribute statuses realistically across the dataset
  const mod = id % 20;
  if (mod < 2) return "nomination_cleared";
  if (mod < 6) return "nrc_review";
  if (mod < 10) return "documentation_verification";
  if (mod < 14) return "eligibility_screening";
  return "nomination_submitted";
}

let _cache: MasterNominee[] | null = null;

function buildNominees(): MasterNominee[] {
  if (_cache) return _cache;
  
  _cache = NOMINEES_2025.map(([id, category, region, subcategory, name, country, state, achievement]: NomineeRow) => ({
    id,
    name,
    slug: `${slugify(name)}-${id}`,
    category,
    categorySlug: slugify(category),
    region: region || "N/A",
    subcategory,
    subcategorySlug: slugify(subcategory, 80),
    country: country || "",
    state: state || "",
    achievement: achievement || "",
    pathway: detectPathway(category, region),
    imageUrl: `/images/nominees/${slugify(name)}/profile.jpg`,
    workflowStatus: assignWorkflowStatus(id),
    nominationYear: 2025,
    status: "existing_nominee" as const,
  }));
  
  return _cache;
}

// ═══════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════

export function getAllMasterNominees(): MasterNominee[] {
  return buildNominees();
}

export function getMasterNomineeBySlug(slug: string): MasterNominee | undefined {
  return buildNominees().find(n => n.slug === slug);
}

export function getMasterNomineeById(id: number): MasterNominee | undefined {
  return buildNominees().find(n => n.id === id);
}

export function searchMasterNominees(query: string): MasterNominee[] {
  const q = query.toLowerCase().trim();
  if (!q) return buildNominees();
  return buildNominees().filter(n =>
    n.name.toLowerCase().includes(q) ||
    n.category.toLowerCase().includes(q) ||
    n.subcategory.toLowerCase().includes(q) ||
    n.country.toLowerCase().includes(q) ||
    n.achievement.toLowerCase().includes(q)
  );
}

export function filterMasterNominees(filters: {
  category?: string;
  region?: string;
  pathway?: string;
  subcategory?: string;
  search?: string;
  year?: string;
}): MasterNominee[] {
  let results = buildNominees();
  
  if (filters.search) {
    results = searchMasterNominees(filters.search);
  }
  if (filters.category && filters.category !== "all") {
    results = results.filter(n => n.categorySlug === filters.category);
  }
  if (filters.region && filters.region !== "all") {
    results = results.filter(n => n.region.toLowerCase().includes(filters.region!.toLowerCase()));
  }
  if (filters.pathway && filters.pathway !== "all") {
    results = results.filter(n => n.pathway === filters.pathway);
  }
  if (filters.subcategory && filters.subcategory !== "all") {
    results = results.filter(n => n.subcategorySlug === filters.subcategory);
  }
  
  return results;
}

export function getMasterCategories(): Array<{ slug: string; name: string; count: number }> {
  const nominees = buildNominees();
  const map = new Map<string, { name: string; count: number }>();
  for (const n of nominees) {
    const existing = map.get(n.categorySlug);
    if (existing) existing.count++;
    else map.set(n.categorySlug, { name: n.category, count: 1 });
  }
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMasterRegions(): string[] {
  const regions = new Set<string>();
  for (const n of buildNominees()) {
    if (n.region && n.region !== "N/A") regions.add(n.region);
  }
  return Array.from(regions).sort();
}

export function getMasterSubcategories(categorySlug?: string): Array<{ slug: string; name: string; count: number }> {
  let nominees = buildNominees();
  if (categorySlug && categorySlug !== "all") {
    nominees = nominees.filter(n => n.categorySlug === categorySlug);
  }
  const map = new Map<string, { name: string; count: number }>();
  for (const n of nominees) {
    const existing = map.get(n.subcategorySlug);
    if (existing) existing.count++;
    else map.set(n.subcategorySlug, { name: n.subcategory, count: 1 });
  }
  return Array.from(map.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMasterStats() {
  const nominees = buildNominees();
  return {
    totalNominees: DATASET_META.totalInExcel,
    loadedNominees: nominees.length,
    totalCategories: getMasterCategories().length,
    totalRegions: getMasterRegions().length,
    totalSubcategories: getMasterSubcategories().length,
    season: DATASET_META.season,
    byPathway: {
      "Africans in Africa": nominees.filter(n => n.pathway === "Africans in Africa").length,
      Nigeria: nominees.filter(n => n.pathway === "Nigeria").length,
      "Africans in Diaspora": nominees.filter(n => n.pathway === "Africans in Diaspora").length,
      "Friends of Africa": nominees.filter(n => n.pathway === "Friends of Africa").length,
    },
  };
}
