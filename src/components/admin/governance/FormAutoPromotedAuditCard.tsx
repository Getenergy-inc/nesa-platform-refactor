import { useMemo, useState } from "react";
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
import { useFormAutoPromotedAudit } from "@/hooks/useFormAutoPromotedAudit";
import { toast } from "sonner";

type FormKindFilter = "all" | "rmsa-region" | "award-category";

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
  const [kind, setKind] = useState<FormKindFilter>("all");
  const [slug, setSlug] = useState("");
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useFormAutoPromotedAudit({
    formKind: kind,
    slug,
    page,
    pageSize: PAGE_SIZE,
  });

  const rows = data?.events ?? [];
  const total = data?.total ?? 0;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  if (isError && error) {
    console.error("Failed to load auto-promotion audit events", error);
    toast.error("Failed to load auto-promotion audit events");
  }

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
          <Button variant="outline" size="sm" onClick={() => refetch()}>
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
                refetch();
              }
            }}
            className="w-[220px]"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPage(1);
              refetch();
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
