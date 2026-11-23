// NESA-Africa Landing Page — Homepage v3: "Recognise yourself, then act".
// Retired homepage components remain in ./editorial for other pages and future use.

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
import { EditorialHero } from "./editorial/EditorialHero";
import { GalaBandSection } from "./editorial/GalaBandSection";

const lean = () => import("./editorial/LeanHomeSections");
const homeV3 = () => import("./editorial/HomepageV3Sections");
const HomeHookSection = lazy(() => homeV3().then((m) => ({ default: m.HomeHookSection })));
const HomeIconSection = lazy(() => homeV3().then((m) => ({ default: m.HomeIconSection })));
const HomeEligibilitySection = lazy(() => homeV3().then((m) => ({ default: m.HomeEligibilitySection })));
const TierPreviewCardsSection = lazy(() => lean().then((m) => ({ default: m.TierPreviewCardsSection })));
const HomeRecognitionProcessSection = lazy(() => homeV3().then((m) => ({ default: m.HomeRecognitionProcessSection })));
const HomeSchoolImpactSection = lazy(() => homeV3().then((m) => ({ default: m.HomeSchoolImpactSection })));
const HomeActionSection = lazy(() => homeV3().then((m) => ({ default: m.HomeActionSection })));
const TrustPartnersSection = lazy(() => lean().then((m) => ({ default: m.TrustPartnersSection })));
const ClosingCTASection = lazy(() => lean().then((m) => ({ default: m.ClosingCTASection })));

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

      <div className="nesa-ed min-h-screen pt-[98px] xl:pt-[104px] pb-16">
        <NESAHeader />

        {/* 1. HERO + compact nominations notice */}
        <EditorialHero />
        <PublicNominationsNotice compact />

        {/* 2. THE HOOK */}
        <LazySection><HomeHookSection /></LazySection>

        {/* 3. TIER 1 — WHO IS AN AFRICA EDUCATION ICON? */}
        <LazySection><HomeIconSection /></LazySection>

        {/* 4. WHO IS ELIGIBLE? */}
        <LazySection><HomeEligibilitySection /></LazySection>

        {/* 5. EDUCATION ENABLERS TAKE MANY FORMS */}
        <LazySection><TierPreviewCardsSection /></LazySection>

        {/* 6. HOW RECOGNITION WORKS */}
        <LazySection><HomeRecognitionProcessSection /></LazySection>

        {/* 7. FROM RECOGNITION TO EDUCATION IMPACT */}
        <LazySection><HomeSchoolImpactSection /></LazySection>

        {/* 8. START WITH ONE ACTION */}
        <LazySection><HomeActionSection /></LazySection>

        {/* 9. TRUST + ONLINE PROGRAMME + CLOSING */}
        <LazySection><TrustPartnersSection /></LazySection>
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
