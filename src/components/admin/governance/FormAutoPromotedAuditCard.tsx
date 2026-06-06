import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type FormKindFilter = "all" | "rmsa-region" | "award-category";

interface PromotionRow {
  id: string;
  created_at: string;
  actor_id: string | null;
  form_kind: string;
  form_slug: string;
  raw_status: string;
  resolved_status: string;
}

const PAGE_SIZE = 25;

/**
 * Admin-only card listing `form_auto_promoted` audit events.
 * Filters: form kind + free-text slug. Columns: time, actor,
 * kind, slug, raw → resolved status.
 *
 * Backed by the partial unique index on
 * (metadata->>'form_kind', metadata->>'form_slug')
 * WHERE action='form_auto_promoted', so each promoted form
 * appears at most once.
 */
export function FormAutoPromotedAuditCard() {
  const [rows, setRows] = useState<PromotionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<FormKindFilter>("all");
  const [slug, setSlug] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  async function load() {
    setLoading(true);
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("audit_events")
        .select("id, created_at, actor_id, metadata", { count: "exact" })
        .eq("action", "form_auto_promoted")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (kind !== "all") {
        query = query.eq("metadata->>form_kind", kind);
      }
      const trimmed = slug.trim();
      if (trimmed) {
        query = query.ilike("metadata->>form_slug", `%${trimmed}%`);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      const mapped: PromotionRow[] = (data ?? []).map((r) => {
        const meta = (r.metadata ?? {}) as Record<string, unknown>;
        return {
          id: r.id as string,
          created_at: r.created_at as string,
          actor_id: (r.actor_id as string | null) ?? null,
          form_kind: String(meta.form_kind ?? "—"),
          form_slug: String(meta.form_slug ?? "—"),
          raw_status: String(meta.raw_status ?? "—"),
          resolved_status: String(meta.resolved_status ?? "—"),
        };
      });
      setRows(mapped);
      setTotal(count ?? 0);
    } catch (err) {
      console.error("Failed to load auto-promotion audit events", err);
      toast.error("Failed to load auto-promotion audit events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, kind]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold" />
              Form Auto-Promotions
            </CardTitle>
            <CardDescription>
              Google Forms auto-promoted by the status resolver from
              <span className="font-medium"> Link Pending </span>
              to <span className="font-medium">Active</span>. Server-side dedupe
              guarantees one row per form.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => load()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          <Select
            value={kind}
            onValueChange={(v) => {
              setPage(1);
              setKind(v as FormKindFilter);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Form kind" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="rmsa-region">RMSA Region</SelectItem>
              <SelectItem value="award-category">Award Category</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Filter by slug…"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPage(1);
                load();
              }
            }}
            className="w-[220px]"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPage(1);
              load();
            }}
          >
            Apply
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status Transition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No auto-promotion events recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell
                      className="font-mono text-xs"
                      title={r.actor_id ?? "System"}
                    >
                      {r.actor_id ? r.actor_id.slice(0, 8) : "System"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-gold/40 text-gold">
                        {r.form_kind}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.form_slug}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="text-muted-foreground">{r.raw_status}</span>
                      <span className="mx-2">→</span>
                      <span className="text-gold font-medium">
                        {r.resolved_status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} · {total} event
              {total === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
