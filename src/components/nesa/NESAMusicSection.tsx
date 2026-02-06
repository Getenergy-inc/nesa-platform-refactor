// NESA Africa Music Section
// Allows users to preview and unlock official NESA songs via AGC, Stripe, or free preview

import { useState } from "react";
import { Music, Play, Pause, Lock, Coins, CreditCard, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import nesaSong1Cover from "@/assets/nesa-africa-song-1.jpeg";
import nesaSong2Cover from "@/assets/nesa-africa-song-2.jpeg";

interface NESASong {
  id: string;
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
  fullUrl?: string;
  agcPrice: number;
  usdPrice: number;
  duration: string;
}

const nesaSongs: NESASong[] = [
  {
    id: "nesa-song-1",
    title: "NESA Africa Anthem",
    artist: "NESA Africa",
    cover: nesaSong1Cover,
    previewUrl: undefined, // Add actual preview URL when available
    fullUrl: undefined, // Add actual full song URL when available
    agcPrice: 50,
    usdPrice: 2.99,
    duration: "3:45",
  },
  {
    id: "nesa-song-2",
    title: "Education For All",
    artist: "NESA Africa",
    cover: nesaSong2Cover,
    previewUrl: undefined,
    fullUrl: undefined,
    agcPrice: 50,
    usdPrice: 2.99,
    duration: "4:12",
  },
];

function SongCard({ song }: { song: NESASong }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { toast } = useToast();

  const handlePreview = () => {
    if (!song.previewUrl) {
      toast({
        title: "Preview Coming Soon",
        description: "This song preview will be available shortly.",
      });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handlePayWithAGC = () => {
    toast({
      title: "AGC Payment",
      description: `Unlock "${song.title}" for ${song.agcPrice} AGC credits. Feature coming soon!`,
    });
  };

  const handlePayWithStripe = () => {
    toast({
      title: "Card Payment",
      description: `Purchase "${song.title}" for $${song.usdPrice}. Feature coming soon!`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-charcoal-light border-gold/20 overflow-hidden hover:border-gold/40 transition-all duration-300 group">
        <CardContent className="p-0">
          {/* Album Cover */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 bg-charcoal/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handlePreview}
                className="h-16 w-16 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 text-charcoal" fill="currentColor" />
                ) : (
                  <Play className="h-7 w-7 text-charcoal ml-1" fill="currentColor" />
                )}
              </button>
            </div>

            {/* Duration Badge */}
            <Badge className="absolute bottom-2 right-2 bg-charcoal/80 text-white border-0">
              {song.duration}
            </Badge>

            {/* Lock Status */}
            {!isUnlocked && (
              <div className="absolute top-2 right-2">
                <div className="h-8 w-8 rounded-full bg-charcoal/80 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-gold" />
                </div>
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white truncate">
                {song.title}
              </h3>
              <p className="text-white/60 text-sm">{song.artist}</p>
            </div>

            {/* Preview Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              className="w-full border-gold/30 text-gold hover:bg-gold/10 gap-2"
            >
              <Volume2 className="h-4 w-4" />
              {isPlaying ? "Pause Preview" : "Free 30s Preview"}
            </Button>

            {/* Payment Options */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={handlePayWithAGC}
                className="bg-gradient-to-r from-gold to-gold-light text-charcoal hover:opacity-90 gap-1 text-xs"
              >
                <Coins className="h-3.5 w-3.5" />
                {song.agcPrice} AGC
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handlePayWithStripe}
                className="gap-1 text-xs"
              >
                <CreditCard className="h-3.5 w-3.5" />
                ${song.usdPrice}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function NESAMusicSection() {
  return (
    <section id="music" className="bg-charcoal py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4"
          >
            <Music className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Official Music</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl font-bold text-white mb-4"
          >
            NESA Africa Songs
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto"
          >
            Listen to our official anthems celebrating education across Africa. 
            Unlock with AGC credits or purchase directly.
          </motion.p>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {nesaSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>

        {/* Info Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-white/50 text-sm mt-8"
        >
          All proceeds support education initiatives across Africa
        </motion.p>
      </div>
    </section>
  );
}

export default NESAMusicSection;
