// §3 pathway 5 — Participate hub. One CTA on the homepage; all detail here,
// with SCEF / EduAid-Africa / NESA-Africa service ownership clearly separated (§16).

import { Link } from "react-router-dom";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import { BRAND, SERVICE_OWNERS } from "@/config/brandHierarchy";

const ACTIONS = [
  { label: "Nominate", href: "/nominate", owner: "NESA-Africa", blurb: "Recognise an Education Enabler." },
  { label: "Sponsor", href: "/get-involved/gala-sponsorship", owner: "NESA-Africa", blurb: "Back the recognition programme and Gala." },
  { label: "Partner", href: "/partners-sponsors", owner: "NESA-Africa", blurb: "Institutional and media partnerships." },
  { label: "Endorse", href: "/endorsements", owner: "NESA-Africa", blurb: "Publicly endorse a nominee or the programme." },
  { label: "Volunteer", href: "/vacancies", owner: "SCEF", blurb: "Join the volunteer corps across 13 standing roles." },
  { label: "Ambassador", href: "/chapters", owner: "SCEF", blurb: "Represent NESA-Africa in your country or city." },
  { label: "Chapters", href: "/chapters", owner: "SCEF", blurb: "Join or start a local chapter." },
  { label: "Merchandise", href: "/merch", owner: "NESA-Africa", blurb: "Official recognition merchandise." },
  { label: "Contact", href: "/contact", owner: "NESA-Africa", blurb: "Talk to the secretariat." },
];

export default function ParticipatePage() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <LocalizedSEO
        pathname="/participate"
        title={`Participate | ${BRAND.platform} 2026`}
        description="Nominate, sponsor, partner, endorse, volunteer, join a chapter or support Africa's Education Enablers."
      />

      <header className="border-b border-gold/15 py-14 md:py-20">
        <div className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{BRAND.programme}</p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-bold">Participate</h1>
          <p className="mt-4 text-lg text-white/75">{BRAND.programmeTagline}</p>
        </div>
      </header>

      <section className="py-12 md:py-16" aria-labelledby="participate-ways">
        <div className="container">
          <h2 id="participate-ways" className="sr-only">Ways to participate</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACTIONS.map((a) => (
              <Link
                key={a.label}
                to={a.href}
                className="rounded-lg border border-gold/20 bg-white/[0.03] p-6 transition-colors hover:border-gold/50"
              >
                <span className="text-[11px] uppercase tracking-wide text-white/40">
                  Managed by {a.owner}
                </span>
                <h3 className="mt-1 font-display text-lg text-gold">{a.label}</h3>
                <p className="mt-2 text-sm text-white/70">{a.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 py-12 md:py-16" aria-labelledby="ownership">
        <div className="container">
          <h2 id="ownership" className="font-display text-2xl">Who manages what</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Payments, donations and sponsorship are never mixed between organisations. Each
            service is delivered and invoiced by the organisation named below.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {SERVICE_OWNERS.map((o) => (
              <article key={o.id} className="rounded-lg border border-gold/20 bg-white/[0.03] p-6">
                <h3 className="font-display text-lg text-gold">{o.name}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                  {o.handles.map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
