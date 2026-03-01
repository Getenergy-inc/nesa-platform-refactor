import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Lock,
  Award,
  Download,
  CheckCircle,
  Clock,
  Shield,
  Medal,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { NominationCertificateState } from "@/types/nominee_dashboard";
import { AwardType, certificateApi } from "@/api/certificate";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  certificates: NominationCertificateState[];
  onCertificateUpdated?: (updated: NominationCertificateState) => void;
}

export function NominationCertificateGrid({
  certificates,
  onCertificateUpdated,
}: Props) {
  const visible = certificates.filter((c) => c.obtainable);

  if (visible.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-8 rounded-full shadow-sm">
            <Award className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h3 className="text-2xl font-semibold mb-2">
          No Certificates Available
        </h3>

        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
          Once nomination milestones are completed and verified, your official
          recognition certificates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-xl p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-primary">
          Recognition Certificates
        </h2>
        <p className="text-muted-foreground mt-2">
          Official credentials recognizing your contribution to the NESA-Africa
          Awards movement.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {visible.map((cert) => (
          <CertificateCard
            key={cert.id}
            certificate={cert}
            onUpdated={onCertificateUpdated}
          />
        ))}
      </div>
    </div>
  );
}

interface CertificateCardProps {
  certificate: NominationCertificateState;
  onUpdated?: (updated: NominationCertificateState) => void;
}

function CertificateCard({ certificate, onUpdated }: CertificateCardProps) {
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  async function handleGenerate() {
    try {
      setLoading(true);
      let awardType: AwardType;
      switch (certificate.title) {
        case "PLATINUM CERTIFICATE":
          awardType = "PLATINUM_CERTIFICATE";
          break;
        case "GOLD CERTIFICATE":
          awardType = "GOLD_CERTIFICATE";
          break;
        case "BLUE GARNET CERTIFICATE":
          awardType = "BLUE_GARNET_AND_GOLD_CERTIFICATE";
          break;
        case "AFRICAN ICON CERTIFICATE":
          awardType = "AFRICAN_ICON_BLUE_GARNET";
          break;
      }

      const data = await certificateApi.generateCertificate(
        accessToken,
        awardType,
      );

      toast.success("Certificate Issued Successfully");

      if (onUpdated && data) {
        onUpdated({
          ...certificate,
          downloadable: true,
          fileUrl: data.url,
          issuedAt: data.createdAt,
          verificationCode: data.authCode,
        });
      }
    } catch (err) {
      toast.error(err.message || "Unable to generate certificate.");
    } finally {
      setLoading(false);
    }
  }

  // Function to handle download with ?download parameter
  const handleDownload = (url: string, filename: string) => {
    // Create a download link with the ?download parameter
    const downloadUrl = new URL(url);

    // Add the download parameter to force download
    downloadUrl.searchParams.set("download", "true");

    // You can also specify a custom filename
    downloadUrl.searchParams.set("filename", filename);

    // Open in new tab or trigger download
    window.open(downloadUrl.toString(), "_blank");
  };

  const isLocked = !certificate.eligible;
  const isEligible = certificate.eligible && !certificate.downloadable;
  const isIssued = certificate.downloadable;

  const accentColor = isIssued
    ? "text-amber-600"
    : isEligible
      ? "text-primary"
      : "text-muted-foreground";

  const surfaceColor = isIssued
    ? "bg-amber-50"
    : isEligible
      ? "bg-primary/5"
      : "bg-muted/30";

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardContent className="p-0">
        {/* Top Accent Bar */}
        <div
          className={cn(
            "h-2 w-full",
            isIssued ? "bg-amber-500" : isEligible ? "bg-primary" : "bg-muted",
          )}
        />

        <div className="p-8 space-y-6">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-6">
            <div
              className={cn(
                "p-5 rounded-2xl flex items-center justify-center shadow-sm",
                surfaceColor,
              )}
            >
              {isIssued && <Medal className={cn("h-10 w-10", accentColor)} />}
              {isEligible && <Award className={cn("h-10 w-10", accentColor)} />}
              {isLocked && <Lock className={cn("h-10 w-10", accentColor)} />}
            </div>

            <div className="text-right">
              <Badge
                className={cn(
                  "px-3 py-1",
                  isIssued
                    ? "bg-amber-100 text-amber-700"
                    : isEligible
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {isIssued
                  ? "Issued"
                  : isEligible
                    ? "Ready for Generation"
                    : "Locked"}
              </Badge>
            </div>
          </div>

          {/* Title + Description */}
          <div>
            <h3 className="text-xl font-semibold">{certificate.title}</h3>
            <p className="text-muted-foreground mt-2 leading-relaxed text-sm">
              {certificate.description}
            </p>
          </div>

          {/* Locked Message */}
          {isLocked && (
            <div className="bg-muted/40 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                {certificate.lockedReason ||
                  "Complete all nomination and verification requirements to unlock this certificate."}
              </p>
            </div>
          )}

          {/* Eligible CTA */}
          {isEligible && (
            <Button
              onClick={handleGenerate}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Certificate
            </Button>
          )}

          {/* Issued Section */}
          {isIssued && certificate.fileUrl && (
            <div className="space-y-4 pt-4 border-t">
              {certificate.verificationCode && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  <span className="font-mono tracking-wide truncate">
                    Verification ID: {certificate.verificationCode}
                  </span>
                </div>
              )}

              {/* Download Button with proper download handling */}
              <Button
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => {
                  // Generate a clean filename from the certificate title
                  const filename = `${certificate.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
                  handleDownload(certificate.fileUrl!, filename);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>

              {certificate.issuedAt && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Issued{" "}
                  {new Date(certificate.issuedAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
