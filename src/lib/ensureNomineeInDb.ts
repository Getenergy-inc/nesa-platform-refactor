/**
 * Ensures a CSV nominee exists in the database.
 * Looks up via the public_nominees view (safe, RLS-compliant).
 * Creates via the seed-nominees edge function if missing.
 */
import { supabase } from "@/integrations/supabase/client";
import type { EnrichedNominee } from "@/lib/nesaData";

export async function ensureNomineeInDb(
  nominee: EnrichedNominee
): Promise<{ id: string; renomination_count: number } | null> {
  const nameSlug = nominee.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 1. Look up via public_nominees view
  const { data: existing } = await (supabase as any)
    .from("public_nominees")
    .select("id, renomination_count")
    .or(`slug.eq.${nominee.slug},slug.eq.${nameSlug}`)
    .maybeSingle();

  if (existing) return existing;

  // 2. Try name-based match
  const { data: byName } = await (supabase as any)
    .from("public_nominees")
    .select("id, renomination_count")
    .ilike("name", nominee.name.trim())
    .maybeSingle();

  if (byName) return byName;

  // 3. Not found — auto-creation requires admin (seed-nominees endpoint).
  // Regular users cannot self-create nominees from CSV browse anymore.
  return null;
}

