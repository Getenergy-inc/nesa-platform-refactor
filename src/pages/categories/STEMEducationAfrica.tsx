import { Helmet } from "react-helmet-async";
import { DynamicCategoryPage } from "@/components/awards/DynamicCategoryPage";
import { BrandedCategoryHero } from "@/components/awards/BrandedCategoryHero";
import { BrandedDocumentaryPreview } from "@/components/awards/BrandedDocumentaryPreview";
import { AnimatedActionWords } from "@/components/awards/AnimatedActionWords";
import { BrandedNomineeDirectory } from "@/components/awards/BrandedNomineeDirectory";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export default function STEMEducationAfricaPage() {
  return (
    <>
      <Helmet>
        <title>Best STEM Education Programme (Africa) | NESA-Africa</title>
        <meta name="description" content="Celebrating Africa's leading STEM education programmes — science, technology, engineering and mathematics powering the next generation of innovators." />
        <link rel="canonical" href="https://nesa.africa/awards/stem-africa" />
      </Helmet>
      <BreadcrumbJsonLd crumbs={[{ name: "Home", path: "/" }, { name: "Awards", path: "/awards" }, { name: "STEM Education (Africa)", path: "/awards/stem-africa" }]} />

      <BrandedCategoryHero
        theme="stem"
        headlineLead="Who Will Lead Africa's"
        headlineAccent="STEM Revolution?"
        description="Africa's STEM programmes are equipping learners with the science, technology, engineering and mathematics skills needed to power innovation, industry, and future economies across the continent."
        tags={["Science", "Technology", "Engineering", "Mathematics", "Innovation", "Coding", "AI", "Robotics"]}
        stats={[
          { value: "Future", label: "Skills for Africa" },
          { value: "Innovators", label: "Next Generation" },
          { value: "Continental", label: "STEM Impact" },
        ]}
        primaryCta={{ label: "Explore STEM Nominees", href: "/nominees?category=Best%20STEM%20Education%20Programme%20(Africa%20Regional)" }}
        secondaryCta={{ label: "Vote for STEM Leaders", href: "/vote" }}
        watchCta={{ label: "Watch Innovation Stories", href: "/media" }}
        imageAlt="Best STEM Education Programme — Africa Regional"
      />
      <AnimatedActionWords
        theme="stem"
        lead="STEM in Africa Means"
        words={["Innovation", "Discovery", "Engineering", "Robotics", "AI", "Curiosity", "Future", "Code", "Science", "Opportunity"]}
      />
      <BrandedDocumentaryPreview
        theme="stem"
        title="Innovation Stories"
        description="See how Africa's STEM educators and programmes are sparking discovery, invention, and opportunity for a new generation of African innovators."
        watchCtaHref="/media"
        imageAlt="STEM innovation stories preview"
      />
      <BrandedNomineeDirectory
        theme="stem"
        categoryName="Best STEM Education Programme (Africa Regional)"
        title="Live STEM Nominees"
        description="Verified STEM education nominees streaming live from the NESA database."
      />
      <DynamicCategoryPage categoryTitle="Best STEM Education Programme (Africa Regional)" nominationType="STEM Africa" />
    </>
  );
}
