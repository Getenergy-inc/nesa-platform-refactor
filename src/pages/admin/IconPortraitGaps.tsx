import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ICON_NOMINEES,
  ICON_SUBCATEGORIES,
  ICON_CLASSIFICATIONS,
  type IconSubcategorySlug,
  type IconClassificationSlug,
} from "@/data/iconAward";
import { ICON_IMAGE_MANIFEST } from "@/data/iconAward/imageManifest";
import { PublicLayout } from "@/components/layout/PublicLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Download, ExternalLink, ImageOff, Upload, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PLACEHOLDER = "placeholder-icon";

const nameSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Same peel-off logic that resolveIconImage tries, exposed for the audit view.
function buildCandidateSlugs(slug: string, nSlug: string): string[] {
  const out = new Set<string>();
  for (const seed of [slug, nSlug]) {
    if (!seed) continue;
    out.add(seed);
    const stripped = seed.replace(/^(dr|prof|professor|hon|sir|mr|mrs|ms)-/, "");
    out.add(stripped);
    const parts = stripped.split("-");
    while (parts.length > 1) {
      parts.pop();
      out.add(parts.join("-"));
    }
  }
  return [...out];
}

// Levenshtein for near-match suggestions.
function lev(a: string, b: string): number {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
  return dp[m][n];
}

const MANIFEST_KEYS = Object.keys(ICON_IMAGE_MANIFEST);

function nearestManifestSlugs(slug: string, nSlug: string, limit = 3) {
  const bases = [slug, nSlug].filter(Boolean);
  const scored = MANIFEST_KEYS.map((k) => {
    const best = Math.min(...bases.map((b) => lev(b, k)));
    return { slug: k, distance: best, url: ICON_IMAGE_MANIFEST[k] };
  });
  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, limit);
}

const subShort = (s: string) =>
  ICON_SUBCATEGORIES.find((x) => x.slug === (s as IconSubcategorySlug))?.short ?? s;
const clsShort = (s: string) =>
  ICON_CLASSIFICATIONS.find((x) => x.slug === (s as IconClassificationSlug))?.short ?? s;

interface Gap {
  id: string;
  name: string;
  slug: string;
  nSlug: string;
  sub: IconSubcategorySlug;
  cls: IconClassificationSlug;
  country: string;
  region: string;
  candidatesTried: string[];
  nearest: { slug: string; distance: number; url: string }[];
  expectedFileHint: string;
}

const GAPS: Gap[] = ICON_NOMINEES.filter((n) => n.image_url.includes(PLACEHOLDER)).map(
  (n) => {
    const nSlug = nameSlug(n.name);
    return {
      id: n.id,
      name: n.name,
      slug: n.slug,
      nSlug,
      sub: n.award_subcategory_slug,
      cls: n.classification_slug,
      country: n.country,
      region: n.region,
      candidatesTried: buildCandidateSlugs(n.slug, nSlug),
      nearest: nearestManifestSlugs(n.slug, nSlug),
      expectedFileHint: `public/images/africaicons/${n.slug}.jpg`,
    };
  },
);

const copy = (t: string) => {
  navigator.clipboard.writeText(t).then(
    () => toast({ title: "Copied", description: t }),
    () => toast({ title: "Copy failed", variant: "destructive" }),
  );
};

function csvCell(value: string | number) {
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, "\"\"")}"`;
  return s;
}

function exportGapsToCSV() {
  const headers = [
    "id",
    "name",
    "slug",
    "name_slug_fallback",
    "subcategory",
    "classification",
    "country",
    "region",
    "tried_slugs",
    "suggested_drop_path",
    "nearest_manifest_slug_1",
    "nearest_distance_1",
    "nearest_manifest_slug_2",
    "nearest_distance_2",
    "nearest_manifest_slug_3",
    "nearest_distance_3",
  ];
  const rows = GAPS.map((g) => [
    g.id,
    g.name,
    g.slug,
    g.nSlug,
    subShort(g.sub),
    clsShort(g.cls),
    g.country,
    g.region,
    g.candidatesTried.join(" | "),
    g.expectedFileHint,
    g.nearest[0]?.slug ?? "",
    g.nearest[0]?.distance ?? "",
    g.nearest[1]?.slug ?? "",
    g.nearest[1]?.distance ?? "",
    g.nearest[2]?.slug ?? "",
    g.nearest[2]?.distance ?? "",
  ]);
  const csv = [headers.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `icon-portrait-gaps-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast({ title: "CSV exported", description: `${GAPS.length} gap(s) downloaded` });
}

// ---------- CSV import ----------

const OVERRIDES_STORAGE_KEY = "icon-portrait-overrides:v1";

type OverrideStatus = "verified" | "missing";
interface OverrideEntry {
  path: string;
  status: OverrideStatus;
  source_row?: number;
}
type OverridesMap = Record<string, OverrideEntry>;

// Minimal RFC4180-ish CSV parser (handles quotes, escaped quotes, commas, newlines).
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(cell);
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell);
        cell = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else {
        cell += c;
      }
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function normaliseHeader(h: string) {
  return h.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

// Resolve a user-supplied path to a URL loadable by the browser from /public.
function toPublicUrl(raw: string): string {
  let p = raw.trim();
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  p = p.replace(/^\.?\/+/, "");
  p = p.replace(/^public\//, "");
  if (!p.startsWith("/")) p = "/" + p;
  return p;
}

function verifyImage(url: string, timeoutMs = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const done = (ok: boolean) => {
      img.onload = img.onerror = null;
      resolve(ok);
    };
    const t = setTimeout(() => done(false), timeoutMs);
    img.onload = () => {
      clearTimeout(t);
      done(true);
    };
    img.onerror = () => {
      clearTimeout(t);
      done(false);
    };
    img.src = url;
  });
}

function loadOverrides(): OverridesMap {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OverridesMap) : {};
  } catch {
    return {};
  }
}

function saveOverrides(o: OverridesMap) {
  try {
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(o));
  } catch {
    /* noop */
  }
}

export default function IconPortraitGaps() {
  const [q, setQ] = useState("");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [onlyUnresolved, setOnlyUnresolved] = useState(false);
  const [overrides, setOverrides] = useState<OverridesMap>({});
  const [importing, setImporting] = useState(false);
  const [lastImport, setLastImport] = useState<{
    fileName: string;
    total: number;
    verified: number;
    missing: number;
    unmatched: number;
    unmatchedKeys: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const bySlug = useMemo(() => {
    const m: Record<string, Gap> = {};
    for (const g of GAPS) {
      m[g.slug] = g;
      m[g.nSlug] = g;
    }
    return m;
  }, []);
  const byId = useMemo(() => {
    const m: Record<string, Gap> = {};
    for (const g of GAPS) m[g.id] = g;
    return m;
  }, []);

  async function handleCSVFile(file: File) {
    setImporting(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (!rows.length) {
        toast({ title: "Empty CSV", variant: "destructive" });
        return;
      }
      const headers = rows[0].map(normaliseHeader);
      const idx = (name: string) => headers.indexOf(name);
      const idIdx = idx("id");
      const slugIdx = idx("slug");
      const pathCandidates = [
        "resolved_path",
        "image_path",
        "new_image_path",
        "image_url",
        "suggested_drop_path",
      ];
      const pathIdx = pathCandidates.map(idx).find((i) => i >= 0) ?? -1;
      if (pathIdx < 0) {
        toast({
          title: "Missing path column",
          description: `Expected one of: ${pathCandidates.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      const next: OverridesMap = { ...loadOverrides() };
      const unmatched: string[] = [];
      let verified = 0;
      let missing = 0;
      let total = 0;

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.every((c) => !c.trim())) continue;
        const rawPath = row[pathIdx]?.trim();
        if (!rawPath) continue;
        total++;
        const rowId = idIdx >= 0 ? row[idIdx]?.trim() : "";
        const rowSlug = slugIdx >= 0 ? row[slugIdx]?.trim() : "";
        const gap =
          (rowId && byId[rowId]) ||
          (rowSlug && bySlug[rowSlug]) ||
          null;
        if (!gap) {
          unmatched.push(rowId || rowSlug || `row ${r + 1}`);
          continue;
        }
        const url = toPublicUrl(rawPath);
        // Skip if it still points at the placeholder
        if (url.includes("placeholder-icon")) {
          missing++;
          next[gap.id] = { path: url, status: "missing", source_row: r + 1 };
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        const ok = await verifyImage(url);
        if (ok) verified++;
        else missing++;
        next[gap.id] = {
          path: url,
          status: ok ? "verified" : "missing",
          source_row: r + 1,
        };
      }

      saveOverrides(next);
      setOverrides(next);
      setLastImport({
        fileName: file.name,
        total,
        verified,
        missing,
        unmatched: unmatched.length,
        unmatchedKeys: unmatched.slice(0, 10),
      });
      toast({
        title: "CSV imported",
        description: `${verified} verified · ${missing} missing · ${unmatched.length} unmatched`,
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Import failed", description: String(err), variant: "destructive" });
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function clearOverrides() {
    saveOverrides({});
    setOverrides({});
    setLastImport(null);
    toast({ title: "Overrides cleared" });
  }

  const resolvedCount = useMemo(
    () => Object.values(overrides).filter((o) => o.status === "verified").length,
    [overrides],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GAPS.filter((g) => {
      if (subFilter !== "all" && g.sub !== subFilter) return false;
      if (onlyUnresolved && overrides[g.id]?.status === "verified") return false;
      if (!needle) return true;
      return (
        g.name.toLowerCase().includes(needle) ||
        g.slug.includes(needle) ||
        g.country.toLowerCase().includes(needle)
      );
    });
  }, [q, subFilter, onlyUnresolved, overrides]);

  const bySub = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const g of GAPS) counts[g.sub] = (counts[g.sub] ?? 0) + 1;
    return counts;
  }, []);

  return (
    <PublicLayout showFAQ={false} showExploreNomineesCTA={false}>
      <Helmet>
        <title>Icon Portrait Gaps | NESA-Africa Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <section className="container mx-auto max-w-6xl px-4 py-10 space-y-8">
        <header className="space-y-2">
          <Badge className="bg-gold/15 text-gold border border-gold/30">
            Portrait gaps
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif text-white">
            Africa Education Icon — Missing Portraits
          </h1>
          <p className="text-white/70 max-w-3xl">
            Nominees currently falling back to{" "}
            <code className="text-gold">placeholder-icon.svg</code>. Drop a JPG or
            PNG at the expected path, then rebuild the manifest for
            <code className="text-gold"> src/data/iconAward/imageManifest.ts</code>.
          </p>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-charcoal-light border-white/10">
            <CardContent className="p-4">
              <div className="text-3xl font-serif text-gold">{GAPS.length}</div>
              <div className="text-sm text-white font-medium mt-1">Total gaps</div>
              <div className="text-xs text-white/50">
                of {ICON_NOMINEES.length} nominees
              </div>
            </CardContent>
          </Card>
          {ICON_SUBCATEGORIES.map((s) => (
            <Card key={s.slug} className="bg-charcoal-light border-white/10">
              <CardContent className="p-4">
                <div className="text-3xl font-serif text-gold">
                  {bySub[s.slug] ?? 0}
                </div>
                <div className="text-sm text-white font-medium mt-1">{s.short}</div>
                <div className="text-xs text-white/50">missing portraits</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Import summary */}
        {lastImport && (
          <Card className="bg-charcoal-light border-gold/30">
            <CardContent className="p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="text-white">
                  <span className="text-white/60">Last import:</span>{" "}
                  <code className="text-gold">{lastImport.fileName}</code>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {lastImport.verified} verified
                  </span>
                  <span className="text-red-400 inline-flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> {lastImport.missing} missing
                  </span>
                  <span className="text-white/60">{lastImport.unmatched} unmatched</span>
                  <span className="text-white/50">/ {lastImport.total} rows</span>
                </div>
              </div>
              {lastImport.unmatchedKeys.length > 0 && (
                <div className="text-xs text-white/60">
                  Unmatched id/slug (first 10):{" "}
                  <code className="text-white/80">
                    {lastImport.unmatchedKeys.join(", ")}
                  </code>
                </div>
              )}
              <div className="text-xs text-white/50">
                Overrides are stored in your browser. Once verified, drop the same file
                at that path in <code className="text-gold">public/</code> and rebuild
                the manifest to persist across sessions.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <Input
              placeholder="Search by name, slug, country..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="md:max-w-sm bg-black/40 border-white/15 text-white"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={subFilter === "all" ? "default" : "outline"}
                onClick={() => setSubFilter("all")}
              >
                All ({GAPS.length})
              </Button>
              {ICON_SUBCATEGORIES.map((s) => (
                <Button
                  key={s.slug}
                  size="sm"
                  variant={subFilter === s.slug ? "default" : "outline"}
                  onClick={() => setSubFilter(s.slug)}
                >
                  {s.short} ({bySub[s.slug] ?? 0})
                </Button>
              ))}
              <Button
                size="sm"
                variant={onlyUnresolved ? "default" : "outline"}
                onClick={() => setOnlyUnresolved((v) => !v)}
              >
                Hide resolved ({resolvedCount})
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleCSVFile(f);
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              {importing ? "Importing…" : "Import CSV"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportGapsToCSV}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            {resolvedCount > 0 || lastImport ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearOverrides}
                className="text-white/70 hover:text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear overrides
              </Button>
            ) : null}
          </div>
        </div>

        {/* List */}
        <div className="grid gap-3">
          {filtered.map((g) => (
            <Card key={g.id} className="bg-charcoal-light border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <ImageOff className="w-4 h-4 text-gold/70" />
                      {g.name}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {g.country} · {g.region} · {subShort(g.sub)} · {clsShort(g.cls)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gold/30 text-gold shrink-0"
                  >
                    {g.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="rounded-md bg-black/30 border border-white/10 p-3">
                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      Nominee slug
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-gold break-all">{g.slug}</code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copy(g.slug)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    {g.nSlug !== g.slug && (
                      <div className="text-white/50 text-xs mt-2">
                        Name-slug fallback:{" "}
                        <code className="text-white/80">{g.nSlug}</code>
                      </div>
                    )}
                  </div>
                  <div className="rounded-md bg-black/30 border border-white/10 p-3">
                    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      Expected file path
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <code className="text-white/90 break-all">
                        {g.expectedFileHint}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copy(g.expectedFileHint)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-black/30 border border-white/10 p-3">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-2">
                    Candidate slugs tried by resolver
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {g.candidatesTried.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className="border-white/15 text-white/70 font-mono text-[11px]"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-md bg-black/30 border border-white/10 p-3">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-2">
                    Nearest existing manifest slugs
                  </div>
                  <div className="space-y-1.5">
                    {g.nearest.map((m) => (
                      <div
                        key={m.slug}
                        className="flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge
                            variant="outline"
                            className="border-gold/20 text-gold/80 shrink-0"
                          >
                            Δ{m.distance}
                          </Badge>
                          <code className="text-white/80 truncate">{m.slug}</code>
                        </div>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gold hover:text-gold/80 inline-flex items-center gap-1"
                        >
                          preview <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    to={`/nominees/africa-education-icon-award/${g.sub}/${g.cls}/${g.slug}`}
                    className="text-gold text-xs hover:underline inline-flex items-center gap-1"
                  >
                    Open nominee profile <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          {!filtered.length && (
            <div className="text-white/60 text-sm text-center py-12 border border-dashed border-white/10 rounded-md">
              No portrait gaps match this filter.
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
