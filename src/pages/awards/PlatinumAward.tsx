import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardHeroSection } from "@/components/awards/AwardHeroSection";
import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Award, FileCheck, Medal, RefreshCw, Shield } from "lucide-react";

const benefits = [
  { icon: Medal, title: "Recognition", description: "Official recognition of your contribution to education in Africa." },
  { icon: FileCheck, title: "Certificate", description: "QR-verifiable digital certificate with unique verification code." },
  { icon: Shield, title: "NRC Validated", description: "Your work is validated by the Nominee Research Corps." },
  { icon: RefreshCw, title: "Annual Renewal", description: "Certificate valid for 1 year with simple renewal process." },
];

const steps = [
  { step: 1, title: "Nomination", description: "Someone nominates you or you self-nominate with evidence." },
  { step: 2, title: "NRC Review", description: "Nominee Research Corps validates your contribution." },
  { step: 3, title: "Approval", description: "Upon verification, Platinum Certificate is issued." },
  { step: 4, title: "Download", description: "Access your QR-verifiable certificate from your dashboard." },
];

const platinumTVShow = getTVShowByAward("platinum");

export default function PlatinumAward() {
  return (
    <>
      <Helmet>
        <title>Platinum Certificate | NESA-Africa Recognition</title>
        <meta
          name="description"
          content="The Platinum Certificate is NESA-Africa's baseline recognition for individuals and organizations contributing to Education for All in Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-20">
          <Breadcrumbs 
            items={[
              { label: "Awards", href: "/categories" },
              { label: "Platinum Certificate" },
            ]}
            className="text-ivory/60"
          />
        </div>

        {/* Hero */}
        <AwardHeroSection
          variant="platinum"
          title="Platinum"
          titleAccent="Certificate"
          description="The foundational recognition for all NESA nominees. A non-competitive, governance-verified certificate of excellence across 17 education categories."
          primaryAction={{
            label: "Submit Nomination",
            href: "/nominate",
            icon: Award,
          }}
          secondaryAction={{
            label: "28 Feb 2026",
          }}
        />

        {/* Benefits */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Benefits
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-white/10 bg-white/5">
                  <CardHeader className="text-center">
                    <benefit.icon className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                    <CardTitle className="text-white">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-white/60">
                    {benefit.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              How It Works
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.step} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-500/20 text-xl font-bold text-slate-300">
                    {s.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TV Show Section */}
        {platinumTVShow && <AwardTVShowSection show={platinumTVShow} accentColor="amber" />}

        {/* Certificate Gallery */}
        <CertificateGallery />

        {/* CTA */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Ready to Be Recognized?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Nominate yourself or someone making a difference in African education.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link to="/nominate">Start Nomination</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
