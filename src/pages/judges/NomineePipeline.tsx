import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, ShieldAlert, FileSearch, Gavel, Send, MessageSquare, Eye } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type PipelineStatus = Database["public"]["Enums"]["pipeline_status"];

type PipelineRow = {
  nominee_id: string;
  current_status: PipelineStatus;
  last_transition_at: string;
  current_pathway_id: string | null;
  metadata: any;
  nominees: { id: string; name: string; award_family: string | null; country: string | null } | null;
  judging_pathways: { id: string; title: string; classification: string; award_category: string } | null;
};

const NRC_STATUSES: PipelineStatus[] = [
  "NOMINATION_RECEIVED",
  "AUTOMATED_SCREENING",
  "NRC_REVIEW",
  "DUPLICATE_REVIEW",
  "ELIGIBILITY_REVIEW",
  "AWAITING_ACCEPTANCE",
  "EVIDENCE_COLLECTION",
  "VERIFICATION_IN_PROGRESS",
  "VERIFICATION_COMPLETED",
  "DOSSIER_READY",
  "APPROVED_FOR_JUDGES",
];

const JUDGE_STATUSES: PipelineStatus[] = [
  "PUSHED_TO_PATHWAY",
  "UNDER_JUDGE_REVIEW",
  "CLARIFICATION_REQUIRED",
  "READY_FOR_DELIBERATION",
  "PATHWAY_DELIBERATION",
  "PATHWAY_VOTING",
  "TOP_THREE",
  "RESERVE",
  "FINAL_VOTING",
  "GOVERNANCE_VALIDATION",
  "LAUREATE_APPROVED",
];

const STATUS_LABELS: Record<PipelineStatus, string> = {
  NOMINATION_RECEIVED: "Nomination Received",
  AUTOMATED_SCREENING: "Automated Screening",
  NRC_REVIEW: "NRC Review",
  DUPLICATE_REVIEW: "Duplicate Review",
  ELIGIBILITY_REVIEW: "Eligibility Review",
  AWAITING_ACCEPTANCE: "Awaiting Acceptance",
  EVIDENCE_COLLECTION: "Evidence Collection",
  VERIFICATION_IN_PROGRESS: "Verification in Progress",
  VERIFICATION_COMPLETED: "Verification Completed",
  DOSSIER_READY: "Dossier Ready",
  APPROVED_FOR_JUDGES: "Approved for Judges",
  PUSHED_TO_PATHWAY: "Pushed to Pathway",
  UNDER_JUDGE_REVIEW: "Under Judge Review",
  CLARIFICATION_REQUIRED: "Clarification Required",
  READY_FOR_DELIBERATION: "Ready for Deliberation",
  PATHWAY_DELIBERATION: "Pathway Deliberation",
  PATHWAY_VOTING: "Pathway Voting",
  TOP_THREE: "Top Three",
  RESERVE: "Reserve",
  FINAL_VOTING: "Final Voting",
  GOVERNANCE_VALIDATION: "Governance Validation",
  LAUREATE_APPROVED: "Laureate Approved",
  ARCHIVED: "Archived",
};

function statusTone(status: PipelineStatus): string {
  if (NRC_STATUSES.includes(status)) return "bg-amber-500/15 text-amber-700 border-amber-500/30";
  if (["LAUREATE_APPROVED", "TOP_THREE"].includes(status)) return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
  if (status === "CLARIFICATION_REQUIRED") return "bg-rose-500/15 text-rose-700 border-rose-500/30";
  if (JUDGE_STATUSES.includes(status)) return "bg-indigo-500/15 text-indigo-700 border-indigo-500/30";
  return "bg-muted text-muted-foreground border-border";
}

export default function NomineePipeline() {
  const { user, roles, loading: authLoading } = useAuth();
  const isNRC = roles.includes("nrc") || roles.includes("admin");
  const isJudge = roles.includes("jury") || roles.includes("admin");
  const allowed = isNRC || isJudge;

  const [rows, setRows] = useState<PipelineRow[]>([]);
  const [pathways, setPathways] = useState<Array<{ id: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"nrc" | "judge">(isJudge && !isNRC ? "judge" : "nrc");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pathwayFilter, setPathwayFilter] = useState<string>("all");

  useEffect(() => {
    if (!allowed) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [{ data: pipeline, error: pErr }, { data: pw }] = await Promise.all([
        supabase
          .from("nominee_pipeline_status")
          .select(
            "nominee_id, current_status, last_transition_at, current_pathway_id, metadata, nominees:nominees!nominee_pipeline_status_nominee_id_fkey(id,name,award_family,country), judging_pathways:judging_pathways!nominee_pipeline_status_current_pathway_id_fkey(id,title,classification,award_category)"
          )
          .order("last_transition_at", { ascending: false })
          .limit(500),
        supabase.from("judging_pathways").select("id,title").eq("is_active", true).order("pathway_number"),
      ]);
      if (cancelled) return;
      if (pErr) setError(pErr.message);
      setRows((pipeline as any) ?? []);
      setPathways((pw as any) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  const scopedStatuses = tab === "nrc" ? NRC_STATUSES : JUDGE_STATUSES;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (!scopedStatuses.includes(r.current_status)) return false;
      if (statusFilter !== "all" && r.current_status !== statusFilter) return false;
      if (pathwayFilter !== "all" && r.current_pathway_id !== pathwayFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = r.nominees?.name?.toLowerCase() ?? "";
        const country = r.nominees?.country?.toLowerCase() ?? "";
        if (!name.includes(q) && !country.includes(q)) return false;
      }
      return true;
    });
  }, [rows, scopedStatuses, statusFilter, pathwayFilter, search]);

  const stats = useMemo(() => {
    const bucket = (list: PipelineStatus[]) =>
      rows.filter((r) => list.includes(r.current_status)).length;
    return {
      nrcActive: bucket(NRC_STATUSES),
      readyForJudges: rows.filter((r) => r.current_status === "APPROVED_FOR_JUDGES").length,
      judgeActive: bucket(JUDGE_STATUSES),
      clarification: rows.filter((r) => r.current_status === "CLARIFICATION_REQUIRED").length,
      finalists: rows.filter((r) => ["TOP_THREE", "FINAL_VOTING", "LAUREATE_APPROVED"].includes(r.current_status)).length,
      total: rows.length,
    };
  }, [rows]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/auth/login?next=${encodeURIComponent("/judges/nominee-pipeline")}`} replace />;
  }

  if (!allowed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
        <h1 className="mt-4 text-xl font-semibold">Restricted workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The Nominee Pipeline is only available to NRC members, judges, and administrators.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Helmet>
        <title>Nominee Pipeline · NESA-Africa 2026 Judges & NRC</title>
        <meta
          name="description"
          content="Shared operational view of nominees moving through NRC verification and Judges review — role-scoped actions and confidentiality boundaries."
        />
      </Helmet>

      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Judges & NRC</p>
            <h1 className="font-playfair text-3xl font-semibold">Nominee Pipeline</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              One shared reference for every nominee — with role-scoped actions, dossiers, and evidence boundaries.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isNRC && (
              <Badge variant="outline" className="border-amber-500/40 text-amber-700">
                NRC access
              </Badge>
            )}
            {isJudge && (
              <Badge variant="outline" className="border-indigo-500/40 text-indigo-700">
                Judge access
              </Badge>
            )}
          </div>
        </div>
      </header>

      <section aria-label="Pipeline statistics" className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">
        {[
          { label: "Total tracked", value: stats.total },
          { label: "NRC active", value: stats.nrcActive },
          { label: "Ready for judges", value: stats.readyForJudges },
          { label: "Judge active", value: stats.judgeActive },
          { label: "Clarifications", value: stats.clarification },
          { label: "Finalists / Laureates", value: stats.finalists },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{loading ? "—" : s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setStatusFilter("all"); }}>
        <TabsList>
          {isNRC && <TabsTrigger value="nrc">NRC View</TabsTrigger>}
          {isJudge && <TabsTrigger value="judge">Judge View</TabsTrigger>}
        </TabsList>

        <Card className="mt-4">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-base">
              {tab === "nrc" ? "NRC verification queue" : "Judge review queue"}
            </CardTitle>
            <div className="flex flex-col gap-2 md:flex-row">
              <Input
                placeholder="Search by nominee or country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:w-64"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-56"><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {scopedStatuses.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={pathwayFilter} onValueChange={setPathwayFilter}>
                <SelectTrigger className="md:w-56"><SelectValue placeholder="All pathways" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All pathways</SelectItem>
                  {pathways.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="nrc" className="m-0">
              <PipelineTable
                mode="nrc"
                rows={filtered}
                loading={loading}
                error={error}
              />
            </TabsContent>
            <TabsContent value="judge" className="m-0">
              <PipelineTable
                mode="judge"
                rows={filtered}
                loading={loading}
                error={error}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <p className="mt-6 text-xs text-muted-foreground">
        Confidentiality: NRC never sees judge scores or deliberation content. Judges never see raw NRC notes or PII — only the sanitized dossier version pushed to their pathway.
      </p>
    </div>
  );
}

function PipelineTable({
  mode,
  rows,
  loading,
  error,
}: {
  mode: "nrc" | "judge";
  rows: PipelineRow[];
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load pipeline: {error}
      </div>
    );
  }
  if (rows.length === 0) {
    return (
      <div className="p-10 text-center text-sm text-muted-foreground">
        No nominees match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nominee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pathway</TableHead>
            <TableHead>Last update</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.nominee_id}>
              <TableCell>
                <div className="font-medium">{r.nominees?.name ?? "Unknown"}</div>
                <div className="text-xs text-muted-foreground">
                  {r.nominees?.award_family ?? "—"}
                  {r.nominees?.country ? ` · ${r.nominees.country}` : ""}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={statusTone(r.current_status)}>
                  {STATUS_LABELS[r.current_status]}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {r.judging_pathways?.title ?? <span className="text-muted-foreground">Not assigned</span>}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(r.last_transition_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {mode === "nrc" ? (
                  <NRCActions row={r} />
                ) : (
                  <JudgeActions row={r} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function NRCActions({ row }: { row: PipelineRow }) {
  const canPush = row.current_status === "APPROVED_FOR_JUDGES";
  return (
    <div className="flex justify-end gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link to={`/nrc/cases/${row.nominee_id}`}>
          <FileSearch className="mr-1.5 h-3.5 w-3.5" /> Dossier
        </Link>
      </Button>
      <Button asChild size="sm" variant={canPush ? "default" : "outline"} disabled={!canPush}>
        <Link to={`/nrc/cases/${row.nominee_id}?action=push`}>
          <Send className="mr-1.5 h-3.5 w-3.5" /> Push to pathway
        </Link>
      </Button>
    </div>
  );
}

function JudgeActions({ row }: { row: PipelineRow }) {
  const inReview = ["PUSHED_TO_PATHWAY", "UNDER_JUDGE_REVIEW", "CLARIFICATION_REQUIRED", "READY_FOR_DELIBERATION"].includes(row.current_status);
  const canDeliberate = ["PATHWAY_DELIBERATION", "PATHWAY_VOTING"].includes(row.current_status);
  return (
    <div className="flex justify-end gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link to={`/judges/my-panel?nominee=${row.nominee_id}`}>
          <Eye className="mr-1.5 h-3.5 w-3.5" /> View
        </Link>
      </Button>
      {inReview && (
        <Button asChild size="sm" variant="outline">
          <Link to={`/judges/my-panel?nominee=${row.nominee_id}&action=clarify`}>
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Clarify
          </Link>
        </Button>
      )}
      <Button asChild size="sm" variant={canDeliberate ? "default" : "outline"}>
        <Link to={`/judges/my-panel?nominee=${row.nominee_id}&action=score`}>
          <Gavel className="mr-1.5 h-3.5 w-3.5" /> {canDeliberate ? "Deliberate" : "Score"}
        </Link>
      </Button>
    </div>
  );
}
