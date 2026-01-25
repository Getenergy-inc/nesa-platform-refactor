import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Download, ExternalLink, FileText, QrCode, Medal, Star, Trophy } from "lucide-react";
import { generateCertificatePDF, downloadCertificatePDF } from "@/lib/certificateGenerator";
import { useToast } from "@/hooks/use-toast";

import platinumCertificate from "@/assets/certificates/platinum-certificate.jpeg";
import goldCertificate from "@/assets/certificates/gold-certificate.jpeg";
import blueGarnetCertificate from "@/assets/certificates/blue-garnet-certificate.jpeg";
import iconCertificate from "@/assets/certificates/icon-certificate.jpeg";

const tierConfig: Record<string, { 
  label: string; 
  color: string; 
  bgColor: string;
  icon: typeof Award;
  image: string;
}> = {
  platinum: {
    label: "Platinum",
    color: "text-slate-300",
    bgColor: "bg-slate-700",
    icon: Medal,
    image: platinumCertificate,
  },
  gold: {
    label: "Gold",
    color: "text-amber-400",
    bgColor: "bg-amber-600",
    icon: Award,
    image: goldCertificate,
  },
  blue_garnet: {
    label: "Blue Garnet",
    color: "text-blue-400",
    bgColor: "bg-blue-700",
    icon: Trophy,
    image: blueGarnetCertificate,
  },
  icon: {
    label: "Icon",
    color: "text-indigo-400",
    bgColor: "bg-indigo-700",
    icon: Star,
    image: iconCertificate,
  },
};

interface Certificate {
  id: string;
  tier: string;
  verification_code: string;
  issued_at: string;
  expires_at: string | null;
  is_lifetime: boolean;
  download_url: string | null;
  nominee: {
    name: string;
    title: string | null;
    organization: string | null;
  };
  season: {
    name: string;
    year: number;
  };
}

export function MyCertificates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["my-certificates", user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get nominees linked to current user
      const { data: nominees, error: nomineeError } = await supabase
        .from("nominees")
        .select("id")
        .eq("nominator_user_id", user.id);

      if (nomineeError || !nominees?.length) return [];

      const nomineeIds = nominees.map((n) => n.id);

      // Get certificates for those nominees
      const { data, error } = await supabase
        .from("certificates")
        .select(`
          id,
          tier,
          verification_code,
          issued_at,
          expires_at,
          is_lifetime,
          download_url,
          nominees!inner (
            name,
            title,
            organization
          ),
          seasons!inner (
            name,
            year
          )
        `)
        .in("nominee_id", nomineeIds)
        .order("issued_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((cert) => ({
        id: cert.id,
        tier: cert.tier,
        verification_code: cert.verification_code,
        issued_at: cert.issued_at,
        expires_at: cert.expires_at,
        is_lifetime: cert.is_lifetime,
        download_url: cert.download_url,
        nominee: Array.isArray(cert.nominees) ? cert.nominees[0] : cert.nominees,
        season: Array.isArray(cert.seasons) ? cert.seasons[0] : cert.seasons,
      })) as Certificate[];
    },
    enabled: !!user,
  });

  const handleDownloadPDF = async (cert: Certificate) => {
    setDownloadingId(cert.id);
    try {
      const blob = await generateCertificatePDF({
        nomineeName: cert.nominee.name,
        nomineeTitle: cert.nominee.title,
        nomineeOrganization: cert.nominee.organization,
        tier: cert.tier as "platinum" | "gold" | "blue_garnet" | "icon",
        verificationCode: cert.verification_code,
        seasonName: cert.season.name,
        seasonYear: cert.season.year,
        issuedAt: cert.issued_at,
        expiresAt: cert.expires_at,
        isLifetime: cert.is_lifetime,
      });

      const filename = `NESA-${cert.tier}-certificate-${cert.verification_code}.pdf`;
      downloadCertificatePDF(blob, filename);

      toast({
        title: "Certificate Downloaded",
        description: `Your ${tierConfig[cert.tier]?.label || cert.tier} certificate has been downloaded.`,
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate certificate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            My Certificates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const hasCertificates = certificates && certificates.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          My Certificates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasCertificates ? (
          <div className="py-8 text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="mb-2 text-muted-foreground">No certificates yet</p>
            <p className="text-sm text-muted-foreground/70">
              Your earned certificates will appear here once issued.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => {
              const config = tierConfig[cert.tier] || tierConfig.gold;
              const Icon = config.icon;
              const isExpired = cert.expires_at && new Date(cert.expires_at) < new Date();

              return (
                <div
                  key={cert.id}
                  className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  {/* Certificate Preview */}
                  <div className="hidden sm:block h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <img
                      src={config.image}
                      alt={`${config.label} Certificate`}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`${config.bgColor} text-white`}>
                        <Icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                      {cert.is_lifetime && (
                        <Badge variant="outline" className="text-xs">Lifetime</Badge>
                      )}
                      {isExpired && (
                        <Badge variant="destructive" className="text-xs">Expired</Badge>
                      )}
                    </div>
                    <p className="font-medium truncate">{cert.nominee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cert.season.name} • Code: {cert.verification_code}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="icon" title="Verify Certificate">
                      <Link to={`/certificates/verify?code=${cert.verification_code}`}>
                        <QrCode className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download PDF Certificate"
                      onClick={() => handleDownloadPDF(cert)}
                      disabled={downloadingId === cert.id}
                    >
                      {downloadingId === cert.id ? (
                        <FileText className="h-4 w-4 animate-pulse" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Verify Another */}
        <div className="mt-6 pt-4 border-t">
          <Button asChild variant="outline" className="w-full">
            <Link to="/certificates/verify">
              <ExternalLink className="mr-2 h-4 w-4" />
              Verify a Certificate
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
