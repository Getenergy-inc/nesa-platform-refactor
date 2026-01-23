import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE } from "@/config/schedule";

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
    <div className="bg-charcoal border-y border-gold/20">
      <div className="container py-4">
        <p className="text-center text-sm sm:text-base text-white">
          <span className="font-medium text-gold">Blue Garnet Awards Gala</span>
          <span className="mx-2 text-gold/50">•</span>
          <span>{galaDate ? formatDate(galaDate) : "Coming Soon"}</span>
          <span className="mx-2 text-gold/50">•</span>
          <span>Lagos, Nigeria</span>
          <span className="mx-4 text-gold/50">|</span>
          <span className="font-medium text-gold">EduAid Webinars Begin:</span>
          <span className="ml-2">{formatDate(webinarStart)}</span>
        </p>
      </div>
    </div>
  );
}
