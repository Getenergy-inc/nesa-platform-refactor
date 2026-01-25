const stats = [
  { value: "15+", label: "Years Running" },
  { value: "54", label: "African Countries" },
  { value: "17", label: "Award Categories" },
  { value: "141+", label: "Sub-Categories" },
];

export function StatsStrip() {
  return (
    <section className="bg-charcoal border-y border-gold/20 py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-charcoal-light border border-gold/20"
            >
              <p className="text-3xl md:text-4xl font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
