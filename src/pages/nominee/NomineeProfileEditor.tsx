import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ClaimedNominee {
  id: string;
  name: string;
  slug: string | null;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  website: string | null;
  linkedin_url: string | null;
  work_done: string | null;
  video_url: string | null;
}

interface Revision {
  id: string;
  status: string;
  review_notes: string | null;
  created_at: string;
}

const EDITABLE = [
  "title",
  "organization",
  "bio",
  "photo_url",
  "website",
  "linkedin_url",
  "work_done",
  "video_url",
] as const;

/**
 * Nominee self-service portal.
 * Nominees may propose edits only — nothing goes live until NRC approves the
 * revision. Status, verification and scoring fields are never editable here.
 */
export default function NomineeProfileEditor() {
  const { user } = useAuth();
  const [nominee, setNominee] = useState<ClaimedNominee | null>(null);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [claimSlug, setClaimSlug] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("nominees")
      .select(
        "id,name,slug,title,organization,bio,photo_url,website,linkedin_url,work_done,video_url",
      )
      .eq("claimed_by_user_id", user.id)
      .maybeSingle();
    const rec = (data as unknown as ClaimedNominee) ?? null;
    setNominee(rec);
    if (rec) {
      setForm(
        Object.fromEntries(EDITABLE.map((k) => [k, (rec as never as Record<string, string>)[k] ?? ""])),
      );
      const { data: revs } = await supabase
        .from("nominee_profile_revisions")
        .select("id,status,review_notes,created_at")
        .eq("nominee_id", rec.id)
        .order("created_at", { ascending: false });
      setRevisions((revs as unknown as Revision[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const claim = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.rpc("claim_nominee_profile", {
        _slug: claimSlug.trim(),
      });
      if (error) throw error;
      toast.success("Profile claimed.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not claim this profile.");
    } finally {
      setBusy(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    if (!user) return;
    setBusy(true);
    try {
      const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("nominee-media").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("nominee-media").getPublicUrl(path);
      setForm((f) => ({ ...f, photo_url: data.publicUrl }));
      toast.success("Photo uploaded — submit your changes to send them for review.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const submitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominee || !user) return;
    setBusy(true);
    try {
      const payload = Object.fromEntries(
        EDITABLE.filter((k) => (form[k] ?? "") !== ((nominee as never as Record<string, string>)[k] ?? "")).map(
          (k) => [k, form[k]],
        ),
      );
      if (Object.keys(payload).length === 0) {
        toast.info("No changes to submit.");
        return;
      }
      const { error } = await supabase.from("nominee_profile_revisions").insert({
        nominee_id: nominee.id,
        submitted_by: user.id,
        status: "pending",
        payload,
      });
      if (error) throw error;
      toast.success("Submitted. NRC will review your changes before they go live.");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit changes.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white/60">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your profile…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Helmet>
        <title>Nominee Portal | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Claim your NESA-Africa nominee profile and submit updates for Nominee Research Corps review."
        />
      </Helmet>

      <h1 className="font-display text-3xl font-bold text-white">Nominee Portal</h1>
      <p className="mt-2 flex items-start gap-2 text-sm text-white/60">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" />
        You can propose changes to your public profile. Nothing is published until the
        Nominee Research Corps approves it. Recognition status and verification data are
        never editable here.
      </p>

      {!nominee ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Claim your profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your profile URL slug. Your signed-in email must match the email on the
              nominee record.
            </p>
            <div className="flex gap-2">
              <Input
                value={claimSlug}
                onChange={(e) => setClaimSlug(e.target.value)}
                placeholder="e.g. amina-mohammed"
              />
              <Button onClick={claim} disabled={busy || !claimSlug.trim()}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {revisions.some((r) => r.status === "pending") && (
            <div className="mt-6 rounded-lg border border-gold/30 bg-gold/10 p-4 text-sm text-gold">
              You have changes awaiting NRC review.
            </div>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">{nominee.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitRevision} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title / position</Label>
                    <Input
                      id="title"
                      value={form.title ?? ""}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organisation</Label>
                    <Input
                      id="organization"
                      value={form.organization ?? ""}
                      onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={form.website ?? ""}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      value={form.linkedin_url ?? ""}
                      onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Short bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={form.bio ?? ""}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="work_done">Contribution to education</Label>
                  <Textarea
                    id="work_done"
                    rows={5}
                    value={form.work_done ?? ""}
                    onChange={(e) => setForm({ ...form, work_done: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video_url">Video link (YouTube)</Label>
                  <Input
                    id="video_url"
                    value={form.video_url ?? ""}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Profile photo</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void uploadPhoto(f);
                      }}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {form.photo_url && (
                    <img
                      src={form.photo_url}
                      alt="Profile preview"
                      className="mt-2 h-24 w-24 rounded-lg object-cover"
                    />
                  )}
                </div>

                <Button type="submit" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit changes for NRC review
                </Button>
              </form>
            </CardContent>
          </Card>

          {revisions.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Submission history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {revisions.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-3 border-b pb-3 last:border-0">
                    <div>
                      <p className="text-sm">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                      {r.review_notes && (
                        <p className="text-xs text-muted-foreground">{r.review_notes}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="capitalize">{r.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
