import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";
import { trackEvent } from "@/lib/analytics";

/** Lean homepage hero: one line, two actions (Icon nomination · school support). */
export function EditorialHero() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-hero" aria-labelledby="ed-hero-heading">
      <div className="ed-hero-photo" aria-hidden="true"><img src={stageBackdrop} alt="" /></div>
      <div className="ed-hero-content">
        <div className="ed-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {t("landingLean.hero.eyebrow", "NESA-Africa 2026")}
        </div>
        <h1 id="ed-hero-heading" className="ed-hero-headline">
          {t("landingLean.hero.titleLead", "Recognising Africa’s")}<br />
          <span className="ed-accent">{t("landingLean.hero.titleAccent", "Education Enablers")}</span>
        </h1>
        <p className="ed-hero-sub">
          {t("landingLean.hero.line", "The Africa Education Icon Award honours lifetime impact on education across Africa — and every award opens a door to support schools.")}
        </p>
        <div className="ed-hero-cta-row">
          <a
            href={PUBLIC_ACTIONS_2026.nominate.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn-primary"
            onClick={() => trackEvent("hero_cta_click", { slot: "primary", href: PUBLIC_ACTIONS_2026.nominate.href, surface: "home" })}
          >
            {t("landingLean.hero.ctaIcon", "Nominate an Africa Education Icon")}
          </a>
          <Link
            to="/impact/special-needs-schools"
            className="ed-btn-ghost"
            onClick={() => trackEvent("hero_cta_click", { slot: "secondary", href: "/impact/special-needs-schools", surface: "home" })}
          >
            {t("landingLean.hero.ctaSchool", "Support a Special-Needs School")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditorialHero;
