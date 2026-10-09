/**
 * Admin: Nominee Media Library
 * Upload licensed photos/logos per nominee. Once saved & verified, the image
 * automatically appears across profile pages, cards, carousels, voting pages,
 * and OG share previews via the useNomineeMedia resolver.
 */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, ExternalLink, CheckCircle2, Search, ShieldCheck, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GOLD_CATEGORIES } from "@/data/goldSpecialRecognition";

// ---- Nominee catalogue (priority set first, then everything else fed by gold data) ----
interface NomineeRef { slug: string; name: string; kind: "person" | "organization"; group: string; country?: string; sourceHint?: string }

const PRIORITY_NOMINEES: NomineeRef[] = GOLD_CATEGORIES.flatMap((cat) =>
  cat.nominees.map((n) => ({
    slug: n.slug,
    name: n.name,
    kind: "person" as const,
    group: cat.shortName,
    country: n.country,
  })),
);

const LICENSE_OPTIONS = [
  { value: "licensed", label: "Licensed (paid / stock)" },
  { value: "press_kit", label: "Official press kit" },
  { value: "permission_granted", label: "Written permission from rights holder" },
  { value: "public_domain", label: "Public domain" },
  { value: "pending", label: "Pending review" },
];

const SOURCE_TYPES = [
  { value: "manual_upload", label: "Manual upload" },
  { value: "official_website", label: "Official website" },
  { value: "verified_social", label: "Verified social profile" },
  { value: "public_press", label: "Press / news" },
  { value: "wikimedia", label: "Wikimedia Commons" },
  { value: "licensed_media", label: "Licensed media library" },
  { value: "internal_gallery", label: "Internal gallery" },
];

interface FormState {
  nominee_slug: string;
  nominee_name: string;
  kind: "person" | "organization";
  alt_text: string;
  caption: string;
  source_url: string;
  source_type: string;
  license_status: string;
  attribution: string;
  verified: boolean;
}

const blankForm = (n?: NomineeRef): FormState => ({
  nominee_slug: n?.slug ?? "",
  nominee_name: n?.name ?? "",
  kind: n?.kind ?? "person",
  alt_text: n ? `${n.name} — NESA Africa nominee portrait` : "",
  caption: "",
  source_url: "",
  source_type: "manual_upload",
  license_status: "licensed",
  attribution: "",
  verified: true,
});

export default function NomineeMediaLibrary() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<NomineeRef | null>(null);

  const { data: existing } = useQuery({
    queryKey: ["admin-nominee-media-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nominee_media").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const existingMap = useMemo(() => {
    const m = new Map<string, any>();
    (existing ?? []).forEach((r: any) => m.set(r.nominee_slug, r));
    return m;
  }, [existing]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRIORITY_NOMINEES;
    return PRIORITY_NOMINEES.filter((n) =>
      n.name.toLowerCase().includes(q) || n.slug.includes(q) || n.group.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-charcoal text-ivory px-4 md:px-8 py-8 pb-24">
      <Helmet>
        <title>Nominee Media Library | NESA Africa Admin</title>
      </Helmet>

      <header className="mb-8 max-w-5xl">
        <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4" /> Admin · Media governance
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Nominee Media Library</h1>
        <p className="text-ivory/70 max-w-3xl">
          Upload <strong>licensed</strong> photos, logos, banners, and social share images for each nominee.
          Once saved &amp; verified, the image automatically replaces the placeholder across the nominee profile,
          every card, every carousel, voting pages and OG share previews. Always confirm rights before uploading.
        </p>
      </header>

      <div className="max-w-5xl mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nominees by name, slug, or pillar…"
            className="pl-9 bg-charcoal-light border-gold/20"
          />
        </div>
        <Badge variant="outline" className="self-center border-gold/30 text-gold">
          {existing?.length ?? 0} records · {existing?.filter((r: any) => r.verified).length ?? 0} verified
        </Badge>
      </div>

      <div className="grid gap-3 max-w-5xl">
        {filtered.map((n) => {
          const rec = existingMap.get(n.slug);
          return (
            <Card key={n.slug} className="bg-charcoal-light border-gold/15 hover:border-gold/40 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-charcoal flex items-center justify-center border border-gold/15 shrink-0">
                  {rec?.image_url ? (
                    <img src={rec.image_url} alt={rec.alt_text ?? n.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-6 h-6 text-ivory/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-ivory truncate">{n.name}</h3>
                    {rec?.verified && (
                      <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-400/30 gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified
                      </Badge>
                    )}
                    {!rec && (
                      <Badge variant="outline" className="border-amber-400/40 text-amber-300">
                        Placeholder
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-ivory/50 mt-1">
                    {n.group} {n.country ? `· ${n.country}` : ""} · <code className="text-ivory/40">{n.slug}</code>
                  </p>
                  {rec?.source_url && (
                    <a
                      href={rec.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gold/80 hover:text-gold mt-1"
                    >
                      Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => setActive(n)}
                      className="bg-gold text-charcoal hover:bg-gold/90"
                    >
                      <Upload className="w-4 h-4 mr-1.5" /> {rec ? "Replace" : "Upload"}
                    </Button>
                  </DialogTrigger>
                  {active?.slug === n.slug && (
                    <UploadDialog
                      nominee={n}
                      existing={rec}
                      onDone={() => {
                        qc.invalidateQueries({ queryKey: ["admin-nominee-media-all"] });
                        qc.invalidateQueries({ queryKey: ["nominee-media-index"] });
                        setActive(null);
                      }}
                    />
                  )}
                </Dialog>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Upload dialog ----------
function UploadDialog({
  nominee, existing, onDone,
}: { nominee: NomineeRef; existing?: any; onDone: () => void }) {
  const [form, setForm] = useState<FormState>(() => existing ? {
    nominee_slug: existing.nominee_slug,
    nominee_name: existing.nominee_name,
    kind: existing.kind,
    alt_text: existing.alt_text ?? `${existing.nominee_name} — NESA Africa nominee portrait`,
    caption: existing.caption ?? "",
    source_url: existing.source_url ?? "",
    source_type: existing.source_type ?? "manual_upload",
    license_status: existing.license_status ?? "licensed",
    attribution: existing.attribution ?? "",
    verified: existing.verified ?? true,
  } : blankForm(nominee));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(existing?.image_url ?? null);

  const onFile = (f: File | null) => {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const save = useMutation({
    mutationFn: async () => {
      if (!form.source_url || form.source_url.length < 8) {
        throw new Error("Source URL is required — record where the image came from for the licensing audit trail.");
      }
      let image_url: string | null = existing?.image_url ?? null;

      if (file) {
        if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
          throw new Error("Upload must be JPEG, PNG, or WebP.");
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error("Image must be 8 MB or smaller.");
        }
        const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
        const path = `${form.nominee_slug}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("nominee-media")
          .upload(path, file, { upsert: true, contentType: file.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("nominee-media").getPublicUrl(path);
        image_url = pub.publicUrl;
      }

      if (!image_url) throw new Error("Choose a file to upload.");

      const payload = {
        nominee_slug: form.nominee_slug,
        nominee_name: form.nominee_name,
        kind: form.kind,
        image_url,
        thumbnail_url: image_url,
        og_image_url: image_url,
        alt_text: form.alt_text,
        caption: form.caption,
        source_url: form.source_url,
        source_type: form.source_type,
        license_status: form.license_status,
        attribution: form.attribution,
        verified: form.verified,
        approved_at: form.verified ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from("nominee_media")
        .upsert(payload, { onConflict: "nominee_slug" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${nominee.name} media saved`, { description: "Will now appear platform-wide." });
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <DialogContent className="bg-charcoal border-gold/20 text-ivory max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="font-display text-gold">{nominee.name}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="rounded-lg border border-amber-400/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-200">
          <strong>Licensing checklist:</strong> only upload images you have the rights to publish —
          press-kit photo, written permission, paid license, or public-domain source. Record the source URL below.
        </div>

        {preview && (
          <div className="rounded-lg overflow-hidden border border-gold/20 max-h-72 flex justify-center bg-black">
            <img src={preview} alt="Preview" className="max-h-72 object-contain" />
          </div>
        )}

        <div>
          <Label htmlFor="file" className="text-ivory">Image file (JPEG / PNG / WebP, ≤ 8 MB)</Label>
          <Input
            id="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="bg-charcoal-light border-gold/20"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <Label>Kind</Label>
            <Select value={form.kind} onValueChange={(v: any) => setForm({ ...form, kind: v })}>
              <SelectTrigger className="bg-charcoal-light border-gold/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Person (portrait)</SelectItem>
                <SelectItem value="organization">Organization (logo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>License status *</Label>
            <Select value={form.license_status} onValueChange={(v) => setForm({ ...form, license_status: v })}>
              <SelectTrigger className="bg-charcoal-light border-gold/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LICENSE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Source URL * <span className="text-ivory/40 text-xs">(press kit / official site / licensor)</span></Label>
          <Input
            value={form.source_url}
            onChange={(e) => setForm({ ...form, source_url: e.target.value })}
            placeholder="https://…"
            className="bg-charcoal-light border-gold/20"
          />
        </div>

        <div>
          <Label>Source type</Label>
          <Select value={form.source_type} onValueChange={(v) => setForm({ ...form, source_type: v })}>
            <SelectTrigger className="bg-charcoal-light border-gold/20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOURCE_TYPES.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Attribution / credit line</Label>
          <Input
            value={form.attribution}
            onChange={(e) => setForm({ ...form, attribution: e.target.value })}
            placeholder="Photo: Foundation press office"
            className="bg-charcoal-light border-gold/20"
          />
        </div>

        <div>
          <Label>Alt text (accessibility &amp; SEO)</Label>
          <Input
            value={form.alt_text}
            onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
            className="bg-charcoal-light border-gold/20"
          />
        </div>

        <div>
          <Label>Caption (optional)</Label>
          <Textarea
            rows={2}
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
            className="bg-charcoal-light border-gold/20"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-gold/15 px-3 py-2">
          <div>
            <div className="text-sm font-medium">Publish (verified)</div>
            <div className="text-xs text-ivory/50">When on, the image goes live across the platform immediately.</div>
          </div>
          <Switch checked={form.verified} onCheckedChange={(v) => setForm({ ...form, verified: v })} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            disabled={save.isPending}
            onClick={() => save.mutate()}
            className="bg-gold text-charcoal hover:bg-gold/90"
          >
            {save.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Save &amp; publish
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
