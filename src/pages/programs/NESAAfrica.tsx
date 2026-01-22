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
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { VisionDocumentSection } from "@/components/nesa/VisionDocumentSection";
import { WatchMediaSection } from "@/components/nesa/WatchMediaSection";
import { FinalCTASection } from "@/components/nesa/FinalCTASection";
import { NESAFooter } from "@/components/nesa/NESAFooter";

export default function NESAAfrica() {
  return (
    <>
      <Helmet>
        <title>NESA-Africa 2025 | New Education Standard Award Africa</title>
        <meta
          name="description"
          content="Honoring Africa's Changemakers. NESA-Africa 2025 celebrates the real changemakers shaping the future of education across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-secondary">
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
