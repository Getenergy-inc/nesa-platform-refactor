import { videos } from "@/data/videos";
import { validateVideos } from "@/lib/validate";
import { VideoGallery } from "@/components/VideoGallery";

export default function VideosPage() {
  const validatedVideos = validateVideos(videos);
  return <VideoGallery videos={validatedVideos} />;
}
