import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function NGOEducationAfricaPage() {
  return (
    <>
      <Helmet>
        <title>Best NGO Contribution to Education for All (Africa) | NESA-Africa</title>
        <meta name="description" content="Honouring NGOs delivering education access, equity and humanitarian impact for learners across Africa." />
        <link rel="canonical" href="https://nesa.africa/awards/ngo-africa" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "NGO Education (Africa)", path: "/awards/ngo-africa" }]} />

      <BrandedCategoryHero
        theme="ngo"
        headlineLead="Who Are Africa's"
        headlineAccent="Most Impactful Education NGOs?"
        description="Across Africa, NGOs are reaching the last mile — funding scholarships, building classrooms, rescuing out-of-school children, and unlocking education for the most underserved communities on the continent."
        tags={["Grassroots", "Humanitarian", "Equity", "Access", "Community", "Scholarships", "Inclusion", "Impact"]}
        stats={[
          { value: "Last Mile", label: "Education Access" },
          { value: "Equity", label: "For Every Learner" },
          { value: "Continental", label: "NGO Impact" },
        ]}
        primaryCta={{ label: "Explore NGO Nominees", href: "/nominees?category=Best%20NGO%20Contribution%20to%20Education%20for%20All%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Vote for an NGO", href: "/vote" }}
        watchCta={{ label: "Watch Humanitarian Stories", href: "/media" }}
        imageAlt="Best NGO Contribution to Education — Africa Regional"
      />
      <AnimatedActionWords
        theme="ngo"
        lead="NGOs Across Africa Deliver"
        words={["Access", "Equity", "Inclusion", "Compassion", "Community", "Scholarships", "Hope", "Rescue", "Empowerment", "Impact"]}
      />
      <BrandedDocumentaryPreview
        theme="ngo"
        title="Humanitarian Stories"
        description="Discover how NGOs across Africa are restoring dignity through education, reaching the most vulnerable learners with care, resources and opportunity."
        watchCtaHref="/media"
        imageAlt="NGO humanitarian stories preview"
      />
      <BrandedNomineeDirectory
        theme="ngo"
        categoryName="Best NGO Contribution to Education for All (Africa Regional)"
        title="Live NGO Nominees"
        description="NGOs verified by the NESA Nominee Research Corps, streaming live."
      />
      <DynamicCategoryPage categoryTitle="Best NGO Contribution to Education for All (Africa Regional)" nominationType="NGO Africa" nominateCategorySlug="best-ngo-for-education-advancement-africa-regional" />
    </>
  );
}
