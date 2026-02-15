import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function createAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NomineeInput {
  name: string;
  slug?: string;
  bio?: string;
  title?: string;
  organization?: string;
  country?: string;
  region?: string;
  photo_url?: string;
  logo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  work_done?: string;
  subcategory_slug?: string;
  legacy_category?: string;
  legacy_subcategory?: string;
  legacy_nominee_id?: string;
  legacy_source?: string;
  renomination_count?: number;
  nrc_verified?: boolean;
  acceptance_status?: string;
  evidence_urls?: string[];
  status?: string;
  // Nomination-level fields
  nominations?: NominationInput[];
}

interface NominationInput {
  legacy_nomination_id?: string;
  justification?: string;
  source?: string;
  status?: string;
  evidence_urls?: string[];
  created_at?: string;
}

function generateSlug(name: string, subcategory?: string, region?: string): string {
  const parts = [name, subcategory, region].filter(Boolean);
  return parts
    .join("--")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateIdentityHash(name: string, email?: string, phone?: string, country?: string): string {
  const normalized =
    (name || "").toLowerCase().trim() +
    "|" + (email || "").toLowerCase().trim() +
    "|" + (phone || "").replace(/[^0-9]/g, "") +
    "|" + (country || "").toLowerCase().trim();
  // Simple hash for dedup - edge function doesn't have crypto.subtle for sha256 easily
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createAdminClient();

    const { nominees, dry_run = true } = await req.json() as {
      nominees: NomineeInput[];
      dry_run?: boolean;
    };

    if (!nominees || !Array.isArray(nominees)) {
      return new Response(
        JSON.stringify({ error: "nominees array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get active season
    const { data: season, error: seasonError } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .single();

    if (seasonError || !season) {
      return new Response(
        JSON.stringify({ error: "No active season found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get all subcategories for mapping
    const { data: subcategories } = await supabase
      .from("subcategories")
      .select("id, slug, name, category_id");

    const subcatMap = new Map(subcategories?.map(s => [s.slug, s]) || []);

    // Get legacy category mappings
    const { data: legacyMappings } = await supabase
      .from("legacy_category_mappings")
      .select("legacy_category, legacy_subcategory, new_subcategory_id");

    const mappingLookup = new Map<string, string>();
    legacyMappings?.forEach(m => {
      if (m.new_subcategory_id) {
        mappingLookup.set(`${m.legacy_category}|${m.legacy_subcategory}`, m.new_subcategory_id);
      }
    });

    // Process nominees
    const results = {
      total: nominees.length,
      valid: 0,
      skipped: 0,
      inserted: 0,
      merged: 0,
      unmapped: 0,
      nominations_created: 0,
      errors: [] as string[],
      missing_subcategories: new Set<string>(),
    };

    const validNominees: any[] = [];
    const unmappedQueue: any[] = [];
    const nominationsToCreate: any[] = [];

    // DEDUPE: Build identity map
    const identityMap = new Map<string, number>(); // hash -> index in validNominees

    for (const nominee of nominees) {
      // Resolve subcategory: direct slug -> legacy mapping -> unmapped
      let subcategoryId: string | null = null;

      if (nominee.subcategory_slug) {
        const subcat = subcatMap.get(nominee.subcategory_slug);
        if (subcat) subcategoryId = subcat.id;
      }

      if (!subcategoryId && nominee.legacy_category && nominee.legacy_subcategory) {
        const mappingKey = `${nominee.legacy_category}|${nominee.legacy_subcategory}`;
        subcategoryId = mappingLookup.get(mappingKey) || null;
      }

      if (!subcategoryId) {
        // Add to unmapped queue
        results.unmapped++;
        results.missing_subcategories.add(nominee.legacy_subcategory || nominee.subcategory_slug || "unknown");
        unmappedQueue.push({
          raw_data: nominee,
          legacy_nominee_id: nominee.legacy_nominee_id || null,
          legacy_category: nominee.legacy_category || null,
          legacy_subcategory: nominee.legacy_subcategory || null,
          nominee_name: nominee.name,
          organization: nominee.organization || null,
          country: nominee.country || null,
        });
        continue;
      }

      if (!nominee.name) {
        results.errors.push(`Skipped: missing name`);
        results.skipped++;
        continue;
      }

      // DEDUPE: ranked keys (email → phone → name+country+org)
      const identityHash = generateIdentityHash(
        nominee.name,
        nominee.email,
        nominee.phone,
        nominee.country
      );

      const existingIdx = identityMap.get(identityHash);
      if (existingIdx !== undefined) {
        // MERGE: append legacy IDs, increment renomination count
        const existing = validNominees[existingIdx];
        const legacyIds = existing.legacy_ids || [];
        if (nominee.legacy_nominee_id) {
          legacyIds.push(nominee.legacy_nominee_id);
        }
        existing.legacy_ids = legacyIds;
        existing.renomination_count = (existing.renomination_count || 0) + (nominee.renomination_count || 1);

        // Merge bio/work_done if existing is empty
        if (!existing.bio && nominee.bio) existing.bio = nominee.bio;
        if (!existing.work_done && nominee.work_done) existing.work_done = nominee.work_done;
        if (!existing.photo_url && nominee.photo_url) existing.photo_url = nominee.photo_url;
        if (!existing.logo_url && nominee.logo_url) existing.logo_url = nominee.logo_url;

        results.merged++;

        // Add nominations from merged record
        if (nominee.nominations) {
          for (const nom of nominee.nominations) {
            nominationsToCreate.push({
              ...nom,
              _nominee_idx: existingIdx,
            });
          }
        }
        continue;
      }

      const slug = nominee.slug || generateSlug(nominee.name, nominee.subcategory_slug, nominee.region);
      const legacyIds = nominee.legacy_nominee_id ? [nominee.legacy_nominee_id] : [];

      const nomineeRecord = {
        name: nominee.name,
        slug,
        bio: nominee.bio || null,
        title: nominee.title || null,
        organization: nominee.organization || null,
        country: nominee.country || null,
        region: nominee.region || null,
        photo_url: nominee.photo_url || null,
        logo_url: nominee.logo_url || null,
        email: nominee.email || null,
        phone: nominee.phone || null,
        website: nominee.website || null,
        linkedin_url: nominee.linkedin_url || null,
        work_done: nominee.work_done || null,
        evidence_urls: nominee.evidence_urls || [],
        subcategory_id: subcategoryId,
        season_id: season.id,
        status: nominee.status || "approved",
        renomination_count: nominee.renomination_count || 0,
        nrc_verified: nominee.nrc_verified || false,
        acceptance_status: nominee.acceptance_status || "PENDING",
        identity_hash: identityHash,
        legacy_ids: legacyIds,
        legacy_source: nominee.legacy_source || "legacy_db",
        public_votes: 0,
      };

      const idx = validNominees.length;
      validNominees.push(nomineeRecord);
      identityMap.set(identityHash, idx);
      results.valid++;

      // Collect nominations
      if (nominee.nominations) {
        for (const nom of nominee.nominations) {
          nominationsToCreate.push({
            ...nom,
            _nominee_idx: idx,
          });
        }
      }
    }

    if (!dry_run) {
      // Insert nominees in batches
      const batchSize = 100;
      const insertedNomineeIds: Map<number, string> = new Map();

      for (let i = 0; i < validNominees.length; i += batchSize) {
        const batch = validNominees.slice(i, i + batchSize);

        // Check existing slugs
        const slugs = batch.map(n => n.slug);
        const { data: existing } = await supabase
          .from("nominees")
          .select("slug, id, identity_hash")
          .in("slug", slugs);

        const existingSlugs = new Set(existing?.map(e => e.slug) || []);
        const existingHashes = new Map(existing?.map(e => [e.identity_hash, e.id]) || []);

        const newNominees = [];
        for (let j = 0; j < batch.length; j++) {
          const n = batch[j];
          // Check by identity hash first, then slug
          const existingId = existingHashes.get(n.identity_hash);
          if (existingId) {
            // Update existing nominee with legacy data
            await supabase
              .from("nominees")
              .update({
                legacy_ids: n.legacy_ids,
                legacy_source: n.legacy_source,
                work_done: n.work_done,
                website: n.website,
                linkedin_url: n.linkedin_url,
                renomination_count: n.renomination_count,
              })
              .eq("id", existingId);
            insertedNomineeIds.set(i + j, existingId);
            results.merged++;
          } else if (!existingSlugs.has(n.slug)) {
            newNominees.push({ ...n, _batch_idx: i + j });
          } else {
            // Slug exists but different identity - append suffix
            n.slug = n.slug + "-" + Date.now().toString(36);
            newNominees.push({ ...n, _batch_idx: i + j });
          }
        }

        if (newNominees.length > 0) {
          const toInsert = newNominees.map(({ _batch_idx, ...rest }) => rest);
          const { error: insertError, data: inserted } = await supabase
            .from("nominees")
            .insert(toInsert)
            .select("id");

          if (insertError) {
            results.errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${insertError.message}`);
          } else {
            inserted?.forEach((row, idx) => {
              insertedNomineeIds.set(newNominees[idx]._batch_idx, row.id);
            });
            results.inserted += inserted?.length || 0;
          }
        }
      }

      // Insert unmapped queue
      if (unmappedQueue.length > 0) {
        const { error: unmappedError } = await supabase
          .from("unmapped_nominee_queue")
          .insert(unmappedQueue);
        if (unmappedError) {
          results.errors.push(`Unmapped queue: ${unmappedError.message}`);
        }
      }

      // Insert nominations
      if (nominationsToCreate.length > 0) {
        const nomRecords = [];
        for (const nom of nominationsToCreate) {
          const nomineeId = insertedNomineeIds.get(nom._nominee_idx);
          if (!nomineeId) continue;

          nomRecords.push({
            nominee_name: validNominees[nom._nominee_idx]?.name || "Unknown",
            nominator_id: "00000000-0000-0000-0000-000000000000", // system migration
            subcategory_id: validNominees[nom._nominee_idx]?.subcategory_id,
            season_id: season.id,
            justification: nom.justification || null,
            source: nom.source || "PUBLIC",
            status: nom.status || "approved",
            evidence_urls: nom.evidence_urls || [],
            created_nominee_id: nomineeId,
            created_at: nom.created_at || new Date().toISOString(),
          });
        }

        if (nomRecords.length > 0) {
          for (let i = 0; i < nomRecords.length; i += batchSize) {
            const batch = nomRecords.slice(i, i + batchSize);
            const { error: nomError, data: nomInserted } = await supabase
              .from("nominations")
              .insert(batch)
              .select("id");
            if (nomError) {
              results.errors.push(`Nominations batch: ${nomError.message}`);
            } else {
              results.nominations_created += nomInserted?.length || 0;
            }
          }
        }
      }

      // Log import event
      await supabase.from("audit_events").insert({
        action: "legacy_nominee_import",
        entity_type: "nominees",
        actor_role: "system",
        metadata: {
          total: results.total,
          inserted: results.inserted,
          merged: results.merged,
          unmapped: results.unmapped,
          nominations: results.nominations_created,
          dry_run: false,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        dry_run,
        results: {
          ...results,
          missing_subcategories: Array.from(results.missing_subcategories),
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Seed nominees error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
