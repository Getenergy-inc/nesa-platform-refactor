import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function EduTechAfricaPage() {
  return (
    <>
      <Helmet>
        <title>Best EduTech Organisation (Africa) | NESA-Africa</title>
        <meta name="description" content="Celebrating EduTech companies digitising African learning — platforms, apps and innovation transforming education." />
        <link rel="canonical" href="https://nesa.africa/awards/edutech-africa" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "EduTech (Africa)", path: "/awards/edutech-africa" }]} />

      <BrandedCategoryHero
        theme="stem"
        headlineLead="Which EduTech Is"
        headlineAccent="Powering Africa's Classrooms?"
        description="From learning platforms to AI tutors and offline-first apps, African EduTech organisations are redefining how learners access knowledge — at scale, in any language, on any device."
        tags={["EduTech", "AI", "Apps", "Platforms", "Digital", "Access", "Innovation", "Scale"]}
        stats={[
          { value: "Digital", label: "Learning at Scale" },
          { value: "Innovation", label: "African Built" },
          { value: "Continental", label: "EduTech Impact" },
        ]}
        primaryCta={{ label: "Explore EduTech Nominees", href: "/nominees?category=Best%20EduTech%20Organisation%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Vote for an EduTech", href: "/vote" }}
        watchCta={{ label: "Watch Tech Stories", href: "/media" }}
        imageAlt="Best EduTech Organisation — Africa Regional"
      />
      <AnimatedActionWords
        theme="stem"
        lead="EduTech in Africa Means"
        words={["Access", "Scale", "Innovation", "AI", "Mobile", "Offline-First", "Inclusion", "Personalisation", "Skills", "Future"]}
      />
      <BrandedDocumentaryPreview
        theme="stem"
        title="Tech Transformation Stories"
        description="Discover how African EduTech is reinventing classrooms, expanding access, and bringing world-class learning to every device on the continent."
        watchCtaHref="/media"
        imageAlt="EduTech transformation stories preview"
      />
      <BrandedNomineeDirectory
        theme="stem"
        categoryName="Best EduTech Organisation (Africa Regional)"
        title="Live EduTech Nominees"
      />
      <DynamicCategoryPage
        categoryTitle="Best EduTech Organisation (Africa Regional)"
        nominationType="EduTech Africa"
        nominateCategorySlug="best-edutech-innovation-for-education-africa-regional"
      />
    </>
  );
}
