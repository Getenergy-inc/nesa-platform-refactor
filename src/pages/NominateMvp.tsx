import { useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, BookOpen, ShieldCheck, Mail, ChevronLeft } from "lucide-react";
import { z } from "zod";

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
import {
  AFRICA_REGIONS as CANONICAL_AFRICA_REGIONS,
  AFRICAN_DIASPORA_SLUG,
} from "@/config/regions/africaRegions";

// Influencer Education Impact — 8 Africa Regions + African Diaspora.
// Applied to family === "influencer" so social-media / sports / music tracks
// share one canonical region taxonomy.
const INFLUENCER_REGION_OPTIONS = [
  ...CANONICAL_AFRICA_REGIONS
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      description: `${r.countries.length} countries`,
    })),
  {
    slug: AFRICAN_DIASPORA_SLUG,
    name: "African Diaspora",
    description: "Global Community — Africans making impact from abroad",
  },
];

const INFLUENCER_REGION_NAME_BY_SLUG: Record<string, string> =
  Object.fromEntries(INFLUENCER_REGION_OPTIONS.map((o) => [o.slug, o.name]));

// Legacy / alternate region slugs accepted from external links, mapped to
// canonical Africa-region + African-Diaspora slugs used by INFLUENCER_REGION_OPTIONS.
const INFLUENCER_REGION_ALIASES: Record<string, string> = {
  north: "north-africa",
  "north-africa": "north-africa",
  west: "west-africa",
  "west-africa": "west-africa",
  east: "east-africa",
  "east-africa": "east-africa",
  south: "southern-africa",
  southern: "southern-africa",
  "southern-africa": "southern-africa",
  central: "central-africa",
  "central-africa": "central-africa",
  horn: "horn-of-africa",
  "horn-of-africa": "horn-of-africa",
  sahel: "sahel-region",
  "sahel-region": "sahel-region",
  "indian-ocean": "indian-ocean-islands",
  "indian-ocean-islands": "indian-ocean-islands",
  islands: "indian-ocean-islands",
  diaspora: AFRICAN_DIASPORA_SLUG,
  "african-diaspora": AFRICAN_DIASPORA_SLUG,
  global: AFRICAN_DIASPORA_SLUG,
};

// Zod schema — accepts any short string, normalizes, then validates against
// the canonical influencer region set. Returns undefined for unrecognized input
// so the caller can strip the ?region= param rather than throwing.
const influencerRegionSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(64)
  .transform((raw) => INFLUENCER_REGION_ALIASES[raw])
  .refine((slug): slug is string =>
    typeof slug === "string" && slug in INFLUENCER_REGION_NAME_BY_SLUG,
  );

function normalizeInfluencerRegion(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const parsed = influencerRegionSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

const VALID_FAMILIES = new Set<AwardFamilyId>(
  AWARD_FAMILIES.map((f) => f.id),
);

// Map external subcategory UUIDs (used by category landing pages) to the
// canonical NominateMvp category slug so deep-links such as
// /nominate?subcategory=<uuid> resolve to the correct prefiltered category.
const SUBCATEGORY_UUID_TO_CATEGORY: Record<string, string> = {
  // Political Leaders' Contribution to Education — Nigeria
  "316d2796-bd9f-41cc-9299-e42b4f51b1d3":
    "excellence-in-political-leadership-for-education-nigeria",
  "a87adfeb-4e32-418d-8901-3128e0df4071":
    "excellence-in-political-leadership-for-education-nigeria",
  "9e06ae92-2225-460b-8cf9-73c82851ea4c":
    "excellence-in-political-leadership-for-education-nigeria",
  "6f47bbd7-5940-4932-9551-329abf5e5028":
    "excellence-in-political-leadership-for-education-nigeria",
  "88d367b9-e304-41a5-b9ee-50bc03671884":
    "excellence-in-political-leadership-for-education-nigeria",
  "e748223f-c7d7-4a67-9589-34ceca029834":
    "excellence-in-political-leadership-for-education-nigeria",
  "0b6c53b7-5de7-4ac3-ac97-fa6d8612a42b":
    "excellence-in-political-leadership-for-education-nigeria",
};

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

  // Resolve external subcategory UUIDs (e.g. links from category landing pages)
  // by promoting them to the matching ?category= slug. The UUIDs do not match
  // any internal subcategory slug, so we drop the unresolved ?subcategory=.
  useEffect(() => {
    if (categoryParam || !subcategoryParam) return;
    const resolved = SUBCATEGORY_UUID_TO_CATEGORY[subcategoryParam];
    if (!resolved) return;
    const next = new URLSearchParams(params);
    next.set("category", resolved);
    const target = getCategoryFormBySlug(resolved);
    if (target) next.set("family", target.family);
    next.delete("subcategory");
    setParams(next, { replace: true });
  }, [categoryParam, subcategoryParam, params, setParams]);

  // ── Region param validation + normalization ──────────────────────────
  // For the Influencer family (no per-category region config), coerce any
  // legacy / short / mixed-case ?region= into the canonical 8-region +
  // African-Diaspora slug set. For Africa-Regional categories, drop the
  // ?region= if it doesn't resolve to a real region variant. This runs
  // before submission gating so the form is never opened with a stale slug.
  useEffect(() => {
    if (!regionParam) return;

    // Influencer family: normalize against the canonical influencer set.
    if (family === "influencer" && !category?.isRegionalCategory) {
      const canonical = normalizeInfluencerRegion(regionParam);
      if (canonical === null) {
        const next = new URLSearchParams(params);
        next.delete("region");
        setParams(next, { replace: true });
      } else if (canonical !== regionParam) {
        const next = new URLSearchParams(params);
        next.set("region", canonical);
        setParams(next, { replace: true });
      }
      return;
    }

    // Africa-Regional categories: strip if the region doesn't match a variant.
    if (category?.isRegionalCategory) {
      const variant = getCategoryRegion(category.slug, regionParam);
      if (!variant) {
        const aliased = INFLUENCER_REGION_ALIASES[regionParam.trim().toLowerCase()];
        const retry = aliased ? getCategoryRegion(category.slug, aliased) : null;
        const next = new URLSearchParams(params);
        if (retry) {
          next.set("region", retry.slug);
        } else {
          next.delete("region");
          next.delete("subcategory");
        }
        setParams(next, { replace: true });
      }
    }
  }, [family, category, regionParam, params, setParams]);

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
                  or any GFAwzip Wallet payment does not influence nominee
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

              {/* ── Influencer Africa Region selector (family=influencer, non-regional categories) ── */}
              {family === "influencer" && !category.isRegionalCategory && !regionParam && (
                <div className="space-y-3">
                  <h3 className="font-display text-lg text-white">
                    Select Your Africa Region
                  </h3>
                  <p className="text-sm text-white/75 max-w-3xl">
                    Where is this influencer's primary education impact based?
                    Choose one of the 8 Africa Regions, or African Diaspora for
                    Africans making impact from abroad.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {INFLUENCER_REGION_OPTIONS.map((r) => (
                      <button
                        key={r.slug}
                        type="button"
                        onClick={() => update({ region: r.slug })}
                        className="text-left rounded-xl border border-gold/30 bg-charcoal-light/40 p-4 hover:border-gold hover:bg-charcoal-light/60 transition"
                      >
                        <h4 className="font-display text-base text-white">
                          {r.name}
                        </h4>
                        <p className="text-xs text-white/65 mt-1">{r.description}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                    One Continent. Eight Africa Regions. One African Diaspora Community.
                  </p>
                </div>
              )}

              {/* ── Influencer region context strip (after selection) ── */}
              {family === "influencer" && !category.isRegionalCategory && regionParam && INFLUENCER_REGION_NAME_BY_SLUG[regionParam] && (
                <div className="rounded-xl border border-gold/30 bg-charcoal-light/40 p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-gold/80 font-semibold">
                      Selected Africa Region
                    </p>
                    <h3 className="font-display text-lg text-white">
                      {INFLUENCER_REGION_NAME_BY_SLUG[regionParam]}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => update({ region: null })}
                    className="text-white/80 hover:text-gold gap-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Change region
                  </Button>
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

              {/* Form embed — gated by region (regional + influencer) and zone+state (zonal) */}
              {(!category.isRegionalCategory || regionVariant) &&
                zonalReady &&
                (family !== "influencer" ||
                  category.isRegionalCategory ||
                  (regionParam &&
                    INFLUENCER_REGION_NAME_BY_SLUG[regionParam])) && (
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
                          : family === "influencer" && regionParam && INFLUENCER_REGION_NAME_BY_SLUG[regionParam]
                            ? `${category.name} — ${INFLUENCER_REGION_NAME_BY_SLUG[regionParam]}`
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
                        : family === "influencer" &&
                            regionParam &&
                            INFLUENCER_REGION_NAME_BY_SLUG[regionParam]
                          ? [{ label: "Africa Region", value: INFLUENCER_REGION_NAME_BY_SLUG[regionParam] }]
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
                        successRedirectHref={
                          ({
                            "africa-education-icon": "/awards/africa-education-icon/nominees",
                            "gold-blue-garnet": "/awards/gold-blue-garnet/nominees",
                            "platinum": "/awards/platinum/nominees",
                            "influencer": "/awards/influencer/nominees",
                          } as const)[category.family]
                        }
                        successRedirectLabel={`${AWARD_FAMILIES.find((f) => f.id === category.family)?.name ?? "Tier"} Nominees`}
                      />
                    }

                  />
                </>
              )}
            </section>
          )}

          <section className="pt-6 border-t border-white/10">
            <ExistingNomineesInline
              categorySlug={category?.slug}
              limit={9}
              title="Explore Existing Nominees"
              subtitle={
                category
                  ? "Approved nominees already in this category."
                  : "Approved nominees recognised across NESA-Africa."
              }
            />
          </section>

          {/* ── Footer links ─────────────────────────────────────────── */}
          <section className="pt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
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
