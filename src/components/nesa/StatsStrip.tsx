const stats = [
  { value: "15+", label: "Years Running" },
  { value: "54", label: "African Countries" },
  { value: "10,000+", label: "Nominees" },
  { value: "1,000+", label: "Awardees" },
];

export function StatsStrip() {
  return (
    <section className="bg-secondary border-y border-primary/20 py-12">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-charcoal/50 border border-primary/10"
            >
              <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="text-sm text-secondary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
