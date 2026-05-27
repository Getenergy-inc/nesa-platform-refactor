// NESA-Africa Landing Page — high-conversion gateway (Phase 1 restructure)
// Target 8-section flow: Hero → Ecosystem → Countdown → Nominee Discovery →
// Regional Preview → Moments Preview → Impact → Final CTA.
// Deep systems (merch, AGC, voting guide, ecosystem programs, full trending,
// full gallery, full categories, full regions) live on dedicated routes.

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { CountdownSection } from "@/components/nesa/CountdownSection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { LazySection } from "@/components/ui/lazy-section";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { PageFAQSection, FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy below-fold
const EcosystemCarousel = lazy(() => import("@/components/landing/EcosystemCarousel").then(m => ({ default: m.EcosystemCarousel })));
const ImpactWrapUpSection = lazy(() => import("@/components/nesa/ImpactWrapUpSection").then(m => ({ default: m.ImpactWrapUpSection })));
const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));
const HomepageGalleryTeaser = lazy(() => import("@/components/gallery/HomepageGalleryTeaser").then(m => ({ default: m.HomepageGalleryTeaser })));
const NomineeDiscoverySwitcher = lazy(() => import("@/components/nominees/NomineeDiscoverySwitcher").then(m => ({ default: m.NomineeDiscoverySwitcher })));
const AboutNESASection = lazy(() => import("@/components/nesa/AboutNESASection").then(m => ({ default: m.AboutNESASection })));
const PoweredByVolunteersSection = lazy(() => import("@/components/nesa/PoweredByVolunteersSection").then(m => ({ default: m.PoweredByVolunteersSection })));
const MobileCategoryRail = lazy(() => import("@/components/landing/MobileCategoryRail").then(m => ({ default: m.MobileCategoryRail })));



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
        <NESAHeader />

        {/* 1. HERO — primary CTAs */}
        <TrophyHeroSection />

        {/* 2. ECOSYSTEM TRUST — honourees/ecosystem strip moved up for fast credibility */}
        <TrustLogosStrip />
        <LazySection>
          <EcosystemCarousel />
        </LazySection>

        {/* 3. COUNTDOWN — Blue Garnet 2026 Gala urgency */}
        <CountdownSection />

        {/* 3b. MOBILE CATEGORY DISCOVERY — horizontal swipe rail (mobile only) */}
        <LazySection>
          <MobileCategoryRail />
        </LazySection>


        {/* 4. NOMINEE DISCOVERY — desktop/tablet only; mobile gets dedicated /nominees */}
        <div className="hidden md:block">
          <LazySection>
            <NomineeDiscoverySwitcher />
          </LazySection>
        </div>


        {/* 5. REGIONAL PREVIEW — links to full /regions */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 6. MOMENTS PREVIEW — desktop/tablet only; mobile gets dedicated /gallery */}
        <div className="hidden md:block">
          <LazySection>
            <HomepageGalleryTeaser />
          </LazySection>
        </div>

        {/* 7. IMPACT WRAP-UP — EduAid storytelling */}
        <LazySection>
          <ImpactWrapUpSection />
        </LazySection>

        {/* About NESA-Africa 2026 — desktop/tablet only; mobile gets dedicated /about */}
        <div className="hidden md:block">
          <LazySection>
            <AboutNESASection />
          </LazySection>
        </div>

        {/* Powered by Volunteers — desktop/tablet only; mobile gets dedicated /volunteer */}
        <div className="hidden md:block">
          <LazySection>
            <PoweredByVolunteersSection />
          </LazySection>
        </div>

        {/* Trust supporting Final CTA — desktop/tablet only; mobile gets dedicated /sponsors */}
        <div className="hidden md:block">
          <LazySection>
            <SponsorsSection />
          </LazySection>
        </div>

        {/* Meet Our Judges */}
        <LazySection>
          <MeetOurJudgesSection />
        </LazySection>


        <LazySection>
          <PageFAQSection />
        </LazySection>

        {/* 8. FINAL CTA */}
        <LazySection>
          <FinalCTASection />
        </LazySection>

        <NESAFooter />
        <BottomPageNav />
      </div>

      <ExitIntentPopup />
      <BackToTopButton />
      <MobileBottomNav />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;
