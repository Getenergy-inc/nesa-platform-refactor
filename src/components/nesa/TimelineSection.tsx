import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";
import { buildTimeline } from "@/config/schedule";
import { Coins } from "lucide-react";

export function TimelineSection() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  
  // Build timeline from config for the current season
  const timeline = buildTimeline(currentEdition.displayYear);

  // Check if phase involves voting
  const isVotingPhase = (phase: string) => {
    const votingKeywords = ["gold", "blue garnet", "voting", "public"];
    return votingKeywords.some(keyword => phase.toLowerCase().includes(keyword));
  };

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.timeline.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.timeline.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold/20 hidden md:block" />

            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={item.id} className="flex gap-4 md:gap-6">
                  {/* Number circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`h-12 w-12 rounded-full border flex items-center justify-center ${
                      item.isActive 
                        ? "bg-gold/20 border-gold" 
                        : "bg-gold/10 border-gold/30"
                    }`}>
                      <span className="text-gold font-bold">{index + 1}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 bg-charcoal-light rounded-xl p-4 border ${
                    item.isActive 
                      ? "border-gold/40" 
                      : "border-gold/20"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{item.phase}</h3>
                        {isVotingPhase(item.phase) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium">
                            <Coins className="h-3 w-3" />
                            AGC
                          </span>
                        )}
                      </div>
                      <span className="text-gold text-sm">{item.dateRange}</span>
                    </div>
                    <p className="text-white/70 text-sm">{item.description}</p>
                    {isVotingPhase(item.phase) && (
                      <p className="text-white/50 text-xs mt-1">
                        Vote with AGC (non-tradeable voting credit)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
