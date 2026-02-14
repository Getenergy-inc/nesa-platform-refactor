import { Helmet } from "react-helmet-async";
import { lazy } from "react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
import { WhatsLiveSection } from "@/components/nesa/WhatsLiveSection";
import { NominationPathsCards } from "@/components/nesa/NominationPathsCards";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { LazySection } from "@/components/ui/lazy-section";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";

// Lazy load below-fold sections
const VoteWithAGCSection = lazy(() => import("@/components/nesa/VoteWithAGCSection").then(m => ({ default: m.VoteWithAGCSection })));
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const LegacyImpactSection = lazy(() => import("@/components/nesa/LegacyImpactSection").then(m => ({ default: m.LegacyImpactSection })));
const IntegritySection = lazy(() => import("@/components/nesa/IntegritySection").then(m => ({ default: m.IntegritySection })));
const UpcomingEventsSection = lazy(() => import("@/components/nesa/UpcomingEventsSection").then(m => ({ default: m.UpcomingEventsSection })));
const WatchSection = lazy(() => import("@/components/nesa/WatchSection").then(m => ({ default: m.WatchSection })));
const NESAMusicSection = lazy(() => import("@/components/nesa/NESAMusicSection").then(m => ({ default: m.NESAMusicSection })));
const EducationChampionsDirectory = lazy(() => import("@/components/nesa/EducationChampionsDirectory").then(m => ({ default: m.EducationChampionsDirectory })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

/**
 * NESA-Africa Landing Page
 * 
 * Optimized for 90% retention:
 * - Fast paint: Hero + Trust above fold, no blocking modals
 * - Clear journey: What's Live → Choose Path → How It Works → Vote → Legacy
 * - Lazy loaded below-fold sections
 * - Scroll progress indicator for engagement
 * - Sticky quick actions on mobile
 */
export default function NESAAfrica() {
  return (
    <>
      <Helmet>
        <title>NESA-Africa 2025 | New Education Standard Award Africa</title>
        <meta
          name="description"
          content="Honoring Africa's Education Changemakers. NESA-Africa 2025 celebrates the real changemakers shaping the future of education across Africa."
        />
        <meta property="og:title" content="NESA-Africa 2025 | New Education Standard Award Africa" />
        <meta property="og:description" content="Honoring Africa's Education Changemakers across 10 regions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesa.africa" />
      </Helmet>

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pb-16 lg:pb-0">
        <NESAHeader />
        
        {/* === ABOVE FOLD — Fast Paint === */}
        <TrophyHeroSection />
        <TrustLogosStrip />
        
        {/* Sticky Quick Actions (mobile) */}
        <QuickActionBar />
        
        {/* What's Happening Now */}
        <WhatsLiveSection />
        
        {/* Choose Your Path */}
        <NominationPathsCards />
        
        {/* === BELOW FOLD — Lazy Loaded === */}
        
        {/* How It Works */}
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* AGC Voting System */}
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>
        
        {/* Legacy Impact */}
        <LazySection>
          <LegacyImpactSection />
        </LazySection>

        {/* Integrity & Governance */}
        <LazySection>
          <IntegritySection />
        </LazySection>
        
        {/* Key Dates */}
        <LazySection>
          <UpcomingEventsSection />
        </LazySection>
        
        {/* Media */}
        <LazySection>
          <WatchSection />
        </LazySection>
        
        {/* Official Music */}
        <LazySection>
          <NESAMusicSection />
        </LazySection>
        
        {/* Education Champions Directory */}
        <LazySection>
          <EducationChampionsDirectory />
        </LazySection>
        
        {/* Categories Overview */}
        <LazySection>
          <CategoriesSection />
        </LazySection>
        
        {/* Partners & Sponsors */}
        <LazySection>
          <SponsorsSection />
        </LazySection>
        
        {/* Final Call to Action */}
        <LazySection>
          <FinalCTASection />
        </LazySection>
        
        <NESAFooter />
      </div>
      
      <MobileBottomNav />
    </>
  );
}
