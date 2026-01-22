export function QuoteBlock() {
  const keywords = ["Education", "Recognition", "Public Participation", "Legacy Impact"];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="mb-8">
            <p className="font-display text-2xl md:text-3xl text-white italic leading-relaxed">
              "NESA-Africa 2025 is not an event. It is a standards-led education accountability
              cycle that connects:"
            </p>
          </blockquote>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8">
            {keywords.map((keyword, index) => (
              <span key={keyword} className="flex items-center gap-2 md:gap-3">
                <span className="text-primary font-semibold text-lg">{keyword}</span>
                {index < keywords.length - 1 && (
                  <span className="text-primary/50">•</span>
                )}
              </span>
            ))}
          </div>

          <p className="text-secondary-foreground/70">
            Delivered with governance, transparency, and continental relevance.
          </p>
        </div>
      </div>
    </section>
  );
}
