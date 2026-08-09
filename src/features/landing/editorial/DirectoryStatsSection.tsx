// Homepage — "Africa's Education Impact Directory" + live stat counters.
// Counts follow the useGlobalTeamStats contract: null renders an em dash,
// a genuine database zero renders "0".

import { Link } from "react-router-dom";
import { useDirectoryStats } from "@/hooks/useLivingGallery";
import { formatStat } from "@/hooks/useGlobalTeamStats";

export function DirectoryStatsSection() {
  const stats = useDirectoryStats();

  const items: { label: string; value: number | null }[] = [
    { label: "Education Enablers", value: stats.enablers },
    { label: "Countries & Regions", value: stats.countriesAndRegions },
    { label: "Recognition Categories", value: stats.categories },
    { label: "Education Impact Stories", value: stats.impactStories },
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
            One searchable, verified record of the people and organisations advancing Education
            for All across Africa and the Diaspora.
          </p>
        </div>

        <div className="text-center">
          <Link to="/nominees" className="ed-btn-primary">
            Explore the Directory →
          </Link>
        </div>

        <dl
          className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4"
          aria-busy={stats.loading || undefined}
        >
          {items.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gold/20 bg-white/[0.03] px-4 py-6 text-center"
            >
              <dd className="font-serif text-3xl text-gold sm:text-4xl">{formatStat(s.value)}</dd>
              <dt className="mt-2 text-xs uppercase tracking-[0.14em] text-white/60">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default DirectoryStatsSection;
