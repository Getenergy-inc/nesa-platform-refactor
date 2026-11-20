// NESA-Africa Landing Page — eight-section editorial recognition homepage.
import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { MobileBottomActions } from "@/components/navigation/MobileBottomActions";
import { PublicAccessibilityControls } from "@/components/accessibility/PublicAccessibilityControls";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import "./editorial/editorial.css";
import { EditorialHero, LivingGallerySection, DirectoryStatsSection, RecognitionToImpactSection, GalaBandSection } from "./editorial";

const HowItWorksHomeSection = lazy(() => import("@/components/nesa/HowItWorksHomeSection").then((m) => ({ default: m.HowItWorksHomeSection })));
const RecognitionTiersHomeSection = lazy(() => import("@/components/nesa/RecognitionTiersHomeSection").then((m) => ({ default: m.RecognitionTiersHomeSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then((m) => ({ default: m.FinalCTASection })));

export function NESALandingPage() {
  const { t } = useTranslation("pages");
  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t("seo.landing.title", "NESA-Africa 2026 | Recognising Africa’s Education Enablers")}
        description={t("seo.landing.description", "NESA-Africa identifies, documents and recognises people and institutions expanding education access, quality, inclusion, innovation and opportunity across Africa.")}
        ogTitle={t("seo.landing.ogTitle", "NESA-Africa 2026 | Recognising Africa’s Education Enablers")}
        ogDescription={t("seo.landing.ogDescription", "Evidence-led research. Independent Icon judging. No public voting in 2026.")}
        keywords={t("seo.landing.keywords", "")}
      />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div id="main-content" tabIndex={-1} className="nesa-ed min-h-screen pt-[92px] xl:pt-[104px] pb-16">
        <NESAHeader />
        <EditorialHero />
        <LazySection><DirectoryStatsSection /></LazySection>
        <LazySection><HowItWorksHomeSection /></LazySection>
        <LazySection><RecognitionTiersHomeSection /></LazySection>
        <LazySection><LivingGallerySection /></LazySection>
        <LazySection><GalaBandSection /></LazySection>
        <LazySection><RecognitionToImpactSection /></LazySection>
        <LazySection><FinalCTASection /></LazySection>
        <NESAFooter />
      </div>
      <ExitIntentPopup />
      <BackToTopButton />
      <PublicAccessibilityControls />
      <MobileBottomActions />
    </>
  );
}

export default NESALandingPage;
