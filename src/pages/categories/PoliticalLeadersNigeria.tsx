import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { PoliticalLeadersNigeriaDirectory } from "@/components/awards/PoliticalLeadersNigeriaDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function PoliticalLeadersNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Political Leaders' Educational Support (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Honouring Nigerian political leaders championing policy, funding and reform for education at every level." />
        <link rel="canonical" href="https://nesa.africa/awards/political-leaders-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Political Leaders (Nigeria)", path: "/awards/political-leaders-nigeria" }]} />

      <BrandedCategoryHero
        theme="corporate"
        headlineLead="Which Nigerian Leaders Are"
        headlineAccent="Championing Education?"
        description="From federal ministers to governors and lawmakers, Nigerian political leaders driving policy, funding, and reform are shaping the future of education for millions of learners."
        tags={["Policy", "Reform", "Funding", "Leadership", "Governance", "Public Service", "Vision", "Accountability"]}
        stats={[
          { value: "Policy", label: "into Practice" },
          { value: "Reform", label: "with Impact" },
          { value: "Nigeria", label: "Public Sector Leadership" },
        ]}
        primaryCta={{ label: "Explore Leader Nominees", href: "/nominees?category=Political%20Leaders'%20Educational%20Support%20(Nigeria)" }}
        secondaryCta={{ label: "Vote for a Leader", href: "/vote" }}
        watchCta={{ label: "Watch Leadership Stories", href: "/media" }}
        imageAlt="Political Leaders' Educational Support — Nigeria"
      />
      <AnimatedActionWords
        theme="corporate"
        lead="Education Leadership Means"
        words={["Policy", "Reform", "Funding", "Vision", "Service", "Accountability", "Equity", "Access", "Investment", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="corporate"
        title="Leadership Stories"
        description="Discover how Nigerian political leaders are turning policy into classrooms, scholarships and opportunity for the next generation."
        watchCtaHref="/media"
        imageAlt="Political leadership stories preview"
      />
      <PoliticalLeadersNigeriaDirectory />
      <DynamicCategoryPage categoryTitle="Political Leaders' Educational Support (Nigeria)" nominationType="Political Leaders Nigeria" nominateCategorySlug="excellence-in-political-leadership-for-education-nigeria" />
    </>
  );
}
