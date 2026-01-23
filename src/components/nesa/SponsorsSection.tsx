export function SponsorsSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Sponsors
          </h2>
        </div>

        <div className="flex justify-center items-center gap-8 flex-wrap">
          {/* Placeholder sponsor logos */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 w-32 bg-charcoal-light border border-gold/20 rounded-lg flex items-center justify-center"
            >
              <span className="text-white/50 text-xs">Sponsor {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
