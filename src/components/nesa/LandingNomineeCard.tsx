/**
 * Premium nominee card for the landing page showcase.
 * Displays profile, contribution, and Nominate / Re-Nominate / Vote CTAs.
 */

import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Trophy, RotateCcw, ThumbsUp, ArrowRight } from "lucide-react";
import { useState } from "react";
import { VoteModal } from "@/components/nominees/VoteModal";
import { RenominateModal } from "@/components/nominees/RenominateModal";
import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";

interface LandingNomineeCardProps {
  nominee: EnrichedDatabaseNominee;
  isBlueGarnet?: boolean;
}

function getInitials(name: string): string {
  return name.split(/[\s-]+/).filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

export function LandingNomineeCard({ nominee, isBlueGarnet = false }: LandingNomineeCardProps) {
  const navigate = useNavigate();
  const [voteOpen, setVoteOpen] = useState(false);
  const [renomOpen, setRenomOpen] = useState(false);
  const isOrg = nominee.imageType === "logo";

  return (
    <>
      <Card className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:border-primary/40 transition-all duration-300 group overflow-hidden h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-1">
          {/* Image */}
          <div className="relative h-40 sm:h-44 bg-secondary/30 overflow-hidden flex items-center justify-center">
            {nominee.photoUrl && nominee.photoUrl !== "/images/placeholder.svg" ? (
              <img
                src={nominee.photoUrl}
                alt={nominee.name}
                className={`w-full h-full ${isOrg ? "object-contain p-4" : "object-cover"} group-hover:scale-105 transition-transform duration-500`}
                loading="lazy"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                {isOrg ? (
                  <Building2 className="w-8 h-8 text-primary/40" />
                ) : (
                  <span className="text-primary/60 font-display text-xl">{getInitials(nominee.name)}</span>
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
            
            {/* Country badge */}
            {nominee.country && (
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-secondary/80 backdrop-blur-sm border-primary/20 text-primary text-[10px]">
                  <MapPin className="w-2.5 h-2.5 mr-0.5" />
                  {nominee.country}
                </Badge>
              </div>
            )}

            {/* Blue Garnet indicator */}
            {isBlueGarnet && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-blue-600/90 text-white text-[10px] border-0">
                  Blue Garnet
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 gap-2">
            <Link to={`/nominees/${encodeURIComponent(nominee.slug)}`} className="group/link">
              <h3 className="font-display text-foreground text-sm font-semibold leading-tight group-hover/link:text-primary transition-colors line-clamp-2">
                {nominee.name}
              </h3>
            </Link>

            <Badge variant="outline" className="w-fit border-primary/15 text-muted-foreground text-[10px] px-1.5 py-0">
              {nominee.categoryName}
            </Badge>

            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 flex-1">
              {nominee.achievement || "Contributing to the advancement of education across Africa."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-2 mt-auto border-t border-border/30">
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/nominate?nominee=${encodeURIComponent(nominee.slug)}`);
                }}
              >
                <Trophy className="w-3 h-3" />
                Nominate
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-xs border-primary/30 text-primary hover:bg-primary/10 font-medium gap-1.5 flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  setRenomOpen(true);
                }}
              >
                <RotateCcw className="w-3 h-3" />
                Re-Nominate
              </Button>

              {isBlueGarnet && (
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium gap-1.5 w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    setVoteOpen(true);
                  }}
                >
                  <ThumbsUp className="w-3 h-3" />
                  Vote
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <VoteModal
        open={voteOpen}
        onOpenChange={setVoteOpen}
        nomineeId={nominee.id}
        nomineeName={nominee.name}
        nomineeSlug={nominee.slug}
        awardTitle={nominee.categoryName}
        subcategoryTitle={nominee.subcategoryName}
      />
      <RenominateModal
        open={renomOpen}
        onOpenChange={setRenomOpen}
        nomineeId={nominee.id}
        nomineeName={nominee.name}
        nomineeSlug={nominee.slug}
        awardTitle={nominee.categoryName}
        subcategoryTitle={nominee.subcategoryName}
      />
    </>
  );
}
