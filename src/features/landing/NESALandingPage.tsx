// NESA-Africa Landing Page — Lean edition (homepage only).
//
// Two messages: (1) Tier 1 Africa Education Icon Award, and (2) after the
// awards, Support a Special-Needs School Across Africa via EduAid-Africa.
//
// Section order (7):
//   1. Hero — eyebrow, title, one line, two CTAs (Icon nomination · school support)
//   2. Public nominations notice (compact, one line)
//   3. Two pillars — Tier 1 Africa Education Icon (three complete category nominee strips)
//      beside one Special Needs Education Support Africa panel with owner-supplied imagery,
//      then governance line
//   4. The four tiers at a glance (TierStripSection)
//   5. Trust — three points, endorser logos, governance link
//   6. Award plaque and NESA-Africa seal
//   7. Focused Online Recognition Programme + single closing CTA
//
// Other homepage components remain in ./editorial for tier and other pages.
// Visual skin lives in ./editorial/editorial.css, scoped under `.nesa-ed`.

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { PublicNominationsNotice } from "@/components/nesa/PublicNominationsNotice";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { MobileBottomActions } from "@/components/navigation/MobileBottomActions";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { FloatingFAQButton } from "@/components/nesa/PageFAQ";

import "./editorial/editorial.css";
import {
  EditorialHero,
  IconGovernanceLine,
  TwoPillarsSection,
  GalaBandSection,
} from "./editorial";

const lean = () => import("./editorial/LeanHomeSections");
const TierStripSection = lazy(() => lean().then((m) => ({ default: m.TierStripSection })));
const TrustPartnersSection = lazy(() => lean().then((m) => ({ default: m.TrustPartnersSection })));
const ClosingCTASection = lazy(() => lean().then((m) => ({ default: m.ClosingCTASection })));
const AwardPlaqueMotionSection = lazy(() => import("@/components/nesa/AwardPlaqueMotionSection"));

export function NESALandingPage() {
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t("seo.landing.title", "NESA-Africa 2026 | Recognising Africa’s Education Enablers")}
        description={t(
          "seo.landing.description",
          "NESA-Africa identifies, documents and recognises people and institutions expanding education access, quality, inclusion, innovation and opportunity across Africa.",
        )}
        ogTitle={t("seo.landing.ogTitle", "NESA-Africa 2026 — A Continent in Recognition")}
        ogDescription={t(
          "seo.landing.ogDescription",
          "Evidence-led research. Independent Icon judging. No public voting in 2026.",
        )}
        keywords={t("seo.landing.keywords", "")}
      />

      <ScrollProgressIndicator />

      <div className="nesa-ed min-h-screen pt-[92px] xl:pt-[104px] pb-16">
        <NESAHeader />

        {/* 1. HERO */}
        <EditorialHero />

        {/* 2. PUBLIC NOTICE (compact) */}
        <PublicNominationsNotice compact />

        {/* 3. TIER 1 · AFRICA EDUCATION ICON */}
        <TwoPillarsSection />
        <div className="pt-10" />
        <IconGovernanceLine />

        {/* 4. THE FOUR TIERS AT A GLANCE */}
        <LazySection><TierStripSection /></LazySection>

        {/* 5. TRUST */}
        <LazySection><TrustPartnersSection /></LazySection>

        {/* 6. AWARD PLAQUE */}
        <LazySection><AwardPlaqueMotionSection /></LazySection>

        {/* 7. FOCUSED ONLINE PROGRAMME + FINAL CTA */}
        <GalaBandSection />
        <LazySection><ClosingCTASection /></LazySection>

        <NESAFooter />
      </div>

      <BackToTopButton />
      <MobileBottomActions />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;
