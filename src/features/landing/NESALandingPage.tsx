// NESA-Africa Landing Page Feature
// Marketing-led welcome page with visual storytelling and governance integrity

import { Helmet } from "react-helmet-async";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { WhatsLiveSection } from "@/components/nesa/WhatsLiveSection";
import { NominationPathsCards } from "@/components/nesa/NominationPathsCards";
import { VoteWithAGCSection } from "@/components/nesa/VoteWithAGCSection";
import { HowItWorksVisual } from "@/components/nesa/HowItWorksVisual";
import { LegacyImpactSection } from "@/components/nesa/LegacyImpactSection";
import { IntegritySection } from "@/components/nesa/IntegritySection";
import { WatchSection } from "@/components/nesa/WatchSection";
import { NomineesShowcaseSection } from "@/components/nesa/NomineesShowcaseSection";
import { UpcomingEventsSection } from "@/components/nesa/UpcomingEventsSection";
import { AwardPhasesSection } from "@/components/nesa/AwardPhasesSection";
import { SponsorsSection } from "@/components/nesa/SponsorsSection";
import { JudgesSection } from "@/components/nesa/JudgesSection";
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { FinalCTASection } from "@/components/nesa/FinalCTASection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
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
        
        {/* 1. Trophy Hero - Conversion-first with Blue Garnet visual */}
        <TrophyHeroSection />
        
        {/* 2. Trust Logos Strip - Endorsements & sponsors immediately after hero */}
        <TrustLogosStrip />
        
        {/* 3. Quick Action Bar - Mobile-sticky CTAs */}
        <QuickActionBar />
        
        {/* 4. What's Live - Dynamic blocks encouraging repeat visits */}
        <WhatsLiveSection />
        
        {/* 5. Nomination Paths - Scannable cards with clear CTAs */}
        <NominationPathsCards />
        
        {/* 6. Vote with AGC - Visual storytelling block */}
        <VoteWithAGCSection />
        
        {/* 7. How It Works - Icon flow journey */}
        <HowItWorksVisual />
        
        {/* 8. Legacy Impact - Rebuild My School Africa */}
        <LegacyImpactSection />
        
        {/* 9. Integrity Section - Firewalls & governance (moved higher) */}
        <IntegritySection />
        
        {/* 10. Upcoming Events - Countdown timers */}
        <UpcomingEventsSection />
        
        {/* 11. Award Phases & Timeline - Programme details (consolidated) */}
        <AwardPhasesSection />
        
        {/* 13. Watch Section - Media engagement */}
        <WatchSection />
        
        {/* 14. Digital Nominees Board */}
        <NomineesShowcaseSection />
        
        {/* 15. Sponsors, Judges, Categories - Supporting sections */}
        <SponsorsSection />
        <JudgesSection />
        <CategoriesSection />
        
        {/* 16. Final CTA */}
        <FinalCTASection />
        
        <NESAFooter />
      </div>
    </>
  );
}

export default NESALandingPage;
