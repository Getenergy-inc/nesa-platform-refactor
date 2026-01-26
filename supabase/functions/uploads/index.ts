import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "video/mp4",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";

    // Require auth for all upload operations
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const userId = claimsData.claims.sub;

    // Route handling
    switch (action) {
      case "evidence": {
        const subAction = pathParts[2];

        // POST /uploads/evidence/init - Generate signed upload URL
        if (subAction === "init" && req.method === "POST") {
          const body = await req.json();
          const { filename, mimeType, size } = body;

          // Validate inputs
          if (!filename || !mimeType || !size) {
            return new Response(
              JSON.stringify({ error: "filename, mimeType, and size are required" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Validate file type
          if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return new Response(
              JSON.stringify({ 
                error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF, MP4",
                allowedTypes: ALLOWED_MIME_TYPES,
              }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Validate file size
          if (size > MAX_FILE_SIZE) {
            return new Response(
              JSON.stringify({ 
                error: "File too large. Maximum size is 10MB",
                maxSize: MAX_FILE_SIZE,
              }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // Generate unique file path
          const timestamp = Date.now();
          const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
          const filePath = `${userId}/${timestamp}-${sanitizedFilename}`;

          // Create signed upload URL
          const { data, error } = await supabase.storage
            .from("nomination-evidence")
            .createSignedUploadUrl(filePath);

          if (error) throw error;

          return new Response(
            JSON.stringify({
              uploadUrl: data.signedUrl,
              token: data.token,
              filePath,
              publicUrl: `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/nomination-evidence/${filePath}`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // GET /uploads/evidence/:fileId - Get file metadata
        if (req.method === "GET" && pathParts[2]) {
          const filePath = decodeURIComponent(pathParts.slice(2).join("/"));
          
          // Check if user owns the file
          if (!filePath.startsWith(userId)) {
            return new Response(
              JSON.stringify({ error: "Forbidden" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const { data, error } = await supabase.storage
            .from("nomination-evidence")
            .list(userId, { search: filePath.replace(`${userId}/`, "") });

          if (error) throw error;

          return new Response(
            JSON.stringify({ files: data || [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        break;
      }

      case "avatar": {
        // POST /uploads/avatar/init - Avatar upload
        if (pathParts[2] === "init" && req.method === "POST") {
          const body = await req.json();
          const { filename, mimeType, size } = body;

          // Only allow images for avatars
          const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
          if (!allowedAvatarTypes.includes(mimeType)) {
            return new Response(
              JSON.stringify({ error: "Avatars must be JPEG, PNG, or WebP images" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          // 2MB limit for avatars
          if (size > 2 * 1024 * 1024) {
            return new Response(
              JSON.stringify({ error: "Avatar must be under 2MB" }),
              { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          const ext = filename.split(".").pop() || "jpg";
          const filePath = `${userId}/avatar.${ext}`;

          const { data, error } = await supabase.storage
            .from("avatars")
            .createSignedUploadUrl(filePath, { upsert: true });

          if (error) {
            // Bucket might not exist, return helpful error
            return new Response(
              JSON.stringify({ error: "Avatar storage not configured" }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }

          return new Response(
            JSON.stringify({
              uploadUrl: data.signedUrl,
              token: data.token,
              filePath,
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
    console.error("Uploads function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
