import { Link } from "react-router-dom";
import { useCountdown } from "@/hooks/useCountdown";
import { GALA } from "@/config/programme";

export function GalaBandSection() {
  const { days, hours, minutes, seconds } = useCountdown(GALA.dateISO);

  const cells = [
    { v: days, l: "Days" },
    { v: hours, l: "Hours" },
    { v: minutes, l: "Minutes" },
    { v: seconds, l: "Seconds" },
  ];

  return (
    <section className="ed-gala" aria-labelledby="ed-gala-heading">
      <div className="ed-eyebrow">The Blue-Garnet Awards Gala</div>
      <h2 id="ed-gala-heading">NESA-Africa 2026 Gold-Blue Garnet Awards Gala</h2>
      <div className="ed-gala-date">14 DECEMBER 2026 · LAGOS, NIGERIA</div>

      <div className="ed-countdown">
        {cells.map((c) => (
          <div key={c.l} className="ed-cd-cell">
            <div className="ed-cd-value">{String(c.v).padStart(2, "0")}</div>
            <div className="ed-cd-label">{c.l}</div>
          </div>
        ))}
      </div>

      <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
        <Link to="/gala" className="ed-btn-primary">
          Secure Your Gala Seat
        </Link>
        <Link to="/timeline" className="ed-btn-ghost">
          View the Full Timeline →
        </Link>
      </div>
    </section>
  );
}

export default GalaBandSection;
