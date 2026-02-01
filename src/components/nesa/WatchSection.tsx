import { Tv, PlayCircle, Radio, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function WatchSection() {
  const channels = [
    {
      icon: Tv,
      name: "NESA Africa TV",
      description: "Official award shows and recognition ceremonies",
      href: "/media/tv",
    },
    {
      icon: PlayCircle,
      name: "Media Hub",
      description: "Highlights, interviews, and behind the scenes",
      href: "/media",
    },
    {
      icon: Radio,
      name: "Live Events",
      description: "Stream galas and special broadcasts",
      href: "/media/gala",
    },
  ];

  return (
    <section className="bg-charcoal py-12 md:py-16 border-t border-white/10">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Content */}
          <div className="lg:max-w-md">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Watch & Stay Engaged
            </h2>
            <p className="text-white/60 mb-4">
              Watch official shows to stay informed and engaged in the awards cycle.
            </p>
            <Link to="/media">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                <PlayCircle className="h-4 w-4" />
                Explore Media Hub
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right: Channel Cards */}
          <div className="flex flex-wrap justify-center gap-4">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={channel.href}>
                  <div className="group flex items-center gap-4 bg-white/5 rounded-xl px-5 py-4 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all min-w-[220px]">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <channel.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm group-hover:text-gold transition-colors">
                        {channel.name}
                      </h4>
                      <p className="text-white/50 text-xs">{channel.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
