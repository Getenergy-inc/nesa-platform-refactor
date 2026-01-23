import { Tv, Vote, Trophy } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE, type ScheduledEvent } from "@/config/schedule";

function EventGroup({ 
  icon: Icon, 
  title, 
  events 
}: { 
  icon: React.ElementType; 
  title: string; 
  events: ScheduledEvent[] 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gold" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
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
    </div>
  );
}

export function UpcomingEventsSection() {
  const { currentEdition } = useSeason();
  
  // Build events from config for the current season
  const events = buildScheduledEvents(currentEdition.displayYear, DEFAULT_SCHEDULE_TEMPLATE);
  
  // Combine gala and legacy events for display
  const galaAndLegacy = [...events.galas, ...events.legacy];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Upcoming TV Shows, Voting & Events
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Live countdown to NESA-Africa's major milestones, public voting windows, and broadcast events
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <EventGroup icon={Tv} title="📺 Live TV Shows" events={events.tvShows} />
          <EventGroup icon={Vote} title="🗳️ Public Voting Windows" events={events.votingWindows} />
          <EventGroup icon={Trophy} title="🏆 Gala & Legacy Events" events={galaAndLegacy} />
        </div>
      </div>
    </section>
  );
}
