import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";

export default function AfricaEducationIconPage() {
  return (
    <>
      <BrandedCategoryHero
        theme="legacy"
        headlineLead="Who Will Be Crowned"
        headlineAccent="Africa Education Icon?"
        description="For two decades, Africa's most transformative education leaders have shaped learning, expanded opportunity, empowered communities, and inspired generations across the continent."
        tags={["Legacy", "Impact", "Transformation", "Leadership", "Vision", "Empowerment", "Excellence", "Opportunity"]}
        stats={[
          { value: "2006–2026", label: "Two Decades of Impact" },
          { value: "Legendary", label: "Education Leaders" },
          { value: "Continental", label: "Transforming Africa" },
        ]}
        primaryCta={{ label: "Explore Icon Nominees", href: "/nominees?category=Africa%20Education%20Icon%20Award%20(2006%E2%80%932026)" }}
        secondaryCta={{ label: "Nominate a Legend", href: "/nominate?category=africa-education-icon-award" }}
        watchCta={{ label: "Watch Legacy Stories", href: "/media" }}
        imageAlt="Africa Education Icon Award — two decades of legacy"
      />
      <AnimatedActionWords
        theme="legacy"
        lead="This Award Stands For"
        words={["Legacy", "Transformation", "Impact", "Leadership", "Opportunity", "Vision", "Empowerment", "Excellence", "Education for All", "Future Builders"]}
      />
      <BrandedDocumentaryPreview
        theme="legacy"
        title="Legacy Stories"
        description="Watch how Africa's most influential education leaders shaped generations and built the foundations of our future learning systems."
        watchCtaHref="/media"
        imageAlt="Legacy stories documentary preview"
      />
      <BrandedNomineeDirectory
        theme="legacy"
        categoryName="Africa Education Icon Award (2006–2026)"
        title="Live Icon Nominees"
        description="Verified nominees pulled live from the NESA database — refreshed as the Nominee Research Corps validates each entry."
      />
      <DynamicCategoryPage
        categoryTitle="Africa Education Icon Award (2006–2026)"
        nominationType="Africa Education Icon"
      />
    </>
  );
}
