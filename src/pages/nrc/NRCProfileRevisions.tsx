import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { YouTubePublishPanel } from "@/components/nrc/YouTubePublishPanel";

interface RevisionRow {
  id: string;
  nominee_id: string;
  status: string;
  payload: Record<string, unknown>;
  created_at: string;
}

interface MessageRow {
  id: string;
  nominee_id: string;
  author_name: string;
  author_organization: string | null;
  message: string;
  created_at: string;
}

/** NRC / admin moderation queue for nominee-submitted edits and supporter messages. */
export default function NRCProfileRevisions() {
  const [revisions, setRevisions] = useState<RevisionRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: revs }, { data: msgs }] = await Promise.all([
      supabase
        .from("nominee_profile_revisions")
        .select("id,nominee_id,status,payload,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      supabase
        .from("nominee_support_messages")
        .select("id,nominee_id,author_name,author_organization,message,created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
    ]);
    setRevisions((revs as unknown as RevisionRow[]) ?? []);
    setMessages((msgs as unknown as MessageRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = async (id: string, approve: boolean) => {
    setBusy(id);
    try {
      const { error } = await supabase.rpc(
        approve ? "approve_nominee_revision" : "reject_nominee_revision",
        { _revision_id: id, _notes: notes[id] || null },
      );
      if (error) throw error;
      toast.success(approve ? "Revision approved and published." : "Revision rejected.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  const moderateMessage = async (id: string, approve: boolean) => {
    setBusy(id);
    try {
      const { error } = await supabase
        .from("nominee_support_messages")
        .update({ status: approve ? "approved" : "rejected", reviewed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Helmet>
        <title>Profile Revisions | NRC Arena</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <h1 className="font-display text-2xl font-bold text-white">Nominee profile review</h1>
      <p className="mt-2 text-sm text-white/60">
        Approve or reject nominee-submitted edits and supporter messages. Approving a
        revision publishes it to the public profile.
      </p>

      <div className="mt-6">
        <YouTubePublishPanel />
      </div>

      {loading ? (
        <div className="mt-10 flex items-center text-white/60">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading queue…
        </div>
      ) : (
        <>
          <section className="mt-8 space-y-4">
            <h2 className="font-display text-lg text-white">
              Pending edits <Badge variant="outline">{revisions.length}</Badge>
            </h2>
            {revisions.length === 0 && (
              <p className="text-sm text-white/50">No pending profile edits.</p>
            )}
            {revisions.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Nominee {r.nominee_id.slice(0, 8)} ·{" "}
                    {new Date(r.created_at).toLocaleString()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <dl className="space-y-2 text-sm">
                    {Object.entries(r.payload).map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-medium capitalize">{k.replace(/_/g, " ")}</dt>
                        <dd className="text-muted-foreground break-words">{String(v)}</dd>
                      </div>
                    ))}
                  </dl>
                  <Textarea
                    rows={2}
                    placeholder="Review notes (shared with the nominee)"
                    value={notes[r.id] ?? ""}
                    onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busy === r.id} onClick={() => decide(r.id, true)}>
                      <Check className="mr-1 h-4 w-4" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === r.id}
                      onClick={() => decide(r.id, false)}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="font-display text-lg text-white">
              Pending supporter messages <Badge variant="outline">{messages.length}</Badge>
            </h2>
            {messages.length === 0 && (
              <p className="text-sm text-white/50">No pending messages.</p>
            )}
            {messages.map((m) => (
              <Card key={m.id}>
                <CardContent className="space-y-3 pt-6">
                  <p className="text-sm">{m.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.author_name}
                    {m.author_organization ? ` · ${m.author_organization}` : ""} ·{" "}
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={busy === m.id} onClick={() => moderateMessage(m.id, true)}>
                      <Check className="mr-1 h-4 w-4" /> Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === m.id}
                      onClick={() => moderateMessage(m.id, false)}
                    >
                      <X className="mr-1 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
