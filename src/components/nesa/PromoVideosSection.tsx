import { useState } from "react";
import { Play, X } from "lucide-react";
import { getYouTubeEmbedUrl, getThumbnailUrl } from "@/lib/youtube";

const PROMO_VIDEOS = [
  {
    id: "nQCXDX_X3rs",
    title: "NESA Africa Awards – Gala Highlights",
    description: "Relive the magic of the NESA-Africa Awards ceremony.",
  },
  {
    id: "aP0SskrfioI",
    title: "Meet the Judges – Season 2025",
    description: "Get to know the distinguished panel behind the awards.",
  },
];

export function PromoVideosSection() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <>
      <section className="bg-charcoal-light py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-sm font-medium text-gold mb-3">
              Featured Videos
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Watch NESA-Africa in Action
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PROMO_VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveId(v.id)}
                className="group relative rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all text-left"
              >
                <div className="aspect-video relative">
                  <img
                    src={getThumbnailUrl(v.id, "high")}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-gold/90 group-hover:bg-gold group-hover:scale-110 transition-all flex items-center justify-center shadow-lg">
                      <Play className="h-6 w-6 text-charcoal ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-charcoal">
                  <h3 className="font-display text-lg font-semibold text-white group-hover:text-gold transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-sm text-white/60 mt-1">{v.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden border border-gold/20 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveId(null)}
              className="absolute -top-10 right-0 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video bg-black">
              <iframe
                src={`${getYouTubeEmbedUrl(activeId)}?autoplay=1&rel=0`}
                title="NESA Africa Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
