import { Facebook, Instagram, Linkedin, Twitter, Youtube, type LucideIcon } from "lucide-react";
import { SOCIAL_LINKS, type SocialPlatform } from "@/config/socialLinks";
import { cn } from "@/lib/utils";

const ICONS: Record<SocialPlatform, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

interface FollowLinksProps {
  platforms?: readonly SocialPlatform[];
  className?: string;
  linkClassName?: string;
  showLabels?: boolean;
}

/** Shared Follow links only; share/intent URLs use their own components. */
export function FollowLinks({ platforms, className, linkClassName, showLabels = false }: FollowLinksProps) {
  const links = platforms ? SOCIAL_LINKS.filter((link) => platforms.includes(link.platform)) : SOCIAL_LINKS;
  return (
    <div className={cn("flex items-center gap-2", className)} aria-label="Follow NESA-Africa">
      {links.map((link) => {
        const Icon = ICONS[link.platform];
        return (
          <a
            key={link.platform}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow NESA-Africa on ${link.label}`}
            className={cn(
              "inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-gold/30 hover:bg-gold/10 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
              showLabels && "px-4",
              linkClassName,
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {showLabels && <span>{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
}
