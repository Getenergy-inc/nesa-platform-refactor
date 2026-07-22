import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  ShieldAlert, Loader2, FileText, MessageSquareWarning, Users, Vote,
  Send, Lock, CheckCircle2, Crown, Save,
} from "lucide-react";

type Pathway = {
  id: string; slug: string; title: string; description: string | null;
  award_category: string; classification: string; pathway_number: number;
};
type Nominee = { id: string; name: string; country: string | null; award_family: string | null };
type Assignment = {
  id: string; nominee_id: string; dossier_version_id: string | null;
  pipeline_status: string; assigned_at: string;
};
type Dossier = {
  id: string; version_number: number; status: string; biography: string | null;
  lifetime_contribution: string | null; geographic_reach: string | null;
  main_beneficiaries: string | null; verified_achievements: any; evidence_library: any;
  impact_summary: string | null; source_quality_notes: string | null;
  known_limitations: string | null; nrc_recommendation: string | null;
  locked_at: string | null;
};
type Review = {
  id: string; nominee_id: string; judge_user_id: string; status: string;
  private_notes: string | null; submitted_at: string | null;
};
type Clarification = {
  id: string; nominee_id: string; dossier_section: string | null; question: string;
  urgency: string; status: string; response_text: string | null; created_at: string;
  requested_by: string; responded_at: string | null;
};
type ChatMessage = {
  id: string; author_user_id: string; nominee_id: string | null;
  message: string; created_at: string;
};
type Seat = {
  id: string; judge_user_id: string; seat_number: number; is_chair: boolean; active: boolean;
};
type Ballot = {
  id: string; judge_user_id: string; first_nominee_id: string | null;
  second_nominee_id: string | null; third_nominee_id: string | null;
  reserve_nominee_id: string | null; rationale: string | null;
  submitted_at: string | null; locked_at: string | null;
};

export default function PathwayWorkspace() {
  const { pathwaySlug } = useParams<{ pathwaySlug: string }>();
  const { user, roles, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [nominees, setNominees] = useState<Record<string, Nominee>>({});
  const [dossiers, setDossiers] = useState<Record<string, Dossier>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clarifications, setClarifications] = useState<Clarification[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [selectedNomineeId, setSelectedNomineeId] = useState<string | null>(null);

  const isJudge = roles.includes("jury") || roles.includes("admin");
  const isNRC = roles.includes("nrc") || roles.includes("admin");
  const mySeat = seats.find((s) => s.judge_user_id === user?.id);
  const isSeated = !!mySeat || roles.includes("admin");
  const isChair = mySeat?.is_chair || roles.includes("admin");

  const loadAll = useCallback(async () => {
    if (!pathwaySlug) return;
    setLoading(true);
    const { data: pw } = await supabase
      .from("judging_pathways").select("*").eq("slug", pathwaySlug).maybeSingle();
    if (!pw) { setPathway(null); setLoading(false); return; }
    setPathway(pw as Pathway);

    const [seatsRes, assignRes, ballotRes] = await Promise.all([
      supabase.from("pathway_judge_assignments").select("*").eq("pathway_id", pw.id).eq("active", true).order("seat_number"),
      supabase.from("nominee_pathway_assignments").select("*").eq("pathway_id", pw.id).order("assigned_at", { ascending: false }),
      supabase.from("pathway_voting_ballots").select("*").eq("pathway_id", pw.id),
    ]);
    setSeats((seatsRes.data || []) as Seat[]);
    const asg = (assignRes.data || []) as Assignment[];
    setAssignments(asg);
    setBallots((ballotRes.data || []) as Ballot[]);

    const nomineeIds = asg.map((a) => a.nominee_id);
    const dossierIds = asg.map((a) => a.dossier_version_id).filter(Boolean) as string[];
    if (nomineeIds.length) {
      const [nomRes, dosRes, revRes, clarRes, msgRes] = await Promise.all([
        supabase.from("nominees").select("id,name,country,award_family").in("id", nomineeIds),
        dossierIds.length
          ? supabase.from("nominee_dossier_versions").select("*").in("id", dossierIds)
          : Promise.resolve({ data: [] as any[] }),
        supabase.from("judge_nominee_reviews").select("*").eq("pathway_id", pw.id),
        supabase.from("pathway_clarification_requests").select("*").eq("pathway_id", pw.id).order("created_at", { ascending: false }),
        supabase.from("pathway_deliberation_messages").select("*").eq("pathway_id", pw.id).order("created_at", { ascending: true }).limit(200),
      ]);
      const nMap: Record<string, Nominee> = {};
      (nomRes.data || []).forEach((n: any) => { nMap[n.id] = n; });
      setNominees(nMap);
      const dMap: Record<string, Dossier> = {};
      (dosRes.data || []).forEach((d: any) => { dMap[d.id] = d; });
      setDossiers(dMap);
      setReviews((revRes.data || []) as Review[]);
      setClarifications((clarRes.data || []) as Clarification[]);
      setMessages((msgRes.data || []) as ChatMessage[]);
      if (!selectedNomineeId && asg.length) setSelectedNomineeId(asg[0].nominee_id);
    }
    setLoading(false);
  }, [pathwaySlug]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Realtime: chatroom
  useEffect(() => {
    if (!pathway) return;
    const ch = supabase
      .channel(`pathway-${pathway.id}-deliberation`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public",
        table: "pathway_deliberation_messages",
        filter: `pathway_id=eq.${pathway.id}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [pathway]);

  if (authLoading || loading) {
    return (
      <div className="container py-10 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) return <Navigate to={`/judges/sign-in?returnTo=/judges/pathways/${pathwaySlug}`} replace />;

  if (!isJudge && !isNRC) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access restricted</h1>
        <p className="text-muted-foreground">The pathway workspace is reserved for seated judges and NRC members.</p>
      </div>
    );
  }

  if (!pathway) {
    return (
      <div className="container py-16 max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-2">Pathway not found</h1>
        <Link to="/judges/nominee-pipeline" className="text-primary underline">Return to nominee pipeline</Link>
      </div>
    );
  }

  const nomineeList = assignments.map((a) => ({
    assignment: a,
    nominee: nominees[a.nominee_id],
    dossier: a.dossier_version_id ? dossiers[a.dossier_version_id] : null,
  })).filter((r) => r.nominee);

  const selectedRow = nomineeList.find((r) => r.assignment.nominee_id === selectedNomineeId);

  return (
    <div className="container py-8 space-y-6 max-w-7xl">
      <Helmet><title>{`${pathway.title} · Pathway Workspace · NESA-Africa`}</title></Helmet>

      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/judges/nominee-pipeline" className="hover:text-primary">Nominee Pipeline</Link>
          <span>/</span>
          <span>Pathway {pathway.pathway_number}</span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair">{pathway.title}</h1>
            <p className="text-muted-foreground mt-1">{pathway.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">{pathway.award_category}</Badge>
              <Badge variant="outline">{pathway.classification}</Badge>
              <Badge variant="secondary">{assignments.length} nominee{assignments.length === 1 ? "" : "s"}</Badge>
              <Badge variant="secondary">{seats.length}/3 seats filled</Badge>
            </div>
          </div>
          {mySeat && (
            <div className="text-right">
              <Badge className="bg-primary text-primary-foreground">
                {mySeat.is_chair && <Crown className="h-3 w-3 mr-1" />}
                Seat {mySeat.seat_number}{mySeat.is_chair ? " · Chair" : ""}
              </Badge>
            </div>
          )}
        </div>
      </header>

      <Tabs defaultValue="dossiers" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="dossiers"><FileText className="h-4 w-4 mr-2" />Dossiers</TabsTrigger>
          <TabsTrigger value="reviews" disabled={!isSeated}><Users className="h-4 w-4 mr-2" />My Review</TabsTrigger>
          <TabsTrigger value="clarifications"><MessageSquareWarning className="h-4 w-4 mr-2" />Clarifications</TabsTrigger>
          <TabsTrigger value="chatroom" disabled={!isSeated}><Send className="h-4 w-4 mr-2" />Chatroom</TabsTrigger>
          <TabsTrigger value="voting" disabled={!isSeated}><Vote className="h-4 w-4 mr-2" />Voting</TabsTrigger>
        </TabsList>

        <TabsContent value="dossiers">
          <DossiersPanel rows={nomineeList} selectedId={selectedNomineeId} onSelect={setSelectedNomineeId} selectedRow={selectedRow} />
        </TabsContent>

        <TabsContent value="reviews">
          <MyReviewPanel
            pathway={pathway}
            rows={nomineeList}
            reviews={reviews}
            userId={user.id}
            onSaved={loadAll}
          />
        </TabsContent>

        <TabsContent value="clarifications">
          <ClarificationsPanel
            pathway={pathway}
            rows={nomineeList}
            requests={clarifications}
            userId={user.id}
            isNRC={isNRC}
            isJudge={isSeated}
            onChange={loadAll}
          />
        </TabsContent>

        <TabsContent value="chatroom">
          <ChatroomPanel
            pathwayId={pathway.id}
            userId={user.id}
            messages={messages}
            seats={seats}
            rows={nomineeList}
          />
        </TabsContent>

        <TabsContent value="voting">
          <VotingPanel
            pathway={pathway}
            rows={nomineeList}
            ballots={ballots}
            userId={user.id}
            isChair={isChair}
            onSaved={loadAll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------- Dossiers ---------- */
function DossiersPanel({ rows, selectedId, onSelect, selectedRow }: any) {
  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-4">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Assigned Nominees</CardTitle></CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[560px]">
            <div className="p-2 space-y-1">
              {rows.length === 0 && <p className="text-sm text-muted-foreground p-2">No nominees assigned yet.</p>}
              {rows.map((r: any) => (
                <button
                  key={r.assignment.id}
                  onClick={() => onSelect(r.assignment.nominee_id)}
                  className={`w-full text-left rounded-md px-3 py-2 text-sm transition ${selectedId === r.assignment.nominee_id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  <div className="font-medium truncate">{r.nominee.name}</div>
                  <div className={`text-xs truncate ${selectedId === r.assignment.nominee_id ? "opacity-80" : "text-muted-foreground"}`}>
                    {r.nominee.country || "—"} · {r.assignment.pipeline_status.replaceAll("_", " ")}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        {!selectedRow ? (
          <CardContent className="py-16 text-center text-muted-foreground">Select a nominee to view the locked dossier.</CardContent>
        ) : (
          <>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{selectedRow.nominee.name}</CardTitle>
                  <CardDescription>{selectedRow.nominee.country || "—"} · {selectedRow.nominee.award_family || "—"}</CardDescription>
                </div>
                {selectedRow.dossier?.locked_at && (
                  <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" />v{selectedRow.dossier.version_number} locked</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedRow.dossier ? (
                <p className="text-sm text-muted-foreground">No locked dossier yet — awaiting NRC handover.</p>
              ) : (
                <>
                  <DossierField label="Biography" value={selectedRow.dossier.biography} />
                  <DossierField label="Lifetime Contribution" value={selectedRow.dossier.lifetime_contribution} />
                  <DossierField label="Geographic Reach" value={selectedRow.dossier.geographic_reach} />
                  <DossierField label="Main Beneficiaries" value={selectedRow.dossier.main_beneficiaries} />
                  <DossierField label="Impact Summary" value={selectedRow.dossier.impact_summary} />
                  <DossierField label="NRC Recommendation" value={selectedRow.dossier.nrc_recommendation} />
                  <DossierField label="Source Quality Notes" value={selectedRow.dossier.source_quality_notes} />
                  <DossierField label="Known Limitations" value={selectedRow.dossier.known_limitations} />
                  {Array.isArray(selectedRow.dossier.evidence_library) && selectedRow.dossier.evidence_library.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Evidence Library</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {selectedRow.dossier.evidence_library.map((e: any, i: number) => (
                          <li key={i}>{e.title || e.url || JSON.stringify(e)}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

function DossierField({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide mb-1">{label}</h4>
      <p className="text-sm whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}

/* ---------- My Review ---------- */
function MyReviewPanel({ pathway, rows, reviews, userId, onSaved }: any) {
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const map: Record<string, string> = {};
    reviews.filter((r: Review) => r.judge_user_id === userId).forEach((r: Review) => {
      map[r.nominee_id] = r.private_notes || "";
    });
    setNotesById((prev) => ({ ...map, ...prev }));
  }, [reviews, userId]);

  const saveNotes = async (review: Review) => {
    setSaving(review.id);
    const { error } = await supabase
      .from("judge_nominee_reviews")
      .update({ private_notes: notesById[review.nominee_id] || "", status: "IN_PROGRESS", started_at: new Date().toISOString() })
      .eq("id", review.id);
    setSaving(null);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else toast({ title: "Notes saved" });
  };

  const submitReview = async (review: Review) => {
    const { error } = await supabase
      .from("judge_nominee_reviews")
      .update({ status: "SUBMITTED", submitted_at: new Date().toISOString(), private_notes: notesById[review.nominee_id] || review.private_notes })
      .eq("id", review.id);
    if (error) toast({ title: "Submit failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Review submitted" }); onSaved(); }
  };

  const myReviews = reviews.filter((r: Review) => r.judge_user_id === userId);

  return (
    <div className="space-y-3">
      {myReviews.length === 0 && (
        <Card><CardContent className="py-10 text-center text-muted-foreground">No reviews assigned to you in this pathway.</CardContent></Card>
      )}
      {myReviews.map((rev: Review) => {
        const row = rows.find((r: any) => r.assignment.nominee_id === rev.nominee_id);
        if (!row) return null;
        return (
          <Card key={rev.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">{row.nominee.name}</CardTitle>
                  <CardDescription>{row.nominee.country || "—"}</CardDescription>
                </div>
                <Badge variant={rev.status === "SUBMITTED" ? "default" : "outline"}>{rev.status.replaceAll("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Private review notes (visible only to you)…"
                value={notesById[rev.nominee_id] ?? ""}
                onChange={(e) => setNotesById((p) => ({ ...p, [rev.nominee_id]: e.target.value }))}
                rows={5}
                disabled={rev.status === "SUBMITTED" || rev.status === "LOCKED"}
              />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => saveNotes(rev)} disabled={saving === rev.id || rev.status === "SUBMITTED"}>
                  {saving === rev.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save draft
                </Button>
                <Button size="sm" onClick={() => submitReview(rev)} disabled={rev.status === "SUBMITTED" || rev.status === "LOCKED"}>
                  <CheckCircle2 className="h-4 w-4 mr-2" /> Submit review
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ---------- Clarifications ---------- */
function ClarificationsPanel({ pathway, rows, requests, userId, isNRC, isJudge, onChange }: any) {
  const [nomineeId, setNomineeId] = useState<string>("");
  const [section, setSection] = useState("");
  const [question, setQuestion] = useState("");
  const [urgency, setUrgency] = useState("NORMAL");
  const [posting, setPosting] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const submit = async () => {
    if (!nomineeId || !question.trim()) {
      toast({ title: "Nominee and question required", variant: "destructive" }); return;
    }
    setPosting(true);
    const { error } = await supabase.from("pathway_clarification_requests").insert({
      pathway_id: pathway.id, nominee_id: nomineeId, requested_by: userId,
      dossier_section: section || null, question: question.trim(), urgency, status: "OPEN",
    });
    setPosting(false);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Clarification sent to NRC" }); setQuestion(""); setSection(""); onChange(); }
  };

  const respond = async (id: string) => {
    const txt = (responses[id] || "").trim();
    if (!txt) return;
    const { error } = await supabase.from("pathway_clarification_requests").update({
      response_text: txt, responded_by: userId, responded_at: new Date().toISOString(), status: "RESPONDED",
    }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Response sent" }); onChange(); }
  };

  return (
    <div className="space-y-4">
      {isJudge && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Request evidence clarification</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <Select value={nomineeId} onValueChange={setNomineeId}>
                <SelectTrigger><SelectValue placeholder="Select nominee" /></SelectTrigger>
                <SelectContent>{rows.map((r: any) => <SelectItem key={r.nominee.id} value={r.nominee.id}>{r.nominee.name}</SelectItem>)}</SelectContent>
              </Select>
              <Input placeholder="Dossier section (optional)" value={section} onChange={(e) => setSection(e.target.value)} />
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="Question for the NRC team…" value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} />
            <div className="flex justify-end">
              <Button onClick={submit} disabled={posting}>
                {posting && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Send to NRC
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Clarification thread ({requests.length})</CardTitle></CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No clarifications requested yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((c: Clarification) => {
                const nom = rows.find((r: any) => r.nominee.id === c.nominee_id)?.nominee;
                return (
                  <div key={c.id} className="border rounded-md p-4 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-medium text-sm">{nom?.name || "Unknown nominee"}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.dossier_section || "General"} · {new Date(c.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{c.urgency}</Badge>
                        <Badge variant={c.status === "RESPONDED" ? "default" : "secondary"}>{c.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{c.question}</p>
                    {c.response_text && (
                      <div className="mt-2 border-l-2 border-primary pl-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1">NRC response · {c.responded_at ? new Date(c.responded_at).toLocaleString() : ""}</div>
                        <p className="text-sm whitespace-pre-wrap">{c.response_text}</p>
                      </div>
                    )}
                    {isNRC && !c.response_text && (
                      <div className="flex gap-2 pt-2">
                        <Textarea
                          placeholder="Response with citations…" rows={2}
                          value={responses[c.id] || ""}
                          onChange={(e) => setResponses((p) => ({ ...p, [c.id]: e.target.value }))}
                        />
                        <Button size="sm" onClick={() => respond(c.id)}>Reply</Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Chatroom (judges only) ---------- */
function ChatroomPanel({ pathwayId, userId, messages, seats, rows }: any) {
  const [text, setText] = useState("");
  const [nomineeId, setNomineeId] = useState<string>("");
  const [sending, setSending] = useState(false);
  const seatMap = useMemo(() => Object.fromEntries(seats.map((s: Seat) => [s.judge_user_id, s])), [seats]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const { error } = await supabase.from("pathway_deliberation_messages").insert({
      pathway_id: pathwayId, author_user_id: userId,
      nominee_id: nomineeId || null, message: text.trim(),
    });
    setSending(false);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else setText("");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Private judges' chatroom</CardTitle>
        <CardDescription>End-to-end confidential. Messages retained for audit.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] border rounded-md p-3 mb-3">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No messages yet — open the deliberation.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((m: ChatMessage) => {
                const nom = m.nominee_id ? rows.find((r: any) => r.nominee.id === m.nominee_id)?.nominee : null;
                const seat: Seat | undefined = seatMap[m.author_user_id];
                const mine = m.author_user_id === userId;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <div className="text-xs opacity-80 mb-0.5">
                        {seat ? `Seat ${seat.seat_number}${seat.is_chair ? " · Chair" : ""}` : "Observer"}
                        {nom && ` · re: ${nom.name}`}
                        <span className="ml-2">{new Date(m.created_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="whitespace-pre-wrap">{m.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <div className="flex gap-2">
          <Select value={nomineeId} onValueChange={setNomineeId}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="General" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">General</SelectItem>
              {rows.map((r: any) => <SelectItem key={r.nominee.id} value={r.nominee.id}>{r.nominee.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            placeholder="Message the panel…" value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          />
          <Button onClick={send} disabled={sending || !text.trim()}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- Voting ---------- */
function VotingPanel({ pathway, rows, ballots, userId, isChair, onSaved }: any) {
  const myBallot: Ballot | undefined = ballots.find((b: Ballot) => b.judge_user_id === userId);
  const [first, setFirst] = useState(myBallot?.first_nominee_id || "");
  const [second, setSecond] = useState(myBallot?.second_nominee_id || "");
  const [third, setThird] = useState(myBallot?.third_nominee_id || "");
  const [reserve, setReserve] = useState(myBallot?.reserve_nominee_id || "");
  const [rationale, setRationale] = useState(myBallot?.rationale || "");
  const [saving, setSaving] = useState(false);
  const locked = !!myBallot?.locked_at;

  useEffect(() => {
    setFirst(myBallot?.first_nominee_id || "");
    setSecond(myBallot?.second_nominee_id || "");
    setThird(myBallot?.third_nominee_id || "");
    setReserve(myBallot?.reserve_nominee_id || "");
    setRationale(myBallot?.rationale || "");
  }, [myBallot?.id]);

  const validate = () => {
    const picks = [first, second, third].filter(Boolean);
    if (picks.length !== 3) return "Select first, second, and third choices.";
    if (new Set(picks).size !== 3) return "Choices must be distinct.";
    if (reserve && picks.includes(reserve)) return "Reserve must differ from ranked picks.";
    return null;
  };

  const save = async (locking: boolean) => {
    const err = validate();
    if (err) { toast({ title: "Invalid ballot", description: err, variant: "destructive" }); return; }
    setSaving(true);
    const payload = {
      pathway_id: pathway.id, judge_user_id: userId,
      first_nominee_id: first, second_nominee_id: second, third_nominee_id: third,
      reserve_nominee_id: reserve || null, rationale: rationale || null,
      submitted_at: new Date().toISOString(),
      ...(locking ? { locked_at: new Date().toISOString() } : {}),
    };
    const { error } = myBallot
      ? await supabase.from("pathway_voting_ballots").update(payload).eq("id", myBallot.id)
      : await supabase.from("pathway_voting_ballots").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else { toast({ title: locking ? "Ballot locked" : "Ballot saved" }); onSaved(); }
  };

  // Tally (chair-visible)
  const tally = useMemo(() => {
    const points: Record<string, number> = {};
    ballots.filter((b: Ballot) => b.locked_at).forEach((b: Ballot) => {
      if (b.first_nominee_id) points[b.first_nominee_id] = (points[b.first_nominee_id] || 0) + 3;
      if (b.second_nominee_id) points[b.second_nominee_id] = (points[b.second_nominee_id] || 0) + 2;
      if (b.third_nominee_id) points[b.third_nominee_id] = (points[b.third_nominee_id] || 0) + 1;
    });
    return Object.entries(points)
      .map(([nomId, pts]) => ({ nomId, pts, name: rows.find((r: any) => r.nominee.id === nomId)?.nominee.name || "—" }))
      .sort((a, b) => b.pts - a.pts);
  }, [ballots, rows]);

  const lockedCount = ballots.filter((b: Ballot) => b.locked_at).length;

  const opts = (exclude: string[]) => rows.filter((r: any) => !exclude.includes(r.nominee.id));

  return (
    <div className="grid md:grid-cols-[1fr_320px] gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Ranked ballot (3-2-1)</CardTitle>
              <CardDescription>Rank your top three finalists and an optional reserve.</CardDescription>
            </div>
            {locked && <Badge><Lock className="h-3 w-3 mr-1" />Locked</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <RankPicker label="1st choice (3 pts)" value={first} onChange={setFirst} rows={opts([second, third, reserve])} disabled={locked} />
          <RankPicker label="2nd choice (2 pts)" value={second} onChange={setSecond} rows={opts([first, third, reserve])} disabled={locked} />
          <RankPicker label="3rd choice (1 pt)" value={third} onChange={setThird} rows={opts([first, second, reserve])} disabled={locked} />
          <RankPicker label="Reserve (optional)" value={reserve} onChange={setReserve} rows={opts([first, second, third])} disabled={locked} />
          <Textarea placeholder="Rationale for your rankings…" value={rationale} onChange={(e) => setRationale(e.target.value)} rows={4} disabled={locked} />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => save(false)} disabled={saving || locked}>
              <Save className="h-4 w-4 mr-2" /> Save draft
            </Button>
            <Button onClick={() => save(true)} disabled={saving || locked}>
              <Lock className="h-4 w-4 mr-2" /> Lock ballot
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Panel status</CardTitle>
          <CardDescription>{lockedCount} of 3 ballots locked</CardDescription>
        </CardHeader>
        <CardContent>
          {!isChair && !locked && (
            <p className="text-xs text-muted-foreground">Tally released to the chair after all ballots are locked.</p>
          )}
          {(isChair || locked) && tally.length > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>Nominee</TableHead><TableHead className="text-right">Pts</TableHead></TableRow></TableHeader>
              <TableBody>
                {tally.map((t, i) => (
                  <TableRow key={t.nomId}>
                    <TableCell className="text-sm">
                      {i < 3 && <Crown className="h-3 w-3 inline mr-1 text-primary" />}
                      {t.name}
                    </TableCell>
                    <TableCell className="text-right font-mono">{t.pts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RankPicker({ label, value, onChange, rows, disabled }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger><SelectValue placeholder="Select nominee" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="">— none —</SelectItem>
          {rows.map((r: any) => <SelectItem key={r.nominee.id} value={r.nominee.id}>{r.nominee.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
