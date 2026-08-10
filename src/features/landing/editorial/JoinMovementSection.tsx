// Homepage §11 Section 8 — "Join the Movement".
// One primary Participate CTA; detail is revealed on /participate (§3 pathway 5).

import { Link } from "react-router-dom";
import { BRAND } from "@/config/brandHierarchy";

const SECONDARY = [
  { label: "Partner", href: "/partners" },
  { label: "Sponsor", href: "/get-involved/gala-sponsorship" },
  { label: "Support", href: "/support" },
];

export function JoinMovementSection() {
  return (
    <section className="ed-section" aria-labelledby="ed-join-heading">
      <div className="ed-wrap text-center">
        <div className="ed-eyebrow">{BRAND.programme}</div>
        <h2 id="ed-join-heading" className="ed-section-title">
          Join the Movement
        </h2>
        <p className="ed-section-sub mx-auto max-w-xl">{BRAND.programmeTagline}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/nominate" className="ed-btn-primary">
            Nominate an Education Enabler
          </Link>
          <Link to="/participate" className="ed-btn-ghost">
            Participate →
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {SECONDARY.map((s) => (
            <Link key={s.href} to={s.href} className="ed-link-inline">
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default JoinMovementSection;
