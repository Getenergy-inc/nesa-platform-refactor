import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";
import trophy from "@/assets/blue-garnet-trophy-icon.png";
import { trackEvent } from "@/lib/analytics";

const CERTIFICATES = [
  "Influencer Education Impact",
  "Diaspora Educational Impact",
  "International Partnership & NGO Education",
  "EduTech Innovation",
  "CSR for Education",
  "Media Organisation",
];

export function EditorialHero() {
  return (
    <section className="ed-hero" aria-labelledby="ed-hero-heading">
      <div className="ed-hero-photo" aria-hidden="true">
        <img src={stageBackdrop} alt="" />
      </div>

      <div className="ed-hero-content">
        <div className="ed-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          NOMINATIONS OPEN 30 AUGUST 2026 · NESA-AFRICA 2026
        </div>

        <div className="ed-hero-lead">
          Africa Education <span className="ed-yr">Icon</span> Award
        </div>
        <div className="ed-quote">&ldquo;The African Blue-Garnet Awards for Education&rdquo;</div>

        <div className="ed-kicker">
          Recognising the Enablers of Education for All Across Africa
        </div>

        <h1 id="ed-hero-heading" className="ed-hero-headline">
          Africa Sees Your Education Impact.
          <br />
          <span className="ed-accent">Africa Appreciates You.</span>
          <br />
          Africa Says Thank You.
        </h1>

        <p className="ed-hero-sub" style={{ fontWeight: 600, color: "var(--ed-gold-bright)" }}>
          The Africa Education Icon Award is Africa&apos;s highest recognition for individuals and
          organisations enabling Education for All across Africa.
        </p>
        <p className="ed-hero-sub">
          Recognising the <b>Enablers of Education for All</b> across Africa — by Africans in
          Africa, Diaspora Africans, and Friends of Africa (individuals, companies, or
          organisations).
        </p>

        <div className="ed-eyebrow" style={{ marginTop: 28, marginBottom: 10 }}>
          Supported by Six Certificates of Recognition
        </div>
        <div className="ed-stat-row">
          {CERTIFICATES.map((c) => (
            <div key={c} className="ed-stat-pill">
              {c}
            </div>
          ))}
        </div>

        <div className="ed-hero-cta-row">
          <Link
            to="/nominate"
            className="ed-btn-primary"
            onClick={() => trackEvent("hero_cta_click", { slot: "primary", href: "/nominate", surface: "home" })}
          >
            Nominate an Education Icon
          </Link>
          <Link
            to="/nominees"
            className="ed-btn-ghost"
            onClick={() => trackEvent("hero_cta_click", { slot: "secondary", href: "/nominees", surface: "home" })}
          >
            Explore the Impact Directory →
          </Link>
        </div>
      </div>

      <div className="ed-trophy-card">
        <img src={trophy} alt="NESA-Africa Blue-Garnet award trophy" />
        <div className="ed-trophy-caption">Africa&apos;s Highest Education Honour</div>
      </div>
    </section>
  );
}

export default EditorialHero;
