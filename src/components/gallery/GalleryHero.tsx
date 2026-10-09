import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Award } from "lucide-react";
import { getFeaturedImages } from "@/data/gallery";

export const GalleryHero = () => {
  const slides = getFeaturedImages();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-charcoal">
      {slides.map((s, i) => (
        <img
          key={s.id}
          src={s.src}
          alt={s.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            i === idx ? "opacity-100 scale-105" : "opacity-0"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-charcoal" />
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 70%, hsl(42 85% 52% / 0.25), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex h-full items-end pb-16 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-[hsl(42_85%_52%)]/40 bg-black/40 px-3 py-1 text-xs tracking-widest uppercase text-[hsl(42_85%_52%)] backdrop-blur">
            <Camera className="h-3.5 w-3.5" /> NESA Africa · Media Gallery
          </p>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-7xl text-white max-w-4xl leading-[1.05]">
            Capturing Africa's<br />
            <span className="text-[hsl(42_85%_52%)]">Education Transformation</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/80">
            Moments, leaders, stories, recognition and impact from the NESA Africa
            movement across the continent.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#collections"
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(42_85%_52%)] px-6 py-3 text-sm font-semibold text-charcoal transition hover:brightness-110"
            >
              <Camera className="h-4 w-4" /> Explore Event Moments
            </a>
            <Link
              to="/awards/winners"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Award className="h-4 w-4" /> View Honourees
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
