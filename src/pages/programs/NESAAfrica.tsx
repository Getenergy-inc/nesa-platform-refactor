import { Helmet } from "react-helmet-async";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
import { WhatsLiveSection } from "@/components/nesa/WhatsLiveSection";
import { NominationPathsCards } from "@/components/nesa/NominationPathsCards";
import { VoteWithAGCSection } from "@/components/nesa/VoteWithAGCSection";
import { HowItWorksVisual } from "@/components/nesa/HowItWorksVisual";
import { LegacyImpactSection } from "@/components/nesa/LegacyImpactSection";
import { UpcomingEventsSection } from "@/components/nesa/UpcomingEventsSection";
import { WatchSection } from "@/components/nesa/WatchSection";
import { NESAMusicSection } from "@/components/nesa/NESAMusicSection";
import { EducationChampionsDirectory } from "@/components/nesa/EducationChampionsDirectory";
import { SponsorsSection } from "@/components/nesa/SponsorsSection";
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { FinalCTASection } from "@/components/nesa/FinalCTASection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { StartHereSection } from "@/components/nesa/StartHereSection";
import { WhatsNewSection } from "@/components/nesa/WhatsNewSection";
import { ContinueWhereYouLeftOff } from "@/components/nesa/ContinueWhereYouLeftOff";
import { DailyEngagementBanner } from "@/components/nesa/DailyEngagementBanner";
import { WhyPeopleReturnStrip } from "@/components/nesa/WhyPeopleReturnStrip";

/**
 * NESA-Africa Landing Page
 * 
 * Conversion & retention-optimized:
 * - Hero + Trust logos above fold (credibility)
 * - Daily engagement banner (return visits)
 * - Visual story blocks (How It Works, AGC, Legacy)
 * - "Why People Return" social proof strip
 * - Consolidated timeline (UpcomingEventsSection)
 */
export default function NESAAfrica() {
  return (
    <>
      <Helmet>
        <title>NESA-Africa 2025 | New Education Standard Award Africa</title>
        <meta
          name="description"
          content="Honoring Africa's Education Changemakers. NESA-Africa 2025 celebrates the real changemakers shaping the future of education across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal pb-16 lg:pb-0">
        <NESAHeader />
        
        {/* Above the Fold: Hero + Trust */}
        <TrophyHeroSection />
        <TrustLogosStrip />
        
        {/* Continue Where You Left Off (only shows if user has history) */}
        <ContinueWhereYouLeftOff />
        
        {/* Sticky Quick Actions */}
        <QuickActionBar />
        
        {/* START HERE: First-time visitor orientation */}
        <StartHereSection />
        
        {/* WHAT'S NEW: Returning visitor freshness */}
        <WhatsNewSection />
        
        {/* What's Happening Now */}
        <WhatsLiveSection />
        
        {/* Daily Engagement Banner */}
        <DailyEngagementBanner />
        
        {/* Choose Your Path */}
        <NominationPathsCards />
        
        {/* AGC Voting System (single consolidated section) */}
        <VoteWithAGCSection />
        
        {/* How It Works */}
        <HowItWorksVisual />
        
        {/* Why People Return - Social Proof */}
        <WhyPeopleReturnStrip />
        
        {/* Legacy Impact */}
        <LegacyImpactSection />
        
        {/* Key Dates & Countdowns (consolidated timeline) */}
        <UpcomingEventsSection />
        
        {/* Media */}
        <WatchSection />
        
        {/* Official Music */}
        <NESAMusicSection />
        
        {/* Education Champions Directory */}
        <EducationChampionsDirectory />
        
        {/* Partners & Sponsors */}
        <SponsorsSection />
        
        {/* Categories Overview */}
        <CategoriesSection />
        
        {/* Final Call to Action */}
        <FinalCTASection />
        
        <NESAFooter />
      </div>
      
      <MobileBottomNav />
    </>
  );
}
