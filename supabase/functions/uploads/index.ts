/**
 * Uploads Edge Function
 * 
 * Handles file uploads for nominations, avatars, and evidence.
 * 
 * Endpoints:
 *   POST /uploads/evidence/init - Generate signed upload URL for evidence
 *   GET  /uploads/evidence/:id  - Get evidence file metadata
 *   POST /uploads/avatar/init   - Generate signed upload URL for avatar
 */

import {
  corsHeaders,
  handleCorsPreflightRequest,
  ok,
  err,
  createUserClient,
  getAuthUser,
} from "../_shared/index.ts";

// Allowed MIME types for evidence uploads
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "video/mp4",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleCorsPreflightRequest();
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[1] || "";
    const subAction = pathParts[2] || "";

    const supabase = createUserClient(req);
    const userId = await getAuthUser(supabase, req);
    if (!userId) return err("Unauthorized", 401);

    // ============================================================
    // POST /uploads/evidence/init - Generate signed upload URL
    // ============================================================
    if (action === "evidence" && subAction === "init" && req.method === "POST") {
      const body = await req.json();
      const { filename, mimeType, size } = body;

      // Validate inputs
      if (!filename || !mimeType || !size) {
        return err("filename, mimeType, and size are required");
      }

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return err("Invalid file type. Allowed: JPEG, PNG, GIF, WebP, PDF, MP4");
      }

      // Validate file size
      if (size > MAX_FILE_SIZE) {
        return err("File too large. Maximum size is 10MB");
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

      return ok({
        uploadUrl: data.signedUrl,
        token: data.token,
        filePath,
        publicUrl: `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/nomination-evidence/${filePath}`,
      });
    }

    // ============================================================
    // GET /uploads/evidence/:fileId - Get file metadata
    // ============================================================
    if (action === "evidence" && req.method === "GET" && pathParts[2]) {
      const filePath = decodeURIComponent(pathParts.slice(2).join("/"));

      // Check if user owns the file
      if (!filePath.startsWith(userId)) {
        return err("Forbidden", 403);
      }

      const { data, error } = await supabase.storage
        .from("nomination-evidence")
        .list(userId, { search: filePath.replace(`${userId}/`, "") });

      if (error) throw error;
      return ok({ files: data || [] });
    }

    // ============================================================
    // POST /uploads/avatar/init - Avatar upload
    // ============================================================
    if (action === "avatar" && subAction === "init" && req.method === "POST") {
      const body = await req.json();
      const { filename, mimeType, size } = body;

      // Only allow images for avatars
      const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedAvatarTypes.includes(mimeType)) {
        return err("Avatars must be JPEG, PNG, or WebP images");
      }

      if (size > MAX_AVATAR_SIZE) {
        return err("Avatar must be under 2MB");
      }

      const ext = filename.split(".").pop() || "jpg";
      const filePath = `${userId}/avatar.${ext}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUploadUrl(filePath, { upsert: true });

      if (error) {
        return err("Avatar storage not configured", 500);
      }

      return ok({ uploadUrl: data.signedUrl, token: data.token, filePath });
    }

    return err("Not found", 404);
  } catch (error: unknown) {
    console.error("Uploads function error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return err(message, 500);
  }
});
