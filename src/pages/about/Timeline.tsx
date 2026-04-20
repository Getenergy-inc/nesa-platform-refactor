import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PROGRAMME_TIMELINE_2026 } from "@/config/agcConfig";
import iconLifetimeImg from "@/assets/cards/icon-lifetime.jpg";
import platinumImg from "@/assets/cards/platinum-recognition.jpg";
import goldVotingImg from "@/assets/cards/gold-public-voting.jpg";
import blueGarnetImg from "@/assets/cards/blue-garnet-gala.jpg";
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
  Tv,
  Heart,
  Coins,
  Sparkles,
  Play,
  ArrowRight,
  ChevronRight,
  Handshake,
  Target,
  Megaphone,
  School,
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




const CATEGORY_PATHWAYS = [
  {
    icon: Crown,
    title: "Africa Education Icon",
    subtitle: "Lifetime Achievement",
    tagline: "The continent's highest education honour.",
    selection: "Jury selection only",
    scope: "2006–2026",
    description:
      "A continental honour recognising transformational leaders who have shaped education across Africa over the past two decades.",
    placement: "Nominations close 20 June · Show 25 June 2026",
    journey: ["Nomination", "10-Year Profile", "Jury Review", "Live Show"],
    highlights: ["3 Residents", "3 Diaspora", "3 Friends of Africa"],
    subcategories: [
      "Africa Education Philanthropy Icon of the Decade",
      "Literary & New Curriculum Advocate Icon of the Decade",
      "Africa Technical Educator Icon of the Decade",
    ],
    primaryCta: { label: "Nominate an Icon", to: "/nominate?tier=icon" },
    secondaryCta: { label: "Icon Criteria", to: "/categories/africa-education-icon" },
    accent: "from-amber-500/20 to-yellow-600/10 border-amber-500/40",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    iconColor: "text-amber-300",
    ringColor: "ring-amber-500/30",
    image: iconLifetimeImg,
    imageOverlay: "from-amber-900/80 via-charcoal/60 to-charcoal",
  },
  {
    icon: Star,
    title: "Platinum",
    subtitle: "Institutional Leadership",
    tagline: "Recognising the systems behind the impact.",
    selection: "NRC verification + governance criteria",
    scope: "Institutions · Diaspora · Partnerships",
    description:
      "Recognises institutional leadership, diaspora impact, political leadership, and international partnerships that strengthen education systems.",
    placement: "Platinum Recognition Show · 11 June 2026",
    journey: ["Nomination", "NRC Verification", "Governance Review", "Recognition Show"],
    highlights: ["Non-competitive", "NRC verified", "Baseline Recognition"],
    subcategories: [
      "Institutional Leadership in Education",
      "Diaspora Impact in Education",
      "Political Leadership for Education",
      "International Partnerships",
    ],
    primaryCta: { label: "Submit Platinum Nomination", to: "/nominate?tier=platinum" },
    secondaryCta: { label: "Platinum Criteria", to: "/categories/platinum" },
    accent: "from-slate-400/20 to-slate-500/10 border-slate-400/40",
    badgeClass: "bg-slate-400/20 text-slate-200 border-slate-400/40",
    iconColor: "text-slate-200",
    ringColor: "ring-slate-400/30",
    image: platinumImg,
    imageOverlay: "from-slate-900/80 via-charcoal/60 to-charcoal",
  },
  {
    icon: Sparkles,
    title: "Gold Special Recognition",
    subtitle: "2026 Edition",
    tagline: "Where culture meets education.",
    selection: "Public participation / visibility-led",
    scope: "Sports · Music · Social Influence",
    description:
      "Celebrates cultural and public figures advancing education through sports, music, and social media influence.",
    placement: "Voting 13 Jul – 25 Sep · Winners Show 1 Oct 2026",
    journey: ["Nomination", "Public Voting", "AGC Tally", "Winners Show"],
    highlights: ["100% Public Vote", "AGC Powered", "Mass Participation"],
    subcategories: [
      "Sports for Education",
      "Music for Education",
      "Social Media Advocacy for Education",
    ],
    primaryCta: { label: "Nominate for Gold", to: "/nominate?tier=gold" },
    secondaryCta: { label: "How Voting Works", to: "/vote/how-it-works" },
    accent: "from-yellow-500/20 to-amber-500/10 border-yellow-500/40",
    badgeClass: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    iconColor: "text-yellow-300",
    ringColor: "ring-yellow-500/30",
    image: goldVotingImg,
    imageOverlay: "from-yellow-900/80 via-charcoal/60 to-charcoal",
  },
  {
    icon: Gem,
    title: "Blue Garnet",
    subtitle: "Competitive Excellence",
    tagline: "The final prestige stage of the season.",
    selection: "Public voting + jury evaluation",
    scope: "Final Prestige Stage",
    description:
      "Represents the final prestige stage of the season across the leading competitive categories.",
    placement: "Voting 2 – 22 Oct · Gala 22 Oct 2026",
    journey: ["Nomination", "Jury Scoring (60%)", "Public Vote (40%)", "Gala Reveal"],
    highlights: ["40% Public", "60% Jury", "Live Gala Reveal"],
    subcategories: [
      "Best Education-Focused NGO",
      "Best CSR for Education",
      "Education Innovation of the Year",
      "Outstanding African Educator",
    ],
    primaryCta: { label: "Nominate for Blue Garnet", to: "/nominate?tier=blue-garnet" },
    secondaryCta: { label: "Vote with AGC", to: "/vote" },
    accent: "from-blue-500/20 to-indigo-600/10 border-blue-500/40",
    badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    iconColor: "text-blue-300",
    ringColor: "ring-blue-500/30",
    image: blueGarnetImg,
    imageOverlay: "from-blue-900/80 via-charcoal/60 to-charcoal",
  },
];

const REGION_DATA = [
  { name: "North Africa", code: "NA", countries: "Egypt · Morocco · Tunisia · Algeria · Libya", slug: "north-africa", emoji: "🌍" },
  { name: "West Africa", code: "WA", countries: "Nigeria · Ghana · Senegal · Côte d'Ivoire", slug: "west-africa", emoji: "🌍" },
  { name: "Central Africa", code: "CA", countries: "Cameroon · DRC · Gabon · Chad", slug: "central-africa", emoji: "🌍" },
  { name: "East Africa", code: "EA", countries: "Kenya · Tanzania · Uganda · Rwanda", slug: "east-africa", emoji: "🌍" },
  { name: "Southern Africa", code: "SA", countries: "South Africa · Zambia · Zimbabwe · Botswana", slug: "southern-africa", emoji: "🌍" },
  { name: "Sahel Region", code: "SH", countries: "Mali · Burkina Faso · Niger · Mauritania", slug: "sahel", emoji: "🌍" },
  { name: "Horn of Africa", code: "HA", countries: "Ethiopia · Somalia · Djibouti · Eritrea", slug: "horn-of-africa", emoji: "🌍" },
  { name: "Indian Ocean", code: "IO", countries: "Madagascar · Mauritius · Seychelles · Comoros", slug: "indian-ocean", emoji: "🌊" },
  { name: "Diaspora / Global Africa", code: "DG", countries: "Africans in UK · USA · Europe · Asia", slug: "diaspora", emoji: "🌐" },
  { name: "Friends of Africa", code: "FA", countries: "Global allies advancing African education", slug: "friends-of-africa", emoji: "🤝" },
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

            {/* Tier comparison strip */}
            <div className="mx-auto mb-10 grid max-w-5xl grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 md:grid-cols-4">
              {CATEGORY_PATHWAYS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <a
                    key={cat.title}
                    href={`#tier-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:bg-white/5"
                  >
                    <Icon className={`h-4 w-4 ${cat.iconColor}`} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{cat.title}</p>
                      <p className="truncate text-[10px] text-white/50">{cat.subtitle}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {CATEGORY_PATHWAYS.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Card
                    key={cat.title}
                    id={`tier-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`group relative flex flex-col overflow-hidden border bg-gradient-to-br ${cat.accent} transition-all hover:scale-[1.01] hover:shadow-2xl`}
                  >
                    {/* Decorative corner glow */}
                    <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${cat.accent} opacity-40 blur-2xl`} />

                    <CardHeader className="relative">
                      <div className="mb-3 flex items-center justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ${cat.ringColor}`}>
                          <Icon className={`h-7 w-7 ${cat.iconColor}`} />
                        </div>
                        <Badge className={cat.badgeClass}>{cat.subtitle}</Badge>
                      </div>
                      <CardTitle className="font-display text-2xl text-white">{cat.title}</CardTitle>
                      <p className={`text-sm italic ${cat.iconColor}`}>{cat.tagline}</p>
                    </CardHeader>

                    <CardContent className="relative flex flex-1 flex-col space-y-5">
                      <p className="text-sm leading-relaxed text-white/80">{cat.description}</p>

                      {/* Highlight chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {cat.highlights.map((h) => (
                          <span
                            key={h}
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cat.badgeClass}`}
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Journey strip */}
                      <div className="rounded-xl border border-white/10 bg-charcoal/40 p-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                          Pathway Journey
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {cat.journey.map((step, i) => (
                            <div key={step} className="flex items-center gap-1.5">
                              <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/80">
                                {step}
                              </span>
                              {i < cat.journey.length - 1 && (
                                <ChevronRight className="h-3 w-3 text-white/30" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Subcategories preview */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                          Subcategories
                        </p>
                        <ul className="space-y-1">
                          {cat.subcategories.map((sub) => (
                            <li key={sub} className="flex items-start gap-2 text-xs text-white/70">
                              <CheckCircle className={`mt-0.5 h-3 w-3 shrink-0 ${cat.iconColor}`} />
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Meta */}
                      <div className="space-y-2 border-t border-white/10 pt-3 text-xs">
                        <div className="flex gap-2">
                          <span className="text-white/50">Selection:</span>
                          <span className="text-white/90">{cat.selection}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white/50">Scope:</span>
                          <span className="text-white/90">{cat.scope}</span>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{cat.placement}</span>
                        </div>
                      </div>

                      {/* CTAs */}
                      <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row">
                        <Button asChild size="sm" className="flex-1 bg-primary text-charcoal hover:bg-primary/90">
                          <Link to={cat.primaryCta.to}>
                            {cat.primaryCta.label} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                          <Link to={cat.secondaryCta.to}>{cat.secondaryCta.label}</Link>
                        </Button>
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

            {/* Stats strip */}
            <div className="mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: "Regions", value: "10" },
                { label: "African Countries", value: "54" },
                { label: "Diaspora Hubs", value: "5+" },
                { label: "Friends of Africa", value: "Global" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="font-display text-2xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {REGION_DATA.map((region) => (
                <Link
                  key={region.name}
                  to={`/region/${region.slug}`}
                  className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:from-primary/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                      <span className="font-display text-sm font-bold text-primary">{region.code}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/30 transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-white group-hover:text-primary">
                      {region.name}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-white/50">{region.countries}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Regional engagement breakdown */}
            <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-charcoal-light/30 p-6">
              <p className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-primary">
                Each Region Drives
              </p>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {[
                  { icon: FileCheck, label: "Nominations" },
                  { icon: Vote, label: "Public Voting" },
                  { icon: Handshake, label: "Partnerships" },
                  { icon: School, label: "School Visibility" },
                  { icon: Tv, label: "TV Storytelling" },
                ].map((item) => {
                  const I = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <I className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs text-white/80">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button asChild variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
                <Link to="/regions">
                  Explore All Regions <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
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
