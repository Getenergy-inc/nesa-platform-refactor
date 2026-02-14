// NESA-Africa Landing Page Feature
// Oscar/Grammy-tier marketing experience with cinematic hero and editorial content
// Optimized for low bounce rate with lazy loading and engagement hooks

import { lazy } from "react";
import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { EngagementToast } from "@/components/nesa/EngagementToast";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy load below-fold sections
const FeaturedNomineesSpotlight = lazy(() => import("@/components/nesa/FeaturedNomineesSpotlight").then(m => ({ default: m.FeaturedNomineesSpotlight })));
const NominationPathsCards = lazy(() => import("@/components/nesa/NominationPathsCards").then(m => ({ default: m.NominationPathsCards })));
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const VoteWithAGCSection = lazy(() => import("@/components/nesa/VoteWithAGCSection").then(m => ({ default: m.VoteWithAGCSection })));
const LegacyImpactSection = lazy(() => import("@/components/nesa/LegacyImpactSection").then(m => ({ default: m.LegacyImpactSection })));
const MediaShowcaseSection = lazy(() => import("@/components/nesa/MediaShowcaseSection").then(m => ({ default: m.MediaShowcaseSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

/**
 * NESALandingPage — Oscar/Grammy-tier experience
 * 
 * Consolidated from 15+ sections to 8 focused blocks:
 * 1. Cinematic Hero (full-viewport trophy showcase)
 * 2. Trust Strip (credibility bar)
 * 3. Featured Nominees (Grammy-style editorial cards)
 * 4. Nomination Paths (choose your journey)
 * 5. How It Works + AGC Voting (process flow)
 * 6. Legacy Impact (Rebuild My School Africa)
 * 7. Media & Music (merged showcase)
 * 8. Partners + Final CTA
 */
export function NESALandingPage() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{currentEdition.name} | New Education Standard Award Africa</title>
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

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        
        {/* 1. Cinematic Hero — Full viewport, trophy-dominant */}
        <TrophyHeroSection />
        
        {/* 2. Trust Strip — Credibility bar */}
        <TrustLogosStrip />
        
        {/* Mobile Quick Actions */}
        <QuickActionBar />
        
        {/* === BELOW FOLD — Lazy Loaded === */}
        
        {/* 3. Featured Nominees — Grammy-style editorial cards */}
        <LazySection>
          <FeaturedNomineesSpotlight />
        </LazySection>
        
        {/* 4. Nomination Paths — Choose your journey */}
        <LazySection>
          <NominationPathsCards />
        </LazySection>
        
        {/* 5. How It Works */}
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* 6. AGC Voting System */}
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>
        
        {/* 7. Legacy Impact */}
        <LazySection>
          <LegacyImpactSection />
        </LazySection>

        {/* 8. Media & Music — Merged showcase */}
        <LazySection>
          <MediaShowcaseSection />
        </LazySection>
        
        {/* 9. Partners */}
        <LazySection>
          <SponsorsSection />
        </LazySection>
        
        {/* 10. Final CTA */}
        <LazySection>
          <FinalCTASection />
        </LazySection>
        
        <NESAFooter />
      </div>

      {/* Engagement Hooks */}
      <ExitIntentPopup />
      <EngagementToast />
    </>
  );
}

export default NESALandingPage;
