import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardHeroSection } from "@/components/awards/AwardHeroSection";
import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Globe, Trophy, Users, Vote } from "lucide-react";

const goldTVShow = getTVShowByAward("gold");

const features = [
  { icon: Vote, title: "100% Public Voting", description: "Winners determined entirely by public votes — no jury influence." },
  { icon: Globe, title: "Region-First", description: "Regional winners qualify for continental competition." },
  { icon: Users, title: "135+ Subcategories", description: "Covering all major categories across 5 African regions." },
  { icon: Trophy, title: "Feeds Blue Garnet", description: "Gold winners become Blue Garnet finalists for highest honour." },
];

const regions = [
  "North Africa",
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
];

export default function GoldAward() {
  return (
    <>
      <Helmet>
        <title>Gold Certificate | NESA-Africa Public-Voted Recognition</title>
        <meta
          name="description"
          content="The Gold Certificate is NESA-Africa's competitive public-voted recognition across 135 subcategories and 5 African regions."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <AwardHeroSection
          variant="gold"
          title="Gold"
          titleAccent="Certificate"
          description="The competitive stage of NESA recognition. 135 subcategories across 9 major categories, determined by public voting."
          features={["100% Public Voting", "No Judges", "Region-First Competition"]}
          primaryAction={{
            label: "Nominate for Gold",
            href: "/nominate",
            icon: Award,
          }}
          secondaryAction={{
            label: "Gold Show: 17 May 2026",
          }}
        />

        {/* Timeline Strip */}
        <section className="border-t border-white/10 bg-charcoal py-6">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-4 text-center md:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">Voting Opens</div>
                <div className="mt-1 font-semibold text-white">1 Mar 2026</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">Voting Closes</div>
                <div className="mt-1 font-semibold text-white">30 Apr 2026</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-white/50">Winners Announced</div>
                <div className="mt-1 font-semibold text-white">17 May 2026</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Key Features
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-white/10 bg-white/5 text-center">
                  <CardHeader>
                    <feature.icon className="mx-auto mb-2 h-8 w-8 text-amber-400" />
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-white/60">{feature.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Regions */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center font-display text-3xl font-bold text-white">
              Region-First Approach
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
              Winners are selected at regional level first, ensuring fair representation across the continent.
            </p>
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
              {regions.map((region) => (
                <div
                  key={region}
                  className="rounded-full border border-amber-500/30 bg-amber-500/10 px-6 py-3 text-amber-400"
                >
                  {region}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              How It Works
            </h2>
            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-4">
              {[
                { step: 1, title: "Nomination", desc: "Submit or receive nomination with evidence" },
                { step: 2, title: "NRC Review", desc: "Validation by Nominee Research Corps" },
                { step: 3, title: "Public Voting", desc: "Open voting by the public" },
                { step: 4, title: "Gold Winner", desc: "Top vote-getter wins Gold Certificate" },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-xl font-bold text-amber-400">
                    {s.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TV Show Section */}
        {goldTVShow && <AwardTVShowSection show={goldTVShow} accentColor="gold" />}

        {/* Certificate Gallery */}
        <CertificateGallery />

        {/* CTA */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Ready to Compete for Gold?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Get nominated or cast your vote for Africa's education champions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground">
                <Link to="/nominate">Submit Nomination</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/vote">Vote Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
