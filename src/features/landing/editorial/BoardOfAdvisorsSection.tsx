const BOARD = [
  {
    name: "Dr. Martha R.L. Muhwezi",
    role: "Executive Director, Forum for African Women Educationalists (FAWE Africa)",
    bio: "Over 25 years advancing girls' and women's education across 33 countries.",
  },
  {
    name: "Kossi Tsenou",
    role: "Senior Communications Officer, FAWE Africa Regional Secretariat",
    bio: "Leads strategic communication across FAWE's 34 national chapters.",
  },
  {
    name: "Jephthah Ighodaro",
    role: "Representative, CSACEFA Lagos Chapter",
    bio: "Researcher and education consultant in community development and social welfare.",
  },
  {
    name: "Folakemi Adesina, Barrister (Mrs.)",
    role: "Representative, CSACEFA Lagos Chapter",
    bio: "Founder, Do Good Charity Initiative; Country Leader, GivingTuesday Nigeria.",
  },
];

export function BoardOfAdvisorsSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-board-heading">
      <div className="ed-wrap">
        <div className="ed-eyebrow" style={{ marginBottom: 14 }}>
          Governance
        </div>
        <h2 id="ed-board-heading" className="ed-section-title" style={{ marginTop: 0 }}>
          SCEF&apos;s Board of Advisors
        </h2>
        <p style={{ color: "var(--ed-stone)", maxWidth: 620, marginTop: 10 }}>
          NESA-Africa operates under the Santos Creations Educational Foundation&apos;s Board of
          Advisors, which includes confirmed civil-society representation, each under signed
          Conflict of Interest declarations.
        </p>

        <div className="ed-board-grid">
          {BOARD.map((m) => (
            <article key={m.name} className="ed-board-card">
              <div className="ed-board-name">{m.name}</div>
              <div className="ed-board-role">{m.role}</div>
              <div className="ed-board-bio">{m.bio}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BoardOfAdvisorsSection;
