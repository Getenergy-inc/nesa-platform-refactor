import AwardLanePage from "@/components/get-involved/AwardLanePage";

export default function InfluencersLanePage() {
  return (
    <AwardLanePage
      title="Influencers"
      subtitle="Officially recognised across the three Influencer Education Impact pathways"
      meaning="This lane is for public figures — athletes, musicians, and digital creators — who use their platforms to advance education in Africa through campaigns, scholarships, advocacy, or sustained education-focused content."
      audience={[
        "Athletes and sports figures with verifiable education campaigns or programmes.",
        "Musicians and music industry figures channelling their reach into education impact.",
        "Digital creators, advocates, and online educators with sustained education-focused content.",
      ]}
      categories={[
        {
          name: "Africa Social Media — Education Impact",
          tier: "Influencer Education Impact",
          whoItsFor:
            "For digital creators, advocates, and online educators with sustained education-focused content and verifiable audience impact.",
          categoryHref: "/awards/influencers-education-impact/social-media",
          nominateHref: "/nominate?tier=influencer-2026&track=social-media",
        },
        {
          name: "Africa Sports — Education Impact",
          tier: "Influencer Education Impact",
          whoItsFor:
            "For active or retired athletes, coaches, and sports organisations using sport's reach to advance African education.",
          categoryHref: "/awards/influencers-education-impact/sports",
          nominateHref: "/nominate?tier=influencer-2026&track=sports",
        },
        {
          name: "Africa Music — Education Impact",
          tier: "Influencer Education Impact",
          whoItsFor:
            "For recording artists, producers, and music industry figures funding or campaigning for education impact.",
          categoryHref: "/awards/influencers-education-impact/music",
          nominateHref: "/nominate?tier=influencer-2026&track=music",
        },
        {
          name: "Influencer Education Impact — Overview",
          tier: "Influencer Education Impact",
          whoItsFor:
            "Not sure which pathway fits? The overview page explains all three and how the shared review process works.",
          categoryHref: "/awards/influencers-education-impact",
          nominateHref: "/awards/influencers-education-impact",
        },
      ]}
      metaDescription="Nominate an African sports, music, or social media figure advancing education — NESA-Africa Influencer Education Impact pathways."
    />
  );
}
