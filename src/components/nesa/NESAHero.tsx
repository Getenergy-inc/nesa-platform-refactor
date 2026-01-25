import { Trophy, Users, Award, FileText, Ticket, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { NESALogo } from "@/components/nesa/NESALogo";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";

const quickNavItems = [
  { icon: Users, label: "Refer", href: "#refer" },
  { icon: Award, label: "Nominate", href: "/nominate" },
  { icon: FileText, label: "Vision 2035", href: "/about/vision-2035" },
  { icon: Ticket, label: "Tickets", href: "/tickets" },
  { icon: PlayCircle, label: "Watch", href: "/media/tv" },
];

export function NESAHero() {
  const { currentEdition, getBannerText } = useSeason();
  const bannerText = getBannerText();

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
        <div className="absolute inset-0 bg-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/50 to-charcoal/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-transparent to-charcoal/70" />
      </div>

      {/* Gold Spotlight Effects - Hidden on small screens for performance */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-gold/20 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-gold/20 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      {/* Floating Gold Particles - Reduced on mobile */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold animate-twinkle hidden sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
        {/* Fewer particles on mobile */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`mobile-${i}`}
            className="absolute rounded-full bg-gold animate-twinkle sm:hidden"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2.5}s`,
              width: `3px`,
              height: `3px`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16">
        {/* NESA Logo Icon */}
        <div className="mb-4 sm:mb-6">
          <NESALogo variant="icon" size="lg" className="h-16 w-16 sm:h-20 sm:w-20" />
        </div>

        {/* Stage-aware Badge */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-charcoal/80 border border-gold/40 backdrop-blur-sm mb-6 sm:mb-8">
          <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-white">
            {bannerText}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 max-w-4xl leading-tight px-2">
          Honoring Africa's{" "}
          <span className="text-gold block sm:inline">Changemakers</span>
        </h1>

        {/* Subheadline - from config */}
        <p className="text-lg sm:text-xl md:text-2xl font-medium text-gold mb-4 sm:mb-6 px-4">
          {currentEdition.theme}
        </p>

        {/* Description */}
        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl mb-8 sm:mb-10 leading-relaxed px-4 sm:px-6">
          At the New Education Standard Award Africa ({currentEdition.name}), we celebrate the real
          changemakers shaping the future of education across Africa.
        </p>

        {/* CTA Buttons with NESA branding */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link to="/about" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 sm:px-8 gap-2 shadow-gold min-h-[48px] touch-manipulation"
            >
              <NESALogo variant="icon" size="sm" className="h-4 w-4" />
              Read More About NESA
            </Button>
          </Link>
          <Link to="/nominate" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-gold text-gold hover:bg-gold/10 hover:text-gold rounded-full px-6 sm:px-8 gap-2 min-h-[48px] touch-manipulation"
            >
              <Trophy className="h-4 w-4" />
              Nominate Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Nav Bar - Scrollable on mobile */}
      <div className="relative z-10 bg-charcoal/90 backdrop-blur-md border-t border-gold/20">
        <div className="container py-3 sm:py-4 px-2 sm:px-4">
          <nav className="flex justify-start sm:justify-center gap-2 sm:gap-6 md:gap-10 overflow-x-auto scrollbar-hide pb-1 -mb-1">
            {quickNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center gap-1 sm:gap-1.5 text-white/80 hover:text-gold transition-colors min-w-[64px] sm:min-w-fit px-2 sm:px-3 py-2 rounded-lg hover:bg-gold/5 active:bg-gold/10 touch-manipulation"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
