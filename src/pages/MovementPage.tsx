import { Helmet } from "react-helmet-async";
import { SupportExperienceSection } from "@/components/nesa/SupportExperienceSection";

export default function MovementPage() {
  return (
    <>
      <Helmet>
        <title>Be Part of the Movement — NESA Africa</title>
        <meta
          name="description"
          content="Attend the gala, wear the brand, play the anthem, or join a local chapter — four ways to celebrate and lead Africa's education movement."
        />
      </Helmet>
      <SupportExperienceSection />
    </>
  );
}
