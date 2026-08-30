import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NRCLayout } from "@/components/nrc/NRCLayout";
import { useMyQueue, useStartNRCReview, useSubmitNRCReview } from "@/hooks/useNRCData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  User,
  Building2,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Loader2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import type { NRCQueueItem } from "@/types/nrc";


type ReviewDecision = "APPROVE" | "REJECT" | "REQUEST_MORE_EVIDENCE" | "ESCALATE";

const DECISION_TITLES: Record<ReviewDecision, string> = {
  APPROVE: "Approve Nomination",
  REJECT: "Reject Nomination",
  REQUEST_MORE_EVIDENCE: "Request More Evidence",
  ESCALATE: "Escalate to NRC Lead",
};

function NRCMyQueueContent() {
  const { user } = useAuth();
  const { data: queue, isLoading, error, refetch } = useMyQueue();
  const startReview = useStartNRCReview();
  const submitReview = useSubmitNRCReview();
  const [selectedItem, setSelectedItem] = useState<NRCQueueItem | null>(null);
  const [decisionType, setDecisionType] = useState<ReviewDecision | null>(null);
  const [notes, setNotes] = useState("");

  const isSubmitting = submitReview.isPending;

  const handleStartReview = async (item: NRCQueueItem) => {
    try {
      await startReview.mutateAsync(item.nomination_id);
      toast.success("Review started");
    } catch (err: any) {
      toast.error(err?.message || "Failed to start review");
    }
  };

  const handleDecision = async () => {
    if (!selectedItem || !decisionType || !user) return;

    try {
      // Verdicts go through the `nrc` edge function, which records the review
      // and evaluates the 2-of-3 quorum server-side. A single reviewer never
      // changes the nomination status on their own.
      const result = await submitReview.mutateAsync({
        nominationId: selectedItem.nomination_id,
        decision: decisionType,
        notes: notes.trim() || undefined,
      });

      const quorum = result.quorum;
      if (quorum?.quorum_reached) {
        toast.success(
          `Quorum reached — nomination ${quorum.decision === "verified" ? "verified" : "rejected"}`
        );
      } else if (quorum?.reason === "split_decision") {
        toast.warning("Split decision recorded — escalated to the NRC Lead");
      } else {
        toast.success("Your review was recorded. Awaiting the second reviewer.");
      }

      setSelectedItem(null);
      setDecisionType(null);
      setNotes("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit review");
    }
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const days = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
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

  if (error) {
    return (
      <NRCLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Could not load your review queue</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{(error as Error).message}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </NRCLayout>
    );
  }


  return (
    <NRCLayout>
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">My Review Queue</h2>
          <p className="text-muted-foreground">
            {queue?.length || 0} nomination{(queue?.length || 0) !== 1 ? "s" : ""} assigned to you
          </p>
        </div>

        {queue && queue.length > 0 ? (
          <div className="space-y-4">
            {queue.map((item) => {
              const daysUntilDue = getDaysUntilDue(item.due_date);
              const isUrgent = daysUntilDue !== null && daysUntilDue <= 2;

              return (
                <Card
                  key={item.id}
                  className={isUrgent ? "border-warning" : undefined}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
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
                          variant={item.status === "in_review" ? "default" : "secondary"}
                        >
                          {item.status === "in_review" ? "In Review" : "Assigned"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Category */}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {item.nomination?.subcategory?.category?.name || "Unknown"}
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
                          {new Date(item.nomination?.created_at || "").toLocaleDateString()}
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

                    {/* Bio/Justification */}
                    {item.nomination?.justification && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {item.nomination.justification}
                      </p>
                    )}

                    {/* Evidence */}
                    {item.nomination?.evidence_urls &&
                      item.nomination.evidence_urls.length > 0 && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {item.nomination.evidence_urls.length} evidence file(s)
                          </span>
                        </div>
                      )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {item.status === "assigned" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStartReview(item)}
                        >
                          Start Review
                        </Button>
                      )}

                      {item.status === "in_review" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90"
                            onClick={() => {
                              setSelectedItem(item);
                              setDecisionType("APPROVE");
                            }}
                          >
                            <CheckCircle className="mr-1.5 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setDecisionType("REJECT");
                            }}
                          >
                            <XCircle className="mr-1.5 h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setDecisionType("REQUEST_MORE_EVIDENCE");
                            }}
                          >
                            <HelpCircle className="mr-1.5 h-4 w-4" />
                            Request Evidence
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setDecisionType("ESCALATE");
                            }}
                          >
                            <ShieldAlert className="mr-1.5 h-4 w-4" />
                            Escalate to Lead
                          </Button>

                        </>
                      )}
                    </div>
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

      {/* Decision Dialog */}
      <Dialog
        open={!!selectedItem && !!decisionType}
        onOpenChange={() => {
          setSelectedItem(null);
          setDecisionType(null);
          setNotes("");
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decisionType === "APPROVE" && "Approve Nomination"}
              {decisionType === "REJECT" && "Reject Nomination"}
              {decisionType === "PUSH_VOTING" && "Push to Voting Pool"}
              {decisionType === "PUSH_RENOMINATION" && "Request Renomination"}
              {decisionType === "NEEDS_INFO" && "Request More Information"}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.nomination?.nominee_name} •{" "}
              {selectedItem?.nomination?.subcategory?.category?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {decisionType === "PUSH_VOTING" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Award Tier</label>
                <Select
                  value={targetTier}
                  onValueChange={(v) => setTargetTier(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold Award (Public Voting)</SelectItem>
                    <SelectItem value="blue_garnet">
                      Blue Garnet (Public + Jury)
                    </SelectItem>
                    <SelectItem value="platinum">
                      Platinum (Verification Only)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Review Notes</label>
              <Textarea
                placeholder={
                  decisionType === "REJECT"
                    ? "Reason for rejection (required)..."
                    : "Add notes about your decision (optional)..."
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedItem(null);
                setDecisionType(null);
                setNotes("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDecision}
              disabled={isSubmitting || (decisionType === "REJECT" && !notes.trim())}
              className={
                decisionType === "APPROVE"
                  ? "bg-success hover:bg-success/90"
                  : decisionType === "REJECT"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {decisionType?.replace("_", " ")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NRCLayout>
  );
}

export default function NRCMyQueue() {
  return (
    <ProtectedRoute requiredRoles={["nrc", "admin"]}>
      <NRCMyQueueContent />
    </ProtectedRoute>
  );
}
