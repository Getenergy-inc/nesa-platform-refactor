import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSeason } from "@/contexts/SeasonContext";
import { PROGRAMME_TIMELINE_2026 } from "@/config/agcConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileCheck,
  Trophy,
  Users,
  Vote,
  Star,
  Award,
  Tv,
  Heart,
  Coins,
  Sparkles,
  Globe,
  Play,
  ArrowRight,
  Handshake,
  GraduationCap,
  Target,
  Megaphone,
  School,
  MapPin,
  Crown,
  Gem,
} from "lucide-react";

const phaseIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "platinum-show": Star,
  "icon-nominations-close": FileCheck,
  "icon-show": Crown,
  "jury-onboarding": Users,
  "gold-nominations-close": FileCheck,
  "gold-voting": Vote,
  "gold-show": Tv,
  "blue-garnet-voting": Vote,
  "blue-garnet-gala": Trophy,
  "rmsa-launch": Heart,
};

const isVotingPhase = (phase: string) => /gold|blue garnet|voting/i.test(phase);

const REGIONS = [
  "North Africa",
  "West Africa",
  "Central Africa",
  "East Africa",
  "Southern Africa",
  "Sahel Region",
  "Horn of Africa",
  "Indian Ocean",
  "Diaspora / Global Africa",
  "Friends of Africa",
];

const CATEGORY_PATHWAYS = [
  {
    icon: Crown,
    title: "Africa Education Icon",
    subtitle: "Lifetime Achievement",
    selection: "Jury selection only",
    scope: "2006–2026",
    description:
      "A continental honour recognising transformational leaders who have shaped education across Africa over the past two decades.",
    placement: "Nominations close 20 June · Show 25 June 2026",
    accent: "from-amber-500/20 to-yellow-600/10 border-amber-500/40",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    icon: Star,
    title: "Platinum",
    subtitle: "Institutional Leadership",
    selection: "NRC verification + governance criteria",
    scope: "Institutions · Diaspora · Partnerships",
    description:
      "Recognises institutional leadership, diaspora impact, political leadership, and international partnerships that strengthen education systems.",
    placement: "Platinum Recognition Show · 11 June 2026",
    accent: "from-slate-400/20 to-slate-500/10 border-slate-400/40",
    badgeClass: "bg-slate-400/20 text-slate-200 border-slate-400/40",
  },
  {
    icon: Sparkles,
    title: "Gold Special Recognition",
    subtitle: "2026 Edition",
    selection: "Public participation / visibility-led",
    scope: "Sports · Music · Social Influence",
    description:
      "Celebrates cultural and public figures advancing education through sports, music, and social media influence.",
    placement: "Voting 13 Jul – 25 Sep · Winners Show 1 Oct 2026",
    accent: "from-yellow-500/20 to-amber-500/10 border-yellow-500/40",
    badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  {
    icon: Gem,
    title: "Blue Garnet",
    subtitle: "Competitive Excellence",
    selection: "Public voting + jury evaluation",
    scope: "Final Prestige Stage",
    description:
      "Represents the final prestige stage of the season across the leading competitive categories.",
    placement: "Voting 2 – 22 Oct · Gala 22 Oct 2026",
    accent: "from-blue-500/20 to-indigo-600/10 border-blue-500/40",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
];

const SUMMARY_CARDS = [
  {
    icon: Calendar,
    label: "Campaign Window",
    value: "June → 22 Oct 2026",
    detail: "6-month continental campaign",
  },
  {
    icon: Trophy,
    label: "Main Gala",
    value: "22 October 2026",
    detail: "Blue Garnet Awards Gala",
  },
  {
    icon: Heart,
    label: "Impact Phase",
    value: "Oct 2026 → Oct 2027",
    detail: "Rebuild My School Africa",
  },
  {
    icon: Handshake,
    label: "Continuous Engine",
    value: "Always-On",
    detail: "Partnerships · CSR · Media",
  },
];

const FEATURED_VIDEOS = [
  { title: "Platinum Recognition Show Trailer", tag: "June 2026" },
  { title: "Africa Education Icon Feature", tag: "June 2026" },
  { title: "Meet the Judges — 2026 Season", tag: "July 2026" },
  { title: "Gold Winners Show Highlights", tag: "October 2026" },
  { title: "Blue Garnet Gala Trailer", tag: "October 2026" },
  { title: "Rebuild My School Africa Preview", tag: "October 2026" },
];

const IMPACT_PHASES = [
  {
    icon: School,
    title: "School Nominations",
    period: "August – November 2026",
    description: "Communities nominate special needs and underserved schools across regions.",
  },
  {
    icon: Coins,
    title: "Funding Activation",
    period: "October – December 2026",
    description: "Sponsors, partners, and CSR programs activate funding pools per region.",
  },
  {
    icon: Target,
    title: "Implementation",
    period: "January – June 2027",
    description: "On-the-ground intervention through EduAid Africa regional partners.",
  },
  {
    icon: Megaphone,
    title: "Impact Reporting",
    period: "July – October 2027",
    description: "Storytelling, audited reporting, and continental visibility of results.",
  },
];

export default function Timeline() {
  const { currentEdition } = useSeason();
  const [activeTab, setActiveTab] = useState("tv");

  return (
    <>
      <Helmet>
        <title>2026 Season Programme Timeline | NESA-Africa</title>
        <meta
          name="description"
          content="Follow the 2026 NESA Africa journey: a 6-month campaign from nominations to the Blue Garnet Awards Gala on 22 October 2026, plus a 12-month Rebuild My School Africa impact phase."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* 1. HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal via-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),_transparent_60%)]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-6 border-primary/40 bg-primary/10 text-primary">
                2026 Season
              </Badge>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
                2026 Season<br />
                <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                  Programme Timeline
                </span>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70 md:text-xl">
                A 6-month journey from nominations to the live Blue Garnet Awards Gala,
                followed by a 12-month social impact phase through Rebuild My School Africa.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" asChild className="bg-primary text-charcoal hover:bg-primary/90">
                  <Link to="/nominate">Nominate Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/categories">View Categories</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/partners">Partner With Us</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/media/nesa-tv">
                    <Play className="mr-2 h-4 w-4" /> Watch NESA TV
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SEASON SUMMARY STRIP */}
        <section className="border-y border-white/5 bg-charcoal-light/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {SUMMARY_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.label} className="border-white/10 bg-white/5">
                    <CardContent className="p-5">
                      <Icon className="mb-3 h-6 w-6 text-primary" />
                      <p className="text-xs uppercase tracking-wider text-white/50">{card.label}</p>
                      <p className="mt-1 font-display text-lg font-bold text-white">{card.value}</p>
                      <p className="mt-1 text-xs text-white/60">{card.detail}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. CAMPAIGN & AWARDS JOURNEY */}
        <section id="journey" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
                Season 1
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                Campaign, Voting & Awards Journey
              </h2>
              <p className="text-white/70">
                The 2026 season runs as a phased campaign designed to build credibility, engagement,
                visibility, partnerships, and suspense toward the final Blue Garnet Awards Gala.
              </p>
            </div>

            <div className="relative mx-auto max-w-5xl">
              <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary/60 via-primary/30 to-transparent md:left-1/2 md:block md:-translate-x-1/2" />

              <div className="space-y-6">
                {PROGRAMME_TIMELINE_2026.map((phase, i) => {
                  const Icon = phaseIcons[phase.id] || FileCheck;
                  const isActive = phase.status === ("active" as string);
                  const isCompleted = phase.status === ("completed" as string);

                  return (
                    <div
                      key={phase.id}
                      className={`relative flex gap-6 md:gap-12 ${
                        i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      <div className="absolute left-6 top-2 z-10 hidden -translate-x-1/2 md:left-1/2 md:flex">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                            isActive
                              ? "border-primary bg-primary/20"
                              : isCompleted
                              ? "border-green-500 bg-green-500/20"
                              : "border-primary/40 bg-charcoal"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-primary/70"}`} />
                          )}
                        </div>
                      </div>

                      <Card
                        className={`flex-1 border-white/10 transition-all hover:border-primary/30 ${
                          isActive ? "bg-primary/5 ring-1 ring-primary/30" : "bg-white/5"
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <CardTitle className="flex items-center gap-2 text-white">
                              <Icon className={`h-5 w-5 md:hidden ${isActive ? "text-primary" : "text-primary/70"}`} />
                              <span>{phase.phase}</span>
                              {isVotingPhase(phase.phase) && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                  <Coins className="h-3 w-3" /> AGC
                                </span>
                              )}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={
                                isActive
                                  ? "shrink-0 border-primary/50 bg-primary/10 text-primary"
                                  : isCompleted
                                  ? "shrink-0 border-green-500/50 text-green-400"
                                  : "shrink-0 border-white/20 text-white/60"
                              }
                            >
                              {isActive ? "Active" : isCompleted ? "Done" : "Upcoming"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-primary/80">
                            <Clock className="h-4 w-4" />
                            {phase.period}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-white/70">{phase.description}</p>
                          {(phase as any).focus && (
                            <div className="flex flex-wrap gap-2">
                              {(phase as any).focus.split("·").map((f: string) => (
                                <span
                                  key={f}
                                  className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] text-primary/90"
                                >
                                  {f.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="hidden flex-1 md:block" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CATEGORY PATHWAYS */}
        <section id="pathways" className="border-t border-white/5 bg-charcoal-light/20 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
                Category Pathways
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                How Awards Move Through the Season
              </h2>
              <p className="text-white/70">
                Four distinct pathways — each with its own purpose, process, and recognition model.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {CATEGORY_PATHWAYS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={cat.title}
                    className={`border bg-gradient-to-br ${cat.accent} transition-all hover:scale-[1.02]`}
                  >
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={cat.badgeClass}>{cat.subtitle}</Badge>
                      </div>
                      <CardTitle className="text-2xl text-white">{cat.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/80">{cat.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex gap-2">
                          <span className="text-white/50">Selection:</span>
                          <span className="text-white/90">{cat.selection}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white/50">Scope:</span>
                          <span className="text-white/90">{cat.scope}</span>
                        </div>
                        <div className="flex gap-2 border-t border-white/10 pt-2">
                          <Calendar className="h-4 w-4 shrink-0 text-primary" />
                          <span className="text-primary/90">{cat.placement}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Link to="/categories">View All Categories</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/categories">Explore Subcategories</Link>
              </Button>
              <Button asChild className="bg-primary text-charcoal hover:bg-primary/90">
                <Link to="/nominate">Nominate by Category</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. REGIONAL PARTICIPATION */}
        <section id="regions" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
                Continental Reach
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                Explore Africa's Regions
              </h2>
              <p className="text-white/70">
                Regional engagement drives nominations, voting, partnerships, and storytelling across the continent.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {REGIONS.map((region) => (
                <Link
                  key={region}
                  to="/regions"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-white group-hover:text-primary">{region}</span>
                </Link>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-white/50">
              Regions drive nominations, public participation, partner engagement, school visibility, and NESA TV storytelling.
            </p>
          </div>
        </section>

        {/* 6. LIVE WINDOWS — TABS */}
        <section id="live" className="border-t border-white/5 bg-charcoal-light/20 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
                Live Windows
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                Upcoming Voting Windows, Shows & Milestones
              </h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
              <TabsList className="grid w-full grid-cols-3 bg-white/5">
                <TabsTrigger value="tv" className="data-[state=active]:bg-primary data-[state=active]:text-charcoal">
                  <Tv className="mr-2 h-4 w-4" /> TV Shows
                </TabsTrigger>
                <TabsTrigger value="voting" className="data-[state=active]:bg-primary data-[state=active]:text-charcoal">
                  <Vote className="mr-2 h-4 w-4" /> Voting
                </TabsTrigger>
                <TabsTrigger value="gala" className="data-[state=active]:bg-primary data-[state=active]:text-charcoal">
                  <Trophy className="mr-2 h-4 w-4" /> Gala & Impact
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tv" className="mt-6 space-y-3">
                {[
                  { title: "Platinum Recognition Show", date: "11 June 2026" },
                  { title: "Africa Education Icon Show", date: "25 June 2026" },
                  { title: "Gold Certificate Winners Show", date: "1 October 2026" },
                ].map((s) => (
                  <Card key={s.title} className="border-white/10 bg-white/5">
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-3">
                        <Tv className="h-5 w-5 text-primary" />
                        <span className="font-medium text-white">{s.title}</span>
                      </div>
                      <span className="text-sm text-primary">{s.date}</span>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="voting" className="mt-6 space-y-3">
                {[
                  { title: "Gold Certificate Voting", date: "13 July – 25 September 2026" },
                  { title: "Blue Garnet Voting", date: "2 – 22 October 2026" },
                ].map((s) => (
                  <Card key={s.title} className="border-white/10 bg-white/5">
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-3">
                        <Vote className="h-5 w-5 text-primary" />
                        <span className="font-medium text-white">{s.title}</span>
                      </div>
                      <span className="text-sm text-primary">{s.date}</span>
                    </CardContent>
                  </Card>
                ))}
                <p className="pt-2 text-center text-sm text-white/60">
                  <Coins className="mr-1 inline h-4 w-4 text-primary" />
                  Voting uses the AGC participation system.
                </p>
              </TabsContent>

              <TabsContent value="gala" className="mt-6 space-y-3">
                {[
                  { title: "Blue Garnet Awards Gala", date: "22 October 2026", icon: Trophy },
                  { title: "Rebuild My School Africa Launch", date: "23 October 2026 onward", icon: Heart },
                ].map((s) => {
                  const I = s.icon;
                  return (
                    <Card key={s.title} className="border-white/10 bg-white/5">
                      <CardContent className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                          <I className="h-5 w-5 text-primary" />
                          <span className="font-medium text-white">{s.title}</span>
                        </div>
                        <span className="text-sm text-primary">{s.date}</span>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* 7. NESA AFRICA TV */}
        <section id="media" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
                NESA Africa TV
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                Watch NESA Africa in Action
              </h2>
              <p className="text-white/70">
                Featured shows, judges, highlights, and interviews — aligned to every stage of the season.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_VIDEOS.map((v) => (
                <Card key={v.title} className="group cursor-pointer overflow-hidden border-white/10 bg-white/5 transition-all hover:border-primary/40">
                  <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-charcoal-light to-charcoal">
                    <Play className="h-12 w-12 text-primary/70 transition-transform group-hover:scale-110" />
                    <Badge className="absolute right-3 top-3 bg-primary/20 text-primary">{v.tag}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium text-white">{v.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Link to="/media/nesa-tv">
                  Open NESA TV <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 8. IMPACT PHASE */}
        <section id="impact" className="border-t border-white/5 bg-gradient-to-b from-charcoal-light/30 to-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <Badge variant="outline" className="mb-4 border-primary/40 text-primary">
                Season 2 · Impact Phase
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
                From Recognition to Real School Impact
              </h2>
              <p className="text-white/70">
                NESA Africa does not end at the gala. From October 2026 to October 2027, Rebuild My School Africa
                converts visibility into real intervention for special needs and underserved schools across African regions.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
              {IMPACT_PHASES.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Card key={p.title} className="border-white/10 bg-white/5">
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-display text-2xl font-bold text-primary/40">0{i + 1}</span>
                      </div>
                      <h3 className="font-display font-bold text-white">{p.title}</h3>
                      <p className="mt-1 text-xs text-primary">{p.period}</p>
                      <p className="mt-2 text-sm text-white/70">{p.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-primary text-charcoal hover:bg-primary/90">
                <Link to="/eduaid-africa/rebuild-my-school">
                  <School className="mr-2 h-4 w-4" /> Nominate a School
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/partners">
                  <Handshake className="mr-2 h-4 w-4" /> Partner for Rebuild
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/eduaid-africa/rebuild-my-school">
                  Explore Impact Stories
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.2),_transparent_60%)]" />
          <div className="container relative mx-auto px-4 text-center">
            <Badge className="mb-6 border-primary/40 bg-primary/10 text-primary">2026 Season</Badge>
            <h2 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
              Join the 2026 Journey
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
              Nominate. Vote. Partner. Watch. Be part of the continent's most important education recognition system.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="bg-primary text-charcoal hover:bg-primary/90">
                <Link to="/nominate">Nominate Now</Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Link to="/vote">Vote When Voting Opens</Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/partners">Become a Partner</Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/media/nesa-tv">
                  <Play className="mr-2 h-4 w-4" /> Watch NESA TV
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
