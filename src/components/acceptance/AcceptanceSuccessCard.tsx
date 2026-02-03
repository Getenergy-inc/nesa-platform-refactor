import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, ArrowRight, Home, PartyPopper, LayoutDashboard, Share2 } from "lucide-react";

interface AcceptanceSuccessCardProps {
  nomineeName: string;
  certificateDownloadLocked: boolean;
  renominationsNeeded: number;
}

export function AcceptanceSuccessCard({
  nomineeName,
  certificateDownloadLocked,
  renominationsNeeded,
}: AcceptanceSuccessCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-2xl w-full overflow-hidden border-0 shadow-2xl">
      {/* Celebratory Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/placeholder.svg')] opacity-5" />
        <div className="relative text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary-foreground/20 p-4 rounded-full">
              <PartyPopper className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold">Congratulations!</h1>
          <p className="text-primary-foreground/90 text-lg">{nomineeName}</p>
        </div>
      </div>

      <CardContent className="p-8 space-y-8">
        {/* Success Message */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold">Nomination Accepted</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You have successfully accepted your nomination for the 
            NESA-Africa 2025 Excellence Awards.
          </p>
        </div>

        {/* Certificate Status */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-xl p-6 border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-amber-800 dark:text-amber-300">
              Platinum Certificate Issued
            </span>
          </div>
          {certificateDownloadLocked ? (
            <p className="text-sm text-center text-amber-700 dark:text-amber-400">
              Your certificate will be available for download after receiving{" "}
              <strong>{renominationsNeeded}</strong> more endorsements from supporters.
            </p>
          ) : (
            <p className="text-sm text-center text-amber-700 dark:text-amber-400">
              Your certificate is ready for download in your dashboard!
            </p>
          )}
        </div>

        {/* What's Next */}
        <div className="space-y-4">
          <h3 className="font-semibold text-center">What's Next?</h3>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Access Your Dashboard</p>
                <p className="text-muted-foreground">Update your profile and track progress</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Share2 className="h-5 w-5 text-primary" />
              <div className="text-sm">
                <p className="font-medium">Share Your Nomination</p>
                <p className="text-muted-foreground">Mobilize support from your network</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            size="lg" 
            onClick={() => navigate("/dashboard/certificates")}
            className="w-full"
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            Go to My Dashboard
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Footer Message */}
        <p className="text-center text-sm text-muted-foreground pt-4 border-t">
          We are honored to have you join Africa's largest educational recognition movement.
        </p>
      </CardContent>
    </Card>
  );
}
