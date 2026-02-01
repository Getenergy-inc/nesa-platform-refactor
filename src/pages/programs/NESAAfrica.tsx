import { Helmet } from "react-helmet-async";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { TrophyHeroSection } from "@/components/nesa/TrophyHeroSection";
import { TrustLogosStrip } from "@/components/nesa/TrustLogosStrip";
import { CampaignBanner } from "@/components/nesa/CampaignBanner";
import { QuickActionBar } from "@/components/nesa/QuickActionBar";
import { WhatsLiveSection } from "@/components/nesa/WhatsLiveSection";
import { NominationPathsCards } from "@/components/nesa/NominationPathsCards";
import { GoldCertificateSection } from "@/components/nesa/GoldCertificateSection";
import { VoteWithAGCSection } from "@/components/nesa/VoteWithAGCSection";
import { HowItWorksVisual } from "@/components/nesa/HowItWorksVisual";
import { LegacyImpactSection } from "@/components/nesa/LegacyImpactSection";
import { IntegritySection } from "@/components/nesa/IntegritySection";
import { UpcomingEventsSection } from "@/components/nesa/UpcomingEventsSection";
import { AwardPhasesSection } from "@/components/nesa/AwardPhasesSection";
import { TimelineSection } from "@/components/nesa/TimelineSection";
import { WatchSection } from "@/components/nesa/WatchSection";
import { NomineesShowcaseSection } from "@/components/nesa/NomineesShowcaseSection";
import { SponsorsSection } from "@/components/nesa/SponsorsSection";
import { JudgesSection } from "@/components/nesa/JudgesSection";
import { CategoriesSection } from "@/components/nesa/CategoriesSection";
import { FinalCTASection } from "@/components/nesa/FinalCTASection";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";

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

      <div className="min-h-screen bg-charcoal pb-16 lg:pb-0">
        <NESAHeader />
        <TrophyHeroSection />
        <TrustLogosStrip />
        <CampaignBanner />
        <QuickActionBar />
        <WhatsLiveSection />
        <NominationPathsCards />
        <GoldCertificateSection />
        <VoteWithAGCSection />
        <HowItWorksVisual />
        <LegacyImpactSection />
        <IntegritySection />
        <UpcomingEventsSection />
        <AwardPhasesSection />
        <TimelineSection />
        <WatchSection />
        <NomineesShowcaseSection />
        <SponsorsSection />
        <JudgesSection />
        <CategoriesSection />
        <FinalCTASection />
        <NESAFooter />
      </div>
      
      <MobileBottomNav />
    </>
  );
}
