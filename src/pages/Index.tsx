import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Play, Menu, Globe, Users, Eye, Ticket, PlayCircle, ChevronRight } from "lucide-react";
import { useSeason } from "@/contexts/SeasonContext";
import heroCeremony from "@/assets/hero-ceremony.jpg";

export default function Index() {
  const { currentEdition, getBannerText, loading } = useSeason();

  const quickActions = [
    { label: "Refer", icon: Users, href: "/refer" },
    { label: "Nominate", icon: Award, href: "/nominate" },
    { label: `Vision ${currentEdition.ceremonyYear + 9}`, icon: Eye, href: "/vision" },
    { label: "Tickets", icon: Ticket, href: "/tickets" },
    { label: "Watch", icon: PlayCircle, href: "/media" },
  ];

  // Dynamic banner text from season config
  const bannerText = getBannerText();

  return (
    <div className="min-h-screen bg-secondary">
      {/* Navigation */}
      <nav className="absolute top-0 z-50 w-full">
        <div className="container flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-20 items-center justify-center rounded bg-primary/90 px-2">
              <span className="font-display text-xs font-bold leading-tight text-secondary">
                SCEF<br />
                <span className="text-[8px] font-normal">Santos Creations Education Foundation</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-secondary-foreground/80 hover:text-secondary-foreground">
              <Globe className="h-4 w-4" />
              English
            </button>
            <button className="text-secondary-foreground/80 hover:text-secondary-foreground">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroCeremony})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/50 to-secondary/90" />
        </div>

        {/* Content */}
        <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
          {/* Announcement Badge - Dynamic from SeasonConfig */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-secondary/60 px-5 py-2.5 backdrop-blur-sm">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              {loading ? "Loading..." : bannerText}
            </span>
          </div>

          {/* Main Heading - Uses edition tagline */}
          <h1 className="mb-4 max-w-4xl">
            <span className="font-display text-4xl font-bold text-secondary-foreground md:text-6xl lg:text-7xl">
              {currentEdition.tagline.split(" ").slice(0, -1).join(" ")}{" "}
            </span>
            <span className="font-cursive text-5xl text-primary md:text-7xl lg:text-8xl">
              {currentEdition.tagline.split(" ").slice(-1)[0]}
            </span>
          </h1>

          {/* Subtitle - Uses edition theme */}
          <p className="mb-6 font-display text-xl text-secondary-foreground/90 md:text-2xl">
            {currentEdition.theme}
          </p>

          {/* Description - Dynamic edition name */}
          <p className="mb-10 max-w-3xl text-base text-secondary-foreground/70 md:text-lg">
            At the {currentEdition.name}, we celebrate 
            the real changemakers shaping the future of education across Africa. A pan-African 
            celebration of educational transformation, social impact, and legacy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
              asChild
            >
              <Link to="/about">
                <Play className="mr-2 h-4 w-4" />
                Read More About NESA
              </Link>
            </Button>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
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
            <svg className="h-16 w-16 text-primary opacity-60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
            </svg>
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
                  <action.icon className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="text-xs font-medium md:text-sm">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-background py-20">
        <div className="container px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 font-display text-3xl font-bold md:text-4xl">
              About NESA Africa
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              The New Education Standard Award Africa (NESA-Africa) is the continent's premier 
              recognition platform for excellence in education. We honor individuals, institutions, 
              and innovations that are transforming learning outcomes across Africa.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-muted/50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">10+ Categories</h3>
                <p className="text-sm text-muted-foreground">
                  Recognizing excellence across diverse educational fields
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">54 Countries</h3>
                <p className="text-sm text-muted-foreground">
                  Pan-African reach celebrating the entire continent
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">500+ Nominees</h3>
                <p className="text-sm text-muted-foreground">
                  Outstanding individuals and institutions recognized
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dynamic edition name */}
      <section className="bg-secondary py-20">
        <div className="container px-6 text-center">
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
              <Link to="/categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Dynamic year from edition */}
      <footer className="border-t border-border/10 bg-secondary py-8">
        <div className="container px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-16 items-center justify-center rounded bg-primary/90 px-2">
                <span className="font-display text-[10px] font-bold leading-tight text-secondary">
                  SCEF
                </span>
              </div>
              <span className="text-sm text-secondary-foreground/60">
                Santos Creations Education Foundation
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/50">
              © {currentEdition.displayYear} NESA Africa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
