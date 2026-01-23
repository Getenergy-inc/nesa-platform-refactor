import { useSeason } from "@/contexts/SeasonContext";

export function QuoteBlock() {
  const { currentEdition } = useSeason();
  const keywords = ["Education", "Recognition", "Public Participation", "Legacy Impact"];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="mb-8">
            <p className="font-display text-2xl md:text-3xl text-white italic leading-relaxed">
              "{currentEdition.name} is not an event. It is a standards-led education accountability
              cycle that connects:"
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
            Delivered with governance, transparency, and continental relevance.
          </p>
        </div>
      </div>
    </section>
  );
}
