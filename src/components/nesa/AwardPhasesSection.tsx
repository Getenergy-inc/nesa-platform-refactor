import { Tv, Check, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";
import { buildAwardPhases } from "@/config/schedule";

export function AwardPhasesSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  
  // Build award phases from config for the current season
  const phases = buildAwardPhases(currentEdition.displayYear);

  // AGC notes for specific phases
  const phaseAgcNotes: Record<number, string> = {
    2: "", // Phase 4 (Gold Certificate)
    3: "", // Phase 5 (Blue Garnet)
  };

  // Add AGC notes based on phase index
  const getAgcNote = (index: number, phaseTitle: string) => {
    if (phaseTitle.toLowerCase().includes("gold")) {
      return "Public participation is enabled through AGC voting points.";
    }
    if (phaseTitle.toLowerCase().includes("blue garnet") && !phaseTitle.toLowerCase().includes("icon")) {
      return "Vote with AGC during the public window; final results combine public participation and jury review.";
    }
    return null;
  };

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.awardPhases.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.awardPhases.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {phases.map((phase, index) => {
            const agcNote = getAgcNote(index, phase.title);
            
            return (
              <div
                key={phase.id}
                className="bg-charcoal-light rounded-2xl p-6 border border-gold/20 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-gold text-sm font-medium">{t("landing.awardPhases.phase")} {index + 2}</p>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                    <p className="text-white/70 text-sm">{phase.subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <span className="text-white/70">
                    <span className="text-gold">{t("landing.awardPhases.period")}:</span> {phase.period}
                  </span>
                  <span className="flex items-center gap-1 text-white/70">
                    <Tv className="h-3.5 w-3.5 text-gold" />
                    <span className="text-gold">{t("landing.awardPhases.show")}:</span> {phase.showDate}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {phase.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* AGC Note for voting phases */}
                {agcNote && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/5 border border-gold/20 mt-4">
                    <Coins className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/80">{agcNote}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
