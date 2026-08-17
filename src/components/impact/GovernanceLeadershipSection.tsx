// Governance & Leadership — SCEF's real, active roster.
// Vacant seats render as "Seat open"; bodies with no active records render an
// honest empty state. Avatars are initials only: no portraits exist here.

import { ShieldCheck } from "lucide-react";
import { SCEF_GOVERNANCE_BODIES, personInitials } from "@/data/scefGovernance";

export default function GovernanceLeadershipSection() {
  return (
    <section className="bg-charcoal text-white px-4 pb-12" aria-labelledby="friends-governance">
      <div className="max-w-6xl mx-auto">
        <h2 id="friends-governance" className="font-playfair text-2xl font-bold text-gold mb-2">
          Governance &amp; Leadership
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-white/65">
          Friends of EduAid-Africa operates under the governance of Santos Creations Educational
          Foundation. Only active, appointed office holders are listed. Seats that remain open are
          shown as open.
        </p>

        <div className="space-y-8">
          {SCEF_GOVERNANCE_BODIES.map((body) => (
            <div key={body.id}>
              <h3 className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-gold/85">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                {body.title}
              </h3>
              {body.note && <p className="mt-1 text-xs text-white/45">{body.note}</p>}

              {body.members.length === 0 ? (
                <p className="mt-3 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-sm text-white/55">
                  {body.emptyState}
                </p>
              ) : (
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {body.members.map((m) => (
                    <li
                      key={`${body.id}-${m.name}-${m.role ?? ""}`}
                      className={`flex items-start gap-3 rounded-xl border p-4 ${
                        m.vacant
                          ? "border-dashed border-white/15 bg-white/[0.02]"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                          m.vacant
                            ? "border border-dashed border-white/25 text-white/40"
                            : "bg-gold/15 text-gold"
                        }`}
                      >
                        {m.vacant ? "—" : personInitials(m.name)}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-semibold ${
                            m.vacant ? "text-white/45 italic" : "text-white"
                          }`}
                        >
                          {m.name}
                        </span>
                        {m.role && (
                          <span className="mt-0.5 block text-xs leading-relaxed text-white/60">
                            {m.role}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
