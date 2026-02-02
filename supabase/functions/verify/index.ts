/**
 * Verify Edge Function
 * 
 * Handles certificate verification and misuse reporting.
 * 
 * Endpoints:
 *   GET  /verify/:hash       - Public certificate verification
 *   POST /verify/misuse-report - Report certificate misuse
 */

import {
  corsHeaders,
  handleCorsPreflightRequest,
  ok,
  err,
  createAdminClient,
  getAuthUser,
} from "../_shared/index.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const supabase = createAdminClient();
    const url = new URL(req.url);
    const path = url.pathname.replace("/verify", "");

    // ============================================================
    // GET /verify/:hash - Public certificate verification
    // ============================================================
    if (req.method === "GET" && path.length > 1) {
      const hash = path.slice(1); // Remove leading /

      if (!hash || hash.length < 6) {
        return err("Invalid verification code", 400);
      }

      // Try to find by verification_code or verification_hash
      const { data: cert, error } = await supabase
        .from("certificates")
        .select(`
          id, tier, verification_code, verification_hash, serial_number, 
          issued_at, expires_at, is_lifetime, status, download_locked, qr_url,
          nominees(id, name, slug, title, organization, photo_url, acceptance_status),
          seasons(id, name, year)
        `)
        .or(`verification_code.eq.${hash},verification_hash.eq.${hash}`)
        .maybeSingle();

      if (error) throw error;

      // Log verification attempt
      const verifierIp = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip");
      const verifierUserAgent = req.headers.get("user-agent");

      if (!cert) {
        await supabase.from("certificate_verifications").insert({
          certificate_id: null,
          verification_hash: hash,
          result: "NOT_FOUND",
          verifier_ip: verifierIp,
          verifier_user_agent: verifierUserAgent,
        });

        return ok({ valid: false, error: "Certificate not found", status: "NOT_FOUND" }, undefined, 404);
      }

      // Determine certificate validity
      const isRevoked = cert.status === "REVOKED";
      const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date() && !cert.is_lifetime;
      const isValid = !isRevoked && !isExpired;

      let resultStatus = "VALID";
      if (isRevoked) resultStatus = "REVOKED";
      else if (isExpired) resultStatus = "EXPIRED";

      await supabase.from("certificate_verifications").insert({
        certificate_id: cert.id,
        verification_hash: hash,
        result: resultStatus,
        verifier_ip: verifierIp,
        verifier_user_agent: verifierUserAgent,
      });

      // Extract related data (Supabase returns objects for single relations)
      const nominee = cert.nominees as unknown as Record<string, unknown> | null;
      const season = cert.seasons as unknown as Record<string, unknown> | null;

      return ok({
        valid: isValid,
        status: resultStatus,
        certificate: {
          id: cert.id,
          tier: cert.tier,
          serialNumber: cert.serial_number,
          verificationCode: cert.verification_code,
          issuedAt: cert.issued_at,
          expiresAt: cert.expires_at,
          isLifetime: cert.is_lifetime,
          isExpired,
          isRevoked,
          downloadLocked: cert.download_locked,
        },
        nominee: nominee ? {
          id: nominee.id,
          name: nominee.name,
          slug: nominee.slug,
          title: nominee.title,
          organization: nominee.organization,
          photoUrl: nominee.photo_url,
        } : null,
        season: season ? {
          id: season.id,
          name: season.name,
          year: season.year,
        } : null,
        issuer: "NESA-Africa",
        year: (season?.year as number) || new Date(cert.issued_at).getFullYear(),
      });
    }

    // ============================================================
    // POST /verify/misuse-report - Report certificate misuse
    // ============================================================
    if (req.method === "POST" && path === "/misuse-report") {
      const { 
        certificate_id, 
        verification_hash, 
        reporter_name, 
        reporter_email, 
        reason,
        evidence_urls 
      } = await req.json();

      if (!reason?.trim()) {
        return err("Reason is required");
      }

      // Find certificate if only hash provided
      let certId = certificate_id;
      if (!certId && verification_hash) {
        const { data: cert } = await supabase
          .from("certificates")
          .select("id")
          .or(`verification_code.eq.${verification_hash},verification_hash.eq.${verification_hash}`)
          .maybeSingle();

        if (cert) certId = cert.id;
      }

      if (!certId) {
        return err("Certificate not found", 404);
      }

      // Get optional auth
      let reporterUserId = null;
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const userSupabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data: userData } = await userSupabase.auth.getUser();
        if (userData?.user) reporterUserId = userData.user.id;
      }

      // Create misuse report
      const { data: report, error: reportError } = await supabase
        .from("misuse_reports")
        .insert({
          certificate_id: certId,
          verification_hash: verification_hash || null,
          reporter_name: reporter_name || null,
          reporter_email: reporter_email || null,
          reporter_user_id: reporterUserId,
          reason: reason.trim(),
          evidence_urls: evidence_urls || [],
          status: "PENDING",
        })
        .select("id")
        .single();

      if (reportError) throw reportError;

      // Audit log
      await supabase.from("audit_events").insert({
        actor_id: reporterUserId,
        action: "misuse_reported",
        entity_type: "certificate",
        entity_id: certId,
        metadata: { report_id: report.id, reason: reason.trim().slice(0, 100) },
      });

      return ok({
        success: true,
        report_id: report.id,
        message: "Misuse report submitted successfully. Our team will review it.",
      });
    }

    return err("Not found", 404);
  } catch (error: unknown) {
    console.error("Verify API error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return err(message, 500);
  }
});
