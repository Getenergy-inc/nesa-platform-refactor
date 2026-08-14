import { Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { YOUTUBE_CHANNEL } from "@/lib/youtube";

interface NesaTvLinkProps {
  /** Specific YouTube video id for this profile, when the upload pipeline has published one. */
  videoId?: string | null;
  /** Raw video URL (watch/embed/youtu.be) — parsed for an id when videoId is absent. */
  videoUrl?: string | null;
  /** Optional profile name, used in the accessible label. */
  name?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
}

function parseVideoId(url?: string | null): string | null {
  if (!url) return null;
  const m =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : /^[a-zA-Z0-9_-]{11}$/.test(url) ? url : null;
}

/**
 * Branded link to NESA Africa TV.
 * Points to the profile's own feature video when one exists, otherwise to the channel.
 */
export function NesaTvLink({
  videoId,
  videoUrl,
  name,
  className,
  size = "default",
  variant = "outline",
}: NesaTvLinkProps) {
  const id = videoId || parseVideoId(videoUrl);
  const href = id
    ? `https://www.youtube.com/watch?v=${id}`
    : YOUTUBE_CHANNEL.url;
  const label = id ? "Watch the feature on NESA Africa TV" : "Watch on NESA Africa TV";

  return (
    <Button
      asChild
      size={size}
      variant={variant}
      className={cn("border-gold/40 text-gold hover:bg-gold/10", className)}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name ? `${label} — ${name}` : label}
      >
        <Youtube className="mr-2 h-4 w-4" aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}

export default NesaTvLink;
