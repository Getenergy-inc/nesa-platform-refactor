// Support a Special-Needs School — inclusive-education pathway.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { IMPACT_BRAND, SPECIAL_NEEDS_FIELDS, IMPACT_CTAS, IMPACT_NAV_FOOTER } from "@/config/educationSocialImpact";
import { useImpactSchools } from "@/hooks/useImpactSchools";
import EducationImpactStatsGrid from "@/components/impact/EducationImpactStatsGrid";

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

export default function SpecialNeedsSchools() {
  const { schools, loading, error } = useImpactSchools();
  const specialNeeds = schools.filter(
    (s) => (s.schoolType || "").toLowerCase().includes("special") || (s.description || "").toLowerCase().includes("special needs"),
  );

  return (
    <>
      <Helmet>
        <title>Support a Special-Needs School · Education Social Impact</title>
        <meta name="description" content="Advance inclusive education across Africa. Support verified special-needs schools through NESA-Africa Education Social Impact." />
        <link rel="canonical" href="https://nesa.africa/impact/special-needs-schools" />
      </Helmet>

      <section className="bg-charcoal text-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <Link to="/impact" className="hover:text-gold">Education Social Impact</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Support a Special-Needs School</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gold">
            Support a Special-Needs School
          </h1>
          <p className="mt-3 text-lg text-white/85">Advance inclusive education.</p>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            Inclusive education removes the barriers that keep learners with disabilities and additional
            learning needs out of school. Verified special-needs schools are supported with accessibility
            works, assistive resources, inclusive learning spaces and teacher support.
          </p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {IMPACT_BRAND.fundingLine}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/impact/nominate-school" className="rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90">
              Nominate a Special-Needs School
            </Link>
            <Link to={IMPACT_NAV_FOOTER.ctaHref} className="rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10">
              {IMPACT_CTAS.friend}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">Inclusive Education Impact</h2>
          <EducationImpactStatsGrid only={["schools", "learners", "communities", "countries", "completed"]} />
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-2">Schools in the Inclusive Pathway</h2>
          <p className="text-sm text-white/60 mb-6">
            Each record shows {SPECIAL_NEEDS_FIELDS.join(" · ")} where verified data exists. Fields not yet
            verified display as “—”.
          </p>

          {loading ? (
            <p className="text-white/60 text-sm">Loading verified school records…</p>
          ) : error ? (
            <p className="text-white/60 text-sm">
              School records are temporarily unavailable. Please try again shortly.
            </p>
          ) : specialNeeds.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-8 text-center">
              <p className="text-white/75">
                No special-needs school has completed verification for publication yet.
              </p>
              <p className="mt-2 text-sm text-white/55">
                Schools appear here only after programme eligibility and verification are complete. Nominate a
                school to begin the process.
              </p>
              <Link to="/impact/nominate-school" className="mt-5 inline-block rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-charcoal">
                Nominate a Special-Needs School
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {specialNeeds.map((s) => (
                <article key={s.id} className="rounded-2xl border border-gold/20 bg-white/[0.03] p-5">
                  <h3 className="font-playfair text-lg font-bold text-white">{s.name}</h3>
                  <dl className="mt-3 space-y-1 text-xs text-white/70">
                    <div className="flex justify-between gap-3"><dt>Country</dt><dd className="text-white/90">{dash(s.country)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Region</dt><dd className="text-white/90">{dash(s.region?.name)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Learner population</dt><dd className="text-white/90">{s.studentCount === null ? "—" : s.studentCount.toLocaleString()}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Identified need</dt><dd className="text-white/90 text-right">{dash(s.description)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Intervention</dt><dd className="text-white/90 text-right">{dash(s.interventionNotes)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Progress</dt><dd className="text-white/90">{dash(s.interventionStatus)}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Outcome</dt><dd className="text-white/90">{s.endDate ? "Delivered" : "—"}</dd></div>
                  </dl>
                  <Link to={IMPACT_NAV_FOOTER.ctaHref} className="mt-4 inline-block text-sm font-semibold text-gold">
                    {IMPACT_CTAS.supportThisSchool}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
