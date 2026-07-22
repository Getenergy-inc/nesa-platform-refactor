import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PORTAL_AREAS } from "@/config/judgeapply/portalRegistry";

export default function PortalHome() {
  return (
    <>
      <Helmet>
        <title>Judges & NRC Portal | NESA-Africa 2026</title>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/15">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-charcoal-light" />
        <div className="relative container py-16 md:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verification · Evidence · Integrity · Impact
          </div>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-tight">
            NESA-Africa <span className="text-gold">Judges & NRC Portal</span>
          </h1>
          <p className="mt-5 max-w-2xl text-white/75 text-base md:text-lg">
            One portal for the two engines that safeguard the integrity of the 2026 recognition
            cycle — the Nominee Research Corps and the Judges Panels. Choose your destination
            below.
          </p>
        </div>
      </section>

      {/* Main destination selector */}
      <section className="container py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {PORTAL_AREAS.map((area) => (
            <Link
              key={area.id}
              to={area.path}
              className="group relative rounded-2xl border border-gold/20 bg-charcoal-light p-6 hover:border-gold/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gold/15 flex items-center justify-center">
                  <area.icon className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gold/80">
                    {area.label}
                  </div>
                  <div className="font-display text-xl text-white">{area.tagline}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">{area.intro}</p>
              <ul className="mt-4 space-y-1 text-xs text-white/55">
                {area.pages.slice(0, 4).map((p) => (
                  <li key={p.slug}>· {p.title}</li>
                ))}
              </ul>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
                Enter {area.label}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-gold/15 bg-charcoal-light p-6 text-sm text-white/70">
          <strong className="text-white">Note:</strong> This portal provides public navigation
          only. It does not grant NRC, judge, governance or administrator permissions.
          Dashboards remain behind authenticated, role-based routes.
        </div>
      </section>
    </>
  );
}
