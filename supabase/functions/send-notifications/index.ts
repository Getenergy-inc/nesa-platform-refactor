// Email dispatcher — drains queued rows from public.notifications via Resend.
//
// Safe when unconfigured: if RESEND_API_KEY is absent it sends nothing and
// simply reports how many emails are waiting, so the rest of the pipeline can
// go live before email delivery is switched on.
//
// Trigger options:
//   - Manually / from an admin button (POST).
//   - On a schedule via Supabase cron (pg_cron -> net.http_post) or an external
//     scheduler hitting this endpoint every minute.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const BRAND = "#C6A24A"; // NESA gold

function shell(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;background:#0f0f0f;font-family:Georgia,serif;color:#eee;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden">
      <div style="padding:20px 28px;border-bottom:1px solid #2a2a2a">
        <span style="color:${BRAND};font-size:20px;font-weight:bold">NESA-Africa</span>
        <span style="color:#888;font-size:13px"> · The African Blue Garnet Awards for Education</span>
      </div>
      <div style="padding:28px;line-height:1.6;font-size:15px">
        <h1 style="color:${BRAND};font-size:20px;margin:0 0 16px">${title}</h1>
        ${inner}
      </div>
      <div style="padding:16px 28px;border-top:1px solid #2a2a2a;color:#666;font-size:12px">
        You are receiving this because you or someone acting on behalf of NESA-Africa referenced your email in a nomination.
      </div>
    </div>
  </body></html>`;
}

function button(url: string, label: string, color: string): string {
  return `<a href="${url}" style="display:inline-block;padding:12px 22px;margin:6px 8px 6px 0;border-radius:8px;background:${color};color:#111;text-decoration:none;font-weight:bold">${label}</a>`;
}

// deno-lint-ignore no-explicit-any
function render(template: string, subject: string, payload: any): { subject: string; html: string } {
  const p = payload ?? {};
  switch (template) {
    case "acceptance_letter":
      return {
        subject: subject || "You have been nominated for NESA-Africa 2026",
        html: shell(
          `Congratulations, ${p.nominee_name ?? "Nominee"}!`,
          `<p>You have been nominated for the <strong>NESA-Africa 2026 Awards</strong>. To confirm your nomination, complete your profile, and accept the recognition terms, please choose an option below:</p>
           <p>${button(p.accept_url ?? "#", "Accept nomination", BRAND)} ${button(p.decline_url ?? "#", "Decline", "#444")}</p>
           <p style="color:#999;font-size:13px">This link expires in 14 days. If the buttons do not work, copy this link into your browser:<br>${p.accept_url ?? ""}</p>`,
        ),
      };
    case "nomination_received":
      return {
        subject: subject || "Nomination received",
        html: shell(
          "Thank you — your nomination was received",
          `<p>Dear ${p.nominator_name ?? "Nominator"},</p>
           <p>We have received your nomination of <strong>${p.nominee_name ?? ""}</strong>. Our Nomination Review Committee will verify the entry over the coming days. You will be notified of any updates.</p>
           <p style="color:#999;font-size:13px">Category: ${p.award_category_slug ?? "—"} · Family: ${p.award_family ?? "—"}</p>`,
        ),
      };
    default:
      return {
        subject: subject || "NESA-Africa notification",
        html: shell("NESA-Africa", `<p>${JSON.stringify(p)}</p>`),
      };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Pull a batch of queued email notifications.
  const { data: queued, error } = await supabase
    .from("notifications")
    .select("id, template, subject, payload, recipient_email, channels, retry_count")
    .eq("status", "queued")
    .contains("channels", ["email"])
    .not("recipient_email", "is", null)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return json(500, { error: "Failed to read notifications", details: error.message });

  const pending = queued?.length ?? 0;

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const RESEND_FROM = Deno.env.get("RESEND_FROM") || "NESA-Africa <nominations@nesa.africa>";

  if (!RESEND_API_KEY) {
    return json(200, {
      ok: false,
      reason: "RESEND_API_KEY not configured — emails left queued.",
      pending,
    });
  }

  let sent = 0;
  let failed = 0;

  for (const n of queued ?? []) {
    const { subject, html } = render(n.template, n.subject, n.payload);
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [n.recipient_email],
          subject,
          html,
        }),
      });

      if (res.ok) {
        await supabase
          .from("notifications")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", n.id);
        sent++;
      } else {
        const body = await res.text();
        console.error(`Resend failed for ${n.id}:`, res.status, body);
        await supabase
          .from("notifications")
          .update({ status: "failed", retry_count: (n.retry_count ?? 0) + 1 })
          .eq("id", n.id);
        failed++;
      }
    } catch (e) {
      console.error(`Send error for ${n.id}:`, e);
      await supabase
        .from("notifications")
        .update({ status: "failed", retry_count: (n.retry_count ?? 0) + 1 })
        .eq("id", n.id);
      failed++;
    }
  }

  return json(200, { ok: true, pending, sent, failed });
});
