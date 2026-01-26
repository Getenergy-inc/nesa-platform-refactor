import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, // Use service role for webhook
      { auth: { persistSession: false } }
    );

    // Helper to get authenticated user
    const getAuthUser = async () => {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) return null;

      const userSupabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );

      const token = authHeader.replace("Bearer ", "");
      const { data, error } = await userSupabase.auth.getClaims(token);
      if (error || !data?.claims) return null;
      return data.claims.sub;
    };

    // Route handling
    switch (action) {
      case "init": {
        // POST /payments/init - Initialize payment
        if (req.method === "POST") {
          const userId = await getAuthUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const body = await req.json();
          const { amount, program, currency, metadata } = body;

          if (!amount || amount <= 0) {
            return new Response(
              JSON.stringify({ error: "Invalid amount" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Get user email
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("user_id", userId)
            .single();

          if (!profile) {
            return new Response(
              JSON.stringify({ error: "User profile not found" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Create pending transaction
          const { data: transaction, error: txError } = await supabase
            .from("transactions")
            .insert({
              user_id: userId,
              amount,
              currency: currency || "NGN",
              transaction_type: "donation",
              status: "pending",
              metadata: { program, ...metadata },
            })
            .select()
            .single();

          if (txError) throw txError;

          // Check if Paystack secret is configured
          const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
          
          if (!paystackSecret) {
            // Return mock payment URL for development
            return new Response(
              JSON.stringify({
                success: true,
                transaction_id: transaction.id,
                payment_url: null,
                message: "Payment gateway not configured. Transaction created in pending state.",
                development_mode: true,
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Initialize Paystack payment
          const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${paystackSecret}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profile.email,
              amount: Math.round(amount * 100), // Paystack uses kobo
              currency: currency || "NGN",
              reference: transaction.id,
              callback_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payments/callback`,
              metadata: {
                transaction_id: transaction.id,
                program,
                user_id: userId,
              },
            }),
          });

          const paystackData = await paystackResponse.json();

          if (!paystackData.status) {
            // Update transaction as failed
            await supabase
              .from("transactions")
              .update({ status: "failed" })
              .eq("id", transaction.id);

            return new Response(
              JSON.stringify({ error: paystackData.message || "Payment initialization failed" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Update transaction with provider reference
          await supabase
            .from("transactions")
            .update({ provider_reference: paystackData.data.reference })
            .eq("id", transaction.id);

          return new Response(
            JSON.stringify({
              success: true,
              transaction_id: transaction.id,
              payment_url: paystackData.data.authorization_url,
              reference: paystackData.data.reference,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "webhook": {
        // POST /payments/webhook/paystack - Handle Paystack webhook
        if (req.method === "POST" && pathParts[2] === "paystack") {
          const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
          
          // Verify webhook signature
          const signature = req.headers.get("x-paystack-signature");
          const body = await req.text();
          
          if (paystackSecret && signature) {
            const encoder = new TextEncoder();
            const key = await crypto.subtle.importKey(
              "raw",
              encoder.encode(paystackSecret),
              { name: "HMAC", hash: "SHA-512" },
              false,
              ["sign"]
            );
            const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
            const expectedSignature = Array.from(new Uint8Array(mac))
              .map(b => b.toString(16).padStart(2, "0"))
              .join("");

            if (signature !== expectedSignature) {
              return new Response(
                JSON.stringify({ error: "Invalid signature" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }

          const payload = JSON.parse(body);
          const { event, data } = payload;

          if (event === "charge.success") {
            const transactionId = data.reference;
            
            // Update transaction status
            const { error: updateError } = await supabase
              .from("transactions")
              .update({
                status: "confirmed",
                provider_reference: data.reference,
                receipt_url: data.receipt_url,
              })
              .eq("id", transactionId);

            if (updateError) {
              console.error("Failed to update transaction:", updateError);
            }

            // If it's a donation, also update donations table
            const { data: tx } = await supabase
              .from("transactions")
              .select("user_id, amount, currency, metadata")
              .eq("id", transactionId)
              .single();

            if (tx?.metadata?.program) {
              await supabase.from("donations").insert({
                user_id: tx.user_id,
                amount: tx.amount,
                currency: tx.currency,
                program: tx.metadata.program,
                donor_email: data.customer.email,
                status: "confirmed",
                payment_provider: "paystack",
                payment_reference: data.reference,
              });
            }

            // Audit log
            await supabase.from("audit_logs").insert({
              action: "payment_confirmed",
              entity_type: "transaction",
              entity_id: transactionId,
              new_values: { amount: data.amount / 100, reference: data.reference },
            });
          }

          return new Response(
            JSON.stringify({ received: true }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "transactions": {
        // GET /payments/transactions - Get user's transactions
        if (req.method === "GET") {
          const userId = await getAuthUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const limit = parseInt(url.searchParams.get("limit") || "50");
          const offset = parseInt(url.searchParams.get("offset") || "0");

          const { data, error, count } = await supabase
            .from("transactions")
            .select("*", { count: "exact" })
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

          if (error) throw error;

          return new Response(
            JSON.stringify({ transactions: data || [], total: count }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "balance": {
        // GET /payments/balance - Get user's AGC balance (derived from confirmed transactions)
        if (req.method === "GET") {
          const userId = await getAuthUser();
          if (!userId) {
            return new Response(
              JSON.stringify({ error: "Unauthorized" }),
              { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Calculate balance from confirmed donations
          // AGC conversion: 1 USD = 10 AGC, simple formula
          const { data: donations } = await supabase
            .from("donations")
            .select("amount, currency")
            .eq("user_id", userId)
            .eq("status", "confirmed");

          let totalAgc = 0;
          (donations || []).forEach(d => {
            // Simple conversion: assume 1 NGN = 0.01 AGC, 1 USD = 10 AGC
            if (d.currency === "USD") {
              totalAgc += d.amount * 10;
            } else if (d.currency === "NGN") {
              totalAgc += d.amount * 0.01;
            } else {
              totalAgc += d.amount * 5; // Default rate
            }
          });

          return new Response(
            JSON.stringify({ 
              balance: Math.round(totalAgc * 100) / 100,
              currency: "AGC",
            }),
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
    console.error("Payments function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
