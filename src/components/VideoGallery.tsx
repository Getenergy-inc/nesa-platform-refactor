import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Eye, Calendar } from "lucide-react";
import { getEmbedUrl, getThumbnailUrl } from "@/lib/youtube";
import type { Video, VideoPlaylist } from "@/data/videos";

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
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </div>
          )}
          {video.featured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-white line-clamp-2">{video.title}</h3>
          {video.description && (
            <p className="text-sm text-white/60 line-clamp-2">{video.description}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-white/50">
            {video.views && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {video.views}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {video.date}
            </span>
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
  playlists?: VideoPlaylist[];
  columns?: 1 | 2 | 3 | 4;
  showPlayer?: boolean;
}

export function VideoGallery({ 
  videos, 
  playlists, 
  columns = 3,
  showPlayer = true 
}: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    videos.find(v => v.featured) || videos[0] || null
  );
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null);

  const filteredVideos = activePlaylist 
    ? videos.filter(v => v.playlist === activePlaylist)
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
            {selectedVideo.description && (
              <p className="text-white/60 mt-1">{selectedVideo.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
              {selectedVideo.views && (
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {selectedVideo.views}
                </span>
              )}
              {selectedVideo.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedVideo.duration}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {selectedVideo.date}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Playlist Tabs */}
      {playlists && playlists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activePlaylist === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setActivePlaylist(null)}
          >
            All Videos
          </Badge>
          {playlists.map((playlist) => (
            <Badge
              key={playlist.id}
              variant={activePlaylist === playlist.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setActivePlaylist(playlist.id)}
            >
              {playlist.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Video Grid */}
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onSelect={setSelectedVideo}
            isActive={selectedVideo?.id === video.id}
          />
        ))}
      </div>
    </div>
  );
}
