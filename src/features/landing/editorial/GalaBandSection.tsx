import { Link } from "react-router-dom";
import { ONLINE_GALA, PROGRAMME_END_LABEL } from "@/config/programme";

/** Static online-programme band; countdowns and physical attendance are retired. */
export function GalaBandSection() {
  return (
    <section className="ed-gala" aria-labelledby="ed-gala-heading">
      <div className="ed-eyebrow">NESA-Africa 2026 Online Awards Gala</div>
      <h2 id="ed-gala-heading">{ONLINE_GALA.copy.focus}</h2>
      <div className="ed-gala-date">{PROGRAMME_END_LABEL.toUpperCase()} · ONLINE ONLY</div>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">{ONLINE_GALA.copy.summary} {ONLINE_GALA.copy.restrictions}</p>
      <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
        <Link to="/programme-2026" className="ed-btn-primary">Explore the Online Awards Gala</Link>
        <Link to="/timeline" className="ed-btn-ghost">View the Full Timeline →</Link>
      </div>
    </section>
  );
}

export default GalaBandSection;
