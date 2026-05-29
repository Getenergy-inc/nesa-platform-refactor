import { Link } from "react-router-dom";
import { Camera, ArrowRight } from "lucide-react";
import { getFeaturedImages } from "@/data/gallery";

export const HomepageGalleryTeaser = () => {
  const images = getFeaturedImages().slice(0, 4);
  if (images.length === 0) return null;

  return (
    <section className="bg-charcoal py-16 sm:py-20 border-t border-[hsl(42_85%_52%)]/15">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">
              <Camera className="h-3.5 w-3.5" />
              <span>The Road to the Blue Garnet · 2025 → 2026</span>
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-white">
              Moments that built the movement
            </h2>
            <p className="mt-2 text-white/70 max-w-xl">
              Highlights from the NESA-Africa 2025 pre-opening — the stages, stories
              and standing ovations now carrying the continent toward the Blue Garnet
              Awards Gala on 22 October 2026 in Lagos.
            </p>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(42_85%_52%)] px-5 py-2.5 text-sm font-semibold text-charcoal hover:brightness-110 transition"
          >
            View Gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, i) => (
            <Link
              key={img.id}
              to={`/gallery/${img.collection}`}
              className={`group relative overflow-hidden rounded-xl border border-[hsl(42_85%_52%)]/20 hover:border-[hsl(42_85%_52%)]/60 transition ${
                i === 0 ? "md:col-span-2 md:row-span-2 aspect-square" : "aspect-[4/5]"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <p className="text-[10px] tracking-widest uppercase text-[hsl(42_85%_52%)]">
                  {img.year}
                </p>
                <h3 className="text-white font-serif text-sm sm:text-base leading-snug line-clamp-2">
                  {img.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
