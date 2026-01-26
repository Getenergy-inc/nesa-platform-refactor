import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSeason } from "@/contexts/SeasonContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Globe,
  Heart,
  Shield,
  Target,
  Trophy,
  Users,
  ChevronRight,
} from "lucide-react";

const pillars = [
  {
    icon: Trophy,
    title: "Recognition",
    description: "Celebrating Africa's education champions through merit-based awards across 17 categories.",
  },
  {
    icon: Shield,
    title: "Accountability",
    description: "Governance-grade firewalls ensure sponsor independence and voting integrity.",
  },
  {
    icon: Globe,
    title: "Continental Reach",
    description: "Region-first approach covering all 5 African regions plus Diaspora and Friends of Africa.",
  },
  {
    icon: Heart,
    title: "Impact",
    description: "Driving Education for All through visibility, validation, and volunteer engagement.",
  },
];

const quickLinks = [
  { label: "Vision 2035", href: "/about/vision-2035", icon: Target },
  { label: "Governance & Firewalls", href: "/about/governance", icon: Shield },
  { label: "Programme Timeline", href: "/about/timeline", icon: BookOpen },
  { label: "SCEF Foundation", href: "/about/scef", icon: Users },
];

export default function About() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>About NESA-Africa | New Education Standard Award Africa</title>
        <meta
          name="description"
          content="NESA-Africa is a governance-grade education accountability platform recognizing Africa's changemakers shaping the future of education."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-4 inline-block rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold">
              {currentEdition?.displayYear} Edition
            </span>
            <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              About <span className="text-gold">NESA-Africa</span>
            </h1>
            <p className="mb-8 text-lg text-white/70 md:text-xl">
              The New Education Standard Award Africa is not an awards website.
              It is a <strong className="text-white">governance-grade education accountability platform</strong> —
              celebrating, validating, and amplifying Africa's education champions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-charcoal">
                <Link to="/categories">
                  <Award className="mr-2 h-5 w-5" />
                  Explore Categories
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/nominate">Nominate Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-3xl font-bold text-white">Our Mission</h2>
            <p className="text-lg leading-relaxed text-white/80">
              To recognize, validate, and celebrate individuals, organizations, and institutions
              driving <strong className="text-gold">Education for All</strong> across Africa —
              through transparent, merit-based awards that inspire action and accountability.
            </p>
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-charcoal/95 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
            Our Four Pillars
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="border-white/10 bg-white/5">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10">
                    <pillar.icon className="h-6 w-6 text-gold" />
                  </div>
                  <CardTitle className="text-white">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/60">{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Award Tiers Overview */}
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-center font-display text-3xl font-bold text-white">
            Award Tiers
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-white/60">
            Four distinct recognition platforms, each with unique criteria and selection processes.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <Trophy className="h-5 w-5" />
                  Platinum Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/70">
                Baseline recognition for service contribution to Education for All.
                Non-competitive, NRC verified, valid for 1 year.
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-400">
                  <Award className="h-5 w-5" />
                  Africa Education Icon
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/70">
                Lifetime achievement recognition. 3 subcategories across Africa, Diaspora, and Friends of Africa.
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-gradient-to-br from-yellow-500/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Award className="h-5 w-5" />
                  Gold Certificate
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/70">
                Competitive recognition through 100% public voting. Region-first approach feeds into Blue Garnet.
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Trophy className="h-5 w-5" />
                  Blue Garnet Award
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/70">
                Highest honour — 60% Jury scoring, 40% Public voting. 9 winners announced at the live Gala.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-charcoal/95 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-white">
            Learn More
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:border-gold/50 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <link.icon className="h-5 w-5 text-gold" />
                  <span className="font-medium text-white">{link.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
