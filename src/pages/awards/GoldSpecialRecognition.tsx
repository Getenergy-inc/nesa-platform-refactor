import { Helmet } from "react-helmet-async";
import { GoldSpecialRecognitionSection } from "@/components/nesa/GoldSpecialRecognitionSection";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { GoldTrackNavGrid } from "@/components/awards/GoldTrackNavGrid";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function GoldSpecialRecognition() {
  return (
    <>
      <Helmet>
        <title>{`Influencers Education Impact Award 2026 Edition | NESA-Africa`}</title>
        <meta
          name="description"
          content="Cultural Impact Recognition: Celebrating sports icons, music artists, and digital voices using their influence to advance education across Africa and the Diaspora."
        />
        <meta property="og:title" content="Influencers Education Impact Award 2026 Edition | NESA-Africa" />
        <meta property="og:description" content="Celebrating cultural leaders championing education advocacy across Africa." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://nesa.africa/awards/influencers-education-impact-2026-recognition" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Influencers Education Impact 2026 Recognition", path: "/awards/influencers-education-impact-2026-recognition" }]} />

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />
        <BrandedCategoryHero
          theme="influencer"
          headlineLead="Who Are Africa's Top"
          headlineAccent="Education Influencers?"
          description="From music and sports to digital storytelling and social advocacy, influential African voices are transforming culture into a force for education, awareness, empowerment, and opportunity."
          tags={["Influence", "Advocacy", "Creativity", "Youth Power", "Social Impact", "Music", "Sports", "Inspiration"]}
          stats={[
            { value: "Music", label: "Inspires Learning" },
            { value: "Sports", label: "Mentor Future Leaders" },
            { value: "Voices", label: "Driving Change" },
          ]}
          primaryCta={{ label: "Explore Gold Nominees", href: "/nominees?category=Influencers%20Education%20Impact%20Award" }}
          secondaryCta={{ label: "Vote for Influencers", href: "/vote" }}
          watchCta={{ label: "Watch Impact Stories", href: "/media" }}
          imageAlt="Africa's top education influencers — creators, musicians, athletes"
        />
        <BrandedDocumentaryPreview
          theme="influencer"
          title="Digital Voices Stories"
          description="Watch how creators, musicians, athletes, and influencers are using their platforms to change lives and amplify education across the continent."
          watchCtaHref="/media"
          imageAlt="Digital voices stories documentary preview"
        />
        <GoldTrackNavGrid />
        <GoldSpecialRecognitionSection />
        <NESAFooter />
      </div>
    </>
  );
}
