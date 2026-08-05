import { Link } from "react-router-dom";

const TIERS = [
  {
    title: "Influencer Education Impact",
    body:
      "Verified impact, not follower count. Recognising public figures whose platforms have genuinely advanced education.",
    href: "/awards/influencers-education-impact",
  },
  {
    title: "Platinum Recognition",
    body:
      "Institutions, research bodies, and leadership advancing education systems across the continent.",
    href: "/awards/platinum-recognition",
  },
  {
    title: "Gold-Blue Garnet Regional Recognition",
    body:
      "Corporations, NGOs, and states enabling education across Africa's eight regions.",
    href: "/awards/gold-blue-garnet",
  },
];

export function TierGridSection() {
  return (
    <section className="ed-section ed-section-ink" aria-label="Certificate of Recognition tiers">
      <div className="ed-wrap">
        <div className="ed-grid-3">
          {TIERS.map((t) => (
            <article key={t.title} className="ed-card">
              <div className="ed-card-badge">ENABLERS OF EDUCATION FOR ALL ACROSS AFRICA</div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <Link to={t.href} className="ed-link-inline">
                Explore →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TierGridSection;
