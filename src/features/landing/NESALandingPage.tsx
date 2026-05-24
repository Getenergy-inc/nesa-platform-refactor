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
const CategoryDiscoveryGrid = lazy(() => import("@/components/nominees/CategoryDiscoveryGrid").then(m => ({ default: m.CategoryDiscoveryGrid })));


export function NESALandingPage() {
  const { currentEdition } = useSeason();
  const { t } = useTranslation("pages");

  return (
    <>
      <LocalizedSEO
        pathname="/"
        title={t("seo.landing.title", `${currentEdition?.name || "NESA-Africa 2026"} | New Education Standard Award Africa`)}
        description={t("seo.landing.description", `${currentEdition.tagline}. ${currentEdition.name} honours Africa's education changemakers.`)}
        ogTitle={t("seo.landing.ogTitle", `${currentEdition.name} | NESA-Africa`)}
        ogDescription={t("seo.landing.ogDescription", currentEdition.tagline)}
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

        {/* 4. NOMINEE DISCOVERY — single primary discovery surface */}
        <LazySection>
          <section className="bg-charcoal py-10 md:py-14">
            <div className="container">
              <CategoryDiscoveryGrid
                layout="carousel"
                limit={10}
                seeAllHref="/nominees"
                heading="Explore Existing Nominees by Award Category"
                subheading="Pick an award track to explore nominees, vote in Blue Garnet, or re-nominate a champion."
              />
            </div>
          </section>
        </LazySection>

        {/* 5. REGIONAL PREVIEW — links to full /regions */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 6. MOMENTS PREVIEW — 4 tiles, full experience on /gallery */}
        <LazySection>
          <HomepageGalleryTeaser />
        </LazySection>

        {/* 7. IMPACT WRAP-UP — EduAid storytelling */}
        <LazySection>
          <ImpactWrapUpSection />
        </LazySection>

        {/* Trust supporting Final CTA */}
        <LazySection>
          <SponsorsSection />
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
