// Consolidated Media Showcase — Watch, Listen & Engage
// Channels + Music player in a clean two-column layout

import { useState, useRef, useEffect } from "react";
import { Tv, PlayCircle, Radio, Music, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChannelCard } from "@/components/nesa/media-showcase/ChannelCard";
import { MiniPlayer } from "@/components/nesa/media-showcase/MiniPlayer";
import nesaSong1Cover from "@/assets/nesa-africa-song-1.jpeg";
import nesaSong2Cover from "@/assets/nesa-africa-song-2.jpeg";

const channels = [
  { icon: Tv, name: "NESA Africa TV", description: "Official award shows & ceremonies", href: "/media/tv" },
  { icon: PlayCircle, name: "Media Hub", description: "Highlights, interviews & behind the scenes", href: "/media" },
  { icon: Radio, name: "Live Events", description: "Stream galas and special broadcasts", href: "/media/gala" },
];

const songs = [
  { id: "1", title: "NESA Africa Anthem", artist: "NESA Africa", cover: nesaSong1Cover, audioUrl: "/audio/nesa-song-1.mp3", duration: "3:45" },
  { id: "2", title: "NESA Africa Anthem 2", artist: "NESA Africa", cover: nesaSong2Cover, audioUrl: "/audio/nesa-song-2.mp3", duration: "4:12" },
];

export function MediaShowcaseSection() {
  const { t } = useTranslation("pages");
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
          className="mb-12 text-center"
        >
          <h2 className="mb-2 font-display text-3xl font-bold text-secondary-foreground md:text-4xl">
            {t("mediaShowcase.title")}{" "}
            <span className="text-primary">{t("mediaShowcase.titleHighlight")}</span>
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {t("mediaShowcase.description")}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
          {/* Channels — Left 3 cols */}
          <div className="space-y-3 lg:col-span-3">
            {channels.map((channel, index) => (
              <ChannelCard key={channel.name} {...channel} index={index} />
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-2"
            >
              <Link to="/media">
                <Button className="gap-2 rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                  <PlayCircle className="h-4 w-4" />
                  {t("mediaShowcase.exploreMediaHub")}
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
            <div className="rounded-2xl border border-border/10 bg-secondary/60 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {t("mediaShowcase.officialMusic")}
                </h3>
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

              <Link to="/music" className="mt-4 block">
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-full border-primary/25 text-primary hover:bg-primary/10"
                >
                  <Music className="h-4 w-4" />
                  {t("mediaShowcase.listenDownload")}
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
