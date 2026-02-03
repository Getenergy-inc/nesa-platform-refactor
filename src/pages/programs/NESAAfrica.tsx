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
import { NomineesShowcaseSection } from "@/components/nesa/NomineesShowcaseSection";
import { SponsorsSection } from "@/components/nesa/SponsorsSection";
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { FinalCTASection } from "@/components/nesa/FinalCTASection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";

/**
 * NESA-Africa Landing Page
 * 
 * Streamlined for reduced bounce rate:
 * - Hero + Trust indicators above fold
 * - Single AGC explanation (VoteWithAGCSection)
 * - Consolidated timeline (UpcomingEventsSection)
 * - Removed duplicate sections: CampaignBanner, GoldCertificateSection, 
 *   IntegritySection, AwardPhasesSection, TimelineSection, JudgesSection
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
        
        {/* Sticky Quick Actions */}
        <QuickActionBar />
        
        {/* What's Happening Now */}
        <WhatsLiveSection />
        
        {/* Choose Your Path */}
        <NominationPathsCards />
        
        {/* AGC Voting System (single consolidated section) */}
        <VoteWithAGCSection />
        
        {/* How It Works */}
        <HowItWorksVisual />
        
        {/* Legacy Impact */}
        <LegacyImpactSection />
        
        {/* Key Dates & Countdowns (consolidated timeline) */}
        <UpcomingEventsSection />
        
        {/* Media */}
        <WatchSection />
        
        {/* Featured Nominees */}
        <NomineesShowcaseSection />
        
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
