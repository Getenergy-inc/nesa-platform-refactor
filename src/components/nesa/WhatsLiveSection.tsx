import { Play, Vote, Calendar, Tv, ArrowRight, Radio, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

/**
 * WhatsLiveSection — Dynamic event cards with warm engagement
 * 
 * Shows next TV show, voting window, and gala event.
 * Gradient accent cards with hover warmth.
 */
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
      gradient: "from-gold/20 to-amber-600/10",
      iconColor: "text-gold",
      borderColor: "border-gold/20 hover:border-gold/40",
    },
    {
      icon: Vote,
      label: "Next Voting Window",
      event: nextVoting,
      href: "/vote",
      gradient: "from-blue-500/20 to-blue-600/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20 hover:border-blue-500/40",
    },
    {
      icon: Calendar,
      label: "Next Gala Event",
      event: nextGala,
      href: "/media/gala",
      gradient: "from-purple-500/20 to-purple-600/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20 hover:border-purple-500/40",
    },
  ];

  return (
    <section className="bg-charcoal py-14 md:py-18">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
              <Radio className="h-3 w-3 text-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                What's Live
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              Upcoming Events &amp; Voting
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
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Link to={card.href}>
                <div className={`group relative bg-gradient-to-br ${card.gradient} rounded-2xl p-6 border ${card.borderColor} hover:bg-white/8 transition-all duration-300`}>
                  {/* Icon */}
                  <div className="h-11 w-11 rounded-xl bg-white/8 flex items-center justify-center mb-4 group-hover:bg-white/12 transition-colors">
                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  </div>
                  
                  {/* Label */}
                  <p className="text-white/45 text-xs uppercase tracking-wider font-medium mb-1.5">{card.label}</p>
                  
                  {/* Event Name */}
                  {card.event ? (
                    <>
                      <h3 className="text-white font-semibold text-lg mb-2.5 group-hover:text-gold transition-colors line-clamp-1">
                        {card.event.name}
                      </h3>
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDate(card.event.date)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-white/35 text-sm italic">Coming soon...</p>
                  )}

                  {/* Hover Arrow */}
                  <ArrowRight className="absolute top-6 right-6 h-4 w-4 text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
