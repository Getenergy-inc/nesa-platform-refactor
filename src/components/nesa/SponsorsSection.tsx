import { Handshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { NESAStamp } from "./NESALogo";
import scef from "@/assets/endorsements/scef.png";
import gfawzip from "@/assets/endorsements/gfawzip.png";
import pancokrato from "@/assets/endorsements/pancokrato.png";
import getenergy from "@/assets/endorsements/getenergy.png";

// CMS-ready sponsor data structure
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "platinum" | "gold" | "silver" | "bronze";
  website?: string;
  isActive: boolean;
}

const sponsors: Sponsor[] = [
  { id: "scef", name: "Santos Creations Educational Foundation", logo: scef, tier: "platinum", isActive: true },
  { id: "gfawzip", name: "GFA Wzip", logo: gfawzip, tier: "gold", isActive: true },
  { id: "getenergy", name: "GetEnergy.ng", logo: getenergy, tier: "silver", isActive: true },
  { id: "pancokrato", name: "PancoKrato Integrated Services", logo: pancokrato, tier: "bronze", isActive: true },
];

/**
 * Compact Billboard-style Sponsors Section
 * Links to full Partners page for detailed view
 */
export function SponsorsSection() {
  const { t } = useTranslation("pages");
  const activeSponsors = sponsors.filter((s) => s.isActive);

  return (
    <section className="bg-charcoal border-y border-gold/10 py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Label & Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-gold" />
              <span className="text-gold font-display font-semibold text-lg">
                {t("landing.sponsors.title")}
              </span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gold/20" />
            <span className="hidden md:block text-white/50 text-sm">
              {t("landing.sponsors.organizationsCount", { count: activeSponsors.length })}
            </span>
          </div>

          {/* Center: Logo Display */}
          <div className="relative flex-1 max-w-2xl overflow-hidden">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-charcoal to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-charcoal to-transparent z-10" />
            
            {/* Scrolling Container */}
            <div className="flex animate-scroll-x">
              {[...activeSponsors, ...activeSponsors, ...activeSponsors].map((sponsor, index) => (
                <div
                  key={`${sponsor.id}-${index}`}
                  className="flex-shrink-0 mx-6 h-12 w-28 flex items-center justify-center bg-white/5 rounded-lg px-3 py-2 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all duration-300"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: CTA */}
          <Button
            asChild
            variant="ghost"
            className="text-gold hover:text-gold hover:bg-gold/10 gap-2 whitespace-nowrap"
          >
            <Link to="/partners">
              <NESAStamp size="xs" />
              {t("landing.sponsors.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
