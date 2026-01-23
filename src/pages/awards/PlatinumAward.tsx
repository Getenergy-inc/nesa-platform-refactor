import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle,
  FileCheck,
  Medal,
  RefreshCw,
  Shield,
  Users,
} from "lucide-react";

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
        <NESAHeader />

        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <Link
              to="/categories"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-amber-500/20 text-amber-400">Entry-Level Recognition</Badge>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                <span className="text-amber-400">Platinum</span> Certificate of Recognition
              </h1>
              <p className="mb-8 text-lg text-white/70">
                Baseline recognition for individuals and organizations contributing to
                Education for All in Africa. Non-competitive, NRC verified, valid for 1 year.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground">
                <Link to="/nominate">
                  <Award className="mr-2 h-5 w-5" />
                  Get Nominated
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Info */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <Card className="border-white/10 bg-white/5 text-center">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center gap-2 text-white">
                    <Users className="h-8 w-8 text-amber-400" />
                    Non-Competitive
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/60">
                  All valid nominations that pass NRC review receive recognition.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-center">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center gap-2 text-white">
                    <Shield className="h-8 w-8 text-amber-400" />
                    NRC Verified
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/60">
                  Every nomination is validated by the Nominee Research Corps.
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-white/5 text-center">
                <CardHeader>
                  <CardTitle className="flex flex-col items-center gap-2 text-white">
                    <Calendar className="h-8 w-8 text-amber-400" />
                    1-Year Validity
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white/60">
                  Certificate valid for one year with simple renewal process.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

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
                    <benefit.icon className="mx-auto mb-2 h-8 w-8 text-amber-400" />
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-xl font-bold text-amber-400">
                    {s.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <NESAFooter />
      </div>
    </>
  );
}
