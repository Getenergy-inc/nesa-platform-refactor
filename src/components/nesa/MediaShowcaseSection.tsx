import { Tv, PlayCircle, Radio, Music, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import nesaSong1Cover from "@/assets/nesa-africa-song-1.jpeg";
import nesaSong2Cover from "@/assets/nesa-africa-song-2.jpeg";

/**
 * MediaShowcaseSection — Merged Watch + Music
 * 
 * Oscar/Grammy pattern: media is integral, not buried.
 * Compact 2-column layout: left = media channels, right = music preview
 */
export function MediaShowcaseSection() {
  const channels = [
    {
      icon: Tv,
      name: "NESA Africa TV",
      description: "Official award shows & ceremonies",
      href: "/media/tv",
      gradient: "from-gold/15 to-amber-600/5",
    },
    {
      icon: PlayCircle,
      name: "Media Hub",
      description: "Highlights, interviews & behind the scenes",
      href: "/media",
      gradient: "from-blue-500/15 to-blue-600/5",
    },
    {
      icon: Radio,
      name: "Live Events",
      description: "Stream galas and special broadcasts",
      href: "/media/gala",
      gradient: "from-purple-500/15 to-purple-600/5",
    },
  ];

  const songs = [
    { title: "NESA Africa Anthem", cover: nesaSong1Cover, duration: "3:45" },
    { title: "NESA Africa Anthem 2", cover: nesaSong2Cover, duration: "4:12" },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Watch, Listen &{" "}
            <span className="text-gradient-gold">Engage</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Stay connected through official media, live broadcasts, and the NESA Africa soundtracks.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left: Media Channels */}
          <div className="space-y-3">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to={channel.href}>
                  <div className={`group flex items-center gap-5 bg-gradient-to-r ${channel.gradient} rounded-2xl px-6 py-5 border border-white/8 hover:border-gold/30 transition-all duration-300`}>
                    <div className="h-12 w-12 rounded-xl bg-white/8 flex items-center justify-center group-hover:bg-gold/15 transition-colors shrink-0">
                      <channel.icon className="h-6 w-6 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold group-hover:text-gold transition-colors">
                        {channel.name}
                      </h4>
                      <p className="text-white/50 text-sm">{channel.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right: Music Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/4 rounded-2xl border border-white/8 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Music className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold text-gold uppercase tracking-wider">Official Music</span>
            </div>

            <div className="space-y-3 mb-5">
              {songs.map((song, index) => (
                <Link key={song.title} to="/#music" className="group flex items-center gap-4 p-3 rounded-xl bg-white/4 hover:bg-white/8 border border-white/5 hover:border-gold/20 transition-all">
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
                    <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-charcoal/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-white text-sm font-semibold group-hover:text-gold transition-colors truncate">{song.title}</h5>
                    <p className="text-white/40 text-xs">NESA Africa • {song.duration}</p>
                  </div>
                </Link>
              ))}
            </div>

            <Link to="/#music">
              <Button variant="outline" className="w-full border-gold/30 text-gold hover:bg-gold/10 rounded-full gap-2 text-sm">
                <Music className="h-4 w-4" />
                Listen & Download
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
