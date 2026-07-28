// AboutCanonicalContent — verified canonical narrative block for /about.
// Sourced from the approved "About NESA-Africa" master copy.

export function AboutCanonicalContent() {
  return (
    <section
      aria-label="About NESA-Africa canonical overview"
      className="bg-charcoal py-16 md:py-20 border-t border-gold/10"
    >
      <div className="container mx-auto px-4 max-w-4xl space-y-10 text-ivory/90">
        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Who We Are</h2>
          <p>
            <strong>New Education Standard Award Africa (NESA-Africa)</strong> — <em>The African
            Blue-Garnet Awards for Education</em> — is a continental education recognition and
            impact platform, a service of the <strong>Santos Creations Educational Foundation
            (SCEF)</strong>.
          </p>
          <p>
            NESA-Africa identifies, verifies, and recognises the{" "}
            <strong className="text-gold">
              Enablers of Education for All across Africa — by Africans in Africa, Diaspora
              Africans, and Friends of Africa
            </strong>{" "}
            (individuals, companies, or organisations).
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Our Story</h2>
          <p>
            From a 1997 vision for education and cultural heritage in Minna, Niger State, to a
            registered Pan-African foundation, SCEF has spent nearly three decades building toward
            Education for All across the continent. NESA-Africa itself launches its inaugural
            public recognition cycle in 2026 — a new standard for verified, evidence-based
            recognition across Africa.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Our Journey</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gold/20">
              <thead className="bg-charcoal-light/40 text-gold">
                <tr>
                  <th className="text-left p-3 border-b border-gold/20">Year</th>
                  <th className="text-left p-3 border-b border-gold/20">Milestone</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1997", "Founded as an educational tourism and cultural heritage vision, Minna, Niger State"],
                  ["2006", "Registered as a business name"],
                  ["2010", "Incorporated as an NGO — Santos Creations Educational Foundation (RC-41501)"],
                  ["2024", "New Education Standard Award Africa Ltd incorporated (RC-7381138)"],
                  ["2026", "NESA-Africa's inaugural public award cycle launches"],
                ].map(([y, m]) => (
                  <tr key={y} className="border-b border-gold/10">
                    <td className="p-3 text-gold font-semibold whitespace-nowrap">{y}</td>
                    <td className="p-3">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">What We Recognise</h2>
          <p>
            <strong>Recognition Architecture at a Glance:</strong> Four tiers · Eighteen categories
            · Ninety-six subcategories. Each category has its own nomination form, nominee type,
            evidence requirements, and geographic classification.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gold/20">
              <thead className="bg-charcoal-light/40 text-gold">
                <tr>
                  <th className="text-left p-3 border-b border-gold/20">Tier</th>
                  <th className="text-left p-3 border-b border-gold/20">Structure</th>
                  <th className="text-left p-3 border-b border-gold/20">Review Route</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Africa Education Icon Award (flagship)", "3 subcategories · 9 laureate positions", "NRC, Icon Jury, and Governance"],
                  ["Influencer Education Impact", "3 subcategories", "NRC and Governance"],
                  ["Platinum Certificates of Recognition", "7 categories · 27 subcategories", "Due diligence, NRC, and Governance"],
                  ["Gold-Blue Garnet Regional Certificates", "9 categories · 63 subcategories", "NRC and Governance"],
                ].map(([t, s, r]) => (
                  <tr key={t} className="border-b border-gold/10">
                    <td className="p-3 text-gold">{t}</td>
                    <td className="p-3">{s}</td>
                    <td className="p-3">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="pt-2">
            <strong className="text-gold">The Africa Education Icon Award</strong> — Lifetime
            Achievement, evaluated across a rolling 2006–2026 window — recognises three pathways,
            each once-in-a-lifetime:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Africa Education Philanthropy Icon</strong></li>
            <li><strong>Literary & New Curriculum Advocate Icon</strong></li>
            <li><strong>Africa Technical Educator Icon</strong></li>
          </ul>
          <p className="text-ivory/75 text-sm">
            Nine Laureates are selected per cycle, drawn from 27 Grand Jury finalists — three per
            pathway-classification group.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Our Reach</h2>
          <p className="text-lg">
            <strong>One continent · Eight African Regions · Two Global Communities</strong>
          </p>
          <p>
            West Africa · East Africa · Central Africa · Southern Africa · North Africa · Horn of
            Africa · Sahel Region · Indian Ocean Islands — connecting Education Enablers among{" "}
            <strong className="text-gold">Diaspora Africans</strong> and through{" "}
            <strong className="text-gold">Friends of Africa</strong>.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">How Recognition Works</h2>
          <p>
            Every nomination is verified by the <strong>Nominee Research Corps (NRC)</strong> —
            structured across Data Entry, Automated Review, and Human Review — using the{" "}
            <strong>Education Development Index (EDI) Matrix</strong>, a category-specific,
            weighted standard assessing access, quality, scale, inclusion, innovation,
            sustainability, evidence quality, partnerships, leadership integrity, and measurable
            outcomes.
          </p>
          <p>
            Only the Africa Education Icon Award proceeds to independent judging — 27 volunteer
            judges, nine specialist panels, culminating in Grand Jury deliberation and Governance
            ratification. The three Certificate tiers move directly from NRC verification to
            Governance approval — no judges, no public voting, no competitive ranking; multiple
            recipients possible per category.
          </p>
          <p>
            Every submission passes through eligibility review, evidence review, duplicate checks,
            verification, and governance/judging review before any recognition is granted —{" "}
            <strong className="text-gold">
              no submission automatically becomes a finalist, winner, or honouree.
            </strong>
          </p>
          <p className="text-ivory/75 text-sm italic">
            Sponsorship, donations, ticket purchases, and gala attendance do not influence nominee
            approval, judging, or Governance decisions at any tier — through 2026 and 2027. From
            2028, our Gold-Blue Garnet tier alone introduces a capped, non-monetary public
            engagement element, disclosed here in advance; the Africa Education Icon Award and
            Platinum Certificates of Recognition remain fully verification-based, with no public
            voting, indefinitely.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Governance</h2>
          <p>
            NESA-Africa operates under the <strong>Santos Creations Educational Foundation's Board
            of Advisors</strong>, which oversees SCEF's full portfolio, including NESA-Africa and
            EduAid-Africa. This Board includes confirmed civil-society representation:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Dr. Martha R.L. Muhwezi</strong> — Executive Director, Forum for African Women Educationalists (FAWE Africa)</li>
            <li><strong>Kossi Tsenou</strong> — Senior Communications Officer, FAWE Africa Regional Secretariat</li>
            <li><strong>Jephthah Ighodaro</strong> — Representative, Civil Society Action Coalition on Education for All (CSACEFA), Lagos Chapter</li>
            <li><strong>Folakemi Adesina, Barrister (Mrs.)</strong> — Representative, CSACEFA Lagos Chapter</li>
          </ul>
          <p className="text-ivory/75 text-sm">
            All Board of Advisors members serve under SCEF's published Conflict of Interest Policy,
            with signed declarations on file. No individual may serve on more than one of: the
            Nominee Research Corps, the Judges Arena, the Governance Committee, or EduAid-Africa's
            CSR Fund Management decision-makers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-display text-xl text-gold">Endorsed By</h3>
            <p><strong>FAWE Africa</strong> · <strong>CSACEFA Lagos Chapter</strong></p>
            <p className="text-xs text-ivory/60 italic">
              Endorsement reflects support for NESA-Africa's mission and methodology. Endorsers do
              not influence nominee approval, judging, or award outcomes.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl text-gold">Sponsored By</h3>
            <p><strong>Get Energy Trading Services</strong></p>
            <p className="text-xs text-ivory/60 italic">
              Sponsorship does not influence nominee approval, judging, or award outcomes.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Legal & Registration</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gold/20">
              <thead className="bg-charcoal-light/40 text-gold">
                <tr>
                  <th className="text-left p-3 border-b border-gold/20">Entity</th>
                  <th className="text-left p-3 border-b border-gold/20">RC Number</th>
                  <th className="text-left p-3 border-b border-gold/20">Registered</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Santos Creations Educational Foundation", "RC-41501", "28 October 2010"],
                  ["New Education Standard Award Africa Ltd", "RC-7381138", "4 March 2024"],
                  ["EduAid Africa Ltd", "RC-7736679", "22 July 2024"],
                  ["GFA Wzip Technology Limited", "RC-8755132", "28 August 2025"],
                ].map(([e, rc, r]) => (
                  <tr key={rc} className="border-b border-gold/10">
                    <td className="p-3">{e}</td>
                    <td className="p-3 text-gold whitespace-nowrap">{rc}</td>
                    <td className="p-3 whitespace-nowrap">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-3xl md:text-4xl text-gold">The 2026 Inaugural Cycle</h2>
          <p>
            NESA-Africa's first public award cycle culminates in the{" "}
            <strong className="text-gold">NESA-Africa 2026 Recognition Gala on 14 December 2026, Lagos, Nigeria</strong>.
            A second cycle Gala follows in <strong>December 2027</strong> (exact date to be confirmed).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Contact</h2>
          <p>19 Godwin Okigbo Street, Marsha, Surulere, Lagos, Nigeria</p>
          <p>+234 805 667 7770 · <a href="mailto:info@nesa.africa" className="text-gold underline">info@nesa.africa</a></p>
        </div>
      </div>
    </section>
  );
}

export default AboutCanonicalContent;
