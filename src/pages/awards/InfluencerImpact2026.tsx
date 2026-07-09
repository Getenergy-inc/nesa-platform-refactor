import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import AwardCategoryStandardPage from "./AwardCategoryStandardPage";
import { InfluencerNominationSection } from "@/components/awards/InfluencerNominationSection";
import { InfluencerHallOfFameSection } from "@/components/awards/InfluencerHallOfFameSection";

/** Premium Influencer Education Impact 2026 page. */
export default function InfluencerImpact2026() {
  return (
    <>
      <NESAHeader />
      <AwardCategoryStandardPage slug="influencer-education-impact-2026" />
      <InfluencerHallOfFameSection />
      <InfluencerNominationSection />
      <NESAFooter />
    </>
  );
}
