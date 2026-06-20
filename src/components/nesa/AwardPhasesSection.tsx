import { Tv, Check, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";
import { buildAwardPhases } from "@/config/schedule";
import platinumImg from "@/assets/cards/platinum-recognition.jpg";
import goldImg from "@/assets/cards/gold-public-voting.jpg";
import blueGarnetImg from "@/assets/cards/blue-garnet-gala.jpg";
import iconImg from "@/assets/cards/icon-lifetime.jpg";

const phaseImages = [platinumImg, goldImg, blueGarnetImg, iconImg];

export function AwardPhasesSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  
  const phases = buildAwardPhases(currentEdition.displayYear);

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
            const image = phaseImages[index % phaseImages.length];
            
            return (
              <div
                key={phase.id}
                className="bg-charcoal-light rounded-2xl border border-gold/20 hover:border-gold/40 transition-colors overflow-hidden group"
              >
                {/* Phase Image */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={image} alt={phase.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-charcoal-light/60 to-transparent" />
                  <div className="absolute bottom-3 left-5">
                    <p className="text-gold text-sm font-medium">{t("landing.awardPhases.phase")} {index + 2}</p>
                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-white/70 text-sm mb-4">{phase.subtitle}</p>

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

                  {agcNote && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-gold/5 border border-gold/20 mt-4">
                      <Coins className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-white/80">{agcNote}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
