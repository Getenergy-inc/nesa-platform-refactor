import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Search, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type VolunteerRow = {
  id: string;
  slug: string | null;
  full_name: string;
  country: string | null;
  region: string | null;
  team_slug: string | null;
  role: string | null;
  verification_status: string | null;
  visibility_status: string | null;
  contribution_score: number | null;
  referral_count: number | null;
  joined_at: string | null;
};

export default function AdminVolunteersCMS() {
  const { user, loading: authLoading } = useAuth();
  const [rows, setRows] = useState<VolunteerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tab, setTab] = useState<"volunteers" | "tasks">("volunteers");
  const [tasks, setTasks] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("volunteers")
      .select(
        "id, slug, full_name, country, region, team_slug, role, verification_status, visibility_status, contribution_score, referral_count, joined_at",
      )
      .order("joined_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows((data || []) as VolunteerRow[]);
    setLoading(false);
  };

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from("volunteer_tasks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) toast.error(error.message);
    setTasks(data || []);
  };

  useEffect(() => {
    load();
    loadTasks();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.verification_status !== statusFilter) return false;
      if (!needle) return true;
      return [r.full_name, r.country, r.region, r.team_slug, r.role]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(needle));
    });
  }, [rows, q, statusFilter]);

  const updateVolunteer = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("volunteers").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const updateTask = async (id: string, status: string, score?: number) => {
    const patch: any = { status };
    if (typeof score === "number") patch.score = score;
    const { error } = await supabase.from("volunteer_tasks").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Task updated");
    loadTasks();
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <DashboardLayout>
      <Helmet>
        <title>Volunteers CMS — NESA-Africa Admin</title>
      </Helmet>
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <h1 className="font-playfair text-3xl md:text-4xl text-gold mb-2">
          Volunteers CMS
        </h1>
        <p className="text-muted-foreground mb-6">
          Manage volunteer verification, visibility, and task approvals.
        </p>

        <div className="flex gap-2 mb-6 border-b border-border">
          {(["volunteers", "tasks"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 capitalize text-sm font-medium border-b-2 transition ${
                tab === t
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "volunteers" && (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search volunteers..."
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">Team</th>
                      <th className="p-3">Country</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Refs</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="p-3 font-medium">{r.full_name}</td>
                        <td className="p-3 text-muted-foreground">{r.team_slug || "—"}</td>
                        <td className="p-3 text-muted-foreground">{r.country || "—"}</td>
                        <td className="p-3">{r.contribution_score ?? 0}</td>
                        <td className="p-3">{r.referral_count ?? 0}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              r.verification_status === "approved"
                                ? "default"
                                : r.verification_status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {r.verification_status || "pending"}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs">{r.visibility_status || "public"}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Approve"
                              onClick={() =>
                                updateVolunteer(r.id, { verification_status: "approved" })
                              }
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Reject"
                              onClick={() =>
                                updateVolunteer(r.id, { verification_status: "rejected" })
                              }
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              title="Toggle visibility"
                              onClick={() =>
                                updateVolunteer(r.id, {
                                  visibility_status:
                                    r.visibility_status === "public" ? "hidden" : "public",
                                })
                              }
                            >
                              {r.visibility_status === "public" ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-muted-foreground">
                          No volunteers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === "tasks" && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left">
                  <th className="p-3">Title</th>
                  <th className="p-3">Volunteer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="p-3">{t.title}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {t.volunteer_id?.slice(0, 8)}
                    </td>
                    <td className="p-3">
                      <Badge variant={t.status === "approved" ? "default" : "secondary"}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="p-3">{t.score ?? 0}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateTask(t.id, "approved", t.score || 10)}
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => updateTask(t.id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No tasks yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
