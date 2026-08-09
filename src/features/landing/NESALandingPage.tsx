// NESA-Africa Landing Page — Editorial Recognition Edition (homepage only).
//
// Section order:
//   1.  Editorial hero (Icon Award lead, 6 certificate pills, dual CTA, trophy card)
//   2.  Public nominations notice (30 August 2026)
//   3.  Africa Education Icon — Lifetime Achievement 2006–2026 (3 cards)
//   4.  Recognition Architecture at a Glance (4-tier table)
//   5.  Certificate of Recognition tiers (3 cards)
//   6.  Integrity safeguards + no-public-voting disclaimer
//   7.  Volunteer band (live site_stats)
//   8.  SCEF's Board of Advisors
//   9.  Moments from NESA-Africa 2025 (gallery)
//   10. Gold-Blue Garnet Awards Gala countdown — 13 December 2026
//   11. Get Involved (sponsor · donate · volunteer · NRC)
//   12. Governance & integrity firewall
//   13. Final CTA
//
// Visual skin lives in ./editorial/editorial.css, scoped under `.nesa-ed`.

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { PublicNominationsNotice } from "@/components/nesa/PublicNominationsNotice";
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

import "./editorial/editorial.css";
import {
  EditorialHero,
  LivingGallerySection,
  IconLifetimeSection,
  IconFlagshipSection,
  RecognitionFamiliesSection,
  WhoCanBeEnablerSection,
  DirectoryStatsSection,
  RecognitionToImpactSection,
  TrustBandSection,
  VolunteerBandSection,
  BoardOfAdvisorsSection,
  GallerySection,
  GalaBandSection,
  JoinMovementSection,
  HelpRecogniseSection,
} from "./editorial";


const GovernanceFirewallSection = lazy(() =>
  import("@/components/nesa/GovernanceFirewallSection").then((m) => ({
    default: m.GovernanceFirewallSection,
  })),
);
const FinalCTASection = lazy(() =>
  import("@/components/nesa/FinalCTASection").then((m) => ({ default: m.FinalCTASection })),
);

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
          "Recognising the Enablers of Education for All Across Africa. Nominations open 30 August 2026 across 4 tiers, 22 categories and 96 subcategories.",
        )}
        ogTitle={t("seo.landing.ogTitle", "NESA-Africa 2026 — A Continent in Recognition")}
        ogDescription={t(
          "seo.landing.ogDescription",
          "The African Blue-Garnet Awards for Education. Recognition → Visibility → Partnerships → Funding → Intervention → Legacy.",
        )}
        keywords={t("seo.landing.keywords", "")}
      />

      <ScrollProgressIndicator />

      <div className="nesa-ed min-h-screen pt-14 sm:pt-16 pb-16">
        <UtilityBar />
        <NESAHeader />

        {/* 1. HERO */}
        <EditorialHero />

        {/* 2. PUBLIC NOTICE — nominations open 30 August 2026 */}
        <PublicNominationsNotice />

        {/* 3. LIVING GALLERY — Meet Africa's Education Enablers (database-driven) */}
        <LivingGallerySection />

        {/* 4. ONE CONTINENTAL MISSION. SIX RECOGNITION PATHWAYS. */}
        <RecognitionFamiliesSection />

        {/* 5. AFRICA EDUCATION ICON — flagship prominence */}
        <IconFlagshipSection />
        <IconLifetimeSection />

        {/* 6. WHO CAN BE AN EDUCATION ENABLER? */}
        <WhoCanBeEnablerSection />

        {/* 7. IMPACT DIRECTORY + LIVE STATS */}
        <DirectoryStatsSection />

        {/* 8. FROM RECOGNITION TO IMPACT */}
        <RecognitionToImpactSection />


        {/* 7. BUILT FOR TRUST */}
        <TrustBandSection />

        {/* GALA COUNTDOWN — 13 December 2026 */}
        <GalaBandSection />

        {/* SUPPORTING BANDS — people and moments */}
        <VolunteerBandSection />
        <BoardOfAdvisorsSection />
        <GallerySection />

        {/* 8. JOIN THE MOVEMENT */}
        <JoinMovementSection />

        {/* GOVERNANCE & INTEGRITY FIREWALL */}
        <LazySection>
          <GovernanceFirewallSection />
        </LazySection>

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
