const FACTS = [
  { label: "Recognition tiers", value: "4" },
  { label: "Main awards", value: "22" },
  { label: "Subcategories", value: "90" },
  { label: "Independent Icon judges", value: "9" },
];

export function DirectoryStatsSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-directory-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Facts, not popularity</div>
          <h2 id="ed-directory-heading" className="ed-section-title">A Responsible Recognition Framework</h2>
          <p className="ed-section-sub">4 tiers · 22 awards · 90 subcategories · 9 independent Icon judges · No public voting in 2026.</p>
          <p className="ed-section-sub font-semibold text-gold">Recognition cannot be bought.</p>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Programme facts">
          {FACTS.map((fact) => (
            <div key={fact.label} className="rounded-2xl border border-gold/20 bg-white/[0.03] px-4 py-6 text-center">
              <dd className="font-serif text-3xl text-gold sm:text-4xl">{fact.value}</dd>
              <dt className="mt-2 text-xs uppercase tracking-[0.14em] text-white/60">{fact.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default DirectoryStatsSection;
