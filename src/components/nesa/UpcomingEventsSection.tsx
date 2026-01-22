import { Tv, Vote, Trophy } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

interface EventItem {
  name: string;
  date: string;
}

const tvShows: EventItem[] = [
  { name: "Platinum Recognition Show", date: "2026-02-28T19:00:00" },
  { name: "Africa Icon Recognition Show", date: "2026-03-28T19:00:00" },
  { name: "Gold Certificate Winners Show", date: "2026-05-17T19:00:00" },
];

const votingWindows: EventItem[] = [
  { name: "Gold Public Voting Opens", date: "2026-04-10T00:00:00" },
  { name: "Blue Garnet Voting Opens", date: "2026-05-18T00:00:00" },
];

const galaEvents: EventItem[] = [
  { name: "Blue Garnet Awards Gala", date: "2026-06-27T18:00:00" },
  { name: "Rebuild My School Africa Launch", date: "2026-06-28T10:00:00" },
];

function EventGroup({ 
  icon: Icon, 
  title, 
  events 
}: { 
  icon: React.ElementType; 
  title: string; 
  events: EventItem[] 
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.name} 
            className="bg-charcoal/50 rounded-xl p-4 border border-primary/10"
          >
            <CountdownTimer targetDate={event.date} label={event.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UpcomingEventsSection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Upcoming TV Shows, Voting & Events
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            Live countdown to NESA-Africa's major milestones, public voting windows, and broadcast events
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <EventGroup icon={Tv} title="📺 Live TV Shows" events={tvShows} />
          <EventGroup icon={Vote} title="🗳️ Public Voting Windows" events={votingWindows} />
          <EventGroup icon={Trophy} title="🏆 Gala & Legacy Events" events={galaEvents} />
        </div>
      </div>
    </section>
  );
}
