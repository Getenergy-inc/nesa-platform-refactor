// NESA-Africa Landing Page Feature
// Main entry point that assembles all landing page sections

import { Helmet } from "react-helmet-async";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAHero } from "@/components/nesa/NESAHero";
import { KeyDatesBanner } from "@/components/nesa/KeyDatesBanner";
import { UpcomingEventsSection } from "@/components/nesa/UpcomingEventsSection";
import { NominationPathSection } from "@/components/nesa/NominationPathSection";
import { StatsStrip } from "@/components/nesa/StatsStrip";
import { ProgrammeOverviewSection } from "@/components/nesa/ProgrammeOverviewSection";
import { Phase1Section } from "@/components/nesa/Phase1Section";
import { AwardPhasesSection } from "@/components/nesa/AwardPhasesSection";
import { TimelineSection } from "@/components/nesa/TimelineSection";
import { LegacySection } from "@/components/nesa/LegacySection";
import { QuoteBlock } from "@/components/nesa/QuoteBlock";
import { HowItWorksSection } from "@/components/nesa/HowItWorksSection";
import { WatchLiveSection } from "@/components/nesa/WatchLiveSection";
import { GetInvolvedSection } from "@/components/nesa/GetInvolvedSection";
import { FirewallsSection } from "@/components/nesa/FirewallsSection";
import { SponsorsSection } from "@/components/nesa/SponsorsSection";
import { EndorsedBySection } from "@/components/nesa/EndorsedBySection";
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { VisionDocumentSection } from "@/components/nesa/VisionDocumentSection";
import { WatchMediaSection } from "@/components/nesa/WatchMediaSection";
import { FinalCTASection } from "@/components/nesa/FinalCTASection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { useSeason } from "@/contexts/SeasonContext";

export function NESALandingPage() {
  const { currentEdition } = useSeason();

  return (
    <>
      <Helmet>
        <title>{currentEdition.name} | New Education Standard Award Africa</title>
        <meta
          name="description"
          content={`${currentEdition.tagline}. ${currentEdition.name} celebrates the real changemakers shaping the future of education across Africa.`}
        />
        <meta property="og:title" content={`${currentEdition.name} | NESA-Africa`} />
        <meta property="og:description" content={currentEdition.tagline} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesa.africa" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        <NESAHero />
        <KeyDatesBanner />
        <UpcomingEventsSection />
        <NominationPathSection />
        <StatsStrip />
        <ProgrammeOverviewSection />
        <Phase1Section />
        <AwardPhasesSection />
        <TimelineSection />
        <LegacySection />
        <QuoteBlock />
        <HowItWorksSection />
        <WatchLiveSection />
        <GetInvolvedSection />
        <FirewallsSection />
        <EndorsedBySection />
        <SponsorsSection />
        <CategoriesSection />
        <VisionDocumentSection />
        <WatchMediaSection />
        <FinalCTASection />
        <NESAFooter />
      </div>
    </>
  );
}

export default NESALandingPage;
