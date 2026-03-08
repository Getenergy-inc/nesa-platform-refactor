/**
 * NRC Nominee Review Page — Detailed review with checklist, scoring, EDI, documents
 */

import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import { NomineeEDIScores } from "@/components/nominees/NomineeEDIScores";
import {
  ArrowLeft, User, MapPin, Award, FileText, Shield, CheckCircle,
  XCircle, AlertTriangle, FileCheck, Clock, Flag, ChevronRight,
  Globe, Save, Send,
} from "lucide-react";
import { getMasterNomineeById, type MasterNominee } from "@/lib/nomineeMasterData";
import { generateEnhancedBiography } from "@/lib/nomineeStoryGenerator";
import { calculateEDIScorecard } from "@/lib/ediScoring";
import { toast } from "sonner";

type CheckStatus = "yes" | "no" | "clarification" | "pending";

const CHECKLIST_ITEMS = [
  { id: "identity", label: "Nominee identity verified" },
  { id: "category", label: "Category correctly assigned" },
  { id: "pathway", label: "Pathway correctly assigned" },
  { id: "summary", label: "Contribution summary complete" },
  { id: "evidence", label: "Supporting evidence uploaded" },
  { id: "impact", label: "Impact claims credible" },
  { id: "image", label: "Image verified" },
  { id: "duplicate", label: "Duplicate record check completed" },
  { id: "reputation", label: "Reputational review completed" },
];

const SCORING_CRITERIA = [
  { id: "eligibility", label: "Eligibility Fit", max: 10 },
  { id: "documentation", label: "Documentation Completeness", max: 10 },
  { id: "credibility", label: "Credibility of Evidence", max: 10 },
  { id: "contribution", label: "Strength of Contribution", max: 10 },
  { id: "relevance", label: "Regional / Institutional Relevance", max: 10 },
  { id: "integrity", label: "Reputational Integrity", max: 10 },
];

const MOCK_DOCS = [
  { name: "nomination_form.pdf", date: "2025-02-15", status: "verified" as const },
  { name: "evidence_portfolio.pdf", date: "2025-02-18", status: "pending" as const },
  { name: "recommendation_letter.pdf", date: "2025-02-20", status: "verified" as const },
  { name: "impact_report_2024.pdf", date: "2025-03-01", status: "flagged" as const },
];

function ReviewContent() {
  const { id } = useParams<{ id: string }>();
  const nominee = useMemo(() => getMasterNomineeById(Number(id)), [id]);
  
  const [checklist, setChecklist] = useState<Record<string, CheckStatus>>(
    Object.fromEntries(CHECKLIST_ITEMS.map(item => [item.id, "pending"]))
  );
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(SCORING_CRITERIA.map(c => [c.id, 0]))
  );
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");

  if (!nominee) {
    return (
      <NRCDashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-muted-foreground">Nominee not found</p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/nrc/dashboard/nominees"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
            </Button>
          </div>
        </div>
      </NRCDashboardLayout>
    );
  }

  const story = generateEnhancedBiography(nominee);
  const edi = calculateEDIScorecard(nominee.id, nominee.achievement, nominee.category);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxScore = SCORING_CRITERIA.length * 10;
  const completedChecks = Object.values(checklist).filter(v => v !== "pending").length;

  const handleSubmit = () => {
    toast.success(`Review submitted for ${nominee.name}`);
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved");
  };

  return (
    <NRCDashboardLayout>
      <Helmet>
        <title>Review: {nominee.name} | NRC Dashboard</title>
      </Helmet>

      <div className="space-y-4">
        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link to="/nrc/dashboard/nominees"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-display truncate">{nominee.name}</h1>
              <Badge variant="outline" className="text-[10px] border-primary/30 text-primary shrink-0">
                #{String(nominee.id).padStart(4, "0")}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{nominee.country} · {nominee.category}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
              <Save className="mr-1.5 h-3.5 w-3.5" /> Save Draft
            </Button>
            <Button size="sm" onClick={handleSubmit}>
              <Send className="mr-1.5 h-3.5 w-3.5" /> Submit Review
            </Button>
          </div>
        </div>

        {/* Main Layout: 2 columns */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* LEFT: Profile + Story + Documents */}
          <div className="lg:col-span-2 space-y-4">
            {/* Nominee Profile Hero */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-display font-bold text-primary">
                      {nominee.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h2 className="text-lg font-bold font-display">{nominee.name}</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {nominee.country}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Award className="h-3 w-3" /> {nominee.subcategory}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Globe className="h-3 w-3" /> {nominee.pathway}
                      </span>
                    </div>
                    <NomineeWorkflowStatusBadge status={nominee.workflowStatus} showSteps />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Biography / Contribution */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Contribution to African Education (2005–2025)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{story.contributionNarrative.paragraphs.join(" ")}</p>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold mb-2">Key Impact Highlights</h4>
                  <ul className="space-y-1.5">
                    {story.impactHighlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xs font-semibold mb-2">Institutional Significance</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{story.institutionalSignificance}</p>
                </div>
              </CardContent>
            </Card>

            {/* Document Review */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-primary" />
                  Evidence & Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {MOCK_DOCS.map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-[hsl(var(--gold)/0.06)] p-3">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.date}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          doc.status === "verified" ? "border-emerald-500/30 text-emerald-400" :
                          doc.status === "flagged" ? "border-orange-500/30 text-orange-400" :
                          "border-muted text-muted-foreground"
                        }`}
                      >
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">Open</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scoring Panel */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  NRC Scoring Panel
                </CardTitle>
                <p className="text-[11px] text-muted-foreground">Score each criterion 1–10</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {SCORING_CRITERIA.map(criterion => (
                  <div key={criterion.id} className="flex items-center gap-3">
                    <span className="w-52 text-xs text-muted-foreground">{criterion.label}</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min={0}
                        max={criterion.max}
                        value={scores[criterion.id]}
                        onChange={e => setScores(prev => ({ ...prev, [criterion.id]: Number(e.target.value) }))}
                        className="w-full h-1.5 accent-[hsl(var(--gold))] bg-muted/30 rounded-full cursor-pointer"
                      />
                    </div>
                    <span className="w-8 text-right text-sm font-bold text-primary">
                      {scores[criterion.id]}
                    </span>
                  </div>
                ))}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Score</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-display font-bold text-primary">{totalScore}</span>
                    <span className="text-xs text-muted-foreground">/ {maxScore}</span>
                  </div>
                </div>
                <Progress value={(totalScore / maxScore) * 100} className="h-2" />

                <Separator />

                {/* Notes */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Reviewer Notes</label>
                  <Textarea
                    placeholder="Add your review notes, observations, and reasoning..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    className="text-xs bg-muted/20 border-muted"
                  />
                </div>

                {/* Recommendation */}
                <div>
                  <label className="text-xs font-medium mb-1.5 block">Recommendation</label>
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select recommendation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">✅ Clear for Next Stage</SelectItem>
                      <SelectItem value="clarification">🔄 Return for Clarification</SelectItem>
                      <SelectItem value="escalate">⬆️ Escalate for Senior Review</SelectItem>
                      <SelectItem value="decline">❌ Decline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* Current Status */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display">Review Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <NomineeWorkflowStatusBadge status={nominee.workflowStatus} showSteps />
                <Separator />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Assigned Reviewer</span>
                    <span className="font-medium">You</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Review Deadline</span>
                    <span className="font-medium text-amber-400">72 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EDI Quick View */}
            <NomineeEDIScores
              nomineeId={nominee.id}
              achievement={nominee.achievement}
              category={nominee.category}
            />

            {/* Review Checklist */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-display flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Review Checklist
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">
                  {completedChecks} of {CHECKLIST_ITEMS.length} completed
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {CHECKLIST_ITEMS.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Select
                        value={checklist[item.id]}
                        onValueChange={(v: CheckStatus) => setChecklist(prev => ({ ...prev, [item.id]: v }))}
                      >
                        <SelectTrigger className="h-6 w-20 text-[10px] px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                          <SelectItem value="clarification">Needs Info</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className={`text-[11px] ${
                        checklist[item.id] === "yes" ? "text-emerald-400" :
                        checklist[item.id] === "no" ? "text-red-400" :
                        checklist[item.id] === "clarification" ? "text-amber-400" :
                        "text-muted-foreground"
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-[hsl(var(--gold)/0.08)]">
              <CardContent className="p-4 space-y-2">
                <Button className="w-full justify-start text-xs" size="sm" onClick={handleSubmit}>
                  <Send className="mr-2 h-3.5 w-3.5" /> Submit Review
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                  <Flag className="mr-2 h-3.5 w-3.5" /> Flag Case
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs" size="sm">
                  <AlertTriangle className="mr-2 h-3.5 w-3.5" /> Request Clarification
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start text-xs" size="sm">
                  <Link to={`/directory/${encodeURIComponent(nominee.slug)}`}>
                    <Globe className="mr-2 h-3.5 w-3.5" /> View Public Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NRCDashboardLayout>
  );
}

export default function NRCNomineeReview() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <ReviewContent />
    </ProtectedRoute>
  );
}
