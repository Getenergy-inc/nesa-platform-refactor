import "@/features/landing/editorial/editorial.css";
import { VolunteerBandSection } from "@/features/landing/editorial/VolunteerBandSection";
import { LeanHero, LeanSection, LeanCtas } from "@/components/lean/LeanPage";
import { useTranslation } from "react-i18next";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { ParticipationInterestForm } from "@/components/school-support/ParticipationInterestForm";
import { RecognitionIntegrityLine } from "@/components/nesa/SiteWideContent2026";

const BLOCKS = [
  { title: "Nominate", body: "Know an education enabler? Tell us.", button: "Nominate", href: PUBLIC_ACTIONS_2026.nominate.href },
  { title: "Support a school", body: "Nominate, vote, donate or fund a scholarship.", button: "Support a school", href: "/impact/special-needs-schools" },
  { id: "volunteer", title: "Volunteer", body: "Give time to research, media or school support.", button: "Volunteer", href: "/contact?topic=volunteer" },
  { id: "chapters", title: "Start or join a chapter", body: "Friends of EduAid-Africa are SCEF's local chapters around the world.", button: "Start or join a chapter", href: "/contact?topic=chapter" },
  { title: "Partner or sponsor", body: "Back a school, a region or the programme.", button: "Sponsor or Partner", href: "/impact/special-needs-schools#partner" },
  { title: "Learn with the Academy", body: "Courses for teachers, volunteers and young people.", button: "Learn with the Academy", href: "#academy" },
];
export default function GetInvolvedPage() {
  const { t } = useTranslation("pages");
  return <main id="main-content">
    <LeanHero title={t("getInvolved.messageC.title", "Choose how you help")} path="/get-involved" seoTitle={t("getInvolved.messageC.seo", "Get Involved With NESA-Africa and EduAid-Africa")} description={t("getInvolved.messageC.description", "Nominate, support a school, volunteer, join a chapter, partner or learn with the Academy.")} />
    {BLOCKS.map((block, index) => <LeanSection key={block.title} id={block.id} title={t(`getInvolved.messageC.${index}.title`, block.title)} tone={index % 2 ? "dark" : "light"}><p>{t(`getInvolved.messageC.${index}.body`, block.body)}</p><LeanCtas ctas={[{ label: t(`getInvolved.messageC.${index}.button`, block.button), href: block.href, primary: true }]} /></LeanSection>)}
    <LeanSection id="academy" title={t("getInvolved.messageC.academyTitle", "EduAid-Africa Academy")} tone="dark">
      <p>{t("getInvolved.messageC.academyLine", "Practical learning for inclusive education and Africa's next generation.")}</p>
      <ul className="mt-5 list-disc space-y-2 pl-5">{["Special-needs education teacher training", "Webinars and podcast learning", "Youth digital and AI skills", "Volunteer, chapter, NRRC and judge training"].map((offer, index) => <li key={offer}>{t(`getInvolved.messageC.offers.${index}`, offer)}</li>)}</ul>
      <p className="my-5">{t("getInvolved.messageC.academyDates", "Courses and dates are announced to registered learners first.")}</p>
      <h3 className="mb-4 font-display text-xl">{t("getInvolved.messageC.register", "Register interest")}</h3><ParticipationInterestForm kind="academy" />
    </LeanSection>
    <div className="nesa-ed"><VolunteerBandSection /></div><RecognitionIntegrityLine />
  </main>;
}
