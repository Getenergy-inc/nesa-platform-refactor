import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Tv, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { videos, playlists } from "@/data/videos";
import { validateVideos, logValidationWarning } from "@/lib/validate";
import { VideoGallery } from "@/components/VideoGallery";
import { YOUTUBE_CHANNEL } from "@/lib/youtube";

// Validate data on load
logValidationWarning("Videos", validateVideos(videos));

export default function Videos() {
  return (
    <>
      <Helmet>
        <title>Videos | NESA Africa TV | Education For All</title>
        <meta
          name="description"
          content="Watch NESA Africa TV - documentaries, award ceremonies, interviews, and educational content celebrating education excellence across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media
            </Link>
            
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <Tv className="h-8 w-8 text-primary" />
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  NESA Africa TV
                </Badge>
              </div>
              <h1 className="mb-4 font-display text-4xl font-bold text-white md:text-5xl">
                Video <span className="text-primary">Gallery</span>
              </h1>
              <p className="text-lg text-white/70">
                Watch documentaries, award ceremonies, interviews, and educational content 
                celebrating education excellence across Africa.
              </p>
              <a
                href={YOUTUBE_CHANNEL.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
              >
                Subscribe to {YOUTUBE_CHANNEL.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Video Gallery */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <VideoGallery 
              videos={videos} 
              playlists={playlists}
              columns={3}
              showPlayer={true}
            />
          </div>
        </section>
      </div>
    </>
  );
}
