import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function LibraryNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Best Library in Nigerian Tertiary Institutions | NESA-Africa</title>
        <meta name="description" content="Celebrating the best academic libraries across Nigerian tertiary institutions — knowledge sanctuaries shaping scholarship." />
        <link rel="canonical" href="https://nesa.africa/awards/library-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Library (Nigeria)", path: "/awards/library-nigeria" }]} />

      <BrandedCategoryHero
        theme="legacy"
        headlineLead="Which Library Is"
        headlineAccent="Nigeria's Knowledge Sanctuary?"
        description="From rare archives to digital catalogues and modern learning commons, Nigeria's top tertiary libraries are the quiet engines of scholarship, research and academic excellence."
        tags={["Library", "Knowledge", "Research", "Archives", "Digital", "Scholarship", "Heritage", "Excellence"]}
        stats={[
          { value: "Knowledge", label: "Sanctuaries" },
          { value: "Research", label: "Powerhouses" },
          { value: "Nigeria", label: "Academic Excellence" },
        ]}
        primaryCta={{ label: "Explore Library Nominees", href: "/nominees?category=Best%20Library%20in%20Nigerian%20Tertiary%20Institutions" }}
        secondaryCta={{ label: "Vote for a Library", href: "/vote" }}
        watchCta={{ label: "Watch Library Stories", href: "/media" }}
        imageAlt="Best Library in Nigerian Tertiary Institutions"
      />
      <AnimatedActionWords
        theme="legacy"
        lead="Libraries Are"
        words={["Knowledge", "Research", "Archives", "Discovery", "Heritage", "Scholarship", "Memory", "Wisdom", "Curiosity", "Excellence"]}
      />
      <BrandedDocumentaryPreview
        theme="legacy"
        title="Library Stories"
        description="Step inside Nigeria's most remarkable academic libraries — places where centuries of scholarship meet tomorrow's discoveries."
        watchCtaHref="/media"
        imageAlt="Library stories preview"
      />
      <BrandedNomineeDirectory
        theme="legacy"
        categoryName="Best Library in Nigerian Tertiary Institutions"
        title="Live Library Nominees"
      />
      <DynamicCategoryPage categoryTitle="Best Library in Nigerian Tertiary Institutions" nominationType="Library Nigeria" nominateCategorySlug="best-tertiary-institution-library-nigeria" />
    </>
  );
}
