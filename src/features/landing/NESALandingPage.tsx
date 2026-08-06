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
  IconLifetimeSection,
  ArchitectureTableSection,
  TierGridSection,
  TrustBandSection,
  VolunteerBandSection,
  BoardOfAdvisorsSection,
  GallerySection,
  GalaBandSection,
  SupportSection,
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

        {/* 3. AFRICA EDUCATION ICON — lifetime achievement */}
        <IconLifetimeSection />

        {/* 4. RECOGNITION ARCHITECTURE */}
        <ArchitectureTableSection />

        {/* 5. CERTIFICATE OF RECOGNITION TIERS */}
        <TierGridSection />

        {/* 6. INTEGRITY SAFEGUARDS */}
        <TrustBandSection />

        {/* 7. VOLUNTEER BAND */}
        <VolunteerBandSection />

        {/* 8. BOARD OF ADVISORS */}
        <BoardOfAdvisorsSection />

        {/* 9. GALLERY */}
        <GallerySection />

        {/* 10. GALA COUNTDOWN — 13 December 2026 */}
        <GalaBandSection />

        {/* 11. GET INVOLVED */}
        <SupportSection />

        {/* 12. GOVERNANCE & INTEGRITY FIREWALL */}
        <LazySection>
          <GovernanceFirewallSection />
        </LazySection>

        {/* 13. FINAL CTA */}
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
