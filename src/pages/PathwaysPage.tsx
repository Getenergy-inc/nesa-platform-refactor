// Pathways to Recognition — dedicated page that surfaces the landing-page section
// so deep links like /pathways and "Back to Pathways" buttons work everywhere.

import { Helmet } from "react-helmet-async";
import { AwardSpotlightSection } from "@/components/nesa/AwardSpotlightSection";

export default function PathwaysPage() {
  return (
    <>
      <Helmet>
        <title>Pathways to Recognition — NESA-Africa 2026</title>
        <meta
          name="description"
          content="From lifetime icons to corporate champions, digital voices, and global partners — explore every recognition pathway for NESA-Africa 2026."
        />
      </Helmet>
      <AwardSpotlightSection />
    </>
  );
}
