import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Check, Loader2, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORY_SLUG = "best-ngo-education-africa";

/** Records with a still-pending mapping decision — read-only in this queue. */
const FLAGGED_PENDING_DECISION = new Set([
  "Street Child",
  "Save the Children Nigeria",
  "AfriKids",
  "Slum2School Africa",
  "World Vision Rwanda",
  "Room to Read",
]);

interface Row {
  id: string;
  name: string;
  slug: string | null;
  region: string | null;
  country: string | null;
  bio: string | null;
  status: string;
  publication_status: string;
  nrc_verified: boolean | null;
  nomination_source: string | null;
  data_source: string | null;
  subcategory_id: string | null;
}

export default function AdminNGOReviewQueue() {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [subMap, setSubMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [subFilter, setSubFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAdmin = !!user && hasRole("admin");

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);

      const { data: cat, error: catErr } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", CATEGORY_SLUG)
        .maybeSingle();

      if (catErr || !cat) {
        if (!active) return;
        setError(catErr?.message ?? `Category "${CATEGORY_SLUG}" not found.`);
        setLoading(false);
        return;
      }

      const { data: subs, error: subErr } = await supabase
        .from("subcategories")
        .select("id,name")
        .eq("category_id", cat.id);

      if (subErr || !subs?.length) {
        if (!active) return;
        setError(subErr?.message ?? "No subcategories found for this category.");
        setLoading(false);
        return;
      }

      const ids = subs.map((s) => s.id);
      const { data: nominees, error: nomErr } = await supabase
        .from("nominees")
        .select(
          "id,name,slug,region,country,bio,status,publication_status,nrc_verified,nomination_source,data_source,subcategory_id",
        )
        .in("subcategory_id", ids)
        .eq("status", "under_review")
        .order("name", { ascending: true });

      if (!active) return;
      if (nomErr) {
        setError(nomErr.message);
      } else {
        setSubMap(Object.fromEntries(subs.map((s) => [s.id, s.name])));
        setRows((nominees ?? []) as Row[]);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (subFilter !== "all" && r.subcategory_id !== subFilter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.country ?? "").toLowerCase().includes(q) ||
        (r.region ?? "").toLowerCase().includes(q) ||
        (r.nomination_source ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, subFilter]);

  const bySubcategory = useMemo(() => {
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const key = subMap[r.subcategory_id ?? ""] ?? "Unmapped";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows, subMap]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasRole("admin")) return <Navigate to="/unauthorized" replace />;

  async function decide(row: Row, decision: "approved" | "rejected") {
    setBusyId(row.id);
    const payload =
      decision === "approved"
        ? { status: "approved" as const, publication_status: "published" as const }
        : { status: "rejected" as const, publication_status: "unpublished" as const };

    const { error: updErr } = await supabase.from("nominees").update(payload).eq("id", row.id);
    setBusyId(null);
    if (updErr) {
      toast.error(updErr.message);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    toast.success(
      decision === "approved" ? `${row.name} approved and published` : `${row.name} rejected`,
    );
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>NGO Africa Review Queue | NESA-Africa Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">NGO (Africa Regional) review queue</h1>
          <p className="text-sm text-muted-foreground">
            Every nomination under <code>{CATEGORY_SLUG}</code> currently sitting at{" "}
            <strong>status = under_review</strong>. Approving publishes the record; rejecting keeps
            it unpublished. Nothing here is public until it is approved.
          </p>
        </header>

        {bySubcategory.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pending by subcategory</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {bySubcategory.map(([name, count]) => (
                <Badge key={name} variant="outline" className="text-xs">
                  {name}: {count}
                </Badge>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, country, region or source"
              className="pl-9"
            />
          </div>
          <Select value={subFilter} onValueChange={setSubFilter}>
            <SelectTrigger className="sm:w-72">
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subcategories</SelectItem>
              {Object.entries(subMap).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading review queue…
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="rounded-md border border-border p-6 text-sm text-muted-foreground">
            No nominations are currently under review for this category.
          </p>
        )}

        <div className="space-y-3">
          {filtered.map((row) => {
            const locked = FLAGGED_PENDING_DECISION.has(row.name);
            return (
              <Card key={row.id}>
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{row.name}</h2>
                      <Badge variant="outline" className="text-xs">
                        {subMap[row.subcategory_id ?? ""] ?? "Unmapped"}
                      </Badge>
                      {locked && (
                        <Badge variant="secondary" className="text-xs">
                          Mapping decision pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {[row.country, row.region].filter(Boolean).join(" · ") || "No location saved"}
                    </p>
                    {row.bio && (
                      <p className="max-w-3xl text-sm text-muted-foreground">{row.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded border border-border px-2 py-0.5">
                        status: {row.status}
                      </span>
                      <span className="rounded border border-border px-2 py-0.5">
                        publication: {row.publication_status}
                      </span>
                      <span className="rounded border border-border px-2 py-0.5">
                        nrc_verified: {String(row.nrc_verified)}
                      </span>
                      <span className="rounded border border-border px-2 py-0.5">
                        nomination_source: {row.nomination_source ?? "—"}
                      </span>
                      <span className="rounded border border-border px-2 py-0.5">
                        data_source: {row.data_source ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      disabled={locked || busyId === row.id}
                      onClick={() => decide(row, "approved")}
                    >
                      {busyId === row.id ? (
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="mr-1 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={locked || busyId === row.id}
                      onClick={() => decide(row, "rejected")}
                    >
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
