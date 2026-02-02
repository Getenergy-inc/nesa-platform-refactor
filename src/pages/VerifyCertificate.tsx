import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyCertificate, reportMisuse, type CertificateVerificationResult } from "@/api/verify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertTriangle, Award, Calendar, Building, User, Flag, Shield, ArrowLeft, Home, ChevronRight, Loader2, QrCode } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NESALogo } from "@/components/nesa/NESALogo";
import { format } from "date-fns";

export default function VerifyCertificate() {
  const { hash } = useParams<{ hash: string }>();
  const [result, setResult] = useState<CertificateVerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!hash) {
        setLoading(false);
        return;
      }

      try {
        const response = await verifyCertificate(hash);
        setResult(response.data);
      } catch (error: any) {
        setResult({
          valid: false,
          status: "NOT_FOUND",
          error: error.message || "Certificate not found",
        });
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [hash]);

  const handleReportMisuse = async () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for the report");
      return;
    }

    setSubmittingReport(true);
    try {
      await reportMisuse({
        verification_hash: hash,
        certificate_id: result?.certificate?.id,
        reporter_name: reporterName || undefined,
        reporter_email: reporterEmail || undefined,
        reason: reportReason,
      });
      toast.success("Misuse report submitted successfully");
      setShowReportDialog(false);
      setReportReason("");
      setReporterName("");
      setReporterEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  const getStatusBadge = () => {
    if (!result) return null;

    switch (result.status) {
      case "VALID":
        return (
          <Badge className="bg-green-500/20 text-green-700 border-green-500 px-4 py-2 text-lg">
            <CheckCircle className="h-5 w-5 mr-2" />
            Valid Certificate
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500 px-4 py-2 text-lg">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Expired
          </Badge>
        );
      case "REVOKED":
        return (
          <Badge className="bg-red-500/20 text-red-700 border-red-500 px-4 py-2 text-lg">
            <XCircle className="h-5 w-5 mr-2" />
            Revoked
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground px-4 py-2 text-lg">
            <XCircle className="h-5 w-5 mr-2" />
            Not Found
          </Badge>
        );
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier?.toLowerCase()) {
      case "platinum":
        return "from-slate-300 to-slate-500";
      case "gold":
        return "from-amber-400 to-amber-600";
      case "blue_garnet":
        return "from-blue-500 to-indigo-600";
      case "icon":
        return "from-purple-500 to-purple-700";
      default:
        return "from-muted to-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container px-6">
          {/* Breadcrumb */}
          <div className="py-2 border-b border-border/50">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      <Home className="h-3.5 w-3.5" />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-3.5 w-3.5" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium">Certificate Verification</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Main Header */}
          <div className="flex h-16 items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold">Certificate Verification</h1>
                <p className="text-xs text-muted-foreground">NESA-Africa Official Verification</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl px-6 py-8">
        <Card className="overflow-hidden">
          {/* Tier Header */}
          {result?.certificate && (
            <div className={`bg-gradient-to-r ${getTierColor(result.certificate.tier)} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <NESALogo variant="stamp" className="h-12 w-12" />
                  <div>
                    <h2 className="text-2xl font-display font-bold capitalize">
                      {result.certificate.tier.replace("_", " ")} Certificate
                    </h2>
                    <p className="text-white/80 text-sm">NESA-Africa {result.season?.year || ""}</p>
                  </div>
                </div>
                <QrCode className="h-10 w-10 opacity-50" />
              </div>
            </div>
          )}

          <CardHeader className="text-center">
            {getStatusBadge()}
            {!result?.valid && result?.error && (
              <p className="text-muted-foreground mt-2">{result.error}</p>
            )}
          </CardHeader>

          {result?.certificate && result?.nominee && (
            <CardContent className="space-y-6">
              {/* Nominee Details */}
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 text-primary mx-auto" />
                <h3 className="text-xl font-display font-bold">{result.nominee.name}</h3>
                {result.nominee.title && (
                  <p className="text-muted-foreground">{result.nominee.title}</p>
                )}
                {result.nominee.organization && (
                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    {result.nominee.organization}
                  </div>
                )}
              </div>

              <Separator />

              {/* Certificate Details */}
              <div className="grid gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serial Number</span>
                  <span className="font-mono font-medium">{result.certificate.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verification Code</span>
                  <span className="font-mono font-medium">{result.certificate.verificationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued Date</span>
                  <span className="font-medium">
                    {format(new Date(result.certificate.issuedAt), "MMMM d, yyyy")}
                  </span>
                </div>
                {result.certificate.expiresAt && !result.certificate.isLifetime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span className={`font-medium ${result.certificate.isExpired ? "text-red-500" : ""}`}>
                      {format(new Date(result.certificate.expiresAt), "MMMM d, yyyy")}
                    </span>
                  </div>
                )}
                {result.certificate.isLifetime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Validity</span>
                    <Badge variant="outline" className="font-medium">Lifetime</Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issuer</span>
                  <span className="font-medium">{result.issuer}</span>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild>
                  <Link to={`/nominees/${encodeURIComponent(result.nominee.slug)}`}>
                    <User className="h-4 w-4 mr-2" />
                    View Nominee Profile
                  </Link>
                </Button>

                <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Flag className="h-4 w-4 mr-2" />
                      Report Misuse
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Certificate Misuse</DialogTitle>
                      <DialogDescription>
                        If you believe this certificate is being misused, please provide details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reporter-name">Your Name (optional)</Label>
                        <Input
                          id="reporter-name"
                          value={reporterName}
                          onChange={(e) => setReporterName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reporter-email">Your Email (optional)</Label>
                        <Input
                          id="reporter-email"
                          type="email"
                          value={reporterEmail}
                          onChange={(e) => setReporterEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reason">Reason for Report *</Label>
                        <Textarea
                          id="reason"
                          value={reportReason}
                          onChange={(e) => setReportReason(e.target.value)}
                          placeholder="Please describe how this certificate is being misused..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleReportMisuse} disabled={submittingReport}>
                        {submittingReport && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Submit Report
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          )}

          {!result?.certificate && (
            <CardContent className="text-center py-8">
              <XCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Certificate Not Found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                The certificate code you provided could not be verified. Please check the code and try again.
              </p>
              <Button variant="outline" asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Verification Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">About Certificate Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Valid:</strong> The certificate is authentic and currently active.
            </p>
            <p>
              <strong>Expired:</strong> The certificate was valid but has passed its expiration date.
            </p>
            <p>
              <strong>Revoked:</strong> The certificate has been revoked due to policy violations.
            </p>
            <p className="pt-2">
              All NESA-Africa certificates include a QR code that links to this verification page.
              If you suspect misuse, please use the "Report Misuse" button above.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
