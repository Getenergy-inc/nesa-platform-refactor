export function SponsorsSection() {
  return (
    <section className="bg-nesa-navy py-16 md:py-20">
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
              className="h-16 w-32 bg-nesa-navy-dark/50 border border-nesa-gold/10 rounded-lg flex items-center justify-center"
            >
              <span className="text-nesa-text-muted text-xs">Sponsor {i}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
