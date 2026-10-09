// NESA-Africa Judges API
// Typed wrappers around Supabase for the judge ecosystem.
// Public reads target `judges_public` (PII-masked view).
// Authenticated mutations target the underlying `judges` table.

import { supabase } from "@/integrations/supabase/client";

export type JudgeStatus =
  | "applied"
  | "under_review"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "suspended"
  | "alumni";

export type JudgeVerification = "unverified" | "verified" | "featured";
export type JudgeVisibility = "public" | "unlisted" | "private";
export type JudgeAssignmentStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "returned_for_revision"
  | "finalized";
export type JudgeReviewStatus = JudgeAssignmentStatus;

export interface JudgeSocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  other?: string;
}

export interface PublicJudge {
  id: string;
  slug: string;
  full_name: string;
  photo_url: string | null;
  country_residence: string | null;
  country_origin: string | null;
  region: string | null;
  professional_title: string | null;
  organization: string | null;
  bio: string | null;
  expertise_areas: string[];
  languages: string[];
  social_links: JudgeSocialLinks;
  verification_status: JudgeVerification;
  judge_status: JudgeStatus;
  featured: boolean;
  public_contribution_statement: string | null;
  contribution_score: number;
  created_at: string;
}

export interface JudgeFilters {
  search?: string;
  country?: string;
  region?: string;
  expertise?: string;
  language?: string;
  status?: JudgeStatus;
  featuredOnly?: boolean;
}

/** Fetch the public, PII-masked judge directory. */
export async function listPublicJudges(filters: JudgeFilters = {}): Promise<PublicJudge[]> {
  let q = (supabase as any).from("judges_public").select("*");

  if (filters.country) q = q.eq("country_residence", filters.country);
  if (filters.region) q = q.eq("region", filters.region);
  if (filters.expertise) q = q.contains("expertise_areas", [filters.expertise]);
  if (filters.language) q = q.contains("languages", [filters.language]);
  if (filters.status) q = q.eq("judge_status", filters.status);
  if (filters.featuredOnly) q = q.eq("featured", true);
  if (filters.search) q = q.ilike("full_name", `%${filters.search}%`);

  q = q.order("featured", { ascending: false }).order("full_name", { ascending: true });

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PublicJudge[];
}

export async function getJudgeBySlug(slug: string): Promise<PublicJudge | null> {
  const { data, error } = await (supabase as any)
    .from("judges_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as PublicJudge | null;
}

/** Get the signed-in user's own judge profile (any status / visibility). */
export async function getMyJudgeProfile() {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) return null;
  const { data, error } = await (supabase as any)
    .from("judges")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateMyJudgeProfile(patch: Record<string, unknown>) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await (supabase as any)
    .from("judges")
    .update(patch)
    .eq("user_id", userId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createJudgeProfile(payload: {
  full_name: string;
  email?: string;
  phone?: string;
  country_residence?: string;
  country_origin?: string;
  region?: string;
  professional_title?: string;
  organization?: string;
  bio?: string;
  expertise_areas?: string[];
  languages?: string[];
  social_links?: JudgeSocialLinks;
  public_contribution_statement?: string;
  application_id?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  if (!userId) throw new Error("Sign in required to apply as a judge");

  const { data, error } = await (supabase as any)
    .from("judges")
    .insert({
      ...payload,
      user_id: userId,
      judge_status: "applied",
      profile_visibility: "private",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listMyAssignments() {
  const profile = await getMyJudgeProfile();
  if (!profile?.id) return [];
  const { data, error } = await (supabase as any)
    .from("judge_assignments")
    .select("*")
    .eq("judge_id", profile.id)
    .order("due_date", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listMyReviews() {
  const profile = await getMyJudgeProfile();
  if (!profile?.id) return [];
  const { data, error } = await (supabase as any)
    .from("judge_reviews")
    .select("*")
    .eq("judge_id", profile.id)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function submitReview(payload: {
  nominee_id: string;
  category_id?: string;
  assignment_id?: string;
  score: number;
  rubric_scores?: Record<string, number>;
  comments?: string;
  recommendation?: string;
}) {
  const profile = await getMyJudgeProfile();
  if (!profile?.id) throw new Error("No judge profile");
  const { data, error } = await (supabase as any)
    .from("judge_reviews")
    .upsert(
      {
        ...payload,
        judge_id: profile.id,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      },
      { onConflict: "judge_id,nominee_id,category_id" },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function declareConflict(payload: {
  nominee_id?: string;
  category_id?: string;
  conflict_type: string;
  description?: string;
}) {
  const profile = await getMyJudgeProfile();
  if (!profile?.id) throw new Error("No judge profile");
  const { data, error } = await (supabase as any)
    .from("judge_conflicts")
    .insert({ ...payload, judge_id: profile.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listMyConflicts() {
  const profile = await getMyJudgeProfile();
  if (!profile?.id) return [];
  const { data, error } = await (supabase as any)
    .from("judge_conflicts")
    .select("*")
    .eq("judge_id", profile.id)
    .order("declared_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
