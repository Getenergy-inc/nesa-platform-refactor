// NESA-Africa Landing Page Feature
// Marketing-led welcome page with visual storytelling and governance integrity
// Consolidated 8-block editorial flow with lazy loading

import { lazy } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";

import { NominationPathsCards } from "@/components/nesa/NominationPathsCards";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy load below-fold sections
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

export function NESALandingPage() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{`${currentEdition?.name || 'NESA-Africa 2025'} | New Education Standard Award Africa`}</title>
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
        
        {/* ═══ 1. HERO — Authority ═══ */}
        <TrophyHeroSection />
        
        {/* ═══ 2. Trust Strip ═══ */}
        <TrustLogosStrip />
        
        {/* ═══ 3. Quick Actions ═══ */}
        <QuickActionBar />
        
        {/* ═══ 4. Award Tiers Overview + Category Grid ═══ */}
        <LazySection>
          <CategoriesSection />
        </LazySection>
        
        {/* ═══ 5. Nomination Paths ═══ */}
        <NominationPathsCards />
        
        {/* ═══ 6. How It Works ═══ */}
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* ═══ 7. Sponsors ═══ */}
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
      <BackToTopButton />
    </>
  );
}

export default NESALandingPage;
