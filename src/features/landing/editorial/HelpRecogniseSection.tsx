// Homepage closing CTA — mirrors the hero's two actions.

import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

export function HelpRecogniseSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-help-recognise-heading">
      <div className="ed-wrap text-center">
        <h2 id="ed-help-recognise-heading" className="ed-section-title">
          Help Recognise Africa&apos;s Education Enablers
        </h2>
        <p className="ed-section-sub">
          Know someone helping advance Education for All across Africa? Help their story be
          discovered.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/nominate"
            className="ed-btn-primary"
            onClick={() =>
              trackEvent("hero_cta_click", { slot: "primary", href: "/nominate", surface: "home-final" })
            }
          >
            Nominate an Education Enabler
          </Link>
          <Link
            to="/nominees"
            className="ed-btn-ghost"
            onClick={() =>
              trackEvent("hero_cta_click", { slot: "secondary", href: "/nominees", surface: "home-final" })
            }
          >
            Explore Existing Nominees →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HelpRecogniseSection;
