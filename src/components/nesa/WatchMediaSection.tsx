import { useState } from "react";
import { Play, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { programVideos, type ProgramVideo } from "@/config/programVideos";

function VideoCard({ video, onPlay }: { video: ProgramVideo; onPlay: () => void }) {
  const thumbnailUrl = video.thumbnailUrl || 
    (video.videoType === "youtube" 
      ? `https://img.youtube.com/vi/${video.videoUrl.split('/embed/')[1]}/hqdefault.jpg`
      : undefined);

  return (
    <div 
      className="group relative bg-charcoal-light rounded-xl border border-gold/10 overflow-hidden hover:border-gold/30 transition-all duration-300 cursor-pointer"
      onClick={onPlay}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={video.programName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-charcoal-light to-charcoal flex items-center justify-center">
            <Video className="h-12 w-12 text-gold/30" />
          </div>
        )}
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-gold/90 group-hover:bg-gold group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-gold">
            <Play className="h-6 w-6 text-charcoal ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Video type badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium bg-charcoal/80 text-gold rounded-full border border-gold/20">
            {video.videoType === "youtube" ? "YouTube" : "Video"}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors">
          {video.programName}
        </h3>
      </div>
    </div>
  );
}

function VideoModal({ video, onClose }: { video: ProgramVideo; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-charcoal rounded-2xl border border-gold/20 overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold/10">
          <h3 className="font-display text-xl font-semibold text-white">
            {video.programName}
          </h3>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-charcoal-light hover:bg-gold/20 text-white/70 hover:text-gold transition-colors flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black">
          {video.videoType === "youtube" ? (
            <iframe
              src={`${video.videoUrl}?autoplay=1&rel=0`}
              title={video.programName}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={video.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function WatchMediaSection() {
  const [activeVideo, setActiveVideo] = useState<ProgramVideo | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedVideos = showAll ? programVideos : programVideos.slice(0, 4);

  return (
    <>
      <section id="watch" className="bg-charcoal py-16 md:py-20">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-4">
              <Video className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-gold">Media Hub</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Watch: NESA-Africa
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Watch the vision behind NESA Africa, past award highlights, and exclusive interviews
              with African educators shaping the future of education.
            </p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayedVideos.map((video) => (
              <VideoCard 
                key={video.programId} 
                video={video} 
                onPlay={() => setActiveVideo(video)}
              />
            ))}
          </div>

          {/* View More / View Less */}
          {programVideos.length > 4 && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold/10 rounded-full gap-2"
                onClick={() => setShowAll(!showAll)}
              >
                <Video className="h-4 w-4" />
                {showAll ? "Show Less" : `View All ${programVideos.length} Videos`}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </>
  );
}
