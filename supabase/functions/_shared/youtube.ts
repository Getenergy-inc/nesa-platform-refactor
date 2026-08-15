// Shared YouTube Data API v3 helpers for the NESA Africa TV pipeline.
//
// Secrets (server-side only, Project Settings → Secrets):
//   YOUTUBE_CLIENT_ID
//   YOUTUBE_CLIENT_SECRET
//   YOUTUBE_REFRESH_TOKEN
//
// Nothing here is ever exposed to the browser: edge functions only return
// booleans / secret NAMES, never values.

export const YOUTUBE_SECRET_NAMES = [
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
] as const;

export function missingYouTubeSecrets(): string[] {
  return YOUTUBE_SECRET_NAMES.filter((name) => !Deno.env.get(name));
}

export function isYouTubeConfigured(): boolean {
  return missingYouTubeSecrets().length === 0;
}

export const NOT_CONFIGURED_MESSAGE =
  "YouTube integration not configured. Add YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET and YOUTUBE_REFRESH_TOKEN in Project Settings → Secrets.";

export function notConfiguredPayload() {
  return {
    configured: false as const,
    error: "youtube_not_configured" as const,
    message: NOT_CONFIGURED_MESSAGE,
    missingSecrets: missingYouTubeSecrets(),
  };
}

// ---------------------------------------------------------------------------
// Token exchange: refresh token -> short-lived access token, cached in-memory
// for the life of the isolate (minus a 60s safety margin).
// ---------------------------------------------------------------------------

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(force = false): Promise<string> {
  if (!force && cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const missing = missingYouTubeSecrets();
  if (missing.length) throw new Error(NOT_CONFIGURED_MESSAGE);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("YOUTUBE_CLIENT_ID")!,
      client_secret: Deno.env.get("YOUTUBE_CLIENT_SECRET")!,
      refresh_token: Deno.env.get("YOUTUBE_REFRESH_TOKEN")!,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) {
    throw new Error(
      `OAuth token exchange failed (${res.status}): ${data.error_description ?? data.error ?? "unknown error"}`,
    );
  }
  cachedToken = {
    token: data.access_token as string,
    expiresAt: Date.now() + Number(data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

// ---------------------------------------------------------------------------
// Resumable upload (videos.insert)
// ---------------------------------------------------------------------------

export interface VideoMetadata {
  title: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus?: "unlisted" | "private" | "public";
}

export interface UploadResult {
  videoId: string;
  videoUrl: string;
}

export async function uploadVideo(file: Blob, meta: VideoMetadata): Promise<UploadResult> {
  const accessToken = await getAccessToken();
  const contentType = file.type || "video/mp4";

  // 1) open a resumable session
  const start = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": contentType,
        "X-Upload-Content-Length": String(file.size),
      },
      body: JSON.stringify({
        snippet: {
          title: meta.title.slice(0, 100),
          description: (meta.description ?? "").slice(0, 4900),
          tags: (meta.tags ?? []).slice(0, 15),
          categoryId: meta.categoryId ?? "27", // 27 = Education
        },
        status: {
          privacyStatus: meta.privacyStatus ?? "unlisted",
          selfDeclaredMadeForKids: false,
        },
      }),
    },
  );
  if (!start.ok) throw new Error(`Upload init failed (${start.status}): ${await start.text()}`);
  const sessionUrl = start.headers.get("location");
  if (!sessionUrl) throw new Error("Upload init returned no resumable session URL");

  // 2) send the media (single PUT — nominee/webinar clips are short)
  const put = await fetch(sessionUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType, "Content-Length": String(file.size) },
    body: file,
  });
  const result = await put.json().catch(() => ({}));
  if (!put.ok || !result.id) {
    throw new Error(`Upload failed (${put.status}): ${JSON.stringify(result)}`);
  }
  return { videoId: result.id as string, videoUrl: youtubeWatchUrl(result.id as string) };
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// Fetch a remote video (used when the caller supplies a URL rather than a
// storage path). Guards against absurd sizes and non-http(s) schemes.
export async function fetchRemoteVideo(url: string, maxBytes = 512 * 1024 * 1024): Promise<Blob> {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http(s) source URLs are supported");
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Source download failed (${res.status})`);
  const blob = await res.blob();
  if (blob.size > maxBytes) throw new Error("Source video exceeds the maximum supported size");
  return blob;
}
