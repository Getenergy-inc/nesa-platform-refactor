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
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy load below-fold sections
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const UpcomingEventsSection = lazy(() => import("@/components/nesa/UpcomingEventsSection").then(m => ({ default: m.UpcomingEventsSection })));

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
        
        {/* ═══ 4. Countdown ═══ */}
        <CountdownSection />
        
        {/* ═══ 5. Award Categories ═══ */}
        <LazySection>
          <CategoriesSection />
        </LazySection>
        
        {/* ═══ 6. Sponsors ═══ */}
        <LazySection>
          <SponsorsSection />
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
