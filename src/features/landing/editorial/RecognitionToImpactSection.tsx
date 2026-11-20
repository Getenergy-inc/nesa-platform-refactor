import { Link } from "react-router-dom";
import { IMPACT_CHAIN } from "@/config/brandHierarchy";

export function RecognitionToImpactSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-impact-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">From recognition to education action</div>
          <h2 id="ed-impact-heading" className="ed-section-title">From Recognition to Impact</h2>
          <p className="ed-section-sub">Recognition connects to practical support for learners with disabilities across eight operational regions.</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 list-none">
          {IMPACT_CHAIN.map((step, i) => (
            <li key={step.step} className="rounded-lg border border-gold/20 bg-white/[0.03] p-5">
              <div className="ed-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-2 text-base text-white">{step.step}</h3>
              <p className="mt-1.5 text-sm text-white/65">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/support-a-special-needs-school" className="ed-btn-primary">Support a Special-Needs School</Link>
          <Link to="/afri-edutourism" className="ed-btn-ghost">Explore Afri-EduTourism</Link>
        </div>
      </div>
    </section>
  );
}

export default RecognitionToImpactSection;
