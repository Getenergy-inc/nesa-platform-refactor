import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";
import { WEBINAR_THEMES } from "@/config/schedule";

export function Phase1Section() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  const ceremonyYear = currentEdition.displayYear + 1;
  const dateRange = `14 October ${currentEdition.displayYear} – June ${ceremonyYear}`;

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold text-sm font-medium mb-2">{t("landing.phase1.badge")}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.phase1.title")}
          </h2>
          
          <div className="flex items-center gap-2 text-white/70 mb-6">
            <Calendar className="h-4 w-4 text-gold" />
            <span>{dateRange}</span>
          </div>

          <p className="text-white/70 mb-8 leading-relaxed">
            {t("landing.phase1.description")}
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {WEBINAR_THEMES.map((item) => (
              <div
                key={item.id}
                className="bg-charcoal-light rounded-lg px-4 py-3 border border-gold/20 text-white text-sm"
              >
                {item.theme}
              </div>
            ))}
          </div>

          <div className="bg-charcoal-light rounded-xl p-4 border border-gold/20">
            <p className="text-white/70 text-sm text-center">
              <span className="text-gold">{t("landing.phase1.frequency")}:</span> {t("landing.phase1.frequencyValue")} •{" "}
              <span className="text-gold">{t("landing.phase1.speakers")}</span> •{" "}
              {t("landing.phase1.archived")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
