import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Building2, MapPin, RotateCcw, ThumbsUp, Loader2 } from "lucide-react";

export interface NomineeCardData {
  id: string;
  name: string;
  slug: string;
  title?: string | null;
  organization?: string | null;
  photoUrl?: string | null;
  isPlatinum?: boolean;
  publicVotes?: number;
  categoryName?: string;
  subcategoryName?: string;
  region?: string;
  renominationCount?: number;
  country?: string;
}

interface NomineeCardProps {
  nominee: NomineeCardData;
  showVotes?: boolean;
  showRenominationCount?: boolean;
  variant?: "default" | "compact" | "voting";
  className?: string;
  // Voting-specific props
  hasVoted?: boolean;
  isVoting?: boolean;
  onVote?: () => void;
  showLoginToVote?: boolean;
}

// Helper to get initials
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
  hasVoted = false,
  isVoting = false,
  onVote,
  showLoginToVote = false,
}: NomineeCardProps) {
  const isCompact = variant === "compact";
  const isVotingVariant = variant === "voting";

  const cardContent = (
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
          <div className="relative mb-4 mt-2">
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

          {/* Country if available */}
          {nominee.country && !nominee.region && (
            <Badge variant="outline" className="mt-2 text-xs border-ivory/20 text-ivory/60">
              {nominee.country}
            </Badge>
          )}

          {/* Renomination Count */}
          {showRenominationCount && (nominee.renominationCount ?? 0) > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-500/80">
              <RotateCcw className="w-3 h-3" />
              <span>Renominated {nominee.renominationCount}x</span>
            </div>
          )}

          {/* Votes section - for default and voting variants */}
          {showVotes && !isCompact && (
            <div className="mt-4 pt-4 border-t border-gold/10 w-full">
              {isVotingVariant ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm">
                    <ThumbsUp className="h-4 w-4 text-gold" />
                    <span className="font-semibold text-ivory">{nominee.publicVotes ?? 0}</span>
                    <span className="text-ivory/50">votes</span>
                  </div>
                  
                  {showLoginToVote ? (
                    <Link to="/login">
                      <Button size="sm" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                        Login to Vote
                      </Button>
                    </Link>
                  ) : onVote ? (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onVote();
                      }}
                      disabled={hasVoted || isVoting}
                      className={hasVoted 
                        ? "bg-green-600 hover:bg-green-600 text-white cursor-default" 
                        : "bg-gold hover:bg-gold-dark text-charcoal"
                      }
                    >
                      {isVoting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : hasVoted ? (
                        <>✓ Voted</>
                      ) : (
                        <>Vote</>
                      )}
                    </Button>
                  ) : null}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-gold font-semibold">{nominee.publicVotes ?? 0}</span>
                  <span className="text-ivory/50">votes</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // For voting variant, don't wrap in Link (vote button handles interaction)
  if (isVotingVariant) {
    return <div className={className}>{cardContent}</div>;
  }

  return (
    <Link to={`/nominees/${nominee.slug}`} className={className}>
      {cardContent}
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
          <div className="h-4 bg-gold/10 rounded animate-pulse w-24 mb-2" />
          <div className="h-3 bg-gold/10 rounded animate-pulse w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
