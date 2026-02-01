import { Play, Vote, Calendar, Tv, ArrowRight, Radio, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE, type ScheduledEvent } from "@/config/schedule";
import { motion } from "framer-motion";

function getNextUpcoming(events: ScheduledEvent[]): ScheduledEvent | null {
  const now = new Date();
  const upcoming = events
    .filter(e => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0] || null;
}

function formatDate(dateStr: string | Date): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export function WhatsLiveSection() {
  const { currentEdition } = useSeason();
  const events = buildScheduledEvents(currentEdition.displayYear, DEFAULT_SCHEDULE_TEMPLATE);

  const nextShow = getNextUpcoming(events.tvShows);
  const nextVoting = getNextUpcoming(events.votingWindows);
  const nextGala = getNextUpcoming([...events.galas, ...events.legacy]);

  const liveCards = [
    {
      icon: Tv,
      label: "Next TV Show",
      event: nextShow,
      href: "/media/tv",
      accentColor: "bg-gold",
      borderColor: "border-gold/30",
    },
    {
      icon: Vote,
      label: "Next Voting Window",
      event: nextVoting,
      href: "/vote",
      accentColor: "bg-blue-500",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Calendar,
      label: "Next Gala Event",
      event: nextGala,
      href: "/media/gala",
      accentColor: "bg-purple-500",
      borderColor: "border-purple-500/30",
    },
  ];

  return (
    <section className="bg-charcoal py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 animate-pulse">
              <Radio className="h-3 w-3 text-red-400" />
              <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
                What's Live
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              Upcoming Events & Voting
            </h2>
          </div>
          <Link to="/about/timeline">
            <Button variant="ghost" className="text-gold hover:text-gold hover:bg-gold/10 gap-2 text-sm">
              View Full Calendar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-3 gap-4">
          {liveCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={card.href}>
                <div className={`group relative bg-white/5 rounded-xl p-5 border ${card.borderColor} hover:bg-white/10 transition-all`}>
                  {/* Icon */}
                  <div className={`h-10 w-10 rounded-lg ${card.accentColor}/20 flex items-center justify-center mb-4`}>
                    <card.icon className={`h-5 w-5 ${card.accentColor === 'bg-gold' ? 'text-gold' : card.accentColor === 'bg-blue-500' ? 'text-blue-400' : 'text-purple-400'}`} />
                  </div>
                  
                  {/* Label */}
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{card.label}</p>
                  
                  {/* Event Name */}
                  {card.event ? (
                    <>
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gold transition-colors line-clamp-1">
                        {card.event.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(card.event.date)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-white/40 text-sm">Coming soon...</p>
                  )}

                  {/* Hover Arrow */}
                  <ArrowRight className="absolute top-5 right-5 h-4 w-4 text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
