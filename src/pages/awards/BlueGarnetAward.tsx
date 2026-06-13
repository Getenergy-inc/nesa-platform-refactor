import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FeaturedNomineesBlock } from "@/components/nominees/FeaturedNomineesBlock";

import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardCategoriesGrid } from "@/components/awards/AwardCategoriesGrid";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { AwardStandardStack } from "@/components/awards/AwardStandardSections";
import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Scale, Ticket, Trophy, Tv, Users, Vote } from "lucide-react";

const blueGarnetTVShow = getTVShowByAward("blue-garnet");

const scoringBreakdown = [
  { label: "Jury Scoring", percentage: 60, color: "bg-blue-500" },
  { label: "Public Voting", percentage: 40, color: "bg-gold" },
];

export default function BlueGarnetAward() {
  return (
    <>
      <Helmet>
        <title>Blue Garnet Award | NESA-Africa Highest Honour</title>
        <meta
          name="description"
          content="The Africa Education Blue Garnet Award is NESA-Africa's highest honour — 60% Jury scoring, 40% Public voting, 9 winners announced at the live Gala."
        />
        <link rel="canonical" href="https://nesa.africa/awards/blue-garnet" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Blue Garnet", path: "/awards/blue-garnet" }]} />

      <div className="min-h-screen bg-charcoal">
        <BrandedCategoryHero
          theme="bluegarnet"
          headlineLead="Who Will Claim"
          headlineAccent="The Blue Garnet?"
          description="The pinnacle of NESA recognition — Africa's most prestigious education honour. 60% expert jury scoring, 40% public voting, 9 continental winners revealed on a live global broadcast."
          tags={["Prestige", "Gala", "60% Jury", "40% Public", "Global Broadcast", "9 Winners"]}
          stats={[
            { value: "9", label: "Continental Winners" },
            { value: "60/40", label: "Jury / Public Split" },
            { value: "Lagos", label: "27 June 2026" },
          ]}
          primaryCta={{ label: "Get Gala Tickets", href: "/tickets" }}
          secondaryCta={{ label: "How Jury Scoring Works", href: "/governance" }}
          watchCta={{ label: "Watch Past Galas", href: "/media/gala" }}
          imageAlt="Blue Garnet Award — Africa's highest education honour"
        />
        <BrandedDocumentaryPreview
          theme="bluegarnet"
          title="Inside the Blue Garnet"
          description="The road from Gold Certificate to continental glory — jury deliberations, public momentum, and the gala night that crowns Africa's nine education leaders."
          watchCtaHref="/media/gala"
          imageAlt="Blue Garnet documentary preview"
        />


        {/* Scoring Breakdown */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Scoring Breakdown
            </h2>
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 flex h-8 overflow-hidden rounded-full">
                {scoringBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className={`${item.color} flex items-center justify-center text-sm font-semibold text-white`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage}%
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {scoringBreakdown.map((item) => (
                  <Card key={item.label} className="border-white/10 bg-white/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                        {item.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-white/60">
                      {item.label === "Jury Scoring"
                        ? "Expert panel evaluates finalists on impact, innovation, and sustainability."
                        : "Public votes from the Gold Certificate stage carry forward."}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Selection Process
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
              {[
                { icon: Award, title: "Gold Winners", desc: "Gold Certificate winners become finalists" },
                { icon: Users, title: "Jury Review", desc: "Expert panel scores all finalists" },
                { icon: Scale, title: "Combined Score", desc: "60% Jury + 40% Public votes" },
                { icon: Trophy, title: "Gala Reveal", desc: "Winners announced at live ceremony" },
              ].map((step) => (
                <div key={step.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">
                    <step.icon className="h-7 w-7 text-blue-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-white/60">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Gala */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Calendar className="mx-auto mb-6 h-12 w-12 text-blue-400" />
              <h2 className="mb-4 font-display text-3xl font-bold text-white">
                The Awards Gala
              </h2>
              <p className="mb-8 text-white/70">
                A spectacular 6-hour live broadcast celebrating Africa's education champions.
                Blue Garnet winners are announced in the final segment to a continental audience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-gold text-charcoal hover:bg-gold-dark">
                  <Link to="/tickets">Get Tickets</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/media/gala">Watch Archive</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* TV Show Section */}
        {blueGarnetTVShow && <AwardTVShowSection show={blueGarnetTVShow} accentColor="blue" />}

        {/* Award Categories - 9 Blue Garnet categories + 1 Africa Icon Blue Garnet */}
        <AwardCategoriesGrid 
          tier="blue-garnet"
          accentColor="blue"
          title="Blue Garnet Award Categories"
          description="9 major categories + 1 Africa Education Icon Blue Garnet. Gold winners advance to Blue Garnet with 60% jury + 40% public scoring."
        />

        {/* Standard NESA-Africa premium platform stack */}
        <AwardStandardStack
          awardName="Blue Garnet"
          why={{
            title: "Why the Blue Garnet Award Exists",
            pillars: [
              { label: "Competitive Excellence", description: "Identifies the strongest current education changemakers across nine flagship continental tracks." },
              { label: "Public Participation", description: "Anchored in audited AGC voting so Africa itself helps decide who wins." },
              { label: "Evidence-First Recognition", description: "Combines expert jury scoring with public voice under the verifiable Blue Garnet formula." },
            ],
          }}
          eligibility={{
            intro: "Open to nominees advanced from the Gold tier with verifiable, current-cycle impact in an eligible Blue Garnet category.",
            bullets: [
              "Active, verifiable education impact in 2024–2026",
              "Successful NRC verification of evidence and identity",
              "Advanced from a Gold tier category in the same cycle",
              "Adherence to NESA-Africa conflict-of-interest rules",
            ],
            disqualifiers: [
              "Vote manipulation or coordinated inauthentic behaviour",
              "Failure to provide evidence within the cure window",
              "Sanctions or disqualifying integrity findings",
            ],
          }}
          edx={{
            weights: { E: "35%", D: "30%", X: "35%" },
            highlights: ["Education Impact", "Innovation", "Reach", "Governance"],
          }}
          timeline={{
            intro: "Blue Garnet adds a public voting stage that runs alongside jury scoring before the live gala reveal.",
          }}
          faqs={[
            { q: "How is the final Blue Garnet score calculated?", a: "60% independent jury score + 40% audited public AGC voting, combined via the published Blue Garnet formula." },
            { q: "Who votes?", a: "Verified NESA-Africa participants using AGC voting credits, with per-session uniqueness enforced at the database level." },
            { q: "When are winners announced?", a: "9 continental winners are revealed live at the Blue Garnet Gala broadcast." },
          ]}
        />

        <section className="bg-charcoal py-8">
          <div className="container mx-auto px-4">
            <FeaturedNomineesBlock
              awardFamily="gold-bluegarnet"
              title="Existing Blue Garnet Nominees"
              subtitle="Public voting + jury scoring — discover the changemakers in the running."
              limit={6}
              viewAllHref="/nominees?awardFamily=gold-bluegarnet"
            />
          </div>
        </section>

      </div>
    </>
  );
}
