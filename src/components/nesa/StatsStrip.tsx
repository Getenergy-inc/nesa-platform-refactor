const stats = [
  { value: "15+", label: "Years Running" },
  { value: "54", label: "African Countries" },
  { value: "10,000+", label: "Nominees" },
  { value: "1,000+", label: "Awardees" },
];

export function StatsStrip() {
  return (
    <section className="bg-nesa-navy border-y border-nesa-gold/20 py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-nesa-navy-dark/50 border border-nesa-gold/10"
            >
              <p className="text-3xl md:text-4xl font-bold text-nesa-gold mb-1">{stat.value}</p>
              <p className="text-sm text-nesa-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
