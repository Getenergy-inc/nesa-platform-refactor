/**
 * Public judge application lookup handlers
 * These don't require authentication - they use admin client with restricted field selection
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

/**
 * Look up application status by email - returns only safe fields
 */
export async function handleStatusLookup(email: string): Promise<Response> {
  if (!email || typeof email !== "string") {
    return jsonResponse({ error: "Email is required" }, 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return jsonResponse({ error: "Invalid email format" }, 400);
  }

  const supabase = adminClient();

  const { data: app, error } = await supabase
    .from("judge_applications")
    .select("id, full_name, email, status, created_at, verified_at, approved_at, rejected_at, rejection_reason")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("Status lookup error:", error);
    return jsonResponse({ error: "Failed to look up application" }, 500);
  }

  if (!app) {
    return jsonResponse({ found: false });
  }

  return jsonResponse({
    found: true,
    application: {
      id: app.id,
      full_name: app.full_name,
      email: app.email,
      status: app.status,
      created_at: app.created_at,
      verified_at: app.verified_at,
      approved_at: app.approved_at,
      rejected_at: app.rejected_at,
      rejection_reason: app.rejection_reason,
    },
  });
}

/**
 * Verify email token - returns only safe fields, performs update
 */
export async function handleTokenVerify(token: string): Promise<Response> {
  if (!token || typeof token !== "string" || token.length < 10) {
    return jsonResponse({ error: "Invalid verification token" }, 400);
  }

  const supabase = adminClient();

  const { data: application, error: fetchError } = await supabase
    .from("judge_applications")
    .select("id, email, status, verification_token_expires_at")
    .eq("verification_token", token)
    .maybeSingle();

  if (fetchError) {
    console.error("Token verify error:", fetchError);
    return jsonResponse({ error: "Failed to verify token" }, 500);
  }

  if (!application) {
    return jsonResponse({ error: "Invalid or expired verification link" }, 404);
  }

  // Already verified
  if (application.status !== "submitted") {
    return jsonResponse({
      success: true,
      already_verified: true,
      email: application.email,
    });
  }

  // Check expiry
  if (application.verification_token_expires_at) {
    const expiresAt = new Date(application.verification_token_expires_at);
    if (expiresAt < new Date()) {
      return jsonResponse({ error: "Verification link has expired" }, 410);
    }
  }

  // Update status
  const { error: updateError } = await supabase
    .from("judge_applications")
    .update({
      status: "email_verified",
      verified_at: new Date().toISOString(),
    })
    .eq("id", application.id);

  if (updateError) {
    console.error("Token update error:", updateError);
    return jsonResponse({ error: "Failed to verify email" }, 500);
  }

  return jsonResponse({
    success: true,
    email: application.email,
  });
}
