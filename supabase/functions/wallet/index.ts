import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";

    // Create Supabase client
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader || "" } } }
    );

    // Service role client for admin operations
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const getUser = async () => {
      if (!authHeader?.startsWith("Bearer ")) return null;
      const token = authHeader.replace("Bearer ", "");
      const { data, error } = await supabase.auth.getClaims(token);
      if (error || !data?.claims) return null;
      return data.claims.sub;
    };

    // Check admin role
    const isAdmin = async (userId: string) => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      return data === true;
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

    // Route handling
    switch (action) {
      case "me": {
        if (req.method === "GET") {
          const userId = await getUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const wallet = await getUserWallet(userId);
          if (!wallet) {
            return new Response(
              JSON.stringify({ error: "Wallet not found" }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Get balance from view
          const { data: balance } = await supabase
            .from("wallet_balances")
            .select("*")
            .eq("account_id", wallet.id)
            .maybeSingle();

          return new Response(
            JSON.stringify({ account: wallet, balance: balance || { agc_total: 0, agc_withdrawable: 0, agc_non_withdrawable: 0, agc_bonus: 0, usd_balance: 0 } }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "dashboard": {
        if (req.method === "GET") {
          const userId = await getUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const wallet = await getUserWallet(userId);
          if (!wallet) {
            return new Response(
              JSON.stringify({ error: "Wallet not found" }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Get balance
          const { data: balance } = await supabase
            .from("wallet_balances")
            .select("*")
            .eq("account_id", wallet.id)
            .maybeSingle();

          // Get recent transactions
          const { data: entries } = await supabase
            .from("wallet_ledger_entries")
            .select("*")
            .eq("account_id", wallet.id)
            .order("created_at", { ascending: false })
            .limit(10);

          // Get referral info
          const { data: referral } = await supabase
            .from("referrals")
            .select("*")
            .eq("owner_type", "USER")
            .eq("owner_id", userId)
            .maybeSingle();

          return new Response(
            JSON.stringify({
              account: wallet,
              balance: balance || { agc_total: 0, agc_withdrawable: 0, agc_non_withdrawable: 0, agc_bonus: 0, usd_balance: 0 },
              recentTransactions: entries || [],
              referral,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "ledger": {
        if (req.method === "GET") {
          const userId = await getUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const wallet = await getUserWallet(userId);
          if (!wallet) {
            return new Response(
              JSON.stringify({ error: "Wallet not found" }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const limit = parseInt(url.searchParams.get("limit") || "50");
          const offset = parseInt(url.searchParams.get("offset") || "0");
          const entryType = url.searchParams.get("entry_type");

          let query = supabase
            .from("wallet_ledger_entries")
            .select("*", { count: "exact" })
            .eq("account_id", wallet.id)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (entryType) {
            query = query.eq("entry_type", entryType);
          }

          const { data, count, error } = await query;
          if (error) throw error;

          return new Response(
            JSON.stringify({ entries: data || [], total: count }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "topup": {
        if (req.method === "POST") {
          const userId = await getUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const wallet = await getUserWallet(userId);
          if (!wallet) {
            return new Response(
              JSON.stringify({ error: "Wallet not found" }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const body = await req.json();
          const { amount_usd, provider, metadata } = body;

          if (!amount_usd || amount_usd <= 0) {
            return new Response(
              JSON.stringify({ error: "Invalid amount" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Calculate AGC (1 USD = 10 AGC)
          const agcAmount = amount_usd * 10;

          // Create payment intent
          const { data: payment, error } = await adminSupabase
            .from("payment_intents")
            .insert({
              account_id: wallet.id,
              provider: provider || "PAYSTACK",
              status: "INITIATED",
              amount_usd,
              agc_amount: agcAmount,
              exchange_rate: 10,
              metadata: metadata || {},
              expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
            })
            .select()
            .single();

          if (error) throw error;

          // In production, integrate with actual payment provider
          // For now, return mock payment URL
          return new Response(
            JSON.stringify({
              payment_intent: payment,
              payment_url: null,
              message: "Payment gateway integration pending. Intent created.",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "referral": {
        const subAction = pathParts[2];

        // GET /wallet/referral - Get user's referral info
        if (req.method === "GET" && !subAction) {
          const userId = await getUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const { data: referral } = await supabase
            .from("referrals")
            .select("*")
            .eq("owner_type", "USER")
            .eq("owner_id", userId)
            .maybeSingle();

          const { data: events } = await supabase
            .from("referral_events")
            .select("*")
            .eq("referrer_type", "USER")
            .eq("referrer_id", userId)
            .order("created_at", { ascending: false })
            .limit(20);

          return new Response(
            JSON.stringify({ referral, events: events || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // GET /wallet/referral/lookup/:code - Public code lookup
        if (req.method === "GET" && subAction === "lookup") {
          const code = pathParts[3];
          if (!code) {
            return new Response(
              JSON.stringify({ error: "Code required" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const { data: referral } = await adminSupabase
            .from("referrals")
            .select("owner_type, owner_id, is_active")
            .eq("referral_code", code.toUpperCase())
            .eq("is_active", true)
            .maybeSingle();

          return new Response(
            JSON.stringify({
              valid: !!referral,
              owner_type: referral?.owner_type,
              owner_id: referral?.owner_id,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "admin": {
        const userId = await getUser();
        if (!userId || !(await isAdmin(userId))) {
          return new Response(
            JSON.stringify({ error: "Forbidden" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const subAction = pathParts[2];

        // POST /wallet/admin/credit - Credit a wallet
        if (req.method === "POST" && subAction === "credit") {
          const body = await req.json();
          const { account_id, agc_amount, entry_type, description, usd_amount, is_withdrawable, reference_type, reference_id } = body;

          const { data: entry, error } = await adminSupabase
            .from("wallet_ledger_entries")
            .insert({
              account_id,
              entry_type,
              direction: "CREDIT",
              agc_amount,
              usd_amount: usd_amount || 0,
              is_withdrawable: is_withdrawable ?? false,
              reference_type,
              reference_id,
              description,
              created_by: userId,
            })
            .select()
            .single();

          if (error) throw error;

          // Audit log
          await adminSupabase.from("audit_logs").insert({
            action: "wallet_credit",
            entity_type: "wallet_ledger_entry",
            entity_id: entry.id,
            user_id: userId,
            new_values: { account_id, agc_amount, entry_type },
          });

          return new Response(
            JSON.stringify({ entry }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // POST /wallet/admin/debit - Debit a wallet
        if (req.method === "POST" && subAction === "debit") {
          const body = await req.json();
          const { account_id, agc_amount, entry_type, description, usd_amount, reference_type, reference_id } = body;

          const { data: entry, error } = await adminSupabase
            .from("wallet_ledger_entries")
            .insert({
              account_id,
              entry_type,
              direction: "DEBIT",
              agc_amount,
              usd_amount: usd_amount || 0,
              is_withdrawable: false,
              reference_type,
              reference_id,
              description,
              created_by: userId,
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(
            JSON.stringify({ entry }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // GET /wallet/admin/accounts - List all wallets
        if (req.method === "GET" && subAction === "accounts") {
          const limit = parseInt(url.searchParams.get("limit") || "50");
          const offset = parseInt(url.searchParams.get("offset") || "0");
          const ownerType = url.searchParams.get("owner_type");

          let query = adminSupabase
            .from("wallet_accounts")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (ownerType) {
            query = query.eq("owner_type", ownerType);
          }

          const { data, count, error } = await query;
          if (error) throw error;

          return new Response(
            JSON.stringify({ accounts: data || [], total: count }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // GET /wallet/admin/platform - Platform wallet
        if (req.method === "GET" && subAction === "platform") {
          const { data: account } = await adminSupabase
            .from("wallet_accounts")
            .select("*")
            .eq("owner_type", "PLATFORM")
            .maybeSingle();

          if (!account) {
            return new Response(
              JSON.stringify({ error: "Platform wallet not found" }),
              { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const { data: balance } = await adminSupabase
            .from("wallet_balances")
            .select("*")
            .eq("account_id", account.id)
            .maybeSingle();

          return new Response(
            JSON.stringify({ account, balance: balance || { agc_total: 0 } }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Wallet function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
