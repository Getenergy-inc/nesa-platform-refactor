import { Link } from "react-router-dom";
import { useSiteStats } from "@/config/siteStats";

export function VolunteerBandSection() {
  const stats = useSiteStats();

  const items = [
    { num: stats.volunteers, label: "Volunteers" },
    { num: stats.volunteerCountries, label: "Countries" },
    { num: stats.activeVolunteerChapters, label: "Active Chapters" },
  ];

  return (
    <section className="ed-section ed-section-ink" aria-label="Volunteer movement">
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
          <Link to="/volunteers" className="ed-link-inline">
            Meet the people behind the movement →
          </Link>
        </p>
      </div>
    </section>
  );
}

export default VolunteerBandSection;
