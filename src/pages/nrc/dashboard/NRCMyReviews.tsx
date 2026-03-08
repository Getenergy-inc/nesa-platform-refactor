/**
 * NRC My Assigned Reviews — Personal review queue
 */

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCDashboardLayout } from "@/components/nrc/NRCDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NomineeWorkflowStatusBadge } from "@/components/nominees/NomineeWorkflowStatus";
import {
  ClipboardList, Eye, Clock, CheckCircle, AlertTriangle, ArrowRight,
} from "lucide-react";
import { getAllMasterNominees } from "@/lib/nomineeMasterData";
import { calculateEDIScorecard, getGradeColor } from "@/lib/ediScoring";

function MyReviewsContent() {
  // Simulate assigned reviews (every 7th nominee)
  const assigned = useMemo(() => {
    const all = getAllMasterNominees();
    return all.filter((_, i) => i % 7 === 0).slice(0, 25);
  }, []);

  const completed = assigned.filter(n => n.workflowStatus === "nomination_cleared").length;
  const inProgress = assigned.filter(n => n.workflowStatus === "nrc_review").length;
  const pending = assigned.length - completed - inProgress;
  const progressPct = Math.round((completed / assigned.length) * 100);

  return (
    <NRCDashboardLayout>
      <Helmet>
        <title>My Reviews | NRC Dashboard</title>
      </Helmet>

      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-bold font-display flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            My Assigned Reviews
          </h1>
          <p className="text-xs text-muted-foreground">{assigned.length} nominees assigned to you</p>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardContent className="p-3 text-center">
              <Clock className="mx-auto mb-1 h-4 w-4 text-amber-400" />
              <div className="text-xl font-bold font-display text-amber-400">{pending}</div>
              <p className="text-[10px] text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardContent className="p-3 text-center">
              <AlertTriangle className="mx-auto mb-1 h-4 w-4 text-blue-400" />
              <div className="text-xl font-bold font-display text-blue-400">{inProgress}</div>
              <p className="text-[10px] text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card className="border-[hsl(var(--gold)/0.08)]">
            <CardContent className="p-3 text-center">
              <CheckCircle className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
              <div className="text-xl font-bold font-display text-emerald-400">{completed}</div>
              <p className="text-[10px] text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[hsl(var(--gold)/0.08)]">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Overall Progress</span>
              <span className="text-xs font-bold text-primary">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </CardContent>
        </Card>

        {/* Review List */}
        <div className="space-y-2">
          {assigned.map(nominee => {
            const edi = calculateEDIScorecard(nominee.id, nominee.achievement, nominee.category);
            const isUrgent = nominee.workflowStatus === "nrc_review";
            return (
              <Card key={nominee.id} className={`border-[hsl(var(--gold)/0.06)] ${isUrgent ? "border-l-2 border-l-amber-500" : ""}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{nominee.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium truncate">{nominee.name}</h3>
                      {isUrgent && (
                        <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">Urgent</Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{nominee.country} · {nominee.subcategory}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <span className={`text-sm font-display font-bold ${getGradeColor(edi.grade)}`}>{edi.grade}</span>
                    <NomineeWorkflowStatusBadge status={nominee.workflowStatus} compact />
                  </div>
                  <Button asChild variant="ghost" size="sm" className="shrink-0">
                    <Link to={`/nrc/dashboard/review/${nominee.id}`}>
                      Review <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </NRCDashboardLayout>
  );
}

export default function NRCMyReviews() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <MyReviewsContent />
    </ProtectedRoute>
  );
}
