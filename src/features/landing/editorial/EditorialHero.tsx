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
          NESA-AFRICA 2026
        </div>

        <div className="ed-hero-lead">NESA-<span className="ed-yr">Africa</span></div>
        <div className="ed-quote">&ldquo;{BRAND.programme}&rdquo;</div>

        <h1 id="ed-hero-heading" className="ed-hero-headline">
          Recognising Africa&rsquo;s<br />
          <span className="ed-accent">Education Enablers</span>
        </h1>

        <p className="ed-hero-sub">
          The African Blue-Garnet Awards for Education identify, document and recognise people and institutions whose verified work expands education access, quality, inclusion, innovation and opportunity across Africa.
        </p>
        <p className="ed-hero-sub italic">Evidence-led research. Independent Icon judging. No public voting in 2026.</p>

        <div className="ed-hero-cta-row">
          <a
            href={PUBLIC_ACTIONS_2026.nominate.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Submit a Nomination"
            className="ed-btn-primary"
            onClick={() => trackEvent("hero_cta_click", { slot: "primary", href: PUBLIC_ACTIONS_2026.nominate.href, surface: "home" })}
          >
            Submit a Nomination
          </a>
          <Link to="/about#how-it-works" className="ed-btn-ghost">
            How Recognition Works
          </Link>
        </div>
      </div>
    </section>
  );
}

export default EditorialHero;
