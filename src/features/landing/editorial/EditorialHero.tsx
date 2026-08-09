import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";
import { trackEvent } from "@/lib/analytics";
import { BRAND } from "@/config/brandHierarchy";

export function EditorialHero() {
  return (
    <section className="ed-hero" aria-labelledby="ed-hero-heading">
      <div className="ed-hero-photo" aria-hidden="true">
        <img src={stageBackdrop} alt="" />
      </div>

      <div className="ed-hero-content">
        <div className="ed-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          NOMINATIONS OPEN {BRAND.nominationsOpenLabel.toUpperCase()} · {BRAND.cycleLabel.toUpperCase()}
        </div>

        <div className="ed-hero-lead">
          NESA-<span className="ed-yr">Africa</span>
        </div>
        <div className="ed-quote">&ldquo;{BRAND.programme}&rdquo;</div>

        <h1 id="ed-hero-heading" className="ed-hero-headline">
          Africa&apos;s Education Enablers
          <br />
          <span className="ed-accent">Deserve to Be Recognised.</span>
        </h1>

        <p className="ed-hero-sub">
          Celebrating the people and organisations helping advance Education for All across
          Africa.
        </p>

        <div className="ed-hero-cta-row">
          <Link
            to="/nominate"
            className="ed-btn-primary"
            onClick={() =>
              trackEvent("hero_cta_click", { slot: "primary", href: "/nominate", surface: "home" })
            }
          >
            Nominate an Education Enabler
          </Link>
          <Link
            to="/nominees"
            className="ed-btn-ghost"
            onClick={() =>
              trackEvent("hero_cta_click", { slot: "secondary", href: "/nominees", surface: "home" })
            }
          >
            Explore Existing Nominees →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditorialHero;
