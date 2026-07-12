// Endorsements — canonical /endorsements page (22-page architecture).
// Mounts the existing EndorseNESA wizard verbatim.
import { Helmet } from "react-helmet-async";
import EndorseNESA from "@/pages/EndorseNESA";

export default function EndorsementsPage() {
  return (
    <>
      <Helmet>
        <title>Endorsements · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Official endorsements of NESA-Africa 2026 by governments, institutions, corporates and civil-society organisations advancing Education for All Across Africa."
        />
      </Helmet>
      <EndorseNESA />
    </>
  );
}
