import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, ShieldCheck, Mail, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n";
import { GoogleFormDisplay } from "@/components/nominate/GoogleFormDisplay";
import { NativeCategoryNominationForm } from "@/components/awards/NativeCategoryNominationForm";
import { IntegrityNotice } from "@/components/nominate/IntegrityNotice";
import { ExistingNomineesInline } from "@/components/nominees/ExistingNomineesInline";
import {
  AWARD_CATEGORY_FORMS,
  getCategoryFormBySlug,
  getCategoryFormsByFamily,
  getCategoryRegion,
} from "@/config/nomination/awardCategoryForms";
import {
  AWARD_FAMILIES,
  type AwardFamilyId,
} from "@/config/nomination/types";
import {
  NIGERIA_ZONES,
  getNigeriaZone,
  getNigeriaState,
} from "@/config/nomination/nigeriaZones";
import { changeLanguage } from "@/lib/i18n";
import { isValidLocale } from "@/config/i18n.config";
import { trackEvent } from "@/lib/analytics";

const VALID_FAMILIES = new Set<AwardFamilyId>(
  AWARD_FAMILIES.map((f) => f.id),
);

export default function NominateMvp() {
  const { t, i18n } = useTranslation("nomination");
  const [params, setParams] = useSearchParams();

  const familyParam = params.get("family") as AwardFamilyId | null;
  const categoryParam = params.get("category");
  const subcategoryParam = params.get("subcategory");
  const regionParam = params.get("region") ?? undefined;
  const zoneParam = params.get("zone") ?? undefined;
  const stateParam = params.get("state") ?? undefined;

  const family =
    familyParam && VALID_FAMILIES.has(familyParam) ? familyParam : null;
  const category = categoryParam ? getCategoryFormBySlug(categoryParam) : null;

  // Honor ?lang=
  useEffect(() => {
    const langParam = params.get("lang");
    if (langParam && isValidLocale(langParam) && langParam !== i18n.language) {
      changeLanguage(langParam);
    }
  }, [params, i18n.language]);

  // Mirror i18n -> ?lang=
  useEffect(() => {
    const langParam = params.get("lang");
    if (i18n.language && i18n.language !== langParam) {
      const next = new URLSearchParams(params);
      next.set("lang", i18n.language);
      setParams(next, { replace: true });
    }
  }, [i18n.language, params, setParams]);

  // Analytics on step
  useEffect(() => {
    trackEvent("nominate_mvp_view", {
      family: family ?? null,
      category: category?.slug ?? null,
      subcategory: subcategoryParam ?? null,
      region: regionParam ?? null,
      zone: zoneParam ?? null,
      state: stateParam ?? null,
    });
  }, [family, category?.slug, subcategoryParam, regionParam, zoneParam, stateParam]);

  // ── handlers ──────────────────────────────────────────────────────────
  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { replace: false });
  };

  const familyCategories = useMemo(
    () => (family ? getCategoryFormsByFamily(family) : []),
    [family],
  );

  // Resolve the region variant when category is Africa Regional + ?region= present.
  const regionVariant = useMemo(
    () =>
      category?.isRegionalCategory && regionParam
        ? getCategoryRegion(category.slug, regionParam) ?? null
        : null,
    [category, regionParam],
  );

  // Resolve the Nigeria zone + state when category is zonal.
  const zone = useMemo(
    () =>
      category?.isNigeriaZonalCategory && zoneParam
        ? getNigeriaZone(zoneParam) ?? null
        : null,
    [category, zoneParam],
  );
  const stateEntry = useMemo(
    () =>
      zone && stateParam ? getNigeriaState(zone.slug, stateParam) ?? null : null,
    [zone, stateParam],
  );
  const zonalReady =
    !category?.isNigeriaZonalCategory || (zone !== null && stateEntry !== null);

  // Effective subcategory list — region-specific when applicable.
  const effectiveSubcategories = useMemo(
    () =>
      regionVariant
        ? regionVariant.subcategories
        : category?.subcategories ?? [],
    [regionVariant, category],
  );

  const selectedSubcategory = useMemo(
    () =>
      subcategoryParam
        ? effectiveSubcategories.find((s) => s.slug === subcategoryParam) ?? null
        : null,
    [effectiveSubcategories, subcategoryParam],
  );

  // ── render ────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Nominate — NESA-Africa 2026 | Africa's Blue-Garnet Awards for Education</title>
        <meta
          name="description"
          content="Nominate education changemakers, institutions, NGOs, CSR contributors, creators and policymakers for NESA-Africa 2026 through official category Google Forms."
        />
      </Helmet>

      <div className="bg-charcoal min-h-screen">
        <div className="container max-w-5xl py-8 md:py-12 space-y-8">
          <div className="flex items-center gap-3 justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
                NESA-Africa 2026
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                Public Nomination
              </h1>
            </div>
            <LanguageSwitcher variant="compact" />
          </div>

          {/* ── Flash message (brief §4) ───────────────────────────────── */}
          {!family && !category && (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
                  Start here
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                  How NESA-Africa Nominations Work
                </h2>
              </div>

              <div className="space-y-3 text-sm md:text-base text-white/80 leading-relaxed">
                <p>
                  NESA-Africa nominations help the public identify education
                  changemakers, institutions, creators, CSR contributors, NGOs,
                  schools, public figures, organizations and special needs schools
                  making measurable contributions to education across Africa, the
                  diaspora and friends of Africa.
                </p>
                <p>
                  For this MVP phase, nominations are collected through official
                  NESA-Africa Google Forms while the full nomination portal is
                  being developed.
                </p>
                <p>
                  Please select the correct award category, subcategory or region,
                  then complete the form carefully with credible evidence.
                </p>
                <p>
                  Your submission does not automatically make the nominee a
                  finalist, winner, honouree or selected school intervention
                  beneficiary.
                </p>
                <p>
                  All submissions are subject to eligibility review, category-fit
                  review, evidence review, duplicate checks, verification,
                  governance review and NESA-Africa integrity approval.
                </p>
                <p>
                  Sponsorship, donation, ticket purchase, merchandise purchase,
                  endorsement, media visibility, public voting, AGC participation
                  or AGC Voting Coin participation does not influence nominee
                  approval, finalist selection, judging, regional intervention
                  selection, school selection or award winner selection.
                </p>
              </div>

              <IntegrityNotice />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-gold"
                >
                  <a href="#start">
                    Start Nomination <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2"
                >
                  <Link to="/nominate/guidelines">
                    <BookOpen className="h-4 w-4" />
                    Read Nomination Guidelines
                  </Link>
                </Button>
              </div>
            </motion.section>
          )}

          {/* ── Family selector ───────────────────────────────────────── */}
          {!family && !category && (
            <section id="start" className="space-y-4">
              <h2 className="font-display text-2xl text-white">
                Select an Award Family
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AWARD_FAMILIES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => update({ family: f.id, category: null, subcategory: null, region: null, zone: null, state: null })}
                    className="text-left rounded-2xl border border-gold/30 bg-charcoal-light/40 p-6 hover:border-gold hover:bg-charcoal-light/60 transition group"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold">
                      {f.tagline}
                    </p>
                    <h3 className="font-display text-xl text-white mt-1 group-hover:text-gold transition">
                      {f.name}
                    </h3>
                    <p className="text-sm text-white/75 mt-2 leading-relaxed">
                      {f.description}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── Category selector ─────────────────────────────────────── */}
          {family && !category && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => update({ family: null })}
                  className="text-white/80 hover:text-gold gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> All families
                </Button>
              </div>
              <h2 className="font-display text-2xl text-white">
                {AWARD_FAMILIES.find((f) => f.id === family)?.name} — Choose a Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familyCategories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => update({ category: c.slug, subcategory: null })}
                    className="text-left rounded-2xl border border-gold/30 bg-charcoal-light/40 p-5 hover:border-gold hover:bg-charcoal-light/60 transition"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold">
                      {c.group}
                    </p>
                    <h3 className="font-display text-lg text-white mt-1">
                      {c.name}
                    </h3>
                    {c.shortDescription ? (
                      <p className="text-sm text-white/75 mt-2 leading-relaxed">
                        {c.shortDescription}
                      </p>
                    ) : null}
                    <p className="text-[11px] uppercase tracking-[0.16em] mt-3 text-white/55">
                      Form status: <span className="text-gold">{c.status}</span>
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* ── Selected category — subcategory + form ───────────────── */}
          {category && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => update({ category: null, subcategory: null, region: null, zone: null, state: null })}
                  className="text-white/80 hover:text-gold gap-1"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to categories
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-gold/80 font-semibold">
                  {category.group}
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-white">
                  {category.name}
                </h2>
                {category.shortDescription ? (
                  <p className="text-sm text-white/75 max-w-3xl">
                    {category.shortDescription}
                  </p>
                ) : null}
              </div>

              {/* ── Region selector (Africa Regional categories only) ── */}
              {category.isRegionalCategory && category.regions && !regionVariant && (
                <div className="space-y-3">
                  <h3 className="font-display text-lg text-white">
                    Select Your Africa Region
                  </h3>
                  <p className="text-sm text-white/75 max-w-3xl">
                    Please select your Africa region to open the correct
                    regional nomination form. Each region has its own
                    subcategories, country dropdown, and Google Form.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.regions.map((r) => (
                      <button
                        key={r.slug}
                        type="button"
                        onClick={() =>
                          update({ region: r.slug, subcategory: null })
                        }
                        className="text-left rounded-xl border border-gold/30 bg-charcoal-light/40 p-4 hover:border-gold hover:bg-charcoal-light/60 transition"
                      >
                        <h4 className="font-display text-base text-white">
                          {r.name}
                        </h4>
                        <p className="text-xs text-white/65 mt-1">
                          {r.countries.length} countries · {r.subcategories.length} subcategories
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.16em] mt-2 text-white/55">
                          Form status: <span className="text-gold">{r.status}</span>
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Region context strip (after a region is chosen) ──── */}
              {regionVariant && (
                <div className="rounded-xl border border-gold/30 bg-charcoal-light/40 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
                        Selected region
                      </p>
                      <h3 className="font-display text-lg text-white">
                        {regionVariant.name}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => update({ region: null, subcategory: null })}
                      className="text-white/80 hover:text-gold gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Change region
                    </Button>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Eligible countries: {regionVariant.countries.join(", ")}.
                  </p>
                </div>
              )}

              {/* ── Nigeria zone selector (zonal categories only) ─────── */}
              {category.isNigeriaZonalCategory && !zone && (
                <div className="space-y-3">
                  <h3 className="font-display text-lg text-white">
                    Select a Geopolitical Zone
                  </h3>
                  <p className="text-sm text-white/75 max-w-3xl">
                    Nominations for this category are organized by Nigeria's 6
                    geopolitical zones. Choose the zone where the political
                    leader's education impact is based.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {NIGERIA_ZONES.map((z) => (
                      <button
                        key={z.slug}
                        type="button"
                        onClick={() =>
                          update({ zone: z.slug, state: null, subcategory: null })
                        }
                        className="text-left rounded-xl border border-gold/30 bg-charcoal-light/40 p-4 hover:border-gold hover:bg-charcoal-light/60 transition"
                      >
                        <h4 className="font-display text-base text-white">
                          {z.name}
                        </h4>
                        <p className="text-xs text-white/65 mt-1">
                          {z.states.length} states
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Nigeria state selector (after zone is chosen) ─────── */}
              {category.isNigeriaZonalCategory && zone && !stateEntry && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
                        Selected zone
                      </p>
                      <h3 className="font-display text-lg text-white">
                        {zone.name} — Choose a State / FCT
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        update({ zone: null, state: null, subcategory: null })
                      }
                      className="text-white/80 hover:text-gold gap-1"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" /> Change zone
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zone.states.map((s) => (
                      <button
                        key={s.slug}
                        type="button"
                        onClick={() =>
                          update({ state: s.slug, subcategory: null })
                        }
                        className="px-4 py-2 rounded-full text-sm border border-gold/40 text-white/85 hover:bg-gold/10 hover:text-gold transition"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Zone + state context strip ────────────────────────── */}
              {category.isNigeriaZonalCategory && zone && stateEntry && (
                <div className="rounded-xl border border-gold/30 bg-charcoal-light/40 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
                        Selected zone & state
                      </p>
                      <h3 className="font-display text-lg text-white">
                        {stateEntry.name} · {zone.name}
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          update({ state: null, subcategory: null })
                        }
                        className="text-white/80 hover:text-gold gap-1"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Change state
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          update({ zone: null, state: null, subcategory: null })
                        }
                        className="text-white/80 hover:text-gold gap-1"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Change zone
                      </Button>
                    </div>
                  </div>
                  {category.leadershipRoles && (
                    <p className="text-xs text-white/70 leading-relaxed">
                      Eligible leadership roles: {category.leadershipRoles.join(", ")}.
                    </p>
                  )}
                </div>
              )}

              {/* Subcategory selector — region / zone-scoped when applicable */}
              {(!category.isRegionalCategory || regionVariant) &&
              zonalReady &&
              effectiveSubcategories.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-display text-lg text-white">
                    {category.isNigeriaZonalCategory
                      ? "Choose an Education Impact Subcategory"
                      : "Choose a Subcategory"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {effectiveSubcategories.map((s) => {
                      const active = subcategoryParam === s.slug;
                      return (
                        <button
                          key={s.slug}
                          type="button"
                          onClick={() =>
                            update({ subcategory: active ? null : s.slug })
                          }
                          className={
                            "px-4 py-2 rounded-full text-sm border transition " +
                            (active
                              ? "bg-gold text-charcoal border-gold font-semibold"
                              : "border-gold/40 text-white/85 hover:bg-gold/10 hover:text-gold")
                          }
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {/* Form embed — gated by region (regional) and zone+state (zonal) */}
              {(!category.isRegionalCategory || regionVariant) && zonalReady && (
                <>
                  <IntegrityNotice />

                  <div className="rounded-xl border border-gold/20 bg-charcoal-light/30 p-4 text-sm text-white/80 flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                    <p>
                      Provide at least one credible evidence link (website, news
                      article, foundation report, social profile, or public record).
                      Unverifiable nominations may be removed during review.
                    </p>
                  </div>

                  <GoogleFormDisplay
                    title={
                      regionVariant
                        ? `${category.name} — ${regionVariant.name}`
                        : zone && stateEntry
                          ? `${category.name} — ${stateEntry.name} (${zone.name})`
                          : category.name
                    }
                    status={regionVariant?.status ?? category.status}
                    formPublicUrl={
                      regionVariant?.formPublicUrl ?? category.formPublicUrl
                    }
                    formEmbedUrl={
                      regionVariant?.formEmbedUrl ?? category.formEmbedUrl
                    }
                    gmail={category.gmail}
                    prefillHints={[
                      { label: "Award category", value: category.name },
                      ...(regionVariant
                        ? [{ label: "Region", value: regionVariant.name }]
                        : []),
                      ...(zone
                        ? [{ label: "Geopolitical zone", value: zone.name }]
                        : []),
                      ...(stateEntry
                        ? [{ label: "State / FCT", value: stateEntry.name }]
                        : []),
                      ...(selectedSubcategory
                        ? [{ label: "Subcategory", value: selectedSubcategory.name }]
                        : []),
                    ]}
                    fallback={
                      <NativeCategoryNominationForm
                        form={category}
                        defaultSubcategorySlug={selectedSubcategory?.slug}
                      />
                    }
                  />
                </>
              )}
            </section>
          )}

          {/* ── Footer links ─────────────────────────────────────────── */}
          <section className="pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/nominees" className="text-gold hover:underline">
              Explore Existing Nominees
            </Link>
            <Link to="/nominate/guidelines" className="text-gold hover:underline">
              Nomination Guidelines
            </Link>
            <a
              href="mailto:nesa.africa@gmail.com"
              className="text-gold hover:underline inline-flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" /> Contact Support
            </a>
            <Link to="/nominate/advanced" className="text-white/60 hover:text-gold">
              Use advanced multi-nominee flow
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

// Export the catalogue for tests / consumers
export { AWARD_CATEGORY_FORMS };
