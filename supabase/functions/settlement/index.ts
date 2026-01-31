import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SplitAllocation {
  target: string;
  mode: string;
  value: number;
  note?: string;
}

interface CurrencyBucket {
  currency: string;
  totalGross: number;
  totalFees: number;
  totalNet: number;
  gfaWzipMarkup: number;
  netAfterMarkup: number;
  payments: Array<{
    id: string;
    amount: number;
    fee: number;
    net: number;
    chapterId: string | null;
  }>;
}

// Default GFA Wzip markup percentage (2%)
const DEFAULT_GFA_WZIP_MARKUP = 0.02;

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Parse request body for manual trigger options
    let manualWindow: { start?: string; end?: string } | null = null;
    let dryRun = false;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        manualWindow = body.window || null;
        dryRun = body.dryRun || false;
      } catch {
        // No body or invalid JSON - use defaults
      }
    }

    // Fetch GFA Wzip markup percentage from platform config
    const { data: markupConfig } = await supabase
      .from("platform_config")
      .select("value")
      .eq("key", "gfa_wzip_markup_percent")
      .single();
    
    const gfaWzipMarkupPercent = markupConfig?.value 
      ? parseFloat(markupConfig.value) 
      : DEFAULT_GFA_WZIP_MARKUP;

    console.log(`[Settlement] GFA Wzip markup: ${gfaWzipMarkupPercent * 100}%`);

    // Calculate 24-hour window
    const now = new Date();
    const windowEnd = manualWindow?.end
      ? new Date(manualWindow.end)
      : new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
        );
    const windowStart = manualWindow?.start
      ? new Date(manualWindow.start)
      : new Date(windowEnd.getTime() - 24 * 60 * 60 * 1000);

    const idempotencyKey = `${windowStart.toISOString()}__${windowEnd.toISOString()}`;

    console.log(`[Settlement] Processing window: ${windowStart.toISOString()} to ${windowEnd.toISOString()}`);
    console.log(`[Settlement] Idempotency key: ${idempotencyKey}`);

    // Check for existing completed run with same idempotency key
    const { data: existingRun } = await supabase
      .from("settlement_runs")
      .select("id, status")
      .eq("idempotency_key", idempotencyKey)
      .single();

    if (existingRun?.status === "COMPLETED") {
      console.log(`[Settlement] Already completed for this window, skipping`);
      return new Response(
        JSON.stringify({
          ok: true,
          message: "Settlement already completed for this window",
          run_id: existingRun.id,
          skipped: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch split rules
    const { data: splitRule, error: splitError } = await supabase
      .from("settlement_split_rules")
      .select("allocations")
      .eq("scope", "DAILY_MASTER_SPLIT")
      .eq("is_enabled", true)
      .single();

    if (splitError || !splitRule) {
      throw new Error("Failed to fetch settlement split rules");
    }

    const allocations: SplitAllocation[] = splitRule.allocations as SplitAllocation[];

    // Validate allocations sum to 100%
    const totalPercent = allocations.reduce((sum, a) => sum + a.value, 0);
    if (Math.abs(totalPercent - 1.0) > 0.0001) {
      throw new Error(`Split allocations must sum to 100%, got ${totalPercent * 100}%`);
    }

    // Create or update settlement run
    let runId: string;
    if (existingRun) {
      runId = existingRun.id;
      await supabase
        .from("settlement_runs")
        .update({ status: "PROCESSING" })
        .eq("id", runId);
    } else {
      const { data: newRun, error: runError } = await supabase
        .from("settlement_runs")
        .insert({
          window_start: windowStart.toISOString(),
          window_end: windowEnd.toISOString(),
          idempotency_key: idempotencyKey,
          status: "PROCESSING",
        })
        .select("id")
        .single();

      if (runError || !newRun) {
        throw new Error(`Failed to create settlement run: ${runError?.message}`);
      }
      runId = newRun.id;
    }

    console.log(`[Settlement] Run ID: ${runId}`);

    // Fetch unsettled SUCCESS payments in window
    const { data: payments, error: paymentsError } = await supabase
      .from("payment_intents")
      .select("id, amount_usd, agc_amount, provider, processor_fee, chapter_id, metadata")
      .eq("status", "SUCCESS")
      .eq("is_settled", false)
      .gte("created_at", windowStart.toISOString())
      .lt("created_at", windowEnd.toISOString());

    if (paymentsError) {
      throw new Error(`Failed to fetch payments: ${paymentsError.message}`);
    }

    console.log(`[Settlement] Found ${payments?.length || 0} unsettled payments`);

    if (!payments || payments.length === 0) {
      // No payments to process
      await supabase
        .from("settlement_runs")
        .update({
          status: "COMPLETED",
          payments_processed: 0,
          totals_json: { currencies: [], message: "No payments to process" },
          completed_at: new Date().toISOString(),
        })
        .eq("id", runId);

      return new Response(
        JSON.stringify({
          ok: true,
          message: "No payments to settle in this window",
          run_id: runId,
          payments_processed: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Aggregate by currency (assuming USD for now, but structure supports multi-currency)
    const currencyBuckets: Map<string, CurrencyBucket> = new Map();

    for (const payment of payments) {
      const currency = "USD"; // All amounts are in USD currently
      const gross = Number(payment.amount_usd) || 0;
      const fee = Number(payment.processor_fee) || 0;
      const net = gross - fee;

      if (!currencyBuckets.has(currency)) {
        currencyBuckets.set(currency, {
          currency,
          totalGross: 0,
          totalFees: 0,
          totalNet: 0,
          gfaWzipMarkup: 0,
          netAfterMarkup: 0,
          payments: [],
        });
      }

      const bucket = currencyBuckets.get(currency)!;
      bucket.totalGross += gross;
      bucket.totalFees += fee;
      bucket.totalNet += net;
      bucket.payments.push({
        id: payment.id,
        amount: gross,
        fee,
        net,
        chapterId: payment.chapter_id,
      });
    }

    // Calculate GFA Wzip 2% markup for each currency bucket
    for (const [, bucket] of currencyBuckets) {
      bucket.gfaWzipMarkup = Math.round(bucket.totalNet * gfaWzipMarkupPercent * 100) / 100;
      bucket.netAfterMarkup = Math.round((bucket.totalNet - bucket.gfaWzipMarkup) * 100) / 100;
    }

    // Track chapter allocations for LOCAL_CHAPTER split
    const chapterAllocations: Map<string, number> = new Map();

    // Process each currency bucket
    const totalsJson: Record<string, unknown> = { currencies: [], gfa_wzip_markup_percent: gfaWzipMarkupPercent * 100 };
    const disbursementBatches: Array<{
      batchId: string;
      currency: string;
      transfers: Array<{
        fundKey: string;
        amount: number;
        percentage: number;
      }>;
    }> = [];

    for (const [currency, bucket] of currencyBuckets) {
      console.log(`[Settlement] Processing ${currency}: gross=${bucket.totalGross}, fees=${bucket.totalFees}, net=${bucket.totalNet}, gfaWzipMarkup=${bucket.gfaWzipMarkup}, netAfterMarkup=${bucket.netAfterMarkup}`);

      // Create disbursement batch
      const { data: batch, error: batchError } = await supabase
        .from("disbursement_batches")
        .insert({
          settlement_run_id: runId,
          currency,
          total_gross: bucket.totalGross,
          total_fees: bucket.totalFees,
          total_net: bucket.totalNet,
          status: "PENDING",
        })
        .select("id")
        .single();

      if (batchError || !batch) {
        throw new Error(`Failed to create disbursement batch: ${batchError?.message}`);
      }

      const transfers: Array<{ fundKey: string; amount: number; percentage: number }> = [];
      let allocatedTotal = 0;

      // FIRST: Create GFA Wzip 2% markup transfer (before all other splits)
      const gfaWzipAmount = bucket.gfaWzipMarkup;
      transfers.push({
        fundKey: "GFA_WZIP",
        amount: gfaWzipAmount,
        percentage: gfaWzipMarkupPercent * 100,
      });

      await supabase.from("disbursement_transfers").insert({
        disbursement_batch_id: batch.id,
        fund_account_key: "GFA_WZIP",
        amount: gfaWzipAmount,
        currency,
        percentage_applied: gfaWzipMarkupPercent * 100,
        status: "CREATED",
      });

      // THEN: Calculate splits on NET AFTER MARKUP
      const netForSplit = bucket.netAfterMarkup;

      for (let i = 0; i < allocations.length; i++) {
        const allocation = allocations[i];
        let amount = Math.round(netForSplit * allocation.value * 100) / 100;
        let fundKey = allocation.target.replace("FUND:", "");

        // Handle LOCAL_CHAPTER special case
        if (fundKey === "LOCAL_CHAPTER") {
          // Sum up chapter-specific allocations from payments (using net after markup proportion)
          const markupMultiplier = bucket.netAfterMarkup / bucket.totalNet;
          for (const payment of bucket.payments) {
            const adjustedNet = payment.net * markupMultiplier;
            const chapterShare = Math.round(adjustedNet * allocation.value * 100) / 100;
            const chapterKey = payment.chapterId
              ? `LOCAL_CHAPTER:${payment.chapterId}`
              : "LOCAL_CHAPTER:UNASSIGNED";
            
            chapterAllocations.set(
              chapterKey,
              (chapterAllocations.get(chapterKey) || 0) + chapterShare
            );
          }

          // Create transfers for each chapter
          for (const [chapterKey, chapterAmount] of chapterAllocations) {
            allocatedTotal += chapterAmount;
            transfers.push({
              fundKey: chapterKey,
              amount: chapterAmount,
              percentage: allocation.value * 100,
            });

            await supabase.from("disbursement_transfers").insert({
              disbursement_batch_id: batch.id,
              fund_account_key: chapterKey,
              amount: chapterAmount,
              currency,
              percentage_applied: allocation.value * 100,
              status: "CREATED",
            });
          }
        } else {
          // Adjust last non-chapter allocation to account for rounding
          if (i === allocations.length - 1 && fundKey !== "LOCAL_CHAPTER") {
            amount = Math.round((netForSplit - allocatedTotal) * 100) / 100;
          }

          allocatedTotal += amount;
          transfers.push({
            fundKey,
            amount,
            percentage: allocation.value * 100,
          });

          await supabase.from("disbursement_transfers").insert({
            disbursement_batch_id: batch.id,
            fund_account_key: fundKey,
            amount,
            currency,
            percentage_applied: allocation.value * 100,
            status: "CREATED",
          });
        }
      }

      disbursementBatches.push({
        batchId: batch.id,
        currency,
        transfers,
      });

      (totalsJson.currencies as Array<unknown>).push({
        currency,
        gross: bucket.totalGross,
        fees: bucket.totalFees,
        net: bucket.totalNet,
        gfa_wzip_markup: bucket.gfaWzipMarkup,
        net_after_markup: bucket.netAfterMarkup,
        allocations: transfers,
      });

      // Update batch status
      await supabase
        .from("disbursement_batches")
        .update({ status: "PROCESSING" })
        .eq("id", batch.id);
    }

    // Mark payments as settled (unless dry run)
    if (!dryRun) {
      const paymentIds = payments.map((p) => p.id);
      await supabase
        .from("payment_intents")
        .update({
          is_settled: true,
          settled_run_id: runId,
          settled_at: new Date().toISOString(),
        })
        .in("id", paymentIds);
    }

    // Complete settlement run
    await supabase
      .from("settlement_runs")
      .update({
        status: "COMPLETED",
        payments_processed: payments.length,
        totals_json: totalsJson,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    // Update all batch statuses to CONFIRMED
    for (const batch of disbursementBatches) {
      await supabase
        .from("disbursement_batches")
        .update({ status: "CONFIRMED" })
        .eq("id", batch.batchId);

      await supabase
        .from("disbursement_transfers")
        .update({ status: "CONFIRMED", confirmed_at: new Date().toISOString() })
        .eq("disbursement_batch_id", batch.batchId);
    }

    // Log audit event
    await supabase.from("audit_events").insert({
      action: "settlement_completed",
      entity_type: "settlement_run",
      entity_id: runId,
      metadata: {
        window_start: windowStart.toISOString(),
        window_end: windowEnd.toISOString(),
        payments_processed: payments.length,
        dry_run: dryRun,
      },
    });

    console.log(`[Settlement] Completed successfully. Processed ${payments.length} payments.`);

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Settlement completed successfully",
        run_id: runId,
        payments_processed: payments.length,
        totals: totalsJson,
        dry_run: dryRun,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Settlement] Error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
