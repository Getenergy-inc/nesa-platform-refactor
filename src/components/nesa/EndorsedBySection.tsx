import { Award, Building2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { NESAStamp } from "./NESALogo";

// Import endorsement logos
import faweKenya from "@/assets/endorsements/fawe-kenya.jpeg";
import csacefa from "@/assets/endorsements/csacefa.jpeg";
import sponsor1 from "@/assets/sponsors/sponsor-1.png";
import sponsor2 from "@/assets/sponsors/sponsor-2.png";
import sponsor3 from "@/assets/sponsors/sponsor-3.png";
import sponsor4 from "@/assets/sponsors/sponsor-4.png";

// CMS-ready endorsement data structure
export interface Endorsement {
  id: string;
  name: string;
  logo: string;
  type: "organization" | "institution" | "government" | "ngo";
  country?: string;
  website?: string;
  endorsementDate?: string;
  isActive: boolean;
}

// Current endorsements - ready for CMS integration
const endorsements: Endorsement[] = [
  {
    id: "fawe-kenya",
    name: "Forum for African Women Educationalists - Kenya Chapter",
    logo: faweKenya,
    type: "ngo",
    country: "Kenya",
    isActive: true,
  },
  {
    id: "csacefa",
    name: "Civil Society Action Coalition on Education for All",
    logo: csacefa,
    type: "ngo",
    country: "Nigeria",
    isActive: true,
  },
  {
    id: "partner-1",
    name: "Education Partner 1",
    logo: sponsor1,
    type: "organization",
    isActive: true,
  },
  {
    id: "partner-2",
    name: "Education Partner 2",
    logo: sponsor2,
    type: "institution",
    isActive: true,
  },
  {
    id: "partner-3",
    name: "Education Partner 3",
    logo: sponsor3,
    type: "organization",
    isActive: true,
  },
  {
    id: "partner-4",
    name: "Education Partner 4",
    logo: sponsor4,
    type: "ngo",
    isActive: true,
  },
];

export function EndorsedBySection() {
  const { t } = useTranslation("pages");
  const activeEndorsements = endorsements.filter((e) => e.isActive);

  return (
    <section className="bg-gradient-to-b from-charcoal via-charcoal-light/50 to-charcoal py-16 md:py-24 overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">{t("landing.endorsedBy.trustedBy")}</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("landing.endorsedBy.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            {t("landing.endorsedBy.description")}
          </p>
        </div>

        {/* Endorsements Billboard Grid */}
        <div className="relative max-w-5xl mx-auto">
          {/* Decorative frame */}
          <div className="absolute inset-0 border border-gold/20 rounded-2xl -m-4 pointer-events-none" />
          <div className="absolute inset-0 border border-gold/10 rounded-3xl -m-8 pointer-events-none" />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {activeEndorsements.map((endorsement) => (
              <div
                key={endorsement.id}
                className="group relative bg-white/5 backdrop-blur-sm border border-gold/20 rounded-xl p-4 flex flex-col items-center justify-center aspect-square hover:bg-white/10 hover:border-gold/40 transition-all duration-300 hover:scale-105"
              >
                {/* Logo */}
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img
                    src={endorsement.logo}
                    alt={endorsement.name}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
                
                {/* Hover overlay with name */}
                <div className="absolute inset-0 bg-charcoal/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-gold font-semibold text-xs leading-tight mb-1">
                    {endorsement.name}
                  </span>
                  {endorsement.country && (
                    <span className="text-white/60 text-[10px] flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {endorsement.country}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats & CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold">{activeEndorsements.length}+</div>
              <div className="text-white/60 text-sm">{t("landing.endorsedBy.stats.organizations")}</div>
            </div>
            <div className="h-8 w-px bg-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold">15+</div>
              <div className="text-white/60 text-sm">{t("landing.endorsedBy.stats.countries")}</div>
            </div>
            <div className="h-8 w-px bg-gold/20" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-gold">1M+</div>
              <div className="text-white/60 text-sm">{t("landing.endorsedBy.stats.reach")}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10 gap-2"
            >
              <Link to="/partners">
                <NESAStamp size="xs" />
                {t("landing.endorsedBy.viewAllPartners")}
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-gold text-charcoal hover:bg-gold-light gap-2"
            >
              <Link to="/get-involved/endorse-nesa-africa">
                {t("landing.endorsedBy.becomeEndorser")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
