// NESA-Africa Landing Page — 18-section public experience (Master Refactor Spec)
//
// Strict section order (per master prompt):
//   1.  Hero
//   2.  Countdown to Blue-Garnet Gala
//   3.  The Road to NESA-Africa 2026 (pre-opening gallery)
//   4.  Why NESA-Africa Exists
//   5.  Vision, Mission & Strategic Objectives
//   6.  What Makes NESA-Africa Different
//   7.  Recognition Framework (4 tiers · 18 categories · 96 subs)
//   8.  One Continent. Ten Education Regions. One Mission.
//   9.  Explore Africa's Regions
//   10. People Behind the Movement (volunteers)
//   11. Education Stakeholder Endorsements
//   12. Rebuild My School Africa  ┐
//   13. EduAid-Africa             ├─ Combined in ImpactProgramsSection (3 cards)
//   14. NESA-Africa TV            ┘
//   15. Sponsors & Partners
//   16. Governance & Integrity Firewall
//   17. Vision 2035
//   18. Final CTA

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
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

// Lazy below-fold sections
const HomepageGalleryTeaser = lazy(() => import("@/components/gallery/HomepageGalleryTeaser").then(m => ({ default: m.HomepageGalleryTeaser })));
const WhyNESAExistsSection = lazy(() => import("@/components/nesa/WhyNESAExistsSection").then(m => ({ default: m.WhyNESAExistsSection })));
const VisionMissionObjectivesSection = lazy(() => import("@/components/nesa/VisionMissionObjectivesSection").then(m => ({ default: m.VisionMissionObjectivesSection })));
const WhatMakesNESADifferentSection = lazy(() => import("@/components/nesa/WhatMakesNESADifferentSection").then(m => ({ default: m.WhatMakesNESADifferentSection })));
const AwardTiersSummarySection = lazy(() => import("@/components/nesa/AwardTiersSummarySection").then(m => ({ default: m.AwardTiersSummarySection })));
const TenRegionsBannerSection = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const ExploreRegionsSection = lazy(() => import("@/components/nesa/ExploreRegionsSection").then(m => ({ default: m.ExploreRegionsSection })));
const PoweredByVolunteersSection = lazy(() => import("@/components/nesa/PoweredByVolunteersSection").then(m => ({ default: m.PoweredByVolunteersSection })));
const EndorsedBySection = lazy(() => import("@/components/nesa/EndorsedBySection").then(m => ({ default: m.EndorsedBySection })));
const ImpactProgramsSection = lazy(() => import("@/components/nesa/ImpactProgramsSection").then(m => ({ default: m.ImpactProgramsSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const GovernanceFirewallSection = lazy(() => import("@/components/nesa/GovernanceFirewallSection").then(m => ({ default: m.GovernanceFirewallSection })));
const Vision2035RoadmapSection = lazy(() => import("@/components/nesa/Vision2035RoadmapSection").then(m => ({ default: m.Vision2035RoadmapSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));
const WhatIsNESASection = lazy(() => import("@/components/nesa/WhatIsNESASection").then(m => ({ default: m.WhatIsNESASection })));
const WhoWeHonourSection = lazy(() => import("@/components/nesa/WhoWeHonourSection").then(m => ({ default: m.WhoWeHonourSection })));
const SevenPillarsHomeSection = lazy(() => import("@/components/nesa/SevenPillarsHomeSection").then(m => ({ default: m.SevenPillarsHomeSection })));
const HowItWorksHomeSection = lazy(() => import("@/components/nesa/HowItWorksHomeSection").then(m => ({ default: m.HowItWorksHomeSection })));
const RecognitionImpactLegacy = lazy(() => import("@/components/recognition/RecognitionImpactLegacy").then(m => ({ default: m.RecognitionImpactLegacy })));
const RecognitionTiersHomeSection = lazy(() => import("@/components/nesa/RecognitionTiersHomeSection").then(m => ({ default: m.RecognitionTiersHomeSection })));
const WhoWeRecogniseClustersSection = lazy(() => import("@/components/nesa/WhoWeRecogniseClustersSection").then(m => ({ default: m.WhoWeRecogniseClustersSection })));
const TrustStripSection = lazy(() => import("@/components/nesa/TrustStripSection").then(m => ({ default: m.TrustStripSection })));
const CallForNominationIconAward = lazy(() => import("@/components/nesa/CallForNominationIconAward").then(m => ({ default: m.CallForNominationIconAward })));

export function NESALandingPage() {
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t(
          "seo.landing.title",
          "NESA-Africa 2026 | The African Blue-Garnet Awards for Education",
        )}
        description={t(
          "seo.landing.description",
          "A continent in recognition. Nominate, vote for, and support Africa's education changemakers — across 10 regions, 4 award tiers, and 96 subcategories.",
        )}
        ogTitle={t("seo.landing.ogTitle", "NESA-Africa 2026 — A Continent in Recognition")}
        ogDescription={t(
          "seo.landing.ogDescription",
          "The African Blue-Garnet Awards for Education. Recognition → Visibility → Partnerships → Funding → Intervention → Legacy.",
        )}
        keywords={t("seo.landing.keywords", "")}
      />

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16 text-center md:text-left">
        <UtilityBar />
        <NESAHeader />

        {/* 1. HERO */}
        <TrophyHeroSection />

        {/* 2. COUNTDOWN — Blue-Garnet Awards Gala, 22 Oct 2026, Lagos */}
        <CountdownSection />

        {/* 3. THE ROAD TO NESA-AFRICA 2026 — pre-opening moments */}
        <LazySection>
          <HomepageGalleryTeaser />
        </LazySection>

        {/* 3b. WHAT IS NESA-AFRICA — first-time visitor primer */}
        <LazySection>
          <WhatIsNESASection />
        </LazySection>

        {/* 3c. WHO WE HONOUR — 9 recognition identity cards */}
        <LazySection>
          <WhoWeHonourSection />
        </LazySection>

        {/* 3c-ii. WHO WE RECOGNISE — 3-cluster scannable grid */}
        <LazySection>
          <WhoWeRecogniseClustersSection />
        </LazySection>

        {/* 3c-iii. FOUR RECOGNITION TIERS — architecture surface */}
        <LazySection>
          <RecognitionTiersHomeSection />
        </LazySection>

        {/* 3d. 9 RECOGNITION PILLARS — summary linking to /awards/pillars */}
        <LazySection>
          <SevenPillarsHomeSection />
        </LazySection>

        {/* 3d-ii. TRUST STRIP — integrity firewall, one-line */}
        <LazySection>
          <TrustStripSection />
        </LazySection>

        {/* 3e. HOW IT WORKS — 6-step nomination → impact journey */}
        <LazySection>
          <HowItWorksHomeSection />
        </LazySection>

        {/* 3f. RECOGNITION → IMPACT → LEGACY — signature 7-step chain */}
        <LazySection>
          <RecognitionImpactLegacy />
        </LazySection>

        {/* 4. WHY NESA-AFRICA EXISTS */}
        <LazySection>
          <WhyNESAExistsSection />
        </LazySection>

        {/* 5. VISION, MISSION & STRATEGIC OBJECTIVES */}
        <LazySection>
          <VisionMissionObjectivesSection />
        </LazySection>

        {/* 6. WHAT MAKES NESA-AFRICA DIFFERENT */}
        <LazySection>
          <WhatMakesNESADifferentSection />
        </LazySection>

        {/* 7. RECOGNITION FRAMEWORK — 4 tiers · 18 categories · 96 subs */}
        <LazySection>
          <AwardTiersSummarySection />
        </LazySection>

        {/* 8. ONE CONTINENT · TEN EDUCATION REGIONS · ONE MISSION (preview only) */}
        <LazySection>
          <ExploreRegionsSection />
        </LazySection>

        {/* 10. PEOPLE BEHIND THE MOVEMENT — volunteers */}
        <LazySection>
          <PoweredByVolunteersSection />
        </LazySection>

        {/* 11. EDUCATION STAKEHOLDER ENDORSEMENTS */}
        <LazySection>
          <EndorsedBySection />
        </LazySection>

        {/* 12–14. REBUILD MY SCHOOL · EDUAID-AFRICA · NESA-AFRICA TV (combined) */}
        <LazySection>
          <ImpactProgramsSection />
        </LazySection>

        {/* 15. SPONSORS & PARTNERS */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* 16. GOVERNANCE & INTEGRITY FIREWALL */}
        <LazySection>
          <GovernanceFirewallSection />
        </LazySection>

        {/* 17. VISION 2035 */}
        <LazySection>
          <Vision2035RoadmapSection />
        </LazySection>

        {/* 18. FINAL CTA */}
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
