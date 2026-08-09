import { Link } from "react-router-dom";
import { useGlobalTeamStats } from "@/hooks/useGlobalTeamStats";

export function VolunteerBandSection() {
  const stats = useGlobalTeamStats();

  const items = [
    { num: stats.people, label: "Volunteers, Judges & NRC" },
    { num: stats.countries, label: "Countries" },
    { num: stats.activeChapters, label: "Active Chapters" },
  ].filter((i) => i.num > 0);

  if (!items.length) return null;

  return (
    <section className="ed-section ed-section-ink" aria-label="Global team">
      <div className="ed-wrap">
        <div className="ed-vol-band">
          {items.map((i) => (
            <div key={i.label} className="ed-vol-stat">
              <div className="ed-vol-num ed-mono">{i.num}</div>
              <div className="ed-vol-label">{i.label}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "0.88rem" }}>
          <Link to="/about/team" className="ed-link-inline">
            Meet the people behind the movement →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default VolunteerBandSection;
