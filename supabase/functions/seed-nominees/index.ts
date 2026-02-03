import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NomineeInput {
  name: string;
  slug: string;
  bio?: string;
  title?: string;
  organization?: string;
  country?: string;
  region?: string;
  photo_url?: string;
  logo_url?: string;
  subcategory_slug: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const { data: subcategories, error: subcatError } = await supabase
      .from("subcategories")
      .select("id, slug, name");

    if (subcatError) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch subcategories", details: subcatError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subcatMap = new Map(subcategories?.map(s => [s.slug, s.id]) || []);

    // Process nominees
    const results = {
      total: nominees.length,
      valid: 0,
      skipped: 0,
      inserted: 0,
      errors: [] as string[],
      missing_subcategories: new Set<string>(),
    };

    const validNominees: any[] = [];

    for (const nominee of nominees) {
      const subcategoryId = subcatMap.get(nominee.subcategory_slug);
      
      if (!subcategoryId) {
        results.missing_subcategories.add(nominee.subcategory_slug);
        results.skipped++;
        continue;
      }

      if (!nominee.name || !nominee.slug) {
        results.errors.push(`Invalid nominee: missing name or slug`);
        results.skipped++;
        continue;
      }

      validNominees.push({
        name: nominee.name,
        slug: nominee.slug,
        bio: nominee.bio || null,
        title: nominee.title || null,
        organization: nominee.organization || null,
        country: nominee.country || null,
        region: nominee.region || null,
        photo_url: nominee.photo_url || null,
        logo_url: nominee.logo_url || null,
        subcategory_id: subcategoryId,
        season_id: season.id,
        status: "approved",
        public_votes: 0,
        renomination_count: 0,
      });

      results.valid++;
    }

    if (!dry_run && validNominees.length > 0) {
      // Insert in batches of 100 (using insert, not upsert since slug may not be unique)
      const batchSize = 100;
      for (let i = 0; i < validNominees.length; i += batchSize) {
        const batch = validNominees.slice(i, i + batchSize);
        
        // Check for existing slugs to avoid duplicates
        const slugs = batch.map(n => n.slug);
        const { data: existing } = await supabase
          .from("nominees")
          .select("slug")
          .in("slug", slugs);
        
        const existingSlugs = new Set(existing?.map(e => e.slug) || []);
        const newNominees = batch.filter(n => !existingSlugs.has(n.slug));
        
        if (newNominees.length > 0) {
          const { error: insertError, data: inserted } = await supabase
            .from("nominees")
            .insert(newNominees)
            .select("id");

          if (insertError) {
            results.errors.push(`Batch ${i / batchSize + 1}: ${insertError.message}`);
          } else {
            results.inserted += inserted?.length || 0;
          }
        } else {
          results.skipped += batch.length;
        }
      }
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
