import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeason } from "@/contexts/SeasonContext";
import { Vision2035Section } from "@/components/nesa/Vision2035Section";
import { EventCountdown } from "@/components/ui/event-countdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, Trophy, Star, Users, Calendar, 
  ArrowRight, CheckCircle, Vote, Medal, Sparkles,
  Play, ExternalLink, Globe, Crown, Gem,
  BookOpen, Target, Building2, Heart, Radio,
  GraduationCap, School, Accessibility, Eye,
  Menu, Ticket, PlayCircle, ChevronRight, Clock, MapPin
} from "lucide-react";
import heroCeremony from "@/assets/hero-ceremony.jpg";
import heroVideo from "@/assets/nesa-hero-bg-video.mp4";

// Key Event Dates for Countdowns
const tvShowEvents = [
  {
    name: "Platinum Recognition Show",
    date: new Date("2026-02-28T18:00:00"),
    type: "show" as const,
  },
  {
    name: "Africa Icon Recognition Show",
    date: new Date("2026-03-28T18:00:00"),
    type: "show" as const,
  },
  {
    name: "Gold Certificate Winners Show",
    date: new Date("2026-05-17T18:00:00"),
    type: "show" as const,
  },
];

const votingEvents = [
  {
    name: "Gold Public Voting Opens",
    date: new Date("2026-04-10T00:00:00"),
    type: "voting" as const,
  },
  {
    name: "Blue Garnet Voting Opens",
    date: new Date("2026-05-18T00:00:00"),
    type: "voting" as const,
  },
];

const galaEvents = [
  {
    name: "Blue Garnet Awards Gala",
    date: new Date("2026-06-27T18:00:00"),
    type: "gala" as const,
  },
  {
    name: "Rebuild My School Africa Launch",
    date: new Date("2026-06-28T09:00:00"),
    type: "legacy" as const,
  },
];

const programmePillars = [
  {
    title: "Public Education & Awareness",
    platform: "EduAid-Africa Webinar Series",
    icon: Radio,
    desc: "Stakeholder education on challenges, standards, and informed participation",
  },
  {
    title: "Recognition & Standards",
    platform: "NESA-Africa Awards Cycle",
    icon: Award,
    desc: "Standards-based continental education recognition and accountability",
  },
  {
    title: "Legacy Impact",
    platform: "Rebuild My School Africa",
    icon: School,
    desc: "Post-award infrastructure projects for inclusive education",
  },
];

const programmeTimeline = [
  { phase: "EduAid-Africa Webinars", date: "14 Oct 2025 – Jun 2026", desc: "Public education series on SDG 4, CSR, STEM, inclusion, and NESA standards", type: "awareness", active: true },
  { phase: "Platinum Recognition Show", date: "28 February 2026", desc: "3-hour TV Show — Non-competitive baseline recognition of service", type: "recognition", active: false },
  { phase: "Africa Education Icon Show", date: "28 March 2026", desc: "3-hour TV Show — Lifetime impact recognition (9 Icons, 2005–2025)", type: "recognition", active: false },
  { phase: "Icon Nominations Close", date: "30 April 2026", desc: "Final deadline for Africa Education Icon nominations", type: "deadline", active: false },
  { phase: "Gold Public Voting", date: "10 Apr – 16 May 2026", desc: "Mass participation voting across 135 sub-categories", type: "voting", active: false },
  { phase: "Gold Certificate Winners Show", date: "17 May 2026", desc: "3-hour TV Show — 135 Gold winners announced", type: "recognition", active: false },
  { phase: "Blue Garnet Voting", date: "18 May – 17 Jun 2026", desc: "40% public vote + 60% independent jury review", type: "voting", active: false },
  { phase: "Blue Garnet Awards Gala", date: "27 June 2026", desc: "Grand ceremony in Lagos + live broadcast — 9 Blue Garnet winners", type: "gala", active: false },
  { phase: "Rebuild My School Africa", date: "Jun 2026 – Jun 2027", desc: "Legacy phase: 5 Special Needs facilities across Africa's regions", type: "legacy", active: false },
];

const awardPhases = [
  {
    title: "Platinum Certificate",
    subtitle: "Baseline Recognition of Service",
    period: "February – June 2026",
    showDate: "28 February 2026",
    icon: Medal,
    features: ["Non-competitive entry layer", "Verification by NESA Nominee Research Corps (NRC)", "Governance & safeguarding checks", "Certificate validity: 1 year", "Global QR-code authentication"],
    color: "#E5E4E2",
  },
  {
    title: "Africa Education Icon",
    subtitle: "Lifetime Impact Recognition",
    period: "March – April 2026",
    showDate: "28 March 2026",
    icon: Crown,
    features: ["Honours 9 Icons only", "Documented impact 2005–2025", "African regions + diaspora + Friends of Africa", "Non-competitive lifetime recognition", "Independent verification"],
    color: "#C4A052",
  },
  {
    title: "Gold Certificate",
    subtitle: "Competitive Classification Stage",
    period: "10 April – 16 May 2026",
    showDate: "17 May 2026",
    icon: Trophy,
    features: ["9 Award Categories", "135 Sub-Categories", "1 Gold Winner per Sub-Category", "Public voting only — no judges", "Transparent digital audit trail"],
    color: "#FFD700",
  },
  {
    title: "Blue Garnet Award",
    subtitle: "Highest Competitive Honour",
    period: "18 May – 17 June 2026",
    showDate: "27 June 2026 (Gala)",
    icon: Gem,
    features: ["From 135 Gold Certificate winners", "9 Blue Garnet Award winners", "40% Public Voting + 60% Jury Review", "Elite continental honour", "Blue Garnet stone in certificate & plaque"],
    color: "#1E3A5F",
  },
];

const webinarThemes = [
  { theme: "Education for All & SDG 4", icon: GraduationCap },
  { theme: "CSR & Private Sector Education Impact", icon: Building2 },
  { theme: "NGOs & Community-Driven Education", icon: Heart },
  { theme: "STEM & Innovation", icon: Target },
  { theme: "Creative Arts & Education", icon: Sparkles },
  { theme: "Inclusion, Disability & Special Needs", icon: Accessibility },
];

const legacyRegions = ["North Africa", "West Africa", "East Africa", "Central Africa", "Southern Africa"];

const nominationPaths = [
  {
    title: "Lifetime Achievement",
    badge: "Africa Icon Blue Garnet Award",
    period: "2005–2025",
    desc: "Reserved for lifetime achievement. Nominees must have 10+ years institutional achievements.",
    features: ["Institutional Achievements", "Long-term Impact", "Legacy Recognition"],
    link: "/nominate?type=icon",
    icon: Crown,
  },
  {
    title: "Public Voting",
    badge: "Blue Garnet & Gold Certificate Awards",
    period: "Annual Competition",
    desc: "Open competition with public participation through AGC voting and expert judging.",
    features: ["Public Voting", "Expert Judging", "135 Subcategories"],
    link: "/nominate?type=competitive",
    icon: Vote,
  },
  {
    title: "Expert Selection",
    badge: "Platinum Certificate of Recognition",
    period: "Merit-Based",
    desc: "Merit-based recognition through expert panel evaluation and institutional review.",
    features: ["No Voting", "Internal Judging", "Global Nomination"],
    link: "/nominate?type=platinum",
    icon: Gem,
  },
];

const quickActions = [
  { label: "Refer", icon: Users, href: "/refer" },
  { label: "Nominate", icon: Award, href: "/nominate" },
  { label: "Vision 2035", icon: Eye, href: "#vision" },
  { label: "Tickets", icon: Ticket, href: "/tickets" },
  { label: "Watch", icon: PlayCircle, href: "/media" },
];

export default function NESAAfrica() {
  const { currentEdition, getBannerText } = useSeason();
  const bannerText = getBannerText();

  return (
    <>
      <Helmet>
        <title>NESA-Africa 2025 | Honoring Africa's Changemakers</title>
        <meta 
          name="description" 
          content="NESA-Africa 2025 - Building the Future of Education. Join us in celebrating educational excellence across Africa."
        />
        <meta property="og:title" content="NESA-Africa 2025 | Honoring Africa's Changemakers" />
        <meta property="og:description" content="Pan-African celebration of educational transformation, social impact, and legacy." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 z-50 w-full bg-secondary/90 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-10 w-16 items-center justify-center rounded bg-primary px-2">
                  <span className="font-display text-[10px] font-bold leading-tight text-secondary">
                    SCEF
                  </span>
                </div>
              </Link>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <Link to="/categories" className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Categories</Link>
              <Link to="/nominees" className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Nominees</Link>
              <Link to="/vote" className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">Vote</Link>
              <Link to="/media" className="text-sm font-medium text-secondary-foreground/70 transition-colors hover:text-secondary-foreground">NESA TV</Link>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-secondary-foreground">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">English</span>
              </button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="hidden text-secondary-foreground md:inline-flex" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button className="hidden bg-primary text-primary-foreground md:inline-flex" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section with Video Background */}
        <section className="relative min-h-screen overflow-hidden pt-16">
          {/* Video Background */}
          <div className="absolute inset-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              poster={heroCeremony}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/95" />
          </div>

          {/* Animated Spotlights */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-0 h-96 w-20 rotate-[25deg] bg-gradient-to-b from-primary/20 to-transparent blur-3xl animate-spotlight-left" />
            <div className="absolute -right-20 top-0 h-96 w-20 rotate-[-25deg] bg-gradient-to-b from-primary/20 to-transparent blur-3xl animate-spotlight-right" />
          </div>

          {/* Floating Particles */}
          <div className="pointer-events-none absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary/60 animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
            {/* Announcement Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-secondary/60 px-5 py-2.5 backdrop-blur-sm animate-fade-in">
              <Award className="h-4 w-4 text-primary animate-pulse-glow" />
              <span className="text-sm font-medium text-secondary-foreground">
                {bannerText}
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="mb-4 max-w-5xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <span className="font-display text-4xl font-bold text-secondary-foreground md:text-6xl lg:text-7xl">
                Honoring Africa's{" "}
              </span>
              <span className="font-cursive text-5xl text-primary md:text-7xl lg:text-8xl">
                Changemakers
              </span>
            </h1>

            {/* Theme */}
            <p className="mb-6 font-display text-xl text-secondary-foreground/90 md:text-2xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Building the Future of Education
            </p>

            {/* Description */}
            <p className="mb-8 max-w-3xl text-base text-secondary-foreground/70 md:text-lg animate-fade-in" style={{ animationDelay: "0.4s" }}>
              At the NESA-Africa 2025, we celebrate 
              the real changemakers shaping the future of education across Africa. A pan-African 
              celebration of educational transformation, social impact, and legacy.
            </p>

            {/* Ceremony Countdown */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <EventCountdown 
                targetDate={galaEvents[0].date} 
                title="Blue Garnet Awards Gala"
                subtitle="Lagos, Nigeria • Eko Convention Centre"
                variant="hero"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
                asChild
              >
                <Link to="/about">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Highlights
                </Link>
              </Button>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-gold animate-glow"
                asChild
              >
                <Link to="/nominate">
                  <Award className="mr-2 h-4 w-4" />
                  Nominate Now
                </Link>
              </Button>
            </div>

            {/* Decorative Star */}
            <div className="absolute right-10 top-1/3 hidden lg:block">
              <Sparkles className="h-16 w-16 text-primary opacity-60 animate-float-slow" />
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="container px-6">
              <div className="flex items-center justify-center gap-2 border-t border-secondary-foreground/10 bg-secondary/80 py-4 backdrop-blur-sm md:gap-8">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="group flex flex-col items-center gap-1.5 px-4 py-2 text-secondary-foreground/70 transition-colors hover:text-primary"
                  >
                    <action.icon className="h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6" />
                    <span className="text-xs font-medium md:text-sm">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Programme Pillars Section */}
        <section className="py-20 bg-background">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">SCEF Programme</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Three Strategic Pillars
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Our comprehensive approach to transforming education across Africa
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {programmePillars.map((pillar, index) => (
                <Card key={pillar.title} className="group relative overflow-hidden border-border/50 transition-all hover:border-primary hover:shadow-lg">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
                  <CardHeader>
                    <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                      <pillar.icon className="h-7 w-7 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">{pillar.platform}</Badge>
                    </div>
                    <CardTitle className="font-display text-xl">{pillar.title}</CardTitle>
                    <CardDescription className="text-base">{pillar.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Key Events Countdown Section */}
        <section className="py-20 bg-secondary">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">Upcoming Events</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
                Key Dates & Countdowns
              </h2>
              <p className="mx-auto max-w-2xl text-secondary-foreground/70">
                Mark your calendar for these milestone moments
              </p>
            </div>

            {/* TV Shows */}
            <div className="mb-12">
              <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-secondary-foreground">
                <PlayCircle className="h-5 w-5 text-primary" />
                TV Recognition Shows
              </h3>
              <div className="grid gap-6 md:grid-cols-3">
                {tvShowEvents.map((event) => (
                  <Card key={event.name} className="border-0 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Badge className="mb-4 bg-primary text-primary-foreground">{event.type.toUpperCase()}</Badge>
                      <h4 className="mb-4 font-display text-lg font-semibold">{event.name}</h4>
                      <EventCountdown targetDate={event.date} variant="compact" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        {event.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Voting & Gala */}
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-secondary-foreground">
                  <Vote className="h-5 w-5 text-primary" />
                  Voting Opens
                </h3>
                <div className="space-y-4">
                  {votingEvents.map((event) => (
                    <Card key={event.name} className="border-0 bg-card/50 backdrop-blur-sm">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-semibold">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <EventCountdown targetDate={event.date} variant="compact" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-secondary-foreground">
                  <Trophy className="h-5 w-5 text-primary" />
                  Gala & Legacy
                </h3>
                <div className="space-y-4">
                  {galaEvents.map((event) => (
                    <Card key={event.name} className="border-0 bg-card/50 backdrop-blur-sm">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <Badge variant="outline" className="mb-1 text-xs capitalize">{event.type}</Badge>
                          <h4 className="font-semibold">{event.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {event.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <EventCountdown targetDate={event.date} variant="compact" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programme Timeline */}
        <section className="py-20 bg-muted/30">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">2025-2026 Cycle</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Programme Timeline
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Complete journey from awareness to legacy impact
              </p>
            </div>

            <div className="relative mx-auto max-w-4xl">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 h-full w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
              
              {programmeTimeline.map((item, index) => (
                <div key={item.phase} className={`relative mb-8 flex items-start gap-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                    <Card className={`transition-all ${item.active ? "border-primary bg-primary/5" : "border-border/50"}`}>
                      <CardContent className="p-4">
                        <div className={`mb-2 flex items-center gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                          <Badge variant={item.active ? "default" : "outline"} className="text-xs capitalize">
                            {item.type}
                          </Badge>
                          {item.active && (
                            <Badge className="bg-success text-success-foreground text-xs">ACTIVE</Badge>
                          )}
                        </div>
                        <h4 className="font-display font-semibold">{item.phase}</h4>
                        <p className="text-sm text-primary font-medium">{item.date}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background md:left-1/2 md:-translate-x-1/2">
                    <div className={`h-3 w-3 rounded-full ${item.active ? "bg-primary animate-pulse" : "bg-muted"}`} />
                  </div>
                  
                  <div className="hidden flex-1 md:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Award Phases */}
        <section className="py-20 bg-secondary">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">Recognition Tiers</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
                Award Phases & Tiers
              </h2>
              <p className="mx-auto max-w-2xl text-secondary-foreground/70">
                Four distinct recognition pathways celebrating different forms of excellence
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {awardPhases.map((phase) => (
                <Card key={phase.title} className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
                  <div 
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: phase.color }}
                  />
                  <CardHeader className="text-center pb-2">
                    <div 
                      className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${phase.color}20` }}
                    >
                      <phase.icon className="h-8 w-8" style={{ color: phase.color }} />
                    </div>
                    <CardTitle className="font-display text-lg">{phase.title}</CardTitle>
                    <CardDescription className="text-sm">{phase.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-4 text-center">
                      <Badge variant="outline" className="mb-1 text-xs">{phase.period}</Badge>
                      <p className="text-xs text-muted-foreground">{phase.showDate}</p>
                    </div>
                    <ul className="space-y-2">
                      {phase.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* EduAid-Africa Webinar Themes */}
        <section className="py-20 bg-background">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">EduAid-Africa</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Webinar Series Themes
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Public education series running October 2025 – June 2026
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {webinarThemes.map((item) => (
                <Card key={item.theme} className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                      <item.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <p className="font-medium">{item.theme}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Nomination Paths */}
        <section className="py-20 bg-muted/30">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">How to Participate</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Nomination Pathways
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Three distinct paths to recognition based on achievement type
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {nominationPaths.map((path) => (
                <Card key={path.title} className="group relative overflow-hidden transition-all hover:border-primary hover:shadow-lg">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                      <path.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <Badge variant="secondary" className="mb-2 w-fit text-xs">{path.badge}</Badge>
                    <CardTitle className="font-display">{path.title}</CardTitle>
                    <p className="text-sm font-medium text-primary">{path.period}</p>
                    <CardDescription className="mt-2">{path.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="mb-4 space-y-2">
                      {path.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" asChild>
                      <Link to={path.link}>
                        Nominate Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Legacy: Rebuild My School Africa */}
        <section className="py-20 bg-secondary">
          <div className="container px-6">
            <div className="mx-auto max-w-4xl">
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 md:p-12">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <Badge className="mb-4 bg-primary text-primary-foreground">
                        Legacy Initiative
                      </Badge>
                      <h2 className="mb-4 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
                        Rebuild My School Africa
                      </h2>
                      <p className="mb-6 text-secondary-foreground/70">
                        Post-award legacy project delivering 5 Special Needs educational facilities 
                        across Africa's regions, ensuring inclusive education for all.
                      </p>
                      <div className="mb-6">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Target Regions</p>
                        <div className="flex flex-wrap gap-2">
                          {legacyRegions.map((region) => (
                            <Badge key={region} variant="outline" className="border-primary/30 text-secondary-foreground">
                              {region}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-secondary-foreground/70">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>June 2026 – June 2027</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <School className="mb-4 h-20 w-20 text-primary opacity-60" />
                      <EventCountdown 
                        targetDate={galaEvents[1].date}
                        title="Launch Date"
                        variant="default"
                        showLabels
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vision 2035 Section */}
        <Vision2035Section variant="full" />

        {/* Grand Ceremony Info */}
        <section className="py-20 bg-background">
          <div className="container px-6">
            <div className="mx-auto max-w-4xl">
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-8 md:p-12">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <Badge className="mb-4 bg-primary text-primary-foreground">
                        Save The Date
                      </Badge>
                      <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                        Blue Garnet Awards Gala
                      </h2>
                      <p className="mb-6 text-muted-foreground">
                        Join us for a spectacular evening celebrating the best in African education. 
                        Network with leaders, innovators, and changemakers from across the continent.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Saturday, June 27, 2026</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="h-5 w-5 text-primary" />
                          <span>6:00 PM WAT</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>Eko Convention Centre, Lagos, Nigeria</span>
                        </div>
                      </div>
                      <div className="mt-6 flex gap-4">
                        <Button asChild>
                          <Link to="/tickets">Get Tickets</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/sponsor">Become a Sponsor</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <EventCountdown 
                        targetDate={galaEvents[0].date}
                        variant="default"
                        showLabels
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary">
          <div className="container px-6 text-center">
            <Sparkles className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="mb-4 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
              Be Part of the Movement
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-secondary-foreground/70">
              Nominate a changemaker, vote for your favorites, or attend the grand ceremony. 
              Join thousands across Africa in celebrating educational excellence.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground font-semibold" asChild>
                <Link to="/register">
                  Create Account
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground" asChild>
                <Link to="/nominate">Submit Nomination</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/10 bg-secondary py-12">
          <div className="container px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-16 items-center justify-center rounded bg-primary px-2">
                    <span className="font-display text-[10px] font-bold text-secondary">SCEF</span>
                  </div>
                </div>
                <p className="text-sm text-secondary-foreground/60">
                  Santos Creations Education Foundation
                </p>
                <p className="mt-2 text-sm text-secondary-foreground/60">
                  Transforming education across Africa through recognition and celebration of excellence.
                </p>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-secondary-foreground">Quick Links</h4>
                <ul className="space-y-2 text-sm text-secondary-foreground/60">
                  <li><Link to="/about" className="hover:text-primary">About NESA</Link></li>
                  <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
                  <li><Link to="/nominees" className="hover:text-primary">Nominees</Link></li>
                  <li><Link to="/vote" className="hover:text-primary">Vote</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-secondary-foreground">Resources</h4>
                <ul className="space-y-2 text-sm text-secondary-foreground/60">
                  <li><Link to="/media" className="hover:text-primary">NESA TV</Link></li>
                  <li><Link to="/certificates" className="hover:text-primary">Verify Certificate</Link></li>
                  <li><Link to="/chapters" className="hover:text-primary">Chapters</Link></li>
                  <li><Link to="/sponsor" className="hover:text-primary">Sponsorship</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-secondary-foreground">Contact</h4>
                <ul className="space-y-2 text-sm text-secondary-foreground/60">
                  <li>info@nesa-africa.org</li>
                  <li>+234 800 NESA AFRICA</li>
                  <li>Lagos, Nigeria</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-border/10 pt-8 text-center">
              <p className="text-sm text-secondary-foreground/50">
                © 2025 NESA-Africa. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
