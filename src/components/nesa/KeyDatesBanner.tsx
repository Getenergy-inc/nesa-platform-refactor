import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE } from "@/config/schedule";
import { Calendar, MapPin, Sparkles } from "lucide-react";

export function KeyDatesBanner() {
  const { currentEdition } = useSeason();
  
  // Build events from config for the current season
  const events = buildScheduledEvents(currentEdition.displayYear, DEFAULT_SCHEDULE_TEMPLATE);
  const galaDate = events.galas[0]?.date;
  const webinarStart = new Date(`${currentEdition.displayYear}-10-14`);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-r from-charcoal via-charcoal-light to-charcoal border-y border-gold/30 overflow-hidden relative">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-gold/10 to-cyan-900/10 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
      
      {/* Sparkle decorations */}
      <div className="absolute left-[10%] top-1/2 -translate-y-1/2 text-gold/30 animate-sparkle">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 text-gold/30 animate-sparkle" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="container py-4 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:text-base text-white">
          {/* Gala Date */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark hover-pop transition-transform cursor-default">
            <span className="text-xl">🎉</span>
            <span className="font-bold text-gradient-fun">Blue Garnet Awards Gala</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/80">
            <Calendar className="w-4 h-4 text-gold" />
            <span>{galaDate ? formatDate(galaDate) : "Coming Soon"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-gold animate-bounce-fun" />
            <span>Lagos, Nigeria 🇳🇬</span>
          </div>
          
          <span className="hidden sm:inline text-gold/30">|</span>
          
          {/* Webinar Date */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark hover-pop transition-transform cursor-default">
            <span className="text-xl">📺</span>
            <span className="font-bold text-gold">EduAid Webinars</span>
            <span className="text-white/70">{formatDate(webinarStart)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
