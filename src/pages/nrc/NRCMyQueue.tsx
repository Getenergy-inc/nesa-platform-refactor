import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { useMyQueue } from "@/hooks/useNRCData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  User,
  Building2,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Vote,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import type { NRCQueueItem, NRCDecisionPayload } from "@/types/nrc";
import {
  AIAssessmentPanel,
  AINominationResponse,
} from "@/components/nrc/AIAssessmentPanel";
import { NomineeDossier } from "@/components/nrc/NomineeDossier";
import { nominationApi } from "@/api/nomination";

function NRCMyQueueContent() {
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: queue, isLoading } = useMyQueue();

  const [selectedItem, setSelectedItem] = useState<NRCQueueItem | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Review State
  const [aiAssessment, setAiAssessment] = useState<AINominationResponse | null>(
    null,
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);

  const handleStartReview = async (item: NRCQueueItem) => {
    setSelectedItem(item);
    setAiDialogOpen(true);
    runAIReview(item);
  };

  const runAIReview = async (item?: NRCQueueItem) => {
    const target = item || selectedItem;
    if (!target) return;

    setIsAiLoading(true);
    try {
      const res = await nominationApi.aiReview(
        accessToken,
        target.nomination_id,
      );
      setAiAssessment(res);
    } catch (err) {
      toast.error("AI review failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDecision = async (decision: NRCDecisionPayload["decision"]) => {
    if (!selectedItem || !user) return;

    setIsSubmitting(true);
    try {
      switch (decision) {
        case "APPROVE":
          await nominationApi.approveNomination(
            accessToken,
            selectedItem.nomination_id,
            notes,
          );
          break;
        case "REJECT":
          await nominationApi.disqualifyNomination(
            accessToken,
            selectedItem.nomination_id,
            notes,
          );
          break;
      }

      queryClient.invalidateQueries({ queryKey: ["nrc-my-queue"] });
      queryClient.invalidateQueries({ queryKey: ["nrc-stats"] });

      toast.success(`Nomination ${decision.toLowerCase().replace("_", " ")}ed`);

      setSelectedItem(null);
      setNotes("");
      setAiAssessment(null);
      setAiDialogOpen(false);
    } catch (error) {
      console.error("Failed to submit decision:", error);
      toast.error("Failed to submit decision");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <NRCLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </NRCLayout>
    );
  }

  return (
    <NRCLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">My Review Queue</h2>
          <p className="text-muted-foreground">
            {queue?.length || 0} nomination
            {(queue?.length || 0) !== 1 ? "s" : ""} assigned to you
          </p>
        </div>

        {queue?.length ? (
          <div className="space-y-4">
            {queue.map((item) => {
              const daysUntilDue = getDaysUntilDue(item.due_date);
              const isUrgent = daysUntilDue !== null && daysUntilDue <= 2;

              return (
                <Card
                  key={item.id}
                  className={isUrgent ? "border-warning" : undefined}
                >
                  <CardHeader className="pb-3 flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      {item.nomination?.nominee_photo_url ? (
                        <img
                          src={item.nomination.nominee_photo_url}
                          alt={item.nomination.nominee_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">
                          {item.nomination?.nominee_name || "Unknown"}
                        </h3>
                        {item.nomination?.nominee_title && (
                          <p className="text-sm text-muted-foreground">
                            {item.nomination.nominee_title}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isUrgent && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {daysUntilDue} day{daysUntilDue !== 1 ? "s" : ""} left
                        </Badge>
                      )}
                      <Badge
                        variant={
                          item.status === "in_review" ? "default" : "secondary"
                        }
                      >
                        {item.status === "in_review" ? "In Review" : "Assigned"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Category */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {item.nomination?.subcategory?.category?.name ||
                          "Unknown"}
                      </Badge>
                      <Badge variant="secondary">
                        {item.nomination?.subcategory?.name || "Unknown"}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid gap-2 text-sm">
                      {item.nomination?.nominee_organization && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4 shrink-0" />
                          <span>{item.nomination.nominee_organization}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>
                          Submitted{" "}
                          {new Date(
                            item.nomination?.created_at || "",
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {item.due_date && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>
                            Due {new Date(item.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Evidence */}
                    {item.nomination?.evidence_urls?.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {item.nomination.evidence_urls.length} evidence
                          file(s)
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    {item.status === "assigned" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleStartReview(item)}
                      >
                        Start AI Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-display text-xl font-semibold">
                Queue Empty
              </h3>
              <p className="text-muted-foreground">
                No nominations are currently assigned to you. Great work!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Review Dialog */}
      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Review</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {selectedItem && (
              <NomineeDossier nomination={selectedItem.nomination} />
            )}
            <AIAssessmentPanel
              assessment={aiAssessment}
              isLoading={isAiLoading}
              onRun={runAIReview}
            />
          </div>

          {/* Additional Notes */}
          {aiAssessment && !isAiLoading && (
            <div className="mt-4 space-y-2">
              <label className="text-sm font-medium">
                Additional Review Notes (optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any comments or observations about this nomination..."
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* AI Action Buttons */}
          {aiAssessment && !isAiLoading && (
            <div className="flex justify-end gap-3 mt-3">
              <Button
                className="bg-success hover:bg-success/90"
                onClick={() => handleDecision("APPROVE")}
                disabled={isSubmitting}
              >
                <CheckCircle className="mr-1.5 h-4 w-4" />
                Approve
              </Button>
              <Button
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => handleDecision("REJECT")}
                disabled={isSubmitting}
              >
                <XCircle className="mr-1.5 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAiDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NRCLayout>
  );
}

export default function NRCMyQueue() {
  return (
    <ProtectedRoute requiredRoles={["NRC"]}>
      <NRCMyQueueContent />
    </ProtectedRoute>
  );
}
