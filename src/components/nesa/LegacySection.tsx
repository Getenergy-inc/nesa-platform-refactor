import { Calendar, Check, Coins, ArrowRight, Building, Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSeason } from "@/contexts/SeasonContext";
import { LEGACY_REGIONS } from "@/config/schedule";

export function LegacySection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  const ceremonyYear = currentEdition.displayYear + 1;
  const legacyEndYear = ceremonyYear + 1;
  const dateRange = `June ${ceremonyYear} – June ${legacyEndYear}`;

  const focusAreas = t("landing.legacy.focusAreas.items", { returnObjects: true }) as string[];
  const fundingChannels = t("landing.legacy.fundingChannels.items", { returnObjects: true }) as string[];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-sm font-medium mb-2">{t("landing.legacy.badge")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.legacy.title")}
          </h2>

          <div className="flex items-center gap-2 text-white/70 mb-6">
            <Calendar className="h-4 w-4 text-gold" />
            <span>{dateRange} • {t("landing.legacy.implementedVia")}</span>
          </div>

          {/* Compelling opening line */}
          <p className="text-white/80 text-lg mb-6 leading-relaxed">
            Recognition becomes real impact—Rebuild My School Africa upgrades inclusive and special needs education facilities across Africa's regions.
          </p>

          <p className="text-white/70 mb-8 leading-relaxed">
            {t("landing.legacy.description")}
          </p>

          {/* Regions */}
          <div className="flex flex-wrap gap-2 mb-8">
            {LEGACY_REGIONS.map((region) => (
              <span
                key={region}
                className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm"
              >
                {region}
              </span>
            ))}
          </div>

          {/* Focus Areas */}
          <div className="bg-charcoal-light rounded-xl p-6 border border-gold/20 mb-8">
            <p className="text-gold text-sm font-medium mb-3">{t("landing.legacy.focusAreas.title")}</p>
            <ul className="space-y-3">
              {focusAreas.map((facility) => (
                <li key={facility} className="flex items-center gap-3 text-white">
                  <Check className="h-5 w-5 text-gold flex-shrink-0" />
                  {facility}
                </li>
              ))}
            </ul>
          </div>

          {/* Funding */}
          <div className="flex items-start gap-3 bg-charcoal-light rounded-xl p-4 border border-gold/20 mb-8">
            <Coins className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-gold text-sm font-medium mb-1">{t("landing.legacy.fundingChannels.title")}</p>
              <p className="text-white/70 text-sm">
                {fundingChannels.join(" • ")}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/partners">
              <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full gap-2">
                <Building className="h-4 w-4" />
                Sponsor a School
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
                <Heart className="h-4 w-4" />
                Donate to EduAid
              </Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full gap-2">
                <Users className="h-4 w-4" />
                Partner for Legacy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
