import { Helmet } from "react-helmet-async";
import { lazy } from "react";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { LazySection } from "@/components/ui/lazy-section";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";

// Lazy load below-fold sections — consolidated from 15+ to ~8
const FeaturedNomineesSpotlight = lazy(() => import("@/components/nesa/FeaturedNomineesSpotlight").then(m => ({ default: m.FeaturedNomineesSpotlight })));
const NominationPathsCards = lazy(() => import("@/components/nesa/NominationPathsCards").then(m => ({ default: m.NominationPathsCards })));
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const VoteWithAGCSection = lazy(() => import("@/components/nesa/VoteWithAGCSection").then(m => ({ default: m.VoteWithAGCSection })));
const LegacyImpactSection = lazy(() => import("@/components/nesa/LegacyImpactSection").then(m => ({ default: m.LegacyImpactSection })));
const MediaShowcaseSection = lazy(() => import("@/components/nesa/MediaShowcaseSection").then(m => ({ default: m.MediaShowcaseSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

/**
 * NESA-Africa Landing Page — Oscar/Grammy-tier
 * 
 * Consolidated from 15+ sections to 8 focused blocks:
 * Cinematic hero → Nominees spotlight → Nomination paths → 
 * How it works → AGC voting → Legacy → Media → Final CTA
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
        
        {/* 1. Cinematic Hero */}
        <TrophyHeroSection />
        <TrustLogosStrip />
        <QuickActionBar />
        
        {/* 2. Featured Nominees — Grammy-style */}
        <LazySection>
          <FeaturedNomineesSpotlight />
        </LazySection>
        
        {/* 3. Nomination Paths */}
        <LazySection>
          <NominationPathsCards />
        </LazySection>
        
        {/* 4. How It Works */}
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* 5. AGC Voting */}
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>
        
        {/* 6. Legacy Impact */}
        <LazySection>
          <LegacyImpactSection />
        </LazySection>

        {/* 7. Media & Music */}
        <LazySection>
          <MediaShowcaseSection />
        </LazySection>
        
        {/* 8. Partners + Final CTA */}
        <LazySection>
          <SponsorsSection />
        </LazySection>
        
        <LazySection>
          <FinalCTASection />
        </LazySection>
        
        <NESAFooter />
      </div>
      
      <MobileBottomNav />
    </>
  );
}
