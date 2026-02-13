import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { acceptNomination, getAcceptanceDetails, AcceptanceDetails } from "@/api/nominations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, Loader2, AlertCircle, Clock, XCircle } from "lucide-react";
import {
  AcceptanceLetterHeader,
  AcceptanceCategoriesList,
  AcceptanceNextSteps,
  AcceptanceSuccessCard,
} from "@/components/acceptance";

export default function NomineeAccept() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [nominee, setNominee] = useState<AcceptanceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    certificate_download_locked?: boolean;
    renominations_needed?: number;
  } | null>(null);

  useEffect(() => {
    async function loadDetails() {
      if (!token) {
        setError("Invalid acceptance link");
        setLoading(false);
        return;
      }

      try {
        const response = await getAcceptanceDetails(token);
        setNominee(response.data);

        // Check if already responded
        if (response.data.acceptance_status === "ACCEPTED") {
          setAccepted(true);
          setResult({
            certificate_download_locked: response.data.renomination_count < 200,
            renominations_needed: Math.max(0, 200 - response.data.renomination_count),
          });
        } else if (response.data.acceptance_status === "DECLINED") {
          setError("This nomination has already been declined.");
        }
      } catch (err: any) {
        if (err.message?.includes("expired")) {
          setError("This acceptance link has expired. Please contact support for a new link.");
        } else {
          setError(err.message || "Failed to load nomination details");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [token]);

  const handleAccept = async () => {
    if (!token) {
      toast.error("Invalid acceptance link");
      return;
    }

    setSubmitting(true);
    try {
      const response = await acceptNomination(token);
      setResult(response.data);
      setAccepted(true);
      toast.success("Nomination Accepted!", {
        description: "Thank you for accepting your nomination. Your profile is now active in the NESA-Africa ecosystem.",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to accept nomination");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-center">
              <Skeleton className="h-20 w-48" />
            </div>
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-center">
              <div className="bg-destructive/10 p-4 rounded-full">
                {error.includes("expired") ? (
                  <Clock className="h-12 w-12 text-destructive" />
                ) : error.includes("declined") ? (
                  <XCircle className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-destructive" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Unable to Process</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (accepted && result && nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 py-12">
        <AcceptanceSuccessCard
          nomineeName={nominee.name}
          certificateDownloadLocked={result.certificate_download_locked ?? true}
          renominationsNeeded={result.renominations_needed ?? 200}
          token={token}
        />
      </div>
    );
  }

  // Main acceptance letter view
  if (!nominee) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 py-12">
      <Card className="max-w-2xl w-full shadow-xl border-0">
        <CardContent className="p-6 md:p-10 space-y-8">
          {/* Header */}
          <AcceptanceLetterHeader nomineeName={nominee.name} />

          {/* Congratulations Message */}
          <div className="space-y-4">
            <p className="text-lg font-medium text-primary">Congratulations!</p>
            <p className="text-muted-foreground leading-relaxed">
              You have been nominated for the{" "}
              <strong className="text-foreground">
                New Education Standard Awards Africa (NESA-Africa) 2025
              </strong>
              , under the following category(ies):
            </p>
          </div>

          {/* Categories List */}
          <AcceptanceCategoriesList categories={nominee.categories} />

          {/* Recognition Reason */}
          {nominee.primary_justification && (
            <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground mb-1">
                This nomination recognizes your outstanding contributions to education through:
              </p>
              <p className="text-foreground italic">"{nominee.primary_justification}"</p>
            </div>
          )}

          {/* Next Steps */}
          <AcceptanceNextSteps />

          {/* CTA Buttons */}
          <div className="space-y-4 pt-4">
            <Button
              size="lg"
              onClick={handleAccept}
              disabled={submitting}
              className="w-full text-lg py-6"
            >
              {submitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {!submitting && <CheckCircle className="h-5 w-5 mr-2" />}
              Accept My Nomination & Activate Dashboard
            </Button>

            <div className="text-center">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
                <Link to={`/nominee/decline/${token}`}>
                  I'd like to decline this nomination
                </Link>
              </Button>
            </div>
          </div>

          {/* Closing */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t space-y-2">
            <p>
              We are honored to have you join Africa's largest educational recognition movement.
            </p>
            <p className="text-xs">
              Questions? Contact us at{" "}
              <a href="mailto:nominees@nesa.africa" className="text-primary hover:underline">
                nominees@nesa.africa
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
