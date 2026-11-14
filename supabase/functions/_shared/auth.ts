/**
 * Authentication Utilities for Edge Functions
 * 
 * Provides JWT verification and role-based access control helpers.
 * Uses getClaims() for proper JWT validation per Supabase signing-keys approach.
 */

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export type AppRole = "user" | "nrc" | "jury" | "chapter" | "sponsor" | "admin";
export type RoleCode = "USER" | "NRC" | "JURY" | "OLC_COORDINATOR" | "AMBASSADOR" | "SPONSOR" | "ADMIN";

/**
 * Extract and verify JWT from Authorization header
 * Returns user ID if valid, null otherwise
 * 
 * @example
 * const userId = await getAuthUser(supabase, req);
 * if (!userId) return err("Unauthorized", 401);
 */
export async function getAuthUser(
  supabase: SupabaseClient, 
  req: Request
): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const { data: claimsData, error } = await supabase.auth.getClaims(token);
  
  if (error || !claimsData?.claims) return null;
  return claimsData.claims.sub as string;
}

/**
 * Get authenticated user using getUser() method
 * Useful when you need the full user object
 */
export async function getAuthUserFull(
  supabase: SupabaseClient,
  req: Request
): Promise<{ id: string; email?: string } | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { id: user.id, email: user.email };
}

/**
 * Check if user has a specific role
 * 
 * @example
 * if (!(await hasRole(supabase, userId, "admin"))) {
 *   return err("Forbidden", 403);
 * }
 */
export async function hasRole(
  supabase: SupabaseClient,
  userId: string,
  role: AppRole
): Promise<boolean> {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: role });
  return data === true;
}

/**
 * Check if user has a specific role code
 * 
 * @example
 * if (await hasRoleCode(supabase, userId, "OLC_COORDINATOR")) {
 *   // User is a chapter coordinator
 * }
 */
export async function hasRoleCode(
  supabase: SupabaseClient,
  userId: string,
  roleCode: RoleCode
): Promise<boolean> {
  const { data } = await supabase.rpc("has_role_code", { p_user_id: userId, p_role_code: roleCode });
  return data === true;
}

/**
 * Require authentication - throws if not authenticated
 * 
 * @example
 * const userId = await requireAuth(supabase, req);
 * // userId is guaranteed to be a string here
 */
export async function requireAuth(
  supabase: SupabaseClient,
  req: Request
): Promise<string> {
  const userId = await getAuthUser(supabase, req);
  if (!userId) {
    throw new AuthError("Unauthorized", 401);
  }
  return userId;
}

/**
 * Require specific role - throws if user doesn't have role
 * 
 * @example
 * await requireRole(supabase, userId, "admin");
 * // User is guaranteed to be admin here
 */
export async function requireRole(
  supabase: SupabaseClient,
  userId: string,
  role: AppRole
): Promise<void> {
  if (!(await hasRole(supabase, userId, role))) {
    throw new AuthError("Forbidden", 403);
  }
}

/**
 * Custom error class for auth-related errors
 */
export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}
