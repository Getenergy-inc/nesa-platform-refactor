import { Link } from "react-router-dom";
import { useSiteStats } from "@/config/siteStats";
import { trackEvent } from "@/lib/analytics";

const ROWS = [
  {
    tier: "Africa Education Icon Award",
    structure: "3 subcategories · 9 laureate positions",
    review: "NRC, Icon Jury and governance",
    href: "/awards/africa-education-icon",
  },
  {
    tier: "Influencer Education Impact",
    structure: "3 subcategories",
    review: "NRC and governance",
    href: "/awards/influencers-education-impact",
  },
  {
    tier: "Platinum Recognition",
    structure: "7 categories · 27 subcategories",
    review: "Due diligence, NRC and governance",
    href: "/awards/platinum-recognition",
  },
  {
    tier: "Gold-Blue Garnet Recognition",
    structure: "9 categories · 63 subcategories",
    review: "NRC and governance",
    href: "/awards/gold-blue-garnet",
  },
];

export function ArchitectureTableSection() {
  const stats = useSiteStats();

  return (
    <section className="ed-section" aria-labelledby="ed-arch-heading">
      <div className="ed-wrap">
        <div className="ed-section-head">
          <div className="ed-eyebrow">NESA-Africa 2026 Recognition</div>
          <h2 id="ed-arch-heading" className="ed-section-title">
            Recognition Architecture at a Glance
          </h2>
          <p className="ed-section-sub">
            {stats.tiers} tiers · {stats.categories} categories · {stats.subcategories}{" "}
            subcategories. Each category has its own nomination form, nominee type, evidence
            requirements and geographic classification.
          </p>
        </div>

        <div className="ed-arch">
          <div className="ed-arch-row ed-arch-header">
            <div>Tier</div>
            <div>Structure</div>
            <div>Review Route</div>
            <div />
          </div>
          {ROWS.map((row) => (
            <div key={row.tier} className="ed-arch-row">
              <div className="ed-arch-tier">{row.tier}</div>
              <div className="ed-arch-cell">{row.structure}</div>
              <div className="ed-arch-cell">{row.review}</div>
              <div className="ed-arch-view">
                <Link
                  to={row.href}
                  className="ed-link-inline"
                  onClick={() =>
                    trackEvent("home_cta_click", {
                      cta: "architecture_row",
                      label: row.tier,
                      to: row.href,
                      section: "recognition_architecture",
                    })
                  }
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link to="/awards" className="ed-btn-primary">
            Explore the Complete Recognition Framework →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureTableSection;
