import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Loader2, Pencil, Save, Search, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PipelineStage =
  | "under_review"
  | "awaiting_info"
  | "draft_pending_approval"
  | "contacted_needs_verification"
  | "no_response_required"
  | "withdrawn_closed";

type VacancyStatus =
  | "active"
  | "expiring_soon"
  | "needs_correction"
  | "expired"
  | "under_review";

interface VacancyCategory {
  id: string;
  name: string;
  status: VacancyStatus;
  notes: string | null;
  display_order: number;
}

interface Applicant {
  id: string;
  full_name: string;
  category_id: string;
  current_status: string;
  next_action: string;
  pipeline_stage: PipelineStage;
  notes: string | null;
}

const STAGES: { key: PipelineStage; label: string; className: string }[] = [
  { key: "under_review", label: "Under review", className: "bg-gold/15 text-gold border-gold/40" },
  { key: "awaiting_info", label: "Awaiting info", className: "bg-amber-500/15 text-amber-400 border-amber-500/40" },
  { key: "draft_pending_approval", label: "Draft pending approval", className: "bg-sky-500/15 text-sky-400 border-sky-500/40" },
  { key: "contacted_needs_verification", label: "Contacted / verify", className: "bg-violet-500/15 text-violet-400 border-violet-500/40" },
  { key: "no_response_required", label: "No response required", className: "bg-muted text-muted-foreground border-border" },
  { key: "withdrawn_closed", label: "Withdrawn / closed", className: "bg-destructive/15 text-destructive border-destructive/40" },
];

const STAGE_LABEL = Object.fromEntries(STAGES.map((s) => [s.key, s.label])) as Record<
  PipelineStage,
  string
>;

const VACANCY_STATUS_LABEL: Record<VacancyStatus, string> = {
  active: "Active",
  expiring_soon: "Expiring soon",
  needs_correction: "Needs correction",
  expired: "Expired",
  under_review: "Under review",
};

export default function AdminRecruitmentTracker() {
  const { user, hasRole, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState<VacancyCategory[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Applicant | null>(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = !!user && hasRole("admin");

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    (async () => {
      setLoading(true);
      const [catRes, appRes] = await Promise.all([
        supabase
          .from("recruitment_vacancy_categories")
          .select("id,name,status,notes,display_order")
          .order("display_order", { ascending: true }),
        supabase
          .from("recruitment_applicants")
          .select("id,full_name,category_id,current_status,next_action,pipeline_stage,notes")
          .order("full_name", { ascending: true }),
      ]);
      if (!active) return;
      if (catRes.error || appRes.error) {
        toast.error(catRes.error?.message ?? appRes.error?.message ?? "Failed to load tracker");
      } else {
        setCategories((catRes.data ?? []) as VacancyCategory[]);
        setApplicants((appRes.data ?? []) as Applicant[]);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );

  const totals = useMemo(() => {
    const counts = Object.fromEntries(STAGES.map((s) => [s.key, 0])) as Record<
      PipelineStage,
      number
    >;
    applicants.forEach((a) => {
      counts[a.pipeline_stage] = (counts[a.pipeline_stage] ?? 0) + 1;
    });
    return counts;
  }, [applicants]);

  const flagged = useMemo(
    () => categories.filter((c) => c.status === "expired" || c.status === "needs_correction"),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applicants.filter((a) => {
      if (categoryFilter !== "all" && a.category_id !== categoryFilter) return false;
      if (stageFilter !== "all" && a.pipeline_stage !== stageFilter) return false;
      if (!q) return true;
      const category = categoryById.get(a.category_id)?.name ?? "";
      return (
        a.full_name.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        a.current_status.toLowerCase().includes(q) ||
        a.next_action.toLowerCase().includes(q) ||
        (a.notes?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [applicants, query, categoryFilter, stageFilter, categoryById]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasRole("admin")) return <Navigate to="/unauthorized" replace />;

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    const { error } = await supabase
      .from("recruitment_applicants")
      .update({
        current_status: editing.current_status,
        next_action: editing.next_action,
        pipeline_stage: editing.pipeline_stage,
        notes: editing.notes,
      })
      .eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setApplicants((prev) => prev.map((a) => (a.id === editing.id ? editing : a)));
    setEditing(null);
    toast.success("Applicant updated");
  }

  return (
    <DashboardLayout>
      <Helmet>
        <title>Recruitment Tracker | NESA-Africa Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl text-gold">Recruitment Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Internal applicant register across {categories.length} vacancy categories —{" "}
            {applicants.length} candidates. Private: administrators only.
          </p>
        </div>

        {flagged.length > 0 && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-destructive">Listings needing urgent action</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {flagged.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium text-foreground">{c.name}</span> —{" "}
                      {VACANCY_STATUS_LABEL[c.status]}
                      {c.notes ? `: ${c.notes}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STAGES.map((s) => (
            <Card key={s.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gold">{totals[s.key] ?? 0}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, category, status or next action"
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="md:w-64">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="All stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading register…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No applicants match these filters.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Current status</th>
                  <th className="px-4 py-3 font-medium">Next action</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium text-right">Edit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const stage = STAGES.find((s) => s.key === a.pipeline_stage);
                  return (
                    <tr key={a.id} className="border-t border-border/60 align-top">
                      <td className="px-4 py-3 font-medium">{a.full_name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {categoryById.get(a.category_id)?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[18rem]">
                        {a.current_status || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[18rem]">
                        {a.next_action || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn("whitespace-nowrap", stage?.className)}>
                          {STAGE_LABEL[a.pipeline_stage]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => setEditing({ ...a })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.full_name}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current status</Label>
                <Textarea
                  value={editing.current_status}
                  onChange={(e) => setEditing({ ...editing, current_status: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Next action</Label>
                <Textarea
                  value={editing.next_action}
                  onChange={(e) => setEditing({ ...editing, next_action: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Pipeline stage</Label>
                <Select
                  value={editing.pipeline_stage}
                  onValueChange={(v) =>
                    setEditing({ ...editing, pipeline_stage: v as PipelineStage })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editing.notes ?? ""}
                  onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)} disabled={saving}>
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
