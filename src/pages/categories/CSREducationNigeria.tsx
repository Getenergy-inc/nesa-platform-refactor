import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function CSREducationNigeriaPage() {
  return (
    <>
      <Helmet>
        <title>Best CSR in Education (Nigeria) | NESA-Africa</title>
        <meta name="description" content="Honouring Nigerian corporates channelling CSR into scholarships, infrastructure, and lasting education impact." />
        <link rel="canonical" href="https://nesa.africa/awards/csr-nigeria" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "CSR for Education (Nigeria)", path: "/awards/csr-nigeria" }]} />

      <BrandedCategoryHero
        theme="corporate"
        headlineLead="Which Nigerian Corporates Are"
        headlineAccent="Investing in Education?"
        description="From banks to telcos, energy majors to FMCGs, Nigerian corporates are turning CSR into measurable educational impact — funding scholarships, infrastructure, teacher development and innovation."
        tags={["CSR", "Scholarships", "Infrastructure", "Teachers", "Innovation", "Investment", "Partnership", "Impact"]}
        stats={[
          { value: "Corporate", label: "Citizenship in Action" },
          { value: "Scholarships", label: "& Infrastructure" },
          { value: "Nigeria", label: "CSR Impact" },
        ]}
        primaryCta={{ label: "Explore CSR Nominees", href: "/nominees?category=Best%20CSR%20in%20Education%20(Nigeria)" }}
        secondaryCta={{ label: "Partner With NESA", href: "/partners" }}
        watchCta={{ label: "Watch CSR Stories", href: "/media" }}
        imageAlt="Best CSR in Education — Nigeria"
      />
      <AnimatedActionWords
        theme="corporate"
        lead="Nigerian Corporates Deliver"
        words={["Scholarships", "Infrastructure", "Teachers", "Innovation", "Investment", "Citizenship", "Equity", "Partnership", "Access", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="corporate"
        title="Corporate Impact Stories"
        description="See how Nigeria's leading corporates are translating CSR commitments into classrooms, scholarships and futures."
        watchCtaHref="/media"
        imageAlt="Nigerian corporate CSR stories preview"
      />
      <BrandedNomineeDirectory
        theme="corporate"
        categoryName="Best CSR in Education (Nigeria)"
        title="Live Corporate Nominees"
      />
      <DynamicCategoryPage categoryTitle="Best CSR in Education (Nigeria)" nominationType="CSR Nigeria" />
    </>
  );
}
