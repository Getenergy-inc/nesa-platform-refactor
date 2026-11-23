import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import stageBackdrop from "@/assets/nesa-stage-backdrop.jpg";
import { trackEvent } from "@/lib/analytics";

/** Homepage v3 hero: recognise yourself, then act. */
export function EditorialHero() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-hero" aria-labelledby="ed-hero-heading">
      <div className="ed-hero-photo" aria-hidden="true"><img src={stageBackdrop} alt="" /></div>
      <div className="ed-hero-content">
        <div className="ed-badge">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {t("landingV3.hero.eyebrow", "NESA-Africa 2026 · The African Blue-Garnet Awards for Education")}
        </div>
        <h1 id="ed-hero-heading" className="ed-hero-headline">
          {t("landingV3.hero.title", "Are You — or Someone You Know — Enabling Education Across Africa?")}
        </h1>
        <p className="ed-hero-sub">
          {t(
            "landingV3.hero.bodyBefore",
            "NESA-Africa identifies, documents and recognises the people and organisations helping Africans access better education. If their work is opening doors to learning, skills and opportunity, they may be an ",
          )}
          <strong>{t("landingV3.hero.enabler", "Education Enabler Across Africa")}</strong>
          {t("landingV3.hero.bodyAfter", ".")}
        </p>
        <div className="ed-hero-cta-row">
          <a
            href={PUBLIC_ACTIONS_2026.nominate.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-btn-primary"
            onClick={() => trackEvent("hero_cta_click", { slot: "primary", href: PUBLIC_ACTIONS_2026.nominate.href, surface: "home" })}
          >
            {t("landingV3.hero.nominate", "Nominate an Education Enabler")}
          </a>
          <Link
            to="/awards"
            className="ed-btn-ghost"
            onClick={() => trackEvent("hero_cta_click", { slot: "secondary", href: "/awards", surface: "home" })}
          >
            {t("landingV3.hero.recognised", "See Who Can Be Recognised")}
          </Link>
        </div>
        <Link to="/impact/special-needs-schools" className="mt-4 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline">
          {t("landingV3.hero.school", "Or support a special-needs school →")}
        </Link>
        <p className="mt-5 text-sm text-white/70">
          {t("landingV3.hero.trust", "Nomination is free · Evidence-led research · No public voting in the 2026 awards")}
        </p>
      </div>
    </section>
  );
}

export default EditorialHero;
