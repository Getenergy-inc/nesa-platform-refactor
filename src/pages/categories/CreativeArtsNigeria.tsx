import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function CreativeArtsNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Creative Arts Industry Contribution to Education (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Honouring Nigerian creatives — Nollywood, music, fashion, design — using art to advance education." />
        <link rel="canonical" href="https://nesa.africa/awards/creative-arts-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Creative Arts (Nigeria)", path: "/awards/creative-arts-nigeria" }]} />

      <BrandedCategoryHero
        theme="influencer"
        headlineLead="Which Nigerian Creatives Are"
        headlineAccent="Educating Through Art?"
        description="From Nollywood to Afrobeats, fashion to design — Nigerian creatives are turning culture into a classroom, using storytelling and artistry to inspire learning across generations."
        tags={["Nollywood", "Music", "Fashion", "Design", "Storytelling", "Creativity", "Culture", "Inspiration"]}
        stats={[
          { value: "Culture", label: "as a Classroom" },
          { value: "Creators", label: "Inspiring Learning" },
          { value: "Nigeria", label: "Creative Impact" },
        ]}
        primaryCta={{ label: "Explore Creative Nominees", href: "/nominees?category=Creative%20Arts%20Industry%20Contribution%20to%20Education%20(Nigeria)" }}
        secondaryCta={{ label: "Vote for a Creative", href: "/vote" }}
        watchCta={{ label: "Watch Creative Stories", href: "/media" }}
        imageAlt="Creative Arts Industry Contribution to Education — Nigeria"
      />
      <AnimatedActionWords
        theme="influencer"
        lead="Nigerian Creatives Bring"
        words={["Creativity", "Storytelling", "Culture", "Music", "Film", "Fashion", "Design", "Inspiration", "Identity", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="influencer"
        title="Creative Stories"
        description="See how Nigeria's creative industry is shaping young minds — turning music, film and design into powerful tools for education and identity."
        watchCtaHref="/media"
        imageAlt="Creative arts stories preview"
      />
      <BrandedNomineeDirectory
        theme="influencer"
        categoryName="Creative Arts Industry Contribution to Education (Nigeria)"
        title="Live Creative Nominees"
      />
      <DynamicCategoryPage categoryTitle="Creative Arts Industry Contribution to Education (Nigeria)" nominationType="Creative Arts Nigeria" />
    </>
  );
}
