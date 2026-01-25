import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LegacyNominee {
  name: string;
  slug?: string;
  title?: string;
  organization?: string;
  bio?: string;
  photo_url?: string;
  region?: string;
  subcategory_id?: string;
  subcategory_slug?: string;
  category_slug?: string;
  status?: string;
  is_platinum?: boolean;
  evidence_urls?: string[];
  renomination_count?: number;
}

interface ImportRequest {
  nominees: LegacyNominee[];
  season_id?: string;
  dry_run?: boolean;
}

interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: Array<{ index: number; name: string; error: string }>;
  created_ids: string[];
}

function generateSlug(name: string, index: number): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  return `${baseSlug}-${Date.now()}-${index}`;
}

function validateNominee(nominee: LegacyNominee, index: number): string | null {
  if (!nominee.name || typeof nominee.name !== "string" || nominee.name.trim().length === 0) {
    return `Nominee at index ${index} is missing required field 'name'`;
  }
  if (nominee.name.length > 255) {
    return `Nominee at index ${index} has name exceeding 255 characters`;
  }
  if (nominee.region && !["North", "West", "East", "Central", "Southern"].includes(nominee.region)) {
    return `Nominee at index ${index} has invalid region '${nominee.region}'`;
  }
  if (nominee.status && !["pending", "under_review", "approved", "rejected", "platinum"].includes(nominee.status)) {
    return `Nominee at index ${index} has invalid status '${nominee.status}'`;
  }
  return null;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - missing token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden - admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: ImportRequest = await req.json();
    
    if (!body.nominees || !Array.isArray(body.nominees)) {
      return new Response(
        JSON.stringify({ error: "Invalid request - 'nominees' array required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.nominees.length === 0) {
      return new Response(
        JSON.stringify({ error: "Empty nominees array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (body.nominees.length > 500) {
      return new Response(
        JSON.stringify({ error: "Maximum 500 nominees per import batch" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get active season if not provided
    let seasonId = body.season_id;
    if (!seasonId) {
      const { data: activeSeason } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .maybeSingle();
      
      if (!activeSeason) {
        return new Response(
          JSON.stringify({ error: "No active season found. Please provide season_id." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      seasonId = activeSeason.id;
    }

    // Fetch subcategories for slug mapping
    const { data: subcategories } = await supabase
      .from("subcategories")
      .select("id, slug, category_id, categories(slug)");

    const subcategoryMap = new Map<string, string>();
    subcategories?.forEach((sub: any) => {
      subcategoryMap.set(sub.slug, sub.id);
      if (sub.categories?.slug) {
        subcategoryMap.set(`${sub.categories.slug}/${sub.slug}`, sub.id);
      }
    });

    // Validate and prepare nominees
    const result: ImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
      created_ids: [],
    };

    const nomineesToInsert: any[] = [];

    for (let i = 0; i < body.nominees.length; i++) {
      const nominee = body.nominees[i];
      
      // Validate
      const validationError = validateNominee(nominee, i);
      if (validationError) {
        result.errors.push({ index: i, name: nominee.name || "unknown", error: validationError });
        result.failed++;
        continue;
      }

      // Resolve subcategory_id
      let subcategoryId = nominee.subcategory_id;
      if (!subcategoryId && nominee.subcategory_slug) {
        const lookupKey = nominee.category_slug 
          ? `${nominee.category_slug}/${nominee.subcategory_slug}`
          : nominee.subcategory_slug;
        subcategoryId = subcategoryMap.get(lookupKey) || subcategoryMap.get(nominee.subcategory_slug);
      }

      if (!subcategoryId) {
        // Get first available subcategory as fallback
        const { data: fallbackSub } = await supabase
          .from("subcategories")
          .select("id")
          .limit(1)
          .maybeSingle();
        
        if (!fallbackSub) {
          result.errors.push({ 
            index: i, 
            name: nominee.name, 
            error: "No subcategory found and none available as fallback" 
          });
          result.failed++;
          continue;
        }
        subcategoryId = fallbackSub.id;
      }

      nomineesToInsert.push({
        name: nominee.name.trim(),
        slug: nominee.slug || generateSlug(nominee.name, i),
        title: nominee.title || null,
        organization: nominee.organization || null,
        bio: nominee.bio || null,
        photo_url: nominee.photo_url || null,
        region: nominee.region || null,
        subcategory_id: subcategoryId,
        season_id: seasonId,
        status: nominee.status || "approved",
        is_platinum: nominee.is_platinum || false,
        evidence_urls: nominee.evidence_urls || [],
        renomination_count: nominee.renomination_count || 0,
        public_votes: 0,
        jury_score: 0,
        final_score: 0,
      });
    }

    // Dry run mode - just validate without inserting
    if (body.dry_run) {
      return new Response(
        JSON.stringify({
          dry_run: true,
          would_import: nomineesToInsert.length,
          validation_errors: result.errors,
          sample_records: nomineesToInsert.slice(0, 3),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Batch insert nominees
    if (nomineesToInsert.length > 0) {
      const { data: inserted, error: insertError } = await supabase
        .from("nominees")
        .insert(nomineesToInsert)
        .select("id");

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(
          JSON.stringify({ 
            error: "Database insert failed", 
            details: insertError.message,
            partial_success: result.imported > 0,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      result.imported = inserted?.length || 0;
      result.created_ids = inserted?.map((n: any) => n.id) || [];
    }

    result.success = result.failed === 0;

    // Log audit event
    await supabase.from("audit_logs").insert({
      action: "bulk_import_nominees",
      entity_type: "nominee",
      user_id: userData.user.id,
      new_values: {
        imported_count: result.imported,
        failed_count: result.failed,
        season_id: seasonId,
      },
    });

    console.log(`Import complete: ${result.imported} imported, ${result.failed} failed`);

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Import error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
