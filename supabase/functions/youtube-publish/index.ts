// NESA Africa TV — nominee video publishing pipeline.
//
// Publishes an NRC-approved nominee video from the private `nominee-videos`
// storage bucket to the NESA Africa TV YouTube channel (Data API v3).
//
// Credentials are optional at build time: when they are missing the function
// responds 200 with { configured: false } so the UI can show a clear
// "YouTube publishing not yet configured" state instead of erroring.
//
// Required secrets (Project Settings → Secrets):
//   YOUTUBE_CLIENT_ID        OAuth 2.0 client ID (Web application)
//   YOUTUBE_CLIENT_SECRET    OAuth 2.0 client secret
//   YOUTUBE_REFRESH_TOKEN    Refresh token for the NESA Africa TV channel,
//                            scope https://www.googleapis.com/auth/youtube.upload
//   YOUTUBE_CHANNEL_ID       (optional) sanity check for the target channel

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const CLIENT_ID = Deno.env.get("YOUTUBE_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("YOUTUBE_CLIENT_SECRET");
const REFRESH_TOKEN = Deno.env.get("YOUTUBE_REFRESH_TOKEN");

const MISSING = [
  ["YOUTUBE_CLIENT_ID", CLIENT_ID],
  ["YOUTUBE_CLIENT_SECRET", CLIENT_SECRET],
  ["YOUTUBE_REFRESH_TOKEN", REFRESH_TOKEN],
]
  .filter(([, v]) => !v)
  .map(([k]) => k as string);

const NOT_CONFIGURED = {
  configured: false as const,
  state: "not_configured" as const,
  message:
    "YouTube publishing not yet configured. Videos stay safely stored and queued until credentials are added.",
  missingSecrets: MISSING,
};

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      refresh_token: REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth refresh failed: ${JSON.stringify(data)}`);
  return data.access_token as string;
}

async function uploadToYouTube(
  accessToken: string,
  file: Blob,
  meta: { title: string; description: string; tags: string[] },
): Promise<string> {
  // 1) Start a resumable upload session.
  const start = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": file.type || "video/mp4",
        "X-Upload-Content-Length": String(file.size),
      },
      body: JSON.stringify({
        snippet: {
          title: meta.title.slice(0, 100),
          description: meta.description.slice(0, 4900),
          tags: meta.tags.slice(0, 15),
          categoryId: "27", // Education
        },
        status: { privacyStatus: "unlisted", selfDeclaredMadeForKids: false },
      }),
    },
  );
  if (!start.ok) throw new Error(`Upload init failed: ${await start.text()}`);
  const uploadUrl = start.headers.get("location");
  if (!uploadUrl) throw new Error("Upload init returned no session URL");

  // 2) Send the media in a single request (nominee clips are short).
  const put = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "video/mp4" },
    body: file,
  });
  const result = await put.json();
  if (!put.ok) throw new Error(`Upload failed: ${JSON.stringify(result)}`);
  return result.id as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) return json({ error: "Authentication required" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    const user = userRes?.user;
    if (!user) return json({ error: "Authentication required" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: roles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const allowed = (roles ?? []).some((r: { role: string }) =>
      ["nrc", "admin"].includes(r.role)
    );
    if (!allowed) return json({ error: "Not authorised" }, 403);

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action ?? "status";

    // ---- status: how many videos are queued + whether creds exist -------
    if (action === "status") {
      const { count } = await admin
        .from("nominees")
        .select("id", { count: "exact", head: true })
        .eq("youtube_publish_state", "queued");
      return json({
        configured: MISSING.length === 0,
        missingSecrets: MISSING,
        queued: count ?? 0,
        message: MISSING.length === 0 ? "YouTube publishing is configured." : NOT_CONFIGURED.message,
      });
    }

    if (action !== "publish") return json({ error: "Unknown action" }, 400);
    if (MISSING.length > 0) return json(NOT_CONFIGURED, 200);

    // ---- publish: one nominee, or drain the queue (max 3 per call) -----
    let query = admin
      .from("nominees")
      .select("id,name,slug,bio,country,video_storage_path,award_slug,category_slug,classification_slug")
      .eq("youtube_publish_state", "queued")
      .not("video_storage_path", "is", null)
      .limit(3);
    if (body.nominee_id) query = admin
      .from("nominees")
      .select("id,name,slug,bio,country,video_storage_path,award_slug,category_slug,classification_slug")
      .eq("id", body.nominee_id)
      .limit(1);

    const { data: rows, error } = await query;
    if (error) throw error;
    if (!rows?.length) return json({ configured: true, published: [], message: "Nothing queued." });

    const accessToken = await getAccessToken();
    const published: Array<{ id: string; youtube_video_id?: string; error?: string }> = [];

    for (const n of rows) {
      try {
        if (!n.video_storage_path) throw new Error("No stored video for this nominee");
        const { data: file, error: dlErr } = await admin.storage
          .from("nominee-videos")
          .download(n.video_storage_path);
        if (dlErr || !file) throw new Error(`Video download failed: ${dlErr?.message}`);

        const videoId = await uploadToYouTube(accessToken, file, {
          title: `${n.name} — NESA-Africa 2026 Nominee Story`,
          description: [
            `${n.name}${n.country ? ` · ${n.country}` : ""}`,
            "",
            (n.bio ?? "").slice(0, 1200),
            "",
            `Profile: https://nesa.africa/nominees/${n.award_slug}/${n.category_slug}/${n.classification_slug}/${n.slug}`,
            "",
            "NESA-Africa 2026 · Enablers of Education for All Across Africa.",
          ].join("\n"),
          tags: ["NESA Africa", "Education", "NESA Africa 2026", n.country ?? "Africa"],
        });

        await admin
          .from("nominees")
          .update({
            youtube_video_id: videoId,
            youtube_publish_state: "published",
            youtube_published_at: new Date().toISOString(),
            youtube_publish_error: null,
          })
          .eq("id", n.id);
        published.push({ id: n.id, youtube_video_id: videoId });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        await admin
          .from("nominees")
          .update({ youtube_publish_state: "failed", youtube_publish_error: message })
          .eq("id", n.id);
        published.push({ id: n.id, error: message });
      }
    }

    return json({ configured: true, published });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("youtube-publish error:", message);
    return json({ error: message }, 500);
  }
});
