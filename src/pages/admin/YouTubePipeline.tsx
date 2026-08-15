import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Loader2, Youtube } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StatusPayload {
  configured: boolean;
  missingSecrets?: string[];
  queuedNominees?: number;
  failedJobs?: number;
  message?: string;
}

interface JobRow {
  id: string;
  title: string;
  status: string;
  entry_point: string;
  video_url: string | null;
  youtube_video_id: string | null;
  error: string | null;
  created_at: string;
}

const FN = "youtube-upload";

/**
 * Admin control surface for the NESA Africa TV upload pipeline.
 * Shows configuration state honestly — no fake success while the three
 * YouTube secrets are still missing.
 */
export default function YouTubePipeline() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [busy, setBusy] = useState(false);

  // one-off upload form
  const [sourcePath, setSourcePath] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [nomineeId, setNomineeId] = useState("");

  const load = useCallback(async () => {
    const [s, j] = await Promise.all([
      supabase.functions.invoke(FN, { body: { action: "status" } }),
      supabase.functions.invoke(FN, { body: { action: "jobs", limit: 25 } }),
    ]);
    if (s.error) {
      setStatus({ configured: false, message: "Upload service unavailable." });
    } else {
      setStatus(s.data as StatusPayload);
    }
    if (!j.error) setJobs(((j.data as { jobs?: JobRow[] })?.jobs ?? []) as JobRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const invoke = async (body: Record<string, unknown>) => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke(FN, { body });
    setBusy(false);
    if (error) {
      toast.error("Request failed", { description: error.message });
      return null;
    }
    return data as Record<string, unknown>;
  };

  const drainQueue = async () => {
    const data = await invoke({ action: "publish_queue", limit: 3 });
    if (!data) return;
    if (data.configured === false) {
      toast.warning("YouTube integration not configured");
    } else {
      const results = (data.results ?? []) as Array<{ ok?: boolean }>;
      const failed = results.filter((r) => !r.ok).length;
      toast.success(`Uploaded ${results.length - failed} video(s)${failed ? `, ${failed} failed` : ""}`);
    }
    void load();
  };

  const uploadOne = async () => {
    if (!title.trim() || (!sourcePath.trim() && !sourceUrl.trim())) {
      toast.error("Provide a title and either a storage path or a source URL");
      return;
    }
    const data = await invoke({
      action: "upload",
      entryPoint: "admin_manual",
      source: sourceUrl.trim()
        ? { type: "url", url: sourceUrl.trim() }
        : { type: "storage", bucket: "nominee-videos", path: sourcePath.trim() },
      metadata: { title: title.trim(), description, privacyStatus: "unlisted" },
      target: nomineeId.trim() ? { table: "nominees", id: nomineeId.trim() } : undefined,
    });
    if (!data) return;
    if (data.ok) {
      toast.success("Uploaded", { description: String(data.videoUrl ?? "") });
      setTitle("");
      setDescription("");
      setSourcePath("");
      setSourceUrl("");
      setNomineeId("");
    } else {
      toast.error("Upload failed", { description: String(data.message ?? data.error ?? "") });
    }
    void load();
  };

  return (
    <div className="min-h-screen bg-charcoal px-4 py-10 text-white">
      <Helmet>
        <title>YouTube Pipeline · NESA-Africa Admin</title>
      </Helmet>
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-1">
          <h1 className="flex items-center gap-2 font-serif text-3xl text-gold">
            <Youtube className="h-7 w-7" /> NESA Africa TV upload pipeline
          </h1>
          <p className="text-sm text-white/70">
            Uploads go to the @Nesa.africaTV channel as <strong>unlisted</strong> until reviewed.
          </p>
        </header>

        {/* Configuration state */}
        <Card className="border-gold/20 bg-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              Integration status
              {status?.configured ? (
                <Badge className="bg-emerald-500/20 text-emerald-200">Ready</Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-200">Not configured</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/75">
            {status?.configured ? (
              <p className="flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> {status.message}
              </p>
            ) : (
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3">
                <p className="flex items-center gap-2 font-medium text-amber-200">
                  <AlertTriangle className="h-4 w-4" /> YouTube integration not configured
                </p>
                <p className="mt-1">Add these secrets in Project Settings → Secrets to go live:</p>
                <ul className="mt-2 list-disc pl-5 font-mono text-xs">
                  {(status?.missingSecrets ?? [
                    "YOUTUBE_CLIENT_ID",
                    "YOUTUBE_CLIENT_SECRET",
                    "YOUTUBE_REFRESH_TOKEN",
                  ]).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-xs text-white/60">
              <span>Nominee videos queued: {status?.queuedNominees ?? 0}</span>
              <span>Failed jobs: {status?.failedJobs ?? 0}</span>
            </div>
            <Button
              onClick={drainQueue}
              disabled={busy || !status?.configured}
              className="bg-gold text-charcoal hover:bg-gold/90"
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Upload queued nominee videos
            </Button>
          </CardContent>
        </Card>

        {/* Manual / bulk entry point */}
        <Card className="border-gold/20 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Upload a single video</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <Label htmlFor="yt-path">Storage path (nominee-videos bucket)</Label>
                <Input id="yt-path" value={sourcePath} onChange={(e) => setSourcePath(e.target.value)} placeholder="nominee/abc.mp4" />
              </div>
              <div>
                <Label htmlFor="yt-url">…or source URL</Label>
                <Input id="yt-url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://…/clip.mp4" />
              </div>
            </div>
            <div>
              <Label htmlFor="yt-title">Title</Label>
              <Input id="yt-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="yt-desc">Description</Label>
              <Textarea id="yt-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="yt-nominee">Link to nominee ID (optional)</Label>
              <Input id="yt-nominee" value={nomineeId} onChange={(e) => setNomineeId(e.target.value)} placeholder="uuid" />
            </div>
            <Button onClick={uploadOne} disabled={busy || !status?.configured} className="bg-gold text-charcoal hover:bg-gold/90">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Upload to NESA Africa TV
            </Button>
          </CardContent>
        </Card>

        {/* Job ledger */}
        <Card className="border-gold/20 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Recent upload jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <p className="text-sm text-white/60">No upload jobs yet.</p>
            ) : (
              <ul className="divide-y divide-white/10 text-sm">
                {jobs.map((j) => (
                  <li key={j.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <div>
                      <p className="font-medium text-white">{j.title}</p>
                      <p className="text-xs text-white/50">
                        {new Date(j.created_at).toLocaleString()} · {j.entry_point}
                      </p>
                      {j.error ? <p className="text-xs text-red-300">{j.error}</p> : null}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{j.status}</Badge>
                      {j.video_url ? (
                        <a className="text-xs text-gold underline" href={j.video_url} target="_blank" rel="noreferrer">
                          watch
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
