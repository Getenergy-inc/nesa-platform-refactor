import AwardLanePage from "@/components/get-involved/AwardLanePage";

export default function EduTechLanePage() {
  return (
    <AwardLanePage
      title="EduTech"
      subtitle="Officially recognised as Best EduTech Innovation for Education (Africa Regional)"
      meaning="This lane is for organisations building digital learning tools and platforms that expand access to, or improve the quality of, education across Africa — learning management systems, digital content platforms, connectivity solutions, and education software."
      audience={[
        "EdTech companies with live, verifiable products serving African learners or institutions.",
        "Nonprofit technology organisations delivering digital learning at scale.",
        "Platforms with measurable learner reach and outcome evidence — not concept-stage ideas.",
      ]}
      categories={[
        {
          name: "Best EduTech Innovation for Education (Africa Regional)",
          tier: "Gold-Blue Garnet Recognition",
          whoItsFor:
            "Your organisation builds technology that demonstrably improves education access or quality across African markets.",
          categoryHref: "/category/edutech-africa",
          nominateHref:
            "/nominate?category=best-edutech-innovation-for-education-africa-regional",
        },
      ]}
      metaDescription="Nominate an EdTech organisation for the NESA-Africa Best EduTech Innovation for Education (Africa Regional) award — recognising technology advancing African education."
    />
  );
}
