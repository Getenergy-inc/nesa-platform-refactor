import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { createUuid } from "@/lib/uuid";
import { Loader2, Upload, Trash2, Star, StarOff, Pencil, X, Plus, Image as ImageIcon } from "lucide-react";
import { GALLERY_CATEGORIES } from "@/data/gallery";

interface GalleryRow {
  id: string;
  title: string;
  alt_text: string;
  caption: string | null;
  image_url: string;
  thumbnail_url: string | null;
  category: string;
  collection_slug: string | null;
  region: string | null;
  country: string | null;
  year: number | null;
  photographer: string | null;
  photographer_credit_url: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

interface CollectionRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  story: string | null;
  year: number | null;
  location: string | null;
  cover_image_url: string | null;
  sort_order: number;
  is_published: boolean;
}

const emptyForm = {
  title: "",
  alt_text: "",
  caption: "",
  category: "ceremony",
  collection_slug: "",
  region: "",
  country: "",
  year: new Date().getFullYear(),
  photographer: "",
  photographer_credit_url: "",
  tags: "",
  is_featured: false,
  is_published: true,
};

const REGIONS = [
  "West Africa", "East Africa", "Southern Africa", "North Africa", "Central Africa",
  "Diaspora", "Global",
];

const GalleryAdmin = () => {
  const [tab, setTab] = useState<"media" | "collections">("media");
  const [media, setMedia] = useState<GalleryRow[]>([]);
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    slug: "", title: "", description: "", story: "", year: new Date().getFullYear(),
    location: "", cover_image_url: "", is_published: true,
  });
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [showCollectionForm, setShowCollectionForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const [m, c] = await Promise.all([
      supabase.from("gallery_media").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_collections").select("*").order("sort_order", { ascending: true }),
    ]);
    if (m.error) toast({ title: "Failed to load media", description: m.error.message, variant: "destructive" });
    else setMedia((m.data || []) as GalleryRow[]);
    if (c.error) toast({ title: "Failed to load collections", description: c.error.message, variant: "destructive" });
    else setCollections((c.data || []) as CollectionRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (row: GalleryRow) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      alt_text: row.alt_text,
      caption: row.caption || "",
      category: row.category,
      collection_slug: row.collection_slug || "",
      region: row.region || "",
      country: row.country || "",
      year: row.year || new Date().getFullYear(),
      photographer: row.photographer || "",
      photographer_credit_url: row.photographer_credit_url || "",
      tags: (row.tags || []).join(", "),
      is_featured: row.is_featured,
      is_published: row.is_published,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.alt_text.trim()) {
      toast({ title: "Title and alt text required", variant: "destructive" });
      return;
    }
    if (!editingId && !file) {
      toast({ title: "Image file required", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      let imageUrl: string | undefined;

      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${new Date().getFullYear()}/${createUuid()}.${ext}`;
        const up = await supabase.storage.from("gallery-media").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
          contentType: file.type,
        });
        if (up.error) throw up.error;
        imageUrl = supabase.storage.from("gallery-media").getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        title: form.title.trim(),
        alt_text: form.alt_text.trim(),
        caption: form.caption.trim() || null,
        category: form.category,
        collection_slug: form.collection_slug || null,
        region: form.region || null,
        country: form.country.trim() || null,
        year: Number(form.year) || null,
        photographer: form.photographer.trim() || null,
        photographer_credit_url: form.photographer_credit_url.trim() || null,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        is_featured: form.is_featured,
        is_published: form.is_published,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      if (editingId) {
        const { error } = await supabase.from("gallery_media").update(payload).eq("id", editingId);
        if (error) throw error;
        toast({ title: "Image updated" });
      } else {
        const { error } = await supabase.from("gallery_media").insert(payload as any);
        if (error) throw error;
        toast({ title: "Image uploaded" });
      }
      resetForm();
      load();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (row: GalleryRow) => {
    const { error } = await supabase.from("gallery_media").update({ is_featured: !row.is_featured }).eq("id", row.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const togglePublished = async (row: GalleryRow) => {
    const { error } = await supabase.from("gallery_media").update({ is_published: !row.is_published }).eq("id", row.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (row: GalleryRow) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("gallery_media").delete().eq("id", row.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  // Collection CRUD
  const resetCollectionForm = () => {
    setCollectionForm({
      slug: "", title: "", description: "", story: "", year: new Date().getFullYear(),
      location: "", cover_image_url: "", is_published: true,
    });
    setEditingCollectionId(null);
    setShowCollectionForm(false);
  };

  const startEditCollection = (c: CollectionRow) => {
    setEditingCollectionId(c.id);
    setCollectionForm({
      slug: c.slug,
      title: c.title,
      description: c.description || "",
      story: c.story || "",
      year: c.year || new Date().getFullYear(),
      location: c.location || "",
      cover_image_url: c.cover_image_url || "",
      is_published: c.is_published,
    });
    setShowCollectionForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmitCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      slug: collectionForm.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      title: collectionForm.title.trim(),
      description: collectionForm.description.trim() || null,
      story: collectionForm.story.trim() || null,
      year: Number(collectionForm.year) || null,
      location: collectionForm.location.trim() || null,
      cover_image_url: collectionForm.cover_image_url.trim() || null,
      is_published: collectionForm.is_published,
    };
    if (!payload.slug || !payload.title) {
      toast({ title: "Slug and title required", variant: "destructive" });
      return;
    }
    const op = editingCollectionId
      ? supabase.from("gallery_collections").update(payload).eq("id", editingCollectionId)
      : supabase.from("gallery_collections").insert(payload as any);
    const { error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Collection saved" }); resetCollectionForm(); load(); }
  };

  const removeCollection = async (c: CollectionRow) => {
    if (!confirm(`Delete collection "${c.title}"?`)) return;
    const { error } = await supabase.from("gallery_collections").delete().eq("id", c.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Helmet><title>Gallery CMS | NESA Africa Admin</title></Helmet>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <p className="text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">Admin</p>
            <h1 className="font-serif text-3xl sm:text-4xl">Gallery CMS</h1>
            <p className="text-white/60 text-sm mt-1">Manage event photography, collections, captions and featured moments.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setTab("media"); resetForm(); }}
              className={`rounded-full px-4 py-2 text-sm ${tab==="media" ? "bg-[hsl(42_85%_52%)] text-charcoal" : "bg-white/5 border border-white/10"}`}
            >Media</button>
            <button
              onClick={() => { setTab("collections"); resetCollectionForm(); }}
              className={`rounded-full px-4 py-2 text-sm ${tab==="collections" ? "bg-[hsl(42_85%_52%)] text-charcoal" : "bg-white/5 border border-white/10"}`}
            >Collections</button>
          </div>
        </div>

        {tab === "media" && (
          <>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mb-6 inline-flex items-center gap-2 rounded-full bg-[hsl(42_85%_52%)] px-5 py-2.5 text-sm font-semibold text-charcoal hover:brightness-110"
              ><Plus className="h-4 w-4" /> Upload Image</button>
            )}

            {showForm && (
              <form onSubmit={onSubmit} className="mb-8 rounded-2xl border border-[hsl(42_85%_52%)]/30 bg-white/5 p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-xl">{editingId ? "Edit image" : "Upload new image"}</h2>
                  <button type="button" onClick={resetForm} className="p-2 rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button>
                </div>

                {!editingId && (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-1">Image file *</label>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm" required />
                  </div>
                )}
                {editingId && (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/60 mb-1">Replace image (optional)</label>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Title *" value={form.title} onChange={v => setForm({ ...form, title: v })} required />
                  <Field label="Alt text * (SEO/accessibility)" value={form.alt_text} onChange={v => setForm({ ...form, alt_text: v })} required />
                </div>
                <Field label="Caption" value={form.caption} onChange={v => setForm({ ...form, caption: v })} textarea />

                <div className="grid sm:grid-cols-3 gap-4">
                  <Select label="Category" value={form.category} onChange={v => setForm({ ...form, category: v })}
                    options={GALLERY_CATEGORIES.map(c => ({ value: c.id, label: c.label }))} />
                  <Select label="Collection" value={form.collection_slug} onChange={v => setForm({ ...form, collection_slug: v })}
                    options={[{ value: "", label: "— None —" }, ...collections.map(c => ({ value: c.slug, label: c.title }))]} />
                  <Field label="Year" type="number" value={String(form.year)} onChange={v => setForm({ ...form, year: Number(v) })} />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Select label="Region" value={form.region} onChange={v => setForm({ ...form, region: v })}
                    options={[{ value: "", label: "— None —" }, ...REGIONS.map(r => ({ value: r, label: r }))]} />
                  <Field label="Country" value={form.country} onChange={v => setForm({ ...form, country: v })} />
                  <Field label="Tags (comma-separated)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Photographer" value={form.photographer} onChange={v => setForm({ ...form, photographer: v })} />
                  <Field label="Photographer credit URL" value={form.photographer_credit_url} onChange={v => setForm({ ...form, photographer_credit_url: v })} />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} /> Published
                  </label>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={uploading} className="inline-flex items-center gap-2 rounded-full bg-[hsl(42_85%_52%)] px-5 py-2.5 text-sm font-semibold text-charcoal hover:brightness-110 disabled:opacity-60">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {editingId ? "Save changes" : "Upload"}
                  </button>
                  <button type="button" onClick={resetForm} className="rounded-full px-5 py-2.5 text-sm border border-white/15 hover:bg-white/5">Cancel</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[hsl(42_85%_52%)]" /></div>
            ) : media.length === 0 ? (
              <div className="text-center py-16 text-white/60">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                No images yet. Upload your first event photo.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {media.map(row => (
                  <div key={row.id} className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <div className="aspect-[4/3] relative bg-black">
                      <img src={row.image_url} alt={row.alt_text} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      {!row.is_published && (
                        <span className="absolute top-2 left-2 rounded-full bg-black/80 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/70">Draft</span>
                      )}
                      {row.is_featured && (
                        <span className="absolute top-2 right-2 rounded-full bg-[hsl(42_85%_52%)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-charcoal font-semibold">Featured</span>
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <h3 className="font-serif text-base line-clamp-1">{row.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-2">{row.caption || row.alt_text}</p>
                      <p className="text-[10px] tracking-widest uppercase text-[hsl(42_85%_52%)] pt-1">
                        {row.category}{row.collection_slug ? ` · ${row.collection_slug}` : ""}{row.year ? ` · ${row.year}` : ""}
                      </p>
                      <div className="flex gap-1 pt-2">
                        <IconBtn title="Edit" onClick={() => startEdit(row)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
                        <IconBtn title={row.is_featured ? "Unfeature" : "Feature"} onClick={() => toggleFeatured(row)}>
                          {row.is_featured ? <StarOff className="h-3.5 w-3.5" /> : <Star className="h-3.5 w-3.5" />}
                        </IconBtn>
                        <IconBtn title={row.is_published ? "Unpublish" : "Publish"} onClick={() => togglePublished(row)}>
                          <span className="text-[10px] font-semibold">{row.is_published ? "PUB" : "DRAFT"}</span>
                        </IconBtn>
                        <IconBtn title="Delete" onClick={() => remove(row)} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "collections" && (
          <>
            {!showCollectionForm && (
              <button onClick={() => setShowCollectionForm(true)} className="mb-6 inline-flex items-center gap-2 rounded-full bg-[hsl(42_85%_52%)] px-5 py-2.5 text-sm font-semibold text-charcoal hover:brightness-110">
                <Plus className="h-4 w-4" /> New Collection
              </button>
            )}

            {showCollectionForm && (
              <form onSubmit={onSubmitCollection} className="mb-8 rounded-2xl border border-[hsl(42_85%_52%)]/30 bg-white/5 p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-serif text-xl">{editingCollectionId ? "Edit collection" : "New collection"}</h2>
                  <button type="button" onClick={resetCollectionForm} className="p-2 rounded-full hover:bg-white/10"><X className="h-4 w-4" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Slug * (e.g. nesa-africa-2025-awards)" value={collectionForm.slug} onChange={v => setCollectionForm({ ...collectionForm, slug: v })} required />
                  <Field label="Title *" value={collectionForm.title} onChange={v => setCollectionForm({ ...collectionForm, title: v })} required />
                </div>
                <Field label="Short description" value={collectionForm.description} onChange={v => setCollectionForm({ ...collectionForm, description: v })} textarea />
                <Field label="Story (long-form intro)" value={collectionForm.story} onChange={v => setCollectionForm({ ...collectionForm, story: v })} textarea />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Year" type="number" value={String(collectionForm.year)} onChange={v => setCollectionForm({ ...collectionForm, year: Number(v) })} />
                  <Field label="Location" value={collectionForm.location} onChange={v => setCollectionForm({ ...collectionForm, location: v })} />
                  <Field label="Cover image URL" value={collectionForm.cover_image_url} onChange={v => setCollectionForm({ ...collectionForm, cover_image_url: v })} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={collectionForm.is_published} onChange={e => setCollectionForm({ ...collectionForm, is_published: e.target.checked })} /> Published
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="rounded-full bg-[hsl(42_85%_52%)] px-5 py-2.5 text-sm font-semibold text-charcoal hover:brightness-110">{editingCollectionId ? "Save changes" : "Create"}</button>
                  <button type="button" onClick={resetCollectionForm} className="rounded-full px-5 py-2.5 text-sm border border-white/15">Cancel</button>
                </div>
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[hsl(42_85%_52%)]" /></div>
            ) : collections.length === 0 ? (
              <div className="text-center py-16 text-white/60">No collections yet.</div>
            ) : (
              <div className="space-y-3">
                {collections.map(c => (
                  <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
                    <div className="h-16 w-24 shrink-0 rounded-md overflow-hidden bg-black">
                      {c.cover_image_url && <img src={c.cover_image_url} alt={c.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg truncate">{c.title}</h3>
                        {!c.is_published && <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest">Draft</span>}
                      </div>
                      <p className="text-xs text-white/60 truncate">/gallery/{c.slug}{c.year ? ` · ${c.year}` : ""}{c.location ? ` · ${c.location}` : ""}</p>
                    </div>
                    <div className="flex gap-1">
                      <IconBtn title="Edit" onClick={() => startEditCollection(c)}><Pencil className="h-3.5 w-3.5" /></IconBtn>
                      <IconBtn title="Delete" onClick={() => removeCollection(c)} danger><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, type = "text", required, textarea }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; textarea?: boolean;
}) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-white/60 mb-1">{label}</span>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} required={required} rows={3}
        className="w-full rounded-lg bg-black/30 border border-white/10 focus:border-[hsl(42_85%_52%)]/60 outline-none px-3 py-2 text-sm" />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full rounded-lg bg-black/30 border border-white/10 focus:border-[hsl(42_85%_52%)]/60 outline-none px-3 py-2 text-sm" />
    )}
  </label>
);

const Select = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) => (
  <label className="block">
    <span className="block text-xs uppercase tracking-widest text-white/60 mb-1">{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg bg-black/30 border border-white/10 focus:border-[hsl(42_85%_52%)]/60 outline-none px-3 py-2 text-sm">
      {options.map(o => <option key={o.value} value={o.value} className="bg-charcoal">{o.label}</option>)}
    </select>
  </label>
);

const IconBtn = ({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) => (
  <button type="button" onClick={onClick} title={title}
    className={`inline-flex items-center justify-center h-8 min-w-8 px-2 rounded-md border text-xs ${danger ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : "border-white/15 text-white/80 hover:bg-white/10"}`}>
    {children}
  </button>
);

export default GalleryAdmin;
