import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/config/brandHierarchy";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

export function EditorialHero() {
  return (
    <section className="ed-hero" aria-labelledby="ed-hero-heading">
      <div className="ed-hero-photo" aria-hidden="true"><img src={stageBackdrop} alt="" /></div>

      <div className="ed-hero-content">
        <div className="ed-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          NOMINATIONS OPEN {BRAND.nominationsOpenLabel.toUpperCase()} · {BRAND.cycleLabel.toUpperCase()}
        </div>

        <div className="ed-hero-lead">NESA-<span className="ed-yr">Africa</span></div>
        <div className="ed-quote">&ldquo;{BRAND.programme}&rdquo;</div>

        <h1 id="ed-hero-heading" className="ed-hero-headline">
          Africa&apos;s Education Enablers<br />
          <span className="ed-accent">Deserve to Be Recognised.</span>
        </h1>

        <p className="ed-hero-sub">
          {BRAND.programmeTagline}. Celebrating the people and organisations helping advance Education for All across Africa.
        </p>
        <p className="ed-hero-sub italic">{BRAND.closingLine}</p>

        <div className="ed-hero-cta-row">
          <a
            href={PUBLIC_ACTIONS_2026.nominate.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nominate an Education Enabler for NESA-Africa 2026"
            className="ed-btn-primary"
            onClick={() => trackEvent("hero_cta_click", { slot: "primary", href: PUBLIC_ACTIONS_2026.nominate.href, surface: "home" })}
          >
            Nominate an Education Enabler
          </a>
          <Link
            to={PUBLIC_ACTIONS_2026.exploreAwards.href}
            aria-label="Explore the Awards"
            className="ed-btn-ghost"
            onClick={() => trackEvent("hero_cta_click", { slot: "secondary", href: PUBLIC_ACTIONS_2026.exploreAwards.href, surface: "home" })}
          >
            Explore the Awards →
          </Link>
          <Link to={PUBLIC_ACTIONS_2026.recognitionProcess.href} className="ed-btn-ghost">
            {PUBLIC_ACTIONS_2026.recognitionProcess.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditorialHero;
