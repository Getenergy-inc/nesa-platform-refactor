import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { 
  Shield, Search, CheckCircle2, XCircle, Award, Calendar,
  Building2, User, Clock, BadgeCheck, AlertTriangle, QrCode, Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CertificateData {
  id: string;
  verification_code: string;
  tier: string;
  issued_at: string;
  expires_at: string | null;
  is_lifetime: boolean;
  nominees: {
    name: string;
    title: string | null;
    organization: string | null;
    subcategories: {
      name: string;
      categories: {
        name: string;
      };
    };
  };
  seasons: {
    name: string;
    year: number;
  };
}

const TIER_CONFIG: Record<string, { label: string; color: string; icon: typeof Award }> = {
  platinum: { label: "Platinum Certificate", color: "bg-gradient-to-r from-slate-300 to-slate-400", icon: Award },
  gold: { label: "Gold Certificate", color: "bg-gradient-to-r from-yellow-500 to-amber-600", icon: Award },
  "blue-garnet": { label: "Blue Garnet Award", color: "bg-gradient-to-r from-blue-600 to-indigo-700", icon: Award },
  icon: { label: "Africa Education Icon", color: "bg-gradient-to-r from-purple-600 to-pink-600", icon: BadgeCheck },
};

export default function CertificateVerify() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const [inputCode, setInputCode] = useState(initialCode);
  const [searchCode, setSearchCode] = useState(initialCode);

  const { data: certificate, isLoading, error, isFetched } = useQuery({
    queryKey: ["certificate-verify", searchCode],
    queryFn: async () => {
      if (!searchCode.trim()) return null;

      const { data, error } = await supabase
        .from("certificates")
        .select(`
          id,
          verification_code,
          tier,
          issued_at,
          expires_at,
          is_lifetime,
          nominees!inner(
            name,
            title,
            organization,
            subcategories!inner(
              name,
              categories!inner(name)
            )
          ),
          seasons!inner(name, year)
        `)
        .eq("verification_code", searchCode.trim().toUpperCase())
        .maybeSingle();

      if (error) throw error;
      return data as CertificateData | null;
    },
    enabled: searchCode.length > 0,
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim().toUpperCase();
    setSearchCode(code);
    setSearchParams(code ? { code } : {});
  };

  const isExpired = certificate?.expires_at 
    ? new Date(certificate.expires_at) < new Date() 
    : false;

  const isValid = certificate && !isExpired;
  const tierConfig = certificate ? TIER_CONFIG[certificate.tier] || TIER_CONFIG.platinum : null;

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
              <Shield className="w-3 h-3 mr-1" />
              Certificate Authentication
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl text-ivory mb-4">
              Verify <span className="text-gold">Certificate</span>
            </h1>
            <p className="text-lg text-ivory/70 mb-8">
              Enter the verification code from any NESA Africa certificate to confirm its authenticity.
            </p>

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <QrCode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ivory/40" />
                <Input
                  placeholder="Enter verification code (e.g., NESA-2025-XXXX)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="pl-10 bg-charcoal-light border-gold/20 text-ivory placeholder:text-ivory/40 focus:border-gold font-mono tracking-wider"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                disabled={isLoading || !inputCode.trim()}
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {isLoading ? (
              <Card className="bg-charcoal-light border-gold/20">
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gold/20 rounded-full mx-auto mb-4" />
                    <div className="h-6 bg-gold/10 rounded w-48 mx-auto mb-2" />
                    <div className="h-4 bg-gold/10 rounded w-64 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-charcoal-light border-red-500/30">
                <CardContent className="p-8 text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-ivory mb-2">Verification Error</h2>
                  <p className="text-ivory/60">
                    An error occurred while verifying the certificate. Please try again.
                  </p>
                </CardContent>
              </Card>
            ) : isFetched && searchCode && !certificate ? (
              <Card className="bg-charcoal-light border-red-500/30">
                <CardContent className="p-8 text-center">
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-ivory mb-2">Certificate Not Found</h2>
                  <p className="text-ivory/60 mb-4">
                    No certificate was found with the code <span className="font-mono text-gold">{searchCode}</span>
                  </p>
                  <p className="text-sm text-ivory/40">
                    Please check the code and try again. If you believe this is an error, contact support.
                  </p>
                </CardContent>
              </Card>
            ) : certificate ? (
              <Card className={`bg-charcoal-light ${isValid ? 'border-green-500/30' : 'border-yellow-500/30'}`}>
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-ivory flex items-center gap-2">
                      {isValid ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      )}
                      Certificate {isValid ? "Verified" : "Expired"}
                    </CardTitle>
                    <Badge className={`${isValid ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                      {isValid ? "Valid" : "Expired"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Tier Badge */}
                  {tierConfig && (
                    <div className={`${tierConfig.color} rounded-lg p-4 mb-6 text-center`}>
                      <tierConfig.icon className="w-10 h-10 text-white mx-auto mb-2" />
                      <h3 className="text-xl font-display text-white">{tierConfig.label}</h3>
                    </div>
                  )}

                  <Separator className="my-4 bg-gold/10" />

                  {/* Recipient Info */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-ivory/50 mb-1">
                        <User className="w-4 h-4" />
                        Awarded To
                      </div>
                      <p className="text-xl font-semibold text-ivory">{certificate.nominees.name}</p>
                      {certificate.nominees.title && (
                        <p className="text-ivory/70">{certificate.nominees.title}</p>
                      )}
                    </div>

                    {certificate.nominees.organization && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-ivory/50 mb-1">
                          <Building2 className="w-4 h-4" />
                          Organization
                        </div>
                        <p className="text-ivory">{certificate.nominees.organization}</p>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 text-sm text-ivory/50 mb-1">
                        <Award className="w-4 h-4" />
                        Category
                      </div>
                      <p className="text-ivory">
                        {certificate.nominees.subcategories.categories.name}
                        <span className="text-ivory/50"> — </span>
                        {certificate.nominees.subcategories.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-ivory/50 mb-1">
                          <Calendar className="w-4 h-4" />
                          Issued
                        </div>
                        <p className="text-ivory">
                          {new Date(certificate.issued_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm text-ivory/50 mb-1">
                          <Clock className="w-4 h-4" />
                          Validity
                        </div>
                        <p className="text-ivory">
                          {certificate.is_lifetime ? (
                            <span className="text-gold">Lifetime</span>
                          ) : certificate.expires_at ? (
                            isExpired ? (
                              <span className="text-yellow-500">
                                Expired {new Date(certificate.expires_at).toLocaleDateString()}
                              </span>
                            ) : (
                              `Valid until ${new Date(certificate.expires_at).toLocaleDateString()}`
                            )
                          ) : (
                            "No expiration"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4 bg-gold/10" />

                  {/* Verification Details */}
                  <div className="bg-charcoal rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-ivory/50 mb-1">Verification Code</div>
                        <p className="font-mono text-gold tracking-wider">{certificate.verification_code}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-ivory/50 mb-1">Season</div>
                        <p className="text-ivory">{certificate.seasons.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="mt-6 p-4 bg-charcoal rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-ivory/50">
                        <QrCode className="w-4 h-4" />
                        Verification QR Code
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const svg = document.getElementById('certificate-qr-code');
                          if (!svg) return;
                          
                          const svgData = new XMLSerializer().serializeToString(svg);
                          const canvas = document.createElement('canvas');
                          const ctx = canvas.getContext('2d');
                          const img = new Image();
                          
                          canvas.width = 300;
                          canvas.height = 300;
                          
                          img.onload = () => {
                            if (ctx) {
                              ctx.fillStyle = '#ffffff';
                              ctx.fillRect(0, 0, canvas.width, canvas.height);
                              ctx.drawImage(img, 15, 15, 270, 270);
                              
                              const link = document.createElement('a');
                              link.download = `NESA-QR-${certificate.verification_code}.png`;
                              link.href = canvas.toDataURL('image/png');
                              link.click();
                            }
                          };
                          
                          img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                        }}
                        className="border-gold/30 text-gold hover:bg-gold/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <QRCodeSVG
                          id="certificate-qr-code"
                          value={`${window.location.origin}/certificates/verify?code=${certificate.verification_code}`}
                          size={120}
                          level="H"
                          includeMargin={false}
                          bgColor="#ffffff"
                          fgColor="#1a1a1a"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-ivory/70 text-sm mb-2">
                          Scan this QR code to instantly verify this certificate's authenticity.
                        </p>
                        <p className="text-xs text-ivory/40 break-all">
                          {`${window.location.origin}/certificates/verify?code=${certificate.verification_code}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!isValid && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm text-yellow-400">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        This certificate has expired. The recipient may apply for renewal to maintain their recognition status.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-charcoal-light border-gold/10">
                <CardContent className="p-8 text-center">
                  <Shield className="w-16 h-16 text-ivory/20 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-ivory mb-2">Enter a Verification Code</h2>
                  <p className="text-ivory/60 mb-6">
                    Find the verification code on the certificate (usually printed near the QR code) and enter it above.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 bg-charcoal rounded-lg">
                      <h4 className="font-medium text-ivory mb-1">Platinum</h4>
                      <p className="text-xs text-ivory/50">1-year validity, renewable</p>
                    </div>
                    <div className="p-4 bg-charcoal rounded-lg">
                      <h4 className="font-medium text-ivory mb-1">Gold & Blue Garnet</h4>
                      <p className="text-xs text-ivory/50">Season-specific recognition</p>
                    </div>
                    <div className="p-4 bg-charcoal rounded-lg">
                      <h4 className="font-medium text-ivory mb-1">Icon</h4>
                      <p className="text-xs text-ivory/50">Lifetime recognition</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
