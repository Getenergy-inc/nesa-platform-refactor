/**
 * Premium nominee card for the landing page showcase.
 * Displays profile, contribution, and Nominate / Recommend Again / Vote CTAs.
 */

import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Vote, ArrowRight } from "lucide-react";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import type { EnrichedDatabaseNominee } from "@/hooks/useNominees";
import {
  getCategoryTier,
  getSecondaryCtaHref,
  getTierStyle,
} from "@/config/nomineeCategories";

interface LandingNomineeCardProps {
  nominee: EnrichedDatabaseNominee;
  /** @deprecated Tier is now derived from the category registry. */
  isBlueGarnet?: boolean;
}

export function LandingNomineeCard({ nominee, isBlueGarnet: isBlueGarnetProp }: LandingNomineeCardProps) {
  const navigate = useNavigate();
  const isOrg = nominee.imageType === "logo";
  const tier = getCategoryTier(nominee.categorySlug);
  const tierStyle = getTierStyle(nominee.categorySlug);
  const isBlueGarnet = isBlueGarnetProp ?? tier === "blue_garnet";
  const profileHref = `/nominees/${encodeURIComponent(nominee.slug)}`;
  const secondaryHref = isBlueGarnet
    ? `/vote?nominee=${encodeURIComponent(nominee.slug)}`
    : getSecondaryCtaHref(nominee.categorySlug);

  return (
    <Card
      className={`backdrop-blur-sm transition-all duration-300 group overflow-hidden h-full flex flex-col cursor-pointer active:scale-[0.99] ${tierStyle.cardBgClass} ${tierStyle.cardBorderClass} border`}
      onClick={() => navigate(profileHref)}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        {/* Visual identity — compact on mobile, larger on desktop */}
        <div className="relative h-32 sm:h-44 overflow-hidden">
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
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
              <Badge variant="outline" className="bg-secondary/80 backdrop-blur-sm border-gold/30 text-gold text-[9px] sm:text-[10px] px-1.5 py-0">
                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                {nominee.country}
              </Badge>
            </div>
          )}

          {/* Tier badge */}
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
            <Badge className={`text-[9px] sm:text-[10px] px-1.5 py-0 border ${tierStyle.className}`}>
              {tierStyle.label}
            </Badge>
          </div>
        </div>

        {/* Content — tighter on mobile */}
        <div className="p-3 sm:p-4 flex flex-col flex-1 gap-1.5 sm:gap-2">
          <Link to={profileHref} className="group/link" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-ivory text-sm sm:text-base md:text-lg font-bold leading-tight group-hover/link:text-gold transition-colors line-clamp-2">
              {nominee.name}
            </h3>
          </Link>

          <Badge
            variant="outline"
            className="w-fit border-gold/30 text-ivory/80 text-[10px] sm:text-[11px] px-2 py-0 rounded-full bg-charcoal/40 line-clamp-1"
          >
            {nominee.categoryName}
          </Badge>

          {/* Achievement: hidden on smallest screens to keep card compact */}
          <p className="hidden sm:block text-ivory/70 text-xs leading-relaxed line-clamp-3 flex-1">
            {nominee.achievement || "Contributing to the advancement of education across Africa."}
          </p>

          <div className="pt-2 sm:pt-3 mt-auto border-t border-gold/10 flex flex-row sm:flex-col gap-2">
            {/* Primary: View Profile */}
            <Button
              asChild
              size="sm"
              className="flex-1 h-9 bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full text-xs sm:text-sm"
            >
              <Link to={profileHref}>
                View <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
            {/* Secondary quick action */}
            <Button
              asChild
              size="sm"
              variant="outline"
              onClick={(e) => e.stopPropagation()}
              className={`flex-1 h-9 rounded-full font-semibold text-xs sm:text-sm ${tierStyle.secondaryCtaClass}`}
            >
              <Link to={secondaryHref}>
                {isBlueGarnet ? (
                  <><Vote className="w-3.5 h-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Vote</span><span className="sm:hidden">Vote</span></>
                ) : (
                  <><RotateCcw className="w-3.5 h-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Recommend Again</span><span className="sm:hidden">Recommend</span></>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



