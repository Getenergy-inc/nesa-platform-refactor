// §17 — Trust & Integrity. Governance stays highly visible, never buried,
// with technical terminology progressively disclosed.

import { Link } from "react-router-dom";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import {
  BRAND,
  TRUST_PILLARS,
  HISTORY_NOTE,
  ICON_NO_PUBLIC_VOTING_NOTE,
  SERVICE_OWNERS,
} from "@/config/brandHierarchy";
import {
  RECOGNITION_INDEPENDENCE_2026,
  WALLET_NAME,
  WALLET_PAYMENT_PURPOSES,
  WALLET_RECONCILIATION_NOTE,
} from "@/config/walletBranding";


const GLOSSARY = [
  { term: "NRC — Nominee Research Corps", body: "The independent volunteer research body that verifies every nomination's evidence before assessment." },
  { term: "EDI Matrix — Education Development Index", body: "The published scoring matrix reviewers use to assess verified nominations, category by category." },
  { term: "Judges Arena", body: "The closed internal environment where independent judges score the Africa Education Icon Award. No public voting is used." },
  { term: "Governance ratification", body: "The final board step that confirms a recognition before it is announced." },
];

export default function TrustIntegrityPage() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <LocalizedSEO
        pathname="/trust"
        title={`Trust & Integrity | ${BRAND.platform} 2026`}
        description="Independent governance, NRC verification, evidence requirements, conflict-of-interest controls and sponsor independence at NESA-Africa."
      />

      <header className="border-b border-gold/15 py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{BRAND.programme}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold">Trust &amp; Integrity</h1>
          <p className="mt-4 text-lg text-white/75">
            A simple public experience must never mean weaker transparency. Everything below
            governs how recognition is decided.
          </p>
        </div>
      </header>

      <section className="py-12 md:py-16" aria-labelledby="pillars">
        <div className="container">
          <h2 id="pillars" className="sr-only">Integrity pillars</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_PILLARS.map((p) => (
              <article key={p.title} className="rounded-lg border border-gold/20 bg-white/[0.03] p-6">
                <h3 className="font-display text-base text-gold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.body}</p>
              </article>
            ))}
          </div>

          <p className="mt-8 rounded-lg border border-gold/30 bg-gold/5 p-5 text-sm text-white/80">
            {ICON_NO_PUBLIC_VOTING_NOTE}
          </p>
        </div>
      </section>

      <section className="border-t border-gold/15 py-12" aria-labelledby="history">
        <div className="container max-w-3xl">
          <h2 id="history" className="font-display text-2xl">Our history, stated accurately</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75">{HISTORY_NOTE}</p>
        </div>
      </section>

      <section className="border-t border-gold/15 py-12" aria-labelledby="glossary">
        <div className="container max-w-3xl">
          <h2 id="glossary" className="font-display text-2xl">The technical terms, explained</h2>
          <div className="mt-6 space-y-3">
            {GLOSSARY.map((g) => (
              <details key={g.term} className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
                <summary className="cursor-pointer text-sm font-semibold text-gold">
                  {g.term}
                </summary>
                <p className="mt-2 text-sm text-white/70">{g.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 py-12" aria-labelledby="who">
        <div className="container max-w-3xl">
          <h2 id="who" className="font-display text-2xl">Service and payment ownership</h2>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {SERVICE_OWNERS.map((o) => (
              <li key={o.id}>
                <span className="font-semibold text-gold">{o.name}</span> — {o.handles.join(", ")}.
              </li>
            ))}
          </ul>
          <Link to="/governance" className="mt-6 inline-block text-sm text-gold hover:underline">
            Read the full governance framework →
          </Link>
        </div>
      </section>

      <section
        id="recognition-independence"
        className="border-t border-gold/15 py-12 md:py-16"
        aria-labelledby="independence"
      >
        <div className="container max-w-3xl">
          <h2 id="independence" className="font-display text-2xl text-gold">
            {RECOGNITION_INDEPENDENCE_2026.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            {RECOGNITION_INDEPENDENCE_2026.summary}
          </p>
          <ul className="mt-5 space-y-3">
            {RECOGNITION_INDEPENDENCE_2026.statements.map((s) => (
              <li
                key={s}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-white/75"
              >
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-gold/25 bg-gold/5 p-5">
            <h3 className="font-display text-base text-gold">
              What the {WALLET_NAME} is for
            </h3>
            <p className="mt-2 text-sm text-white/75">
              The {WALLET_NAME} is an approved payment and transaction channel only, covering:
            </p>
            <ul className="mt-3 grid gap-1.5 text-sm text-white/70 sm:grid-cols-2">
              {WALLET_PAYMENT_PURPOSES.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/60">{WALLET_RECONCILIATION_NOTE}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

