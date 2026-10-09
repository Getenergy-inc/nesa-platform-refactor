// §6 / §7 — "Help me choose" nomination routing.
// Nobody has to understand the internal taxonomy to nominate. Two broad
// questions map the nominee into the authoritative recognition architecture.

import { useState } from "react";
import { Link } from "react-router-dom";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import {
  BRAND,
  NOMINEE_TYPES,
  IMPACT_CHOICES,
  recommendFamilies,
  getFamilyCategories,
} from "@/config/brandHierarchy";

export default function HelpMeChoosePage() {
  const [who, setWho] = useState<string | null>(null);
  const [impacts, setImpacts] = useState<string[]>([]);

  const toggle = (k: string) =>
    setImpacts((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const recommended = recommendFamilies(impacts);

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <LocalizedSEO
        pathname="/nominate/help-me-choose"
        title={`Help Me Choose a Recognition | ${BRAND.platform} 2026`}
        description="Not sure which recognition applies? Answer two questions and NESA-Africa will route your nomination to the right recognition family."
      />

      <header className="border-b border-gold/15 py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{BRAND.programme}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold">
            Not sure which recognition applies?
          </h1>
          <p className="mt-4 text-lg text-white/75">
            Let NESA-Africa help. Tell us who you want to recognise and what they did — we will
            route the nomination into the right recognition family.
          </p>
        </div>
      </header>

      {/* Q1 */}
      <section className="py-12" aria-labelledby="q1">
        <div className="container max-w-4xl">
          <h2 id="q1" className="font-display text-2xl">
            Who would you like to recognise?
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {NOMINEE_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={who === t}
                onClick={() => setWho(t)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  who === t
                    ? "border-gold bg-gold text-charcoal font-semibold"
                    : "border-white/20 text-white/80 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Q2 */}
      <section className="border-t border-gold/15 py-12" aria-labelledby="q2">
        <div className="container max-w-4xl">
          <h2 id="q2" className="font-display text-2xl">
            What kind of education impact did they make?
          </h2>
          <p className="mt-2 text-sm text-white/60">Select everything that applies.</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {IMPACT_CHOICES.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={impacts.includes(c.key)}
                onClick={() => toggle(c.key)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  impacts.includes(c.key)
                    ? "border-gold bg-gold text-charcoal font-semibold"
                    : "border-white/20 text-white/80 hover:border-gold/50 hover:text-gold"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation */}
      <section className="border-t border-gold/15 py-12" aria-labelledby="rec">
        <div className="container max-w-4xl">
          <h2 id="rec" className="font-display text-2xl">
            Recommended recognition
          </h2>

          {recommended.length === 0 ? (
            <p className="mt-4 text-sm text-white/65">
              Select at least one kind of impact above — or skip it entirely and let the Nominee
              Research Corps classify the nomination for you.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {recommended.map((f, i) => (
                <article
                  key={f.slug}
                  className="rounded-lg border border-gold/25 bg-white/[0.03] p-6"
                >
                  {i === 0 && (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-gold">
                      Best match
                    </span>
                  )}
                  <h3 className="mt-1 font-display text-lg text-gold">{f.name}</h3>
                  <p className="mt-2 text-sm text-white/70">{f.lede}</p>
                  <p className="mt-3 text-xs text-white/50">
                    Categories: {getFamilyCategories(f).map((c) => c.shortName).join(" · ")}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to={`/nominate?family=${f.slug}${who ? `&nomineeType=${encodeURIComponent(who)}` : ""}`}
                      className="inline-flex h-10 items-center rounded-md bg-gold px-5 text-xs font-bold text-charcoal hover:bg-gold/90"
                    >
                      Start this nomination
                    </Link>
                    <Link
                      to={`/recognition/${f.slug}`}
                      className="inline-flex h-10 items-center rounded-md border border-gold/40 px-5 text-xs font-semibold text-gold hover:bg-gold/10"
                    >
                      Read more
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-display text-base text-white">Still not sure?</h3>
            <p className="mt-2 text-sm text-white/65">
              Submit the nominee&apos;s basic information and contribution story. The Nominee
              Research Corps will determine the correct recognition pathway before review — you
              never need to understand the internal award taxonomy.
            </p>
            <Link
              to="/nominate?family=unassigned"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-gold px-5 text-xs font-bold text-charcoal hover:bg-gold/90"
            >
              Let NESA-Africa classify it
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
