import { request, api } from "./http";

export interface JuryAssignment {
  id: string;
  judge_user_id: string;
  nominee_id: string;
  season_id: string;
  category_id: string | null;
  assigned_at: string;
  scored_at: string | null;
  score: number | null;
  comment: string | null;
  status: "pending" | "completed" | "recused";
  nominee?: {
    id: string;
    name: string;
    slug: string;
    title: string | null;
    organization: string | null;
    bio: string | null;
    photo_url: string | null;
    subcategory?: {
      id: string;
      name: string;
      slug: string;
      category?: {
        id: string;
        name: string;
        slug: string;
      };
    };
  };
}

export interface JuryStats {
  total: number;
  completed: number;
  pending: number;
  recused: number;
  averageScore: number;
  completionRate: number;
}

export interface COIDeclaration {
  id: string;
  judge_user_id: string;
  nominee_id: string;
  reason: string;
  declared_at: string;
  nominee?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface EvidenceDossier {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  evidence_urls: string[] | null;
  region: string | null;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

// Get judge's assigned nominees
export async function getAssignments() {
  return api.get<{ assignments: JuryAssignment[] }>("jury", "/assignments");
}

// Submit a score for a nominee
export async function submitScore(nomineeId: string, score: number, comment?: string) {
  return api.post<{ success: boolean; assignment: JuryAssignment }>("jury", "/score", {
    nominee_id: nomineeId,
    score,
    comment,
  });
}

// Declare conflict of interest
export async function declareCOI(nomineeId: string, reason: string) {
  return api.post<{ success: boolean; coi: COIDeclaration }>("jury", "/coi", {
    nominee_id: nomineeId,
    reason,
  });
}

// Get COI declarations
export async function getCOIDeclarations() {
  return api.get<{ declarations: COIDeclaration[] }>("jury", "/coi");
}

// Get jury dashboard stats
export async function getStats() {
  return api.get<{ stats: JuryStats }>("jury", "/stats");
}

// Get nominee evidence dossier (read-only)
export async function getDossier(nomineeId: string) {
  return api.get<{ dossier: EvidenceDossier }>("jury", `/dossier/${nomineeId}`);
}

// Admin: Create jury assignment
export async function createAssignment(
  judgeUserId: string,
  nomineeId: string,
  seasonId: string,
  categoryId?: string
) {
  return api.post<{ assignment: JuryAssignment }>("jury", "/assignments", {
    judge_user_id: judgeUserId,
    nominee_id: nomineeId,
    season_id: seasonId,
    category_id: categoryId,
  });
}
