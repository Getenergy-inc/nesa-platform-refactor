// NESA-Africa Landing Page — gateway-first information architecture.
// Flow: Hero → Countdown → Why → Vision/Mission → Ecosystem → Regions (summary)
// → Volunteers → RMSA Impact → EduAid → NESA TV → Sponsors (logos) → Governance
// → Vision 2035 → Final CTA. Nominee directory, full categories, detailed
// regions, governance detail, and About content live on dedicated routes.

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
import { useSeason } from "@/contexts/SeasonContext";

// Lazy below-fold
const WhyNESAExistsSection = lazy(() => import("@/components/nesa/WhyNESAExistsSection").then(m => ({ default: m.WhyNESAExistsSection })));
const VisionMissionObjectivesSection = lazy(() => import("@/components/nesa/VisionMissionObjectivesSection").then(m => ({ default: m.VisionMissionObjectivesSection })));
const EcosystemCarousel = lazy(() => import("@/components/landing/EcosystemCarousel").then(m => ({ default: m.EcosystemCarousel })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const PoweredByVolunteersSection = lazy(() => import("@/components/nesa/PoweredByVolunteersSection").then(m => ({ default: m.PoweredByVolunteersSection })));
const ImpactProgramsSection = lazy(() => import("@/components/nesa/ImpactProgramsSection").then(m => ({ default: m.ImpactProgramsSection })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const GovernanceFirewallSection = lazy(() => import("@/components/nesa/GovernanceFirewallSection").then(m => ({ default: m.GovernanceFirewallSection })));
const Vision2035RoadmapSection = lazy(() => import("@/components/nesa/Vision2035RoadmapSection").then(m => ({ default: m.Vision2035RoadmapSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));
const HomepageGalleryTeaser = lazy(() => import("@/components/gallery/HomepageGalleryTeaser").then(m => ({ default: m.HomepageGalleryTeaser })));
const AwardTiersSummarySection = lazy(() => import("@/components/nesa/AwardTiersSummarySection").then(m => ({ default: m.AwardTiersSummarySection })));

export function NESALandingPage() {
  const { currentEdition } = useSeason();
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t("seo.landing.title", `New Education Standard Award Africa (NESA-Africa) 2026 | The African Blue-Garnet Awards for Education`)}
        description={t("seo.landing.description", `New Education Standard Award Africa (NESA-Africa) 2026 celebrates Africa's education changemakers through recognition, visibility, partnerships, and measurable social impact. Motto: "The African Blue-Garnet Awards for Education."`)}
        ogTitle={t("seo.landing.ogTitle", `New Education Standard Award Africa (NESA-Africa) 2026`)}
        ogDescription={t("seo.landing.ogDescription", `"The African Blue-Garnet Awards for Education" — a continental education recognition and impact platform powered by SCEF.`)}
        keywords={t("seo.landing.keywords", "")}
      />

      <ScrollProgressIndicator />

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16 text-center md:text-left">
        <UtilityBar />
        <NESAHeader />

        {/* 1. HERO */}
        <TrophyHeroSection />

        {/* 2. COUNTDOWN — Journey to 22 October 2026 */}
        <CountdownSection />

        {/* 3. A CONTINENT IN RECOGNITION — 2025 Pre-Opening Gallery Teaser */}
        <LazySection>
          <HomepageGalleryTeaser />
        </LazySection>

        {/* 4. WHY NESA-AFRICA EXISTS */}
        <LazySection>
          <WhyNESAExistsSection />
        </LazySection>


        {/* 4. VISION, MISSION & 15 OBJECTIVES */}
        <LazySection>
          <VisionMissionObjectivesSection />
        </LazySection>

        {/* 5. THE NESA-AFRICA ECOSYSTEM */}
        <LazySection>
          <EcosystemCarousel />
        </LazySection>

        {/* 6. TEN EDUCATION REGIONS — summary map, detail on /regions */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 7. VOLUNTEERS BUILDING NESA-AFRICA */}
        <LazySection>
          <PoweredByVolunteersSection />
        </LazySection>

        {/* 8–10. IMPACT PROGRAMS (RMSA, EduAid-Africa, NESA TV gateways) */}
        <LazySection>
          <ImpactProgramsSection />
        </LazySection>

        {/* 11. PARTNERS & SPONSORS — logos only */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* 12. GOVERNANCE FIREWALL — summary commitments */}
        <LazySection>
          <GovernanceFirewallSection />
        </LazySection>

        {/* 13. VISION 2035 ROADMAP */}
        <LazySection>
          <Vision2035RoadmapSection />
        </LazySection>

        {/* 15. FINAL CTA */}
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
