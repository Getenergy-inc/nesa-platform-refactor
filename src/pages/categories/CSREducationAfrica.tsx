import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { RelatedIconHonoureesRibbon } from "@/components/awards/RelatedIconHonoureesRibbon";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function CSREducationAfricaPage() {
  return (
    <>
      <Helmet>
        <title>CSR for Education — Corporate Recognition | NESA-Africa</title>
        <meta
          name="description"
          content="Recognizing corporations funding learning infrastructure, technology access, scholarships and educational transformation across Africa."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/awards/csr-for-education" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "CSR for Education", path: "/awards/csr-education" }]} />

      <BrandedCategoryHero
        theme="corporate"
        headlineLead="Who Will Emerge as Africa's"
        headlineAccent="Leading CSR for Education Company?"
        description="Across Africa, corporations are investing in learning infrastructure, technology access, scholarships, teacher empowerment, and educational transformation. CSR for Education recognizes organizations creating measurable long-term impact across African learning systems."
        tags={["Innovation", "Infrastructure", "Scholarships", "Inclusion", "CSR Impact", "Technology", "Access", "Partnership"]}
        stats={[
          { value: "Sustainable", label: "Education Impact" },
          { value: "Future", label: "Investing in Generations" },
          { value: "Continental", label: "Corporate Impact Across Africa" },
        ]}
        primaryCta={{ label: "Explore Corporate Nominees", href: "/nominees?category=Best%20CSR%20in%20Education%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Partner With NESA Africa", href: "/partners" }}
        watchCta={{ label: "See Corporate Impact Stories", href: "/media" }}
        imageAlt="Best CSR for Education — corporate impact across Africa"
      />
      <AnimatedActionWords
        theme="corporate"
        lead="Corporate Africa Is"
        words={["Innovation", "Scholarships", "Infrastructure", "Technology", "Inclusion", "Sustainability", "Access", "CSR Impact", "Partnership", "Opportunity"]}
      />
      <BrandedDocumentaryPreview
        theme="corporate"
        title="Corporate Impact Stories"
        status="Documentary Coming Soon"
        description="Discover how organizations are funding educational opportunity and transforming the future of African learners."
        watchCtaLabel="See Corporate Impact Stories"
        watchCtaHref="/media"
        imageAlt="Corporate impact stories documentary preview"
      />
      <BrandedNomineeDirectory
        theme="corporate"
        categoryName="Best CSR in Education (Africa Regional)"
        title="Live Corporate Nominees"
        description="Verified CSR-for-Education nominees streaming live from the NESA database."
      />
      <RelatedIconHonoureesRibbon
        title="Education Philanthropy Lifetime Honourees"
        description="Foundation leaders, scholarship sponsors and CSR funders recognised in the Africa Education Icon Award."
        filterSubcategory="education-philanthropy-icon"
      />
      <DynamicCategoryPage
        categoryTitle="Best CSR in Education (Africa Regional)"
        nominationType="CSR Africa"
      />
    </>
  );
}
