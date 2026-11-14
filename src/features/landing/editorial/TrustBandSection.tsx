import { Link } from "react-router-dom";

const PILLARS = [
  {
    num: "01",
    title: "Independent NRRC Verification",
    body:
      "Every nomination researched and verified by our Nominee Research and Review Corps before review.",
  },
  {
    num: "02",
    title: "Evidence-Based Evaluation",
    body: "Category-specific EDI Matrix standards applied consistently across every tier.",
  },
  {
    num: "03",
    title: "No Public Voting in 2026",
    body:
      "Nine independent Icon judges and nine Icon NRRC members. Nomination is free.",
  },
];

export function TrustBandSection() {
  return (
    <section className="ed-section" aria-label="Integrity safeguards">
      <div className="ed-wrap">
        <div className="ed-trust-band">
          {PILLARS.map((p) => (
            <div key={p.num} className="ed-trust-col">
              <span className="ed-trust-num">{p.num}</span>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
        <p className="ed-disclaimer">
          Recognition Cannot Be Bought. Nomination is free. Sponsorship, donations, partnerships, endorsements, publicity, webinars, podcasts and media participation carry zero weight in eligibility, judging or recognition decisions. <Link to="/about/governance">Read Governance and Integrity →</Link>
        </p>
      </div>
    </section>
  );
}

export default TrustBandSection;
