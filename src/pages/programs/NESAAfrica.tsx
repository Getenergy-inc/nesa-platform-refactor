import { useTranslation } from "react-i18next";
import { lazy } from "react";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";
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
const HowItWorksVisual = lazy(() => import("@/components/nesa/HowItWorksVisual").then(m => ({ default: m.HowItWorksVisual })));
const LegacyImpactSection = lazy(() => import("@/components/nesa/LegacyImpactSection").then(m => ({ default: m.LegacyImpactSection })));
const IntegritySection = lazy(() => import("@/components/nesa/IntegritySection").then(m => ({ default: m.IntegritySection })));
const UpcomingEventsSection = lazy(() => import("@/components/nesa/UpcomingEventsSection").then(m => ({ default: m.UpcomingEventsSection })));
const WatchSection = lazy(() => import("@/components/nesa/WatchSection").then(m => ({ default: m.WatchSection })));
const NESAMusicSection = lazy(() => import("@/components/nesa/NESAMusicSection").then(m => ({ default: m.NESAMusicSection })));
const EducationChampionsDirectory = lazy(() => import("@/components/nesa/EducationChampionsDirectory").then(m => ({ default: m.EducationChampionsDirectory })));

export default function NESAAfrica() {
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/programs/nesa-africa"
        title={t("seo.nesaAfrica.title")}
        description={t("seo.nesaAfrica.description")}
        ogTitle={t("seo.nesaAfrica.ogTitle")}
        ogDescription={t("seo.nesaAfrica.ogDescription")}
        keywords={t("seo.nesaAfrica.keywords")}
      />



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
        
        {/* === BELOW FOLD — Voting & Governance === */}
        
        
        {/* How It Works */}
        <LazySection>
          <HowItWorksVisual />
        </LazySection>
        
        {/* Integrity & Governance */}
        <LazySection>
          <IntegritySection />
        </LazySection>
        
        
        {/* Key Dates */}
        <LazySection>
          <UpcomingEventsSection />
        </LazySection>
        
        {/* === CHAMPIONS & MEDIA === */}
        
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
        
        {/* === LEGACY === */}
        
        {/* Legacy Impact */}
        <LazySection>
          <LegacyImpactSection />
        </LazySection>
        
        
        <NESAFooter />
      </div>
      
      <MobileBottomNav />
    </>
  );
}
