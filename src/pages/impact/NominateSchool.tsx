import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ChevronLeft, ShieldCheck, Mail, Heart, Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GoogleFormDisplay } from "@/components/nominate/GoogleFormDisplay";
import { IntegrityNotice } from "@/components/nominate/IntegrityNotice";
import {
  RMSA_REGIONAL_FORMS,
  getRmsaRegionFormBySlug,
} from "@/config/nomination/rmsaRegionalForms";

export default function NominateSchool() {
  const [params, setParams] = useSearchParams();
  const regionParam = params.get("region");
  const region = useMemo(
    () => (regionParam ? getRmsaRegionFormBySlug(regionParam) : null),
    [regionParam],
  );

  useEffect(() => {
    if (regionParam && !region) {
      // unknown region → clear param
      const next = new URLSearchParams(params);
      next.delete("region");
      setParams(next, { replace: true });
    }
  }, [regionParam, region, params, setParams]);

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: false });
  };

  return (
    <>
      <Helmet>
        <title>Nominate a Special Needs School — EduAid-Africa | NESA-Africa 2026/2027</title>
        <meta
          name="description"
          content="Nominate special needs schools in your African region for EduAid-Africa Special Needs Schools Grant Services and Rebuild My School Africa intervention."
        />
      </Helmet>

      <div className="bg-charcoal min-h-screen">
        <div className="container max-w-5xl py-8 md:py-12 space-y-8">
          {/* Hero */}
          <header className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
              EduAid-Africa · Rebuild My School Africa
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              Nominate a Special Needs School
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-3xl">
              NESA-Africa 2026/2027 invites the public to nominate special needs
              schools for possible support through the EduAid-Africa Special
              Needs Schools Grant Services and the Rebuild My School Africa
              regional intervention program. Submitting this form does not
              guarantee school selection, grant approval, donation allocation
              or intervention approval.
            </p>
          </header>

          {/* What it is */}
          {!region && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 space-y-2">
                <h2 className="font-display text-xl text-white">
                  EduAid-Africa Special Needs Schools Grant Services
                </h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Targeted grant services for special needs schools across
                  Africa — covering rehabilitation, assistive technology,
                  accessibility, teacher training, learning materials,
                  safeguarding, feeding, vocational support and more.
                </p>
              </div>
              <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 space-y-2">
                <h2 className="font-display text-xl text-white">
                  How School Nomination Works
                </h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Select your region, complete the regional Google Form with
                  evidence, and the NESA-Africa intervention team will review
                  for eligibility, regional verification, governance approval
                  and intervention planning. Submission does not guarantee
                  selection.
                </p>
              </div>
            </motion.section>
          )}

          {/* Region selector */}
          {!region && (
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-white">
                Select a Region
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RMSA_REGIONAL_FORMS.map((r) => (
                  <button
                    key={r.slug}
                    type="button"
                    onClick={() => update({ region: r.slug })}
                    className="text-left rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 hover:border-gold hover:bg-charcoal-light/60 transition"
                  >
                    <h3 className="font-display text-lg text-white">
                      {r.region}
                    </h3>
                    {r.shortDescription ? (
                      <p className="text-sm text-white/75 mt-2 leading-relaxed">
                        {r.shortDescription}
                      </p>
                    ) : null}
                    <p className="text-[11px] uppercase tracking-[0.16em] mt-3 text-white/55">
                      Form status: <span className="text-gold">{r.status}</span>
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Selected region — form */}
          {region && (
            <section className="space-y-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => update({ region: null })}
                className="text-white/80 hover:text-gold gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> All regions
              </Button>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold">
                  EduAid-Africa · Special Needs School Intervention
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-white">
                  {region.region} — School Nomination
                </h2>
              </div>

              <IntegrityNotice />

              <div className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-4 text-sm text-white/80 flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                <p>
                  Provide credible evidence about the school: website / social
                  pages, contact person, photos, and any public record. Visits
                  and verification may be required before any intervention.
                </p>
              </div>

              {/* What this form will ask — 10-section preview */}
              <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 space-y-3">
                <h3 className="font-display text-lg text-white">
                  What this form will ask
                </h3>
                <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/80 list-decimal list-inside">
                  <li>Submitter / Nominator Details</li>
                  <li>School Identity</li>
                  <li>Special Needs Category Served</li>
                  <li>Learner and Staff Information</li>
                  <li>Current Needs and Intervention Request</li>
                  <li className="text-gold">
                    EduAid-Africa Special Needs Schools Grant Services
                  </li>
                  <li>Evidence and Verification</li>
                  <li className="text-gold">
                    EduTourism 2027 Commissioning Interest
                  </li>
                  <li className="text-gold">
                    Donate to Rebuild My School Africa
                  </li>
                  <li>Declaration and Integrity Confirmation</li>
                </ol>
                <p className="text-xs text-white/55 pt-1">
                  Sections highlighted in gold are donor / partner / grant
                  intake — pledge and interest only unless payment backend is
                  active.
                </p>
              </div>

              <GoogleFormDisplay
                title={`${region.region} — Special Needs School Nomination`}
                status={region.status}
                formPublicUrl={region.formPublicUrl}
                formEmbedUrl={region.formEmbedUrl}
                gmail={region.gmail}
                prefillHints={[{ label: "Region", value: region.region }]}
              />

              {/* EduTourism & Donation explainers */}
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 space-y-2">
                  <div className="flex items-center gap-2 text-gold">
                    <Plane className="h-4 w-4" />
                    <h3 className="font-display text-lg text-white">
                      EduTourism 2027 Commissioning Interest
                    </h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    EduAid-Africa EduTourism 2027 will support regional
                    education-impact visits, project commissioning, donor
                    visibility and volunteer participation. Use the in-form
                    section to indicate attendance, sponsorship or volunteer
                    interest. Interest does not influence school selection.
                  </p>
                </div>
                <div className="rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 space-y-2">
                  <div className="flex items-center gap-2 text-gold">
                    <Heart className="h-4 w-4" />
                    <h3 className="font-display text-lg text-white">
                      Donate or Pledge to Rebuild My School Africa
                    </h3>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Pledge or interest only — no payment is processed here.
                    Donation, sponsorship, EduTourism participation or public
                    support does <strong>not</strong> guarantee that any school
                    will be selected as a beneficiary. No donor, sponsor or
                    supporter may buy school selection.
                  </p>
                </div>
              </div>
            </section>
          )}

          <section className="pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/impact" className="text-gold hover:underline">
              Impact Reports
            </Link>
            <Link to="/eduaid-africa/rebuild-my-school" className="text-gold hover:underline">
              Rebuild My School Africa
            </Link>
            <a
              href="mailto:nesa.africa@gmail.com"
              className="text-gold hover:underline inline-flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" /> Contact Support
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
