// About NESA-Africa 2026 — inaugural public award cycle overview.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function AboutCycle2026() {
  return (
    <>
      <Helmet>
        <title>About NESA-Africa 2026 · Inaugural Public Award Cycle</title>
        <meta
          name="description"
          content="NESA-Africa 2026 — the inaugural public award cycle: 18 recognition forms across 4 tiers, culminating in the 14 December 2026 Recognition Gala in Lagos."
        />
      </Helmet>
      <article className="bg-charcoal text-ivory py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="text-center space-y-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-gold/80">Cycle Overview</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold">About NESA-Africa 2026</h1>
            <p className="text-ivory/70 text-lg">
              The inaugural public award cycle — the first opportunity for public nomination, verification,
              and recognition since New Education Standard Award Africa Ltd's incorporation in 2024.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Overview</h2>
            <p>
              2026 and 2027 establish the platform entirely on independent verification, with no public
              voting at any tier. From 2028, the Gold-Blue Garnet tier alone introduces a capped,
              non-monetary public engagement element — disclosed now, years ahead. The Africa Education
              Icon Award and Platinum Certificates of Recognition remain fully verification-based
              indefinitely.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">What NESA-Africa 2026 Recognises</h2>
            <p>18 recognition forms across four tiers, all entirely evidence-based:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gold/20">
                <thead className="bg-charcoal-light/40 text-gold">
                  <tr>
                    <th className="text-left p-3 border-b border-gold/20">Tier</th>
                    <th className="text-left p-3 border-b border-gold/20">Forms</th>
                    <th className="text-left p-3 border-b border-gold/20">Governance path</th>
                  </tr>
                </thead>
                <tbody className="text-ivory/85">
                  <tr className="border-b border-gold/10">
                    <td className="p-3">Africa Education Icon</td>
                    <td className="p-3">1 (3 pathways × 3 classifications)</td>
                    <td className="p-3">NRC → EDI → Judges → Grand Jury → Governance</td>
                  </tr>
                  <tr className="border-b border-gold/10">
                    <td className="p-3">Influencer Education Impact</td>
                    <td className="p-3">1 (3 pathways)</td>
                    <td className="p-3">NRC → EDI → Governance</td>
                  </tr>
                  <tr className="border-b border-gold/10">
                    <td className="p-3">Platinum Certificates of Recognition</td>
                    <td className="p-3">7</td>
                    <td className="p-3">NRC → EDI → Governance</td>
                  </tr>
                  <tr>
                    <td className="p-3">Gold-Blue Garnet Regional Certificates</td>
                    <td className="p-3">9</td>
                    <td className="p-3">NRC → EDI → Governance (no voting until 2028)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">The 2026 Cycle Calendar</h2>
            <ul className="space-y-2 text-ivory/85">
              <li><strong className="text-gold">15 Jan – 29 Aug 2026:</strong> Pre-Nomination — NRC populates ~2,700 pre-nominees.</li>
              <li><strong className="text-gold">15 Aug 2026:</strong> All four NRC teams activate.</li>
              <li><strong className="text-gold">30 Aug 2026:</strong> Public Nominations Open — all four tiers.</li>
              <li><strong className="text-gold">30 Aug – 5 Sep 2026:</strong> Africa Education Icon Nominations Window.</li>
              <li><strong className="text-gold">By 10 Sep 2026:</strong> Icon NRC verification complete.</li>
              <li><strong className="text-gold">1 Sep – 12 Oct 2026:</strong> Judges Arena — Panel Scoring & Grand Jury Deliberation.</li>
              <li><strong className="text-gold">By 20 Dec 2026:</strong> Influencer / Platinum / Gold-Blue Garnet NRC verification complete.</li>
              <li><strong className="text-gold">28 Nov 2026:</strong> First Online TV Award Show — Certificate finalists revealed.</li>
              <li><strong className="text-gold">6 Dec 2026:</strong> Second Online TV Award Show — Icon finalists revealed.</li>
              <li><strong className="text-gold">14 Dec 2026:</strong> NESA-Africa 2026 Recognition Gala, Lagos.</li>
              <li><strong className="text-gold">14 – 30 Dec 2026:</strong> Certificate & Digital Badge Download Window.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Africa Education Icon Award — 2026 Specifics</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>Nine Laureates, selected from 27 Grand Jury finalists.</li>
              <li>Rolling 20-year evaluation window — the 2026 cycle recognises impact from 2006 to 2026.</li>
              <li>Once-in-a-lifetime eligibility.</li>
              <li>Verified through NRC (EDI Matrix), 27 judges across nine panels, Grand Jury deliberation, and Governance ratification — no voting, now or ever for this tier.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">What NESA-Africa 2026 Is Not</h2>
            <p>
              There is no public voting mechanism at any stage of the 2026 cycle. Recognition is
              determined exclusively through NRC verification, the EDI Matrix, and — for the Icon Award
              only — independent judging and Governance ratification.
            </p>
          </section>

          <footer className="pt-6 border-t border-gold/10 text-center text-ivory/70 text-sm">
            <p>
              Explore the next cycle: <Link to="/about/2027" className="text-gold underline">About NESA-Africa 2027</Link>{" "}
              · <Link to="/about/2028-2030" className="text-gold underline">2028–2030 Outlook</Link>
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}
