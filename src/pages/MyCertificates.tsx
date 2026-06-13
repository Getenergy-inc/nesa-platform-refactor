import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Award, Download, ShieldCheck, Share2, QrCode, Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { getMyCertificates, type Certificate } from "@/api/certificates";
import { toast } from "@/hooks/use-toast";

const tierStyles: Record<string, string> = {
  platinum: "from-slate-300 to-slate-500 text-slate-900",
  gold: "from-amber-300 to-amber-500 text-amber-950",
  blue_garnet: "from-blue-500 to-blue-700 text-white",
  icon: "from-purple-500 to-purple-700 text-white",
};

const tierLabel: Record<string, string> = {
  platinum: "Platinum Certificate",
  gold: "Gold Award",
  blue_garnet: "Blue Garnet Trophy",
  icon: "Africa Education Icon",
};

export default function MyCertificates() {
  const { user, loading: authLoading } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getMyCertificates()
      .then((res) => setCerts(res?.data?.data ?? []))
      .catch(() => toast({ title: "Could not load certificates", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [user]);

  const handleShare = async (cert: Certificate) => {
    const url = `${window.location.origin}/certificates/verify?code=${cert.verificationCode}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: tierLabel[cert.tier], text: cert.nominee.name, url });
      } catch {/* dismissed */}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Verification link copied" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-charcoal text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <Award className="h-12 w-12 text-gold mx-auto" />
          <h1 className="text-3xl font-serif">Your Certificate Hub</h1>
          <p className="text-white/70">Sign in to view and download your NESA-Africa certificates.</p>
          <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
            <Link to={`/login?next=${encodeURIComponent("/my-certificates")}`}>Sign in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-white pb-24">
      <Helmet>
        <title>My Certificates — NESA-Africa</title>
        <meta
          name="description"
          content="Download, share and verify your NESA-Africa nominee and judge certificates."
        />
      </Helmet>

      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-charcoal-dark to-charcoal py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-3">
          <Badge variant="outline" className="border-gold/60 text-gold w-fit">
            <Award className="h-3 w-3 mr-1" /> Certificate Hub
          </Badge>
          <h1 className="text-3xl md:text-4xl font-serif">My Certificates</h1>
          <p className="text-white/70 max-w-2xl">
            All your NESA-Africa certificates in one place — nominee, participation, shortlist, winner and judge
            service. Every certificate is verifiable via QR code and a unique serial number.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        {certs.length === 0 ? (
          <Card className="bg-white/5 border-white/10 text-white">
            <CardContent className="py-12 text-center space-y-3">
              <Award className="h-10 w-10 text-white/40 mx-auto" />
              <p className="text-white/70">No certificates issued yet.</p>
              <p className="text-sm text-white/50">
                Once your nomination is verified or your judge service is recorded, your certificate appears here.
              </p>
              <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                <Link to="/nominate">Submit a nomination</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {certs.map((cert) => {
              const locked = !cert.downloadUrl;
              return (
                <Card key={cert.id} className="overflow-hidden bg-white/5 border-white/10 text-white">
                  <div className={`h-32 bg-gradient-to-br ${tierStyles[cert.tier] || tierStyles.platinum} p-4 flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <Award className="h-6 w-6" />
                      <span className="text-xs font-mono opacity-80">{cert.verificationCode}</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-80">{cert.season.name}</p>
                      <p className="font-bold text-lg leading-tight">{tierLabel[cert.tier] || cert.tier}</p>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <p className="font-semibold">{cert.nominee.name}</p>
                      {cert.nominee.organization && (
                        <p className="text-sm text-white/60">{cert.nominee.organization}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-white/60">
                      <span>Issued {new Date(cert.issuedAt).toLocaleDateString()}</span>
                      {cert.isLifetime ? (
                        <Badge variant="outline" className="border-gold/40 text-gold">Lifetime</Badge>
                      ) : cert.expiresAt ? (
                        <span>· Valid until {new Date(cert.expiresAt).toLocaleDateString()}</span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {locked ? (
                        <Button disabled variant="outline" className="flex-1 border-white/20 text-white/60">
                          <Lock className="h-4 w-4 mr-2" /> Download locked
                        </Button>
                      ) : (
                        <Button asChild className="flex-1 bg-gold text-charcoal hover:bg-gold/90">
                          <a href={cert.downloadUrl!} download>
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="border-white/20 hover:bg-white/10"
                        onClick={() => handleShare(cert)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button asChild variant="outline" className="border-white/20 hover:bg-white/10">
                        <Link to={`/certificates/verify?code=${cert.verificationCode}`}>
                          <ShieldCheck className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* How to download guide */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <QrCode className="h-5 w-5 text-gold" /> How to download your certificate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="text-white/80">
              <AccordionItem value="step-1" className="border-white/10">
                <AccordionTrigger>1. Sign in to your NESA-Africa account</AccordionTrigger>
                <AccordionContent>
                  Use the same email address linked to your nomination, judge profile or chapter account.
                  Forgotten password? Use the password reset link on the sign-in screen.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-2" className="border-white/10">
                <AccordionTrigger>2. Open the Certificate Hub</AccordionTrigger>
                <AccordionContent>
                  From your dashboard, click <strong>My Certificates</strong> (or visit{" "}
                  <code className="text-gold">/my-certificates</code>). Every certificate issued to you appears
                  as a card with the tier, season and serial number.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-3" className="border-white/10">
                <AccordionTrigger>3. Click “Download PDF”</AccordionTrigger>
                <AccordionContent>
                  A branded, landscape A4 PDF downloads with your name, category, season, serial number and a
                  QR code that links to the public verification page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step-4" className="border-white/10">
                <AccordionTrigger>4. Share or verify</AccordionTrigger>
                <AccordionContent>
                  Use the <strong>Share</strong> button for a social-ready link, or <strong>Verify</strong> to
                  preview the public verification record. Anyone with the QR code or serial number can confirm
                  authenticity.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="locked" className="border-white/10">
                <AccordionTrigger>Why is my download locked?</AccordionTrigger>
                <AccordionContent>
                  Platinum certificates unlock automatically once your nominee profile reaches 200 endorsements
                  and NRC verification is complete. You will receive an email the moment your certificate
                  unlocks.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
