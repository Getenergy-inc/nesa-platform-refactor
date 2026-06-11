import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function ResearchDevelopmentNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Best Research & Development Contribution to Education (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Recognising Nigerian R&D institutions producing the research that shapes tomorrow's classrooms and curricula." />
        <link rel="canonical" href="https://nesa.africa/awards/rd-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "R&D (Nigeria)", path: "/awards/rd-nigeria" }]} />

      <BrandedCategoryHero
        theme="stem"
        headlineLead="Whose Research Is"
        headlineAccent="Reshaping Nigerian Education?"
        description="From peer-reviewed studies to applied innovation, Nigeria's R&D institutions are producing the evidence and ideas that reshape curricula, classrooms and learner outcomes."
        tags={["Research", "Innovation", "Evidence", "Curriculum", "Insight", "Discovery", "Data", "Impact"]}
        stats={[
          { value: "Evidence", label: "Driven Reform" },
          { value: "Discovery", label: "for Classrooms" },
          { value: "Nigeria", label: "R&D Excellence" },
        ]}
        primaryCta={{ label: "Explore R&D Nominees", href: "/nominees?category=Best%20Research%20%26%20Development%20Contribution%20to%20Education%20(Nigeria)" }}
        secondaryCta={{ label: "Vote for an Institution", href: "/vote" }}
        watchCta={{ label: "Watch Research Stories", href: "/media" }}
        imageAlt="Best Research & Development Contribution to Education — Nigeria"
      />
      <AnimatedActionWords
        theme="stem"
        lead="Research Powers"
        words={["Discovery", "Evidence", "Innovation", "Curriculum", "Insight", "Data", "Knowledge", "Reform", "Progress", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="stem"
        title="Research Stories"
        description="See how Nigerian R&D institutions are translating research into real classroom change — better tools, better curricula, better outcomes."
        watchCtaHref="/media"
        imageAlt="R&D stories preview"
      />
      <BrandedNomineeDirectory
        theme="stem"
        categoryName="Best Research & Development Contribution to Education (Nigeria)"
        title="Live R&D Nominees"
      />
      <DynamicCategoryPage categoryTitle="Best Research & Development Contribution to Education (Nigeria)" nominationType="R&D Nigeria" nominateCategorySlug="excellence-in-research-development-for-education-nigeria" />
    </>
  );
}
