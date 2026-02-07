// NESA Africa Music Section
// Allows users to preview and download official NESA songs via AGC or USD payment
// All proceeds support NESA Africa and EduAid Africa

import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Download, Coins, CreditCard, Heart, Video, X } from "lucide-react";
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
  audioUrl: string;
  videoUrl: string;
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
    audioUrl: "/audio/nesa-song-1.mp3",
    videoUrl: "/videos/nesa-africa-anthem-video.mp4",
    agcPrice: 25,
    usdPrice: 5,
    duration: "3:45",
  },
  {
    id: "nesa-song-2",
    title: "NESA Africa Anthem 2",
    artist: "NESA Africa",
    cover: nesaSong2Cover,
    audioUrl: "/audio/nesa-song-2.mp3",
    videoUrl: "/videos/education-for-all-video.mp4",
    agcPrice: 25,
    usdPrice: 5,
    duration: "4:12",
  },
];

// Video Modal Component
function VideoModal({ song, onClose }: { song: NESASong; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-charcoal rounded-2xl border border-gold/20 overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold/10">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">
              {song.title}
            </h3>
            <p className="text-white/60 text-sm">Official Music Video</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-charcoal-light hover:bg-gold/20 text-white/70 hover:text-gold transition-colors flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black">
          <video
            src={song.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

function SongCard({ song, currentlyPlaying, onPlay }: { 
  song: NESASong; 
  currentlyPlaying: string | null;
  onPlay: (songId: string) => void;
}) {
  const [isPurchased, setIsPurchased] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const isPlaying = currentlyPlaying === song.id;
  const { toast } = useToast();

  const handlePlay = () => {
    onPlay(song.id);
  };

  const handleDownloadWithAGC = () => {
    toast({
      title: "Support with AGC Credits",
      description: `Download "${song.title}" for ${song.agcPrice} AGC. All proceeds support NESA Africa & EduAid Africa initiatives.`,
      action: (
        <Button size="sm" variant="outline" onClick={() => {
          // In production, this would deduct AGC from wallet
          setIsPurchased(true);
          toast({
            title: "Thank You!",
            description: "Your support helps rebuild schools across Africa. Download starting...",
          });
          // Trigger download
          const link = document.createElement('a');
          link.href = song.audioUrl;
          link.download = `${song.title.replace(/\s+/g, '-')}.mp3`;
          link.click();
        }}>
          Confirm
        </Button>
      ),
    });
  };

  const handleDownloadWithUSD = () => {
    toast({
      title: "Support with Card Payment",
      description: `Download "${song.title}" for $${song.usdPrice}. All proceeds support NESA Africa & EduAid Africa initiatives.`,
      action: (
        <Button size="sm" variant="outline" onClick={() => {
          // In production, this would integrate with Stripe
          setIsPurchased(true);
          toast({
            title: "Thank You!",
            description: "Your support helps rebuild schools across Africa. Download starting...",
          });
          // Trigger download
          const link = document.createElement('a');
          link.href = song.audioUrl;
          link.download = `${song.title.replace(/\s+/g, '-')}.mp3`;
          link.click();
        }}>
          Confirm
        </Button>
      ),
    });
  };

  const handleDirectDownload = () => {
    const link = document.createElement('a');
    link.href = song.audioUrl;
    link.download = `${song.title.replace(/\s+/g, '-')}.mp3`;
    link.click();
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
          {/* Album Cover with Animation */}
          <div className="relative aspect-square overflow-hidden">
            <motion.img
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover"
              animate={isPlaying ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={isPlaying ? {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            />
            
            {/* Animated Overlay when playing */}
            {isPlaying && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-gold/30 via-transparent to-transparent"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            
            {/* Play/Pause Button Overlay */}
            <div className={`absolute inset-0 bg-charcoal/50 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <button
                onClick={handlePlay}
                className="h-16 w-16 rounded-full bg-gold/90 hover:bg-gold flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 text-charcoal" fill="currentColor" />
                ) : (
                  <Play className="h-7 w-7 text-charcoal ml-1" fill="currentColor" />
                )}
              </button>
            </div>

            {/* Audio Visualizer when playing */}
            {isPlaying && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gold rounded-full"
                    animate={{ height: [8, 24, 8] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Duration Badge */}
            <Badge className="absolute bottom-2 right-2 bg-charcoal/80 text-white border-0">
              {song.duration}
            </Badge>

            {/* Now Playing indicator */}
            {isPlaying && (
              <Badge className="absolute top-2 left-2 bg-gold text-charcoal border-0 animate-pulse">
                Now Playing
              </Badge>
            )}

            {/* Purchased Badge */}
            {isPurchased && (
              <Badge className="absolute top-2 right-2 bg-green-600 text-white border-0">
                Purchased
              </Badge>
            )}
          </div>

          {/* Song Info */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-display text-lg font-semibold text-white truncate">
                {song.title}
              </h3>
              <p className="text-white/60 text-sm">{song.artist}</p>
            </div>

            {/* Play Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlay}
              className={`w-full gap-2 ${isPlaying ? 'border-gold text-gold bg-gold/10' : 'border-gold/30 text-gold hover:bg-gold/10'}`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play Preview
                </>
              )}
            </Button>

            {/* Watch Music Video Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVideo(true)}
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10"
            >
              <Video className="h-4 w-4" />
              Watch Music Video
            </Button>

            {/* Download Options */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                <Heart className="h-3 w-3 text-destructive" />
                Support NESA Africa & EduAid Africa
              </p>
              
              {isPurchased ? (
                <Button
                  size="sm"
                  onClick={handleDirectDownload}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Now
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={handleDownloadWithAGC}
                    className="bg-gradient-to-r from-gold to-gold-light text-charcoal hover:opacity-90 gap-1 text-xs"
                  >
                    <Coins className="h-3.5 w-3.5" />
                    {song.agcPrice} AGC
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleDownloadWithUSD}
                    className="gap-1 text-xs"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    ${song.usdPrice}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Video Modal */}
      {showVideo && (
        <VideoModal song={song} onClose={() => setShowVideo(false)} />
      )}
    </motion.div>
  );
}

export function NESAMusicSection() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (songId: string) => {
    const song = nesaSongs.find(s => s.id === songId);
    if (!song) return;

    if (currentlyPlaying === songId) {
      // Pause current song
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentlyPlaying(null);
    } else {
      // Stop previous song
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Play new song
      audioRef.current = new Audio(song.audioUrl);
      audioRef.current.play();
      audioRef.current.onended = () => setCurrentlyPlaying(null);
      setCurrentlyPlaying(songId);
    }
  };

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
            Download with <span className="text-gold font-semibold">25+ AGC</span> or <span className="text-gold font-semibold">$5+</span> — 
            all proceeds support <span className="text-primary">NESA Africa</span> & <span className="text-primary">EduAid Africa</span> initiatives.
          </motion.p>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {nesaSongs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              currentlyPlaying={currentlyPlaying}
              onPlay={handlePlay}
            />
          ))}
        </div>

        {/* Impact Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10 p-4 rounded-xl bg-gradient-to-r from-gold/5 via-primary/5 to-gold/5 border border-gold/10 max-w-xl mx-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-white/80 text-sm font-medium">Your Support Makes a Difference</span>
          </div>
          <p className="text-white/50 text-xs">
            Every download helps rebuild schools and provide educational resources across Africa through our EduAid initiative.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default NESAMusicSection;
