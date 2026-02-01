import { BookOpen, Award, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";

export function ProgrammeOverviewSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  const ceremonyYear = currentEdition.displayYear + 1;
  const programmeEndYear = ceremonyYear + 1;
  const dateRange = `October ${currentEdition.displayYear} – June ${programmeEndYear}`;

  const pillars = [
    {
      icon: BookOpen,
      category: t("landing.programmeOverview.pillars.publicEducation.category"),
      title: t("landing.programmeOverview.pillars.publicEducation.title"),
      description: t("landing.programmeOverview.pillars.publicEducation.description"),
    },
    {
      icon: Award,
      category: t("landing.programmeOverview.pillars.recognition.category"),
      title: t("landing.programmeOverview.pillars.recognition.title"),
      description: t("landing.programmeOverview.pillars.recognition.description"),
    },
    {
      icon: Building,
      category: t("landing.programmeOverview.pillars.legacy.category"),
      title: t("landing.programmeOverview.pillars.legacy.title"),
      description: t("landing.programmeOverview.pillars.legacy.description"),
    },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-gold text-sm font-medium mb-2">{dateRange}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.programmeOverview.title")}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            {t("landing.programmeOverview.description", { edition: currentEdition.name })}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-charcoal-light rounded-2xl p-6 border border-gold/20 text-center hover:border-gold/40 transition-colors"
            >
              <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <pillar.icon className="h-7 w-7 text-gold" />
              </div>
              <p className="text-gold text-sm font-medium mb-2">{pillar.category}</p>
              <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-white/70 text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
