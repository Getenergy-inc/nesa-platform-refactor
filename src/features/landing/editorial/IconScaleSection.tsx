// Homepage — "A Continental Search for Education Icons" scale/credibility band.
// Counts are computed live from the Icon nominee record (useIconAwardStats).
// null renders an em dash; a genuine zero renders "0". No "500+" claims.

import { ICON_SCALE_SECTION } from "@/config/brandHierarchy";
import { formatStat } from "@/hooks/useGlobalTeamStats";
import { useIconAwardStats } from "./useIconAwardStats";

export function IconScaleSection() {
  const stats = useIconAwardStats();

  const items: { label: string; value: number | null }[] = [
    { label: "Existing Icon Nominees", value: stats.nominees },
    { label: "Countries Represented", value: stats.countries },
    { label: "Regions Represented", value: stats.regions },
    { label: "Education Impact Stories", value: stats.impactStories },
  ];

  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-icon-scale-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">{ICON_SCALE_SECTION.eyebrow}</div>
          <h2 id="ed-icon-scale-heading" className="ed-section-title">
            {ICON_SCALE_SECTION.title}
          </h2>
          <p className="ed-section-sub">{ICON_SCALE_SECTION.sub}</p>
        </div>

        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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

export default IconScaleSection;
