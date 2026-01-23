import { useState } from "react";
import { Play, Trophy, Users, Award, FileText, Ticket, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import heroImage from "@/assets/hero-ceremony.jpg";
import nesaHeroBgVideo from "@/assets/nesa-hero-bg-video.mp4";

const quickNavItems = [
  { icon: Users, label: "Refer", href: "#refer" },
  { icon: Award, label: "Nominate", href: "/nominate" },
  { icon: FileText, label: "Vision 2035", href: "#vision-2035" },
  { icon: Ticket, label: "Tickets", href: "#tickets" },
  { icon: PlayCircle, label: "Watch", href: "#watch" },
];

export function NESAHero() {
  const { currentEdition, getBannerText } = useSeason();
  const bannerText = getBannerText();
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex flex-col bg-charcoal">
      {/* Video Background with Image Fallback */}
      <div className="absolute inset-0">
        {/* Fallback image - always present, video overlays when working */}
        <img
          src={heroImage}
          alt="NESA-Africa Ceremony Stage"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Video - hidden when failed */}
        {!videoFailed && (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroImage}
            className="absolute inset-0 w-full h-full object-cover object-center"
            onError={() => setVideoFailed(true)}
            onStalled={() => setVideoFailed(true)}
          >
            <source src={nesaHeroBgVideo} type="video/mp4" />
          </video>
        )}
        
        {/* Dark gradient overlay for gold/black theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal" />
      </div>

      {/* Gold Spotlight Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-gold/20 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-gold/20 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      {/* Floating Gold Particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold animate-twinkle"
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
      </div>

      {/* Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        {/* Stage-aware Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-charcoal/80 border border-gold/40 backdrop-blur-sm mb-8">
          <Award className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium text-white">
            {bannerText}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl leading-tight">
          Honoring Africa's{" "}
          <span className="text-gold">Changemakers</span>
        </h1>

        {/* Subheadline - from config */}
        <p className="text-xl sm:text-2xl font-medium text-gold mb-6">
          {currentEdition.theme}
        </p>

        {/* Description */}
        <p className="text-white/80 text-base sm:text-lg max-w-3xl mb-10 leading-relaxed">
          At the New Education Standard Award Africa ({currentEdition.name}), we celebrate the real
          changemakers shaping the future of education across Africa. A pan-African celebration
          of educational transformation, social impact, and legacy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-gold"
          >
            <Play className="h-4 w-4" />
            Read More About NESA
          </Button>
          <Link to="/nominate">
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold/10 hover:text-gold rounded-full px-8 gap-2"
            >
              <Trophy className="h-4 w-4" />
              Nominate Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Nav Bar */}
      <div className="relative z-10 bg-charcoal/90 backdrop-blur-md border-t border-gold/20">
        <div className="container py-4">
          <nav className="flex justify-center gap-6 sm:gap-10 overflow-x-auto">
            {quickNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center gap-1.5 text-white/80 hover:text-gold transition-colors min-w-fit"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
