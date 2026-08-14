import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Loader2, Youtube } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface StatusPayload {
  configured: boolean;
  missingSecrets?: string[];
  queued?: number;
  message?: string;
}

/**
 * NRC-facing control for pushing NRC-approved nominee videos to the
 * NESA Africa TV YouTube channel. Degrades gracefully when the YouTube
 * credentials have not been supplied yet.
 */
export function YouTubePublishPanel() {
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("youtube-publish", {
      body: { action: "status" },
    });
    if (error) {
      setStatus({ configured: false, message: "Publishing service unavailable." });
      return;
    }
    setStatus(data as StatusPayload);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const publish = async () => {
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("youtube-publish", {
      body: { action: "publish" },
    });
    setBusy(false);
    if (error) {
      toast.error("Publishing failed", { description: error.message });
      return;
    }
    const payload = data as StatusPayload & { published?: Array<{ error?: string }> };
    if (payload.configured === false) {
      toast.warning("YouTube publishing not yet configured");
      setStatus(payload);
      return;
    }
    const failed = (payload.published ?? []).filter((p) => p.error).length;
    toast.success(
      `Published ${(payload.published ?? []).length - failed} video(s)${failed ? `, ${failed} failed` : ""}`,
    );
    void load();
  };

  return (
    <Card className="border-gold/20 bg-charcoal/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Youtube className="h-5 w-5 text-gold" />
          NESA Africa TV publishing
          {status?.queued ? <Badge variant="outline">{status.queued} queued</Badge> : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-white/75">
        {status?.configured ? (
          <p>Approved nominee videos can be pushed to the NESA Africa TV channel as unlisted uploads.</p>
        ) : (
          <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3">
            <p className="flex items-center gap-2 font-medium text-amber-200">
              <AlertTriangle className="h-4 w-4" /> YouTube publishing not yet configured
            </p>
            <p className="mt-1">
              Approved videos stay safely stored and queued. Add these secrets to activate publishing:
            </p>
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
        <Button onClick={publish} disabled={busy || !status?.configured} className="bg-gold text-charcoal hover:bg-gold/90">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Publish queued videos
        </Button>
      </CardContent>
    </Card>
  );
}

export default YouTubePublishPanel;
