// NESA-Africa Landing Page Feature
// Full conversion funnel with lazy loading

import { lazy } from "react";

import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";

import { CountdownSection } from "@/components/nesa/CountdownSection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { TopPageNav, BottomPageNav } from "@/components/navigation/PageNavigation";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy load below-fold sections
const CategoriesSection = lazy(() => import("@/components/nesa/CategoriesSection").then(m => ({ default: m.CategoriesSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const UpcomingEventsSection = lazy(() => import("@/components/nesa/UpcomingEventsSection").then(m => ({ default: m.UpcomingEventsSection })));
const PromoVideosSection = lazy(() => import("@/components/nesa/PromoVideosSection").then(m => ({ default: m.PromoVideosSection })));
const MediaShowcaseSection = lazy(() => import("@/components/nesa/MediaShowcaseSection").then(m => ({ default: m.MediaShowcaseSection })));

// Key CTAs
const HowItWorksSection = lazy(() => import("@/components/nesa/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })));
const NominationPathSection = lazy(() => import("@/components/nesa/NominationPathSection").then(m => ({ default: m.NominationPathSection })));
const VoteWithAGCSection = lazy(() => import("@/components/nesa/VoteWithAGCSection").then(m => ({ default: m.VoteWithAGCSection })));
const WhatsNewSection = lazy(() => import("@/components/nesa/WhatsNewSection").then(m => ({ default: m.WhatsNewSection })));
const GetInvolvedSection = lazy(() => import("@/components/nesa/GetInvolvedSection").then(m => ({ default: m.GetInvolvedSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

// Storytelling
const CVOMessageSection = lazy(() => import("@/components/nesa/CVOMessageSection").then(m => ({ default: m.CVOMessageSection })));
const Vision2035Section = lazy(() => import("@/components/nesa/Vision2035Section").then(m => ({ default: m.Vision2035Section })));
const VisionDocumentSection = lazy(() => import("@/components/nesa/VisionDocumentSection").then(m => ({ default: m.VisionDocumentSection })));
const TimelineSection = lazy(() => import("@/components/nesa/TimelineSection").then(m => ({ default: m.TimelineSection })));
const ProgrammeOverviewSection = lazy(() => import("@/components/nesa/ProgrammeOverviewSection").then(m => ({ default: m.ProgrammeOverviewSection })));

// Awards detail
const AwardPhasesSection = lazy(() => import("@/components/nesa/AwardPhasesSection").then(m => ({ default: m.AwardPhasesSection })));
const Phase1Section = lazy(() => import("@/components/nesa/Phase1Section").then(m => ({ default: m.Phase1Section })));
const GoldCertificateSection = lazy(() => import("@/components/nesa/GoldCertificateSection").then(m => ({ default: m.GoldCertificateSection })));
const GoldSpecialRecognitionSection = lazy(() => import("@/components/nesa/GoldSpecialRecognitionSection").then(m => ({ default: m.GoldSpecialRecognitionSection })));
const FirewallsSection = lazy(() => import("@/components/nesa/FirewallsSection").then(m => ({ default: m.FirewallsSection })));
const IntegritySection = lazy(() => import("@/components/nesa/IntegritySection").then(m => ({ default: m.IntegritySection })));

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

      <div className="min-h-screen bg-charcoal pb-16">
        <NESAHeader />
        <TopPageNav />
        
        {/* ═══ 1. HERO — Authority ═══ */}
        <TrophyHeroSection />
        
        {/* ═══ 2. Trust Strip ═══ */}
        <TrustLogosStrip />
        
        {/* ═══ 3. Quick Actions ═══ */}
        <QuickActionBar />
        
        {/* ═══ 4. Countdown ═══ */}
        <CountdownSection />

        {/* ═══ 5. What's New ═══ */}
        <LazySection>
          <WhatsNewSection />
        </LazySection>

        {/* ═══ 6. How It Works ═══ */}
        <LazySection>
          <HowItWorksSection />
        </LazySection>

        {/* ═══ 7. Award Categories ═══ */}
        <LazySection>
          <CategoriesSection />
        </LazySection>

        {/* ═══ 8. Award Phases ═══ */}
        <LazySection>
          <AwardPhasesSection />
        </LazySection>

        {/* ═══ 9. Phase 1 — Nominations ═══ */}
        <LazySection>
          <Phase1Section />
        </LazySection>

        {/* ═══ 10. Nomination Path ═══ */}
        <LazySection>
          <NominationPathSection />
        </LazySection>

        {/* ═══ 11. Gold Special Recognition ═══ */}
        <LazySection>
          <GoldSpecialRecognitionSection />
        </LazySection>

        {/* ═══ 12. Gold Certificate ═══ */}
        <LazySection>
          <GoldCertificateSection />
        </LazySection>

        {/* ═══ 13. Vote with AGC ═══ */}
        <LazySection>
          <VoteWithAGCSection />
        </LazySection>

        {/* ═══ 14. Firewalls ═══ */}
        <LazySection>
          <FirewallsSection />
        </LazySection>

        {/* ═══ 15. Integrity ═══ */}
        <LazySection>
          <IntegritySection />
        </LazySection>

        {/* ═══ 16. Interactive Africa Map ═══ */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* ═══ 17. Timeline ═══ */}
        <LazySection>
          <TimelineSection />
        </LazySection>

        {/* ═══ 18. Programme Overview ═══ */}
        <LazySection>
          <ProgrammeOverviewSection />
        </LazySection>

        {/* ═══ 19. Upcoming Events ═══ */}
        <LazySection>
          <UpcomingEventsSection />
        </LazySection>

        {/* ═══ 20. CVO Message ═══ */}
        <LazySection>
          <CVOMessageSection />
        </LazySection>

        {/* ═══ 21. Vision 2035 ═══ */}
        <LazySection>
          <Vision2035Section />
        </LazySection>

        {/* ═══ 22. Vision Document ═══ */}
        <LazySection>
          <VisionDocumentSection />
        </LazySection>

        {/* ═══ 23. Promo Videos ═══ */}
        <LazySection>
          <PromoVideosSection />
        </LazySection>

        {/* ═══ 24. Watch, Listen & Engage ═══ */}
        <LazySection>
          <MediaShowcaseSection />
        </LazySection>

        {/* ═══ 25. Get Involved ═══ */}
        <LazySection>
          <GetInvolvedSection />
        </LazySection>

        {/* ═══ 26. Sponsors ═══ */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* ═══ 27. Final CTA ═══ */}
        <LazySection>
          <FinalCTASection />
        </LazySection>
        
        <NESAFooter />
        <BottomPageNav />
      </div>

      {/* Engagement Hooks */}
      <ExitIntentPopup />
      <BackToTopButton />
    </>
  );
}

export default NESALandingPage;
