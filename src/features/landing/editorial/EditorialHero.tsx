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
          {t("landingLean.hero.eyebrow", "NESA-Africa 2026 · The African Blue-Garnet Awards for Education")}
        </div>
        <h1 id="ed-hero-heading" className="ed-hero-headline">
          {t("landingLean.hero.titleLead", "Are You — or Someone You Know —")}<br />
          <span className="ed-accent">{t("landingLean.hero.titleAccent", "Enabling Education Across Africa?")}</span>
        </h1>
        <p className="ed-hero-sub">
          {t("landingLean.hero.line", "NESA-Africa identifies, documents and recognises the people and organisations helping Africans access better education. If their work is opening doors to learning, skills and opportunity, they may be an Education Enabler Across Africa.")}
        </p>
        <div className="ed-hero-cta-row">
          <a
            href={PUBLIC_ACTIONS_2026.nominate.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn-primary"
            onClick={() => trackEvent("hero_cta_click", { slot: "primary", href: PUBLIC_ACTIONS_2026.nominate.href, surface: "home" })}
          >
            {t("landingLean.hero.ctaIcon", "Nominate an Education Enabler")}
          </a>
          <Link
            to="/awards"
            className="ed-btn-ghost"
            onClick={() => trackEvent("hero_cta_click", { slot: "secondary", href: "/awards", surface: "home" })}
          >
            {t("landingLean.hero.ctaSchool", "See Who Can Be Recognised")}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditorialHero;
