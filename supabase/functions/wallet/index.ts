import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Response envelope helper
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    // Path: /wallet/{action}/{subAction?}/{id?}
    const action = pathParts[1] || "";
    const subAction = pathParts[2] || "";
    const resourceId = pathParts[3] || "";

    // Create Supabase clients
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

    // Auth middleware
    const requireAuth = async (): Promise<string | null> => {
      if (!authHeader?.startsWith("Bearer ")) return null;
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user.id;
    };

    const hasRole = async (userId: string, role: string) => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: role });
      return data === true;
    };

    const requireRole = async (userId: string, role: string): Promise<boolean> => {
      return await hasRole(userId, role);
    };

    // Get user's wallet account
    const getUserWallet = async (userId: string) => {
      const { data } = await supabase
        .from("wallet_accounts")
        .select("*")
        .eq("owner_type", "USER")
        .eq("owner_id", userId)
        .maybeSingle();
      return data;
    };

    // Get wallet balance
    const getWalletBalance = async (accountId: string) => {
      const { data } = await supabase
        .from("wallet_balances")
        .select("*")
        .eq("account_id", accountId)
        .maybeSingle();
      return data || { agc_total: 0, agc_withdrawable: 0, agc_non_withdrawable: 0, agc_bonus: 0, usd_balance: 0 };
    };

    // ============================================================
    // ROUTE: GET /wallet/me - Get current user's wallet
    // ============================================================
    if (action === "me" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const wallet = await getUserWallet(userId);
      if (!wallet) return errorResponse("Wallet not found", 404);

      const balance = await getWalletBalance(wallet.id);
      return respond({ account: wallet, balance });
    }

    // ============================================================
    // ROUTE: GET /wallet/balances - Get wallet balances (admin)
    // ============================================================
    if (action === "balances" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);
      if (!(await requireRole(userId, "admin"))) return errorResponse("Forbidden", 403);

      const { data, error } = await adminSupabase
        .from("wallet_balances")
        .select("*")
        .order("agc_total", { ascending: false })
        .limit(100);

      if (error) throw error;
      return respond(data || []);
    }

    // ============================================================
    // ROUTE: GET /wallet/transactions - Get paginated transactions
    // ============================================================
    if (action === "transactions" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const wallet = await getUserWallet(userId);
      if (!wallet) return errorResponse("Wallet not found", 404);

      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
      const type = url.searchParams.get("type");
      const offset = (page - 1) * limit;

      let query = supabase
        .from("wallet_ledger_entries")
        .select("*", { count: "exact" })
        .eq("account_id", wallet.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (type) query = query.eq("entry_type", type);

      const { data, count, error } = await query;
      if (error) throw error;

      return respond(data || [], { 
        page, 
        limit, 
        total: count || 0, 
        totalPages: Math.ceil((count || 0) / limit) 
      });
    }

    // ============================================================
    // ROUTE: POST /wallet/topup/init - Initialize wallet top-up
    // ============================================================
    if (action === "topup" && subAction === "init" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const wallet = await getUserWallet(userId);
      if (!wallet) return errorResponse("Wallet not found", 404);

      const body = await req.json();
      const { provider, amount_usd, metadata } = body;

      if (!amount_usd || amount_usd <= 0) return errorResponse("Invalid amount");
      if (!["PAYSTACK", "FLUTTERWAVE", "LEMFI", "TAPTAPSEND"].includes(provider)) {
        return errorResponse("Invalid payment provider");
      }

      // Get dynamic exchange rate from platform_config
      const { data: fxConfig } = await adminSupabase
        .from("platform_config")
        .select("value")
        .eq("key", "agc_exchange_rate")
        .maybeSingle();
      
      const exchangeRate = fxConfig?.value?.usd_to_agc || 10;
      const agcAmount = amount_usd * exchangeRate;

      const { data: payment, error } = await adminSupabase
        .from("payment_intents")
        .insert({
          account_id: wallet.id,
          provider,
          status: "INITIATED",
          amount_usd,
          agc_amount: agcAmount,
          exchange_rate: exchangeRate,
          metadata: metadata || {},
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Audit log
      await adminSupabase.from("audit_logs").insert({
        action: "topup_initiated",
        entity_type: "payment_intent",
        entity_id: payment.id,
        user_id: userId,
        new_values: { provider, amount_usd, agc_amount: agcAmount },
      });

      return respond({
        payment_intent: payment,
        payment_url: null, // Will be populated by payment provider integration
        message: "Payment intent created. Complete payment via provider.",
      });
    }

    // ============================================================
    // ROUTE: POST /wallet/withdraw/request - Request withdrawal
    // ============================================================
    if (action === "withdraw" && subAction === "request" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);

      const wallet = await getUserWallet(userId);
      if (!wallet) return errorResponse("Wallet not found", 404);

      const balance = await getWalletBalance(wallet.id);
      const body = await req.json();
      const { amount_agc, destination } = body;

      if (!amount_agc || amount_agc <= 0) return errorResponse("Invalid amount");
      if (!destination) return errorResponse("Destination required");
      if (amount_agc > (balance.agc_withdrawable || 0)) {
        return errorResponse("Insufficient withdrawable balance");
      }

      // Create withdrawal request as ledger entry
      const { data: entry, error } = await adminSupabase
        .from("wallet_ledger_entries")
        .insert({
          account_id: wallet.id,
          entry_type: "WITHDRAW_REQUEST",
          direction: "DEBIT",
          agc_amount: amount_agc,
          usd_amount: amount_agc / 10,
          is_withdrawable: true,
          description: `Withdrawal request to: ${destination}`,
          reference_type: "withdrawal_request",
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      await adminSupabase.from("audit_logs").insert({
        action: "withdraw_request",
        entity_type: "wallet_ledger_entry",
        entity_id: entry.id,
        user_id: userId,
        new_values: { amount_agc, destination },
      });

      return respond({ request_id: entry.id, status: "pending", amount_agc });
    }

    // ============================================================
    // ROUTE: POST /wallet/withdraw/approve - Admin approve withdrawal
    // ============================================================
    if (action === "withdraw" && subAction === "approve" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);
      if (!(await requireRole(userId, "admin"))) return errorResponse("Forbidden", 403);

      const body = await req.json();
      const { request_id } = body;
      if (!request_id) return errorResponse("Request ID required");

      // Get the original request
      const { data: request, error: fetchError } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("*")
        .eq("id", request_id)
        .eq("entry_type", "WITHDRAW_REQUEST")
        .single();

      if (fetchError || !request) return errorResponse("Request not found", 404);

      // Mark as approved by creating an approval entry
      const { data: approval, error } = await adminSupabase
        .from("wallet_ledger_entries")
        .insert({
          account_id: request.account_id,
          entry_type: "WITHDRAW_APPROVED",
          direction: "DEBIT",
          agc_amount: 0, // Already debited in request
          usd_amount: 0,
          is_withdrawable: false,
          description: `Approved withdrawal for request ${request_id}`,
          reference_type: "withdrawal_approval",
          reference_id: request_id,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      await adminSupabase.from("audit_logs").insert({
        action: "withdraw_approved",
        entity_type: "wallet_ledger_entry",
        entity_id: approval.id,
        user_id: userId,
        new_values: { request_id, approved_by: userId },
      });

      return respond({ approved: true, request_id });
    }

    // ============================================================
    // ROUTE: POST /wallet/withdraw/reject - Admin reject withdrawal
    // ============================================================
    if (action === "withdraw" && subAction === "reject" && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);
      if (!(await requireRole(userId, "admin"))) return errorResponse("Forbidden", 403);

      const body = await req.json();
      const { request_id, reason } = body;
      if (!request_id) return errorResponse("Request ID required");

      // Get the original request
      const { data: request, error: fetchError } = await adminSupabase
        .from("wallet_ledger_entries")
        .select("*")
        .eq("id", request_id)
        .eq("entry_type", "WITHDRAW_REQUEST")
        .single();

      if (fetchError || !request) return errorResponse("Request not found", 404);

      // Reverse the debit (credit back)
      const { data: reversal, error } = await adminSupabase
        .from("wallet_ledger_entries")
        .insert({
          account_id: request.account_id,
          entry_type: "ADJUSTMENT",
          direction: "CREDIT",
          agc_amount: request.agc_amount,
          usd_amount: request.usd_amount,
          is_withdrawable: true,
          description: `Withdrawal rejected: ${reason || "Admin decision"}`,
          reference_type: "withdrawal_rejection",
          reference_id: request_id,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      await adminSupabase.from("audit_logs").insert({
        action: "withdraw_rejected",
        entity_type: "wallet_ledger_entry",
        entity_id: reversal.id,
        user_id: userId,
        new_values: { request_id, reason, rejected_by: userId },
      });

      return respond({ rejected: true, request_id, refunded_agc: request.agc_amount });
    }

    // ============================================================
    // ADMIN ROUTES
    // ============================================================
    if (action === "admin") {
      const userId = await requireAuth();
      if (!userId) return errorResponse("Unauthorized", 401);
      if (!(await requireRole(userId, "admin"))) return errorResponse("Forbidden", 403);

      // GET /wallet/admin/accounts - List all wallet accounts
      if (subAction === "accounts" && req.method === "GET") {
        const limit = Math.min(parseInt(url.searchParams.get("limit") || "50"), 100);
        const offset = parseInt(url.searchParams.get("offset") || "0");
        const ownerType = url.searchParams.get("owner_type");

        let query = adminSupabase
          .from("wallet_accounts")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(offset, offset + limit - 1);

        if (ownerType) query = query.eq("owner_type", ownerType);

        const { data, count, error } = await query;
        if (error) throw error;

        return respond(data || [], { total: count || 0, limit, offset });
      }

      // POST /wallet/admin/credit - Credit a wallet
      if (subAction === "credit" && req.method === "POST") {
        const body = await req.json();
        const { account_id, agc_amount, entry_type, description, usd_amount, is_withdrawable } = body;

        if (!account_id || !agc_amount) return errorResponse("account_id and agc_amount required");

        const { data: entry, error } = await adminSupabase
          .from("wallet_ledger_entries")
          .insert({
            account_id,
            entry_type: entry_type || "ADJUSTMENT",
            direction: "CREDIT",
            agc_amount,
            usd_amount: usd_amount || 0,
            is_withdrawable: is_withdrawable ?? false,
            description: description || "Admin credit",
            created_by: userId,
          })
          .select()
          .single();

        if (error) throw error;

        await adminSupabase.from("audit_logs").insert({
          action: "wallet_credit",
          entity_type: "wallet_ledger_entry",
          entity_id: entry.id,
          user_id: userId,
          new_values: { account_id, agc_amount, entry_type },
        });

        return respond(entry);
      }

      // POST /wallet/admin/debit - Debit a wallet
      if (subAction === "debit" && req.method === "POST") {
        const body = await req.json();
        const { account_id, agc_amount, entry_type, description, usd_amount } = body;

        if (!account_id || !agc_amount) return errorResponse("account_id and agc_amount required");

        const { data: entry, error } = await adminSupabase
          .from("wallet_ledger_entries")
          .insert({
            account_id,
            entry_type: entry_type || "ADJUSTMENT",
            direction: "DEBIT",
            agc_amount,
            usd_amount: usd_amount || 0,
            is_withdrawable: false,
            description: description || "Admin debit",
            created_by: userId,
          })
          .select()
          .single();

        if (error) throw error;

        await adminSupabase.from("audit_logs").insert({
          action: "wallet_debit",
          entity_type: "wallet_ledger_entry",
          entity_id: entry.id,
          user_id: userId,
          new_values: { account_id, agc_amount, entry_type },
        });

        return respond(entry);
      }

      // GET /wallet/admin/platform - Get platform wallet
      if (subAction === "platform" && req.method === "GET") {
        const { data: account } = await adminSupabase
          .from("wallet_accounts")
          .select("*")
          .eq("owner_type", "PLATFORM")
          .maybeSingle();

        if (!account) return errorResponse("Platform wallet not found", 404);

        const balance = await getWalletBalance(account.id);
        return respond({ account, balance });
      }

      return errorResponse("Not found", 404);
    }

    return errorResponse("Not found", 404);

  } catch (error: unknown) {
    console.error("Wallet function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ ok: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
