import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";

export default function CSREducationAfricaPage() {
  return (
    <>
      <BrandedCategoryHero
        theme="corporate"
        headlineLead="Who Will Emerge as Africa's"
        headlineAccent="Leading CSR for Education Company?"
        description="Across Africa, visionary corporations are funding innovation, supporting schools, empowering educators, and investing in future generations through education impact initiatives."
        tags={["Innovation", "Infrastructure", "Scholarships", "Inclusion", "CSR Impact", "Technology", "Access", "Partnership"]}
        stats={[
          { value: "Sustainable", label: "Education Impact" },
          { value: "Future", label: "Investing in Generations" },
          { value: "Continental", label: "Corporate Impact Across Africa" },
        ]}
        primaryCta={{ label: "Explore Corporate Nominees", href: "/nominees?category=Best%20CSR%20in%20Education%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Partner With NESA", href: "/partners" }}
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
        description="See how leading organizations are funding innovation, expanding access, and creating real, measurable change across African education systems."
        watchCtaHref="/media"
        imageAlt="Corporate impact stories documentary preview"
      />
      <BrandedNomineeDirectory
        theme="corporate"
        categoryName="Best CSR in Education (Africa Regional)"
        title="Live Corporate Nominees"
        description="Verified CSR-for-Education nominees streaming live from the NESA database."
      />
      <DynamicCategoryPage
        categoryTitle="Best CSR in Education (Africa Regional)"
        nominationType="CSR Africa"
      />
    </>
  );
}
