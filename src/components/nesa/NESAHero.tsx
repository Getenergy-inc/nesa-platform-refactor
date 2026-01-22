import { Play, Trophy, Users, Award, FileText, Ticket, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-ceremony.jpg";

const quickNavItems = [
  { icon: Users, label: "Refer", href: "#refer" },
  { icon: Award, label: "Nominate", href: "/nominate" },
  { icon: FileText, label: "Vision 2035", href: "#vision-2035" },
  { icon: Ticket, label: "Tickets", href: "#tickets" },
  { icon: PlayCircle, label: "Watch", href: "#watch" },
];

export function NESAHero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Awards ceremony stage with trophies"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-nesa-navy/70 via-nesa-navy/50 to-nesa-navy/95" />
      </div>

      {/* Spotlight Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-nesa-gold/15 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-nesa-gold/15 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      {/* Floating Particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-nesa-gold animate-twinkle"
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
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-nesa-navy-dark/60 border border-nesa-gold/30 backdrop-blur-sm mb-8">
          <Award className="h-4 w-4 text-nesa-gold" />
          <span className="text-sm font-medium text-nesa-text">
            NESA-Africa 2025 — Nominations Open Now
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-4xl leading-tight">
          Honoring Africa's{" "}
          <span className="text-nesa-gold">Changemakers</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl font-medium text-nesa-gold mb-6">
          Building the Future of Education
        </p>

        {/* Description */}
        <p className="text-nesa-text-muted text-base sm:text-lg max-w-3xl mb-10 leading-relaxed">
          At the New Education Standard Award Africa (NESA–Africa) 2025, we celebrate the real
          changemakers shaping the future of education across Africa. A pan-African celebration
          of educational transformation, social impact, and legacy.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="bg-nesa-gold hover:bg-nesa-gold-muted text-nesa-navy-dark font-semibold rounded-full px-8 gap-2"
          >
            <Play className="h-4 w-4" />
            Read More About NESA
          </Button>
          <Link to="/nominate">
            <Button
              size="lg"
              variant="outline"
              className="border-nesa-gold text-nesa-gold hover:bg-nesa-gold/10 rounded-full px-8 gap-2"
            >
              <Trophy className="h-4 w-4" />
              Nominate Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Nav Bar */}
      <div className="relative z-10 bg-nesa-navy-dark/80 backdrop-blur-md border-t border-nesa-gold/20">
        <div className="container py-4">
          <nav className="flex justify-center gap-6 sm:gap-10 overflow-x-auto">
            {quickNavItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center gap-1.5 text-nesa-text hover:text-nesa-gold transition-colors min-w-fit"
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
