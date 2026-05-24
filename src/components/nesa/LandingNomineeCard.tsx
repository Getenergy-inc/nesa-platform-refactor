/**
 * Premium nominee card for the landing page showcase.
 * Displays profile, contribution, and Nominate / Re-Nominate / Vote CTAs.
 */

import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Vote, ArrowRight } from "lucide-react";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";
import { getCategoryTier, getSecondaryCtaHref } from "@/config/nomineeCategories";

interface LandingNomineeCardProps {
  nominee: EnrichedDatabaseNominee;
  isBlueGarnet?: boolean;
}

export function LandingNomineeCard({ nominee, isBlueGarnet: isBlueGarnetProp }: LandingNomineeCardProps) {
  const navigate = useNavigate();
  const isOrg = nominee.imageType === "logo";
  // Derive Blue Garnet from category registry, allow prop override.
  const isBlueGarnet = isBlueGarnetProp ?? getCategoryTier(nominee.categorySlug) === "blue_garnet";
  const profileHref = `/nominees/${encodeURIComponent(nominee.slug)}`;
  const secondaryHref = isBlueGarnet
    ? `/vote?nominee=${encodeURIComponent(nominee.slug)}`
    : getSecondaryCtaHref(nominee.categorySlug);


  return (
    <>
      <Card
        className="bg-charcoal-light/70 backdrop-blur-sm border border-gold/15 hover:border-gold/50 transition-all duration-300 group overflow-hidden h-full flex flex-col cursor-pointer"
        onClick={() => navigate(`/nominees/${encodeURIComponent(nominee.slug)}`)}
      >
        <CardContent className="p-0 flex flex-col flex-1">
          {/* Visual identity */}
          <div className="relative h-40 sm:h-44 overflow-hidden">
            <NomineeAvatar
              name={nominee.name}
              src={nominee.photoUrl}
              kind={isOrg ? "organization" : "individual"}
              shape="square"
              interactive
              context={nominee.country}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-secondary via-secondary/30 to-transparent" />
            
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

            <div className="pt-3 mt-auto border-t border-gold/10 flex flex-col gap-2">
              {/* Primary: View Profile */}
              <Button
                asChild
                size="sm"
                className="w-full bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full"
              >
                <Link to={profileHref}>
                  View Profile <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
              {/* Secondary: Vote (Blue Garnet) or Re-nominate (all others) */}
              <Button
                asChild
                size="sm"
                variant="outline"
                onClick={(e) => e.stopPropagation()}
                className={`w-full rounded-full font-semibold ${
                  isBlueGarnet
                    ? "border-blue-300/50 text-blue-100 hover:bg-blue-400/10"
                    : "border-gold/40 text-gold hover:bg-gold/10"
                }`}
              >
                <Link to={secondaryHref}>
                  {isBlueGarnet ? (
                    <><Vote className="w-4 h-4 mr-2" /> Vote</>
                  ) : (
                    <><RotateCcw className="w-4 h-4 mr-2" /> Re-nominate</>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}

