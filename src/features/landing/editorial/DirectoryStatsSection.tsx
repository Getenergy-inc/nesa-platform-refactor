// Homepage — "Africa's Education Impact Directory" + live stat counters.
// Counts follow the useGlobalTeamStats contract: null renders an em dash,
// a genuine database zero renders "0".

import { Link } from "react-router-dom";


export function DirectoryStatsSection() {
  const items = [
    { label: "Four recognition tiers", value: "4" },
    { label: "Main awards", value: "22" },
    { label: "Subcategories", value: "90" },
    { label: "Independent Icon judges", value: "9" },
  ];

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-directory-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">A living record of education impact</div>
          <h2 id="ed-directory-heading" className="ed-section-title">
            Africa&apos;s Education Impact Directory
          </h2>
          <p className="ed-section-sub">
            Four recognition tiers · 22 main awards · 90 subcategories · Nine Icon NRRC members · Nine independent Icon judges · Up to nine Africa Education Icons · Nomination is free · No public or AGC voting in 2026.
          </p>
        </div>

        <div className="text-center">
          <Link to="/nominees" className="ed-btn-primary">
            Meet Africa's Education Enablers →
          </Link>
        </div>

        <dl
          className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
          aria-label="Programme facts"
        >
          {items.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gold/20 bg-white/[0.03] px-4 py-6 text-center"
            >
              <dd className="font-serif text-3xl text-gold sm:text-4xl">{s.value}</dd>
              <dt className="mt-2 text-xs uppercase tracking-[0.14em] text-white/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default DirectoryStatsSection;
