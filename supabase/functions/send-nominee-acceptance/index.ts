// Send nominee acceptance invitation email via Resend.
// Mints (or reuses) an acceptance token, then emails the branded invitation.
// Input: { nominee_id: string, resend?: boolean }
// Auth: requires an authenticated admin/NRC user, or a valid service-role bearer token.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = Deno.env.get("PUBLIC_APP_URL") ?? "https://nesaafrica.lovable.app";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "NESA-Africa <noreply@nesaafrica.org>";

const PATHWAY_LABEL: Record<string, string> = {
  social_media: "Social Media Education Champion",
  sports: "Sports Icon Supporting Education",
  music: "Music Icon Supporting Education",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildEmailHtml(opts: {
  name: string;
  acceptUrl: string;
  pathway: string | null;
}) {
  const { name, acceptUrl, pathway } = opts;
  const pathwayLabel = pathway ? PATHWAY_LABEL[pathway] ?? null : null;
  const introTitle = pathwayLabel
    ? `You've been nominated as a ${pathwayLabel}`
    : "You've been nominated for NESA-Africa 2026";
  const noVotingNote = pathwayLabel
    ? `<p style="font-size:13px;color:#555;margin:16px 0 0 0;"><strong>There is no public voting for the Influencer Education Impact Award.</strong> Recognition is based on verified impact and governance approval.</p>`
    : "";

  return `<!doctype html><html><body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#111;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px 28px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:#f5c518;color:#111;font-weight:700;letter-spacing:1px;font-size:11px;">NESA-AFRICA 2026</div>
    </div>
    <h1 style="font-size:22px;margin:0 0 8px 0;color:#111;">Congratulations, ${name}!</h1>
    <p style="font-size:15px;line-height:1.55;color:#333;margin:0 0 16px 0;">${introTitle}. Please review your nomination and accept to activate your public profile and private dashboard.</p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${acceptUrl}" style="display:inline-block;background:#111;color:#f5c518;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:8px;">Accept my nomination</a>
    </div>
    <p style="font-size:13px;color:#555;margin:0 0 8px 0;">Or copy this secure link into your browser (single-use, expires in 30 days):</p>
    <p style="font-size:12px;color:#333;word-break:break-all;background:#f6f7f9;padding:10px;border-radius:6px;">${acceptUrl}</p>
    ${noVotingNote}
    <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
    <p style="font-size:12px;color:#888;margin:0;">If you didn't expect this email, you can safely ignore it.</p>
    <p style="font-size:12px;color:#888;margin:6px 0 0 0;">NESA-Africa · New Education Standard Award Africa</p>
  </div></body></html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
  const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_KEY) return json(500, { error: "RESEND_API_KEY not configured" });

  // Verify caller is admin (or NRC lead).
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json(401, { error: "Unauthorized" });

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userInfo } = await userClient.auth.getUser();
  const userId = userInfo?.user?.id;
  if (!userId) return json(401, { error: "Unauthorized" });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: roleRows } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const roles = (roleRows ?? []).map((r: any) => r.role);
  if (!roles.includes("admin") && !roles.includes("nrc")) {
    return json(403, { error: "Admin or NRC access required" });
  }

  let body: { nominee_id?: string; resend?: boolean };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }
  if (!body?.nominee_id) return json(400, { error: "nominee_id is required" });

  // Mint (or refresh) the acceptance token.
  const { data: tokenRows, error: tokenErr } = await admin.rpc("mint_acceptance_token", {
    p_nominee_id: body.nominee_id,
  });
  if (tokenErr || !tokenRows || !tokenRows[0]) {
    console.error("mint_acceptance_token failed", tokenErr);
    return json(500, { error: tokenErr?.message ?? "Failed to mint acceptance token" });
  }
  const { token, email, name } = tokenRows[0] as { token: string; email: string; name: string };

  const { data: nomineeRow } = await admin
    .from("nominees")
    .select("recognition_pathway")
    .eq("id", body.nominee_id)
    .maybeSingle();

  const acceptUrl = `${APP_URL}/nominee/accept/${token}`;
  const html = buildEmailHtml({
    name,
    acceptUrl,
    pathway: (nomineeRow?.recognition_pathway as string | null) ?? null,
  });

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: "Your NESA-Africa 2026 nomination — accept your invitation",
      html,
    }),
  });
  const resendBody = await resendRes.text();
  if (!resendRes.ok) {
    console.error("Resend send failed", resendRes.status, resendBody);
    return json(resendRes.status, { error: "Failed to send email", details: resendBody });
  }

  await admin.from("audit_events").insert({
    action: "acceptance_invitation_sent",
    entity_type: "nominee",
    entity_id: body.nominee_id,
    actor_id: userId,
    metadata: { email, resend: !!body.resend },
  });

  await admin
    .from("nominees")
    .update({ acceptance_status: "SENT", updated_at: new Date().toISOString() })
    .eq("id", body.nominee_id)
    .in("acceptance_status", ["PENDING", "SENT"]);

  return json(200, { success: true, email, accept_url: acceptUrl });
});
