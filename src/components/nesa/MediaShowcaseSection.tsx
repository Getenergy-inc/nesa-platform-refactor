// Consolidated Media Showcase — Watch, Listen & Engage
// Merges WatchSection + NESAMusicSection into one editorial block

import { useState, useRef, useEffect } from "react";
import { Tv, PlayCircle, Radio, Music, Play, Pause, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import nesaSong1Cover from "@/assets/nesa-africa-song-1.jpeg";
import nesaSong2Cover from "@/assets/nesa-africa-song-2.jpeg";

const channels = [
  {
    icon: Tv,
    name: "NESA Africa TV",
    description: "Official award shows & ceremonies",
    href: "/media/tv",
    accent: "from-primary/15 border-primary/25",
  },
  {
    icon: PlayCircle,
    name: "Media Hub",
    description: "Highlights, interviews & behind the scenes",
    href: "/media",
    accent: "from-blue-500/15 border-blue-500/25",
  },
  {
    icon: Radio,
    name: "Live Events",
    description: "Stream galas and special broadcasts",
    href: "/media/gala",
    accent: "from-purple-500/15 border-purple-500/25",
  },
];

const songs = [
  { id: "1", title: "NESA Africa Anthem", artist: "NESA Africa", cover: nesaSong1Cover, audioUrl: "/audio/nesa-song-1.mp3", duration: "3:45" },
  { id: "2", title: "NESA Africa Anthem 2", artist: "NESA Africa", cover: nesaSong2Cover, audioUrl: "/audio/nesa-song-2.mp3", duration: "4:12" },
];

function MiniPlayer({ song, isPlaying, onToggle }: {
  song: typeof songs[0];
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/60 border border-ivory/8 p-3 hover:border-primary/20 transition-all">
      <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10">
        <img src={song.cover} alt={song.title} className="h-full w-full object-cover" loading="lazy" />
        {isPlaying && (
          <div className="absolute inset-0 bg-secondary/40 flex items-center justify-center">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-primary rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ivory truncate">{song.title}</p>
        <p className="text-xs text-ivory/50">{song.artist} • {song.duration}</p>
      </div>
      <button
        onClick={onToggle}
        className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Play className="h-3.5 w-3.5 text-primary ml-0.5" />
        )}
      </button>
    </div>
  );
}

export function MediaShowcaseSection() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleToggle = (songId: string) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    if (currentlyPlaying === songId) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
    } else {
      audioRef.current?.pause();
      audioRef.current = new Audio(song.audioUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setCurrentlyPlaying(null);
      setCurrentlyPlaying(songId);
    }
  };

  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mb-2">
            Watch, Listen <span className="text-primary">&amp; Engage</span>
          </h2>
          <p className="text-ivory/60 max-w-xl mx-auto">
            Stay connected through official media, live broadcasts, and the NESA Africa soundtracks.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {/* Channels — Left 3 cols */}
          <div className="lg:col-span-3 space-y-3">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link to={channel.href}>
                  <div className={`group flex items-center gap-4 rounded-xl bg-gradient-to-r ${channel.accent} bg-secondary/40 border p-5 hover:scale-[1.01] transition-all duration-300`}>
                    <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <channel.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-ivory font-display font-semibold group-hover:text-primary transition-colors">
                        {channel.name}
                      </h4>
                      <p className="text-ivory/50 text-sm">{channel.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ivory/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Explore CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-2"
            >
              <Link to="/media">
                <Button className="rounded-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <PlayCircle className="h-4 w-4" />
                  Explore Media Hub
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Music — Right 2 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-ivory/8 bg-secondary/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Music className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Official Music</h3>
              </div>

              <div className="space-y-3">
                {songs.map((song) => (
                  <MiniPlayer
                    key={song.id}
                    song={song}
                    isPlaying={currentlyPlaying === song.id}
                    onToggle={() => handleToggle(song.id)}
                  />
                ))}
              </div>

              <Link to="/music" className="block mt-4">
                <Button variant="outline" className="w-full rounded-full gap-2 border-primary/25 text-primary hover:bg-primary/10">
                  <Music className="h-4 w-4" />
                  Listen & Download
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default MediaShowcaseSection;
