import { Link } from "react-router-dom";

const CARDS = [
  {
    title: "Sponsor & Partner",
    body:
      "Back Africa's education recognition movement. Sponsorship supports delivery only — it never influences nominee approval or judging outcomes.",
    cta: "Explore Partnership",
    href: "/partners",
  },
  {
    title: "Donate to EduAid-Africa",
    body:
      "Fund scholarships, school rebuilds and learning access through the Santos Creations Educational Foundation.",
    cta: "Donate Now",
    href: "/donate",
  },
  {
    title: "Volunteer With Us",
    body:
      "Join the volunteer corps powering research, verification, chapters and media across the continent.",
    cta: "See Open Roles",
    href: "/vacancies",
  },
  {
    title: "Become a Reviewer",
    body:
      "Apply to the Nominee Research Corps and help verify the evidence behind every nomination.",
    cta: "Apply to the NRC",
    href: "/nrc/apply",
  },
];

export function SupportSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-support-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">Get Involved</div>
          <h2 id="ed-support-heading" className="ed-section-title">
            Four Ways to Stand Behind Africa&apos;s Educators
          </h2>
        </div>

        <div className="ed-support-grid">
          {CARDS.map((c) => (
            <article key={c.title} className="ed-support-card">
              <h3>{c.title}</h3>
              <p>{c.body}</p>
              <Link to={c.href} className="ed-btn-small">
                {c.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SupportSection;
