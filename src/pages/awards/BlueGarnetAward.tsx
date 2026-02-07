import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardHeroSection } from "@/components/awards/AwardHeroSection";
import { AwardCategoriesGrid } from "@/components/awards/AwardCategoriesGrid";
import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
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
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-20">
          <Breadcrumbs 
            items={[
              { label: "Awards", href: "/categories" },
              { label: "Blue Garnet Award" },
            ]}
            className="text-ivory/60"
          />
        </div>

        {/* Hero */}
        <AwardHeroSection
          variant="blue-garnet"
          title="Blue"
          titleAccent="Garnet"
          description="The pinnacle of NESA recognition. The most prestigious education awards ceremony in Africa."
          featureBadges={[
            { label: "40% Public Vote", icon: Vote },
            { label: "60% Jury Selection", icon: Users },
            { label: "Live Global Broadcast", icon: Tv },
          ]}
          primaryAction={{
            label: "Get Gala Tickets",
            href: "/tickets",
            icon: Ticket,
          }}
          secondaryAction={{
            label: "June 27, 2026 • Lagos",
          }}
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

        {/* Award Categories */}
        <AwardCategoriesGrid 
          tier="blue-garnet"
          accentColor="blue"
          title="Blue Garnet Award Categories"
          description="All 17 official NESA-Africa categories compete for the Blue Garnet Award — Africa's highest education honour."
        />

        {/* Certificate Gallery */}
        <CertificateGallery />
      </div>
    </>
  );
}
