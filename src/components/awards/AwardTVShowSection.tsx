import { useState } from "react";
import { Play, Youtube, Linkedin, Twitter, Instagram, Facebook, Tv, Clock, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type AwardTVShow } from "@/config/awardTVShows";

interface AwardTVShowSectionProps {
  show: AwardTVShow;
  accentColor?: string;
}

export function AwardTVShowSection({ show, accentColor = "gold" }: AwardTVShowSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const colorClasses: Record<string, { bg: string; text: string; border: string; hoverBg: string }> = {
    gold: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      hoverBg: "hover:bg-yellow-500/30",
    },
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/30",
      hoverBg: "hover:bg-purple-500/30",
    },
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      hoverBg: "hover:bg-blue-500/30",
    },
    amber: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/30",
      hoverBg: "hover:bg-amber-500/30",
    },
  };

  const colors = colorClasses[accentColor] || colorClasses.gold;

  const socialLinks = [
    { icon: Youtube, href: show.socialLinks.youtube, label: "YouTube" },
    { icon: Linkedin, href: show.socialLinks.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: show.socialLinks.twitter, label: "Twitter" },
    { icon: Instagram, href: show.socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: show.socialLinks.facebook, label: "Facebook" },
  ];

  return (
    <>
      <section className="bg-charcoal py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full ${colors.bg} ${colors.border} border px-4 py-2`}>
              <Tv className={`h-4 w-4 ${colors.text}`} />
              <span className={`text-sm font-medium ${colors.text}`}>NESA Africa TV</span>
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold text-white md:text-4xl">
              Watch: {show.showName}
            </h2>
            <p className="mx-auto max-w-2xl text-white/70">{show.description}</p>
          </div>

          <div className="mx-auto max-w-4xl">
            {/* Video Player */}
            <div
              className="group relative mb-8 aspect-video cursor-pointer overflow-hidden rounded-xl shadow-2xl"
              onClick={() => setIsPlaying(true)}
            >
              {/* Thumbnail / Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-charcoal/80">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${colors.bg} transition-transform group-hover:scale-110`}>
                    <Play className={`h-10 w-10 ${colors.text}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">{show.showName}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {show.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Film className="h-4 w-4" />
                      {show.episodes} Episodes
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {/* Features */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {show.features.map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className={`${colors.border} ${colors.text}`}
                >
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Social Links */}
            <div className="text-center">
              <p className="mb-4 text-sm text-white/60">Watch on NESA Africa TV</p>
              <div className="flex justify-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.bg} ${colors.border} border transition-colors ${colors.hoverBg}`}
                    aria-label={social.label}
                  >
                    <social.icon className={`h-5 w-5 ${colors.text}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
        <DialogContent className="max-w-4xl border-none bg-black/95 p-0">
          <div className="relative aspect-video w-full">
            <iframe
              src={`${show.videoUrl}?autoplay=1`}
              title={show.showName}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
