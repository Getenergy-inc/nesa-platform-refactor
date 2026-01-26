import { Trophy, Users, Award, FileText, Ticket, PlayCircle, Sparkles, Zap, Star, Heart, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { NESALogo } from "@/components/nesa/NESALogo";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";

const quickNavItems = [
  { icon: Users, label: "Refer", href: "#refer", emoji: "🤝" },
  { icon: Award, label: "Nominate", href: "/nominate", emoji: "🏆" },
  { icon: FileText, label: "Vision 2035", href: "/about/vision-2035", emoji: "🚀" },
  { icon: Ticket, label: "Tickets", href: "/tickets", emoji: "🎫" },
  { icon: PlayCircle, label: "Watch", href: "/media/tv", emoji: "📺" },
];

const floatingEmojis = ["✨", "🌟", "💫", "⭐", "🔥", "💎", "🎯", "🌍"];

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
        
        {/* Fun gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 animate-gradient-shift" 
          style={{ backgroundSize: '400% 400%' }} />
      </div>

      {/* Animated Blob Shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-gold/30 to-purple-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-gold/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-500/10 to-yellow-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Gold Spotlight Effects - Hidden on small screens for performance */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -left-20 top-0 h-[80vh] w-40 rotate-[20deg] bg-gradient-to-b from-gold/20 to-transparent blur-3xl animate-spotlight-left" />
        <div className="absolute -right-20 top-0 h-[80vh] w-40 rotate-[-20deg] bg-gradient-to-b from-gold/20 to-transparent blur-3xl animate-spotlight-right" />
      </div>

      {/* Floating Emojis */}
      <div className="pointer-events-none absolute inset-0">
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl sm:text-3xl animate-float-emoji"
            style={{
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
              opacity: 0.7,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      {/* Floating Gold Particles with sparkle effect */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-sparkle hidden sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1.5 + Math.random() * 1.5}s`,
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              background: `linear-gradient(135deg, hsl(42 85% 52%), hsl(${280 + i * 20} 85% 60%))`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16">
        {/* NESA Logo Icon with bounce */}
        <div className="mb-4 sm:mb-6 animate-bounce-fun">
          <NESALogo variant="icon" size="lg" className="h-16 w-16 sm:h-20 sm:w-20" />
        </div>

        {/* Fun Badge with rainbow effect */}
        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full glass-dark border-2 animate-rainbow-border mb-6 sm:mb-8 hover-pop transition-transform cursor-default">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold animate-wiggle" />
          <span className="text-xs sm:text-sm font-medium text-white">
            {bannerText}
          </span>
          <span className="text-lg">🔥</span>
        </div>

        {/* Headline with gradient text */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 max-w-4xl leading-tight px-2">
          Honoring Africa's{" "}
          <span className="text-gradient-fun block sm:inline">Education Changemakers</span>
          <span className="inline-block ml-2 animate-wiggle">✨</span>
        </h1>

        {/* Fun subheadline */}
        <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
          <Rocket className="h-5 w-5 text-gold animate-bounce-fun" />
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-gold px-4 text-center">
            Advocating & Achieving Education For All In Africa
          </p>
          <Star className="h-5 w-5 text-gold animate-bounce-fun" style={{ animationDelay: '0.2s' }} />
        </div>

        {/* Description with emoji accents */}
        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-3xl mb-8 sm:mb-10 leading-relaxed px-4 sm:px-6">
          At the New Education Standard Award Africa ({currentEdition.name}), we celebrate the real
          changemakers building the future of education across Africa 🌍
        </p>

        {/* CTA Buttons with fun hover effects */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link to="/about" className="w-full sm:w-auto group">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-gold-dark hover:via-gold hover:to-gold-dark text-charcoal font-semibold rounded-full px-6 sm:px-8 gap-2 shadow-gold min-h-[48px] touch-manipulation hover-pop transition-all duration-300 animate-gradient-shift"
              style={{ backgroundSize: '200% 200%' }}
            >
              <Zap className="h-4 w-4 group-hover:animate-wiggle" />
              Discover More ✨
            </Button>
          </Link>
          <Link to="/nominate" className="w-full sm:w-auto group">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-gold text-gold hover:bg-gold/20 hover:text-gold hover:border-white rounded-full px-6 sm:px-8 gap-2 min-h-[48px] touch-manipulation hover-pop transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,162,39,0.4)]"
            >
              <Trophy className="h-4 w-4 group-hover:animate-bounce-fun" />
              Nominate Now 🏆
            </Button>
          </Link>
        </div>

        {/* Fun stats preview */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8 sm:mt-10">
          {[
            { label: "Nominees", value: "2.5K+", emoji: "👑" },
            { label: "Countries", value: "54", emoji: "🌍" },
            { label: "Categories", value: "17", emoji: "🎯" },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass-dark animate-slide-up-bounce hover-pop transition-transform cursor-default"
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
            >
              <span className="text-xl">{stat.emoji}</span>
              <span className="text-gold font-bold">{stat.value}</span>
              <span className="text-white/70 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Nav Bar - More fun with emojis */}
      <div className="relative z-10 glass-dark border-t border-gold/30">
        <div className="container py-3 sm:py-4 px-2 sm:px-4">
          <nav className="flex justify-start sm:justify-center gap-2 sm:gap-6 md:gap-10 overflow-x-auto scrollbar-hide pb-1 -mb-1">
            {quickNavItems.map((item, index) => (
              <Link
                key={item.label}
                to={item.href}
                className="group flex flex-col items-center gap-1 sm:gap-1.5 text-white/80 hover:text-gold transition-all duration-300 min-w-[64px] sm:min-w-fit px-2 sm:px-3 py-2 rounded-xl hover:bg-gold/10 active:bg-gold/20 touch-manipulation hover-pop"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5 group-hover:scale-0 transition-transform duration-300" />
                  <span className="absolute inset-0 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300">
                    {item.emoji}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
