import { Link } from "react-router-dom";

const PILLARS = [
  {
    num: "01",
    title: "Independent NRC Verification",
    body:
      "Every nomination researched and verified by our Nominee Research Corps before review.",
  },
  {
    num: "02",
    title: "Evidence-Based Evaluation",
    body: "Category-specific EDI Matrix standards applied consistently across every tier.",
  },
  {
    num: "03",
    title: "No Public Voting (2026–2027)",
    body:
      "Recognition is determined by judges (Icon only) and Governance — never by vote. Learn about our disclosed 2028 phase.",
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
          Sponsorship, donations, and endorsements do not influence nominee approval, judging, or
          Governance decisions. <Link to="/governance">Read our integrity policy →</Link>
        </p>
      </div>
    </section>
  );
}

export default TrustBandSection;
