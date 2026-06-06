import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function ChristianEducationAfricaPage() {
  return (
    <>
      <Helmet>
        <title>Christian Education Impact (Africa) | NESA-Africa</title>
        <meta name="description" content="Honouring Christian institutions, missions and faith-based organisations advancing education across Africa." />
        <link rel="canonical" href="https://nesa.africa/awards/christian-education-africa" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Christian Education (Africa)", path: "/awards/christian-education-africa" }]} />

      <BrandedCategoryHero
        theme="regional"
        headlineLead="Which Christian Institutions Are"
        headlineAccent="Shaping African Learning?"
        description="From mission schools to seminaries and faith-based universities, Christian institutions have long been pillars of African education — forming character, scholarship and service across generations."
        tags={["Faith", "Mission", "Scholarship", "Service", "Character", "Community", "Heritage", "Impact"]}
        stats={[
          { value: "Faith", label: "Meets Learning" },
          { value: "Generations", label: "of Service" },
          { value: "Continental", label: "Faith-Based Impact" },
        ]}
        primaryCta={{ label: "Explore Christian Education Nominees", href: "/nominees?category=Christian%20Education%20Impact%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Vote for an Institution", href: "/vote" }}
        watchCta={{ label: "Watch Faith Stories", href: "/media" }}
        imageAlt="Christian Education Impact — Africa Regional"
      />
      <AnimatedActionWords
        theme="regional"
        lead="Christian Education Stands For"
        words={["Faith", "Scholarship", "Service", "Character", "Community", "Compassion", "Mission", "Heritage", "Formation", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="regional"
        title="Faith Stories"
        description="Discover how Christian institutions across Africa continue to shape minds, character and communities through dedicated educational service."
        watchCtaHref="/media"
        imageAlt="Christian education stories preview"
      />
      <BrandedNomineeDirectory
        theme="regional"
        categoryName="Christian Education Impact (Africa Regional)"
        title="Live Christian Education Nominees"
      />
      <DynamicCategoryPage categoryTitle="Christian Education Impact (Africa Regional)" nominationType="Christian Education Africa" nominateCategorySlug="excellence-in-christian-education-impact-africa-regional" />
    </>
  );
}
