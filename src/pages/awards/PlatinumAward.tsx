import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardCategoriesGrid } from "@/components/awards/AwardCategoriesGrid";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { AwardStandardStack } from "@/components/awards/AwardStandardSections";
import { getTVShowByAward } from "@/config/awardTVShows";
import { getCategoriesByTier, getCategoriesGrouped } from "@/config/nesaCategories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <link rel="canonical" href="https://nesa.africa/awards/platinum" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Platinum Certificate", path: "/awards/platinum" }]} />

      <div className="min-h-screen bg-charcoal">
        <BrandedCategoryHero
          theme="platinum"
          headlineLead="Earn the Foundational"
          headlineAccent="Platinum Certificate"
          description="The foundational recognition for all 17 NESA categories. 7 core categories require 100 renominations, 10 standard categories require 200 renominations to unlock certificate download."
          tags={["Foundational", "17 Categories", "NRC Validated", "QR-Verifiable", "Annual Renewal"]}
          stats={[
            { value: "17", label: "Categories Covered" },
            { value: "100–200", label: "Renominations to Unlock" },
            { value: "QR", label: "Verifiable Certificate" },
          ]}
          primaryCta={{ label: "Submit Nomination", href: "/nominate" }}
          secondaryCta={{ label: "Reveal Show: 28 Feb 2026", href: "/awards/platinum" }}
          watchCta={{ label: "Watch Recipient Stories", href: "/media" }}
          imageAlt="Platinum Certificate — NESA-Africa baseline recognition"
        />
        <BrandedDocumentaryPreview
          theme="platinum"
          title="Foundations of Recognition"
          description="See how thousands of educators, institutions, and changemakers earn their Platinum Certificate — the first step on the NESA recognition pathway."
          watchCtaHref="/media"
          imageAlt="Platinum Certificate documentary preview"
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

        {/* Award Categories - Platinum Certificate (Institutional) */}
        <AwardCategoriesGrid
          categories={getCategoriesGrouped().platinum}
          tier="platinum"
          accentColor="slate"
          title="Platinum Certificate Categories"
          description="Institutional recognition categories under Platinum certification."
        />


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
              <Link to="/nominate?family=platinum">Start Nomination</Link>
            </Button>
          </div>
        </section>

        {/* Standard NESA-Africa premium platform stack */}
        <AwardStandardStack
          awardName="Platinum Recognition"
          why={{
            title: "Why Platinum Recognition Exists",
            pillars: [
              { label: "Institutional Trust", description: "Verifies institutions, ministries, foundations, and corporates whose education work is real, governed, and reportable." },
              { label: "Verification Before Recognition", description: "Every Platinum honouree clears NRC review and EDX scoring before any certificate is issued." },
              { label: "Partner Confidence", description: "Gives donors, ministries, and multilateral partners a credible signal of impact and governance." },
            ],
          }}
          eligibility={{
            intro: "Open to NGOs, schools, government agencies, universities, and corporates with verifiable education impact and governance.",
            bullets: [
              "Legally registered entity with public-record governance",
              "Documented education programmes with beneficiary evidence",
              "Multi-year track record (typically 3+ years)",
              "Willingness to submit to NRC verification and EDX scoring",
            ],
            disqualifiers: [
              "Unverifiable or contradictory institutional records",
              "Active safeguarding or anti-bribery red flags",
              "Refusal of evidence audit during the cure window",
            ],
          }}
          edx={{
            weights: { E: "35%", D: "40%", X: "25%" },
            highlights: ["Education Impact", "Sustainability", "Governance", "Community Impact"],
          }}
          faqs={[
            { q: "Is Platinum a competition?", a: "No. Platinum is a verified institutional certificate, not a competitive ranking. Each qualifying institution can be recognised on its own merits." },
            { q: "How long is the certificate valid?", a: "One year, renewable through a streamlined re-verification." },
            { q: "Can a Platinum institution also enter Blue Garnet?", a: "Yes, where an eligible Blue Garnet category exists for the institution's work." },
          ]}
        />
      </div>
    </>
  );
}
