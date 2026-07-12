import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Save, Upload, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePathwayCards, type PathwayCardRow } from "@/hooks/usePathwayCards";

const BUCKET = "contributor-photos";

const GRADIENT_PRESETS = [
  "from-gold/40 via-emerald-900/40 to-charcoal",
  "from-emerald-800/50 via-emerald-900/30 to-charcoal",
  "from-gold/35 via-orange-900/30 to-charcoal",
  "from-emerald-900/50 via-gold/15 to-charcoal",
  "from-gold/30 via-charcoal to-charcoal",
];

type Editable = PathwayCardRow;

export default function AdminPathwaysCMS() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const { cards, loading, refresh } = usePathwayCards();
  const [drafts, setDrafts] = useState<Record<string, Editable>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, Editable> = {};
    cards.forEach((c) => (map[c.id] = { ...c }));
    setDrafts(map);
  }, [cards]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-gold" />
        </div>
      </DashboardLayout>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!hasRole("admin")) return <Navigate to="/unauthorized" replace />;

  const update = (id: string, patch: Partial<Editable>) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const save = async (id: string) => {
    const draft = drafts[id];
    if (!draft) return;
    setSaving(id);
    const { error } = await supabase
      .from("pathway_cards")
      .update({
        category: draft.category,
        headline: draft.headline,
        award_line: draft.award_line,
        description: draft.description,
        cta: draft.cta,
        href: draft.href,
        image_url: draft.image_url,
        accent_label: draft.accent_label,
        visual_gradient: draft.visual_gradient,
        display_order: draft.display_order,
        is_active: draft.is_active,
      })
      .eq("id", id);
    setSaving(null);
    if (error) {
      toast.error(`Save failed: ${error.message}`);
      return;
    }
    toast.success(`${draft.category} saved`);
    refresh();
  };

  const upload = async (id: string, file: File) => {
    setUploading(id);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `pathways/${id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
      upsert: true,
      contentType: file.type,
    });
    if (upErr) {
      setUploading(null);
      toast.error(`Upload failed: ${upErr.message}`);
      return;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    update(id, { image_url: data.publicUrl });
    setUploading(null);
    toast.success("Image uploaded — click Save to apply");
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Pathways CMS — NESA Africa Admin</title>
      </Helmet>
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Recognition Hub — CMS
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit the four landing-page recognition cards: copy, CTAs, link destinations, gradient,
            and hero image.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {Object.values(drafts)
              .sort((a, b) => a.display_order - b.display_order)
              .map((d) => (
                <div
                  key={d.id}
                  className="rounded-2xl border border-gold/25 bg-card p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-gold font-bold">
                        {d.id}
                      </div>
                      <div className="font-semibold text-foreground">{d.category}</div>
                    </div>
                    <label className="flex items-center gap-2 text-xs">
                      {d.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      <Switch
                        checked={d.is_active}
                        onCheckedChange={(v) => update(d.id, { is_active: v })}
                      />
                    </label>
                  </div>

                  {d.image_url && (
                    <img
                      src={d.image_url}
                      alt={d.category}
                      className="h-32 w-full object-cover rounded-lg border border-border"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Display order</Label>
                      <Input
                        type="number"
                        value={d.display_order}
                        onChange={(e) =>
                          update(d.id, { display_order: parseInt(e.target.value || "0", 10) })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Accent label</Label>
                      <Input
                        value={d.accent_label}
                        onChange={(e) => update(d.id, { accent_label: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Category</Label>
                    <Input
                      value={d.category}
                      onChange={(e) => update(d.id, { category: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Headline</Label>
                    <Textarea
                      rows={2}
                      value={d.headline}
                      onChange={(e) => update(d.id, { headline: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Award line</Label>
                    <Input
                      value={d.award_line}
                      onChange={(e) => update(d.id, { award_line: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      rows={3}
                      value={d.description}
                      onChange={(e) => update(d.id, { description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">CTA label</Label>
                      <Input
                        value={d.cta}
                        onChange={(e) => update(d.id, { cta: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Link destination</Label>
                      <Input
                        value={d.href}
                        onChange={(e) => update(d.id, { href: e.target.value })}
                        placeholder="/awards/..."
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Gradient (Tailwind classes)</Label>
                    <Input
                      value={d.visual_gradient}
                      onChange={(e) => update(d.id, { visual_gradient: e.target.value })}
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {GRADIENT_PRESETS.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => update(d.id, { visual_gradient: g })}
                          className={`h-6 w-12 rounded bg-gradient-to-br ${g} border border-border hover:scale-110 transition`}
                          title={g}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Image URL</Label>
                    <Input
                      value={d.image_url ?? ""}
                      onChange={(e) => update(d.id, { image_url: e.target.value })}
                      placeholder="https://..."
                    />
                    <div className="flex items-center gap-2 mt-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted">
                        {uploading === d.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        Upload image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) upload(d.id, f);
                          }}
                        />
                      </label>
                      {d.image_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => update(d.id, { image_url: null })}
                        >
                          Clear (use default)
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={() => save(d.id)} disabled={saving === d.id} className="gap-2">
                      {saving === d.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Save changes
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
