// Impact Reports — transparent programme reporting.
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import {
  IMPACT_BRAND,
  IMPACT_REPORT_FIELDS,
  IMPACT_TRUST_STATEMENTS,
  IMPACT_CTAS,
  IMPACT_NAV_FOOTER,
} from "@/config/educationSocialImpact";
import { useImpactSchools } from "@/hooks/useImpactSchools";
import EducationImpactStatsGrid from "@/components/impact/EducationImpactStatsGrid";

export default function ImpactReports() {
  const { schools, loading, error } = useImpactSchools();
  const reported = schools.filter((s) => s.isSupported);

  return (
    <>
      <Helmet>
        <title>Impact Reports · NESA-Africa Education Social Impact</title>
        <meta name="description" content="Transparent reporting on funds received, allocation, interventions delivered, beneficiaries, outcomes and remaining needs across Africa." />
        <link rel="canonical" href="https://nesa.africa/impact/reports" />
      </Helmet>

      <section className="bg-charcoal text-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <Link to="/impact" className="hover:text-gold">Education Social Impact</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Impact Reports</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gold">Impact Reports</h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            Every published intervention is reported against a fixed disclosure set so that Friends of
            EduAid-Africa, schools and communities can see exactly what was funded and what changed.
          </p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {IMPACT_BRAND.fundingLine}
          </p>
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <EducationImpactStatsGrid />
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-4">What Every Report Discloses</h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {IMPACT_REPORT_FIELDS.map((f) => (
              <li key={f} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/75">
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-2xl font-bold text-gold mb-5">Published Reports</h2>
          {loading ? (
            <p className="text-sm text-white/60">Loading published reports…</p>
          ) : error ? (
            <p className="text-sm text-white/60">Reports are temporarily unavailable. Please try again shortly.</p>
          ) : reported.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-gold/70" />
              <p className="mt-3 text-white/75">No intervention report has been published yet.</p>
              <p className="mt-2 text-sm text-white/55">
                Reports publish only after delivery, verification and governance sign-off. No projected or
                estimated figures are shown anywhere on this page.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {reported.map((s) => (
                <article key={s.id} className="rounded-2xl border border-gold/20 bg-white/[0.03] p-5">
                  <h3 className="font-playfair text-lg font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-white/60">{s.country ?? "—"} · {s.region?.name ?? "—"}</p>
                  <dl className="mt-3 space-y-1 text-xs text-white/70">
                    <div className="flex justify-between gap-3"><dt>Intervention delivered</dt><dd className="text-white/90 text-right">{s.interventionNotes ?? "—"}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Beneficiaries</dt><dd className="text-white/90">{s.studentCount === null ? "—" : s.studentCount.toLocaleString()}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Status</dt><dd className="text-white/90">{s.interventionStatus ?? "—"}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Started</dt><dd className="text-white/90">{s.startDate ?? "—"}</dd></div>
                    <div className="flex justify-between gap-3"><dt>Completed</dt><dd className="text-white/90">{s.endDate ?? "—"}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2">
            {IMPACT_TRUST_STATEMENTS.map((t) => (
              <div key={t.title} className="rounded-xl border border-gold/20 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold text-gold">{t.title}</h3>
                <p className="mt-2 text-sm text-white/70">{t.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/impact/stories" className="rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10">
              {IMPACT_CTAS.stories}
            </Link>
            <Link to={IMPACT_NAV_FOOTER.ctaHref} className="rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90">
              {IMPACT_CTAS.friend}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
