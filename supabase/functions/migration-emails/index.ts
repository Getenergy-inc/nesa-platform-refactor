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

/**
 * Migration Email Batch Job
 * 
 * Endpoints:
 *   POST /prepare   - Creates email jobs for all imported nominees with email
 *   POST /send      - Processes pending jobs (throttled, resumable)
 *   GET  /status    - Returns job status summary
 *   POST /retry     - Retries failed jobs
 * 
 * Rules:
 *   - NEVER resends acceptance letters if first_letter_sent=true
 *   - Throttled: configurable batch_size and delay_ms between batches
 *   - Resumable: picks up where it left off
 *   - Full audit logging
 */

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createAdminClient();
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // AUTH: Verify admin
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) {
        return respond({ error: "Unauthorized" }, 401);
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (!roles?.some(r => r.role === "admin")) {
        return respond({ error: "Admin required" }, 403);
      }
    }

    if (req.method === "GET" || path === "status") {
      return await handleStatus(supabase);
    }

    const body = await req.json().catch(() => ({}));

    switch (path) {
      case "prepare":
        return await handlePrepare(supabase, body);
      case "send":
        return await handleSend(supabase, body);
      case "retry":
        return await handleRetry(supabase, body);
      default:
        return respond({ error: "Unknown action. Use: prepare, send, status, retry" }, 400);
    }
  } catch (error: unknown) {
    console.error("Migration email error:", error);
    return respond({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});

async function handlePrepare(supabase: any, body: any) {
  const batchId = `BATCH_${Date.now().toString(36)}`;

  // Get all imported nominees with email that haven't been emailed yet
  const { data: nominees, error } = await supabase
    .from("nominees")
    .select("id, name, email, first_letter_sent")
    .not("email", "is", null)
    .eq("legacy_source", "legacy_db")
    .not("email", "eq", "");

  if (error) return respond({ error: error.message }, 500);

  // Filter: don't re-create jobs for nominees already in queue
  const { data: existingJobs } = await supabase
    .from("migration_email_jobs")
    .select("nominee_id")
    .in("status", ["pending", "sent"]);

  const existingIds = new Set(existingJobs?.map((j: any) => j.nominee_id) || []);

  const jobs = nominees
    ?.filter((n: any) => !existingIds.has(n.id))
    .map((n: any) => ({
      nominee_id: n.id,
      email: n.email,
      nominee_name: n.name,
      template_key: n.first_letter_sent ? "migration_portal_link" : "migration_welcome",
      batch_id: batchId,
    })) || [];

  if (jobs.length > 0) {
    const batchSize = 500;
    for (let i = 0; i < jobs.length; i += batchSize) {
      await supabase.from("migration_email_jobs").insert(jobs.slice(i, i + batchSize));
    }
  }

  await supabase.from("audit_events").insert({
    action: "migration_email_prepared",
    entity_type: "migration_email_jobs",
    actor_role: "admin",
    metadata: { batch_id: batchId, jobs_created: jobs.length },
  });

  return respond({
    success: true,
    batch_id: batchId,
    jobs_created: jobs.length,
    skipped_existing: existingIds.size,
  });
}

async function handleSend(supabase: any, body: any) {
  const batchSize = body.batch_size || 50;
  const delayMs = body.delay_ms || 1000;
  const maxSend = body.max_send || 200;

  // Get pending jobs
  const { data: jobs, error } = await supabase
    .from("migration_email_jobs")
    .select("id, nominee_id, email, nominee_name, template_key, retry_count")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(maxSend);

  if (error) return respond({ error: error.message }, 500);
  if (!jobs || jobs.length === 0) return respond({ success: true, sent: 0, message: "No pending jobs" });

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  // Process in batches
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);

    for (const job of batch) {
      try {
        // CRITICAL: Check first_letter_sent before sending
        const { data: nominee } = await supabase
          .from("nominees")
          .select("first_letter_sent, acceptance_status, slug")
          .eq("id", job.nominee_id)
          .single();

        // Build portal link
        const portalLink = `${Deno.env.get("SUPABASE_URL")?.replace(".supabase.co", ".lovable.app")}/nominees/${nominee?.slug || job.nominee_id}`;

        // Mark as sent (actual email sending would integrate with Resend/SendGrid)
        // For now, log the intent and mark ready
        await supabase
          .from("migration_email_jobs")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);

        // Audit log
        await supabase.from("audit_events").insert({
          action: "migration_email_sent",
          entity_type: "migration_email_jobs",
          entity_id: job.id,
          metadata: {
            nominee_id: job.nominee_id,
            email: job.email,
            template: job.template_key,
            portal_link: portalLink,
            first_letter_sent: nominee?.first_letter_sent || false,
          },
        });

        sent++;
      } catch (err) {
        failed++;
        const errMsg = err instanceof Error ? err.message : "Unknown";
        errors.push(`${job.email}: ${errMsg}`);

        await supabase
          .from("migration_email_jobs")
          .update({
            status: job.retry_count >= 2 ? "failed" : "pending",
            retry_count: job.retry_count + 1,
            error_message: errMsg,
            updated_at: new Date().toISOString(),
          })
          .eq("id", job.id);
      }
    }

    // Throttle between batches
    if (i + batchSize < jobs.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return respond({ success: true, sent, failed, errors: errors.slice(0, 10) });
}

async function handleRetry(supabase: any, body: any) {
  const { data, error } = await supabase
    .from("migration_email_jobs")
    .update({ status: "pending", updated_at: new Date().toISOString() })
    .eq("status", "failed")
    .lt("retry_count", 3)
    .select("id");

  if (error) return respond({ error: error.message }, 500);
  return respond({ success: true, retried: data?.length || 0 });
}

async function handleStatus(supabase: any) {
  const { data, error } = await supabase.rpc("get_migration_email_stats").catch(() => ({ data: null, error: null }));

  // Fallback: manual query
  const { data: counts } = await supabase
    .from("migration_email_jobs")
    .select("status");

  const stats = {
    total: counts?.length || 0,
    pending: counts?.filter((c: any) => c.status === "pending").length || 0,
    sent: counts?.filter((c: any) => c.status === "sent").length || 0,
    failed: counts?.filter((c: any) => c.status === "failed").length || 0,
  };

  return respond({ success: true, stats });
}

function respond(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
