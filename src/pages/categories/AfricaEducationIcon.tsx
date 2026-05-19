import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { IconSubcategoryNavGrid } from "@/components/awards/IconSubcategoryNavGrid";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function AfricaEducationIconPage() {
  return (
    <>
      <Helmet>
        <title>Africa Education Icon Award 2006–2026 | NESA-Africa</title>
        <meta
          name="description"
          content="Celebrating two decades of visionary leaders transforming African education through advocacy, reform, innovation and generational impact."
        />
        <link rel="canonical" href="https://nesaafrica.lovable.app/awards/africa-education-icon" />
      </Helmet>

      <BrandedCategoryHero
        theme="legacy"
        headlineLead="Who Will Be Crowned"
        headlineAccent="Africa Education Icon?"
        description="For two decades, visionary leaders have transformed education across Africa through advocacy, reform, innovation, access, and generational impact. The Africa Education Icon Award celebrates individuals whose lifelong contributions continue to shape the future of learning across the continent."
        tags={["Legacy", "Impact", "Transformation", "Leadership", "Vision", "Empowerment", "Excellence", "Opportunity"]}
        stats={[
          { value: "2006–2026", label: "Two Decades of Impact" },
          { value: "Legendary", label: "Education Leaders" },
          { value: "Continental", label: "Transforming Africa" },
        ]}
        primaryCta={{ label: "Explore Icon Nominees", href: "/nominees?category=Africa%20Education%20Icon%20Award%20(2006%E2%80%932026)" }}
        secondaryCta={{ label: "Nominate an Education Legend", href: "/nominate?category=africa-education-icon-award" }}
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
        status="Documentary Coming Soon"
        description="Watch the stories of Africa's most influential education leaders and discover how their vision transformed generations."
        watchCtaLabel="Watch Legacy Stories"
        watchCtaHref="/media"
        imageAlt="Legacy stories documentary preview"
      />
      <IconSubcategoryNavGrid />
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
