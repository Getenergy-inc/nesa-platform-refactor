import { Link } from "react-router-dom";

const ICON_CATEGORIES = [
  {
    title: "Africa Education Philanthropy Icon",
    body:
      "Enablers of Education for All Across Africa who turned wealth into hope — building schools, funding thousands of scholarships, and changing entire systems.",
    href: "/awards/africa-education-icon",
  },
  {
    title: "Literary & New Curriculum Advocate Icon",
    body:
      "Enablers of Education for All Across Africa who reshaped learning and identity — decolonising curricula and championing African stories and indigenous knowledge.",
    href: "/awards/africa-education-icon",
  },
  {
    title: "Africa Technical Educator Icon",
    body:
      "Enablers of Education for All Across Africa who taught the continent to build, code, innovate and lead through technical and digital skills.",
    href: "/awards/africa-education-icon",
  },
];

export function IconLifetimeSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-icon-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">The Africa Education Icon Award</div>
          <h2 id="ed-icon-heading" className="ed-section-title">
            Lifetime Achievement, 2006–2026
          </h2>
          <p className="ed-section-sub">
            For 20 years, quiet heroes have transformed education across our continent. This highest
            honour celebrates lifetime impact and legacy as Enablers of Education for All Across
            Africa.
          </p>
        </div>

        <div className="ed-grid-3">
          {ICON_CATEGORIES.map((c) => (
            <article key={c.title} className="ed-card">
              <div className="ed-card-badge">LIFETIME ACHIEVEMENT · 2006–2026</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <div className="ed-card-cta">
                <Link to="/nominate" className="ed-btn-small">
                  Nominate Now
                </Link>
                <Link to={c.href} className="ed-link-inline">
                  Learn More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default IconLifetimeSection;
