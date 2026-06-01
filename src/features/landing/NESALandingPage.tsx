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
import { UtilityBar } from "@/components/nesa/UtilityBar";
import { LazySection } from "@/components/ui/lazy-section";
import { BottomPageNav } from "@/components/navigation/PageNavigation";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { PageFAQSection, FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { MobileStickyNominateCTA } from "@/components/nesa/MobileStickyNominateCTA";
import { useSeason } from "@/contexts/SeasonContext";

// Lazy below-fold
const EcosystemCarousel = lazy(() => import("@/components/landing/EcosystemCarousel").then(m => ({ default: m.EcosystemCarousel })));
const ImpactPreviewSection = lazy(() => import("@/components/nesa/ImpactPreviewSection").then(m => ({ default: m.ImpactPreviewSection })));
const SponsorPreviewSection = lazy(() => import("@/components/nesa/SponsorPreviewSection").then(m => ({ default: m.SponsorPreviewSection })));

const InteractiveAfricaMap = lazy(() => import("@/components/nesa/InteractiveAfricaMap").then(m => ({ default: m.InteractiveAfricaMap })));
const SponsorsSection = lazy(() => import("@/components/nesa/SponsorsSection").then(m => ({ default: m.SponsorsSection })));
const FinalCTASection = lazy(() => import("@/components/nesa/FinalCTASection").then(m => ({ default: m.FinalCTASection })));
const HomepageGalleryTeaser = lazy(() => import("@/components/gallery/HomepageGalleryTeaser").then(m => ({ default: m.HomepageGalleryTeaser })));
const NomineeDiscoverySwitcher = lazy(() => import("@/components/nominees/NomineeDiscoverySwitcher").then(m => ({ default: m.NomineeDiscoverySwitcher })));
const AboutNESASection = lazy(() => import("@/components/nesa/AboutNESASection").then(m => ({ default: m.AboutNESASection })));
const PoweredByVolunteersSection = lazy(() => import("@/components/nesa/PoweredByVolunteersSection").then(m => ({ default: m.PoweredByVolunteersSection })));
const MobileCategoryRail = lazy(() => import("@/components/landing/MobileCategoryRail").then(m => ({ default: m.MobileCategoryRail })));
const AwardShowcaseSection = lazy(() => import("@/components/nesa/AwardShowcaseSection").then(m => ({ default: m.AwardShowcaseSection })));
const ImpactProgramsSection = lazy(() => import("@/components/nesa/ImpactProgramsSection").then(m => ({ default: m.ImpactProgramsSection })));
const GovernanceFirewallSection = lazy(() => import("@/components/nesa/GovernanceFirewallSection").then(m => ({ default: m.GovernanceFirewallSection })));



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

        {/* 1. HERO — primary CTAs */}
        <TrophyHeroSection />

        {/* 2. ECOSYSTEM TRUST — honourees/ecosystem strip moved up for fast credibility */}
        <TrustLogosStrip />
        <LazySection>
          <EcosystemCarousel />
        </LazySection>

        {/* 2b. AWARD ARCHITECTURE — four-tier showcase */}
        <LazySection>
          <AwardShowcaseSection />
        </LazySection>

        {/* 3. COUNTDOWN — Blue Garnet 2026 Gala urgency */}
        <CountdownSection />

        {/* 3b. MOBILE CATEGORY DISCOVERY — horizontal swipe rail (mobile only) */}
        <LazySection>
          <MobileCategoryRail />
        </LazySection>


        {/* 4. NOMINEE DISCOVERY — responsive on all devices */}
        <LazySection>
          <NomineeDiscoverySwitcher />
        </LazySection>

        {/* 4b. IMPACT PROGRAMS — EduAid / RMSA / Special Needs / Edu-Tourism */}
        <LazySection>
          <ImpactProgramsSection />
        </LazySection>


        {/* 5. MOMENTS PREVIEW — visible on all devices */}
        <LazySection>
          <HomepageGalleryTeaser />
        </LazySection>

        {/* 6. REGIONAL PREVIEW — public map + region cards (gateway to /region/:slug) */}
        <LazySection>
          <InteractiveAfricaMap />
        </LazySection>

        {/* 6b. Bridge note → 2026–2027 Legacy Impact pathway */}
        <div className="container mx-auto max-w-4xl px-4 -mt-6 mb-8">
          <div className="rounded-2xl border border-gold/25 bg-gold/5 px-5 py-4 text-center">
            <p className="text-ivory/80 text-xs md:text-sm leading-relaxed mb-3">
              Each region now connects to the{" "}
              <span className="text-gold font-semibold">2026–2027 NESA-Africa Legacy Impact pathway</span>
              {" "}— EduAid-Africa Edu-Tourism Conferences, Special Needs School
              nominations, regional voting, GFA Wzip regional wallets, and Rebuild My
              School Africa interventions.
            </p>
            <a
              href="/eduaid-africa/rebuild-my-school"
              className="inline-flex items-center gap-1.5 text-gold text-xs md:text-sm font-semibold hover:underline"
            >
              Explore the full Continental Impact Ecosystem →
            </a>
          </div>
        </div>

        {/* 7. IMPACT PREVIEW — short gateway card (full content lives on /impact, /impact/regional-school-intervention, /eduaid-africa, /eduaid-africa/rebuild-my-school) */}
        <LazySection>
          <ImpactPreviewSection />
        </LazySection>

        {/* About NESA-Africa 2026 — responsive on all devices */}
        <LazySection>
          <AboutNESASection />
        </LazySection>

        {/* Powered by Volunteers — responsive on all devices */}
        <LazySection>
          <PoweredByVolunteersSection />
        </LazySection>

        {/* Sponsors logos strip — credibility only, no pricing */}
        <LazySection>
          <SponsorsSection />
        </LazySection>

        {/* SPONSOR PREVIEW — short gateway card (full pricing lives on /sponsorship-packages, /sponsor, /sponsor/:slug) */}
        <LazySection>
          <SponsorPreviewSection />
        </LazySection>

        {/* Governance firewall — integrity messaging */}
        <LazySection>
          <GovernanceFirewallSection />
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
      <MobileStickyNominateCTA source="homepage" />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;
