import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Constants
const AGC_BONUS_RATE = 5; // $1 = 5 AGC
const REFERRAL_BONUS_FIRST = 15; // First paid referral
const REFERRAL_BONUS_SECOND = 5; // Second paid referral

// ============================================================
// IDEMPOTENT ORDER PROCESSING
// Ensures webhooks don't double-credit AGC
// ============================================================
async function processOrderPayment(
  adminClient: SupabaseClient,
  orderId: string,
  providerRef: string,
  provider: string
): Promise<{ success: boolean; error?: string; alreadyProcessed?: boolean }> {
  // Check if already processed
  const { data: order } = await adminClient
    .from("orders")
    .select("id, status, user_id, total_usd, referral_code, agc_bonus_amount")
    .eq("id", orderId)
    .single();

  if (!order) return { success: false, error: "Order not found" };
  if (order.status === "PAID") return { success: true, alreadyProcessed: true };

  // Calculate AGC bonus
  const bonusAgc = Math.floor(order.total_usd * AGC_BONUS_RATE);

  // Update order to PAID
  const { error: updateError } = await adminClient
    .from("orders")
    .update({
      status: "PAID",
      paid_at: new Date().toISOString(),
      provider,
      provider_ref: providerRef,
      agc_bonus_amount: bonusAgc,
      receipt_number: await generateReceiptNumber(adminClient),
    })
    .eq("id", orderId)
    .eq("status", "PENDING"); // Optimistic locking

  if (updateError) return { success: false, error: updateError.message };

  // Credit buyer's wallet if logged in
  if (order.user_id) {
    const { data: wallet } = await adminClient
      .from("wallet_accounts")
      .select("id")
      .eq("owner_type", "USER")
      .eq("owner_id", order.user_id)
      .maybeSingle();

    if (wallet) {
      // Check idempotency - don't double credit
      const { data: existingCredit } = await adminClient
        .from("wallet_ledger_entries")
        .select("id")
        .eq("reference_type", "order")
        .eq("reference_id", orderId)
        .eq("entry_type", "MERCH_BONUS")
        .maybeSingle();

      if (!existingCredit) {
        await adminClient.from("wallet_ledger_entries").insert({
          account_id: wallet.id,
          entry_type: "MERCH_BONUS",
          direction: "CREDIT",
          agc_amount: bonusAgc,
          usd_amount: 0,
          is_withdrawable: false,
          is_bonus: true,
          description: `Merchandise purchase bonus: Order ${orderId.slice(0, 8)}`,
          reference_type: "order",
          reference_id: orderId,
        });
      }
    }

    // Process referral bonus
    if (order.referral_code) {
      await processReferralBonus(adminClient, order.user_id, order.referral_code, orderId, order.total_usd);
    }
  }

  // Audit log
  await adminClient.from("audit_logs").insert({
    action: "order_paid",
    entity_type: "order",
    entity_id: orderId,
    user_id: order.user_id,
    new_values: { provider, provider_ref: providerRef, agc_bonus: bonusAgc },
  });

  return { success: true };
}

async function generateReceiptNumber(adminClient: SupabaseClient): Promise<string> {
  const { data } = await adminClient.rpc("generate_receipt_number");
  return data || `NESA-${Date.now()}`;
}

async function processReferralBonus(
  adminClient: SupabaseClient,
  buyerUserId: string,
  referralCode: string,
  orderId: string,
  orderTotal: number
): Promise<void> {
  try {
    // Find referrer by code
    const { data: referral } = await adminClient
      .from("referrals")
      .select("owner_id, owner_type")
      .eq("referral_code", referralCode)
      .eq("is_active", true)
      .maybeSingle();

    if (!referral) return;

    // Prevent self-referral
    if (referral.owner_type === "USER" && referral.owner_id === buyerUserId) {
      console.log("Self-referral blocked");
      return;
    }

    // Count previous successful referrals for tiered bonus
    const { count } = await adminClient
      .from("referral_events")
      .select("*", { count: "exact", head: true })
      .eq("referrer_type", referral.owner_type)
      .eq("referrer_id", referral.owner_id)
      .eq("event_type", "PURCHASE")
      .eq("is_paid", true);

    const previousCount = count || 0;
    let bonusAgc = 0;
    if (previousCount === 0) {
      bonusAgc = REFERRAL_BONUS_FIRST;
    } else if (previousCount === 1) {
      bonusAgc = REFERRAL_BONUS_SECOND;
    }
    // After 2 referrals, no more bonus (or could be a smaller amount)

    if (bonusAgc === 0) return;

    // Check idempotency
    const { data: existingEvent } = await adminClient
      .from("referral_events")
      .select("id")
      .eq("referrer_id", referral.owner_id)
      .eq("referred_user_id", buyerUserId)
      .eq("event_type", "PURCHASE")
      .maybeSingle();

    if (existingEvent) return; // Already processed

    // Create referral event
    await adminClient.from("referral_events").insert({
      referrer_type: referral.owner_type,
      referrer_id: referral.owner_id,
      referred_user_id: buyerUserId,
      event_type: "PURCHASE",
      reward_agc: bonusAgc,
      value_usd: orderTotal,
      is_paid: true,
    });

    // Credit referrer's wallet
    const { data: referrerWallet } = await adminClient
      .from("wallet_accounts")
      .select("id")
      .eq("owner_type", referral.owner_type)
      .eq("owner_id", referral.owner_id)
      .maybeSingle();

    if (referrerWallet) {
      await adminClient.from("wallet_ledger_entries").insert({
        account_id: referrerWallet.id,
        entry_type: "MERCH_REFERRAL_BONUS",
        direction: "CREDIT",
        agc_amount: bonusAgc,
        usd_amount: 0,
        is_withdrawable: false,
        is_bonus: true,
        description: `Referral bonus for order ${orderId.slice(0, 8)}`,
        reference_type: "order",
        reference_id: orderId,
      });
    }

    // Update referral totals
    const { data: currentRef } = await adminClient
      .from("referrals")
      .select("total_earnings_agc")
      .eq("owner_type", referral.owner_type)
      .eq("owner_id", referral.owner_id)
      .maybeSingle();
    
    await adminClient
      .from("referrals")
      .update({
        total_referrals: previousCount + 1,
        total_earnings_agc: (currentRef?.total_earnings_agc || 0) + bonusAgc,
      })
      .eq("owner_type", referral.owner_type)
      .eq("owner_id", referral.owner_id);

    // Update order with referrer info
    await adminClient
      .from("orders")
      .update({ referrer_user_id: referral.owner_type === "USER" ? referral.owner_id : null })
      .eq("id", orderId);

  } catch (error) {
    console.error("Error processing referral bonus:", error);
  }
}

// ============================================================
// REFUND HANDLING
// Reverses AGC credits when refunds occur
// ============================================================
async function processOrderRefund(
  adminClient: SupabaseClient,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const { data: order } = await adminClient
    .from("orders")
    .select("id, status, user_id, agc_bonus_amount, referrer_user_id")
    .eq("id", orderId)
    .single();

  if (!order) return { success: false, error: "Order not found" };
  if (order.status === "REFUNDED") return { success: true };
  if (order.status !== "PAID") return { success: false, error: "Can only refund paid orders" };

  // Mark as refunded
  await adminClient
    .from("orders")
    .update({ status: "REFUNDED", refunded_at: new Date().toISOString() })
    .eq("id", orderId);

  // Reverse buyer's AGC bonus
  if (order.user_id && order.agc_bonus_amount > 0) {
    const { data: wallet } = await adminClient
      .from("wallet_accounts")
      .select("id")
      .eq("owner_type", "USER")
      .eq("owner_id", order.user_id)
      .maybeSingle();

    if (wallet) {
      await adminClient.from("wallet_ledger_entries").insert({
        account_id: wallet.id,
        entry_type: "MERCH_REFUND_REVERSAL",
        direction: "DEBIT",
        agc_amount: order.agc_bonus_amount,
        usd_amount: 0,
        is_withdrawable: false,
        description: `Refund reversal for order ${orderId.slice(0, 8)}`,
        reference_type: "order",
        reference_id: orderId,
      });
    }
  }

  // Reverse referrer's bonus if applicable
  if (order.referrer_user_id) {
    const { data: referralEntry } = await adminClient
      .from("wallet_ledger_entries")
      .select("agc_amount, account_id")
      .eq("reference_type", "order")
      .eq("reference_id", orderId)
      .eq("entry_type", "MERCH_REFERRAL_BONUS")
      .maybeSingle();

    if (referralEntry) {
      await adminClient.from("wallet_ledger_entries").insert({
        account_id: referralEntry.account_id,
        entry_type: "MERCH_REFUND_REVERSAL",
        direction: "DEBIT",
        agc_amount: referralEntry.agc_amount,
        usd_amount: 0,
        is_withdrawable: false,
        description: `Referral bonus reversal for order ${orderId.slice(0, 8)}`,
        reference_type: "order",
        reference_id: orderId,
      });
    }
  }

  // Audit log
  await adminClient.from("audit_logs").insert({
    action: "order_refunded",
    entity_type: "order",
    entity_id: orderId,
    new_values: { agc_reversed: order.agc_bonus_amount },
  });

  return { success: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";
    const subAction = pathParts[2] || "";
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

    const requireAuth = async (): Promise<string | null> => {
      if (!authHeader?.startsWith("Bearer ")) return null;
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user.id;
    };

    const hasRole = async (userId: string, role: string): Promise<boolean> => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: role });
      return data === true;
    };

    // ============================================================
    // ROUTE: GET /shop/products - List products
    // ============================================================
    if (action === "products" && req.method === "GET" && !subAction) {
      const category = url.searchParams.get("category");
      
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (category && category !== "all") {
        query = query.eq("category", category.toUpperCase());
      }

      const { data, error } = await query;
      if (error) throw error;
      return respond(data || []);
    }

    // ============================================================
    // ROUTE: GET /shop/products/:slug - Get product by slug
    // ============================================================
    if (action === "products" && subAction && req.method === "GET") {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", subAction)
        .eq("is_active", true)
        .single();

      if (error || !data) return errorResponse("Product not found", 404);
      return respond(data);
    }

    // ============================================================
    // ROUTE: GET /shop/orders/:id - Get order details
    // ============================================================
    if (action === "orders" && subAction && req.method === "GET") {
      const userId = await requireAuth();

      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", subAction)
        .single();

      if (error || !order) return errorResponse("Order not found", 404);

      // Only allow owner or admin to view
      if (order.user_id !== userId) {
        if (!userId || !(await hasRole(userId, "admin"))) {
          return errorResponse("Forbidden", 403);
        }
      }

      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", subAction);

      return respond({ ...order, items: items || [] });
    }

    // ============================================================
    // ROUTE: POST /shop/orders - Create order
    // ============================================================
    if (action === "orders" && req.method === "POST" && !subAction) {
      const body = await req.json();
      const { email, full_name, phone, impact_destination, referral_code, items } = body;

      if (!email || !full_name || !items?.length) {
        return errorResponse("Email, name, and items required");
      }

      const userId = await requireAuth();

      // Calculate totals
      const productIds = items.map((i: any) => i.product_id);
      const { data: products } = await supabase
        .from("products")
        .select("id, price_usd")
        .in("id", productIds);

      let subtotal = 0;
      const orderItems = items.map((item: any) => {
        const product = products?.find((p: any) => p.id === item.product_id);
        const price = product?.price_usd || 0;
        subtotal += price * item.quantity;
        return {
          product_id: item.product_id,
          product_name: item.product_name,
          product_image_url: item.product_image_url,
          quantity: item.quantity,
          unit_price_usd: price,
        };
      });

      // Create order
      const { data: order, error: orderError } = await adminSupabase
        .from("orders")
        .insert({
          user_id: userId,
          email,
          full_name,
          phone,
          subtotal_usd: subtotal,
          shipping_usd: 0,
          total_usd: subtotal,
          impact_destination: impact_destination || "EDUAID_AFRICA",
          referral_code,
          status: "PENDING",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const itemsWithOrderId = orderItems.map((item: any) => ({
        ...item,
        order_id: order.id,
      }));

      await adminSupabase.from("order_items").insert(itemsWithOrderId);

      return respond(order);
    }

    // ============================================================
    // ROUTE: POST /shop/webhooks/:provider - Payment webhooks
    // ============================================================
    if (action === "webhooks" && req.method === "POST") {
      const provider = subAction.toUpperCase();
      const body = await req.json();

      // Extract order ID and payment reference based on provider
      let orderId: string | null = null;
      let providerRef: string | null = null;
      let eventType: string | null = null;

      if (provider === "PAYSTACK") {
        eventType = body.event;
        providerRef = body.data?.reference;
        orderId = body.data?.metadata?.order_id;
      } else if (provider === "TRANSACTPAY") {
        eventType = body.type;
        providerRef = body.reference;
        orderId = body.metadata?.order_id;
      }

      if (!orderId || !providerRef) {
        return errorResponse("Missing order_id or reference");
      }

      // Process based on event type
      if (eventType === "charge.success" || eventType === "payment.successful") {
        const result = await processOrderPayment(adminSupabase, orderId, providerRef, provider);
        if (!result.success) return errorResponse(result.error || "Processing failed");
        return respond({ processed: true, alreadyProcessed: result.alreadyProcessed });
      }

      if (eventType === "refund.processed" || eventType === "charge.refunded") {
        const result = await processOrderRefund(adminSupabase, orderId);
        if (!result.success) return errorResponse(result.error || "Refund failed");
        return respond({ refunded: true });
      }

      return respond({ acknowledged: true });
    }

    // ============================================================
    // ADMIN ROUTES
    // ============================================================

    // ROUTE: GET /shop/admin/orders - List all orders
    if (action === "admin" && subAction === "orders" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId || !(await hasRole(userId, "admin"))) {
        return errorResponse("Forbidden", 403);
      }

      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 100);
      const status = url.searchParams.get("status");
      const impact = url.searchParams.get("impact_destination");
      const offset = (page - 1) * limit;

      let query = adminSupabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) query = query.eq("status", status);
      if (impact) query = query.eq("impact_destination", impact);

      const { data, count, error } = await query;
      if (error) throw error;

      return respond(data || [], {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      });
    }

    // ROUTE: GET /shop/admin/impact - Impact summary
    if (action === "admin" && subAction === "impact" && req.method === "GET") {
      const userId = await requireAuth();
      if (!userId || !(await hasRole(userId, "admin"))) {
        return errorResponse("Forbidden", 403);
      }

      const { data: orders } = await adminSupabase
        .from("orders")
        .select("total_usd, fx_markup_amount, impact_destination, status")
        .eq("status", "PAID");

      const summary = {
        total_raised_usd: 0,
        total_fx_markup_usd: 0,
        total_orders: orders?.length || 0,
        by_destination: {} as Record<string, { total_usd: number; count: number }>,
      };

      orders?.forEach((order) => {
        summary.total_raised_usd += order.total_usd || 0;
        summary.total_fx_markup_usd += order.fx_markup_amount || 0;
        
        const dest = order.impact_destination || "EDUAID_AFRICA";
        if (!summary.by_destination[dest]) {
          summary.by_destination[dest] = { total_usd: 0, count: 0 };
        }
        summary.by_destination[dest].total_usd += order.total_usd || 0;
        summary.by_destination[dest].count += 1;
      });

      return respond(summary);
    }

    // ROUTE: POST /shop/admin/orders/:id/refund - Admin refund order
    if (action === "admin" && subAction === "orders" && resourceId && url.pathname.endsWith("/refund") && req.method === "POST") {
      const userId = await requireAuth();
      if (!userId || !(await hasRole(userId, "admin"))) {
        return errorResponse("Forbidden", 403);
      }

      const result = await processOrderRefund(adminSupabase, resourceId);
      if (!result.success) return errorResponse(result.error || "Refund failed");

      return respond({ refunded: true, order_id: resourceId });
    }

    return errorResponse("Not found", 404);
  } catch (error) {
    console.error("Shop function error:", error);
    return errorResponse(error instanceof Error ? error.message : "Internal error", 500);
  }
});
