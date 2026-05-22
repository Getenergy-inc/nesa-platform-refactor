// NESA-Africa Landing Page — 14-block conversion funnel (Phase 3)
// Data-driven via Icon + Gold nominee layers.

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { CountdownSection } from "@/components/nesa/CountdownSection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { PageFAQSection, FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy below-fold
const AwardPillarsGrid = lazy(() => import("@/components/landing/AwardPillarsGrid").then(m => ({ default: m.AwardPillarsGrid })));
const EcosystemCarousel = lazy(() => import("@/components/landing/EcosystemCarousel").then(m => ({ default: m.EcosystemCarousel })));
const ImpactWrapUpSection = lazy(() => import("@/components/nesa/ImpactWrapUpSection").then(m => ({ default: m.ImpactWrapUpSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const PromoVideosSection = lazy(() => import("@/components/nesa/PromoVideosSection").then(m => ({ default: m.PromoVideosSection })));
const BePartOfMovementSection = lazy(() => import("@/components/landing/BePartOfMovementSection").then(m => ({ default: m.BePartOfMovementSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));
const HomepageGalleryTeaser = lazy(() => import("@/components/gallery/HomepageGalleryTeaser").then(m => ({ default: m.HomepageGalleryTeaser })));
const CampaignParticipationSlider = lazy(() => import("@/components/landing/CampaignParticipationSlider").then(m => ({ default: m.CampaignParticipationSlider })));
const WearTheMovementSection = lazy(() => import("@/components/landing/WearTheMovementSection").then(m => ({ default: m.WearTheMovementSection })));

export function NESALandingPage() {
  const { currentEdition } = useSeason();
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t("seo.landing.title", `${currentEdition?.name || "NESA-Africa 2026"} | New Education Standard Award Africa`)}
        description={t("seo.landing.description", `${currentEdition.tagline}. ${currentEdition.name} honours Africa's education changemakers.`)}
        ogTitle={t("seo.landing.ogTitle", `${currentEdition.name} | NESA-Africa`)}
        ogDescription={t("seo.landing.ogDescription", currentEdition.tagline)}
        keywords={t("seo.landing.keywords", "")}
      />


      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16 text-center md:text-left">
        <NESAHeader />

        {/* 1. HERO */}
        <TrophyHeroSection />

        {/* 2. GALA COUNTDOWN — urgency immediately after hero */}
        <CountdownSection />

        {/* 3. MOMENTS — 2025 pre-opening emotional proof */}
        <LazySection>
          <HomepageGalleryTeaser />
        </LazySection>

        {/* 4. CAMPAIGN + PARTICIPATION SLIDER */}
        <LazySection>
          <CampaignParticipationSlider />
        </LazySection>

        {/* 5. EXPLORE EXISTING NOMINEES / HONOUREES */}
        <TrustLogosStrip />
        <LazySection>
          <EcosystemCarousel />
        </LazySection>

        {/* 6. FEATURED AWARD CATEGORIES */}
        <LazySection>
          <AwardPillarsGrid />
        </LazySection>

        {/* 7. EXPLORE AFRICA'S REGIONS (before Impact wrap-up) */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 8. IMPACT WRAP-UP */}
        <LazySection>
          <ImpactWrapUpSection />
        </LazySection>

        {/* 9. BE PART OF THE MOVEMENT */}
        <LazySection>
          <BePartOfMovementSection />
        </LazySection>

        {/* 10. WEAR THE MOVEMENT — merchandise */}
        <LazySection>
          <WearTheMovementSection />
        </LazySection>

        {/* 11. FEATURED VIDEOS */}
        <LazySection>
          <PromoVideosSection />
        </LazySection>

        {/* 12. PARTNERS & SPONSORS */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* 13. FAQ */}
        <LazySection>
          <PageFAQSection />
        </LazySection>

        {/* 14. FINAL CTA */}
        <LazySection>
          <FinalCTASection />
        </LazySection>

        <NESAFooter />
        <BottomPageNav />
      </div>

      <ExitIntentPopup />
      <BackToTopButton />
      <MobileBottomNav />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;
