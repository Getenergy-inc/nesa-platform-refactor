import { Link } from "react-router-dom";
import { PROGRAMME_END_LABEL, PROGRAMME_PUBLIC_NOTICE } from "@/config/programme";

/** Static online-programme band; countdowns and physical attendance are retired. */
export function GalaBandSection() {
  return (
    <section className="ed-gala" aria-labelledby="ed-gala-heading">
      <div className="ed-eyebrow">NESA-Africa 2026 Online Recognition Programme</div>
      <h2 id="ed-gala-heading">A Focused Online Recognition Programme</h2>
      <div className="ed-gala-date">{PROGRAMME_END_LABEL.toUpperCase()} · ONLINE ONLY</div>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">A focused online programme with about 20–30 invited live participants, principally recognising up to nine Africa Education Icons, supported by approved Certificates of Recognition, interviews, documentaries and education-impact media.</p>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">{PROGRAMME_PUBLIC_NOTICE}</p>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">No public physical gala, ticket sale, corporate table or public venue is authorised.</p>
      <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
        <Link to="/programme/2026" className="ed-btn-primary">Explore the 2026 Programme</Link>
        <Link to="/contact?subject=media" className="ed-btn-ghost">Receive Programme Updates →</Link>
      </div>
    </section>
  );
}

export default GalaBandSection;
