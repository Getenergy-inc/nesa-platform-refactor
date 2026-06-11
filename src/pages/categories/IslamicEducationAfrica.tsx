import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function IslamicEducationAfricaPage() {
  return (
    <>
      <Helmet>
        <title>Islamic Education Impact (Africa) | NESA-Africa</title>
        <meta name="description" content="Recognising Islamic institutions and educators advancing scholarship, character and opportunity across Africa." />
        <link rel="canonical" href="https://nesa.africa/awards/islamic-education-africa" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "Islamic Education (Africa)", path: "/awards/islamic-education-africa" }]} />

      <BrandedCategoryHero
        theme="regional"
        headlineLead="Which Islamic Institutions Are"
        headlineAccent="Advancing African Education?"
        description="From historic madrasas to modern integrated schools and universities, Islamic institutions are advancing scholarship, character formation, and opportunity for millions of African learners."
        tags={["Faith", "Scholarship", "Integrated", "Character", "Heritage", "Community", "Service", "Impact"]}
        stats={[
          { value: "Faith", label: "Meets Excellence" },
          { value: "Heritage", label: "of Scholarship" },
          { value: "Continental", label: "Islamic Education Impact" },
        ]}
        primaryCta={{ label: "Explore Islamic Education Nominees", href: "/nominees?category=Islamic%20Education%20Impact%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Vote for an Institution", href: "/vote" }}
        watchCta={{ label: "Watch Faith Stories", href: "/media" }}
        imageAlt="Islamic Education Impact — Africa Regional"
      />
      <AnimatedActionWords
        theme="regional"
        lead="Islamic Education Stands For"
        words={["Faith", "Scholarship", "Character", "Heritage", "Service", "Community", "Discipline", "Compassion", "Knowledge", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="regional"
        title="Heritage Stories"
        description="See how Islamic institutions across Africa weave faith, knowledge and service into powerful educational journeys for the next generation."
        watchCtaHref="/media"
        imageAlt="Islamic education stories preview"
      />
      <BrandedNomineeDirectory
        theme="regional"
        categoryName="Islamic Education Impact (Africa Regional)"
        title="Live Islamic Education Nominees"
      />
      <DynamicCategoryPage categoryTitle="Islamic Education Impact (Africa Regional)" nominationType="Islamic Education Africa" nominateCategorySlug="excellence-in-islamic-education-impact-africa-regional" />
    </>
  );
}
