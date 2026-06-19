// NESA-Africa Landing Page — Africa's largest education recognition,
// impact, volunteer, media, partnership, scholarship, and legacy movement.
// Movement-first hierarchy (not award-centric).

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { CountdownSection } from "@/components/nesa/CountdownSection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { UtilityBar } from "@/components/nesa/UtilityBar";
import { LazySection } from "@/components/ui/lazy-section";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { MobileStickyNominateCTA } from "@/components/nesa/MobileStickyNominateCTA";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy below-fold
const VisionMissionSection = lazy(() => import("@/components/nesa/VisionMissionSection").then(m => ({ default: m.VisionMissionSection })));
const FifteenObjectivesSection = lazy(() => import("@/components/nesa/FifteenObjectivesSection").then(m => ({ default: m.FifteenObjectivesSection })));
const EcosystemModulesSection = lazy(() => import("@/components/nesa/EcosystemModulesSection").then(m => ({ default: m.EcosystemModulesSection })));
const RegionsIntroSection = lazy(() => import("@/components/nesa/RegionsIntroSection").then(m => ({ default: m.RegionsIntroSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const PoweredByVolunteersSection = lazy(() => import("@/components/nesa/PoweredByVolunteersSection").then(m => ({ default: m.PoweredByVolunteersSection })));
const ChangemakersIntroSection = lazy(() => import("@/components/nesa/ChangemakersIntroSection").then(m => ({ default: m.ChangemakersIntroSection })));
const FeaturedChangemakersSection = lazy(() => import("@/components/nesa/FeaturedChangemakersSection").then(m => ({ default: m.FeaturedChangemakersSection })));
const NomineeDiscoverySwitcher = lazy(() => import("@/components/nominees/NomineeDiscoverySwitcher").then(m => ({ default: m.NomineeDiscoverySwitcher })));
const ImpactProgramsSection = lazy(() => import("@/components/nesa/ImpactProgramsSection").then(m => ({ default: m.ImpactProgramsSection })));
const WatchMediaSection = lazy(() => import("@/components/nesa/WatchMediaSection").then(m => ({ default: m.WatchMediaSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const GovernanceFirewallSection = lazy(() => import("@/components/nesa/GovernanceFirewallSection").then(m => ({ default: m.GovernanceFirewallSection })));
const Vision2035Section = lazy(() => import("@/components/nesa/Vision2035Section").then(m => ({ default: m.Vision2035Section })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));

export function NESALandingPage() {
  useSeason();
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t("seo.landing.title", `NESA-Africa | Africa's Largest Education Recognition & Impact Movement`)}
        description={t("seo.landing.description", `NESA-Africa is Africa's largest education recognition and impact ecosystem — uniting awards, scholarships, volunteers, sponsors, NESA TV, EduAid-Africa, Rebuild My School Africa and Afri-EduTourism across 10 education regions.`)}
        ogTitle={t("seo.landing.ogTitle", `NESA-Africa — Africa's Education Movement`)}
        ogDescription={t("seo.landing.ogDescription", `Recognition. Impact. Volunteers. Sponsors. Scholarships. Media. Ten regions. One movement.`)}
        keywords={t("seo.landing.keywords", "")}
      />

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16 text-center md:text-left">
        <UtilityBar />
        <NESAHeader />

        {/* 1 — HERO */}
        <TrophyHeroSection />
        <TrustLogosStrip />

        {/* 2 — COUNTDOWN TO OCTOBER 22, 2026 */}
        <CountdownSection />

        {/* 3 — VISION, MISSION & PURPOSE */}
        <LazySection>
          <VisionMissionSection />
        </LazySection>

        {/* 4 — 15 STRATEGIC OBJECTIVES */}
        <LazySection>
          <FifteenObjectivesSection />
        </LazySection>

        {/* 5 — THE NESA-AFRICA ECOSYSTEM (10 modules) */}
        <LazySection>
          <EcosystemModulesSection />
        </LazySection>

        {/* 6 — ONE CONTINENT. TEN EDUCATION REGIONS */}
        <LazySection>
          <RegionsIntroSection />
        </LazySection>
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 7 — MEET THE VOLUNTEERS BUILDING NESA-AFRICA */}
        <LazySection>
          <PoweredByVolunteersSection />
        </LazySection>

        {/* 8 — AFRICA EDUCATION HALL OF FAME */}
        <LazySection>
          <ChangemakersIntroSection />
        </LazySection>
        <LazySection>
          <FeaturedChangemakersSection />
        </LazySection>
        <LazySection>
          <NomineeDiscoverySwitcher />
        </LazySection>

        {/* 9 — EDUAID-AFRICA · REBUILD MY SCHOOL AFRICA · AFRI-EDUTOURISM */}
        <LazySection>
          <ImpactProgramsSection />
        </LazySection>

        {/* 10 — NESA TV */}
        <LazySection>
          <WatchMediaSection />
        </LazySection>

        {/* 11 — SPONSORS & PARTNERS */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* 12 — GOVERNANCE FIREWALL (short trust section) */}
        <LazySection>
          <GovernanceFirewallSection />
        </LazySection>

        {/* 13 — VISION 2035 ROADMAP */}
        <LazySection>
          <Vision2035Section />
        </LazySection>

        {/* 14 — FINAL CALL TO ACTION */}
        <LazySection>
          <FinalCTASection />
        </LazySection>

        <NESAFooter />
        <BottomPageNav />
      </div>

      <ExitIntentPopup />
      <BackToTopButton />
      <MobileBottomNav />
      <MobileStickyNominateCTA source="homepage" />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;

