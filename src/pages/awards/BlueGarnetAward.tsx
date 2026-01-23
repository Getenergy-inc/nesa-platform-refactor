import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Calendar, Play, Scale, Star, Trophy, Users } from "lucide-react";

const scoringBreakdown = [
  { label: "Jury Scoring", percentage: 60, color: "bg-purple-500" },
  { label: "Public Voting", percentage: 40, color: "bg-yellow-500" },
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
              <Badge className="mb-4 bg-purple-500/20 text-purple-400">Highest Honour</Badge>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Africa Education <span className="text-purple-400">Blue Garnet</span> Award
              </h1>
              <p className="mb-8 text-lg text-white/70">
                The pinnacle of recognition in African education. 9 winners selected through
                a rigorous process combining expert jury evaluation and public endorsement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/media/gala">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Gala
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/awards/winners">Past Winners</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-purple-400">9</div>
                <div className="text-white/60">Winners per Season</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-purple-400">60/40</div>
                <div className="text-white/60">Jury / Public Split</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-purple-400">Live</div>
                <div className="text-white/60">Gala Announcement</div>
              </div>
            </div>
          </div>
        </section>

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
              ].map((step, i) => (
                <div key={step.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20">
                    <step.icon className="h-7 w-7 text-purple-400" />
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
              <Calendar className="mx-auto mb-6 h-12 w-12 text-purple-400" />
              <h2 className="mb-4 font-display text-3xl font-bold text-white">
                The Awards Gala
              </h2>
              <p className="mb-8 text-white/70">
                A spectacular 6-hour live broadcast celebrating Africa's education champions.
                Blue Garnet winners are announced in the final segment to a continental audience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="bg-primary text-primary-foreground">
                  <Link to="/tickets">Get Tickets</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/media/gala">Watch Archive</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
