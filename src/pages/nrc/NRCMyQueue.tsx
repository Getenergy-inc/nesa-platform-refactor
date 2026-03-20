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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  ChevronRight,
  Eye,
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
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // AI Review State
  const [aiAssessment, setAiAssessment] = useState<AINominationResponse | null>(
    null,
  );
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

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
      setExpandedItemId(null);
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

  const toggleExpand = (itemId: string) => {
    setExpandedItemId(expandedItemId === itemId ? null : itemId);
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="px-2 sm:px-0">
          <h2 className="font-display text-xl sm:text-2xl font-bold break-words">
            My Review Queue
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {queue?.length || 0} nomination
            {(queue?.length || 0) !== 1 ? "s" : ""} assigned to you
          </p>
        </div>

        {/* Queue List */}
        {queue?.length ? (
          <div className="space-y-3 sm:space-y-4">
            {queue.map((item) => {
              const daysUntilDue = getDaysUntilDue(item.due_date);
              const isUrgent = daysUntilDue !== null && daysUntilDue <= 2;
              const isExpanded = expandedItemId === item.id;

              return (
                <Card
                  key={item.id}
                  className={cn(
                    "transition-all duration-200",
                    isUrgent && "border-warning/50 bg-warning/5",
                    isExpanded && "shadow-lg",
                  )}
                >
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      {/* Left Section - Nominee Info */}
                      <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                        {/* Avatar */}
                        {item.nomination?.nominee_photo_url ? (
                          <img
                            src={item.nomination.nominee_photo_url}
                            alt={item.nomination.nominee_name}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                            <User className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {item.nomination?.nominee_name || "Unknown"}
                          </h3>
                          {item.nomination?.nominee_title && (
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {item.nomination.nominee_title}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isUrgent && (
                          <Badge
                            variant="destructive"
                            className="gap-1 text-[10px] sm:text-xs"
                          >
                            <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            {daysUntilDue}d left
                          </Badge>
                        )}
                        <Badge
                          variant={
                            item.status === "in_review"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] sm:text-xs"
                        >
                          {item.status === "in_review"
                            ? "In Review"
                            : "Assigned"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4 pt-0">
                    {/* Categories - Always Visible */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-xs"
                      >
                        {item.nomination?.subcategory?.category?.name ||
                          "Unknown"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs"
                      >
                        {item.nomination?.subcategory?.name || "Unknown"}
                      </Badge>
                    </div>

                    {/* Details - Always Visible on Mobile? Toggle on Mobile */}
                    <div className="space-y-2 text-sm">
                      {/* Always visible basic info */}
                      <div className="flex flex-wrap gap-3 sm:gap-4">
                        {item.nomination?.nominee_organization && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                              {item.nomination.nominee_organization}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span className="text-xs sm:text-sm">
                            {new Date(
                              item.nomination?.created_at || "",
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Expandable details on mobile */}
                      {isExpanded && (
                        <div className="space-y-2 pt-2 border-t border-border/50 sm:hidden">
                          {item.due_date && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-xs">
                                Due{" "}
                                {new Date(item.due_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {item.nomination?.evidence_urls?.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {item.nomination.evidence_urls.length} evidence
                                file(s)
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Desktop details - always visible */}
                      <div className="hidden sm:flex flex-wrap gap-3 sm:gap-4">
                        {item.due_date && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-xs sm:text-sm">
                              Due {new Date(item.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {item.nomination?.evidence_urls?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {item.nomination.evidence_urls.length} evidence
                              file(s)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2">
                      {item.status === "assigned" ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStartReview(item)}
                          className="flex-1 sm:flex-none text-xs sm:text-sm"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          Start AI Review
                        </Button>
                      ) : (
                        <div className="flex-1" />
                      )}

                      {/* Mobile expand/collapse button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(item.id)}
                        className="sm:hidden h-8 w-8 p-0"
                      >
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "rotate-90",
                          )}
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 sm:py-12 px-4 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
              <h3 className="mb-1 font-display text-lg sm:text-xl font-semibold">
                Queue Empty
              </h3>
              <p className="text-sm text-muted-foreground">
                No nominations are currently assigned to you. Great work!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Review Dialog/Sheet */}
      {selectedItem && (
        <>
          {/* Desktop Dialog */}
          <Dialog
            open={aiDialogOpen && !isMobileView}
            onOpenChange={setAiDialogOpen}
          >
            <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">
                  AI Review
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="order-2 lg:order-1">
                  <NomineeDossier nomination={selectedItem.nomination} />
                </div>
                <div className="order-1 lg:order-2">
                  <AIAssessmentPanel
                    assessment={aiAssessment}
                    isLoading={isAiLoading}
                    onRun={runAIReview}
                  />
                </div>
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
                    className="min-h-[80px] text-sm"
                  />
                </div>
              )}

              {/* AI Action Buttons */}
              {aiAssessment && !isAiLoading && (
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => setAiDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-success hover:bg-success/90 w-full sm:w-auto"
                    onClick={() => handleDecision("APPROVE")}
                    disabled={isSubmitting}
                  >
                    <CheckCircle className="mr-1.5 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    className="bg-destructive hover:bg-destructive/90 w-full sm:w-auto"
                    onClick={() => handleDecision("REJECT")}
                    disabled={isSubmitting}
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}

              {!aiAssessment && !isAiLoading && (
                <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setAiDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>

          {/* Mobile Sheet */}
          <Sheet
            open={aiDialogOpen && isMobileView}
            onOpenChange={setAiDialogOpen}
          >
            <SheetContent
              side="bottom"
              className="h-[90vh] overflow-y-auto p-4 rounded-t-xl"
            >
              <SheetHeader className="mb-4">
                <SheetTitle className="text-base">AI Review</SheetTitle>
              </SheetHeader>

              <div className="space-y-4">
                <NomineeDossier nomination={selectedItem.nomination} />
                <AIAssessmentPanel
                  assessment={aiAssessment}
                  isLoading={isAiLoading}
                  onRun={runAIReview}
                />

                {aiAssessment && !isAiLoading && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Additional Review Notes (optional)
                      </label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any comments or observations..."
                        className="min-h-[80px] text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-success hover:bg-success/90 w-full"
                        onClick={() => handleDecision("APPROVE")}
                        disabled={isSubmitting}
                      >
                        <CheckCircle className="mr-1.5 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        className="bg-destructive hover:bg-destructive/90 w-full"
                        onClick={() => handleDecision("REJECT")}
                        disabled={isSubmitting}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAiDialogOpen(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </NRCLayout>
  );
}

// Helper function for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function NRCMyQueue() {
  return (
    <ProtectedRoute requiredRoles={["NRC"]}>
      <NRCMyQueueContent />
    </ProtectedRoute>
  );
}
