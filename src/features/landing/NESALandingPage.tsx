// NESA-Africa Landing Page — Editorial Recognition Edition (homepage only).
//
// Section order:
//   1.  Editorial hero (Icon Award lead, 6 certificate pills, dual CTA, trophy card)
//   2.  Public nominations notice (6 September 2026) + compact Icon key-dates ticker
//   3.  Meet Africa’s Education Enablers — living gallery (database-driven)
//   4.  Africa Education Icon flagship + three pathway cards (ONE Icon moment)
//   5.  Icon scale stats (live)
//   6.  Six recognition pathways
//   7.  Who can be an Education Enabler?
//   8.  Impact directory + live stats
//   9.  From recognition to impact
//   10. Built for trust
//   11. Gala countdown — 28 December 2026 — with the Icon closing message adjacent
//   12. Volunteer band + SCEF's Board of Advisors
//   13. Join the movement · final CTA · governance firewall
//
// Visual skin lives in ./editorial/editorial.css, scoped under `.nesa-ed`.

import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { LocalizedSEO } from "@/components/seo/LocalizedSEO";

import { PublicNominationsNotice } from "@/components/nesa/PublicNominationsNotice";
import { AwardPlaqueMotionSection } from "@/components/nesa/AwardPlaqueMotionSection";
import { InfluencerPathwayNomineeSlider } from "@/components/awards/InfluencerPathwayNomineeSlider";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { UtilityBar } from "@/components/nesa/UtilityBar";
import { LazySection } from "@/components/ui/lazy-section";
import { MobileBottomActions } from "@/components/navigation/MobileBottomActions";
import { ScrollProgressIndicator } from "@/components/nesa/ScrollProgressIndicator";
import { ExitIntentPopup } from "@/components/nesa/ExitIntentPopup";
import { BackToTopButton } from "@/components/ui/back-to-top";
import { FloatingFAQButton } from "@/components/nesa/PageFAQ";
import { SchoolSupportFundSection } from "@/components/impact/SchoolSupportFundSection";

import "./editorial/editorial.css";
import { HomeFramework2026 } from "@/components/framework2026/HomeFramework2026";
import {
  EditorialHero,
  LivingGallerySection,
  IconLifetimeSection,
  IconFlagshipSection,
  IconGovernanceNote,
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
  PartnersBandSection,

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
          "NESA-Africa 2026 | The African Blue-Garnet Awards for Recognising Africa’s Education Enablers",
        )}
        description={t(
          "seo.landing.description",
          "NESA-Africa identifies, documents and recognises the people, institutions and initiatives expanding educational opportunity across Africa. Four tiers, 22 main awards, 90 subcategories.",
        )}
        ogTitle={t("seo.landing.ogTitle", "NESA-Africa 2026 — A Continent in Recognition")}
        ogDescription={t(
          "seo.landing.ogDescription",
          "Evidence-led research. Independent Icon judging. No public voting in 2026.",
        )}
        keywords={t("seo.landing.keywords", "")}
      />

      <ScrollProgressIndicator />

      <div className="nesa-ed min-h-screen pt-14 sm:pt-16 pb-16">
        <UtilityBar />
        <NESAHeader />

        <HomeFramework2026 />

        <NESAFooter />
      </div>

      <BackToTopButton />
      <MobileBottomActions />
      <FloatingFAQButton />
    </>
  );
}

export default NESALandingPage;
