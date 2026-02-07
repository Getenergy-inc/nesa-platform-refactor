/**
 * MiniMusicPlayer - Compact music widget for secondary pages
 * 
 * A minimal, non-intrusive music player that:
 * - Shows current playback state
 * - Allows play/pause of NESA anthems
 * - Links to full music section for downloads
 * - Uses design system tokens
 */

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Pause, Music, Volume2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Import song covers
import nesaSong1Cover from "@/assets/nesa-africa-song-1.jpeg";
import nesaSong2Cover from "@/assets/nesa-africa-song-2.jpeg";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
}

const songs: Song[] = [
  {
    id: "nesa-song-1",
    title: "NESA Africa Anthem",
    artist: "NESA Africa",
    cover: nesaSong1Cover,
    audioUrl: "/audio/nesa-song-1.mp3",
  },
  {
    id: "nesa-song-2",
    title: "NESA Africa Anthem 2",
    artist: "NESA Africa",
    cover: nesaSong2Cover,
    audioUrl: "/audio/nesa-song-2.mp3",
  },
];

interface MiniMusicPlayerProps {
  className?: string;
  variant?: "default" | "compact" | "banner";
}

export function MiniMusicPlayer({ className, variant = "default" }: MiniMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(currentSong.audioUrl);
    audioRef.current.volume = 0.5;

    audioRef.current.addEventListener("ended", () => {
      // Play next song or loop
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    if (isPlaying && audioRef.current) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  // Compact variant - just a floating button
  if (variant === "compact") {
    return (
      <div className={cn("fixed bottom-20 right-4 z-40 lg:bottom-6", className)}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 right-0 w-72 bg-charcoal/95 backdrop-blur-xl rounded-2xl border border-gold/20 p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{currentSong.title}</p>
                  <p className="text-white/50 text-xs">{currentSong.artist}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="h-8 w-8 p-0 text-gold hover:bg-gold/10"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={nextSong}
                    className="h-8 px-2 text-white/60 hover:text-white hover:bg-white/10 text-xs"
                  >
                    Next
                  </Button>
                </div>
                <Link to="/#music">
                  <Button size="sm" variant="ghost" className="h-8 text-gold hover:bg-gold/10 text-xs gap-1">
                    Full Player
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center shadow-lg transition-all",
            isPlaying
              ? "bg-gradient-to-br from-gold to-amber-600 text-charcoal"
              : "bg-charcoal border border-gold/30 text-gold hover:border-gold/60"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-charcoal rounded-full"
                  animate={{ height: [8, 16, 8] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : (
            <Music className="h-6 w-6" />
          )}
        </motion.button>
      </div>
    );
  }

  // Banner variant - horizontal strip
  if (variant === "banner") {
    return (
      <div
        className={cn(
          "bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal border-y border-gold/10",
          className
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={togglePlay}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all",
                  isPlaying
                    ? "bg-gold text-charcoal"
                    : "bg-gold/10 text-gold hover:bg-gold/20"
                )}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentSong.cover}
                  alt={currentSong.title}
                  className="h-10 w-10 rounded-lg object-cover hidden sm:block"
                />
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{currentSong.title}</p>
                  <p className="text-white/50 text-xs flex items-center gap-1">
                    <Volume2 className="h-3 w-3" />
                    <span>Listen while you browse</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={nextSong}
                className="text-white/60 hover:text-white text-xs hidden sm:flex"
              >
                Skip
              </Button>
              <Link to="/#music">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gold/30 text-gold hover:bg-gold/10 text-xs gap-1"
                >
                  <Music className="h-3 w-3" />
                  <span className="hidden sm:inline">Full Music Section</span>
                  <span className="sm:hidden">More</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - card style
  return (
    <div
      className={cn(
        "bg-charcoal/80 backdrop-blur-xl rounded-2xl border border-gold/20 p-4 shadow-xl",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className={cn(
              "h-16 w-16 rounded-xl object-cover transition-transform",
              isPlaying && "animate-pulse"
            )}
          />
          <button
            onClick={togglePlay}
            className={cn(
              "absolute inset-0 flex items-center justify-center rounded-xl transition-all",
              isPlaying
                ? "bg-charcoal/40"
                : "bg-charcoal/60 hover:bg-charcoal/40"
            )}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white ml-0.5" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Music className="h-3.5 w-3.5 text-gold shrink-0" />
            <span className="text-xs text-gold font-medium">NESA Official Music</span>
          </div>
          <p className="text-white font-semibold truncate">{currentSong.title}</p>
          <p className="text-white/50 text-sm">{currentSong.artist}</p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={nextSong}
            className="text-white/60 hover:text-white text-xs h-8"
          >
            Next
          </Button>
          <Link to="/#music">
            <Button
              size="sm"
              className="bg-gold/10 text-gold hover:bg-gold/20 text-xs h-8 gap-1"
            >
              Download
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="mt-3 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-gold/60 rounded-full"
              animate={{ height: [4, 12, 4] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
            />
          ))}
          <span className="text-xs text-white/40 ml-2">Now playing</span>
        </div>
      )}
    </div>
  );
}

export default MiniMusicPlayer;
