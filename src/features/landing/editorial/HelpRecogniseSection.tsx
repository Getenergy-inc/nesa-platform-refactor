// Homepage closing CTA — mirrors the hero's two actions.

import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

export function HelpRecogniseSection() {
  return (
    <section className="ed-section ed-section-ink" aria-labelledby="ed-help-recognise-heading">
      <div className="ed-wrap text-center">
        <h2 id="ed-help-recognise-heading" className="ed-section-title">
          Help Us Document Education Impact Responsibly
        </h2>
        <p className="ed-section-sub">
          Know a person, institution or programme whose work deserves evidence-based consideration?
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/nominate"
            className="ed-btn-primary"
            onClick={() =>
              trackEvent("hero_cta_click", { slot: "primary", href: "/nominate", surface: "home-final" })
            }
          >
            Submit a Nomination
          </Link>
          <Link
            to="/nominate#nominator-guidelines"
            className="ed-btn-ghost"
            onClick={() =>
                trackEvent("hero_cta_click", { slot: "secondary", href: "/nominate#nominator-guidelines", surface: "home-final" })
            }
          >
            Read the Nomination Guide →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HelpRecogniseSection;
