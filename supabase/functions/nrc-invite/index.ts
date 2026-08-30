// NRC invitation delivery.
//
// POST /nrc-invite
//   { email: string }              -> admin creates a fresh invitation and emails it
//   { applicationId: string, notes?: string }
//                                  -> approves an NRC application, mints an invitation, emails it
//   { invitationId: string }       -> re-sends an existing pending invitation
//
// Auth: caller must be signed in with the `admin` or `nrc` role (verified in code).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APP_URL = Deno.env.get("PUBLIC_APP_URL") ?? "https://nesaafrica.lovable.app";
const RESEND_FROM = Deno.env.get("RESEND_FROM") ?? "NESA-Africa <noreply@nesaafrica.org>";

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildHtml(redeemUrl: string, expiresAt: string, name?: string | null) {
  const greeting = name ? `Dear ${name},` : "Hello,";
  const expiry = new Date(expiresAt).toUTCString();
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#111;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px 28px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;padding:6px 14px;border-radius:999px;background:#f5c518;color:#111;font-weight:700;letter-spacing:1px;font-size:11px;">NESA-AFRICA 2026</div>
    </div>
    <h1 style="font-size:22px;margin:0 0 8px 0;">Invitation to join the Nominee Research Corps</h1>
    <p style="font-size:15px;line-height:1.55;color:#333;margin:0 0 16px 0;">${greeting}</p>
    <p style="font-size:15px;line-height:1.55;color:#333;margin:0 0 16px 0;">
      You have been invited to join the NESA-Africa Nominee Research Corps (NRC) — the independent
      body responsible for verifying nominee evidence ahead of judging. Use the secure link below to
      create your account and begin appointment onboarding.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${redeemUrl}" style="display:inline-block;background:#111;color:#f5c518;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:8px;">Accept NRC invitation</a>
    </div>
    <p style="font-size:13px;color:#555;margin:0 0 8px 0;">Or copy this single-use link into your browser. It expires on ${expiry}:</p>
    <p style="font-size:12px;color:#333;word-break:break-all;background:#f6f7f9;padding:10px;border-radius:6px;">${redeemUrl}</p>
    <p style="font-size:13px;color:#555;margin:16px 0 0 0;">
      The invitation is tied to this email address — you must register with the same address.
    </p>
    <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
    <p style="font-size:12px;color:#888;margin:0;">If you did not expect this email, you can safely ignore it.</p>
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
  if (!RESEND_KEY) return json(500, { error: "RESEND_API_KEY is not configured" });

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json(401, { error: "Unauthorized" });

  const admin = createClient(SUPABASE_URL, SERVICE_KEY);
  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userInfo } = await userClient.auth.getUser();
  const userId = userInfo?.user?.id;
  if (!userId) return json(401, { error: "Unauthorized" });

  const [{ data: isAdmin }, { data: isNrc }] = await Promise.all([
    admin.rpc("has_role", { _user_id: userId, _role: "admin" }),
    admin.rpc("has_role", { _user_id: userId, _role: "nrc" }),
  ]);
  if (!isAdmin && !isNrc) return json(403, { error: "NRC leadership access required" });

  let body: { email?: string; applicationId?: string; invitationId?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  let email: string | null = null;
  let token: string | null = null;
  let expiresAt: string | null = null;
  let fullName: string | null = null;

  if (body.applicationId) {
    // Approve the application; the RPC mints the invitation and audits the decision.
    const { data, error } = await userClient.rpc("approve_nrc_application", {
      p_application_id: body.applicationId,
      p_notes: body.notes ?? null,
    });
    if (error) return json(400, { error: error.message });
    const result = data as Record<string, unknown>;
    email = String(result.email);
    token = String(result.token);
    fullName = (result.full_name as string) ?? null;
    const { data: inv } = await admin
      .from("nrc_invitations")
      .select("expires_at")
      .eq("id", result.invitation_id as string)
      .maybeSingle();
    expiresAt = inv?.expires_at ?? null;
  } else if (body.invitationId) {
    const { data: inv, error } = await admin
      .from("nrc_invitations")
      .select("email, token, expires_at, status, accepted_at")
      .eq("id", body.invitationId)
      .maybeSingle();
    if (error || !inv) return json(404, { error: "Invitation not found" });
    if (inv.accepted_at || inv.status !== "pending") {
      return json(400, { error: "This invitation has already been used" });
    }
    if (new Date(inv.expires_at) < new Date()) {
      return json(400, { error: "This invitation has expired — issue a new one" });
    }
    email = inv.email;
    token = inv.token;
    expiresAt = inv.expires_at;
  } else if (body.email) {
    if (!isAdmin) return json(403, { error: "Admin access required to invite directly" });
    const clean = body.email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) {
      return json(400, { error: "A valid email address is required" });
    }

    const { count } = await admin
      .from("nrc_members")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "active"]);
    if ((count ?? 0) >= 30) return json(400, { error: "NRC member limit (30) reached" });

    const newToken = crypto.randomUUID().replace(/-/g, "");
    const exp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data: inv, error } = await admin
      .from("nrc_invitations")
      .insert({ email: clean, token: newToken, invited_by: userId, expires_at: exp })
      .select("id, email, token, expires_at")
      .single();
    if (error) return json(400, { error: error.message });

    email = inv.email;
    token = inv.token;
    expiresAt = inv.expires_at;

    await admin.from("audit_events").insert({
      actor_id: userId,
      actor_role: isAdmin ? "admin" : "nrc",
      action: "nrc_invite_sent",
      entity_type: "nrc_invitation",
      entity_id: inv.id,
      metadata: { email: clean },
    });
  } else {
    return json(400, { error: "Provide email, applicationId or invitationId" });
  }

  const redeemUrl = `${APP_URL}/nrc/redeem?token=${token}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [email],
      subject: "Your NESA-Africa NRC invitation",
      html: buildHtml(redeemUrl, expiresAt ?? new Date().toISOString(), fullName),
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Resend delivery failed", res.status, detail);
    return json(502, {
      error: "The invitation was created but the email could not be delivered",
      detail,
    });
  }

  return json(200, { success: true, email, expires_at: expiresAt });
});
