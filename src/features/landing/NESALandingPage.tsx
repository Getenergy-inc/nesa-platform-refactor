// NESA-Africa Landing Page — Editorial Recognition Edition (homepage only).
//
// Section order:
//   1.  Editorial hero (Icon Award lead, 6 certificate pills, dual CTA, trophy card)
//   2.  Public nominations notice (30 August 2026) + compact Icon key-dates ticker
//   3.  Meet Africa's Education Enablers — living gallery (database-driven)
//   4.  Africa Education Icon flagship + three pathway cards (ONE Icon moment)
//   5.  Icon scale stats (live)
//   6.  Six recognition pathways
//   7.  Who can be an Education Enabler?
//   8.  Impact directory + live stats
//   9.  From recognition to impact
//   10. Built for trust
//   11. Gala countdown — 13 December 2026 — with the Icon closing message adjacent
//   12. Volunteer band + SCEF's Board of Advisors
//   13. Join the movement · final CTA · governance firewall
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
  IconTimelineSection,
  IconScaleSection,
  IconClosingSection,
  RecognitionFamiliesSection,
  WhoCanBeEnablerSection,
  DirectoryStatsSection,
  RecognitionToImpactSection,
  TrustBandSection,
  VolunteerBandSection,
  BoardOfAdvisorsSection,
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

        {/* 3. AFRICA EDUCATION ICON — flagship first impression */}
        <IconFlagshipSection />
        <IconTimelineSection />
        <IconLifetimeSection />

        {/* 4. LIVING GALLERY — Meet Africa's Education Enablers (database-driven) */}
        <LivingGallerySection />
        <IconScaleSection />
        <IconClosingSection />


        {/* 5. ONE CONTINENTAL MISSION. SIX RECOGNITION PATHWAYS. */}
        <RecognitionFamiliesSection />

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


        {/* 9. JOIN THE MOVEMENT */}
        <JoinMovementSection />

        {/* 10. FINAL CTA */}
        <HelpRecogniseSection />


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
