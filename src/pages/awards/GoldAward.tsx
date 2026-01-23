import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Globe, Medal, Trophy, Users, Vote } from "lucide-react";

const features = [
  { icon: Vote, title: "100% Public Voting", description: "Winners determined entirely by public votes — no jury influence." },
  { icon: Globe, title: "Region-First", description: "Regional winners qualify for continental competition." },
  { icon: Users, title: "180+ Subcategories", description: "Covering all 17 categories across 5 African regions." },
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
          content="The Gold Certificate is NESA-Africa's competitive public-voted recognition across 180+ subcategories and 5 African regions."
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
              <Badge className="mb-4 bg-yellow-500/20 text-yellow-400">Competitive Recognition</Badge>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                <span className="text-yellow-400">Gold</span> Certificate of Recognition
              </h1>
              <p className="mb-8 text-lg text-white/70">
                Competitive recognition through 100% public voting across 180+ subcategories.
                Region-first approach ensures continental representation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/vote">
                    <Vote className="mr-2 h-5 w-5" />
                    Vote Now
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/nominate">Nominate</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-4">
              <div>
                <div className="mb-2 text-4xl font-bold text-yellow-400">180+</div>
                <div className="text-white/60">Subcategories</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-yellow-400">17</div>
                <div className="text-white/60">Main Categories</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-yellow-400">5</div>
                <div className="text-white/60">African Regions</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-yellow-400">100%</div>
                <div className="text-white/60">Public Voting</div>
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
                    <feature.icon className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
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
                  className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-6 py-3 text-yellow-400"
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-xl font-bold text-yellow-400">
                    {s.step}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        <NESAFooter />
      </div>
    </>
  );
}
