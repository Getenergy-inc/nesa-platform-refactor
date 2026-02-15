// NESA-Africa Landing Page Feature
// Marketing-led welcome page with visual storytelling and governance integrity
// Optimized for low bounce rate with lazy loading and engagement hooks

import { lazy } from "react";
import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
import { WhatsLiveSection } from "@/components/nesa/WhatsLiveSection";
import { NominationPathsCards } from "@/components/nesa/NominationPathsCards";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { EngagementToast } from "@/components/nesa/EngagementToast";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy load below-fold sections to improve initial load time
const VoteWithAGCSection = lazy(() => import("@/components/nesa/VoteWithAGCSection").then(m => ({ default: m.VoteWithAGCSection })));
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const LegacyImpactSection = lazy(() => import("@/components/nesa/LegacyImpactSection").then(m => ({ default: m.LegacyImpactSection })));
const IntegritySection = lazy(() => import("@/components/nesa/IntegritySection").then(m => ({ default: m.IntegritySection })));
const UpcomingEventsSection = lazy(() => import("@/components/nesa/UpcomingEventsSection").then(m => ({ default: m.UpcomingEventsSection })));
const WatchSection = lazy(() => import("@/components/nesa/WatchSection").then(m => ({ default: m.WatchSection })));
const NESAMusicSection = lazy(() => import("@/components/nesa/NESAMusicSection").then(m => ({ default: m.NESAMusicSection })));
const EducationChampionsDirectory = lazy(() => import("@/components/nesa/EducationChampionsDirectory").then(m => ({ default: m.EducationChampionsDirectory })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const JudgesSection = lazy(() => import("@/components/nesa/JudgesSection").then(m => ({ default: m.JudgesSection })));
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

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
        
        {/* 1. Trophy Hero — Above fold */}
        <TrophyHeroSection />
        
        {/* 2. Trust Logos Strip — Above fold */}
        <TrustLogosStrip />
        
        {/* 3. Quick Action Bar — Mobile-sticky CTAs */}
        <QuickActionBar />
        
        {/* 4. What's Live — Dynamic blocks */}
        <WhatsLiveSection />
        
        {/* 5. Nomination Paths — Scannable cards */}
        <NominationPathsCards />
        
        {/* === BELOW FOLD === */}
        
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>
        
        <LazySection>
          <LegacyImpactSection />
        </LazySection>
        
        <LazySection>
          <IntegritySection />
        </LazySection>
        
        <LazySection>
          <UpcomingEventsSection />
        </LazySection>
        
        <LazySection>
          <WatchSection />
        </LazySection>
        
        <LazySection>
          <NESAMusicSection />
        </LazySection>
        
        <LazySection>
          <EducationChampionsDirectory />
        </LazySection>
        
        <LazySection>
          <SponsorsSection />
        </LazySection>
        <LazySection>
          <JudgesSection />
        </LazySection>
        <LazySection>
          <CategoriesSection />
        </LazySection>
        
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
