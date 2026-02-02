import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Star,
  Shield,
  AlertCircle,
  RefreshCw,
  FileCheck,
  Loader2,
  Gavel
} from "lucide-react";
import {
  useJuryAssignments,
  useJuryStats,
  useNomineeDossier,
  useSubmitScore,
  useDeclareCOI,
} from "@/hooks/useJuryData";
import type { JuryAssignment } from "@/hooks/useJuryData";
import {
  JuryStatsGrid,
  AssignmentCard,
  ScoreDialog,
  COIDialog,
  DossierDialog,
} from "@/components/judge";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";

export default function JudgeDashboard() {
  const { user } = useAuth();
  
  // Data hooks
  const { data: assignments, isLoading: assignmentsLoading, refetch } = useJuryAssignments();
  const { data: stats, isLoading: statsLoading } = useJuryStats();
  
  // Mutation hooks
  const submitScoreMutation = useSubmitScore();
  const declareCOIMutation = useDeclareCOI();
  
  // Dialog state
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [coiDialogOpen, setCOIDialogOpen] = useState(false);
  const [dossierDialogOpen, setDossierDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<JuryAssignment | null>(null);
  
  // Dossier data
  const { data: dossier, isLoading: dossierLoading } = useNomineeDossier(
    dossierDialogOpen ? selectedAssignment?.nominee_id || null : null
  );

  const handleScore = (assignment: JuryAssignment) => {
    setSelectedAssignment(assignment);
    setScoreDialogOpen(true);
  };

  const handleViewDossier = (assignment: JuryAssignment) => {
    setSelectedAssignment(assignment);
    setDossierDialogOpen(true);
  };

  const handleDeclareCOI = (assignment: JuryAssignment) => {
    setSelectedAssignment(assignment);
    setCOIDialogOpen(true);
  };

  const handleSubmitScore = async (nomineeId: string, score: number, comment?: string) => {
    try {
      await submitScoreMutation.mutateAsync({ nomineeId, score, comment });
      toast.success("Score submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit score");
      throw error;
    }
  };

  const handleSubmitCOI = async (nomineeId: string, reason: string) => {
    try {
      await declareCOIMutation.mutateAsync({ nomineeId, reason });
      toast.success("Conflict of Interest declared");
    } catch (error: any) {
      toast.error(error.message || "Failed to declare COI");
      throw error;
    }
  };

  const pendingAssignments = assignments?.filter(a => a.status === "pending") || [];
  const completedAssignments = assignments?.filter(a => a.status === "completed") || [];
  const recusedAssignments = assignments?.filter(a => a.status === "recused") || [];

  return (
    <>
      <Helmet>
        <title>Judges Arena | NESA-Africa</title>
      </Helmet>

      <JudgesArenaLayout title="Dashboard" description="Your jury workspace overview">
        <div className="p-6">
          {/* Welcome Message */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user.user_metadata?.full_name || "Judge"}
              </h2>
              {stats && (
                <p className="text-white/60">
                  You have <span className="text-gold font-semibold">{stats.pending} pending evaluations</span> to complete.
                </p>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => refetch()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Stats Grid */}
          <JuryStatsGrid stats={stats} isLoading={statsLoading} />

          {/* Pending Assignments */}
          {pendingAssignments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-gold" />
                Pending Evaluations ({pendingAssignments.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="relative">
                    <AssignmentCard
                      assignment={assignment}
                      onScore={handleScore}
                      onViewDossier={handleViewDossier}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 text-white/40 hover:text-orange-400 hover:bg-orange-500/10"
                      onClick={() => handleDeclareCOI(assignment)}
                      title="Declare Conflict of Interest"
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Assignments */}
          {completedAssignments.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                Completed ({completedAssignments.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {completedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onViewDossier={handleViewDossier}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {assignmentsLoading && (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading assignments...</p>
            </div>
          )}

          {/* Empty State */}
          {!assignmentsLoading && assignments?.length === 0 && (
            <Card className="border-white/10 bg-white/5">
              <CardContent className="py-12 text-center">
                <Gavel className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Assignments Yet</h3>
                <p className="text-white/60 max-w-md mx-auto">
                  You don't have any nominees assigned for evaluation yet. 
                  Assignments will appear here once the jury scoring phase begins.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          {pendingAssignments.length > 0 && (
            <Card className="border-yellow-500/20 bg-yellow-500/5 mt-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">Scoring Deadline Approaching</h3>
                    <p className="text-sm text-white/70">
                      All Blue Garnet finalist evaluations must be completed by{" "}
                      <strong className="text-gold">the end of the scoring phase</strong>. 
                      Please ensure you have submitted all scores and COI declarations before the deadline.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </JudgesArenaLayout>

      {/* Dialogs */}
      <ScoreDialog
        assignment={selectedAssignment}
        open={scoreDialogOpen}
        onOpenChange={setScoreDialogOpen}
        onSubmit={handleSubmitScore}
        isSubmitting={submitScoreMutation.isPending}
      />

      <COIDialog
        assignment={selectedAssignment}
        open={coiDialogOpen}
        onOpenChange={setCOIDialogOpen}
        onSubmit={handleSubmitCOI}
        isSubmitting={declareCOIMutation.isPending}
      />

      <DossierDialog
        dossier={dossier}
        isLoading={dossierLoading}
        open={dossierDialogOpen}
        onOpenChange={setDossierDialogOpen}
      />
    </>
  );
}
