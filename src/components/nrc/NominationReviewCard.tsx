import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NominationStatusBadge } from "./NominationStatusBadge";
import {
  User,
  Building2,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  Award,
  Eye,
  Calendar,
  Loader2,
} from "lucide-react";

export interface NominationData {
  id: string;
  nominee_name: string;
  nominee_title: string | null;
  nominee_organization: string | null;
  nominee_bio: string | null;
  nominee_photo_url: string | null;
  evidence_urls: string[] | null;
  justification: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  review_notes: string | null;
  subcategory: {
    name: string;
    category: {
      name: string;
    };
  } | null;
  nominator: {
    email: string;
    full_name: string | null;
  } | null;
}

interface NominationReviewCardProps {
  nomination: NominationData;
  onStatusChange: (
    id: string,
    status: "approved" | "rejected" | "platinum" | "under_review",
    notes?: string
  ) => Promise<void>;
  isUpdating: boolean;
}

export function NominationReviewCard({
  nomination,
  onStatusChange,
  isUpdating,
}: NominationReviewCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showPlatinumDialog, setShowPlatinumDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  const handleApprove = async () => {
    await onStatusChange(nomination.id, "approved");
  };

  const handleReject = async () => {
    await onStatusChange(nomination.id, "rejected", reviewNotes);
    setShowRejectDialog(false);
    setReviewNotes("");
  };

  const handlePlatinum = async () => {
    await onStatusChange(nomination.id, "platinum", reviewNotes);
    setShowPlatinumDialog(false);
    setReviewNotes("");
  };

  const handleStartReview = async () => {
    await onStatusChange(nomination.id, "under_review");
  };

  const canReview = nomination.status === "pending" || nomination.status === "under_review";

  return (
    <>
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {nomination.nominee_photo_url ? (
                <img
                  src={nomination.nominee_photo_url}
                  alt={nomination.nominee_name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{nomination.nominee_name}</h3>
                {nomination.nominee_title && (
                  <p className="text-sm text-muted-foreground">{nomination.nominee_title}</p>
                )}
              </div>
            </div>
            <NominationStatusBadge status={nomination.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Category Info */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {nomination.subcategory?.category?.name || "Unknown Category"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {nomination.subcategory?.name || "Unknown Subcategory"}
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="grid gap-2 text-sm">
            {nomination.nominee_organization && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{nomination.nominee_organization}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Submitted {new Date(nomination.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Justification Preview */}
          {nomination.justification && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {nomination.justification}
            </p>
          )}

          {/* Evidence Links */}
          {nomination.evidence_urls && nomination.evidence_urls.length > 0 && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {nomination.evidence_urls.length} evidence file(s)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(true)}>
              <Eye className="mr-1.5 h-4 w-4" />
              View Details
            </Button>

            {nomination.status === "pending" && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartReview}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="mr-1.5 h-4 w-4" />
                )}
                Start Review
              </Button>
            )}

            {canReview && (
              <>
                <Button
                  size="sm"
                  className="bg-success hover:bg-success/90"
                  onClick={handleApprove}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-1.5 h-4 w-4" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={isUpdating}
                >
                  <XCircle className="mr-1.5 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setShowPlatinumDialog(true)}
                  disabled={isUpdating}
                >
                  <Award className="mr-1.5 h-4 w-4" />
                  Platinum
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {nomination.nominee_photo_url ? (
                <img
                  src={nomination.nominee_photo_url}
                  alt={nomination.nominee_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              {nomination.nominee_name}
            </DialogTitle>
            <DialogDescription>
              {nomination.subcategory?.category?.name} → {nomination.subcategory?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <NominationStatusBadge status={nomination.status} />
            </div>

            {/* Nominee Details */}
            <div className="space-y-3">
              <h4 className="font-semibold">Nominee Details</h4>
              <div className="grid gap-2 text-sm">
                {nomination.nominee_title && (
                  <p>
                    <span className="text-muted-foreground">Title:</span> {nomination.nominee_title}
                  </p>
                )}
                {nomination.nominee_organization && (
                  <p>
                    <span className="text-muted-foreground">Organization:</span>{" "}
                    {nomination.nominee_organization}
                  </p>
                )}
              </div>
              {nomination.nominee_bio && (
                <div>
                  <span className="text-sm text-muted-foreground">Bio:</span>
                  <p className="mt-1 text-sm">{nomination.nominee_bio}</p>
                </div>
              )}
            </div>

            {/* Justification */}
            {nomination.justification && (
              <div className="space-y-2">
                <h4 className="font-semibold">Justification</h4>
                <p className="text-sm">{nomination.justification}</p>
              </div>
            )}

            {/* Evidence */}
            {nomination.evidence_urls && nomination.evidence_urls.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Evidence</h4>
                <div className="flex flex-wrap gap-2">
                  {nomination.evidence_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-3 py-1.5 text-sm hover:bg-muted/80"
                    >
                      <FileText className="h-4 w-4" />
                      File {index + 1}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Nominator Info */}
            <div className="space-y-2">
              <h4 className="font-semibold">Nominator</h4>
              <p className="text-sm">
                {nomination.nominator?.full_name || "Unknown"} ({nomination.nominator?.email})
              </p>
            </div>

            {/* Submission Info */}
            <div className="space-y-2">
              <h4 className="font-semibold">Submission Info</h4>
              <div className="grid gap-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Submitted:</span>{" "}
                  {new Date(nomination.created_at).toLocaleString()}
                </p>
                {nomination.reviewed_at && (
                  <p>
                    <span className="text-muted-foreground">Reviewed:</span>{" "}
                    {new Date(nomination.reviewed_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Review Notes */}
            {nomination.review_notes && (
              <div className="space-y-2">
                <h4 className="font-semibold">Review Notes</h4>
                <p className="rounded-md bg-muted p-3 text-sm">{nomination.review_notes}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Nomination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject the nomination for "{nomination.nominee_name}"? Please
              provide a reason for rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReviewNotes("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Platinum Verification Dialog */}
      <AlertDialog open={showPlatinumDialog} onOpenChange={setShowPlatinumDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Award Platinum Status
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to award Platinum status to "{nomination.nominee_name}". This is a
              prestigious non-competitive recognition. Add any verification notes below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Verification notes (optional)..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReviewNotes("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePlatinum}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Award Platinum
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
