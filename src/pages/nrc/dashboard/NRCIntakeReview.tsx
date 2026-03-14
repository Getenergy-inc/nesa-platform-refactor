/**
 * NRC Intake Review — Detailed view for a single incoming nomination
 * Shows: auto-classification, duplicate matches, NRC workflow, merge tools
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft, User, MapPin, Award, FileCheck, Flag, CheckCircle, XCircle,
  RotateCcw, Merge, AlertTriangle, Clock, Shield, FileText, Globe,
  ChevronRight, Send, Eye, Copy,
} from "lucide-react";
import {
  generateIntakeRecords,
  INTAKE_STATUS_CONFIG,
  NOMINATION_TYPE_CONFIG,
  type IntakeRecord,
  type IntakeStatus,
} from "@/lib/nominationEngine";
import { detectDuplicates, type DuplicateMatch } from "@/lib/nominationEngine";

const REVIEW_CHECKLIST = [
  { id: "identity", label: "Nominee identity verified" },
  { id: "category", label: "Category correctly assigned" },
  { id: "pathway", label: "Pathway correctly assigned" },
  { id: "contribution", label: "Contribution summary complete" },
  { id: "evidence", label: "Supporting evidence uploaded" },
  { id: "impact", label: "Impact claims credible" },
  { id: "image", label: "Image verified" },
  { id: "duplicate", label: "Duplicate record check completed" },
  { id: "reputation", label: "Reputational review completed" },
];

const WORKFLOW_STAGES: { status: IntakeStatus; label: string; color: string }[] = [
  { status: "submitted", label: "Submitted", color: "bg-blue-500" },
  { status: "duplicate_check", label: "Duplicate Check", color: "bg-amber-500" },
  { status: "under_screening", label: "Screening", color: "bg-orange-500" },
  { status: "under_nrc_review", label: "NRC Review", color: "bg-purple-500" },
  { status: "cleared", label: "Cleared", color: "bg-emerald-500" },
];

function IntakeReviewContent() {
  const { id } = useParams<{ id: string }>();
  const records = useMemo(() => generateIntakeRecords(), []);
  const record = useMemo(() => records.find(r => r.id === id), [records, id]);

  const [checklist, setChecklist] = useState<Record<string, string>>({});
  const [reviewerNotes, setReviewerNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [currentStatus, setCurrentStatus] = useState<IntakeStatus | "">(record?.intakeStatus || "");

  const duplicateMatches = useMemo(() => {
    if (!record) return [];
    return detectDuplicates(record.nomineeName, record.country, record.category);
  }, [record]);

  if (!record) {
    return (
      <NRCDashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-white/50">Nomination record not found.</p>
          <Button asChild variant="ghost" className="mt-4 text-gold">
            <Link to="/nrc/dashboard/intake"><ArrowLeft className="mr-2 h-4 w-4" />Back to Queue</Link>
          </Button>
        </div>
      </NRCDashboardLayout>
    );
  }

  const statusCfg = INTAKE_STATUS_CONFIG[record.intakeStatus];
  const typeCfg = NOMINATION_TYPE_CONFIG[record.nominationType];
  const currentStageIndex = WORKFLOW_STAGES.findIndex(s => s.status === record.intakeStatus);

  const handleAdvanceStatus = (newStatus: IntakeStatus) => {
    setCurrentStatus(newStatus);
    toast.success(`Status updated to: ${INTAKE_STATUS_CONFIG[newStatus].label}`);
  };

  return (
    <>
      <Helmet><title>Review: {record.nomineeName} — NRC</title></Helmet>
      <NRCDashboardLayout>
        <div className="space-y-6">
          {/* Back + Header */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" asChild className="text-white/50">
              <Link to="/nrc/dashboard/intake"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{record.nomineeName}</h1>
              <p className="text-sm text-white/40">{record.category}</p>
            </div>
            <Badge className={`${typeCfg.color} border-0`}>{typeCfg.label}</Badge>
            <Badge className={`${statusCfg.color} border-0`}>{statusCfg.icon} {statusCfg.label}</Badge>
          </div>

          {/* Workflow Pipeline */}
          <Card className="bg-[hsl(30,5%,12%)] border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold" />
                NRC Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {WORKFLOW_STAGES.map((stage, i) => {
                  const isActive = i === currentStageIndex;
                  const isPast = i < currentStageIndex;
                  return (
                    <div key={stage.status} className="flex items-center gap-2 shrink-0">
                      <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        isActive ? `${stage.color} text-white` :
                        isPast ? "bg-emerald-500/20 text-emerald-400" :
                        "bg-white/5 text-white/30"
                      }`}>
                        {isPast && <CheckCircle className="h-3 w-3" />}
                        {stage.label}
                      </div>
                      {i < WORKFLOW_STAGES.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content — 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nominee Details */}
              <Card className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm text-white/70">Nominee Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-gold mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40">Full Name</p>
                        <p className="text-sm text-white font-medium">{record.nomineeName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gold mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40">Country</p>
                        <p className="text-sm text-white">{record.country}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-4 w-4 text-gold mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40">Category</p>
                        <p className="text-sm text-white">{record.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-gold mt-0.5" />
                      <div>
                        <p className="text-xs text-white/40">Pathway</p>
                        <p className="text-sm text-white">{record.pathway}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/5" />

                  <div>
                    <p className="text-xs text-white/40 mb-1">Nominator</p>
                    <p className="text-sm text-white">{record.nominatorName}</p>
                    <p className="text-xs text-white/30">{record.nominatorEmail}</p>
                  </div>

                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-white/40">Evidence: </span>
                      <span className="text-white font-medium">{record.evidenceCount} files</span>
                    </div>
                    <div>
                      <span className="text-white/40">Justification: </span>
                      <span className="text-white font-medium">{record.justificationLength} chars</span>
                    </div>
                  </div>

                  {record.flags.length > 0 && (
                    <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <span className="text-sm font-medium text-orange-400">Flags</span>
                      </div>
                      {record.flags.map((f, i) => (
                        <p key={i} className="text-xs text-orange-300/70 ml-6">• {f}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Duplicate Detection */}
              {duplicateMatches.length > 0 && (
                <Card className="bg-[hsl(30,5%,12%)] border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-sm text-amber-400 flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Duplicate Detection ({duplicateMatches.length} matches)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {duplicateMatches.map((m, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                        <div>
                          <p className="text-sm text-white font-medium">{m.nominee.name}</p>
                          <p className="text-xs text-white/40">{m.nominee.country} — {m.nominee.category}</p>
                          <p className="text-xs text-white/30 mt-1">{m.matchDetails}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={`text-xs ${
                            m.confidence >= 90 ? "border-red-500/50 text-red-400" :
                            m.confidence >= 75 ? "border-amber-500/50 text-amber-400" :
                            "border-white/20 text-white/50"
                          }`}>
                            {m.confidence}% match
                          </Badge>
                          <Button size="sm" variant="ghost" className="h-7 text-gold">
                            <Merge className="h-3 w-3 mr-1" />
                            Merge
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-white/50" asChild>
                            <Link to={`/nominees/${m.nominee.slug}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Review Checklist */}
              <Card className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm text-white/70 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-gold" />
                    NRC Verification Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {REVIEW_CHECKLIST.map(item => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={item.id}
                          checked={checklist[item.id] === "yes"}
                          onCheckedChange={(checked) =>
                            setChecklist(prev => ({ ...prev, [item.id]: checked ? "yes" : "" }))
                          }
                          className="border-white/20 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                        />
                        <Label htmlFor={item.id} className="text-sm text-white/70 cursor-pointer">
                          {item.label}
                        </Label>
                      </div>
                      <Select
                        value={checklist[item.id] || ""}
                        onValueChange={v => setChecklist(prev => ({ ...prev, [item.id]: v }))}
                      >
                        <SelectTrigger className="w-40 h-7 bg-white/5 border-white/10 text-xs text-white">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">✅ Yes</SelectItem>
                          <SelectItem value="no">❌ No</SelectItem>
                          <SelectItem value="clarify">⚠️ Needs Clarification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar — 1 col */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm text-white/70">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2" size="sm"
                    onClick={() => handleAdvanceStatus("cleared")}>
                    <CheckCircle className="h-4 w-4" />
                    Clear Nomination
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2" size="sm"
                    onClick={() => handleAdvanceStatus("under_nrc_review")}>
                    <Shield className="h-4 w-4" />
                    Assign to NRC Review
                  </Button>
                  <Button variant="outline" className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 gap-2" size="sm"
                    onClick={() => handleAdvanceStatus("returned_for_clarification")}>
                    <RotateCcw className="h-4 w-4" />
                    Return for Clarification
                  </Button>
                  <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 gap-2" size="sm"
                    onClick={() => handleAdvanceStatus("declined")}>
                    <XCircle className="h-4 w-4" />
                    Decline
                  </Button>
                  <Button variant="outline" className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 gap-2" size="sm">
                    <Flag className="h-4 w-4" />
                    Flag for Investigation
                  </Button>
                </CardContent>
              </Card>

              {/* EDI Readiness */}
              <Card className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm text-white/70">EDI Readiness</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Access to Education", ready: record.evidenceCount > 0 },
                    { label: "Learning Quality", ready: record.justificationLength > 100 },
                    { label: "Institutional Strength", ready: false },
                    { label: "Innovation & Technology", ready: false },
                    { label: "Sustainability & Inclusion", ready: false },
                  ].map(p => (
                    <div key={p.label} className="flex items-center justify-between">
                      <span className="text-xs text-white/50">{p.label}</span>
                      <Badge className={`text-xs border-0 ${p.ready ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/30"}`}>
                        {p.ready ? "Ready" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Reviewer Notes */}
              <Card className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm text-white/70">Reviewer Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Add review notes..."
                    value={reviewerNotes}
                    onChange={e => setReviewerNotes(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                  />
                  <Select value={recommendation} onValueChange={setRecommendation}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Recommendation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear for Next Stage</SelectItem>
                      <SelectItem value="return">Return for Clarification</SelectItem>
                      <SelectItem value="escalate">Escalate for Senior Review</SelectItem>
                      <SelectItem value="decline">Decline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full bg-gold hover:bg-gold/90 text-charcoal gap-2" size="sm"
                    onClick={() => toast.success("Review notes saved")}>
                    <Send className="h-4 w-4" />
                    Submit Review
                  </Button>
                </CardContent>
              </Card>

              {/* Activity Log */}
              <Card className="bg-[hsl(30,5%,12%)] border-white/5">
                <CardHeader>
                  <CardTitle className="text-sm text-white/70">Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Nomination submitted", time: record.submittedAt, icon: "📥" },
                      { action: "Auto-classification: " + typeCfg.label, time: record.submittedAt, icon: "🤖" },
                      { action: "Duplicate check initiated", time: record.submittedAt, icon: "🔍" },
                      ...(record.assignedReviewer ? [{ action: `Assigned to ${record.assignedReviewer}`, time: record.lastUpdated, icon: "👤" }] : []),
                    ].map((log, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-sm mt-0.5">{log.icon}</span>
                        <div>
                          <p className="text-xs text-white/60">{log.action}</p>
                          <p className="text-xs text-white/30">{new Date(log.time).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </NRCDashboardLayout>
    </>
  );
}

export default function NRCIntakeReview() {
  return (
    <ProtectedRoute>
      <IntakeReviewContent />
    </ProtectedRoute>
  );
}
