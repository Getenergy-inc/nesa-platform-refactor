// Award Hero Section Component
// Unified hero design for all award tier pages matching SCEF reference

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AwardHeroProps {
  // Content
  seasonLabel?: string;
  title: string;
  titleAccent: string;
  description: string;
  features?: string[];
  
  // Actions
  primaryAction: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    href?: string;
  };
  
  // Styling
  variant: "platinum" | "gold" | "blue-garnet" | "icon";
  featureBadges?: Array<{
    label: string;
    icon?: LucideIcon;
  }>;
}

const variantStyles = {
  platinum: {
    gradient: "bg-gradient-to-b from-slate-700 via-slate-800 to-charcoal",
    accent: "text-slate-300",
    badgeBg: "bg-slate-600/40",
    badgeText: "text-slate-200",
    featureText: "text-slate-300",
    primaryBtn: "bg-charcoal text-white hover:bg-charcoal/90",
    secondaryBtn: "bg-white text-charcoal hover:bg-white/90",
  },
  gold: {
    gradient: "bg-gradient-to-b from-amber-600 via-amber-700 to-charcoal",
    accent: "text-amber-300",
    badgeBg: "bg-charcoal/40",
    badgeText: "text-white",
    featureText: "text-amber-200",
    primaryBtn: "bg-white text-charcoal hover:bg-white/90",
    secondaryBtn: "bg-charcoal text-white hover:bg-charcoal/90",
  },
  "blue-garnet": {
    gradient: "bg-gradient-to-b from-blue-900 via-blue-950 to-charcoal",
    accent: "text-blue-400",
    badgeBg: "bg-charcoal/40",
    badgeText: "text-white",
    featureText: "text-blue-300",
    primaryBtn: "bg-gold text-charcoal hover:bg-gold-dark",
    secondaryBtn: "bg-charcoal text-white hover:bg-charcoal/90",
  },
  icon: {
    gradient: "bg-gradient-to-b from-blue-800 via-blue-900 to-charcoal",
    accent: "text-gold",
    badgeBg: "bg-charcoal/40",
    badgeText: "text-white",
    featureText: "text-gold",
    primaryBtn: "bg-gold text-charcoal hover:bg-gold-dark",
    secondaryBtn: "bg-charcoal text-white hover:bg-charcoal/90",
  },
};

export function AwardHeroSection({
  seasonLabel = "NESA-Africa 2025 Awards",
  title,
  titleAccent,
  description,
  features,
  primaryAction,
  secondaryAction,
  variant,
  featureBadges,
}: AwardHeroProps) {
  const styles = variantStyles[variant];
  const PrimaryIcon = primaryAction.icon || Award;

  return (
    <section className={cn("relative py-24 lg:py-32", styles.gradient)}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Season Badge */}
          <Badge
            className={cn(
              "mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
              styles.badgeBg,
              styles.badgeText
            )}
          >
            <Award className="h-4 w-4" />
            {seasonLabel}
          </Badge>

          {/* Title */}
          <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {title} <span className={styles.accent}>{titleAccent}</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-6 max-w-2xl text-lg text-white/80 md:text-xl">
            {description}
          </p>

          {/* Features line */}
          {features && features.length > 0 && (
            <p className={cn("mb-8 text-base font-medium", styles.featureText)}>
              {features.join(" • ")}
            </p>
          )}

          {/* Feature Badges */}
          {featureBadges && featureBadges.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              {featureBadges.map((badge) => (
                <Badge
                  key={badge.label}
                  variant="outline"
                  className="gap-2 border-white/30 bg-white/10 px-4 py-2 text-sm text-white"
                >
                  {badge.icon && <badge.icon className="h-4 w-4" />}
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className={cn("gap-2", styles.primaryBtn)}>
              <Link to={primaryAction.href}>
                <PrimaryIcon className="h-5 w-5" />
                {primaryAction.label}
              </Link>
            </Button>
            {secondaryAction && (
              <Button asChild size="lg" className={cn("gap-2", styles.secondaryBtn)}>
                <Link to={secondaryAction.href || "#"}>
                  <Calendar className="h-5 w-5" />
                  {secondaryAction.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AwardHeroSection;
