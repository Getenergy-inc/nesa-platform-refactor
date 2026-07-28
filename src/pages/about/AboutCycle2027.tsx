// About NESA-Africa 2027 — second public cycle outlook.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function AboutCycle2027() {
  return (
    <>
      <Helmet>
        <title>About NESA-Africa 2027 · Second Public Award Cycle</title>
        <meta
          name="description"
          content="NESA-Africa 2027 — the second public award cycle. Continues verification-only recognition across all four tiers, culminating in the December 2027 Recognition Gala."
        />
      </Helmet>
      <article className="bg-charcoal text-ivory py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="text-center space-y-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-gold/80">Cycle Outlook</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold">About NESA-Africa 2027</h1>
            <p className="text-ivory/70 text-lg">
              The second public award cycle — building on the 2026 inaugural launch, still fully
              verification-based across every tier.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">What Stays the Same</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>No public voting at any tier — recognition remains verification-only.</li>
              <li>Nominee Research Corps (NRC) verification through the Education Development Index (EDI) Matrix for every submission.</li>
              <li>Africa Education Icon Award — 9 Laureates from 27 Grand Jury finalists, rolling 20-year evaluation window (2007–2027).</li>
              <li>Once-in-a-lifetime Icon eligibility, three Certificate tiers unchanged in structure.</li>
              <li>Sponsorship, donations, ticket purchases, and gala attendance continue to have zero influence on outcomes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">What Evolves in 2027</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>Expanded Local Chapter coverage across all African regions and priority Diaspora hubs.</li>
              <li>Deeper EduAid-Africa integration — Special Needs School Intervention delivery in October 2027 to one recipient school per African region via Rebuild My School Africa.</li>
              <li>Broader independent judge pool for the Icon Award, with sustained COI vetting.</li>
              <li>Refined EDI Matrix based on 2026 cycle learnings — same weighted standard, category-specific tuning.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">2027 Cycle Milestone</h2>
            <p>
              A second Recognition Gala follows in <strong className="text-gold">December 2027</strong>{" "}
              (exact date to be confirmed), continuing the cadence established by the 14 December 2026
              inaugural gala in Lagos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">The Runway to 2028</h2>
            <p>
              2027 is the final cycle before the disclosed introduction of a capped, non-monetary public
              engagement element on the Gold-Blue Garnet tier alone (2028+). The Africa Education Icon
              Award and Platinum Certificates of Recognition remain verification-based indefinitely.
            </p>
          </section>

          <footer className="pt-6 border-t border-gold/10 text-center text-ivory/70 text-sm">
            <p>
              Compare cycles: <Link to="/about/2026" className="text-gold underline">2026</Link>{" "}
              · <Link to="/about/2028-2030" className="text-gold underline">2028–2030 Outlook</Link>
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}
