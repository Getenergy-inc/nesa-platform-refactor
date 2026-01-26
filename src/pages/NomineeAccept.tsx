import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { acceptNomination } from "@/api/nominations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, Loader2, Award, ArrowRight, Home, PartyPopper } from "lucide-react";
import { NESALogo } from "@/components/nesa/NESALogo";

export default function NomineeAccept() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState<{
    certificate_download_locked?: boolean;
    renominations_needed?: number;
  } | null>(null);

  const handleAccept = async () => {
    if (!token) {
      toast.error("Invalid acceptance link");
      return;
    }

    setLoading(true);
    try {
      const response = await acceptNomination(token);
      setResult(response.data);
      setAccepted(true);
      toast.success("Nomination accepted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to accept nomination");
    } finally {
      setLoading(false);
    }
  };

  if (accepted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
        <Card className="max-w-lg w-full text-center overflow-hidden">
          <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-8">
            <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold">Congratulations!</h1>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold">Nomination Accepted</h2>
              <p className="text-muted-foreground">
                You have successfully accepted your nomination for the NESA-Africa 2025 awards.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Award className="h-5 w-5" />
                <span className="font-medium">Platinum Certificate Issued</span>
              </div>
              {result.certificate_download_locked && (
                <p className="text-sm text-muted-foreground">
                  Your certificate will be available for download after receiving{" "}
                  <strong>{result.renominations_needed}</strong> more endorsements.
                </p>
              )}
              {!result.certificate_download_locked && (
                <p className="text-sm text-muted-foreground">
                  Your certificate is ready for download in your dashboard.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/dashboard/certificates")}>
                <Award className="h-4 w-4 mr-2" />
                View My Certificates
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="max-w-lg w-full text-center">
        <CardHeader className="space-y-4">
          <NESALogo variant="full" className="h-16 mx-auto" />
          <CardTitle className="text-2xl font-display">Accept Your Nomination</CardTitle>
          <CardDescription>
            You've been nominated for the NESA-Africa 2025 Excellence Awards! 
            By accepting, you agree to participate in the recognition process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/5 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Upon acceptance, you will:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Receive a Platinum Certificate of Recognition</li>
              <li>Be listed in the official Nominees directory</li>
              <li>Be eligible for Gold, Blue Garnet, and Icon awards</li>
              <li>Gain access to your nominee dashboard</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              size="lg" 
              onClick={handleAccept}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {!loading && <CheckCircle className="h-4 w-4 mr-2" />}
              Accept Nomination
            </Button>
            <Button 
              variant="ghost" 
              asChild
              className="text-muted-foreground"
            >
              <Link to={`/nominee/decline/${token}`}>
                I'd like to decline instead
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
