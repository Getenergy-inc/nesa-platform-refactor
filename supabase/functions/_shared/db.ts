/**
 * Database Client Utilities for Edge Functions
 * 
 * Provides factory functions for creating Supabase clients with
 * appropriate permissions for different use cases.
 */

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Create a Supabase client with user's auth context
 * Uses the anon key with user's JWT for RLS enforcement
 * 
 * @example
 * const supabase = createUserClient(req);
 * const { data } = await supabase.from("profiles").select("*"); // RLS applied
 */
export function createUserClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get("Authorization") || "";
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );
}

/**
 * Create a Supabase client with admin/service role
 * Bypasses RLS - use only for admin operations
 * 
 * @example
 * const admin = createAdminClient();
 * await admin.from("profiles").update({ status: "active" }); // No RLS
 */
export function createAdminClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

/**
 * Get active season ID
 * Returns null if no active season
 */
export async function getActiveSeason(supabase: SupabaseClient): Promise<{ id: string; year: number; name: string } | null> {
  const { data } = await supabase
    .from("seasons")
    .select("id, year, name")
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

/**
 * Check if a stage is open for current season
 */
export async function isStageOpen(
  supabase: SupabaseClient,
  action: string
): Promise<boolean> {
  const { data } = await supabase.rpc("is_stage_open", { _action: action });
  return data === true;
}
