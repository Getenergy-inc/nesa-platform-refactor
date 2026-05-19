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
} from "../_shared/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// ---------- Server-side image validation ----------
const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MIN_DIM = 200;
const MAX_DIM = 6000;
const MIN_ASPECT = 0.4;
const MAX_ASPECT = 3.0;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

type Probed = { mime: string; width: number; height: number } | null;

function probeImage(buf: Uint8Array): Probed {
  if (buf.length < 32) return null;
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) return { mime: "image/jpeg", width: 0, height: 0 };
      const marker = buf[i + 1];
      i += 2;
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const height = (buf[i + 3] << 8) | buf[i + 4];
        const width = (buf[i + 5] << 8) | buf[i + 6];
        return { mime: "image/jpeg", width, height };
      }
      const segLen = (buf[i] << 8) | buf[i + 1];
      if (segLen < 2) break;
      i += segLen;
    }
    return { mime: "image/jpeg", width: 0, height: 0 };
  }
  // PNG
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    const width = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
    const height = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
    return { mime: "image/png", width, height };
  }
  // GIF
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    const width = buf[6] | (buf[7] << 8);
    const height = buf[8] | (buf[9] << 8);
    return { mime: "image/gif", width, height };
  }
  // WebP
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
    const fourcc = String.fromCharCode(buf[12], buf[13], buf[14], buf[15]);
    if (fourcc === "VP8X") {
      const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { mime: "image/webp", width, height };
    }
    if (fourcc === "VP8 ") {
      const width = ((buf[26] | (buf[27] << 8)) & 0x3fff);
      const height = ((buf[28] | (buf[29] << 8)) & 0x3fff);
      return { mime: "image/webp", width, height };
    }
    if (fourcc === "VP8L") {
      const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
      const width = 1 + (((b1 & 0x3f) << 8) | b0);
      const height = 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
      return { mime: "image/webp", width, height };
    }
    return { mime: "image/webp", width: 0, height: 0 };
  }
  return null;
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function qualityScore(width: number, height: number, mime: string, bytes: number): number {
  let s = 40;
  if (mime === "image/webp" || mime === "image/png") s += 15;
  else if (mime === "image/jpeg") s += 10;
  const minSide = Math.min(width, height);
  if (minSide >= 1024) s += 25;
  else if (minSide >= 600) s += 18;
  else if (minSide >= 400) s += 10;
  const aspect = width / Math.max(1, height);
  if (aspect >= 0.8 && aspect <= 1.6) s += 10;
  if (bytes < 50 * 1024) s -= 10;
  return Math.max(0, Math.min(100, s));
}

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
