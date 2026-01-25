// Unified API client for NESA Africa platform
import { supabase } from "@/integrations/supabase/client";
import type { StageAction } from "@/config/season";
import type { AppRole } from "@/config/roles";

// Local type for API responses (different from config types)
export interface ApiStageStatus {
  action: StageAction;
  isOpen: boolean;
  opensAt?: Date;
  closesAt?: Date;
}

// ==========================================
// STAGE API
// ==========================================
export async function fetchCurrentStage(): Promise<ApiStageStatus[]> {
  const { data, error } = await supabase
    .from("stage_config")
    .select(`
      action,
      is_open,
      opens_at,
      closes_at,
      seasons!inner(is_active)
    `)
    .eq("seasons.is_active", true);

  if (error) throw error;
  
  return (data || []).map(item => ({
    action: item.action as StageAction,
    isOpen: item.is_open,
    opensAt: item.opens_at ? new Date(item.opens_at) : undefined,
    closesAt: item.closes_at ? new Date(item.closes_at) : undefined,
  }));
}

export async function isStageOpen(action: StageAction): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_stage_open", { _action: action });
  if (error) return false;
  return data ?? false;
}

// ==========================================
// CATEGORIES API
// ==========================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;

  return (data || []).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    iconName: cat.icon_name,
    displayOrder: cat.display_order,
    isActive: cat.is_active,
  }));
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    iconName: data.icon_name,
    displayOrder: data.display_order,
    isActive: data.is_active,
  };
}

// ==========================================
// SUBCATEGORIES API
// ==========================================
export interface Subcategory {
  id: string;
  categoryId: string;
  chapterId: string | null;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
}

export async function fetchSubcategories(categorySlug?: string): Promise<Subcategory[]> {
  let query = supabase
    .from("subcategories")
    .select(`
      *,
      categories!inner(slug)
    `)
    .eq("is_active", true)
    .order("display_order");

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(sub => ({
    id: sub.id,
    categoryId: sub.category_id,
    chapterId: sub.chapter_id,
    name: sub.name,
    slug: sub.slug,
    description: sub.description,
    displayOrder: sub.display_order,
  }));
}

// ==========================================
// NOMINEES API
// ==========================================
export interface Nominee {
  id: string;
  subcategoryId: string;
  seasonId: string;
  name: string;
  slug: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photoUrl: string | null;
  status: string;
  isPlatinum: boolean;
  publicVotes: number;
  juryScore: number;
  finalScore: number;
}

export async function fetchNominees(filters?: {
  subcategoryId?: string;
  categorySlug?: string;
  status?: string;
  isPlatinum?: boolean;
}): Promise<Nominee[]> {
  let query = supabase
    .from("nominees")
    .select(`
      *,
      subcategories!inner(
        slug,
        categories!inner(slug)
      ),
      seasons!inner(is_active)
    `)
    .eq("seasons.is_active", true)
    .in("status", ["approved", "platinum"]);

  if (filters?.subcategoryId) {
    query = query.eq("subcategory_id", filters.subcategoryId);
  }
  if (filters?.categorySlug) {
    query = query.eq("subcategories.categories.slug", filters.categorySlug);
  }
  if (filters?.isPlatinum !== undefined) {
    query = query.eq("is_platinum", filters.isPlatinum);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(nom => ({
    id: nom.id,
    subcategoryId: nom.subcategory_id,
    seasonId: nom.season_id,
    name: nom.name,
    slug: nom.slug,
    title: nom.title,
    organization: nom.organization,
    bio: nom.bio,
    photoUrl: nom.photo_url,
    status: nom.status,
    isPlatinum: nom.is_platinum,
    publicVotes: nom.public_votes,
    juryScore: Number(nom.jury_score),
    finalScore: Number(nom.final_score),
  }));
}

export async function fetchNomineeBySlug(slug: string): Promise<Nominee | null> {
  const { data, error } = await supabase
    .from("nominees")
    .select("*")
    .eq("slug", slug)
    .in("status", ["approved", "platinum"])
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    subcategoryId: data.subcategory_id,
    seasonId: data.season_id,
    name: data.name,
    slug: data.slug,
    title: data.title,
    organization: data.organization,
    bio: data.bio,
    photoUrl: data.photo_url,
    status: data.status,
    isPlatinum: data.is_platinum,
    publicVotes: data.public_votes,
    juryScore: Number(data.jury_score),
    finalScore: Number(data.final_score),
  };
}

// ==========================================
// NOMINATIONS API
// ==========================================
export interface NominationInput {
  subcategoryId: string;
  nomineeName: string;
  nomineeTitle?: string;
  nomineeOrganization?: string;
  nomineeBio?: string;
  nomineePhotoUrl?: string;
  evidenceUrls?: string[];
  justification?: string;
}

export async function submitNomination(input: NominationInput): Promise<{ id: string }> {
  // Get current season
  const { data: season, error: seasonError } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .single();

  if (seasonError || !season) throw new Error("No active season found");

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Must be logged in to nominate");

  const { data, error } = await supabase
    .from("nominations")
    .insert({
      season_id: season.id,
      subcategory_id: input.subcategoryId,
      nominee_name: input.nomineeName,
      nominee_title: input.nomineeTitle,
      nominee_organization: input.nomineeOrganization,
      nominee_bio: input.nomineeBio,
      nominee_photo_url: input.nomineePhotoUrl,
      evidence_urls: input.evidenceUrls,
      justification: input.justification,
      nominator_id: user.user.id,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { id: data.id };
}

// Renominate an existing nominee - increments counter + logs audit event
export async function renominateNominee(nomineeId: string, justification?: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Must be logged in to renominate");

  // Get the nominee to check it exists
  const { data: nominee, error: fetchError } = await supabase
    .from("nominees")
    .select("id, renomination_count, name")
    .eq("id", nomineeId)
    .maybeSingle();

  if (fetchError || !nominee) throw new Error("Nominee not found");

  // Check if renomination limit reached (200 max)
  if ((nominee.renomination_count ?? 0) >= 200) {
    throw new Error("This nominee has reached the maximum renomination limit");
  }

  // Increment the renomination count (trigger will handle audit log)
  const { error: updateError } = await supabase
    .from("nominees")
    .update({ 
      renomination_count: (nominee.renomination_count ?? 0) + 1 
    })
    .eq("id", nomineeId);

  if (updateError) throw updateError;

  // Also create a nomination record for tracking
  const { data: season } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .single();

  if (season) {
    // Get the nominee's subcategory
    const { data: nomineeDetails } = await supabase
      .from("nominees")
      .select("subcategory_id, name, title, organization, bio, photo_url")
      .eq("id", nomineeId)
      .single();

    if (nomineeDetails) {
      await supabase.from("nominations").insert({
        season_id: season.id,
        subcategory_id: nomineeDetails.subcategory_id,
        nominee_name: nomineeDetails.name,
        nominee_title: nomineeDetails.title,
        nominee_organization: nomineeDetails.organization,
        nominee_bio: nomineeDetails.bio,
        nominee_photo_url: nomineeDetails.photo_url,
        justification: justification || "Re-nomination of existing nominee",
        nominator_id: user.user.id,
        created_nominee_id: nomineeId, // Link to existing nominee
      });
    }
  }
}

// Search for existing nominees by name
export async function searchExistingNominees(query: string, subcategoryId?: string): Promise<Nominee[]> {
  let queryBuilder = supabase
    .from("nominees")
    .select(`
      id,
      name,
      slug,
      title,
      organization,
      bio,
      photo_url,
      status,
      is_platinum,
      public_votes,
      jury_score,
      final_score,
      renomination_count,
      subcategory_id,
      season_id
    `)
    .ilike("name", `%${query}%`)
    .limit(10);

  if (subcategoryId) {
    queryBuilder = queryBuilder.eq("subcategory_id", subcategoryId);
  }

  const { data, error } = await queryBuilder;
  if (error) throw error;

  return (data || []).map(nom => ({
    id: nom.id,
    subcategoryId: nom.subcategory_id,
    seasonId: nom.season_id,
    name: nom.name,
    slug: nom.slug,
    title: nom.title,
    organization: nom.organization,
    bio: nom.bio,
    photoUrl: nom.photo_url,
    status: nom.status,
    isPlatinum: nom.is_platinum,
    publicVotes: nom.public_votes,
    juryScore: Number(nom.jury_score),
    finalScore: Number(nom.final_score),
  }));
}

// ==========================================
// VOTING API
// ==========================================
export async function submitPublicVote(nomineeId: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Must be logged in to vote");

  const { data: season } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .single();

  if (!season) throw new Error("No active season");

  const { error } = await supabase.from("votes").insert({
    nominee_id: nomineeId,
    season_id: season.id,
    voter_id: user.user.id,
    vote_type: "public",
    score: 1,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("You have already voted for this nominee");
    }
    throw error;
  }

  // Increment nominee vote count via direct update
  await supabase
    .from("nominees")
    .update({ public_votes: supabase.rpc as unknown as number }) // Will be handled by trigger
    .eq("id", nomineeId);
}

export async function submitJuryScore(nomineeId: string, score: number, comment?: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Must be logged in");

  const { data: season } = await supabase
    .from("seasons")
    .select("id")
    .eq("is_active", true)
    .single();

  if (!season) throw new Error("No active season");

  const { error } = await supabase.from("votes").insert({
    nominee_id: nomineeId,
    season_id: season.id,
    voter_id: user.user.id,
    vote_type: "jury",
    score,
    comment,
  });

  if (error) throw error;
}

// ==========================================
// CERTIFICATES API
// ==========================================
export interface Certificate {
  id: string;
  nomineeId: string;
  tier: string;
  verificationCode: string;
  issuedAt: Date;
  expiresAt: Date | null;
  isLifetime: boolean;
  downloadUrl: string | null;
}

export async function verifyCertificate(code: string): Promise<Certificate | null> {
  const { data, error } = await supabase
    .from("certificates")
    .select(`
      *,
      nominees(name, title, organization)
    `)
    .eq("verification_code", code)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    nomineeId: data.nominee_id,
    tier: data.tier,
    verificationCode: data.verification_code,
    issuedAt: new Date(data.issued_at),
    expiresAt: data.expires_at ? new Date(data.expires_at) : null,
    isLifetime: data.is_lifetime,
    downloadUrl: data.download_url,
  };
}

// ==========================================
// USER API
// ==========================================
export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  country: string | null;
  bio: string | null;
  roles: AppRole[];
}

export async function fetchUserProfile(): Promise<UserProfile | null> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (error) throw error;
  if (!profile) return null;

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.user.id);

  return {
    id: profile.id,
    userId: profile.user_id,
    email: profile.email,
    fullName: profile.full_name,
    avatarUrl: profile.avatar_url,
    phone: profile.phone,
    country: profile.country,
    bio: profile.bio,
    roles: (roles || []).map(r => r.role as AppRole),
  };
}

// ==========================================
// CHAPTERS API
// ==========================================
export interface Chapter {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
}

export async function fetchChapters(): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) throw error;

  return (data || []).map(ch => ({
    id: ch.id,
    name: ch.name,
    slug: ch.slug,
    country: ch.country,
    region: ch.region,
    description: ch.description,
    logoUrl: ch.logo_url,
    isActive: ch.is_active,
  }));
}

// ==========================================
// MEDIA API
// ==========================================
export interface MediaItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  mediaType: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  embedCode: string | null;
  durationSeconds: number | null;
  isLive: boolean;
  isFeatured: boolean;
  publishedAt: Date | null;
}

export async function fetchMedia(filters?: {
  mediaType?: string;
  isLive?: boolean;
  isFeatured?: boolean;
}): Promise<MediaItem[]> {
  let query = supabase
    .from("media")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });

  if (filters?.mediaType) {
    query = query.eq("media_type", filters.mediaType);
  }
  if (filters?.isLive !== undefined) {
    query = query.eq("is_live", filters.isLive);
  }
  if (filters?.isFeatured !== undefined) {
    query = query.eq("is_featured", filters.isFeatured);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(m => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    description: m.description,
    mediaType: m.media_type,
    thumbnailUrl: m.thumbnail_url,
    videoUrl: m.video_url,
    embedCode: m.embed_code,
    durationSeconds: m.duration_seconds,
    isLive: m.is_live,
    isFeatured: m.is_featured,
    publishedAt: m.published_at ? new Date(m.published_at) : null,
  }));
}
