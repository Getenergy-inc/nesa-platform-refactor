import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Share2, MapPin, Calendar } from "lucide-react";
import {
  getCollectionBySlug,
  getImagesByCollection,
} from "@/data/gallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

const GalleryCollectionPage = () => {
  const { slug = "" } = useParams();
  const collection = getCollectionBySlug(slug);
  if (!collection) return <Navigate to="/gallery" replace />;
  const images = getImagesByCollection(slug);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: collection.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {}
  };

  return (
    <div className="bg-charcoal min-h-screen text-white">
      <Helmet>
        <title>{collection.title} | NESA Africa Gallery</title>
        <meta name="description" content={collection.description} />
        <meta property="og:title" content={collection.title} />
        <meta property="og:description" content={collection.description} />
        <meta property="og:image" content={collection.cover} />
      </Helmet>

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src={collection.cover}
          alt={collection.title}
          className="absolute inset-0 h-full w-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-charcoal" />
        <div className="container relative z-10 mx-auto h-full px-4 sm:px-6 flex flex-col justify-end pb-12">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-[hsl(42_85%_52%)] mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Gallery
          </Link>
          <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-[hsl(42_85%_52%)]">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {collection.year}
            </span>
            {collection.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {collection.location}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-white max-w-4xl leading-tight">
            {collection.title}
          </h1>
          <p className="mt-3 max-w-2xl text-white/80">{collection.description}</p>
          <button
            onClick={onShare}
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm text-white hover:bg-white/10 transition"
          >
            <Share2 className="h-4 w-4" /> Share this moment
          </button>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <p className="text-lg leading-relaxed text-white/85 font-serif italic">
          {collection.story}
        </p>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 sm:px-6 pb-24">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
};

export default GalleryCollectionPage;
