// Regional School Interventions — "Education Impact Across Africa".
//
// Regional structure REUSED from the canonical platform taxonomy:
// `src/config/regions/africaRegions.ts` (8 Africa regions + African Diaspora).
// No new regional taxonomy is introduced here.
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { AFRICA_REGIONS } from "@/config/regions/africaRegions";
import { IMPACT_BRAND, IMPACT_CTAS, IMPACT_NAV_FOOTER } from "@/config/educationSocialImpact";
import { useImpactSchools } from "@/hooks/useImpactSchools";
import EducationImpactStatsGrid from "@/components/impact/EducationImpactStatsGrid";
import { cn } from "@/lib/utils";

export default function RegionalInterventions() {
  const { schools, loading, error } = useImpactSchools();
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all" ? schools : schools.filter((s) => s.region?.slug === active);

  const countFor = (slug: string) =>
    loading || error ? "—" : schools.filter((s) => s.region?.slug === slug).length.toLocaleString();

  return (
    <>
      <Helmet>
        <title>Regional School Interventions · Education Impact Across Africa</title>
        <meta name="description" content="Browse verified NESA-Africa education interventions across the eight Africa regions — schools, needs, interventions and outcomes." />
        <link rel="canonical" href="https://nesa.africa/impact/regional" />
      </Helmet>

      <section className="bg-charcoal text-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <Link to="/impact" className="hover:text-gold">Education Social Impact</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Regional School Interventions</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gold">
            Education Impact Across Africa
          </h1>
          <p className="mt-3 text-lg text-white/85">Discover Education Impact Across Africa.</p>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            Interventions are organised using the approved NESA-Africa regional structure — eight Africa
            regions, alongside the African Diaspora community.
          </p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {IMPACT_BRAND.fundingLine}
          </p>
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <EducationImpactStatsGrid only={["schools", "learners", "communities", "countries", "regions"]} />
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div role="tablist" aria-label="Filter by region" className="flex flex-wrap gap-2 mb-8">
            <button
              role="tab"
              aria-selected={active === "all"}
              onClick={() => setActive("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                active === "all" ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-white/70 hover:border-gold/40",
              )}
            >
              All regions
            </button>
            {AFRICA_REGIONS.map((r) => (
              <button
                key={r.slug}
                role="tab"
                aria-selected={active === r.slug}
                onClick={() => setActive(r.slug)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                  active === r.slug ? "border-gold bg-gold/15 text-gold" : "border-white/15 text-white/70 hover:border-gold/40",
                )}
              >
                {r.name} <span className="text-white/40">({countFor(r.slug)})</span>
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-white/60">Loading verified regional interventions…</p>
          ) : error ? (
            <p className="text-sm text-white/60">Regional intervention data is temporarily unavailable.</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-8 text-center">
              <p className="text-white/75">No verified intervention is published for this region yet.</p>
              <p className="mt-2 text-sm text-white/55">
                Regional records publish automatically once eligibility, verification and governance steps are complete.
              </p>
              <Link to={IMPACT_NAV_FOOTER.ctaHref} className="mt-5 inline-block rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-charcoal">
                {IMPACT_CTAS.friend}
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <article key={s.id} className="rounded-2xl border border-gold/20 bg-white/[0.03] p-5">
                  <p className="text-[10px] uppercase tracking-wider text-gold/80">{s.region?.name ?? "Region pending"}</p>
                  <h3 className="mt-1 font-playfair text-lg font-bold text-white">{s.name}</h3>
                  <p className="mt-1 text-xs text-white/60">{s.country ?? "—"}</p>
                  <p className="mt-3 text-sm text-white/70 line-clamp-4">{s.description ?? "—"}</p>
                  <p className="mt-3 text-xs text-white/60">
                    Progress: <span className="text-white/90">{s.interventionStatus ?? "—"}</span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
