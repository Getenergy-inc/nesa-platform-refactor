import { Helmet } from "react-helmet-async";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { MobileBottomNav } from "@/components/navigation/MainNav";
import { SpecialSchoolImpactSection } from "@/components/nesa/SpecialSchoolImpactSection";

export default function SpecialSchoolImpact() {
  return (
    <>
      <Helmet>
        <title>Special School Impact (2026–2027) | EduAid Africa × Rebuild My School Africa</title>
        <meta
          name="description"
          content="EduAid Africa and Rebuild My School Africa: improving learning environments for special needs schools across Africa from October 2026 to October 2027."
        />
        <link rel="canonical" href="https://nesa.africa/special-school-impact" />
      </Helmet>

      <div className="min-h-screen bg-charcoal pt-14 sm:pt-16 pb-16">
        <NESAHeader />
        <SpecialSchoolImpactSection />
        <NESAFooter />
      </div>
      <MobileBottomNav />
    </>
  );
}
