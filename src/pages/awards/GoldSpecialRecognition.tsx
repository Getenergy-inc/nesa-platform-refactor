import { Helmet } from "react-helmet-async";
import { GoldSpecialRecognitionSection } from "@/components/nesa/GoldSpecialRecognitionSection";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { GoldTrackNavGrid } from "@/components/awards/GoldTrackNavGrid";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { AwardStandardStack } from "@/components/awards/AwardStandardSections";
import { FeaturedNomineesBlock } from "@/components/nominees/FeaturedNomineesBlock";

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
          secondaryCta={{ label: "Vote for Influencers", href: "/awards/gold-blue-garnet" }}
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

        {/* Standard NESA-Africa premium platform stack */}
        <AwardStandardStack
          awardName="Influencer Education Impact"
          why={{
            title: "Why the Influencer Education Impact Award Exists",
            pillars: [
              { label: "Education Through Influence", description: "Recognises creators, musicians, athletes, actors, and public voices who turn cultural reach into education impact." },
              { label: "Cultural Bridge", description: "Connects mainstream culture with classroom realities — funding, advocacy, mentorship, and visibility." },
              { label: "Youth Inspiration", description: "Models a generation of role models who treat education as the defining African story." },
            ],
          }}
          eligibility={{
            intro: "Open to public figures whose platform measurably advances education access, advocacy, or funding in Africa.",
            bullets: [
              "Documented public platform with continental reach",
              "Verifiable education-linked advocacy, funding, or programmes",
              "Authentic engagement (no coordinated inauthentic behaviour)",
              "Willingness to participate in the recognition campaign",
            ],
            disqualifiers: [
              "Brand-only association with no programme evidence",
              "Active safeguarding or integrity concerns",
              "Audience-buying or vote-manipulation patterns",
            ],
          }}
          edx={{
            weights: { E: "25%", D: "30%", X: "45%" },
            highlights: ["Reach", "Inclusion", "Innovation", "Community Impact"],
          }}
          faqs={[
            { q: "Does follower count alone qualify?", a: "No. Reach matters, but it is one of three pillars — Education Impact and Development Contribution evidence is still required." },
            { q: "Can teams or labels be nominated?", a: "Yes, where a named lead figure represents the work and accepts the recognition responsibilities." },
            { q: "Is public voting used?", a: "Public participation is used in eligible tracks; final recognition is governed by the EDX Matrix and integrity rules." },
          ]}
        />

        <section className="bg-charcoal py-8">
          <div className="container mx-auto px-4">
            <FeaturedNomineesBlock
              awardFamily="gold-bluegarnet"
              title="Existing Gold Special Recognition Nominees"
              subtitle="Discover the honourees already nominated for this premium 2025 tier."
              limit={6}
              viewAllHref="/nominees?awardFamily=gold-bluegarnet"
            />
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}
