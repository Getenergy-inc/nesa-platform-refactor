import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Eye, Lock, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Certificate {
  id: string;
  tier: "platinum" | "gold" | "blue_garnet" | "icon";
  status: "ACTIVE" | "EXPIRED" | "REVOKED";
  downloadLocked: boolean;
  verificationCode: string;
  issuedAt: string;
  expiresAt?: string;
}

interface NomineeCertificateCardProps {
  certificate: Certificate | null;
  endorsementCount: number;
  endorsementGoal: number;
}

export function NomineeCertificateCard({
  certificate,
  endorsementCount,
  endorsementGoal,
}: NomineeCertificateCardProps) {
  const tierLabels: Record<string, string> = {
    platinum: "Platinum Certificate",
    gold: "Gold Award",
    blue_garnet: "Blue Garnet Trophy",
    icon: "Icon Award",
  };

  const tierColors: Record<string, string> = {
    platinum: "bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800",
    gold: "bg-gradient-to-br from-amber-400 to-amber-500 text-amber-900",
    blue_garnet: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    icon: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
  };

  if (!certificate) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-primary" />
            Your Certificate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Certificate Pending</p>
              <p className="text-sm text-muted-foreground">
                Your certificate will be issued once your nomination is processed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isUnlocked = !certificate.downloadLocked;
  const progressPercent = Math.min(100, Math.round((endorsementCount / endorsementGoal) * 100));

  return (
    <Card className="overflow-hidden">
      <div className={`p-4 ${tierColors[certificate.tier] || tierColors.platinum}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6" />
            <span className="font-bold text-lg">
              {tierLabels[certificate.tier] || "Certificate"}
            </span>
          </div>
          <Badge
            variant={certificate.status === "ACTIVE" ? "outline" : "destructive"}
            className="bg-white/20 border-white/30 text-inherit"
          >
            {certificate.status === "ACTIVE" ? (
              <><CheckCircle className="h-3 w-3 mr-1" /> Active</>
            ) : (
              certificate.status
            )}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Serial Number</p>
            <p className="font-mono font-medium">{certificate.verificationCode}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Issued</p>
            <p className="font-medium">
              {new Date(certificate.issuedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Lock Status */}
        {certificate.downloadLocked ? (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Download Locked</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Collect {endorsementGoal - endorsementCount} more endorsements to unlock your certificate download.
            </p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{endorsementCount} / {endorsementGoal}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <a href={`/api/certificates/download/${certificate.id}`} download>
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/verify/${certificate.verificationCode}`}>
                <Eye className="h-4 w-4 mr-2" />
                Verify
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
