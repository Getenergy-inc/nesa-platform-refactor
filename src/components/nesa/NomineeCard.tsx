// Reusable Nominee Card Component
// Displays nominee info with NESA-Africa badge in top-left corner

import { Link } from "react-router-dom";
import { Award, Building2, MapPin, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface NomineeCardData {
  id: string;
  name: string;
  slug: string;
  title?: string | null;
  organization?: string | null;
  photoUrl?: string | null;
  isPlatinum?: boolean;
  publicVotes?: number;
  renominationCount?: number;
  region?: string | null;
  categoryName?: string;
  subcategoryName?: string;
}

interface NomineeCardProps {
  nominee: NomineeCardData;
  showVotes?: boolean;
  showRenominationCount?: boolean;
  variant?: "default" | "compact" | "voting";
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function NomineeCard({
  nominee,
  showVotes = true,
  showRenominationCount = false,
  variant = "default",
  className = "",
}: NomineeCardProps) {
  const isCompact = variant === "compact";

  return (
    <Link to={`/nominees/${nominee.slug}`} className={className}>
      <Card className="group relative bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 h-full overflow-hidden">
        {/* NESA-Africa Badge - Top Left */}
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-charcoal/90 backdrop-blur-sm border border-gold/30 rounded px-1.5 py-0.5 flex items-center gap-1">
            <span className="text-gold font-display text-[10px] font-bold tracking-wide">NESA</span>
          </div>
        </div>

        <CardContent className={isCompact ? "p-4" : "p-6"}>
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <Avatar className={`${isCompact ? "w-16 h-16" : "w-20 h-20"} border-2 border-gold/20 group-hover:border-gold/40 transition-colors`}>
                <AvatarImage src={nominee.photoUrl || undefined} alt={nominee.name} />
                <AvatarFallback className="bg-gold/20 text-gold text-lg font-semibold">
                  {getInitials(nominee.name)}
                </AvatarFallback>
              </Avatar>
              {nominee.isPlatinum && (
                <div className="absolute -bottom-1 -right-1 bg-gold rounded-full p-1">
                  <Award className="w-4 h-4 text-charcoal" />
                </div>
              )}
            </div>

            {/* Name & Title */}
            <h3 className={`font-semibold text-ivory group-hover:text-gold transition-colors line-clamp-1 ${isCompact ? "text-sm" : ""}`}>
              {nominee.name}
            </h3>
            {nominee.title && (
              <p className={`text-ivory/60 line-clamp-1 mt-1 ${isCompact ? "text-xs" : "text-sm"}`}>
                {nominee.title}
              </p>
            )}

            {/* Organization */}
            {nominee.organization && !isCompact && (
              <div className="flex items-center gap-1 mt-2 text-xs text-ivory/50">
                <Building2 className="w-3 h-3" />
                <span className="line-clamp-1">{nominee.organization}</span>
              </div>
            )}

            {/* Category Badge */}
            {nominee.categoryName && (
              <Badge
                variant="outline"
                className={`mt-3 border-gold/20 text-gold/80 ${isCompact ? "text-[10px]" : "text-xs"}`}
              >
                {nominee.categoryName}
              </Badge>
            )}

            {/* Region if available */}
            {nominee.region && (
              <div className="flex items-center gap-1 mt-2 text-xs text-ivory/40">
                <MapPin className="w-3 h-3" />
                <span>{nominee.region} Africa</span>
              </div>
            )}

            {/* Renomination Count */}
            {showRenominationCount && (nominee.renominationCount ?? 0) > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-500/80">
                <RotateCcw className="w-3 h-3" />
                <span>Renominated {nominee.renominationCount}x</span>
              </div>
            )}

            {/* Votes */}
            {showVotes && !isCompact && (
              <div className="mt-4 pt-4 border-t border-gold/10 w-full">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-gold font-semibold">{nominee.publicVotes ?? 0}</span>
                  <span className="text-ivory/50">votes</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Skeleton loader for nominee cards
export function NomineeCardSkeleton({ variant = "default" }: { variant?: "default" | "compact" }) {
  const isCompact = variant === "compact";
  
  return (
    <Card className="bg-charcoal-light border-gold/10">
      <CardContent className={isCompact ? "p-4" : "p-6"}>
        <div className="flex flex-col items-center text-center">
          <div className={`${isCompact ? "w-16 h-16" : "w-20 h-20"} rounded-full bg-gold/10 animate-pulse mb-4`} />
          <div className={`h-5 ${isCompact ? "w-24" : "w-32"} bg-gold/10 animate-pulse rounded mb-2`} />
          <div className={`h-4 ${isCompact ? "w-16" : "w-24"} bg-gold/10 animate-pulse rounded mb-4`} />
          {!isCompact && (
            <>
              <div className="h-3 w-full bg-gold/10 animate-pulse rounded mb-2" />
              <div className="h-3 w-3/4 bg-gold/10 animate-pulse rounded" />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default NomineeCard;
