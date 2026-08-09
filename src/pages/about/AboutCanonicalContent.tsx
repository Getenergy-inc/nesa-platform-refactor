// AboutCanonicalContent — canonical /about facts block.
// Award-show density: one declarative line per idea, tables and stat callouts
// instead of paragraph stacks. All governance / non-influence / no-public-voting
// text below is protected and reproduced verbatim.

const JOURNEY: [string, string][] = [
  ["1997", "Founded as an educational tourism and cultural heritage vision, Minna, Niger State"],
  ["2006", "Registered as a business name"],
  ["2010", "Incorporated as an NGO — Santos Creations Educational Foundation (RC-41501)"],
  ["2024", "New Education Standard Award Africa Ltd incorporated (RC-7381138)"],
  ["2026", "NESA-Africa's inaugural public award cycle launches"],
];

const ARCHITECTURE: [string, string, string][] = [
  ["Africa Education Icon Award (flagship)", "3 subcategories · 9 laureate positions", "NRC, Icon Jury, and Governance"],
  ["Influencer Education Impact", "3 subcategories", "NRC and Governance"],
  ["Platinum Certificates of Recognition", "7 categories · 27 subcategories", "Due diligence, NRC, and Governance"],
  ["Gold-Blue Garnet Regional Certificates", "9 categories · 63 subcategories", "NRC and Governance"],
];

const REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
  "Horn of Africa",
  "Sahel Region",
  "Indian Ocean Islands",
];

const LEGAL: [string, string, string][] = [
  ["Santos Creations Educational Foundation", "RC-41501", "28 October 2010"],
  ["New Education Standard Award Africa Ltd", "RC-7381138", "4 March 2024"],
  ["EduAid Africa Ltd", "RC-7736679", "22 July 2024"],
  ["GFA Wzip Technology Limited", "RC-8755132", "28 August 2025"],
];

const BOARD = [
  ["Dr. Martha R.L. Muhwezi", "Executive Director, Forum for African Women Educationalists (FAWE Africa)"],
  ["Kossi Tsenou", "Senior Communications Officer, FAWE Africa Regional Secretariat"],
  ["Jephthah Ighodaro", "Representative, Civil Society Action Coalition on Education for All (CSACEFA), Lagos Chapter"],
  ["Folakemi Adesina, Barrister (Mrs.)", "Representative, CSACEFA Lagos Chapter"],
];

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-3xl md:text-4xl text-gold">{children}</h2>;
}

export function AboutCanonicalContent() {
  return (
    <section
      aria-label="About NESA-Africa canonical overview"
      className="bg-charcoal py-20 md:py-28 border-t border-gold/10"
    >
      <div className="container mx-auto px-4 max-w-4xl space-y-20 text-ivory/90">
        {/* WHO WE ARE — one statement */}
        <div className="space-y-4">
          <H>Who We Are</H>
          <p className="text-xl md:text-2xl leading-snug text-ivory">
            A continental education recognition and impact platform — a service of the{" "}
            <strong>Santos Creations Educational Foundation (SCEF)</strong> — identifying, verifying
            and recognising the{" "}
            <strong className="text-gold">
              Enablers of Education for All across Africa: Africans in Africa, Diaspora Africans,
              and Friends of Africa
            </strong>
            .
          </p>
        </div>

        {/* JOURNEY */}
        <div className="space-y-4">
          <H>Our Journey</H>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gold/20">
              <thead className="bg-charcoal-light/40 text-gold">
                <tr>
                  <th className="text-left p-3 border-b border-gold/20">Year</th>
                  <th className="text-left p-3 border-b border-gold/20">Milestone</th>
                </tr>
              </thead>
              <tbody>
                {JOURNEY.map(([y, m]) => (
                  <tr key={y} className="border-b border-gold/10">
                    <td className="p-3 text-gold font-semibold whitespace-nowrap">{y}</td>
                    <td className="p-3">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* WHAT WE RECOGNISE */}
        <div className="space-y-5">
          <H>What We Recognise</H>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ["4", "Tiers"],
              ["18", "Categories"],
              ["96", "Subcategories"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-gold/20 bg-white/[0.03] py-5">
                <p className="font-mono text-3xl md:text-4xl text-gold">{v}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-ivory/60 mt-1">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-ivory/75">
            Each category has its own nomination form, nominee type, evidence requirements, and
            geographic classification.
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
                {ARCHITECTURE.map(([t, s, r]) => (
                  <tr key={t} className="border-b border-gold/10">
                    <td className="p-3 text-gold">{t}</td>
                    <td className="p-3">{s}</td>
                    <td className="p-3">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <strong className="text-gold">Africa Education Icon Award</strong> — Lifetime
            Achievement across a rolling 2006–2026 window. Three once-in-a-lifetime pathways:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Africa Education Philanthropy Icon</strong></li>
            <li><strong>Literary &amp; New Curriculum Advocate Icon</strong></li>
            <li><strong>Africa Technical Educator Icon</strong></li>
          </ul>
          <p className="text-ivory/75 text-sm">
            Nine Laureates per cycle, drawn from 27 Grand Jury finalists — three per
            pathway-classification group.
          </p>
        </div>

        {/* REACH */}
        <div className="space-y-5">
          <H>Our Reach</H>
          <p className="text-xl md:text-2xl text-ivory leading-snug">
            One continent · Eight African Regions · Two Global Communities
          </p>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <span
                key={r}
                className="rounded-full border border-gold/25 bg-white/[0.03] px-4 py-1.5 text-sm text-ivory/85"
              >
                {r}
              </span>
            ))}
            {["Diaspora Africans", "Friends of Africa"].map((r) => (
              <span
                key={r}
                className="rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-sm text-gold font-medium"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* HOW RECOGNITION WORKS — protected text verbatim */}
        <div className="space-y-4">
          <H>How Recognition Works</H>
          <p>
            Every nomination is verified by the <strong>Nominee Research Corps (NRC)</strong> —
            Data Entry, Automated Review, Human Review — using the{" "}
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

        {/* GOVERNANCE — protected COI text verbatim */}
        <div className="space-y-4">
          <H>Governance</H>
          <p className="text-ivory/85">
            NESA-Africa operates under SCEF's <strong>Board of Advisors</strong>, with confirmed
            civil-society representation:
          </p>
          <ul className="space-y-2">
            {BOARD.map(([name, role]) => (
              <li key={name} className="border-l-2 border-gold/40 pl-4">
                <span className="block text-ivory font-semibold">{name}</span>
                <span className="block text-sm text-ivory/70">{role}</span>
              </li>
            ))}
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

        {/* LEGAL */}
        <div className="space-y-4">
          <H>Legal &amp; Registration</H>
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
                {LEGAL.map(([e, rc, r]) => (
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

        {/* CYCLE + CONTACT as stat callouts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-ivory/55 mb-2">
              2026 Inaugural Gala
            </p>
            <p className="font-mono text-2xl md:text-3xl text-gold">13 December 2026</p>
            <p className="text-sm text-ivory/70 mt-2">
              Lagos, Nigeria. Second cycle Gala follows in December 2027 (date to be confirmed).
            </p>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-ivory/55 mb-2">Contact</p>
            <p className="text-sm text-ivory/85">
              19 Godwin Okigbo Street, Marsha, Surulere, Lagos, Nigeria
            </p>
            <p className="text-sm text-ivory/85 mt-1">
              +234 805 667 7770 ·{" "}
              <a href="mailto:info@nesa.africa" className="text-gold underline">
                info@nesa.africa
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutCanonicalContent;
