// About NESA-Africa 2026 — inaugural public award cycle (verified canonical copy).
// Region counts use the confirmed 15-region framing (8 Africa + 7 Global).
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function AboutCycle2026() {
  return (
    <>
      <Helmet>
        <title>About NESA-Africa 2026 · Inaugural Public Award Cycle</title>
        <meta
          name="description"
          content="NESA-Africa 2026 — the inaugural public award cycle: 18 recognition forms across 4 tiers and 15 regions (8 Africa + 7 Global), culminating in the 14 December 2026 Recognition Gala in Lagos."
        />
      </Helmet>
      <article className="bg-charcoal text-ivory py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-10">
          <header className="text-center space-y-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-gold/80">Cycle Overview</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold">About NESA-Africa 2026</h1>
            <p className="text-ivory/70 text-lg max-w-2xl mx-auto">
              The platform's inaugural public award cycle — the first opportunity for public
              nomination, verification, and recognition since New Education Standard Award Africa
              Ltd's incorporation in 2024, spanning 15 regions (8 Africa + 7 Global).
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Overview</h2>
            <p>
              This is the first of a disclosed, phased journey: 2026 and 2027 establish the platform
              entirely on independent verification, with no public voting at any tier. From 2028, the
              Gold-Blue Garnet tier alone introduces a capped, non-monetary public engagement element
              — disclosed now, years ahead. The Africa Education Icon Award and Platinum Certificates
              of Recognition remain fully verification-based indefinitely.
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gold/20">
                <thead className="bg-charcoal-light/40 text-gold">
                  <tr>
                    <th className="text-left p-3 border-b border-gold/20">Date / Period</th>
                    <th className="text-left p-3 border-b border-gold/20">Milestone</th>
                  </tr>
                </thead>
                <tbody className="text-ivory/85">
                  {[
                    ["15 Jan – 29 Aug 2026", "Pre-Nomination Period — NRC Data Entry Professionals populate the nominee database (~2,700 pre-nominees); each requires individual acceptance before review begins"],
                    ["15 Aug 2026", "All four NRC teams activate"],
                    ["20 Aug 2026", "EduAid-Africa Webinar Series begins (cross-reference only — full detail lives on EduAid-Africa's own platform)"],
                    ["30 Aug 2026", "Public Nominations Open — all four tiers"],
                    ["30 Aug – 5 Sep 2026", "Africa Education Icon Nominations Window"],
                    ["From 30 Aug 2026", "Automated NRC Review (Phase One) → Human NRC Review (Phase Two)"],
                    ["By 10 Sep 2026", "Icon NRC verification complete"],
                    ["1 Sep – 12 Oct 2026", "Judges Arena — Panel Scoring & Grand Jury Deliberation (Icon only)"],
                    ["By 20 Dec 2026", "Influencer / Platinum / Gold-Blue Garnet NRC verification complete"],
                    ["28 Nov 2026", "First Online TV Award Show — Certificate of Recognition finalists revealed"],
                    ["6 Dec 2026", "Second Online TV Award Show — Africa Education Icon finalists revealed"],
                    ["14 Dec 2026", "NESA-Africa 2026 Recognition Gala, Lagos — 9 Icon Laureates announced; all Certificates of Recognition formally presented"],
                    ["14 – 30 Dec 2026", "Certificate & Digital Badge Download Window"],
                    ["From download date", "Certificate validity — 1 year"],
                  ].map(([d, m]) => (
                    <tr key={d} className="border-b border-gold/10">
                      <td className="p-3 text-gold whitespace-nowrap align-top">{d}</td>
                      <td className="p-3">{m}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Africa Education Icon Award — 2026 Specifics</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>Nine Laureates, selected from 27 Grand Jury finalists — three finalists per pathway-classification group, one laureate chosen from each of the nine groups.</li>
              <li>Rolling 20-year evaluation window — the 2026 cycle recognises impact from 2006 to 2026.</li>
              <li>Once-in-a-lifetime eligibility.</li>
              <li>Verified through NRC (EDI Matrix), 27 volunteer judges across nine specialist panels, Grand Jury deliberation, and Governance ratification — no voting, now or in any future cycle for this tier.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Nomination Requirements (all 18 forms)</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>An eligibility self-check gate is required before submission begins — for the Icon Award, this includes confirming 15+ years of documented contribution.</li>
              <li>A persistent, visible non-influence disclaimer appears before submission: "Your submission does not automatically make the nominee a finalist, winner, or honouree. All submissions are subject to eligibility review, evidence review, duplicate checks, verification, and governance/judging review. Sponsorship, donation, ticket purchase, or gala attendance does not influence outcomes."</li>
              <li>Draft submissions save securely to your account and email — resume from any device, not tied to a single browser.</li>
              <li>Each track closes on its own deadline (the Icon track closes 5 September 2026, independent of the general nominations window) — a form will state clearly when its cycle has closed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Who's Building the 2026 Cycle</h2>
            <p>
              Recruitment for this cycle runs across 13 standing roles — 11 at NESA-Africa, 2 at
              EduAid-Africa — with priority on the roles already blocking active 2026 work: Content
              Production, On-Air Presenting, Local Chapter Coordination, Platform Development, and
              Business Development & Partnerships.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Public Participation in the 2026 Cycle</h2>
            <ul className="list-disc pl-6 space-y-1 text-ivory/85">
              <li>Nomination, across any tier or classification.</li>
              <li>Post-recognition endorsement — optional, milestone-based, never a certificate requirement.</li>
              <li>Recommending an independent judge candidate — subject to Governance vetting.</li>
              <li>Applying to join the Nominee Research Corps — subject to vetting.</li>
              <li>Attending the 14 December 2026 Recognition Gala.</li>
            </ul>
            <p className="text-ivory/75 text-sm italic">
              None of the above — sponsorship, donation, ticket purchase, endorsement, or public
              participation of any kind — influences nominee approval, judging, or Governance
              decisions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">What NESA-Africa 2026 Is Not</h2>
            <p>
              There is no public voting mechanism at any stage of the 2026 cycle. Recognition is
              determined exclusively through NRC verification, the EDI Matrix, and — for the Africa
              Education Icon Award only — independent judging and Governance ratification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-2xl text-gold">Alongside the Award Cycle</h2>
            <p>
              EduAid-Africa, NESA-Africa's sister programme, runs its own independent annual cycle in
              parallel — including CSR for Education Funds Management Services and the Special Needs
              School Intervention through Rebuild My School Africa, delivering support to one
              recipient school per African region (8 African regions) in October 2027. EduAid-Africa's
              programme details are documented separately on EduAid-Africa's own platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-display text-2xl text-gold">Contact for 2026 Cycle Inquiries</h2>
            <p>
              <a href="mailto:info@nesa.africa" className="text-gold underline">info@nesa.africa</a>{" "}
              · +234 805 667 7770 — with department-specific routing available for Nominations, Media,
              Sponsorship, Judges & NRC, Chapters & Volunteers, and Gala & Tickets.
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
