/**
 * NESA-Africa API Client - Voting Endpoints
 * 
 * Public voting, jury scoring, and vote management endpoints.
 */

import api, { type PaginatedResponse } from "./http";

// ==========================================
// TYPES
// ==========================================

export interface VotingEligibility {
  canVote: boolean;
  reason: string | null;
  stagesOpen: Record<string, boolean>;
  authenticated: boolean;
  userId?: string;
}

export interface NomineeTally {
  id: string;
  name: string;
  slug: string;
  organization: string | null;
  photoUrl: string | null;
  votes: number;
  isPlatinum: boolean;
  subcategoryId: string;
  subcategoryName: string;
}

export interface CategoryTally {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  totalVotes: number;
  nominees: NomineeTally[];
}

export interface TallyResponse {
  seasonId: string;
  data: CategoryTally[];
}

export interface UserVote {
  id: string;
  voteType: "public" | "jury";
  score: number;
  createdAt: string;
  nominee: {
    id: string;
    name: string;
    slug: string;
    photo_url: string | null;
  };
  season: {
    id: string;
    name: string;
    year: number;
  };
}

export interface VoteResult {
  success: boolean;
  vote: {
    id: string;
    nominee_id: string;
    voter_id: string;
    vote_type: string;
    score: number;
    created_at: string;
  };
}

// ==========================================
// API FUNCTIONS
// ==========================================

/**
 * Check if current user can vote
 */
export async function getEligibility() {
  return api.get<VotingEligibility>("voting", "/eligibility");
}

/**
 * Get public vote tallies
 */
export async function getTally(params?: {
  category?: string;
  subcategory?: string;
}) {
  return api.get<TallyResponse>("voting", "/tally", params);
}

/**
 * Get user's vote history
 */
export async function getMyVotes() {
  return api.get<{ data: UserVote[] }>("voting", "/me");
}

/**
 * Cast a public vote
 */
export async function castVote(nomineeId: string) {
  return api.post<VoteResult>("voting", "/vote", {
    nomineeId,
    voteType: "public",
  });
}

/**
 * Cast a jury score (jury role required)
 */
export async function castJuryScore(nomineeId: string, score: number, comment?: string) {
  return api.post<VoteResult>("voting", "/vote", {
    nomineeId,
    voteType: "jury",
    score,
    comment,
  });
}

/**
 * Check if user has voted for a specific nominee
 */
export async function hasVotedFor(nomineeId: string): Promise<boolean> {
  const response = await getMyVotes();
  if (!response.data) return false;
  return response.data.data.some((v) => v.nominee.id === nomineeId);
}

export default {
  getEligibility,
  getTally,
  getMyVotes,
  castVote,
  castJuryScore,
  hasVotedFor,
};
