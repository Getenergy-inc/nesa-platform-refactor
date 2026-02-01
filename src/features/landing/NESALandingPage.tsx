// NESA-Africa Landing Page Feature
// Main entry point that assembles all landing page sections

import { Helmet } from "react-helmet-async";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAHero } from "@/components/nesa/NESAHero";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
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
import { NomineesShowcaseSection } from "@/components/nesa/NomineesShowcaseSection";
import { SponsorsSection } from "@/components/nesa/SponsorsSection";
import { EndorsedBySection } from "@/components/nesa/EndorsedBySection";
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { JudgesSection } from "@/components/nesa/JudgesSection";
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
          content={`${currentEdition.tagline}. ${currentEdition.name} celebrates the real changemakers shaping the future of education across Africa. Nominate now, earn voting points, and vote with AGC for Gold and Blue Garnet winners.`}
        />
        <meta property="og:title" content={`${currentEdition.name} | NESA-Africa`} />
        <meta property="og:description" content={currentEdition.tagline} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesa.africa" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        
        {/* 1. Hero - Conversion-first with AGC messaging */}
        <NESAHero />
        
        {/* 2. Quick Action Bar - Sticky on mobile */}
        <QuickActionBar />
        
        {/* Key Dates Banner */}
        <KeyDatesBanner />
        
        {/* 3. Upcoming Events - Live Countdown */}
        <UpcomingEventsSection />
        
        {/* 4. Choose Your Path - Nomination paths */}
        <NominationPathSection />
        
        {/* Stats Strip - De-emphasized */}
        <StatsStrip />
        
        {/* 5. Programme Overview with AGC note */}
        <ProgrammeOverviewSection />
        
        {/* 6. Award Phases with Vote with AGC */}
        <AwardPhasesSection />
        
        {/* 7. Programme Timeline with AGC tooltips */}
        <TimelineSection />
        
        {/* 8. Post-Award Legacy: Rebuild My School Africa */}
        <LegacySection />
        
        {/* Quote Block */}
        <QuoteBlock />
        
        {/* 9. How NESA Works with AGC note */}
        <HowItWorksSection />
        
        {/* 10. Watch Live */}
        <WatchLiveSection />
        
        {/* Get Involved */}
        <GetInvolvedSection />
        
        {/* 11. Firewalls & Integrity - Moved higher, with AGC disclaimer */}
        <FirewallsSection />
        
        {/* 12. Digital Nominees Board */}
        <NomineesShowcaseSection />
        
        {/* 13. Partners, Sponsors, Judges, Categories, Vision, Media */}
        <EndorsedBySection />
        <SponsorsSection />
        <JudgesSection />
        <CategoriesSection />
        <VisionDocumentSection />
        <WatchMediaSection />
        
        {/* Final CTA */}
        <FinalCTASection />
        
        <NESAFooter />
      </div>
    </>
  );
}

export default NESALandingPage;
