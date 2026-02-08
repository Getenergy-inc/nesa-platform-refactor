// NESA-Africa Landing Page Feature
// Marketing-led welcome page with visual storytelling and governance integrity
// Optimized for low bounce rate with lazy loading and engagement hooks

import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { CampaignBanner } from "@/components/nesa/CampaignBanner";
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
const AwardPhasesSection = lazy(() => import("@/components/nesa/AwardPhasesSection").then(m => ({ default: m.AwardPhasesSection })));
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

      {/* Scroll Progress Indicator - Reduces bounce by showing progress */}
      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        
        {/* 1. Trophy Hero - Conversion-first with Blue Garnet visual (Above fold - not lazy) */}
        <TrophyHeroSection />
        
        {/* 2. Trust Logos Strip - Endorsements immediately after hero (Above fold - not lazy) */}
        <TrustLogosStrip />
        
        {/* 3. Campaign Banner - 2025 Nominations Open (Above fold - not lazy) */}
        <CampaignBanner />
        
        {/* 4. Quick Action Bar - Mobile-sticky CTAs */}
        <QuickActionBar />
        
        {/* 5. What's Live - Dynamic blocks encouraging repeat visits (Above fold - not lazy) */}
        <WhatsLiveSection />
        
        {/* 6. Nomination Paths - Scannable cards with clear CTAs (Above fold - not lazy) */}
        <NominationPathsCards />
        
        {/* === BELOW FOLD - LAZY LOADED SECTIONS === */}
        
        {/* 7. Vote with AGC - Visual storytelling block */}
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>
        
        {/* 8. How It Works - Icon flow journey */}
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* 9. Legacy Impact - Rebuild My School Africa */}
        <LazySection>
          <LegacyImpactSection />
        </LazySection>
        
        {/* 10. Integrity Section - Firewalls & governance */}
        <LazySection>
          <IntegritySection />
        </LazySection>
        
        {/* 11. Upcoming Events - Countdown timers */}
        <LazySection>
          <UpcomingEventsSection />
        </LazySection>
        
        {/* 12. Award Phases & Timeline - Programme details */}
        <LazySection>
          <AwardPhasesSection />
        </LazySection>
        
        {/* 13. Watch Section - Media engagement */}
        <LazySection>
          <WatchSection />
        </LazySection>
        
        {/* 13b. NESA Music Section - Official Songs */}
        <LazySection>
          <NESAMusicSection />
        </LazySection>
        
        {/* 14. Education Champions Directory */}
        <LazySection>
          <EducationChampionsDirectory />
        </LazySection>
        
        {/* 15. Sponsors, Judges, Categories - Supporting sections */}
        <LazySection>
          <SponsorsSection />
        </LazySection>
        <LazySection>
          <JudgesSection />
        </LazySection>
        <LazySection>
          <CategoriesSection />
        </LazySection>
        
        {/* 16. Final CTA */}
        <LazySection>
          <FinalCTASection />
        </LazySection>
        
        <NESAFooter />
      </div>

      {/* Engagement Hooks - Reduce bounce rate */}
      <ExitIntentPopup />
      <EngagementToast />
    </>
  );
}

export default NESALandingPage;
