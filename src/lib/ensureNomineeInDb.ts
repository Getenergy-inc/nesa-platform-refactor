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

  // 3. Create via seed-nominees edge function (uses service role key)
  try {
    const { data, error } = await supabase.functions.invoke("seed-nominees", {
      body: {
        nominees: [{
          name: nominee.name.trim(),
          slug: nominee.slug,
          bio: nominee.achievement || undefined,
          photo_url: nominee.imageUrl || undefined,
          country: nominee.country || undefined,
          region: nominee.regionName || undefined,
          subcategory_slug: nominee.subcategorySlug,
          legacy_source: "csv_auto",
          status: "approved",
        }],
        dry_run: false,
      },
    });

    if (error) {
      console.warn("Seed nominee failed:", error);
      return null;
    }

    // Re-fetch the newly created record
    const { data: created } = await (supabase as any)
      .from("public_nominees")
      .select("id, renomination_count")
      .or(`slug.eq.${nominee.slug},slug.eq.${nameSlug}`)
      .maybeSingle();

    return created;
  } catch (err) {
    console.warn("Could not auto-create nominee:", err);
    return null;
  }
}
