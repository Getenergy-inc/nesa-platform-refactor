import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function EducationFriendlyStateNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Best Education-Friendly State (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Celebrating Nigerian states making the boldest investments and reforms in basic and tertiary education." />
        <link rel="canonical" href="https://nesa.africa/awards/education-state-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Education-Friendly State (Nigeria)", path: "/awards/education-state-nigeria" }]} />

      <BrandedCategoryHero
        theme="regional"
        headlineLead="Which Nigerian State Is"
        headlineAccent="Most Education-Friendly?"
        description="From budget allocation to teacher welfare, infrastructure and enrolment, Nigeria's most education-friendly states are setting the benchmark for sub-national education leadership."
        tags={["Budget", "Enrolment", "Teachers", "Infrastructure", "Reform", "Access", "Equity", "Outcomes"]}
        stats={[
          { value: "Sub-National", label: "Education Leadership" },
          { value: "Benchmarks", label: "for Nigeria" },
          { value: "States", label: "in Reform Mode" },
        ]}
        primaryCta={{ label: "Explore State Nominees", href: "/nominees?category=Best%20Education-Friendly%20State%20(Nigeria)" }}
        secondaryCta={{ label: "Vote for a State", href: "/vote" }}
        watchCta={{ label: "Watch State Stories", href: "/media" }}
        imageAlt="Best Education-Friendly State — Nigeria"
      />
      <AnimatedActionWords
        theme="regional"
        lead="Education-Friendly States Deliver"
        words={["Budget", "Teachers", "Enrolment", "Infrastructure", "Access", "Equity", "Reform", "Outcomes", "Vision", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="regional"
        title="State Reform Stories"
        description="Discover the Nigerian states rewriting the playbook for sub-national education — from primary classrooms to tertiary campuses."
        watchCtaHref="/media"
        imageAlt="Education-friendly state stories preview"
      />
      <BrandedNomineeDirectory
        theme="regional"
        categoryName="Best Education-Friendly State (Nigeria)"
        title="Live State Nominees"
      />
      <DynamicCategoryPage categoryTitle="Best Education-Friendly State (Nigeria)" nominationType="Education State Nigeria" />
    </>
  );
}
