import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Award,
  Clock,
  Medal,
  Play,
  Star,
  Trophy,
  Video,
  X,
  Youtube,
  Facebook,
  Tv,
} from "lucide-react";

interface Show {
  id: string;
  title: string;
  description: string;
  duration: string;
  episodes: number;
  icon: React.ElementType;
  color: string;
  features: string[];
  youtubeUrl: string;
  thumbnailUrl?: string;
}

const shows: Show[] = [
  {
    id: "platinum",
    title: "The Platinum Show",
    description: "Celebrating Platinum Certificate recipients and their contributions to education across Africa.",
    duration: "3 hours",
    episodes: 12,
    icon: Medal,
    color: "amber",
    features: ["NRC-verified nominees", "Impact stories", "Certificate ceremonies"],
    youtubeUrl: "https://www.youtube.com/embed/nQCXDX_X3rs",
  },
  {
    id: "icon",
    title: "The Icon Show",
    description: "Profiles of Africa Education Icons — lifetime achievers who shaped the continent's education landscape.",
    duration: "3 hours",
    episodes: 9,
    icon: Star,
    color: "blue",
    features: ["Lifetime achievements", "Legacy interviews", "Documentary segments"],
    youtubeUrl: "https://www.youtube.com/embed/aP0SskrfioI",
  },
  {
    id: "gold",
    title: "The Gold Show",
    description: "Public voting updates, regional competitions, and Gold Certificate winner announcements.",
    duration: "3 hours",
    episodes: 15,
    icon: Award,
    color: "yellow",
    features: ["Live voting updates", "Regional spotlights", "Winner announcements"],
    youtubeUrl: "https://www.youtube.com/embed/DDREAU_bmRk",
  },
  {
    id: "blue-garnet",
    title: "The Blue Garnet Show",
    description: "Behind the scenes of the highest honour — jury deliberations, finalist profiles, and Gala previews.",
    duration: "3 hours",
    episodes: 6,
    icon: Trophy,
    color: "purple",
    features: ["Finalist profiles", "Jury insights", "Gala countdown"],
    youtubeUrl: "https://www.youtube.com/embed/Hdu_qlFLfrQ",
  },
];

const colorClasses = {
  amber: {
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    border: "border-amber-500/30 hover:border-amber-500/60",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    icon: "bg-gradient-to-br from-amber-400 to-amber-600",
  },
  blue: {
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    border: "border-blue-500/30 hover:border-blue-500/60",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    icon: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  yellow: {
    gradient: "from-yellow-500/20 via-yellow-500/10 to-transparent",
    border: "border-yellow-500/30 hover:border-yellow-500/60",
    text: "text-yellow-400",
    bg: "bg-yellow-500/10",
    icon: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  },
  purple: {
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
    border: "border-purple-500/30 hover:border-purple-500/60",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    icon: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
};

function ShowCard({ show, onPlay }: { show: Show; onPlay: () => void }) {
  const Icon = show.icon;
  const colors = colorClasses[show.color as keyof typeof colorClasses];
  const thumbnailUrl = show.thumbnailUrl || 
    `https://img.youtube.com/vi/${show.youtubeUrl.split('/embed/')[1]}/hqdefault.jpg`;

  return (
    <div 
      className={`group relative rounded-2xl border bg-gradient-to-br ${colors.gradient} ${colors.border} overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}
      onClick={onPlay}
    >
      {/* Thumbnail */}
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={show.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-charcoal/50 group-hover:bg-charcoal/30 transition-colors duration-300 flex items-center justify-center">
          <div className={`h-16 w-16 rounded-full ${colors.icon} group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-lg`}>
            <Play className="h-7 w-7 text-white ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className={`h-10 w-10 rounded-xl ${colors.icon} flex items-center justify-center shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-charcoal/80 border-white/20 text-white/90 text-xs">
              <Clock className="mr-1 h-3 w-3" />
              {show.duration}
            </Badge>
            <Badge variant="outline" className="bg-charcoal/80 border-white/20 text-white/90 text-xs">
              {show.episodes} eps
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className={`font-display text-xl font-bold text-white mb-2 group-hover:${colors.text} transition-colors`}>
          {show.title}
        </h3>
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {show.description}
        </p>
        
        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {show.features.map((feature) => (
            <span
              key={feature}
              className={`rounded-full ${colors.bg} px-3 py-1 text-xs ${colors.text}`}
            >
              {feature}
            </span>
          ))}
        </div>

        <Button 
          className={`w-full ${colors.icon} text-white border-0 hover:opacity-90`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
        >
          <Play className="mr-2 h-4 w-4" />
          Watch Episodes
        </Button>
      </div>
    </div>
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
            <show.icon className={`h-6 w-6 ${colorClasses[show.color as keyof typeof colorClasses].text}`} />
            <h3 className="font-display text-xl font-semibold text-white">
              {show.title}
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
            src={`${show.youtubeUrl}?autoplay=1&rel=0`}
            title={show.title}
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
          content="Watch NESA-Africa's flagship TV shows — The Platinum Show, Icon Show, Gold Show, and Blue Garnet Show. 3 hours each."
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
                Four flagship TV shows celebrating Africa's education champions — each a 3-hour
                deep dive into recognition, impact, and transformation.
              </p>
            </div>
          </div>
        </section>

        {/* Shows Grid */}
        <section className="bg-charcoal py-12 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
              {shows.map((show) => (
                <ShowCard 
                  key={show.id} 
                  show={show} 
                  onPlay={() => setActiveShow(show)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-b from-charcoal to-charcoal-light py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-4">
              {[
                { value: "4", label: "Shows", color: "text-gold" },
                { value: "12 hrs", label: "Total Content", color: "text-amber-400" },
                { value: "42", label: "Episodes", color: "text-blue-400" },
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
