import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE } from "@/config/schedule";
import { Calendar, MapPin } from "lucide-react";

export function KeyDatesBanner() {
  const { t } = useTranslation("pages");
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
    <div className="bg-charcoal-light border-y border-gold/20 overflow-hidden relative">
      <div className="container py-4 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm sm:text-base text-white">
          {/* Gala Date */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gold">{t("landing.keyDates.blueGarnetGala")}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-4 h-4 text-gold/70" />
            <span>{galaDate ? formatDate(galaDate) : t("landing.keyDates.comingSoon")}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/70">
            <MapPin className="w-4 h-4 text-gold/70" />
            <span>{t("landing.keyDates.location")}</span>
          </div>
          
          <span className="hidden sm:inline text-gold/30">|</span>
          
          {/* Webinar Date */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gold">{t("landing.keyDates.eduAidWebinars")}</span>
            <span className="text-white/70">{formatDate(webinarStart)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
