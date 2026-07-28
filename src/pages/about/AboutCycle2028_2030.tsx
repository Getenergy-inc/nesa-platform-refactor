// About NESA-Africa 2028–2030 — medium-term outlook and phased public engagement.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function AboutCycle2028_2030() {
  return (
    <>
      <Helmet>
        <title>About NESA-Africa 2028–2030 · Medium-Term Outlook</title>
        <meta
          name="description"
          content="NESA-Africa 2028–2030 outlook — phased public engagement on the Gold-Blue Garnet tier only; Icon and Platinum tiers remain fully verification-based."
        />
      </Helmet>
      <article className="bg-charcoal text-ivory py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="text-center space-y-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-gold/80">Medium-Term Outlook</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold">About NESA-Africa 2028–2030</h1>
            <p className="text-ivory/70 text-lg">
              A disclosed, phased evolution — announced years in advance, so no participant, sponsor,
              or nominee is ever surprised by a change in how recognition works.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Phased Public Engagement — Gold-Blue Garnet Tier Only</h2>
            <p>
              From the 2028 cycle onward, the Gold-Blue Garnet Regional Certificates tier introduces a
              <strong className="text-gold"> capped, non-monetary public engagement element</strong> as
              one input alongside NRC verification and EDI Matrix scoring. Caps, methodology, and
              anti-manipulation controls will be published in full before the 2028 nominations window
              opens.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>No paid voting. No monetary influence of any kind.</li>
              <li>Per-person and per-session caps enforced at the platform level.</li>
              <li>Governance retains final ratification authority for every recipient.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">What Does Not Change</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li><strong className="text-gold">Africa Education Icon Award</strong> — remains fully verification-based, NRC + EDI + Judges + Grand Jury + Governance. No public voting, indefinitely.</li>
              <li><strong className="text-gold">Platinum Certificates of Recognition</strong> — remain fully verification-based, indefinitely.</li>
              <li><strong className="text-gold">Influencer Education Impact</strong> — remains verification-based; any future evolution will be disclosed with the same multi-year lead time.</li>
              <li>Sponsorship, donations, ticket purchases, and gala attendance continue to have zero influence on any tier's outcomes.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Cycle Cadence</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li><strong className="text-gold">2028:</strong> First cycle with Gold-Blue Garnet public engagement input live.</li>
              <li><strong className="text-gold">2029:</strong> Independent review of the 2028 public engagement mechanic; adjustments published before nominations open.</li>
              <li><strong className="text-gold">2030:</strong> Third full cycle under the phased model; alignment checkpoint against the SCEF Vision 2035 roadmap.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Alignment</h2>
            <p>
              The 2028–2030 window is the operational bridge into SCEF's{" "}
              <Link to="/about#vision-2035" className="text-gold underline">Vision 2035</Link> — the
              continental roadmap for Education for All across Africa, the Diaspora, and Friends of
              Africa.
            </p>
          </section>

          <footer className="pt-6 border-t border-gold/10 text-center text-ivory/70 text-sm">
            <p>
              Compare cycles: <Link to="/about/2026" className="text-gold underline">2026</Link>{" "}
              · <Link to="/about/2027" className="text-gold underline">2027</Link>
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}
