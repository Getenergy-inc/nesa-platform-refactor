import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/data/gallery";

interface LightboxProps {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export const Lightbox = ({ images, index, onClose, onIndexChange }: LightboxProps) => {
  const next = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [index, images.length, onIndexChange],
  );
  const prev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [next, prev, onClose]);

  const img = images[index];
  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={img.alt}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        onClick={prev}
        className="absolute left-2 sm:left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 sm:p-3 text-white transition hover:bg-white/20"
        aria-label="Previous"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 sm:p-3 text-white transition hover:bg-white/20"
        aria-label="Next"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-12">
        <img
          src={img.src}
          alt={img.alt}
          className="max-h-full max-w-full object-contain shadow-2xl rounded-lg animate-scale-in"
        />
      </div>

      <div className="px-6 pb-6 pt-2 text-center text-white">
        <h3 className="font-serif text-lg sm:text-xl">{img.title}</h3>
        {img.caption && (
          <p className="mt-1 text-sm text-white/70 max-w-2xl mx-auto">
            {img.caption}
          </p>
        )}
        <p className="mt-2 text-xs text-[hsl(42_85%_52%)]/80 tracking-widest uppercase">
          {img.year} · {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};
