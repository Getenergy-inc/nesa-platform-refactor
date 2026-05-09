import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Plus, Pencil, Save, Trash2, Loader2, Upload, X, ImageIcon } from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CONTRIBUTION_AREAS,
  ROLE_TABS,
  type Contributor,
  type ContributionArea,
  type ContributorRole,
} from "@/data/contributors";
import { useContributors } from "@/hooks/useContributors";
import { cn } from "@/lib/utils";

const BUCKET = "contributor-photos";
const SLUG_RE = /^[a-z0-9][a-z0-9-]{2,63}$/;

const FormSchema = z.object({
  id: z.string().regex(SLUG_RE, "Use lowercase letters, numbers, and dashes (3–64 chars)"),
  name: z.string().trim().min(1, "Required").max(120),
  role: z.string().trim().min(1, "Required"),
  title: z.string().max(160).optional().or(z.literal("")),
  country: z.string().max(80).optional().or(z.literal("")),
  region: z.string().max(80).optional().or(z.literal("")),
  yearStart: z.coerce.number().int().min(2000).max(2100),
  yearEnd: z.union([z.coerce.number().int().min(2000).max(2100), z.literal("")]).optional(),
  imageUrl: z.string().max(2048).optional().or(z.literal("")),
  highlight: z.string().max(280).optional().or(z.literal("")),
  bio: z.string().max(4000).optional().or(z.literal("")),
  contributionDescription: z.string().max(4000).optional().or(z.literal("")),
  appreciation: z.string().max(2000).optional().or(z.literal("")),
  recommendation: z.string().max(6000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof FormSchema>;

const ROLES: ContributorRole[] = ROLE_TABS.filter((r) => r.key !== "All").map(
  (r) => r.key as ContributorRole,
);

const SOCIAL_KEYS = ["twitter", "linkedin", "facebook", "instagram", "youtube", "website", "email"] as const;
type SocialKey = (typeof SOCIAL_KEYS)[number];

const emptyForm: FormValues = {
  id: "",
  name: "",
  role: "Volunteer",
  title: "",
  country: "",
  region: "",
  yearStart: new Date().getFullYear(),
  yearEnd: "",
  imageUrl: "",
  highlight: "",
  bio: "",
  contributionDescription: "",
  appreciation: "",
  recommendation: "",
};

export default function AdminContributorsCMS() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const { contributors, overrides, refetch } = useContributors();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Contributor | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [areas, setAreas] = useState<ContributionArea[]>([]);
  const [socials, setSocials] = useState<Record<SocialKey, string>>({
    twitter: "", linkedin: "", facebook: "", instagram: "", youtube: "", website: "", email: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!hasRole("admin")) return <Navigate to="/unauthorized" replace />;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contributors;
    return contributors.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        (c.country?.toLowerCase().includes(q) ?? false),
    );
  }, [contributors, query]);

  function openCreate() {
    setCreating(true);
    setEditing(null);
    setForm(emptyForm);
    setAreas([]);
    setSocials({ twitter: "", linkedin: "", facebook: "", instagram: "", youtube: "", website: "", email: "" });
    setErrors({});
  }

  function openEdit(c: Contributor) {
    setEditing(c);
    setCreating(false);
    setForm({
      id: c.id,
      name: c.name,
      role: c.role,
      title: c.title ?? "",
      country: c.country ?? "",
      region: c.region ?? "",
      yearStart: c.yearStart,
      yearEnd: c.yearEnd ?? "",
      imageUrl: c.imageUrl ?? "",
      highlight: c.highlight ?? "",
      bio: c.bio ?? "",
      contributionDescription: c.contributionDescription ?? "",
      appreciation: c.appreciation ?? "",
      recommendation: c.recommendation ?? "",
    });
    setAreas([...(c.contributions ?? [])]);
    setSocials({
      twitter: c.socials?.twitter ?? "",
      linkedin: c.socials?.linkedin ?? "",
      facebook: c.socials?.facebook ?? "",
      instagram: c.socials?.instagram ?? "",
      youtube: c.socials?.youtube ?? "",
      website: c.socials?.website ?? "",
      email: c.socials?.email ?? "",
    });
    setErrors({});
  }

  function closeDialog() {
    setEditing(null);
    setCreating(false);
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${form.id || "tmp-" + Date.now()}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setForm((f) => ({ ...f, imageUrl: data.publicUrl }));
    toast.success("Image uploaded");
  }

  async function save() {
    const parsed = FormSchema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path.join(".")] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const isCustom = creating || !!overrides.get(form.id)?.is_custom ||
        !contributors.some((c) => c.id === form.id && !overrides.has(c.id));
      // Build social object excluding empty strings
      const socialsClean = Object.fromEntries(
        Object.entries(socials).filter(([, v]) => v.trim().length > 0),
      );
      const payload = {
        id: form.id.trim(),
        name: form.name.trim(),
        role: form.role,
        title: form.title || null,
        country: form.country || null,
        region: form.region || null,
        year_start: Number(form.yearStart),
        year_end: form.yearEnd === "" || form.yearEnd === undefined ? null : Number(form.yearEnd),
        image_url: form.imageUrl || null,
        highlight: form.highlight || null,
        bio: form.bio || null,
        contribution_description: form.contributionDescription || null,
        contributions: areas,
        appreciation: form.appreciation || null,
        recommendation: form.recommendation || null,
        socials: socialsClean,
        is_custom: creating ? true : isCustom,
        updated_by: user!.id,
      };
      const { error } = await supabase
        .from("contributor_entries")
        .upsert(payload, { onConflict: "id" });
      if (error) throw error;
      toast.success(creating ? "Contributor created" : "Contributor updated");
      await refetch();
      closeDialog();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Contributor) {
    const row = overrides.get(c.id);
    if (!row) {
      toast.error("This is a built-in contributor — edit it instead to override fields");
      return;
    }
    if (!confirm(`Delete override for "${c.name}"? Built-in seed values will be restored if any.`)) return;
    const { error } = await supabase.from("contributor_entries").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Override removed");
    refetch();
  }

  const isOpen = creating || editing !== null;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Contributors CMS | NESA-Africa Admin</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl text-white">Contributors CMS</h1>
            <p className="text-white/70 mt-1">
              Create and edit contributor bios, contributions, tenure, photo, and social handles.
            </p>
          </div>
          <Button onClick={openCreate} className="bg-gold hover:bg-gold-dark text-charcoal">
            <Plus className="h-4 w-4 mr-1" /> New Contributor
          </Button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, country, or id…"
            className="pl-9 bg-charcoal-light/40 border-gold/20 text-white"
          />
        </div>

        <div className="grid gap-3">
          {filtered.map((c) => {
            const row = overrides.get(c.id);
            return (
              <div
                key={c.id}
                className="rounded-xl border border-gold/15 bg-charcoal-light/40 p-3 flex items-center gap-3"
              >
                <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden bg-charcoal border border-gold/20 flex items-center justify-center">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-white/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="text-white font-medium truncate">{c.name}</h3>
                    <span className="text-gold/80 text-xs">{c.role}</span>
                    {row?.is_custom && (
                      <span className="text-[10px] uppercase tracking-wider text-emerald-300">Custom</span>
                    )}
                    {row && !row.is_custom && (
                      <span className="text-[10px] uppercase tracking-wider text-blue-300">Edited</span>
                    )}
                  </div>
                  <p className="text-white/50 text-xs truncate">
                    {c.country ?? "—"} · {c.yearStart}{c.yearEnd ? `–${c.yearEnd}` : "–Present"} · {c.id}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => openEdit(c)} className="border-gold/40 text-gold hover:bg-gold/10">
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                {row && (
                  <Button size="sm" variant="outline" onClick={() => remove(c)} className="border-red-400/40 text-red-300 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-white/50 text-center py-8">No contributors match your search.</p>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-charcoal border-gold/30 text-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-white">
              {creating ? "New Contributor" : `Edit: ${editing?.name}`}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="ID (slug)" error={errors.id}>
                <Input
                  value={form.id}
                  disabled={!creating}
                  onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase() })}
                  placeholder="e.g. v-2025-newcomer"
                  className="bg-charcoal-light border-gold/20"
                />
              </Field>
              <Field label="Full Name *" error={errors.name}>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-charcoal-light border-gold/20" />
              </Field>
              <Field label="Role *" error={errors.role}>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger className="bg-charcoal-light border-gold/20"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-charcoal border-gold/30 text-white max-h-72">
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Title (optional)">
                <Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-charcoal-light border-gold/20" />
              </Field>
              <Field label="Country">
                <Input value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} className="bg-charcoal-light border-gold/20" />
              </Field>
              <Field label="Region">
                <Input value={form.region ?? ""} onChange={(e) => setForm({ ...form, region: e.target.value })} className="bg-charcoal-light border-gold/20" placeholder="e.g. East Africa" />
              </Field>
              <Field label="Year Start *" error={errors.yearStart}>
                <Input type="number" value={form.yearStart} onChange={(e) => setForm({ ...form, yearStart: Number(e.target.value) })} className="bg-charcoal-light border-gold/20" />
              </Field>
              <Field label="Year End (blank = Present)">
                <Input
                  type="number"
                  value={form.yearEnd ?? ""}
                  onChange={(e) => setForm({ ...form, yearEnd: e.target.value === "" ? "" : Number(e.target.value) })}
                  className="bg-charcoal-light border-gold/20"
                />
              </Field>
            </div>

            {/* Image */}
            <Field label="Photo URL">
              <div className="flex gap-2">
                <Input value={form.imageUrl ?? ""} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" className="bg-charcoal-light border-gold/20 flex-1" />
                <label className="inline-flex">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
                  <span className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-gold text-charcoal text-sm font-medium cursor-pointer hover:bg-gold-dark">
                    <Upload className="h-4 w-4" /> Upload
                  </span>
                </label>
              </div>
            </Field>

            <Field label="Highlight (one-line tagline)">
              <Input value={form.highlight ?? ""} onChange={(e) => setForm({ ...form, highlight: e.target.value })} className="bg-charcoal-light border-gold/20" />
            </Field>

            <Field label="Biography">
              <Textarea rows={4} value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="bg-charcoal-light border-gold/20" />
            </Field>

            <Field label="Contribution Description">
              <Textarea rows={4} value={form.contributionDescription ?? ""} onChange={(e) => setForm({ ...form, contributionDescription: e.target.value })} className="bg-charcoal-light border-gold/20" />
            </Field>

            <Field label="Contribution Areas">
              <div className="flex flex-wrap gap-1.5 p-2 rounded-md bg-charcoal-light/40 border border-gold/15 max-h-44 overflow-y-auto">
                {CONTRIBUTION_AREAS.map((a) => {
                  const active = areas.includes(a);
                  return (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAreas((arr) => active ? arr.filter((x) => x !== a) : [...arr, a])}
                      className={cn(
                        "px-2 py-1 rounded-full text-[11px] border transition-colors",
                        active
                          ? "bg-gold text-charcoal border-gold"
                          : "bg-transparent text-white/70 border-gold/20 hover:border-gold/50",
                      )}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Appreciation Note">
              <Textarea rows={3} value={form.appreciation ?? ""} onChange={(e) => setForm({ ...form, appreciation: e.target.value })} className="bg-charcoal-light border-gold/20" />
            </Field>

            <Field label="Recommendation Letter (leave blank to auto-generate)">
              <Textarea rows={5} value={form.recommendation ?? ""} onChange={(e) => setForm({ ...form, recommendation: e.target.value })} className="bg-charcoal-light border-gold/20" />
            </Field>

            <div>
              <Label className="text-white/80 text-sm mb-2 block">Social Handles</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SOCIAL_KEYS.map((k) => (
                  <Input
                    key={k}
                    value={socials[k]}
                    onChange={(e) => setSocials({ ...socials, [k]: e.target.value })}
                    placeholder={k === "email" ? "name@example.com" : k === "website" ? "https://…" : `${k} handle or URL`}
                    className="bg-charcoal-light border-gold/20"
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={closeDialog} className="text-white/70">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="bg-gold hover:bg-gold-dark text-charcoal">
              {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-white/80 text-sm mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
