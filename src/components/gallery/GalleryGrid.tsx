import { useState } from "react";
import type { GalleryImage } from "@/data/gallery";
import { Lightbox } from "./Lightbox";

interface Props {
  images: GalleryImage[];
}

export const GalleryGrid = ({ images }: Props) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="text-center text-white/60 py-12">
        No images in this collection yet.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setLightboxIndex(i)}
            className={`group relative overflow-hidden rounded-xl bg-charcoal/60 border border-[hsl(42_85%_52%)]/20 hover:border-[hsl(42_85%_52%)]/70 transition-all duration-500 ${
              i % 5 === 0 ? "md:row-span-2 md:col-span-2 aspect-square" : "aspect-[4/5]"
            }`}
            aria-label={`Open ${img.title}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-left">
              <p className="text-[10px] sm:text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">
                {img.year}
              </p>
              <h3 className="text-white font-serif text-sm sm:text-base leading-snug mt-0.5 line-clamp-2">
                {img.title}
              </h3>
            </div>
            <div className="pointer-events-none absolute inset-0 ring-0 ring-[hsl(42_85%_52%)]/0 group-hover:ring-2 group-hover:ring-[hsl(42_85%_52%)]/50 rounded-xl transition" />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </>
  );
};
