import { useTranslation } from "react-i18next";
import { useSeason } from "@/contexts/SeasonContext";

export function QuoteBlock() {
  const { t } = useTranslation("pages");
  const { currentEdition } = useSeason();
  
  const keywords = [
    t("landing.quote.keywords.education"),
    t("landing.quote.keywords.recognition"),
    t("landing.quote.keywords.publicParticipation"),
    t("landing.quote.keywords.legacyImpact"),
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="mb-8">
            <p className="font-display text-2xl md:text-3xl text-white italic leading-relaxed">
              "{t("landing.quote.text", { editionName: currentEdition.name })}"
            </p>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8">
            {keywords.map((keyword, index) => (
              <span key={keyword} className="flex items-center gap-2 md:gap-3">
                <span className="text-gold font-semibold text-lg">{keyword}</span>
                {index < keywords.length - 1 && (
                  <span className="text-gold/50">•</span>
                )}
              </span>
            ))}
          </div>

          <p className="text-white/70">
            {t("landing.quote.footer")}
          </p>
        </div>
      </div>
    </section>
  );
}
