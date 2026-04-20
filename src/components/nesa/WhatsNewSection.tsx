import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Bell, Sparkles, Users, Trophy, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { buildScheduledEvents, DEFAULT_SCHEDULE_TEMPLATE } from "@/config/schedule";

interface UpdateItem {
  id: string;
  type: string;
  icon: typeof Users;
  title: string;
  description: string;
  date: string;
  href: string;
  badge: string;
  badgeColor: string;
}

function buildUpdates(awardYear: number): UpdateItem[] {
  const events = buildScheduledEvents(awardYear, DEFAULT_SCHEDULE_TEMPLATE);
  const platinumShow = events.tvShows.find(e => e.id === "platinum-show");
  const goldVoting = events.votingWindows.find(e => e.id === "gold-voting");
  const ceremonyYear = awardYear + 1;

  return [
    {
      id: "1",
      type: "nominees",
      icon: Users,
      title: "New Nominees Across Africa",
      description: `EduAid-Africa Webinars are live — discover ${ceremonyYear} education champions across all 5 regions.`,
      date: new Date().toISOString().split("T")[0],
      href: "/nominees",
      badge: "Live",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      id: "2",
      type: "voting",
      icon: Trophy,
      title: `Gold Voting Opens ${goldVoting?.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? "Apr 10"}`,
      description: `Public voting for Gold Certificate nominees begins ${goldVoting?.date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) ?? `April ${ceremonyYear}`}.`,
      date: goldVoting?.date.toISOString().split("T")[0] ?? `${ceremonyYear}-04-10`,
      href: "/vote?tier=gold",
      badge: "Upcoming",
      badgeColor: "bg-gold/20 text-gold border-gold/30",
    },
    {
      id: "3",
      type: "media",
      icon: Tv,
      title: "Platinum Recognition Show",
      description: `Premieres ${platinumShow?.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) ?? `28 February ${ceremonyYear}`} — featuring NRC-verified champions.`,
      date: platinumShow?.date.toISOString().split("T")[0] ?? `${ceremonyYear}-02-28`,
      href: "/media/shows",
      badge: "Upcoming",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
  ];
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * WhatsNewSection - Freshness indicator for return visitors
 * 
 * Shows recent updates to give users a reason to return regularly.
 * Structured for future CMS integration.
 */
export function WhatsNewSection() {
  const { currentEdition } = useSeason();
  const updates = buildUpdates(currentEdition.displayYear);

    <section className="bg-charcoal py-12 md:py-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30">
              <Sparkles className="h-3 w-3 text-gold animate-pulse" />
              <span className="text-xs font-medium text-gold uppercase tracking-wider">
                What's New
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white">
              This Week on NESA
            </h2>
          </div>
          <Button variant="ghost" className="text-gold hover:text-gold hover:bg-gold/10 gap-2 text-sm" asChild>
            <Link to="/about/timeline">
              View Full Timeline
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Updates Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {updates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={update.href}>
                <div className="group h-full bg-white/5 rounded-xl p-5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <update.icon className="h-5 w-5 text-gold" />
                    </div>
                    <Badge variant="outline" className={update.badgeColor}>
                      {update.badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="text-white font-semibold mb-2 group-hover:text-gold transition-colors">
                    {update.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {update.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatRelativeDate(update.date)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
            <Bell className="h-4 w-4" />
            <span>Stay updated — follow your favorite nominees below</span>
          </div>
        </div>
      </div>
    </section>
  );
}
