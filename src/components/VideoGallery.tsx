import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar } from "lucide-react";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/youtube";
import type { Video } from "@/data/videos";

interface VideoCardProps {
  video: Video;
  onSelect?: (video: Video) => void;
  isActive?: boolean;
}

export function VideoCard({ video, onSelect, isActive }: VideoCardProps) {
  return (
    <Card 
      className={`cursor-pointer border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/10 transition-all ${
        isActive ? 'border-primary ring-1 ring-primary' : ''
      }`}
      onClick={() => onSelect?.(video)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <img 
            src={getThumbnailUrl(video.videoId, 'high')}
            alt={video.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
          {video.group && (
            <Badge className="absolute top-2 left-2 bg-black/70 text-white border-0">
              {video.group}
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-white line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Calendar className="h-3 w-3" />
            {video.date}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface VideoPlayerProps {
  video: Video;
  autoplay?: boolean;
}

export function VideoPlayer({ video, autoplay = false }: VideoPlayerProps) {
  const embedUrl = getEmbedUrl(video.videoId, { 
    rel: false, 
    modestbranding: true,
    autoplay 
  });

  return (
    <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

interface VideoGalleryProps {
  videos: Video[];
  columns?: 1 | 2 | 3 | 4;
  showPlayer?: boolean;
  showGroupFilter?: boolean;
}

export function VideoGallery({ 
  videos, 
  columns = 3,
  showPlayer = true,
  showGroupFilter = true
}: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const groups = Array.from(new Set(videos.map(v => v.group).filter(Boolean))) as string[];
  
  const filteredVideos = activeGroup 
    ? videos.filter(v => v.group === activeGroup)
    : videos;

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className="space-y-6">
      {/* Featured Player */}
      {showPlayer && selectedVideo && (
        <div className="space-y-4">
          <VideoPlayer video={selectedVideo} />
          <div>
            <h2 className="text-xl font-bold text-white">{selectedVideo.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {selectedVideo.date}
              </span>
              {selectedVideo.group && (
                <Badge variant="outline" className="text-white/60">
                  {selectedVideo.group}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Group Filter */}
      {showGroupFilter && groups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeGroup === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActiveGroup(null)}
          >
            All Videos
          </Badge>
          {groups.map((group) => (
            <Badge
              key={group}
              variant={activeGroup === group ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActiveGroup(group)}
            >
              {group}
            </Badge>
          ))}
        </div>
      )}

      {/* Video Grid */}
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {filteredVideos.map((video, index) => (
          <VideoCard
            key={`${video.videoId}-${index}`}
            video={video}
            onSelect={setSelectedVideo}
            isActive={selectedVideo?.videoId === video.videoId}
          />
        ))}
      </div>
    </div>
  );
}
