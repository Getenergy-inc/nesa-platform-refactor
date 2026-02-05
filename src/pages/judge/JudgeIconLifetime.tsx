/**
 * Icon & Lifetime Achievers Judges Module
 * 100% judges-only voting for Africa Education Icon and Lifetime Blue Garnet Achievers
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JudgesArenaLayout } from "@/components/judge/JudgesArenaLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Award, Star, CheckCircle, Lock, MessageSquare, ExternalLink, Shield, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface IconNominee {
  id: string;
  name: string;
  title: string | null;
  organization: string | null;
  bio: string | null;
  photo_url: string | null;
  slug: string;
  evidence_urls: string[] | null;
}

interface IconAssignment {
  id: string;
  judge_user_id: string;
  nominee_id: string;
  season_id: string;
  category_id: string | null;
  status: "pending" | "completed" | "recused";
  score: number | null;
  comment: string | null;
  assigned_at: string | null;
  scored_at: string | null;
  nominee: IconNominee;
  contest_type: "ICON" | "LIFETIME";
}

function NomineeCard({ 
  assignment, 
  onScore, 
  onViewDetails,
  isSubmissionLocked 
}: { 
  assignment: IconAssignment;
  onScore: (assignment: IconAssignment) => void;
  onViewDetails: (assignment: IconAssignment) => void;
  isSubmissionLocked: boolean;
}) {
  const nominee = assignment.nominee;
  const isCompleted = assignment.status === "completed";
  
  return (
    <Card className={`transition-all ${isCompleted ? "border-green-500/50 bg-green-950/10" : "hover:border-gold/50"}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg">
            <AvatarImage src={nominee.photo_url || ""} alt={nominee.name} />
            <AvatarFallback className="rounded-lg bg-gradient-to-br from-gold to-amber-600 text-lg font-bold text-white">
              {nominee.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{nominee.name}</h3>
              {assignment.contest_type === "ICON" ? (
                <Crown className="h-4 w-4 text-amber-400 flex-shrink-0" />
              ) : (
                <Star className="h-4 w-4 text-blue-400 flex-shrink-0" />
              )}
            </div>
            {nominee.title && (
              <p className="text-sm text-muted-foreground truncate">{nominee.title}</p>
            )}
            {nominee.organization && (
              <p className="text-sm text-muted-foreground truncate">{nominee.organization}</p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {isCompleted ? (
              <>
                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Scored
                </Badge>
                <span className="text-2xl font-bold text-green-400">{assignment.score}</span>
              </>
            ) : (
              <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                Pending
              </Badge>
            )}
          </div>
        </div>
        
        {nominee.bio && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{nominee.bio}</p>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(assignment)}
            className="flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Dossier
          </Button>
          
          {!isSubmissionLocked && !isCompleted && (
            <Button 
              size="sm" 
              onClick={() => onScore(assignment)}
              className="flex-1 bg-gold hover:bg-gold/90 text-black"
            >
              <Star className="mr-2 h-4 w-4" />
              Score Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function JudgeIconLifetime() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAssignment, setSelectedAssignment] = useState<IconAssignment | null>(null);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [dossierDialogOpen, setDossierDialogOpen] = useState(false);
  const [score, setScore] = useState([75]);
  const [comment, setComment] = useState("");
  const [isSubmissionLocked, setIsSubmissionLocked] = useState(false);

  // Fetch Icon/Lifetime assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["icon-lifetime-assignments", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch assignments for Icon and Lifetime contests
      const { data, error } = await supabase
        .from("jury_assignments")
        .select(`
          *,
          nominees(id, name, title, organization, bio, photo_url, slug, evidence_urls),
          categories(id, name, slug)
        `)
        .eq("judge_user_id", user.id)
        .order("assigned_at", { ascending: false });

      if (error) throw error;

      // Filter and categorize assignments (mock categorization for now)
      return (data || []).map((a: any) => ({
        ...a,
        nominee: a.nominees,
        contest_type: a.categories?.slug?.includes("icon") ? "ICON" : "LIFETIME",
      })) as IconAssignment[];
    },
    enabled: !!user,
  });

  // Check submission lock status
  const { data: submissionStatus } = useQuery({
    queryKey: ["icon-lifetime-submission-status", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data } = await supabase
        .from("jury_submissions")
        .select("*")
        .eq("judge_user_id", user.id)
        .maybeSingle();

      if (data?.is_locked) {
        setIsSubmissionLocked(true);
      }
      return data;
    },
    enabled: !!user,
  });

  // Submit score mutation
  const submitScoreMutation = useMutation({
    mutationFn: async ({ nomineeId, score, comment }: { nomineeId: string; score: number; comment: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/jury/score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ nominee_id: nomineeId, score, comment }),
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit score");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast.success("Score submitted successfully!");
      setScoreDialogOpen(false);
      setScore([75]);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["icon-lifetime-assignments"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit score");
    },
  });

  // Lock submission mutation
  const lockSubmissionMutation = useMutation({
    mutationFn: async () => {
      const { data: season } = await supabase
        .from("seasons")
        .select("id")
        .eq("is_active", true)
        .single();

      if (!season) throw new Error("No active season");

      const { error } = await supabase
        .from("jury_submissions")
        .upsert({
          judge_user_id: user?.id,
          season_id: season.id,
          is_locked: true,
          total_assignments: assignments.length,
          completed_assignments: assignments.filter(a => a.status === "completed").length,
          recused_assignments: assignments.filter(a => a.status === "recused").length,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Submission locked. Your scores have been finalized.");
      setIsSubmissionLocked(true);
      queryClient.invalidateQueries({ queryKey: ["icon-lifetime-submission-status"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to lock submission");
    },
  });

  const handleScore = (assignment: IconAssignment) => {
    setSelectedAssignment(assignment);
    setScore([assignment.score || 75]);
    setComment(assignment.comment || "");
    setScoreDialogOpen(true);
  };

  const handleViewDetails = (assignment: IconAssignment) => {
    setSelectedAssignment(assignment);
    setDossierDialogOpen(true);
  };

  const handleSubmitScore = () => {
    if (!selectedAssignment) return;
    submitScoreMutation.mutate({
      nomineeId: selectedAssignment.nominee_id,
      score: score[0],
      comment,
    });
  };

  const iconAssignments = assignments.filter(a => a.contest_type === "ICON");
  const lifetimeAssignments = assignments.filter(a => a.contest_type === "LIFETIME");
  const completedCount = assignments.filter(a => a.status === "completed").length;
  const pendingCount = assignments.filter(a => a.status === "pending").length;

  return (
    <>
      <Helmet>
        <title>Icon & Lifetime Achievers | Judges Arena</title>
      </Helmet>

      <JudgesArenaLayout 
        title="Icon & Lifetime Achievers" 
        description="Judges-only evaluation for Africa's highest honors"
      >
        <div className="p-6">
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border-amber-500/30">
              <CardContent className="p-4 text-center">
                <Crown className="h-6 w-6 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-400">{iconAssignments.length}</p>
                <p className="text-sm text-muted-foreground">Icon Nominees</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-400">{lifetimeAssignments.length}</p>
                <p className="text-sm text-muted-foreground">Lifetime Achievers</p>
              </CardContent>
            </Card>
            <Card className="bg-green-950/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-400">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Scored</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-950/20 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-400">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Submission Lock Banner */}
          {isSubmissionLocked && (
            <div className="mb-6 p-4 bg-green-950/30 border border-green-500/50 rounded-lg flex items-center gap-3">
              <Lock className="h-5 w-5 text-green-400" />
              <div className="flex-1">
                <p className="font-medium text-green-300">Submission Locked</p>
                <p className="text-sm text-green-400/80">Your scores have been finalized and submitted for aggregation.</p>
              </div>
            </div>
          )}

          {/* Lock Submission Button */}
          {!isSubmissionLocked && completedCount > 0 && (
            <div className="mb-6 p-4 bg-amber-950/30 border border-amber-500/50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-medium text-amber-300">Ready to Submit?</p>
                  <p className="text-sm text-amber-400/80">
                    {completedCount} of {assignments.length} nominees scored. Lock your submission when finished.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                onClick={() => lockSubmissionMutation.mutate()}
                disabled={lockSubmissionMutation.isPending || pendingCount > 0}
              >
                {lockSubmissionMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Lock Submission
              </Button>
            </div>
          )}

          {/* Nominees Tabs */}
          <Tabs defaultValue="icon" className="space-y-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="icon" className="data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                <Crown className="mr-2 h-4 w-4" />
                Africa Education Icon ({iconAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="lifetime" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Star className="mr-2 h-4 w-4" />
                Lifetime Achievers ({lifetimeAssignments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="icon">
              {isLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
                </div>
              ) : iconAssignments.length === 0 ? (
                <div className="py-12 text-center text-white/60">
                  <Crown className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No Icon nominees assigned to you</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {iconAssignments.map((assignment) => (
                    <NomineeCard
                      key={assignment.id}
                      assignment={assignment}
                      onScore={handleScore}
                      onViewDetails={handleViewDetails}
                      isSubmissionLocked={isSubmissionLocked}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="lifetime">
              {isLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto" />
                </div>
              ) : lifetimeAssignments.length === 0 ? (
                <div className="py-12 text-center text-white/60">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No Lifetime Achiever nominees assigned to you</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {lifetimeAssignments.map((assignment) => (
                    <NomineeCard
                      key={assignment.id}
                      assignment={assignment}
                      onScore={handleScore}
                      onViewDetails={handleViewDetails}
                      isSubmissionLocked={isSubmissionLocked}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </JudgesArenaLayout>

      {/* Score Dialog */}
      <Dialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen}>
        <DialogContent className="bg-charcoal border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Score Nominee</DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedAssignment?.nominee.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Score (0-100)</Label>
                <span className="text-3xl font-bold text-gold">{score[0]}</span>
              </div>
              <Slider
                value={score}
                onValueChange={setScore}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 - Not Recommended</span>
                <span>100 - Exceptional</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Evaluation Notes</Label>
              <Textarea
                id="comment"
                placeholder="Provide your evaluation notes and justification..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setScoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitScore}
              disabled={submitScoreMutation.isPending}
              className="bg-gold hover:bg-gold/90 text-black"
            >
              {submitScoreMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              Submit Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dossier Dialog */}
      <Dialog open={dossierDialogOpen} onOpenChange={setDossierDialogOpen}>
        <DialogContent className="bg-charcoal border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nominee Dossier</DialogTitle>
            <DialogDescription className="text-white/60">
              {selectedAssignment?.nominee.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarImage src={selectedAssignment?.nominee.photo_url || ""} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-gold to-amber-600 text-2xl font-bold text-white">
                  {selectedAssignment?.nominee.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedAssignment?.nominee.name}</h3>
                {selectedAssignment?.nominee.title && (
                  <p className="text-muted-foreground">{selectedAssignment?.nominee.title}</p>
                )}
                {selectedAssignment?.nominee.organization && (
                  <p className="text-muted-foreground">{selectedAssignment?.nominee.organization}</p>
                )}
              </div>
            </div>
            
            {selectedAssignment?.nominee.bio && (
              <div>
                <h4 className="font-medium mb-2">Biography</h4>
                <p className="text-sm text-white/80">{selectedAssignment?.nominee.bio}</p>
              </div>
            )}
            
            {selectedAssignment?.nominee.evidence_urls && selectedAssignment.nominee.evidence_urls.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Evidence & References</h4>
                <div className="space-y-2">
                  {selectedAssignment.nominee.evidence_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-400 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Evidence {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDossierDialogOpen(false)}>
              Close
            </Button>
            {!isSubmissionLocked && selectedAssignment?.status !== "completed" && (
              <Button 
                onClick={() => {
                  setDossierDialogOpen(false);
                  handleScore(selectedAssignment!);
                }}
                className="bg-gold hover:bg-gold/90 text-black"
              >
                <Star className="mr-2 h-4 w-4" />
                Score Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
