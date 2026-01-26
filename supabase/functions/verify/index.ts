import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname.replace("/verify", "");

    // ===========================================
    // GET /verify/:hash - Public certificate verification
    // ===========================================
    if (req.method === "GET" && path.length > 1) {
      const hash = path.slice(1); // Remove leading /

      if (!hash || hash.length < 6) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid verification code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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

      if (!cert) {
        // Log failed verification attempt
        await supabase.from("certificate_verifications").insert({
          certificate_id: null,
          verification_hash: hash,
          result: "NOT_FOUND",
          verifier_ip: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip"),
          verifier_user_agent: req.headers.get("user-agent"),
        });

        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: "Certificate not found",
            status: "NOT_FOUND"
          }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Determine certificate validity
      const isRevoked = cert.status === "REVOKED";
      const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date() && !cert.is_lifetime;
      const isValid = !isRevoked && !isExpired;
      
      let resultStatus = "VALID";
      if (isRevoked) resultStatus = "REVOKED";
      else if (isExpired) resultStatus = "EXPIRED";

      // Log verification attempt
      await supabase.from("certificate_verifications").insert({
        certificate_id: cert.id,
        verification_hash: hash,
        result: resultStatus,
        verifier_ip: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip"),
        verifier_user_agent: req.headers.get("user-agent"),
      });

      return new Response(
        JSON.stringify({
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
        nominee: cert.nominees ? {
          id: (cert.nominees as any).id,
          name: (cert.nominees as any).name,
          slug: (cert.nominees as any).slug,
          title: (cert.nominees as any).title,
          organization: (cert.nominees as any).organization,
          photoUrl: (cert.nominees as any).photo_url,
        } : null,
        season: cert.seasons ? {
          id: (cert.seasons as any).id,
          name: (cert.seasons as any).name,
          year: (cert.seasons as any).year,
        } : null,
        issuer: "NESA-Africa",
        year: (cert.seasons as any)?.year || new Date(cert.issued_at).getFullYear(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===========================================
    // POST /verify/misuse-report - Report certificate misuse
    // ===========================================
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
        return new Response(
          JSON.stringify({ error: "Reason is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
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
        return new Response(
          JSON.stringify({ error: "Certificate not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get optional auth
      let reporterUserId = null;
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabase.auth.getUser(token);
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

      // Log the report
      await supabase.from("audit_events").insert({
        actor_id: reporterUserId,
        action: "misuse_reported",
        entity_type: "certificate",
        entity_id: certId,
        metadata: { 
          report_id: report.id,
          reason: reason.trim().slice(0, 100)
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          report_id: report.id,
          message: "Misuse report submitted successfully. Our team will review it.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Verify API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
