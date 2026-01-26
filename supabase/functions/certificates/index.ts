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
    const path = url.pathname.replace("/certificates", "");

    // GET /certificates/verify/:code - Public verification endpoint
    if (req.method === "GET" && path.startsWith("/verify/")) {
      const code = path.replace("/verify/", "");

      if (!code || code.length < 6) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid verification code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: cert, error } = await supabase
        .from("certificates")
        .select(`
          *,
          nominees(id, name, slug, title, organization, photo_url),
          seasons(id, name, year)
        `)
        .eq("verification_code", code)
        .maybeSingle();

      if (error) throw error;

      if (!cert) {
        return new Response(
          JSON.stringify({ valid: false, error: "Certificate not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check expiry
      const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date();
      const isLifetime = cert.is_lifetime;

      return new Response(
        JSON.stringify({
          valid: !isExpired || isLifetime,
          certificate: {
            id: cert.id,
            tier: cert.tier,
            verificationCode: cert.verification_code,
            issuedAt: cert.issued_at,
            expiresAt: cert.expires_at,
            isLifetime: cert.is_lifetime,
            isExpired,
            nominee: cert.nominees,
            season: cert.seasons,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Auth required for other endpoints
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /certificates/me - Get user's certificates
    if (req.method === "GET" && (path === "" || path === "/" || path === "/me")) {
      // Get nominees associated with this user (as nominator)
      const { data: nominees } = await supabase
        .from("nominees")
        .select("id")
        .eq("nominator_user_id", userData.user.id);

      if (!nominees || nominees.length === 0) {
        return new Response(
          JSON.stringify({ data: [] }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const nomineeIds = nominees.map((n) => n.id);

      const { data: certs, error } = await supabase
        .from("certificates")
        .select(`
          *,
          nominees(id, name, slug, title, organization, photo_url),
          seasons(id, name, year)
        `)
        .in("nominee_id", nomineeIds)
        .order("issued_at", { ascending: false });

      if (error) throw error;

      return new Response(
        JSON.stringify({
          data: (certs || []).map((c: any) => ({
            id: c.id,
            tier: c.tier,
            verificationCode: c.verification_code,
            issuedAt: c.issued_at,
            expiresAt: c.expires_at,
            isLifetime: c.is_lifetime,
            downloadUrl: c.download_url,
            nominee: c.nominees,
            season: c.seasons,
          })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /certificates/issue - Admin only: Issue certificate
    if (req.method === "POST" && path === "/issue") {
      const { data: hasAdminRole } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });

      if (!hasAdminRole) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { nomineeId, tier, isLifetime } = await req.json();

      if (!nomineeId || !tier) {
        return new Response(
          JSON.stringify({ error: "nomineeId and tier required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get nominee season
      const { data: nominee } = await supabase
        .from("nominees")
        .select("season_id")
        .eq("id", nomineeId)
        .single();

      if (!nominee) {
        return new Response(
          JSON.stringify({ error: "Nominee not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate verification code
      const code = `NESA-${tier.toUpperCase().slice(0, 2)}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

      // Calculate expiry (1 year for non-lifetime)
      const expiresAt = isLifetime ? null : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      const { data: cert, error } = await supabase
        .from("certificates")
        .insert({
          nominee_id: nomineeId,
          season_id: nominee.season_id,
          tier,
          verification_code: code,
          is_lifetime: isLifetime || false,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      // Audit log
      await supabase.from("audit_logs").insert({
        action: "certificate_issued",
        entity_type: "certificate",
        entity_id: cert.id,
        user_id: userData.user.id,
        new_values: { nomineeId, tier, isLifetime },
      });

      return new Response(
        JSON.stringify({ success: true, certificate: cert }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /certificates/:id/renew - Renew expiring certificate
    if (req.method === "POST" && path.match(/^\/[a-f0-9-]+\/renew$/)) {
      const certId = path.split("/")[1];

      const { data: hasAdminRole } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });

      if (!hasAdminRole) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: cert } = await supabase
        .from("certificates")
        .select("*")
        .eq("id", certId)
        .single();

      if (!cert) {
        return new Response(
          JSON.stringify({ error: "Certificate not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (cert.is_lifetime) {
        return new Response(
          JSON.stringify({ error: "Lifetime certificates don't need renewal" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extend by 1 year from now
      const newExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      const { data: updated, error } = await supabase
        .from("certificates")
        .update({ expires_at: newExpiry })
        .eq("id", certId)
        .select()
        .single();

      if (error) throw error;

      // Audit log
      await supabase.from("audit_logs").insert({
        action: "certificate_renewed",
        entity_type: "certificate",
        entity_id: certId,
        user_id: userData.user.id,
        old_values: { expires_at: cert.expires_at },
        new_values: { expires_at: newExpiry },
      });

      return new Response(
        JSON.stringify({ success: true, certificate: updated }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Certificates API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
