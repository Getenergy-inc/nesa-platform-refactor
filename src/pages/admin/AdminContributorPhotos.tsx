import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Upload, Save, Trash2, Search, ImageIcon, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CONTRIBUTORS, type Contributor } from "@/data/contributors";
import { useContributorPhotos } from "@/hooks/useContributorPhotos";

const BUCKET = "contributor-photos";

export default function AdminContributorPhotos() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const { photos, refetch } = useContributorPhotos();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!hasRole("admin")) return <Navigate to="/unauthorized" replace />;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONTRIBUTORS;
    return CONTRIBUTORS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q),
    );
  }, [query]);

  async function uploadFile(c: Contributor, file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setBusyId(c.id);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${c.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      await saveUrl(c.id, pub.publicUrl, path);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusyId(null);
    }
  }

  async function saveUrl(contributorId: string, url: string, storagePath?: string | null) {
    const { error } = await supabase.from("contributor_photos").upsert(
      {
        contributor_id: contributorId,
        image_url: url,
        storage_path: storagePath ?? null,
        updated_by: user!.id,
      },
      { onConflict: "contributor_id" },
    );
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Photo saved");
    setDrafts((d) => ({ ...d, [contributorId]: "" }));
    refetch();
  }

  async function clearPhoto(c: Contributor) {
    setBusyId(c.id);
    try {
      const existing = photos[c.id];
      if (existing?.storage_path) {
        await supabase.storage.from(BUCKET).remove([existing.storage_path]);
      }
      const { error } = await supabase
        .from("contributor_photos")
        .delete()
        .eq("contributor_id", c.id);
      if (error) throw error;
      toast.success("Photo cleared");
      refetch();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to clear");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Contributor Photos | NESA-Africa Admin</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="font-serif text-3xl text-white">Contributor Photos</h1>
          <p className="text-white/70 mt-1">
            Upload or set the image URL used on each contributor's profile, Hall of Fame card,
            and social-media share previews.
          </p>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or id…"
            className="pl-9 bg-charcoal-light/40 border-gold/20 text-white"
          />
        </div>

        <div className="grid gap-4">
          {filtered.map((c) => {
            const current = photos[c.id]?.image_url || c.imageUrl;
            const draft = drafts[c.id] ?? "";
            const busy = busyId === c.id;
            return (
              <div
                key={c.id}
                className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-4 flex flex-col md:flex-row gap-4"
              >
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-charcoal border border-gold/20 flex items-center justify-center">
                  {current ? (
                    <img src={current} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-white/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-white font-medium">{c.name}</h3>
                    <span className="text-gold/80 text-xs">{c.role}</span>
                    <code className="text-white/40 text-[11px]">{c.id}</code>
                  </div>
                  {c.title && <p className="text-white/60 text-sm">{c.title}</p>}

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <label className="inline-flex">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={busy}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadFile(c, f);
                          e.target.value = "";
                        }}
                      />
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gold text-charcoal text-sm font-medium cursor-pointer hover:bg-gold-dark">
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        Upload
                      </span>
                    </label>

                    <Input
                      value={draft}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [c.id]: e.target.value }))
                      }
                      placeholder="…or paste an image URL"
                      className="flex-1 bg-charcoal border-gold/20 text-white"
                    />
                    <Button
                      size="sm"
                      disabled={!draft || busy}
                      onClick={() => saveUrl(c.id, draft.trim(), null)}
                      className="bg-gold hover:bg-gold-dark text-charcoal"
                    >
                      <Save className="h-4 w-4 mr-1" /> Save URL
                    </Button>
                    {photos[c.id] && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => clearPhoto(c)}
                        className="border-red-400/40 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
