import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Play,
  Video,
  X,
  Youtube,
  Facebook,
  Tv,
} from "lucide-react";

import { awardTVShows, type AwardTVShow } from "@/config/awardTVShows";

type Show = AwardTVShow;

const shows: Show[] = awardTVShows;

const thumbFor = (show: Show) =>
  show.thumbnailUrl ||
  `https://img.youtube.com/vi/${show.videoUrl.split("/embed/")[1]}/hqdefault.jpg`;

function ShowcaseRow({ show, onPlay }: { show: Show; onPlay: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr className="border-b border-gold/10 align-top">
        <td className="p-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-start gap-3 text-left"
            aria-expanded={open}
          >
            <ChevronDown
              className={`mt-1 h-4 w-4 shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`}
            />
            <span>
              <span className="block text-xs uppercase tracking-wider text-gold">
                {show.showcaseLabel}
              </span>
              <span className="block font-display text-base font-semibold text-white">
                {show.pairing}
              </span>
            </span>
          </button>
        </td>
        <td className="hidden p-4 text-sm text-white/60 md:table-cell">{show.description}</td>
        <td className="whitespace-nowrap p-4 text-sm text-white/70">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {show.duration}
          </span>
          <span className="ml-3">{show.episodes} eps</span>
        </td>
        <td className="p-4 text-right">
          <Button
            size="sm"
            className="rounded-full bg-gold text-charcoal hover:bg-gold/90"
            onClick={onPlay}
          >
            <Play className="mr-1.5 h-3.5 w-3.5" fill="currentColor" />
            Watch
          </Button>
        </td>
      </tr>

      {open && (
        <tr className="border-b border-gold/10 bg-charcoal-light/40">
          <td colSpan={4} className="p-4">
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <img
                src={thumbFor(show)}
                alt={show.showName}
                loading="lazy"
                className="hidden w-full rounded-lg border border-gold/10 object-cover md:block"
              />
              <div>
                <p className="mb-3 text-sm text-white/70 md:hidden">{show.description}</p>
                <ul className="space-y-3">
                  {show.segments.map((seg) => (
                    <li key={seg.id} className="rounded-lg border border-gold/10 bg-charcoal p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-display text-sm font-semibold text-white">{seg.title}</h4>
                        <Badge variant="outline" className="border-gold/30 text-xs text-gold">
                          {seg.episodes} eps
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-white/60">{seg.focus}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  {show.features.map((f) => (
                    <span key={f} className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function VideoModal({ show, onClose }: { show: Show; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-charcoal rounded-2xl border border-gold/20 overflow-hidden shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gold/10">
          <div className="flex items-center gap-3">
            <Tv className="h-6 w-6 text-gold" />
            <h3 className="font-display text-xl font-semibold text-white">
              {show.showName}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-charcoal-light hover:bg-gold/20 text-white/70 hover:text-gold transition-colors flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="aspect-video bg-black">
          <iframe
            src={`${show.videoUrl}?autoplay=1&rel=0`}
            title={show.showName}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default function Shows() {
  const [activeShow, setActiveShow] = useState<Show | null>(null);

  return (
    <>
      <Helmet>
        <title>Online Shows | NESA-Africa TV Programming</title>
        <meta
          name="description"
          content="Watch NESA-Africa TV — Showcase 1 (Platinum + Influencer Education Impact) and Showcase 2 (Icon + Gold-Blue Garnet)."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal via-charcoal/95 to-charcoal py-16 lg:py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <Link
              to="/media"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Media Hub
            </Link>
            
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center">
                  <Video className="h-5 w-5 text-charcoal" />
                </div>
                <span className="text-sm font-medium uppercase tracking-wider text-primary">
                  NESA Africa TV
                </span>
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Online <span className="text-primary">Shows</span>
              </h1>
              <p className="text-lg text-white/70 max-w-2xl">
                Two flagship showcases celebrating Africa's education enablers — Platinum with
                Influencer Education Impact, and Icon with Gold-Blue Garnet.
              </p>
            </div>
          </div>
        </section>

        {/* Showcase Table */}
        <section className="bg-charcoal py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden rounded-2xl border border-gold/20">
              <table className="w-full text-left">
                <thead className="bg-charcoal-light text-xs uppercase tracking-wider text-white/50">
                  <tr>
                    <th scope="col" className="p-4 font-medium">Showcase</th>
                    <th scope="col" className="hidden p-4 font-medium md:table-cell">What it covers</th>
                    <th scope="col" className="p-4 font-medium">Runtime</th>
                    <th scope="col" className="p-4 text-right font-medium">Play</th>
                  </tr>
                </thead>
                <tbody>
                  {shows.map((show) => (
                    <ShowcaseRow key={show.awardId} show={show} onPlay={() => setActiveShow(show)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-b from-charcoal to-charcoal-light py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-4">
              {[
                { value: "2", label: "Showcases", color: "text-gold" },
                { value: "6 hrs", label: "Total Content", color: "text-amber-400" },
                { value: "50", label: "Episodes", color: "text-blue-400" },
                { value: "5", label: "Languages", color: "text-purple-400" },
              ].map((stat) => (
                <div key={stat.label} className="group">
                  <div className={`mb-2 text-4xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Watch Live Section */}
        <section className="bg-charcoal-light py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
                <Tv className="h-4 w-4 text-gold" />
                <span className="text-sm font-medium text-gold">Live Broadcasts</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Watch Live
              </h2>
              <p className="text-white/70 mb-8">
                NESA Africa TV broadcasts on social media, partner stations, and the CAST TV box/app.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
                  asChild
                >
                  <a href="https://www.youtube.com/@Nesa.africaTV" target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-5 w-5" />
                    YouTube
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
                  asChild
                >
                  <a href="https://facebook.com/nesaafrica" target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-5 w-5" />
                    Facebook
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2"
                >
                  <Tv className="h-5 w-5" />
                  CAST TV App
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-charcoal py-16 lg:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl md:text-3xl font-bold text-white">
              Want to Be Featured?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Get nominated for NESA-Africa recognition and your story could be told on our shows.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground rounded-full px-8">
              <Link to="/nominate">Submit Nomination</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Video Modal */}
      {activeShow && (
        <VideoModal show={activeShow} onClose={() => setActiveShow(null)} />
      )}
    </>
  );
}
