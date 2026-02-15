// NESA-Africa Landing Page Feature
// Marketing-led welcome page with visual storytelling and governance integrity
// Consolidated 8-block editorial flow with lazy loading

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

// Lazy load below-fold sections
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const VoteWithAGCSection = lazy(() => import("@/components/nesa/VoteWithAGCSection").then(m => ({ default: m.VoteWithAGCSection })));
const EducationChampionsDirectory = lazy(() => import("@/components/nesa/EducationChampionsDirectory").then(m => ({ default: m.EducationChampionsDirectory })));
const LegacyImpactSection = lazy(() => import("@/components/nesa/LegacyImpactSection").then(m => ({ default: m.LegacyImpactSection })));
const IntegritySection = lazy(() => import("@/components/nesa/IntegritySection").then(m => ({ default: m.IntegritySection })));
const EDIIntegrityJourney = lazy(() => import("@/components/nesa/EDIIntegrityJourney").then(m => ({ default: m.EDIIntegrityJourney })));
const MediaShowcaseSection = lazy(() => import("@/components/nesa/MediaShowcaseSection").then(m => ({ default: m.MediaShowcaseSection })));
const UpcomingEventsSection = lazy(() => import("@/components/nesa/UpcomingEventsSection").then(m => ({ default: m.UpcomingEventsSection })));
const JudgesSection = lazy(() => import("@/components/nesa/JudgesSection").then(m => ({ default: m.JudgesSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
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
        
        {/* ═══ ABOVE FOLD ═══ */}
        
        {/* 1. Hero — Trophy + Value Prop */}
        <TrophyHeroSection />
        
        {/* 2. Trust Strip — Grayscale partner logos */}
        <TrustLogosStrip />
        
        {/* 3. Quick Actions — Sticky mobile CTAs */}
        <QuickActionBar />
        
        {/* 4. What's Live — Dynamic engagement blocks */}
        <WhatsLiveSection />
        
        {/* ═══ AWARDS OVERVIEW ═══ */}
        
        <LazySection>
          <CategoriesSection />
        </LazySection>
        
        {/* ═══ NOMINATION ═══ */}
        
        <NominationPathsCards />
        
        {/* ═══ HOW IT WORKS ═══ */}
        
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* ═══ VOTING ═══ */}
        
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>
        
        {/* ═══ GOVERNANCE ═══ */}
        
        <LazySection>
          <IntegritySection />
        </LazySection>
        
        {/* EDI Integrity Wall — Full Lifecycle Journey */}
        <LazySection>
          <EDIIntegrityJourney />
        </LazySection>
        
        <LazySection>
          <JudgesSection />
        </LazySection>
        
        {/* ═══ CHAMPIONS & MEDIA ═══ */}
        
        <LazySection>
          <EducationChampionsDirectory />
        </LazySection>
        
        <LazySection>
          <MediaShowcaseSection />
        </LazySection>
        
        <LazySection>
          <UpcomingEventsSection />
        </LazySection>
        
        {/* ═══ LEGACY ═══ */}
        
        <LazySection>
          <LegacyImpactSection />
        </LazySection>
        
        {/* ═══ CLOSING ═══ */}
        
        <LazySection>
          <SponsorsSection />
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
