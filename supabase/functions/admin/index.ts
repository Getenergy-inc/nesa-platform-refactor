import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.22.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const respond = (data: unknown, meta?: Record<string, unknown>, status = 200) =>
  new Response(
    JSON.stringify({ ok: true, data, ...(meta && { meta }) }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );

const errorResponse = (message: string, status = 400) =>
  new Response(
    JSON.stringify({ ok: false, error: message }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );

// ================================================================
// INPUT VALIDATION SCHEMAS (zod)
// ================================================================

// FX Rate validation - reasonable bounds for exchange rates
const FxRateSchema = z.object({
  rate: z.number().min(0.001).max(1000).positive({
    message: "Rate must be a positive number between 0.001 and 1000"
  }),
});

// Disbursement run validation
const DisbursementSchema = z.object({
  season_id: z.string().uuid("Invalid season ID format").optional(),
  notes: z.string().max(1000, "Notes must be 1000 characters or less").optional(),
});

// Season stage update validation
const SeasonStageUpdateSchema = z.object({
  nomination_open: z.boolean().optional(),
  gold_voting_open: z.boolean().optional(),
  blue_garnet_open: z.boolean().optional(),
  certificate_download_open: z.boolean().optional(),
}).refine(data => Object.keys(data).some(k => typeof data[k as keyof typeof data] === "boolean"), {
  message: "At least one stage field must be provided",
});

// Stage config update validation with date range checks
const StageConfigUpdateSchema = z.object({
  stage_id: z.string().uuid("Invalid stage ID format"),
  is_open: z.boolean().optional(),
  opens_at: z.string().datetime({ message: "opens_at must be a valid ISO datetime" }).optional(),
  closes_at: z.string().datetime({ message: "closes_at must be a valid ISO datetime" }).optional(),
}).refine(data => {
  // If both dates provided, ensure closes_at > opens_at
  if (data.opens_at && data.closes_at) {
    return new Date(data.closes_at) > new Date(data.opens_at);
  }
  return true;
}, { message: "closes_at must be after opens_at" }).refine(data => {
  // Validate dates are within reasonable range (±5 years)
  const now = Date.now();
  const fiveYearsMs = 5 * 365 * 24 * 60 * 60 * 1000;
  
  if (data.opens_at) {
    const opensTime = new Date(data.opens_at).getTime();
    if (opensTime < now - fiveYearsMs || opensTime > now + fiveYearsMs) {
      return false;
    }
  }
  if (data.closes_at) {
    const closesTime = new Date(data.closes_at).getTime();
    if (closesTime < now - fiveYearsMs || closesTime > now + fiveYearsMs) {
      return false;
    }
  }
  return true;
}, { message: "Dates must be within 5 years of current date" });

// Helper to format zod errors
const formatZodError = (error: z.ZodError): string => {
  return error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // Path: /admin/{domain}/{action}/{id?}
    const domain = pathParts[1] || "";
    const action = pathParts[2] || "";
    const resourceId = pathParts[3] || "";

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader || "" } } }
    );

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Auth middleware - all admin endpoints require admin role
    // Uses getClaims() for proper JWT verification per Supabase signing-keys approach
    const requireAdmin = async (): Promise<string | null> => {
      if (!authHeader?.startsWith("Bearer ")) return null;
      
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      if (claimsError || !claimsData?.claims) return null;
      
      const userId = claimsData.claims.sub as string;
      if (!userId) return null;

      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!isAdmin) return null;

      return userId;
    };

    const userId = await requireAdmin();
    if (!userId) return errorResponse("Forbidden", 403);

    // Get active season helper
    const getActiveSeason = async () => {
      const { data } = await adminSupabase
        .from("seasons")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();
      return data;
    };

    // ================================================================
    // FINANCE ENDPOINTS
    // ================================================================
    if (domain === "finance") {
      // GET /admin/finance/overview
      if (action === "overview" && req.method === "GET") {
        const { data: ledgerData } = await adminSupabase
          .from("wallet_ledger_entries")
          .select("agc_amount, usd_amount, entry_type, direction, created_at");

        const totalAgc = ledgerData?.reduce((sum, e) => 
          sum + (e.direction === "CREDIT" ? e.agc_amount : -e.agc_amount), 0) || 0;

        const revenueByCategory = {
          nomination: ledgerData?.filter(e => e.entry_type === "NOMINATION_FEE").reduce((s, e) => s + e.usd_amount, 0) || 0,
          vote: ledgerData?.filter(e => e.entry_type === "VOTE_FEE").reduce((s, e) => s + e.usd_amount, 0) || 0,
          donation: ledgerData?.filter(e => e.entry_type === "DONATION").reduce((s, e) => s + e.usd_amount, 0) || 0,
          ticket: ledgerData?.filter(e => e.entry_type === "TICKET").reduce((s, e) => s + e.usd_amount, 0) || 0,
        };

        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const { count: dailyCount } = await adminSupabase
          .from("wallet_ledger_entries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", dayAgo.toISOString());

        const { count: weeklyCount } = await adminSupabase
          .from("wallet_ledger_entries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", weekAgo.toISOString());

        const { count: monthlyCount } = await adminSupabase
          .from("wallet_ledger_entries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", monthAgo.toISOString());

        const fxRate = 0.1; // 10 AGC = 1 USD

        return respond({
          total_agc_circulation: totalAgc,
          total_usd_equivalence: totalAgc * fxRate,
          fx_rate: fxRate,
          fx_rate_updated_at: new Date().toISOString(),
          revenue_by_category: revenueByCategory,
          transactions_summary: {
            daily: dailyCount || 0,
            weekly: weeklyCount || 0,
            monthly: monthlyCount || 0,
          },
        });
      }

      // GET /admin/finance/agc-circulation
      if (action === "agc-circulation" && req.method === "GET") {
        const { data: balances } = await adminSupabase
          .from("wallet_balances")
          .select("owner_type, agc_total, agc_withdrawable, agc_non_withdrawable, agc_bonus");

        const byOwnerType: Record<string, { count: number; total_agc: number }> = {};
        (balances || []).forEach(b => {
          const type = b.owner_type || "UNKNOWN";
          if (!byOwnerType[type]) byOwnerType[type] = { count: 0, total_agc: 0 };
          byOwnerType[type].count += 1;
          byOwnerType[type].total_agc += b.agc_total || 0;
        });

        const totalAgc = (balances || []).reduce((s, b) => s + (b.agc_total || 0), 0);

        return respond({
          total_agc: totalAgc,
          by_owner_type: byOwnerType,
          wallet_count: balances?.length || 0,
        });
      }

      // GET /admin/finance/fx-rate
      if (action === "fx-rate" && req.method === "GET") {
        // In production, this would come from a config table
        return respond({
          rate: 0.1, // 10 AGC = 1 USD
          updated_at: new Date().toISOString(),
          source: "system_default",
        });
      }

      // POST /admin/finance/fx-rate/set
      if (action === "fx-rate" && resourceId === "set" && req.method === "POST") {
        const body = await req.json();
        
        // Validate input using zod schema
        const parseResult = FxRateSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse(formatZodError(parseResult.error), 400);
        }
        const { rate } = parseResult.data;

        // In production, save to a config table
        await adminSupabase.from("audit_logs").insert({
          action: "fx_rate_updated",
          entity_type: "config",
          entity_id: "fx_rate",
          user_id: userId,
          old_values: { rate: 0.1 },
          new_values: { rate },
        });

        return respond({ rate, updated_at: new Date().toISOString() });
      }

      // POST /admin/finance/disburse/run
      if (action === "disburse" && resourceId === "run" && req.method === "POST") {
        const body = await req.json();
        
        // Validate input using zod schema
        const parseResult = DisbursementSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse(formatZodError(parseResult.error), 400);
        }
        const validatedBody = parseResult.data;
        
        const seasonId = validatedBody.season_id || (await getActiveSeason())?.id;

        if (!seasonId) return errorResponse("No active season");

        // Verify season exists before proceeding
        const { data: season } = await adminSupabase
          .from("seasons")
          .select("id")
          .eq("id", seasonId)
          .maybeSingle();
        
        if (!season) return errorResponse("Season not found", 404);

        // Get revenue splits
        const { data: splits } = await adminSupabase
          .from("revenue_splits")
          .select("*")
          .eq("season_id", seasonId)
          .eq("is_active", true);

        if (!splits?.length) return errorResponse("No revenue splits configured");

        // Create disbursement run with validated notes
        const { data: run, error: runError } = await adminSupabase
          .from("disbursement_runs")
          .insert({
            season_id: seasonId,
            run_date: new Date().toISOString().split("T")[0],
            status: "DRAFT",
            created_by: userId,
            notes: validatedBody.notes || "Manual disbursement run",
          })
          .select()
          .single();

        if (runError) throw runError;

        // Calculate total revenue for disbursement
        const { data: revenue } = await adminSupabase
          .from("wallet_ledger_entries")
          .select("usd_amount")
          .in("entry_type", ["NOMINATION_FEE", "VOTE_FEE", "TICKET", "DONATION"])
          .eq("direction", "CREDIT");

        const totalRevenue = revenue?.reduce((s, e) => s + e.usd_amount, 0) || 0;

        // Create disbursement lines
        const lines = splits.map(split => ({
          run_id: run.id,
          split_key: split.split_key,
          amount_usd: (totalRevenue * split.percent) / 100,
          destination_description: split.destination_description,
          status: "pending",
        }));

        const { error: linesError } = await adminSupabase
          .from("disbursement_lines")
          .insert(lines);

        if (linesError) throw linesError;

        // Update run total
        await adminSupabase
          .from("disbursement_runs")
          .update({ total_amount_usd: totalRevenue })
          .eq("id", run.id);

        await adminSupabase.from("audit_logs").insert({
          action: "disbursement_run_created",
          entity_type: "disbursement_run",
          entity_id: run.id,
          user_id: userId,
          new_values: { season_id: seasonId, total_revenue: totalRevenue, line_count: lines.length },
        });

        return respond({ run_id: run.id, total_revenue: totalRevenue, lines: lines.length });
      }

      // GET /admin/finance/disburse/logs
      if (action === "disburse" && resourceId === "logs" && req.method === "GET") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
        const offset = (page - 1) * limit;

        const { data: runs, count } = await adminSupabase
          .from("disbursement_runs")
          .select("*", { count: "exact" })
          .order("run_date", { ascending: false })
          .range(offset, offset + limit - 1);

        return respond(runs || [], { page, limit, total: count || 0 });
      }
    }

    // ================================================================
    // VOTES ENDPOINTS (read-only for governance - no manipulation)
    // ================================================================
    if (domain === "votes") {
      // GET /admin/votes/logs
      if (action === "logs" && req.method === "GET") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
        const offset = (page - 1) * limit;

        const { data: votes, count } = await adminSupabase
          .from("votes")
          .select(`
            id, voter_id, nominee_id, vote_type, created_at,
            nominees!inner(name, slug)
          `, { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        return respond(votes || [], { page, limit, total: count || 0 });
      }

      // GET /admin/votes/risk-flags (governance audit)
      if (action === "risk-flags" && req.method === "GET") {
        // Detect potential issues:
        // 1. Multiple votes from same voter to same nominee
        // 2. Rapid-fire voting patterns
        // 3. Suspicious IP clusters (would need additional logging)

        const { data: duplicateVotes } = await adminSupabase
          .rpc("get_duplicate_votes"); // Would need to create this function

        // For now, return placeholder
        return respond({
          flags: [],
          message: "Risk detection requires additional monitoring infrastructure",
        });
      }
    }

    // ================================================================
    // AUDIT ENDPOINTS
    // ================================================================
    if (domain === "audit") {
      // GET /admin/audit
      if (!action && req.method === "GET") {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
        const offset = (page - 1) * limit;
        const actionFilter = url.searchParams.get("action");
        const entityType = url.searchParams.get("entity_type");

        let query = adminSupabase
          .from("audit_logs")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (actionFilter) query = query.eq("action", actionFilter);
        if (entityType) query = query.eq("entity_type", entityType);

        const { data: logs, count } = await query;

        return respond(logs || [], { page, limit, total: count || 0 });
      }

      // GET /admin/audit/export
      if (action === "export" && req.method === "GET") {
        const { data: logs } = await adminSupabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10000);

        return new Response(JSON.stringify(logs || []), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().split("T")[0]}.json"`,
          },
        });
      }
    }

    // ================================================================
    // SEASONS ENDPOINTS
    // ================================================================
    if (domain === "seasons") {
      // POST /admin/seasons/:id/update
      if (resourceId && action === "update" && req.method === "POST") {
        const seasonId = resourceId;
        const body = await req.json();

        // Validate using zod schema
        const parseResult = SeasonStageUpdateSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse(formatZodError(parseResult.error), 400);
        }

        // Allowed fields for stage control
        const allowedFields = [
          "nomination_open",
          "gold_voting_open",
          "blue_garnet_open",
          "certificate_download_open",
        ];

        const updates: Record<string, boolean> = {};
        for (const field of allowedFields) {
          if (typeof body[field] === "boolean") {
            updates[field] = body[field];
          }
        }

        if (Object.keys(updates).length === 0) {
          return errorResponse("No valid fields to update");
        }

        // Get current values for audit
        const { data: currentSeason } = await adminSupabase
          .from("seasons")
          .select("*")
          .eq("id", seasonId)
          .single();

        if (!currentSeason) return errorResponse("Season not found", 404);

        const { error } = await adminSupabase
          .from("seasons")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", seasonId);

        if (error) throw error;

        await adminSupabase.from("audit_logs").insert({
          action: "season_stage_updated",
          entity_type: "season",
          entity_id: seasonId,
          user_id: userId,
          old_values: Object.fromEntries(
            Object.keys(updates).map(k => [k, currentSeason[k as keyof typeof currentSeason]])
          ),
          new_values: updates,
        });

        return respond({ updated: true, season_id: seasonId, changes: updates });
      }

      // GET /admin/seasons/:id/stages
      if (action === "stages" && req.method === "GET") {
        const { data: stages } = await adminSupabase
          .from("stage_config")
          .select("*")
          .eq("season_id", resourceId || (await getActiveSeason())?.id || "")
          .order("action");

        return respond(stages || []);
      }

      // POST /admin/seasons/:id/stages/update
      if (action === "stages" && resourceId === "update" && req.method === "POST") {
        const body = await req.json();
        
        // Validate using zod schema with date range checks
        const parseResult = StageConfigUpdateSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse(formatZodError(parseResult.error), 400);
        }
        
        const { stage_id, is_open, opens_at, closes_at } = parseResult.data;

        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (typeof is_open === "boolean") updates.is_open = is_open;
        if (opens_at !== undefined) updates.opens_at = opens_at;
        if (closes_at !== undefined) updates.closes_at = closes_at;

        const { error } = await adminSupabase
          .from("stage_config")
          .update(updates)
          .eq("id", stage_id);

        if (error) throw error;

        await adminSupabase.from("audit_logs").insert({
          action: "stage_config_updated",
          entity_type: "stage_config",
          entity_id: stage_id,
          user_id: userId,
          new_values: updates,
        });

        return respond({ updated: true, stage_id });
      }
    }

    return errorResponse("Not found", 404);

  } catch (error: unknown) {
    console.error("Admin function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
