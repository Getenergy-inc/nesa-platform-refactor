import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSeason } from "@/contexts/SeasonContext";
import { 
  CURRENT_SEASON, 
  PHASES, 
  AWARD_CATEGORIES, 
  TIER_INFO, 
  NOMINATION_PATHS,
  getActivePhase,
  getTimeUntilCeremony,
} from "@/config/nesaSeasonConfig";
import { StageBanner, PhaseTimeline } from "@/components/nesa/StageBanner";
import { Vision2035Section } from "@/components/nesa/Vision2035Section";
import { EventCountdown } from "@/components/ui/event-countdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Play, 
  Menu, 
  Globe, 
  Users, 
  Eye, 
  Ticket, 
  PlayCircle, 
  ChevronRight,
  Star,
  Calendar,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  Cpu,
  Heart,
  Building,
  User,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import heroCeremony from "@/assets/hero-ceremony.jpg";
import heroVideo from "@/assets/nesa-hero-bg-video.mp4";

// Icon mapping for dynamic rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Cpu,
  Heart,
  Building,
  Award,
  Star,
  Globe,
  Users,
  User,
};

export default function NESAAfrica() {
  const { currentEdition, getBannerText, isStageOpen } = useSeason();
  const activePhase = getActivePhase();
  const ceremonyCountdown = getTimeUntilCeremony();
  const bannerText = getBannerText();

  const quickActions = [
    { label: "Refer", icon: Users, href: "/refer" },
    { label: "Nominate", icon: Award, href: "/nominate" },
    { label: "Vision 2035", icon: Eye, href: "#vision" },
    { label: "Tickets", icon: Ticket, href: "/tickets" },
    { label: "Watch", icon: PlayCircle, href: "/media" },
  ];

  return (
    <>
      <Helmet>
        <title>{CURRENT_SEASON.name} | Honoring Africa's Changemakers</title>
        <meta 
          name="description" 
          content={`${CURRENT_SEASON.name} - ${CURRENT_SEASON.theme}. Join us in celebrating educational excellence across Africa.`}
        />
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
            {[...Array(20)].map((_, i) => (
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
                {CURRENT_SEASON.tagline.split(" ").slice(0, -1).join(" ")}{" "}
              </span>
              <span className="font-cursive text-5xl text-primary md:text-7xl lg:text-8xl">
                {CURRENT_SEASON.tagline.split(" ").slice(-1)[0]}
              </span>
            </h1>

            {/* Theme */}
            <p className="mb-6 font-display text-xl text-secondary-foreground/90 md:text-2xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {CURRENT_SEASON.theme}
            </p>

            {/* Description */}
            <p className="mb-8 max-w-3xl text-base text-secondary-foreground/70 md:text-lg animate-fade-in" style={{ animationDelay: "0.4s" }}>
              At the {CURRENT_SEASON.name}, we celebrate 
              the real changemakers shaping the future of education across Africa. A pan-African 
              celebration of educational transformation, social impact, and legacy.
            </p>

            {/* Ceremony Countdown */}
            <div className="mb-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <EventCountdown 
                targetDate={CURRENT_SEASON.ceremonyDate} 
                title="Ceremony Countdown"
                subtitle={`${CURRENT_SEASON.ceremonyLocation} • ${CURRENT_SEASON.ceremonyVenue}`}
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
                  {activePhase.ctaText}
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

        {/* Stage Banner */}
        <section className="py-8 bg-background">
          <div className="container px-6">
            <StageBanner variant="full" />
          </div>
        </section>

        {/* Phase Timeline */}
        <section className="py-12 bg-muted/30">
          <div className="container px-6">
            <div className="mb-8 text-center">
              <h2 className="mb-2 font-display text-2xl font-bold">Award Journey</h2>
              <p className="text-muted-foreground">Follow the path to the ceremony</p>
            </div>
            <PhaseTimeline />
          </div>
        </section>

        {/* Nomination Paths */}
        <section className="py-20 bg-background">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">How to Participate</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Nomination Pathways
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Multiple ways to recognize excellence in African education
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {NOMINATION_PATHS.map((path, index) => {
                const Icon = iconMap[path.icon] || Users;
                return (
                  <Card key={path.id} className="group relative overflow-hidden border-border/50 transition-all hover:border-primary hover:shadow-lg">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10" />
                    <CardHeader>
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                        <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                      </div>
                      <CardTitle className="font-display">{path.name}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Process</p>
                        <ol className="space-y-1">
                          {path.process.slice(0, 4).map((step, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {path.tier} Tier
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link to="/nominate">
                  Start Nomination <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Award Tiers */}
        <section className="py-20 bg-secondary">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">Award Structure</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
                Award Tiers
              </h2>
              <p className="mx-auto max-w-2xl text-secondary-foreground/70">
                Four tiers of recognition celebrating different levels of excellence
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {(Object.entries(TIER_INFO) as [string, typeof TIER_INFO[keyof typeof TIER_INFO]][]).map(([key, tier]) => (
                <Card key={key} className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
                  <div 
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ backgroundColor: tier.color }}
                  />
                  <CardHeader className="text-center">
                    <div 
                      className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${tier.color}20` }}
                    >
                      <Award className="h-8 w-8" style={{ color: tier.color }} />
                    </div>
                    <CardTitle className="font-display">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <Badge variant="outline">{tier.votingMethod}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Award Categories */}
        <section className="py-20 bg-background">
          <div className="container px-6">
            <div className="mb-12 text-center">
              <Badge className="mb-4 bg-primary/10 text-primary">Categories</Badge>
              <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
                Award Categories
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Recognizing excellence across diverse fields of education
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {AWARD_CATEGORIES.map((category) => {
                const Icon = iconMap[category.icon] || Award;
                const tierInfo = TIER_INFO[category.tier];
                
                return (
                  <Card key={category.id} className="group cursor-pointer transition-all hover:border-primary hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ borderColor: tierInfo.color, color: tierInfo.color }}
                        >
                          {tierInfo.name}
                        </Badge>
                      </div>
                      <CardTitle className="font-display">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {category.subcategories.length} subcategories
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" asChild>
                <Link to="/categories">
                  View All Categories <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Vision 2035 Section */}
        <Vision2035Section variant="full" />

        {/* Ceremony Info */}
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
                        Grand Award Ceremony
                      </h2>
                      <p className="mb-6 text-muted-foreground">
                        Join us for a spectacular evening celebrating the best in African education. 
                        Network with leaders, innovators, and changemakers from across the continent.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>
                            {CURRENT_SEASON.ceremonyDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="h-5 w-5 text-primary" />
                          <span>6:00 PM WAT</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>{CURRENT_SEASON.ceremonyVenue}, {CURRENT_SEASON.ceremonyLocation}</span>
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
                        targetDate={CURRENT_SEASON.ceremonyDate}
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
                © {CURRENT_SEASON.year} {CURRENT_SEASON.name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
