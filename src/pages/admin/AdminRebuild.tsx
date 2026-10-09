import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  School, Settings, CheckCircle, XCircle, Eye, ThumbsUp, ThumbsDown,
  ListChecks, Trophy, MapPin, BarChart3, Calendar, Search
} from "lucide-react";

interface RebuildNomination {
  id: string;
  school_name: string;
  school_type: string;
  school_country: string;
  nominator_name: string;
  nominator_email: string;
  reason: string;
  status: string;
  created_at: string;
  review_notes: string | null;
}

interface RebuildSchool {
  id: string;
  name: string;
  school_type: string;
  country: string;
  verification_status: string;
  student_count: number | null;
  created_at: string;
}

interface RebuildWinner {
  id: string;
  school_id: string;
  region_id: string;
  vote_count: number;
  intervention_status: string;
  intervention_notes: string | null;
  published_at: string | null;
}

export default function AdminRebuild() {
  const [nominations, setNominations] = useState<RebuildNomination[]>([]);
  const [schools, setSchools] = useState<RebuildSchool[]>([]);
  const [winners, setWinners] = useState<RebuildWinner[]>([]);
  const [stageConfig, setStageConfig] = useState<{ id: string; action: string; is_open: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [nomRes, schoolRes, winnerRes, stageRes] = await Promise.all([
      supabase.from("rebuild_nominations").select("*").order("created_at", { ascending: false }),
      supabase.from("rebuild_schools").select("*").order("created_at", { ascending: false }),
      supabase.from("rebuild_winners").select("*").order("created_at", { ascending: false }),
      supabase.from("stage_config").select("*").in("action", ["rebuild_nominations", "rebuild_voting"]),
    ]);
    setNominations((nomRes.data as RebuildNomination[]) || []);
    setSchools((schoolRes.data as RebuildSchool[]) || []);
    setWinners((winnerRes.data as RebuildWinner[]) || []);
    setStageConfig((stageRes.data as { id: string; action: string; is_open: boolean }[]) || []);
    setLoading(false);
  }

  async function toggleStage(id: string, currentValue: boolean) {
    const { error } = await supabase.from("stage_config").update({ is_open: !currentValue }).eq("id", id);
    if (error) { toast.error("Failed to toggle stage"); return; }
    toast.success("Stage updated");
    fetchData();
  }

  async function updateNominationStatus(id: string, status: string, notes?: string) {
    const { error } = await supabase.from("rebuild_nominations").update({
      status,
      reviewed_at: new Date().toISOString(),
      review_notes: notes || null,
    }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Nomination ${status}`);
    fetchData();
  }

  async function updateSchoolVerification(id: string, status: string) {
    const { error } = await supabase.from("rebuild_schools").update({
      verification_status: status,
      verified_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`School ${status}`);
    fetchData();
  }

  async function updateInterventionStatus(id: string, status: string, notes?: string) {
    const { error } = await supabase.from("rebuild_winners").update({
      intervention_status: status,
      intervention_notes: notes || null,
    }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Intervention updated");
    fetchData();
  }

  async function publishWinner(id: string) {
    const { error } = await supabase.from("rebuild_winners").update({
      published_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error("Failed to publish"); return; }
    toast.success("Winner published");
    fetchData();
  }

  const filteredNominations = nominations.filter(n => {
    const matchesStatus = statusFilter === "all" || n.status === statusFilter;
    const matchesSearch = !searchTerm || n.school_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    totalNominations: nominations.length,
    pending: nominations.filter(n => n.status === "pending").length,
    approved: nominations.filter(n => n.status === "approved").length,
    shortlisted: nominations.filter(n => n.status === "shortlisted").length,
    schools: schools.length,
    verifiedSchools: schools.filter(s => s.verification_status === "verified").length,
    winners: winners.length,
  };

  return (
    <DashboardLayout
      title="Rebuild My School Africa"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Rebuild" }]}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <School className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-muted-foreground">Nominations</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalNominations}</p>
            <p className="text-xs text-muted-foreground">{stats.pending} pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Schools</span>
            </div>
            <p className="text-2xl font-bold">{stats.schools}</p>
            <p className="text-xs text-muted-foreground">{stats.verifiedSchools} verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Winners</span>
            </div>
            <p className="text-2xl font-bold">{stats.winners}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-1">
              <ListChecks className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Shortlisted</span>
            </div>
            <p className="text-2xl font-bold">{stats.shortlisted}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stages"><Settings className="h-4 w-4 mr-1" /> Stages</TabsTrigger>
          <TabsTrigger value="nominations"><School className="h-4 w-4 mr-1" /> Nominations</TabsTrigger>
          <TabsTrigger value="schools"><MapPin className="h-4 w-4 mr-1" /> Schools</TabsTrigger>
          <TabsTrigger value="winners"><Trophy className="h-4 w-4 mr-1" /> Winners</TabsTrigger>
          <TabsTrigger value="interventions"><BarChart3 className="h-4 w-4 mr-1" /> Interventions</TabsTrigger>
        </TabsList>

        {/* Stage Control */}
        <TabsContent value="stages">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Lifecycle</CardTitle>
              <CardDescription>Open or close Rebuild campaign stages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stageConfig.map(stage => (
                <div key={stage.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${stage.action === "rebuild_nominations" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <div>
                      <h4 className="font-medium">
                        {stage.action === "rebuild_nominations" ? "School Nominations" : "Public Voting"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {stage.action === "rebuild_nominations"
                          ? "Allow communities to nominate schools"
                          : "Enable public voting on shortlisted schools"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={stage.is_open ? "bg-emerald-500/10 text-emerald-600" : ""} variant={stage.is_open ? "default" : "secondary"}>
                      {stage.is_open ? <><CheckCircle className="h-3 w-3 mr-1" />Open</> : <><XCircle className="h-3 w-3 mr-1" />Closed</>}
                    </Badge>
                    <Switch checked={stage.is_open} onCheckedChange={() => toggleStage(stage.id, stage.is_open)} />
                  </div>
                </div>
              ))}
              {stageConfig.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No stages configured</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nominations Review */}
        <TabsContent value="nominations">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nomination Review</CardTitle>
              <div className="flex gap-3 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search schools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNominations.map(nom => (
                  <NominationRow
                    key={nom.id}
                    nomination={nom}
                    onApprove={() => updateNominationStatus(nom.id, "approved")}
                    onReject={() => updateNominationStatus(nom.id, "rejected")}
                    onShortlist={() => updateNominationStatus(nom.id, "shortlisted")}
                  />
                ))}
                {filteredNominations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No nominations found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schools */}
        <TabsContent value="schools">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registered Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schools.map(school => (
                  <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{school.name}</h4>
                      <p className="text-sm text-muted-foreground">{school.school_type} • {school.country}</p>
                      {school.student_count && <p className="text-xs text-muted-foreground">{school.student_count} students</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={school.verification_status === "verified" ? "default" : "secondary"}>
                        {school.verification_status}
                      </Badge>
                      {school.verification_status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateSchoolVerification(school.id, "verified")}>
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateSchoolVerification(school.id, "rejected")}>
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {schools.length === 0 && <p className="text-center text-muted-foreground py-8">No schools registered</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Winners */}
        <TabsContent value="winners">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Regional Winners</CardTitle>
              <CardDescription>Publish winners and manage selections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {winners.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">School: {w.school_id.slice(0, 8)}...</p>
                      <p className="text-sm text-muted-foreground">{w.vote_count} votes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {w.published_at ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600">Published</Badge>
                      ) : (
                        <Button size="sm" onClick={() => publishWinner(w.id)}>
                          <Eye className="h-3 w-3 mr-1" /> Publish
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {winners.length === 0 && <p className="text-center text-muted-foreground py-8">No winners yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interventions */}
        <TabsContent value="interventions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Intervention Tracker</CardTitle>
              <CardDescription>Track rebuilding progress per school</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {winners.map(w => (
                  <div key={w.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">School: {w.school_id.slice(0, 8)}...</p>
                      <Select
                        value={w.intervention_status}
                        onValueChange={(val) => updateInterventionStatus(w.id, val)}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {w.intervention_notes && (
                      <p className="text-sm text-muted-foreground">{w.intervention_notes}</p>
                    )}
                  </div>
                ))}
                {winners.length === 0 && <p className="text-center text-muted-foreground py-8">No interventions to track</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

function NominationRow({ nomination, onApprove, onReject, onShortlist }: {
  nomination: RebuildNomination;
  onApprove: () => void;
  onReject: () => void;
  onShortlist: () => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    approved: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-red-500/10 text-red-600",
    shortlisted: "bg-blue-500/10 text-blue-600",
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">{nomination.school_name}</h4>
          <p className="text-sm text-muted-foreground">
            {nomination.school_type} • {nomination.school_country}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            By {nomination.nominator_name} ({nomination.nominator_email})
          </p>
        </div>
        <Badge className={statusColors[nomination.status] || ""}>{nomination.status}</Badge>
      </div>
      <p className="text-sm mb-3">{nomination.reason}</p>
      {nomination.status === "pending" && (
        <div className="flex gap-2">
          <Button size="sm" onClick={onApprove} className="bg-emerald-600 hover:bg-emerald-700">
            <ThumbsUp className="h-3 w-3 mr-1" /> Approve
          </Button>
          <Button size="sm" variant="destructive" onClick={onReject}>
            <ThumbsDown className="h-3 w-3 mr-1" /> Reject
          </Button>
          <Button size="sm" variant="outline" onClick={onShortlist}>
            <ListChecks className="h-3 w-3 mr-1" /> Shortlist
          </Button>
        </div>
      )}
    </div>
  );
}
