import { Tv, Vote, Trophy, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "./CountdownTimer";
import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE, type ScheduledEvent } from "@/config/schedule";
import countdownTvImg from "@/assets/cards/countdown-tv-show.jpg";
import countdownVotingImg from "@/assets/cards/countdown-voting.jpg";
import countdownGalaImg from "@/assets/cards/countdown-gala.jpg";

function EventGroup({ 
  icon: Icon, 
  title, 
  events,
  note,
  image
}: { 
  icon: React.ElementType; 
  title: string; 
  events: ScheduledEvent[];
  note?: string;
  image: string;
}) {
  return (
    <div className="space-y-4">
      {/* Header Image */}
      <div className="relative h-40 w-full overflow-hidden rounded-xl">
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <Icon className="h-5 w-5 text-gold" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="bg-charcoal-light rounded-xl p-4 border border-gold/20"
          >
            <CountdownTimer targetDate={event.date} label={event.name} />
          </div>
        ))}
      </div>
      {note && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/5 border border-gold/20">
          <Coins className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/70">{note}</p>
        </div>
      )}
    </div>
  );
}

export function UpcomingEventsSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  
  const events = buildScheduledEvents(currentEdition.displayYear, DEFAULT_SCHEDULE_TEMPLATE);
  const galaAndLegacy = [...events.galas, ...events.legacy];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.upcomingEvents.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.upcomingEvents.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <EventGroup 
            icon={Tv} 
            title={t("landing.upcomingEvents.tvShows")} 
            events={events.tvShows}
            image={countdownTvImg}
          />
          <EventGroup 
            icon={Vote} 
            title={t("landing.upcomingEvents.votingWindows")} 
            events={events.votingWindows}
            note={t("landing.upcomingEvents.votingNote", { defaultValue: "Public participation happens during official windows. Vote using AGC voting points earned through platform participation." })}
            image={countdownVotingImg}
          />
          <EventGroup 
            icon={Trophy} 
            title={t("landing.upcomingEvents.galaEvents")} 
            events={galaAndLegacy}
            image={countdownGalaImg}
          />
        </div>
      </div>
    </section>
  );
}
