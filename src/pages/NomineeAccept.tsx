import { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  acceptNomination,
  getAcceptanceDetails,
  AcceptanceDetails,
} from "@/api/nominations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  AcceptanceLetterHeader,
  AcceptanceCategoriesList,
  AcceptanceNextSteps,
  AcceptanceSuccessCard,
} from "@/components/acceptance";
import { nominationApi } from "@/api/nomination";
import { useAuth } from "@/contexts/AuthContext";

export default function NomineeAccept() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [nominee, setNominee] = useState<AcceptanceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const [result, setResult] = useState<{
    certificate_download_locked?: boolean;
    renominations_needed?: number;
  } | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nominationId = searchParams.get("nominationId");
  const navigate = useNavigate();
  useEffect(() => {
    async function loadDetails() {
      if (!token) {
        setError("Invalid acceptance link");
        setLoading(false);
        return;
      }

      try {
        //fetch nomination details
        const data = await nominationApi.fetchNominationDetails(
          accessToken,
          nominationId,
        );
        const is_expired =
          new Date(data.nominationLinkExpiresAt).getTime() < Date.now();
        const acceptanceDetails: AcceptanceDetails = {
          id: data.id,
          name: data.fullName,
          photo_url: data.profileImage,
          country: data.country,
          acceptance_status: data.accepted,
          renomination_count: data.renominationCount,
          is_expired,
          categories: [
            {
              category: data.category.title,
              subcategory: data.subCategory.title,
            },
          ],
        };
        setNominee(acceptanceDetails);

        // Check if already responded
        if (data.accepted === "ACCEPTED") {
          setAccepted(true);
          setResult({
            certificate_download_locked: data.renominationCount < 200,
            renominations_needed: Math.max(0, 200 - data.renominationCount),
          });
        } else if (data.accepted === "REJECTED") {
          setError("This nomination has already been declined.");
        }
      } catch (err) {
        if (err.message?.includes("expired")) {
          setError(
            "This acceptance link has expired. Please contact support for a new link.",
          );
        } else {
          setError(err.message || "Failed to load nomination details");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDetails();
  }, [token, accessToken, nominationId]);

  const handleAccept = async () => {
    if (!token) {
      toast.error("Invalid acceptance link");
      return;
    }

    setSubmitting(true);
    try {
      await nominationApi.acceptNomination(accessToken, nominationId);
      setAccepted(true);
      toast.success("Nomination accepted successfully!");
      setTimeout(() => {
        navigate(`/nominee/dashboard`);
      }, 500);
    } catch (error) {
      toast.error(error.message || "Failed to accept nomination");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-8">
        <Card className="w-full max-w-xl sm:max-w-2xl">
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <div className="flex justify-center">
              <Skeleton className="h-16 sm:h-20 w-40 sm:w-48" />
            </div>
            <Skeleton className="h-6 sm:h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-3">
              <Skeleton className="h-16 sm:h-20 w-full" />
              <Skeleton className="h-16 sm:h-20 w-full" />
            </div>
            <Skeleton className="h-10 sm:h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <Card className="w-full max-w-md sm:max-w-lg text-center">
          <CardContent className="p-6 sm:p-8 space-y-5 sm:space-y-6">
            <div className="flex justify-center">
              <div className="bg-destructive/10 p-3 sm:p-4 rounded-full">
                {error.includes("expired") ? (
                  <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                ) : error.includes("declined") ? (
                  <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
                ) : (
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold">
                Unable to Process
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {error}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="w-full">
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accepted && result && nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-10">
        <div className="w-full max-w-xl sm:max-w-2xl">
          <AcceptanceSuccessCard
            nomineeName={nominee.name}
            certificateDownloadLocked={
              result.certificate_download_locked ?? true
            }
            renominationsNeeded={result.renominations_needed ?? 200}
            token={token}
          />
        </div>
      </div>
    );
  }

  // Main acceptance letter view
  if (!nominee) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 px-4 py-10">
      <Card className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl shadow-xl border-0">
        <CardContent className="p-5 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Header */}
          <AcceptanceLetterHeader nomineeName={nominee.name} />

          {/* Message */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg font-medium text-primary">
              Congratulations!
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              You have been nominated for the{" "}
              <strong className="text-foreground">
                New Education Standard Awards Africa (NESA-Africa) 2025
              </strong>
              , under the following category(ies):
            </p>
          </div>

          {/* Categories */}
          <AcceptanceCategoriesList categories={nominee.categories} />

          {/* Reason */}
          {nominee.primary_justification && (
            <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                This nomination recognizes your outstanding contributions:
              </p>
              <p className="text-sm sm:text-base text-foreground italic">
                "{nominee.primary_justification}"
              </p>
            </div>
          )}

          {/* Steps */}
          <AcceptanceNextSteps />

          {/* CTA */}
          <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
            <Button
              size="lg"
              onClick={handleAccept}
              disabled={submitting}
              className="w-full text-sm sm:text-base py-5 sm:py-6"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              )}
              Accept My Nomination & Activate Dashboard
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-xs sm:text-sm text-muted-foreground"
              >
                <Link to={`/nominee/decline/${token}_${nominationId}`}>
                  I'd like to decline this nomination
                </Link>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-muted-foreground pt-4 border-t space-y-2">
            <p>
              We are honored to have you join Africa's largest educational
              recognition movement.
            </p>
            <p className="text-[11px] sm:text-xs">
              Questions? Contact us at{" "}
              <a
                href="mailto:nominees@nesa.africa"
                className="text-primary hover:underline break-all"
              >
                nominees@nesa.africa
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
