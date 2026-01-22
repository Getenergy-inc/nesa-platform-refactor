import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgramVideoSectionProps {
  videoUrl?: string;
  youtubeId?: string;
  posterUrl?: string;
  title?: string;
  description?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function ProgramVideoSection({
  videoUrl,
  youtubeId,
  posterUrl,
  title,
  description,
  autoPlay = false,
  muted = true,
  loop = true,
}: ProgramVideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // YouTube embed
  if (youtubeId) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container px-6">
          {(title || description) && (
            <div className="mb-8 text-center">
              {title && <h2 className="mb-2 font-display text-3xl font-bold text-secondary-foreground">{title}</h2>}
              {description && <p className="text-secondary-foreground/70">{description}</p>}
            </div>
          )}
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&playlist=${youtubeId}`}
              title={title || "Video"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    );
  }

  // Local video
  if (videoUrl) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container px-6">
          {(title || description) && (
            <div className="mb-8 text-center">
              {title && <h2 className="mb-2 font-display text-3xl font-bold text-secondary-foreground">{title}</h2>}
              {description && <p className="text-secondary-foreground/70">{description}</p>}
            </div>
          )}
          <div className="group relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl shadow-2xl">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              className="h-full w-full object-cover"
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              playsInline
            />
            
            {/* Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}
