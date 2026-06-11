import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function MediaAdvocacyNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Best Media Organisation in Educational Advocacy (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Celebrating Nigerian media organisations using broadcast, print and digital platforms to advance education." />
        <link rel="canonical" href="https://nesa.africa/awards/media-advocacy-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Media Advocacy (Nigeria)", path: "/awards/media-advocacy-nigeria" }]} />

      <BrandedCategoryHero
        theme="media"
        headlineLead="Whose Voice Is Shaping"
        headlineAccent="Nigeria's Education Narrative?"
        description="From newsrooms and radio to documentaries and digital platforms, Nigerian media organisations are putting education on the national agenda — driving awareness, accountability, and change."
        tags={["Media", "Broadcast", "Print", "Digital", "Advocacy", "Storytelling", "Awareness", "Voice"]}
        stats={[
          { value: "Voice", label: "of Nigerian Education" },
          { value: "Awareness", label: "Driving Change" },
          { value: "Nigeria", label: "Media Impact" },
        ]}
        primaryCta={{ label: "Explore Media Nominees", href: "/nominees?category=Best%20Media%20Organisation%20in%20Educational%20Advocacy%20(Nigeria)" }}
        secondaryCta={{ label: "Vote for a Media House", href: "/vote" }}
        watchCta={{ label: "Watch Advocacy Stories", href: "/media" }}
        imageAlt="Best Media Organisation in Educational Advocacy — Nigeria"
      />
      <AnimatedActionWords
        theme="media"
        lead="Nigerian Media Champions"
        words={["Voice", "Storytelling", "Awareness", "Advocacy", "Accountability", "Truth", "Reach", "Influence", "Change", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="media"
        title="Advocacy Stories"
        description="Watch how Nigerian media organisations are using storytelling, journalism and broadcast power to drive educational reform and awareness."
        watchCtaHref="/media"
        imageAlt="Media advocacy stories preview"
      />
      <BrandedNomineeDirectory
        theme="media"
        categoryName="Best Media Organisation in Educational Advocacy (Nigeria)"
        title="Live Media Nominees"
      />
      <DynamicCategoryPage categoryTitle="Best Media Organisation in Educational Advocacy (Nigeria)" nominationType="Media Advocacy Nigeria" />
    </>
  );
}
