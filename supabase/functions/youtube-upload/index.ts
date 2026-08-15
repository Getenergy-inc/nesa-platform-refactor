// NESA Africa TV — generic YouTube upload endpoint.
//
// One endpoint, many entry points: admin bulk-upload tool, per-nominee
// publish trigger, webinar/podcast recording uploads, or any future caller.
// Every attempt is recorded in public.youtube_upload_jobs.
//
// Actions (POST JSON body):
//   { action: "status" }                      -> configuration + queue counters
//   { action: "upload", ... }                 -> upload one video
//   { action: "publish_queue", limit?: 3 }    -> drain nominees queued for publish
//   { action: "jobs", limit?: 25 }            -> recent job ledger
//
// Upload payload:
//   source: { type: "storage", bucket?: "nominee-videos", path: "..." }
//         | { type: "url", url: "https://..." }
//   metadata: { title, description?, tags?, categoryId?, privacyStatus? }
//   target?: { table: "nominees", id: "<uuid>" }
//   entryPoint?: "admin_bulk" | "nominee" | "webinar" | ...

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import {
  fetchRemoteVideo,
  isYouTubeConfigured,
  missingYouTubeSecrets,
  notConfiguredPayload,
  uploadVideo,
  youtubeWatchUrl,
  type VideoMetadata,
} from "../_shared/youtube.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const DEFAULT_BUCKET = "nominee-videos";

/** Tables the pipeline may write video links back to, and their column map. */
const LINK_TARGETS: Record<string, { videoId: string; videoUrl: string; extra?: Record<string, unknown> }> = {
  nominees: {
    videoId: "youtube_video_id",
    videoUrl: "video_url",
    extra: { youtube_publish_state: "published", youtube_publish_error: null },
  },
};

type Json = Record<string, unknown>;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

  try {
    // ---- auth: staff only -------------------------------------------------
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.replace("Bearer ", "")) return json({ error: "Authentication required" }, 401);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    const user = userRes?.user;
    if (!user) return json({ error: "Authentication required" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const allowed = (roles ?? []).some((r: { role: string }) => ["admin", "nrc"].includes(r.role));
    if (!allowed) return json({ error: "Not authorised" }, 403);

    const body: Json = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = (body.action as string) ?? "status";

    // ---- status -----------------------------------------------------------
    if (action === "status") {
      const [{ count: queued }, { count: failed }] = await Promise.all([
        admin.from("nominees").select("id", { count: "exact", head: true })
          .eq("youtube_publish_state", "queued"),
        admin.from("youtube_upload_jobs").select("id", { count: "exact", head: true })
          .eq("status", "failed"),
      ]);
      const configured = isYouTubeConfigured();
      return json({
        configured,
        missingSecrets: missingYouTubeSecrets(),
        queuedNominees: queued ?? 0,
        failedJobs: failed ?? 0,
        message: configured
          ? "YouTube integration is configured and ready."
          : notConfiguredPayload().message,
      });
    }

    // ---- job ledger -------------------------------------------------------
    if (action === "jobs") {
      const limit = Math.min(Number(body.limit ?? 25), 100);
      const { data, error } = await admin
        .from("youtube_upload_jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return json({ configured: isYouTubeConfigured(), jobs: data ?? [] });
    }

    // Every action beyond this point actually talks to Google.
    if (!isYouTubeConfigured()) return json(notConfiguredPayload(), 503);

    // ---- single upload ----------------------------------------------------
    if (action === "upload") {
      const result = await runUpload(admin, user.id, body);
      return json(result, result.ok ? 200 : 502);
    }

    // ---- drain the nominee publish queue ----------------------------------
    if (action === "publish_queue") {
      const limit = Math.min(Number(body.limit ?? 3), 10);
      const { data: rows, error } = await admin
        .from("nominees")
        .select("id,name,slug,bio,country,video_storage_path,award_slug,category_slug,classification_slug")
        .eq("youtube_publish_state", "queued")
        .not("video_storage_path", "is", null)
        .limit(limit);
      if (error) throw error;
      if (!rows?.length) return json({ configured: true, results: [], message: "Nothing queued." });

      const results = [];
      for (const n of rows) {
        const res = await runUpload(admin, user.id, {
          entryPoint: "nominee_queue",
          source: { type: "storage", bucket: DEFAULT_BUCKET, path: n.video_storage_path },
          target: { table: "nominees", id: n.id },
          metadata: {
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
          },
        });
        if (!res.ok) {
          await admin.from("nominees")
            .update({ youtube_publish_state: "failed", youtube_publish_error: res.message })
            .eq("id", n.id);
        }
        results.push({ nominee_id: n.id, ...res });
      }
      return json({ configured: true, results });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("youtube-upload error:", message);
    return json({ error: message }, 500);
  }
});

// ---------------------------------------------------------------------------

async function runUpload(
  admin: ReturnType<typeof createClient>,
  userId: string,
  body: Json,
): Promise<{ ok: boolean; jobId?: string; videoId?: string; videoUrl?: string; message?: string }> {
  const source = (body.source ?? {}) as Json;
  const meta = (body.metadata ?? {}) as Json;
  const target = (body.target ?? null) as { table?: string; id?: string } | null;

  const title = String(meta.title ?? "").trim();
  if (!title) return { ok: false, message: "metadata.title is required" };

  const sourceType = source.type === "url" ? "url" : "storage";
  const bucket = String(source.bucket ?? DEFAULT_BUCKET);
  const path = source.path ? String(source.path) : null;
  const url = source.url ? String(source.url) : null;
  if (sourceType === "storage" && !path) return { ok: false, message: "source.path is required" };
  if (sourceType === "url" && !url) return { ok: false, message: "source.url is required" };

  if (target?.table && !LINK_TARGETS[target.table]) {
    return { ok: false, message: `Unsupported link target table: ${target.table}` };
  }

  const privacyStatus = ["unlisted", "private", "public"].includes(String(meta.privacyStatus))
    ? (meta.privacyStatus as VideoMetadata["privacyStatus"])
    : "unlisted";

  const { data: job, error: jobErr } = await admin
    .from("youtube_upload_jobs")
    .insert({
      source_type: sourceType,
      source_bucket: sourceType === "storage" ? bucket : null,
      source_path: path,
      source_url: url,
      title,
      description: String(meta.description ?? ""),
      tags: Array.isArray(meta.tags) ? (meta.tags as string[]).map(String).slice(0, 15) : [],
      category_id: String(meta.categoryId ?? "27"),
      privacy_status: privacyStatus,
      target_table: target?.table ?? null,
      target_record_id: target?.id ?? null,
      entry_point: String(body.entryPoint ?? "api"),
      status: "uploading",
      created_by: userId,
    })
    .select("id")
    .single();
  if (jobErr) throw jobErr;
  const jobId = (job as { id: string }).id;

  try {
    let file: Blob;
    if (sourceType === "storage") {
      const { data, error } = await admin.storage.from(bucket).download(path!);
      if (error || !data) throw new Error(`Source download failed: ${error?.message ?? "not found"}`);
      file = data;
    } else {
      file = await fetchRemoteVideo(url!);
    }

    const { videoId, videoUrl } = await uploadVideo(file, {
      title,
      description: String(meta.description ?? ""),
      tags: Array.isArray(meta.tags) ? (meta.tags as string[]).map(String) : [],
      categoryId: String(meta.categoryId ?? "27"),
      privacyStatus,
    });

    if (target?.table && target.id) {
      const map = LINK_TARGETS[target.table];
      await admin
        .from(target.table)
        .update({
          [map.videoId]: videoId,
          [map.videoUrl]: youtubeWatchUrl(videoId),
          youtube_published_at: new Date().toISOString(),
          ...(map.extra ?? {}),
        })
        .eq("id", target.id);
    }

    await admin
      .from("youtube_upload_jobs")
      .update({ status: "succeeded", youtube_video_id: videoId, video_url: videoUrl, error: null })
      .eq("id", jobId);

    return { ok: true, jobId, videoId, videoUrl };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await admin.from("youtube_upload_jobs").update({ status: "failed", error: message }).eq("id", jobId);
    return { ok: false, jobId, message };
  }
}
