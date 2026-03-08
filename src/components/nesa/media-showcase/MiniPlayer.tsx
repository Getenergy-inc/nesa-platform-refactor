import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

interface Song {
  id: string;
  title: string;
  artist: string;
  cover: string;
  audioUrl: string;
  duration: string;
}

interface MiniPlayerProps {
  song: Song;
  isPlaying: boolean;
  onToggle: () => void;
}

export function MiniPlayer({ song, isPlaying, onToggle }: MiniPlayerProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/10 bg-secondary/60 p-3 transition-all hover:border-primary/20">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary/10">
        <img src={song.cover} alt={song.title} className="h-full w-full object-cover" loading="lazy" />
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/40">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 rounded-full bg-primary"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-secondary-foreground">{song.title}</p>
        <p className="text-xs text-muted-foreground">{song.artist} • {song.duration}</p>
      </div>
      <button
        onClick={onToggle}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition-colors hover:bg-primary/20"
        aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
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
