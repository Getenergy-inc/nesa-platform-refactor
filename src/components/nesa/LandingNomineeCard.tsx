/**
 * Premium nominee card for the landing page showcase.
 * Displays profile, contribution, and Nominate / Re-Nominate / Vote CTAs.
 */

import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw } from "lucide-react";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";

interface LandingNomineeCardProps {
  nominee: EnrichedDatabaseNominee;
  isBlueGarnet?: boolean;
}

export function LandingNomineeCard({ nominee, isBlueGarnet = false }: LandingNomineeCardProps) {
  const navigate = useNavigate();
  const isOrg = nominee.imageType === "logo";

  return (
    <>
      <Card
        className="bg-charcoal-light/70 backdrop-blur-sm border border-gold/15 hover:border-gold/50 transition-all duration-300 group overflow-hidden h-full flex flex-col cursor-pointer"
        onClick={() => navigate(`/nominees/${encodeURIComponent(nominee.slug)}`)}
      >
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
                  <Building2 className="w-8 h-8 text-gold/40" />
                ) : (
                  <span className="text-gold/70 font-display text-xl">{getInitials(nominee.name)}</span>
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
            
            {/* Country badge */}
            {nominee.country && (
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="bg-secondary/80 backdrop-blur-sm border-gold/30 text-gold text-[10px]">
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
              <h3 className="font-display text-ivory text-base md:text-lg font-bold leading-tight group-hover/link:text-gold transition-colors line-clamp-2">
                {nominee.name}
              </h3>
            </Link>

            <Badge
              variant="outline"
              className="w-fit border-gold/30 text-ivory/80 text-[11px] px-2.5 py-0.5 rounded-full bg-charcoal/40"
            >
              {nominee.categoryName}
            </Badge>

            <p className="text-ivory/70 text-xs leading-relaxed line-clamp-3 flex-1">
              {nominee.achievement || "Contributing to the advancement of education across Africa."}
            </p>

            <div className="pt-3 mt-auto border-t border-gold/10">
              <Button
                asChild
                size="sm"
                className="w-full bg-white hover:bg-white/95 text-gold border border-gold/50 font-semibold"
              >
                <Link to={`/nominees/${encodeURIComponent(nominee.slug)}`}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Re-nominate
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}
