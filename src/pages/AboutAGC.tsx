import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { 
  Coins, 
  Calendar, 
  Shield, 
  UserPlus, 
  Trophy,
  ArrowRight,
  Vote as VoteIcon,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSeason } from "@/contexts/SeasonContext";
import {
  VotingCalendarCard,
  EarningMethodsGrid,
  AGCRulesCard,
  AGCConversionCard,
  AGCFAQAccordion,
} from "@/components/agc";
import {
  GALA_WEEKEND,
  AGC_PRIMARY_ACTIONS,
  AGC_RULES,
} from "@/config/agcConfig";

export default function AboutAGC() {
  const { currentEdition } = useSeason();
  const location = useLocation();

  // Scroll to section if hash is present
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>{`About Afri Gold Coin (AGC) | ${currentEdition?.name || 'NESA-Africa 2025'}`}</title>
        <meta 
          name="description" 
          content="Learn about Afri Gold Coin (AGC), NESA-Africa's non-cash voting credit system. Earn AGCc, convert to AGC, and vote for Africa's education champions."
        />
      </Helmet>

      <main className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(196,160,82,0.15),transparent_50%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
                <Info className="mr-2 h-3 w-3" />
                About AGC
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
                About{" "}
                <span className="text-gold">Afri Gold Coin (AGC)</span>
              </h1>
              <p className="text-xl text-white/80 mb-6 max-w-2xl mx-auto">
                Afri Gold Coin (AGC) powers credible public participation in NESA-Africa.
              </p>
              <div className="flex items-center justify-center gap-2 text-gold mb-8">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">NESA-Africa Gala Weekend: {GALA_WEEKEND}</span>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap justify-center gap-3">
                {AGC_PRIMARY_ACTIONS.map((action) => (
                  <Link key={action.href} to={action.href}>
                    <Button 
                      variant={action.variant}
                      size="lg"
                      className={action.variant === "default" 
                        ? "bg-gold hover:bg-gold-dark text-charcoal font-semibold" 
                        : "border-gold/50 text-gold hover:bg-gold/10"
                      }
                    >
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container py-12">
          {/* What is AGC */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-gold" />
                  What Is Afri Gold Coin (AGC)?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Afri Gold Coin (AGC) is a digital voting credit used exclusively on the NESA-Africa platform to:
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Vote for nominees in public voting phases",
                    "Participate in NESA Africa TV campaigns",
                    "Engage with award shows and events",
                    "Support education impact initiatives",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <div className="h-2 w-2 rounded-full bg-gold mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Why AGC Exists */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Why AGC Exists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  AGC exists to support fair, verified, and transparent voting:
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      title: "Transparent Voting",
                      description: "Every vote is trackable and auditable",
                    },
                    {
                      title: "Prevents Manipulation",
                      description: "Verified credits prevent vote buying",
                    },
                    {
                      title: "Encourages Participation",
                      description: "Rewards genuine engagement",
                    },
                  ].map(({ title, description }) => (
                    <div key={title} className="rounded-lg bg-muted/50 p-4">
                      <h4 className="font-semibold mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Rules */}
          <AGCRulesCard className="mb-12" />

          {/* Conversion Explanation */}
          <AGCConversionCard className="mb-12" />

          {/* Voting Calendar */}
          <VotingCalendarCard className="mb-12" />

          {/* Earning Methods */}
          <EarningMethodsGrid className="mb-12" />

          {/* Where You Can Use AGC */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VoteIcon className="h-5 w-5 text-primary" />
                  Where You Can Use AGC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      title: "Gold Certificate Phase",
                      description: "100% Public Voting with AGC",
                      date: "April 10 – May 16, 2026",
                    },
                    {
                      title: "Blue Garnet Award Phase",
                      description: "40% Public Voting with AGC",
                      date: "May 18 – June 17, 2026",
                    },
                    {
                      title: "SCEF Services",
                      description: "Voting credits for SCEF campaigns",
                      date: "Ongoing",
                    },
                  ].map(({ title, description, date }) => (
                    <div key={title} className="rounded-lg border p-4 hover:border-gold/50 transition-colors">
                      <h4 className="font-semibold mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{description}</p>
                      <Badge variant="secondary" className="text-xs">
                        {date}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* About AGC (Purpose) */}
          <section className="mb-12">
            <Card className="bg-gradient-to-br from-gold/5 to-primary/5 border-gold/20">
              <CardContent className="p-8">
                <div className="max-w-2xl mx-auto text-center">
                  <Coins className="h-12 w-12 text-gold mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">About Afri Gold Coin (AGC)</h2>
                  <p className="text-muted-foreground mb-6">
                    Afri Gold Coin (AGC) powers credible public participation in NESA-Africa.
                    It exists to:
                  </p>
                  <ul className="space-y-2 text-left max-w-md mx-auto mb-6">
                    {[
                      "Encourage genuine engagement",
                      "Reward advocacy for education",
                      "Protect voting integrity",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg bg-background/80 p-4 border">
                    <p className="text-sm text-muted-foreground">
                      <strong>Important:</strong> AGC is not a financial instrument. 
                      It has no monetary value outside the NESA-Africa platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQs */}
          <AGCFAQAccordion className="mb-12" />

          {/* Compliance Notice */}
          <section className="mb-12">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">Compliance & Integrity Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      All AGC activities are logged, verified, and monitored. Abuse, duplication, 
                      or manipulation results in disqualification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-charcoal to-charcoal/90 py-16">
          <div className="container text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Create an account, earn AGC, and start voting for Africa's education champions.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
              <Link to="/nominate">
                <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  <Trophy className="mr-2 h-4 w-4" />
                  Nominate & Earn
                </Button>
              </Link>
              <Link to="/vote-with-agc">
                <Button size="lg" className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
                  Vote Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
