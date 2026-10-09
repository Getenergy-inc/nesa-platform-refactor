import { ICON_SCORING_CRITERIA, ICON_RECOMMENDATIONS, ICON_TIE_BREAK_CHAIN, ICON_MIN_REVIEWERS } from "@/config/iconAward/scoring";

export default function IconJuryScoringGuide() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-widest text-gold/80">Africa Education Icon</p>
        <h1 className="text-2xl md:text-3xl font-semibold">Scoring Guide</h1>
        <p className="text-white/60 text-sm mt-2 max-w-3xl">
          The Icon Award recognises verified, evidence-based lifetime impact across three pathways
          and three classifications. Each nominee is scored by at least {ICON_MIN_REVIEWERS} independent
          judges on eight weighted criteria (total {ICON_SCORING_CRITERIA.reduce((a,c)=>a+c.weight,0)}%).
        </p>
      </div>

      <section className="rounded-xl border border-gold/20 bg-black/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-black/50 text-white/60">
            <tr>
              <th className="text-left px-4 py-2">Criterion</th>
              <th className="text-right px-4 py-2 w-24">Weight</th>
            </tr>
          </thead>
          <tbody>
            {ICON_SCORING_CRITERIA.map(c => (
              <tr key={c.slug} className="border-t border-white/5">
                <td className="px-4 py-2.5">{c.name}</td>
                <td className="px-4 py-2.5 text-right text-gold">{c.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Recommendation values</h2>
        <ul className="space-y-1 text-sm text-white/70">
          {ICON_RECOMMENDATIONS.map(r => <li key={r.value}>• {r.label}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Tie-break chain</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-white/70">
          {ICON_TIE_BREAK_CHAIN.map(t => <li key={t}>{t}</li>)}
        </ol>
      </section>

      <section className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/70 leading-relaxed">
        <h2 className="text-white font-semibold mb-2">Confidentiality & integrity</h2>
        <p>
          Judges must not discuss nominees outside the sanctioned deliberation channels, must declare
          any conflict of interest before scoring, must ground every score in verifiable evidence,
          and must respect the independence of the Icon jury from all other NESA-Africa award tiers.
        </p>
      </section>
    </div>
  );
}
