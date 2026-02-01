import { BookOpen, Award, Star, Trophy, Medal, Building, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HowItWorksSection() {
  const { t } = useTranslation("pages");

  const steps = [
    { icon: BookOpen, labelKey: "landing.howItWorks.steps.webinar" },
    { icon: Award, labelKey: "landing.howItWorks.steps.platinum" },
    { icon: Star, labelKey: "landing.howItWorks.steps.icon" },
    { icon: Medal, labelKey: "landing.howItWorks.steps.gold" },
    { icon: Trophy, labelKey: "landing.howItWorks.steps.blueGarnet" },
    { icon: Building, labelKey: "landing.howItWorks.steps.rmsaLegacy" },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.howItWorks.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t("landing.howItWorks.description")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gold/20 hidden md:block" />

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <div key={step.labelKey} className="relative flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="relative z-10 h-16 w-16 rounded-full bg-charcoal-light border-2 border-gold/30 flex items-center justify-center mb-3">
                    <step.icon className="h-7 w-7 text-gold" />
                  </div>
                  <span className="text-white text-sm font-medium">{t(step.labelKey)}</span>

                  {/* Arrow (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-2 text-gold/50">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AGC Participation Note */}
          <div className="flex items-center justify-center gap-2 mt-10 p-4 rounded-xl bg-gold/5 border border-gold/20">
            <Coins className="h-5 w-5 text-gold flex-shrink-0" />
            <p className="text-sm text-white/80">
              Participation unlocks voting points. Voting uses AGC (non-tradeable) during official windows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
