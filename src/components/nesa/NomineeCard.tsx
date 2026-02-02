import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Building2, MapPin, RotateCcw, ThumbsUp, Loader2 } from "lucide-react";
import { NESAStamp } from "@/components/nesa/NESALogo";
import { type NomineeImageType, isOrganization } from "@/lib/nesaData";
import { NomineeActions, type NomineeActionsData } from "@/components/nominees";

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
  /** Whether this is a person photo or organization logo */
  imageType?: NomineeImageType;
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
  // Action buttons
  showActions?: boolean;
  onVoteSuccess?: () => void;
  onRenominateSuccess?: () => void;
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

// Determine if nominee is an organization based on imageType or name heuristic
function getEffectiveImageType(nominee: NomineeCardData): NomineeImageType {
  if (nominee.imageType) return nominee.imageType;
  return isOrganization(nominee.name) ? "logo" : "photo";
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
  showActions = false,
  onVoteSuccess,
  onRenominateSuccess,
}: NomineeCardProps) {
  const isCompact = variant === "compact";
  const isVotingVariant = variant === "voting";
  const imageType = getEffectiveImageType(nominee);
  const isLogo = imageType === "logo";
  
  // Generate accessible alt text
  const altText = isLogo ? `${nominee.name} logo` : `${nominee.name} photo`;

  const cardContent = (
    <Card className="group relative bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all duration-300 hover:shadow-lg hover:shadow-gold/5 h-full overflow-hidden">
      {/* NESA-Africa Stamp - Top Left */}
      <div className="absolute top-2 left-2 z-10">
        <NESAStamp size="sm" />
      </div>

      <CardContent className={isCompact ? "p-4" : "p-6"}>
        <div className="flex flex-col items-center text-center">
          {/* Avatar / Logo */}
          <div className="relative mb-4 mt-2">
            <div 
              className={`${isCompact ? "w-16 h-16" : "w-20 h-20"} rounded-full border-2 border-gold/20 group-hover:border-gold/40 transition-colors overflow-hidden flex items-center justify-center ${isLogo ? "bg-white/90 p-2" : "bg-gold/20"}`}
            >
              {nominee.photoUrl ? (
                <img 
                  src={nominee.photoUrl} 
                  alt={altText}
                  className={`${isLogo ? "object-contain max-h-full max-w-full" : "object-cover w-full h-full"}`}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    // Show fallback
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`${nominee.photoUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full text-gold text-lg font-semibold`}
              >
                {getInitials(nominee.name)}
              </div>
            </div>
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
                        ? "bg-emerald-600 hover:bg-emerald-600 text-white cursor-default" 
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

          {/* Action Buttons - Vote & Renominate */}
          {showActions && !isCompact && (
            <div className="mt-4 pt-3 border-t border-gold/10 w-full">
              <NomineeActions
                nominee={{
                  nomineeId: nominee.id,
                  nomineeSlug: nominee.slug,
                  nomineeName: nominee.name,
                  awardTitle: nominee.categoryName,
                  subcategoryTitle: nominee.subcategoryName,
                  groupName: nominee.region ? `${nominee.region} Africa` : undefined,
                  country: nominee.country,
                  renominationCount: nominee.renominationCount,
                }}
                variant="compact"
                onVoteSuccess={onVoteSuccess}
                onRenominateSuccess={onRenominateSuccess}
              />
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
    <Link to={`/nominees/${encodeURIComponent(nominee.slug)}`} className={className}>
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
