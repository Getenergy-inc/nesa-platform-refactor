import { useTranslation } from "react-i18next";
import scef from "@/assets/school-support/scef-logo.png.asset.json";
import eduaid from "@/assets/school-support/eduaid-africa-logo.webp.asset.json";
import friends from "@/assets/school-support/friends-of-eduaid-africa-logo.jpg.asset.json";

const ARMS = [
  { name: "SCEF", image: scef.url, body: "Parent foundation; governance, funds and safeguarding." },
  { name: "NESA-Africa", image: "/images/NESA logo_UPDATED 1.png", body: "Recognises education enablers; hosts nominations and the online programme." },
  { name: "EduAid-Africa", image: eduaid.url, body: "Delivers support to schools; receives scholarship and fee payments." },
  { name: "Friends of EduAid-Africa", image: friends.url, body: "SCEF's international local chapters; volunteers, local fundraising, school visits." },
  { name: "EduAid-Africa Academy", body: "SEN teacher training, webinars and podcast learning, youth digital and AI skills, volunteer, chapter, NRRC and judge training." },
];
export function FiveArmsTable() {
  const { t } = useTranslation("pages");
  return <div className="divide-y divide-border" role="table" aria-label={t("fiveArms.title", "Five arms, one mission")}>
    {ARMS.map((arm, index) => <div key={arm.name} role="row" className="grid gap-3 py-5 sm:grid-cols-[240px_1fr]">
      <div role="cell" className="flex items-center gap-3">{arm.image && <img src={arm.image} alt={t(`fiveArms.alt${index}`, `${arm.name} logo`)} loading="lazy" className="h-14 w-20 rounded-md bg-background object-contain" />}<strong>{t(`fiveArms.name${index}`, arm.name)}</strong></div>
      <p role="cell" className="text-sm leading-relaxed">{t(`fiveArms.body${index}`, arm.body)}</p>
    </div>)}
  </div>;
}