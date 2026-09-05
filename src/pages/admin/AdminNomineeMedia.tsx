/**
 * Admin / NRC nominee media review queue + media-coverage dashboard.
 *
 * Approving or rejecting an image here NEVER touches the nominee's nomination
 * status, NRC verification, judging or award result — it only decides which
 * visual the public catalogue renders.
 */
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, ImageOff, Loader2, Search, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LightInitialsAvatar } from "@/components/awards/branded/LightInitialsAvatar";
import { MEDIA_STATUS_LABEL, type NomineeMediaStatus } from "@/lib/nomineeMediaResolver";

interface ReviewRow {
  nominee_id: string;
  nominee_name: string;
  nominee_slug: string | null;
  organization: string | null;
  country: string | null;
  region: string | null;
  website: string | null;
  publication_status: string | null;
  nrc_verified: boolean | null;
  photo_url: string | null;
  logo_url: string | null;
  category_slug: string | null;
  category_name: string | null;
  subcategory_slug: string | null;
  subcategory_name: string | null;
  entity_type: string | null;
  media_kind: string | null;
  media_status: string;
  candidate_image_url: string | null;
  approved_asset_url: string | null;
  source_url: string | null;
  source_domain: string | null;
  source_type: string | null;
  confidence: number | null;
  verification_note: string | null;
  submitted_by_nominee: boolean | null;
  approved_for_public: boolean | null;
}

const STATUSES: NomineeMediaStatus[] = [
  "missing",
  "candidate_found",
  "verification_required",
  "verified",
  "rejected",
  "manually_approved",
  "fallback",
];

export default function AdminNomineeMedia() {
  const { user, hasRole } = useAuth();
  const isStaff = !!user && (hasRole("admin") || hasRole("nrc"));

  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pubFilter, setPubFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!isStaff) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("v_nominee_media_review")
        .select("*")
        .order("nominee_name", { ascending: true })
        .limit(5000);
      if (!active) return;
      if (err) setError(err.message);
      else setRows((data ?? []) as unknown as ReviewRow[]);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [isStaff]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of rows) if (r.category_slug) map.set(r.category_slug, r.category_name ?? r.category_slug);
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.media_status !== statusFilter) return false;
      if (pubFilter !== "all" && r.publication_status !== pubFilter) return false;
      if (typeFilter !== "all") {
        const isOrg = (r.entity_type ?? "") === "organization" || !!r.organization;
        if (typeFilter === "organization" && !isOrg) return false;
        if (typeFilter === "individual" && isOrg) return false;
      }
      if (categoryFilter !== "all" && r.category_slug !== categoryFilter) return false;
      if (!q) return true;
      return `${r.nominee_name} ${r.organization ?? ""} ${r.country ?? ""} ${r.region ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, statusFilter, pubFilter, typeFilter, categoryFilter]);

  const coverage = useMemo(() => buildCoverage(rows), [rows]);

  async function updateStatus(
    row: ReviewRow,
    status: NomineeMediaStatus,
    assetUrl?: string | null,
  ) {
    setBusyId(row.nominee_id);
    const approved = status === "verified" || status === "manually_approved";
    const payload = {
      nominee_id: row.nominee_id,
      nominee_slug: row.nominee_slug,
      nominee_name: row.nominee_name,
      entity_type: (row.entity_type ?? (row.organization ? "organization" : "unknown")) as string,
      media_kind: (row.organization || row.entity_type === "organization" ? "logo" : "portrait") as
        | "logo"
        | "portrait",
      media_status: status,
      approved_asset_url: approved ? assetUrl ?? row.candidate_image_url ?? row.approved_asset_url : row.approved_asset_url,
      approved_for_public: approved,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
      date_checked: new Date().toISOString(),
    };
    const { error: err } = await supabase
      .from("nominee_media_sourcing")
      .upsert(payload, { onConflict: "nominee_id" });
    setBusyId(null);
    if (err) {
      toast.error(`Could not save: ${err.message}`);
      return;
    }
    toast.success(
      `${row.nominee_name} — image marked ${MEDIA_STATUS_LABEL[status].toLowerCase()} (recognition status unchanged)`,
    );
    setRows((prev) =>
      prev.map((r) =>
        r.nominee_id === row.nominee_id
          ? {
              ...r,
              media_status: status,
              approved_for_public: approved,
              approved_asset_url: payload.approved_asset_url ?? null,
            }
          : r,
      ),
    );
  }

  async function replaceImage(row: ReviewRow) {
    const url = window.prompt(`Approved image URL for ${row.nominee_name}`, row.candidate_image_url ?? "");
    if (!url) return;
    await updateStatus(row, "manually_approved", url.trim());
  }

  if (!isStaff) return <Navigate to="/" replace />;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Nominee Media Review | NESA-Africa Admin</title>
        <meta name="description" content="Review, approve and track nominee logos and portraits." />
      </Helmet>

      <div className="space-y-6">
        <header>
          <h1 className="font-serif text-2xl font-bold">Nominee Media Review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approving an image here affects the public catalogue only. It does not change
            nomination approval, NRC verification, judging or award results.
          </p>
        </header>

        <Tabs defaultValue="queue">
          <TabsList>
            <TabsTrigger value="queue">Review queue</TabsTrigger>
            <TabsTrigger value="coverage">Coverage dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4 pt-4">
            <div className="grid gap-3 md:grid-cols-5">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search name, organisation, country, region…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <FilterSelect value={statusFilter} onChange={setStatusFilter} label="Media status"
                options={[["all", "All statuses"], ...STATUSES.map((s) => [s, MEDIA_STATUS_LABEL[s]] as [string, string])]} />
              <FilterSelect value={pubFilter} onChange={setPubFilter} label="Publication"
                options={[["all", "All publication states"], ["published", "Published"], ["draft", "Draft"], ["unpublished", "Unpublished"]]} />
              <FilterSelect value={typeFilter} onChange={setTypeFilter} label="Type"
                options={[["all", "Individuals + organisations"], ["organization", "Organisation"], ["individual", "Individual"]]} />
              <FilterSelect value={categoryFilter} onChange={setCategoryFilter} label="Category"
                options={[["all", "All categories"], ...categories]} />
            </div>

            <p className="text-xs text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length.toLocaleString()} of ${rows.length.toLocaleString()} nominees match`}
            </p>

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
                Could not load the review list: {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 py-12 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading nominee media…
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.slice(0, 300).map((row) => (
                  <Card key={row.nominee_id}>
                    <CardContent className="flex flex-col gap-4 p-4 md:flex-row">
                      <div className="flex gap-3">
                        <Frame label="Current">
                          {row.approved_asset_url || row.photo_url || row.logo_url ? (
                            <img
                              src={(row.approved_asset_url || row.photo_url || row.logo_url) as string}
                              alt={row.nominee_name}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <LightInitialsAvatar name={row.nominee_name} size="sm" />
                          )}
                        </Frame>
                        <Frame label="Candidate">
                          {row.candidate_image_url ? (
                            <img
                              src={row.candidate_image_url}
                              alt={`Candidate image for ${row.nominee_name}`}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                              <ImageOff className="h-5 w-5" />
                            </div>
                          )}
                        </Frame>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{row.nominee_name}</p>
                          <Badge variant="outline">{row.organization || row.entity_type === "organization" ? "Organisation" : "Individual"}</Badge>
                          <Badge variant="outline">{row.publication_status ?? "—"}</Badge>
                          <Badge className="bg-gold/15 text-gold" variant="outline">
                            {MEDIA_STATUS_LABEL[(row.media_status as NomineeMediaStatus) ?? "missing"]}
                          </Badge>
                          {row.submitted_by_nominee && <Badge variant="outline">Nominee submitted</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[row.category_name, row.subcategory_name, row.country, row.region]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="mt-1 break-all text-xs text-muted-foreground">
                          {row.website ? `Website: ${row.website}` : "No website on record"}
                          {row.source_url ? ` · Source: ${row.source_url}` : ""}
                          {typeof row.confidence === "number" ? ` · Confidence ${(row.confidence * 100).toFixed(0)}%` : ""}
                        </p>
                        {row.verification_note && (
                          <p className="mt-1 text-xs text-muted-foreground">{row.verification_note}</p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-start gap-2">
                        <Button
                          size="sm"
                          disabled={busyId === row.nominee_id || !row.candidate_image_url}
                          onClick={() => updateStatus(row, "verified")}
                        >
                          <Check className="mr-1 h-4 w-4" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === row.nominee_id}
                          onClick={() => updateStatus(row, "rejected")}
                        >
                          <X className="mr-1 h-4 w-4" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === row.nominee_id}
                          onClick={() => replaceImage(row)}
                        >
                          <Upload className="mr-1 h-4 w-4" /> Replace
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filtered.length > 300 && (
                  <p className="text-xs text-muted-foreground">
                    Showing the first 300 matches — narrow the filters to review the rest.
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="coverage" className="space-y-6 pt-4">
            {(["published", "draft", "unpublished"] as const).map((state) => {
              const c = coverage.byPublication[state];
              return (
                <Card key={state}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base capitalize">{state}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-6">
                    <Stat label="Total nominees" value={c.total} />
                    <Stat label="Verified media" value={c.verified} />
                    <Stat label="Awaiting review" value={c.candidate} />
                    <Stat label="Branded fallback" value={c.fallback} />
                    <Stat label="Missing" value={c.missing} />
                    <Stat label="Coverage" value={`${pct(c.verified, c.total)}%`} />
                  </CardContent>
                </Card>
              );
            })}

            <BreakdownTable title="By category" rows={coverage.byCategory} />
            <BreakdownTable title="By subcategory" rows={coverage.bySubcategory} />
            <BreakdownTable title="Organisation vs individual" rows={coverage.byType} />
            <BreakdownTable title="By region" rows={coverage.byRegion} />
            <BreakdownTable title="By country" rows={coverage.byCountry} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function Frame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="h-20 w-20 overflow-hidden rounded-lg border border-border bg-muted">{children}</div>
      <p className="mt-1 text-center text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: Array<[string, string]>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface Bucket {
  key: string;
  total: number;
  verified: number;
  candidate: number;
  fallback: number;
  missing: number;
}

const emptyBucket = (key: string): Bucket => ({ key, total: 0, verified: 0, candidate: 0, fallback: 0, missing: 0 });

function pct(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 1000) / 10;
}

function tally(bucket: Bucket, row: ReviewRow) {
  bucket.total += 1;
  const status = row.media_status;
  const hasImage = Boolean(row.approved_asset_url || row.photo_url || row.logo_url);
  if ((status === "verified" || status === "manually_approved") && hasImage) bucket.verified += 1;
  else if (status === "candidate_found" || status === "verification_required") bucket.candidate += 1;
  else if (status === "missing") bucket.missing += 1;
  else bucket.fallback += 1;
}

function buildCoverage(rows: ReviewRow[]) {
  const byPublication: Record<"published" | "draft" | "unpublished", Bucket> = {
    published: emptyBucket("published"),
    draft: emptyBucket("draft"),
    unpublished: emptyBucket("unpublished"),
  };
  const group = (map: Map<string, Bucket>, key: string, row: ReviewRow) => {
    if (!map.has(key)) map.set(key, emptyBucket(key));
    tally(map.get(key)!, row);
  };
  const cat = new Map<string, Bucket>();
  const sub = new Map<string, Bucket>();
  const type = new Map<string, Bucket>();
  const region = new Map<string, Bucket>();
  const country = new Map<string, Bucket>();

  for (const row of rows) {
    const state = (row.publication_status ?? "draft") as keyof typeof byPublication;
    if (byPublication[state]) tally(byPublication[state], row);
    group(cat, row.category_name ?? "Uncategorised", row);
    group(sub, row.subcategory_name ?? "No subcategory", row);
    group(type, row.organization || row.entity_type === "organization" ? "Organisation" : "Individual", row);
    group(region, row.region ?? "Region not recorded", row);
    group(country, row.country ?? "Country not recorded", row);
  }

  const sort = (m: Map<string, Bucket>) => [...m.values()].sort((a, b) => b.total - a.total);
  return {
    byPublication,
    byCategory: sort(cat),
    bySubcategory: sort(sub),
    byType: sort(type),
    byRegion: sort(region),
    byCountry: sort(country),
  };
}

function BreakdownTable({ title, rows }: { title: string; rows: Bucket[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2">Group</th>
              <th className="py-2 text-right">Total</th>
              <th className="py-2 text-right">Verified</th>
              <th className="py-2 text-right">Awaiting</th>
              <th className="py-2 text-right">Fallback</th>
              <th className="py-2 text-right">Missing</th>
              <th className="py-2 text-right">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 40).map((b) => (
              <tr key={b.key} className="border-b border-border/60">
                <td className="py-1.5 pr-3">{b.key}</td>
                <td className="py-1.5 text-right">{b.total.toLocaleString()}</td>
                <td className="py-1.5 text-right">{b.verified.toLocaleString()}</td>
                <td className="py-1.5 text-right">{b.candidate.toLocaleString()}</td>
                <td className="py-1.5 text-right">{b.fallback.toLocaleString()}</td>
                <td className="py-1.5 text-right">{b.missing.toLocaleString()}</td>
                <td className="py-1.5 text-right">{pct(b.verified, b.total)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
