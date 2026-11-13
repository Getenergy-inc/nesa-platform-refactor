// Homepage body in the 2026–2027 Content Framework order (section 5).
import { CERTIFICATE_NOTICE, HOME, HOME_BANDS, HOW_IT_WORKS, INTEGRITY, NOMINATE, TIERS } from "@/config/contentFramework2026";
import { FwCtas, FwSection } from "./FwBlocks";

export function HomeFramework2026() {
  return (
    <>
      <section className="bg-charcoal text-ivory">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-semibold">{HOME.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-bold leading-tight">{HOME.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-ivory/80">{HOME.intro}</p>
          <FwCtas ctas={[NOMINATE, HOW_IT_WORKS]} />
        </div>
      </section>

      <section aria-label="Trust statement" className="border-t border-gold/20 bg-charcoal text-ivory">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <p className="font-display text-xl text-gold">{HOME.trustStatement}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {HOME.trustBand.map((t) => (
              <li key={t} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-ivory/85">{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <FwSection id="tiers" eyebrow="Recognition" title="Four Recognition Tiers" light>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {TIERS.map((t) => (
            <article key={t.name} className="rounded-lg border border-charcoal/15 p-5">
              <h3 className="font-display text-xl font-bold">{t.name}</h3>
              <ul className="mt-3 list-disc pl-5 text-sm space-y-1">{t.items.map((i) => <li key={i}>{i}</li>)}</ul>
              {t.note && <p className="mt-3 text-sm text-charcoal/75">{t.note}</p>}
              <FwCtas ctas={t.ctas} className="mt-4" />
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-charcoal/75">{CERTIFICATE_NOTICE}</p>
      </FwSection>

      <FwSection id="how-it-works" eyebrow="What NESA-Africa does" title="How Recognition Works">
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME.steps.map((s, i) => (
            <li key={s.title} className="rounded-lg border border-gold/20 p-5">
              <p className="text-xs text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-ivory/80">{s.body}</p>
            </li>
          ))}
        </ol>
      </FwSection>

      {HOME_BANDS.map((b, i) => (
        <FwSection key={b.id} id={b.id} title={b.title} light={i % 2 === 0}>
          {b.body && <p className="mt-4 max-w-3xl">{b.body}</p>}
          <FwCtas ctas={b.ctas} />
        </FwSection>
      ))}

      <FwSection id="integrity" eyebrow="Integrity" title={INTEGRITY.title}>
        <p className="mt-4 max-w-3xl text-ivory/85">{INTEGRITY.body}</p>
      </FwSection>

      <FwSection id="final-cta" title={HOME.finalTitle} light>
        <p className="mt-4">{HOME.finalBody}</p>
        <FwCtas ctas={HOME.finalCtas} />
      </FwSection>
    </>
  );
}
