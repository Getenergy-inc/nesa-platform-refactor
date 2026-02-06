import rawVideos from "@/data/videos.json";
import { validateVideos } from "@/lib/validate";
import { VideoGallery } from "@/components/VideoGallery";

export default function VideosPage() {
  const videos = validateVideos(rawVideos);
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Videos</h1>
      <VideoGallery videos={videos} />
    </div>
  );
}
