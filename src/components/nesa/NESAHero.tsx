import { Trophy, Users, Award, FileText, Ticket, PlayCircle, Sparkles, ArrowRight, Vote, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSeason } from "@/contexts/SeasonContext";
import { NESALogo3D } from "@/components/nesa/NESALogo3D";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";

export function NESAHero() {
  const { t } = useTranslation("pages");
  const { currentEdition, getBannerText } = useSeason();
  const bannerText = getBannerText();

  const quickNavItems = [
    { icon: Users, label: "Refer", href: "/dashboard#referral" },
    { icon: Award, label: "Nominate", href: "/nominate" },
    { icon: FileText, label: "Vision 2035", href: "/about/vision-2035" },
    { icon: Ticket, label: "Tickets", href: "/buy-your-ticket" },
    { icon: PlayCircle, label: "Watch", href: "/media/tv" },
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col bg-charcoal overflow-hidden">
      {/* 3D Stage Backdrop Image with Ken Burns Effect */}
      <div className="absolute inset-0">
        <img
          src={stageBackdrop}
          alt="NESA-Africa 2025 Award Stage"
          className="absolute inset-0 w-full h-full object-cover object-center animate-ken-burns"
        />
        
        {/* Layered overlays for depth and text readability */}
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/60 via-transparent to-charcoal/60" />
      </div>

      {/* Elegant Gold Spotlight Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-gold/15 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-gold/15 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      {/* Floating Gold Particles - Subtle and elegant */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle hidden sm:block bg-gold/40"
            style={{
              left: `${15 + i * 10}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.3}s`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16">
        {/* NESA Logo Icon - 3D Motion Graphics */}
        <div className="mb-6 sm:mb-8">
          <NESALogo3D size="xl" />
        </div>

        {/* Badge - Professional with subtle accent */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-gold/40 mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold" />
          <span className="text-xs sm:text-sm font-medium text-white">
            {bannerText}
          </span>
        </div>

        {/* Headline - Elegant with gold accent */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 max-w-4xl leading-tight px-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {t("landing.hero.title")}{" "}
          <span className="text-gold">{t("landing.hero.titleHighlight")}</span>
        </h1>

        {/* Subheadline - Clean and impactful */}
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-gold/90 mb-4 sm:mb-6 max-w-2xl px-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {t("landing.hero.tagline")}
        </p>

        {/* NEW: Compelling description paragraph */}
        <p className="text-white/75 text-sm sm:text-base md:text-lg max-w-3xl mb-6 leading-relaxed px-4 sm:px-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          The New Education Standard Award Africa (NESA-Africa) celebrates visionary leaders, institutions, and innovators building the future of education across Africa—while funding measurable legacy impact through Rebuild My School Africa.
        </p>

        {/* NEW: AGC Voting Strip */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-gold/10 border border-gold/30 mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <Coins className="h-4 w-4 text-gold" />
          <span className="text-sm text-white/90">
            Earn voting points through participation. <span className="text-gold font-medium">Vote with AGC</span> for Gold and Blue Garnet winners.
          </span>
        </div>

        {/* PRIMARY CTA Buttons - Conversion focused */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {/* Primary: Nominate Now */}
          <Link to="/nominate" className="w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 sm:px-8 gap-2 shadow-lg hover:shadow-gold/30 min-h-[48px] touch-manipulation transition-all duration-300"
            >
              <Trophy className="h-4 w-4" />
              Nominate Now
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          {/* Primary: Vote — Gold Certificate */}
          <Link to="/vote?tier=gold" className="w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[hsl(45,100%,50%)] hover:bg-[hsl(45,100%,45%)] text-charcoal font-semibold rounded-full px-6 sm:px-8 gap-2 shadow-lg min-h-[48px] touch-manipulation transition-all duration-300"
            >
              <Vote className="h-4 w-4" />
              Vote — Gold Certificate
            </Button>
          </Link>
          
          {/* Primary: Vote — Blue Garnet Award */}
          <Link to="/vote?tier=bluegarnet" className="w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[hsl(220,70%,50%)] hover:bg-[hsl(220,70%,45%)] text-white font-semibold rounded-full px-6 sm:px-8 gap-2 shadow-lg min-h-[48px] touch-manipulation transition-all duration-300"
            >
              <Award className="h-4 w-4" />
              Vote — Blue Garnet Award
            </Button>
          </Link>
        </div>

        {/* Secondary: Discover More */}
        <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.55s' }}>
          <Link to="/about" className="group inline-flex items-center gap-2 text-gold/80 hover:text-gold transition-colors">
            <span className="text-sm underline-offset-4 hover:underline">Discover More</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats preview - De-emphasized but present */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 animate-fade-in opacity-70" style={{ animationDelay: '0.6s' }}>
          {[
            { label: t("landing.hero.stats.nominees"), value: "2,500+" },
            { label: "Regions", value: "5+2" },
            { label: t("landing.hero.stats.categories"), value: "17" },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm"
            >
              <span className="text-gold/80 font-medium">{stat.value}</span>
              <span className="text-white/50 text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Nav Bar - Professional with subtle interactions */}
      <div className="relative z-10 bg-charcoal/80 backdrop-blur-md border-t border-gold/20">
        <div className="container py-3 sm:py-4 px-2 sm:px-4">
          <nav className="flex justify-start sm:justify-center gap-2 sm:gap-6 md:gap-10 overflow-x-auto scrollbar-hide pb-1 -mb-1">
            {quickNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="group flex flex-col items-center gap-1 sm:gap-1.5 text-white/70 hover:text-gold transition-colors duration-300 min-w-[64px] sm:min-w-fit px-2 sm:px-3 py-2 rounded-xl hover:bg-gold/5 active:bg-gold/10 touch-manipulation"
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
