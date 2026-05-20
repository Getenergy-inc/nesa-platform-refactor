import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, Youtube, Linkedin } from "lucide-react";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import {
  galleryImages,
  galleryCollections,
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from "@/data/gallery";

const GalleryLanding = () => {
  const [active, setActive] = useState<GalleryCategory | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return galleryImages.filter((img) => {
      if (active !== "all" && img.category !== active) return false;
      if (!q) return true;
      return (
        img.title.toLowerCase().includes(q) ||
        img.caption?.toLowerCase().includes(q) ||
        img.alt.toLowerCase().includes(q)
      );
    });
  }, [active, query]);

  return (
    <div className="bg-charcoal min-h-screen text-white">
      <Helmet>
        <title>Media Gallery | NESA Africa — Moments, Honourees & Impact</title>
        <meta
          name="description"
          content="Cinematic gallery of NESA Africa award ceremonies, honourees, education leaders, gala moments and continental impact stories."
        />
        <meta property="og:title" content="NESA Africa Media Gallery" />
        <meta
          property="og:description"
          content="A living visual archive of Africa's education transformation movement."
        />
      </Helmet>

      <GalleryHero />

      {/* Collections */}
      <section id="collections" className="container mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">
              Featured collections
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl mt-1">Event Stories</h2>
          </div>
          <Link
            to="/media"
            className="text-sm text-white/70 hover:text-[hsl(42_85%_52%)] transition"
          >
            Browse media hub →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {galleryCollections.map((c) => (
            <Link
              key={c.slug}
              to={`/gallery/${c.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-[hsl(42_85%_52%)]/20 hover:border-[hsl(42_85%_52%)]/60 transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={c.cover}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">
                  {c.year} {c.location ? `· ${c.location}` : ""}
                </p>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm text-white/75 line-clamp-2 max-w-xl">
                  {c.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Filter + Search */}
      <section className="container mx-auto px-4 sm:px-6 pb-6">
        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search moments, honourees, stories..."
              className="w-full rounded-full bg-white/5 border border-white/10 focus:border-[hsl(42_85%_52%)]/60 outline-none pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {[{ id: "all" as const, label: "All Moments" }, ...GALLERY_CATEGORIES].map(
              (c) => {
                const isActive = active === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActive(c.id as GalleryCategory | "all")}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs sm:text-sm border transition ${
                      isActive
                        ? "bg-[hsl(42_85%_52%)] text-charcoal border-[hsl(42_85%_52%)]"
                        : "bg-white/5 text-white/70 border-white/10 hover:border-[hsl(42_85%_52%)]/40"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 sm:px-6 pb-20">
        <GalleryGrid images={filtered} />
      </section>

      {/* The NESA Africa Story */}
      <section className="container mx-auto px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-2xl border border-[hsl(42_85%_52%)]/30 bg-gradient-to-br from-[hsl(42_85%_52%)]/10 via-charcoal to-black">
          <div className="grid lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 relative aspect-video lg:aspect-auto bg-black">
              <video
                src="/media/nesa-africa-story.mp4"
                controls
                playsInline
                preload="metadata"
                poster="/images/logo.svg"
                className="h-full w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center">
              <p className="text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">
                Documentary
              </p>
              <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white">
                The NESA Africa Story
              </h3>
              <p className="mt-3 text-sm text-white/75">
                A cinematic chronicle of the continent's education transformation —
                from nominee journeys to honouree stages, captured on the New
                Education Standard Award Africa platform.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="https://www.youtube.com/@NESAAfricaTV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[hsl(0_72%_51%)] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Youtube className="h-4 w-4" /> NESA Africa TV
                </a>
                <a
                  href="https://www.linkedin.com/company/nesa-africa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[hsl(201_100%_35%)] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Linkedin className="h-4 w-4" /> Follow on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryLanding;
