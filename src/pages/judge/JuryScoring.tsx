import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Gavel, 
  ArrowLeft,
  Star,
  CheckCircle,
  Clock,
  Shield,
  Loader2
} from "lucide-react";
import {
  useJuryAssignments,
  useNomineeDossier,
  useSubmitScore,
  useDeclareCOI,
} from "@/hooks/useJuryData";
import type { JuryAssignment } from "@/hooks/useJuryData";
import {
  AssignmentCard,
  ScoreDialog,
  COIDialog,
  DossierDialog,
} from "@/components/judge";

export default function JuryScoring() {
  const { user, roles, loading: authLoading } = useAuth();
  
  const { data: assignments, isLoading } = useJuryAssignments();
  const submitScoreMutation = useSubmitScore();
  const declareCOIMutation = useDeclareCOI();
  
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [coiDialogOpen, setCOIDialogOpen] = useState(false);
  const [dossierDialogOpen, setDossierDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<JuryAssignment | null>(null);
  
  const { data: dossier, isLoading: dossierLoading } = useNomineeDossier(
    dossierDialogOpen ? selectedAssignment?.nominee_id || null : null
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent("/judge/scoring")}`} replace />;
  }

  const isJudge = roles.includes("jury") || roles.includes("admin");
  if (!isJudge) {
    return <Navigate to="/unauthorized" replace />;
  }

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
        <title>Scoring Queue | Judges Arena</title>
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <header className="bg-charcoal border-b border-gold/20">
          <div className="container py-4">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <Link to="/judge/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-gold" />
                <span className="font-semibold text-white">Scoring Queue</span>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="pending" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Clock className="mr-2 h-4 w-4" />
                Pending ({pendingAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                Completed ({completedAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="recused" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" />
                Recused ({recusedAssignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
                </div>
              ) : pendingAssignments.length === 0 ? (
                <div className="py-12 text-center text-white/60">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No pending assignments. Great work!</p>
                </div>
              ) : (
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
                        className="absolute top-2 right-2 text-white/40 hover:text-orange-400"
                        onClick={() => handleDeclareCOI(assignment)}
                        title="Declare COI"
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedAssignments.length === 0 ? (
                <div className="py-12 text-center text-white/60">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No completed assignments yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {completedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      onViewDossier={handleViewDossier}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recused">
              {recusedAssignments.length === 0 ? (
                <div className="py-12 text-center text-white/60">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No recused assignments.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {recusedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>

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
