// NESA-Africa Landing Page Feature
// Focused 6-block conversion funnel with lazy loading

import { lazy } from "react";

import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";

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

// Lazy load below-fold sections
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const PromoVideosSection = lazy(() => import("@/components/nesa/PromoVideosSection").then(m => ({ default: m.PromoVideosSection })));

const BrandNarrativeSection = lazy(() => import("@/components/nesa/BrandNarrativeSection").then(m => ({ default: m.BrandNarrativeSection })));
const AwardSpotlightSection = lazy(() => import("@/components/nesa/AwardSpotlightSection").then(m => ({ default: m.AwardSpotlightSection })));
const GoldSpecialRecognitionSection = lazy(() => import("@/components/nesa/GoldSpecialRecognitionSection").then(m => ({ default: m.GoldSpecialRecognitionSection })));
const ImpactWrapUpSection = lazy(() => import("@/components/nesa/ImpactWrapUpSection").then(m => ({ default: m.ImpactWrapUpSection })));
const MerchandiseShowcase = lazy(() => import("@/components/nesa/MerchandiseShowcase").then(m => ({ default: m.MerchandiseShowcase })));
const ContributorsHallSection = lazy(() => import("@/components/nesa/ContributorsHallSection").then(m => ({ default: m.ContributorsHallSection })));

export function NESALandingPage() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{`${currentEdition?.name || 'NESA-Africa 2026'} | New Education Standard Award Africa`}</title>
        <meta
          name="description"
          content={`${currentEdition.tagline}. ${currentEdition.name} celebrates the real changemakers shaping the future of education across Africa. Nominate now, earn voting points, and vote with AGC for Gold and Blue Garnet winners.`}
        />
        <meta property="og:title" content={`${currentEdition.name} | NESA-Africa`} />
        <meta property="og:description" content={currentEdition.tagline} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesa.africa" />
      </Helmet>

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16 text-center md:text-left">
        <NESAHeader />
        {/* ═══ 1. HERO — Authority ═══ */}
        <TrophyHeroSection />
        
        {/* ═══ 2. Trust Strip ═══ */}
        <TrustLogosStrip />

        {/* ═══ 2b. Award Spotlight — Nominate and Vote ═══ */}
        <LazySection>
          <AwardSpotlightSection />
        </LazySection>

        {/* ═══ 2c. Gold Special Recognition — 2026 Edition ═══ */}
        <LazySection>
          <GoldSpecialRecognitionSection />
        </LazySection>

        {/* ═══ 2d. Impact Wrap-Up — From Recognition to Real Impact ═══ */}
        <LazySection>
          <ImpactWrapUpSection />
        </LazySection>

        {/* ═══ 2e. Brand Narrative — What NESA Africa Represents ═══ */}
        <LazySection>
          <BrandNarrativeSection />
        </LazySection>
        {/* ═══ 3. Quick Actions ═══ */}
        <QuickActionBar />

        {/* ═══ 4. Countdown ═══ */}
        <CountdownSection />






        {/* ═══ 6. Interactive Africa Map ═══ */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>
        
        {/* ═══ 8. Promo Videos ═══ */}
        <LazySection>
          <PromoVideosSection />
        </LazySection>




        {/* ═══ 8c. Merchandise Showcase ═══ */}
        <LazySection>
          <MerchandiseShowcase />
        </LazySection>
        
        {/* ═══ 8d. Contributors Hall of Fame ═══ */}
        <LazySection>
          <ContributorsHallSection compact limit={12} />
        </LazySection>

        {/* ═══ 9. Sponsors ═══ */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* ═══ 10. Page-aware FAQ ═══ */}
        <LazySection>
          <PageFAQSection />
        </LazySection>

        <NESAFooter />
        <BottomPageNav />
      </div>

      {/* Engagement Hooks */}
      <ExitIntentPopup />
      <BackToTopButton />
      <MobileBottomNav />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;
