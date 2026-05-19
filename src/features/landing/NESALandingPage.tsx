// NESA-Africa Landing Page — 14-block conversion funnel (Phase 3)
// Data-driven via Icon + Gold nominee layers.

import { lazy } from "react";
import { Helmet } from "react-helmet-async";

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
const BrandNarrativeSection = lazy(() => import("@/components/nesa/BrandNarrativeSection").then(m => ({ default: m.BrandNarrativeSection })));
const AwardPillarsGrid = lazy(() => import("@/components/landing/AwardPillarsGrid").then(m => ({ default: m.AwardPillarsGrid })));
const EcosystemCarousel = lazy(() => import("@/components/landing/EcosystemCarousel").then(m => ({ default: m.EcosystemCarousel })));
const NominateAndVoteSection = lazy(() => import("@/components/landing/NominateAndVoteSection").then(m => ({ default: m.NominateAndVoteSection })));
const ImpactWrapUpSection = lazy(() => import("@/components/nesa/ImpactWrapUpSection").then(m => ({ default: m.ImpactWrapUpSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const PromoVideosSection = lazy(() => import("@/components/nesa/PromoVideosSection").then(m => ({ default: m.PromoVideosSection })));
const BePartOfMovementSection = lazy(() => import("@/components/landing/BePartOfMovementSection").then(m => ({ default: m.BePartOfMovementSection })));
const ContributorsHallSection = lazy(() => import("@/components/nesa/ContributorsHallSection").then(m => ({ default: m.ContributorsHallSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

export function NESALandingPage() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{`${currentEdition?.name || 'NESA-Africa 2026'} | New Education Standard Award Africa`}</title>
        <meta
          name="description"
          content={`${currentEdition.tagline}. ${currentEdition.name} honours Africa's education changemakers — Lifetime Icons, CSR leaders, cultural influencers, and global partners. Nominate, vote with AGC, earn rewards.`}
        />
        <meta property="og:title" content={`${currentEdition.name} | NESA-Africa`} />
        <meta property="og:description" content={currentEdition.tagline} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesaafrica.lovable.app" />
      </Helmet>

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16 text-center md:text-left">
        <NESAHeader />

        {/* 1. HERO */}
        <TrophyHeroSection />

        {/* 2. TRUST STRIP */}
        <TrustLogosStrip />

        {/* 3. ECOSYSTEM CAROUSEL — featured nominees (moved up directly under trust strip) */}
        <LazySection>
          <EcosystemCarousel />
        </LazySection>

        {/* 4. WHAT NESA REPRESENTS */}
        <LazySection>
          <BrandNarrativeSection />
        </LazySection>

        {/* 5. AWARD PILLARS — 4 cinematic cards */}
        <LazySection>
          <AwardPillarsGrid />
        </LazySection>

        {/* 6. NOMINATE · VOTE · EARN */}
        <LazySection>
          <NominateAndVoteSection />
        </LazySection>

        {/* 7. COUNTDOWN */}
        <CountdownSection />

        {/* 8. IMPACT WRAP-UP */}
        <LazySection>
          <ImpactWrapUpSection />
        </LazySection>

        {/* 9. REGIONAL REACH */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 10. FEATURED VIDEOS */}
        <LazySection>
          <PromoVideosSection />
        </LazySection>

        {/* 11. BE PART OF THE MOVEMENT */}
        <LazySection>
          <BePartOfMovementSection />
        </LazySection>

        {/* 12. CONTRIBUTORS HALL */}
        <LazySection>
          <ContributorsHallSection compact limit={12} />
        </LazySection>

        {/* 13. SPONSORS */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* 14. FAQ + FINAL CTA */}
        <LazySection>
          <PageFAQSection />
        </LazySection>
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
