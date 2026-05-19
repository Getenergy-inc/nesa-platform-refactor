import { Helmet } from "react-helmet-async";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { GoldSpecialRecognitionSection } from "@/components/nesa/GoldSpecialRecognitionSection";
import { GoldTrackNavGrid } from "@/components/awards/GoldTrackNavGrid";

export default function DigitalVoices() {
  return (
    <>
      <Helmet>
        <title>Digital Voices — Influencers Education Impact | NESA-Africa</title>
        <meta
          name="description"
          content="Celebrating African creators, musicians, athletes and digital advocates turning influence into education impact."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/awards/digital-voices" />
      </Helmet>

      <BrandedCategoryHero
        theme="influencer"
        headlineLead="Who Are Africa's Top"
        headlineAccent="Education Influencers?"
        description="From sports and music to digital storytelling and youth advocacy, influential African voices are transforming culture into a force for educational awareness, inspiration, and empowerment. Digital Voices recognizes creators turning influence into educational impact."
        tags={["Influence", "Advocacy", "Creativity", "Inspiration", "Youth Power", "Culture", "Music", "Sports", "Awareness", "Social Impact"]}
        stats={[
          { value: "Music", label: "Inspires Learning" },
          { value: "Sports", label: "Mentors Future Leaders" },
          { value: "Voices", label: "Driving Change" },
        ]}
        primaryCta={{ label: "Explore Gold Nominees", href: "/nominees?category=Influencers%20Education%20Impact%20Award" }}
        secondaryCta={{ label: "Vote for Influencers", href: "/vote" }}
        watchCta={{ label: "Watch Impact Stories", href: "/media" }}
        imageAlt="Africa's top education influencers — creators, musicians, athletes"
      />

      <AnimatedActionWords
        theme="influencer"
        lead="Digital Voices Are"
        words={["Influence", "Advocacy", "Creativity", "Inspiration", "Youth Power", "Culture", "Music", "Sports", "Awareness", "Social Impact"]}
      />

      <BrandedDocumentaryPreview
        theme="influencer"
        title="Digital Voices Stories"
        status="Documentary Coming Soon"
        description="See how creators, musicians, athletes, and influencers are using their platforms to transform education awareness across Africa."
        watchCtaLabel="Watch Impact Stories"
        watchCtaHref="/media"
        imageAlt="Digital voices documentary preview"
      />

      <BrandedNomineeDirectory
        theme="influencer"
        categoryName="Influencers Education Impact Award"
        title="Live Digital Voices"
        description="Creators, musicians, athletes and advocates verified live from the NESA Influencers directory."
      />

      <GoldTrackNavGrid />
      <GoldSpecialRecognitionSection />
    </>
  );
}
