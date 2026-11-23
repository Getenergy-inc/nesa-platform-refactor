import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CountdownTimer } from "@/components/nesa/CountdownTimer";
import { GALA_COUNTDOWN_TARGET, PROGRAMME_END_LABEL, PROGRAMME_PUBLIC_NOTICE } from "@/config/programme";
import { downloadProgrammeCalendar } from "@/lib/programmeCalendar";

/** Online-programme band with the canonical date, countdown and calendar file. */
export function GalaBandSection() {
  const { t } = useTranslation("pages");
  return (
    <section className="ed-gala" aria-labelledby="ed-gala-heading">
      <div className="ed-eyebrow">{t("landingLean.programme.eyebrow", "NESA-Africa 2026")}</div>
      <h2 id="ed-gala-heading">{t("landingLean.programme.title", "Online Recognition Programme")}</h2>
      <div className="ed-gala-date">{t("landingLean.programme.date", `Online Recognition Programme · ${PROGRAMME_END_LABEL} · Online only`)}</div>
      <div className="mt-6 flex justify-center">
        <CountdownTimer targetDate={GALA_COUNTDOWN_TARGET} label={t("landingLean.programme.countdown", "Until the online programme begins")} />
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-white/70">{t("landingLean.programme.scope", "A focused online programme with about 20–30 invited live participants, principally recognising up to nine Africa Education Icons, supported by approved Certificates of Recognition, interviews, documentaries and education-impact media.")}</p>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">{PROGRAMME_PUBLIC_NOTICE}</p>
      <p className="mx-auto mt-4 max-w-2xl text-white/70">{t("landingLean.programme.noPhysical", "No public physical gala, ticket sale, corporate table or public venue is authorised.")}</p>
      <div className="ed-hero-cta-row" style={{ justifyContent: "center" }}>
        <button type="button" onClick={downloadProgrammeCalendar} className="ed-btn-ghost">{t("landingLean.programme.calendar", "Add to calendar")}</button>
        <Link to="/programme/2026" className="ed-btn-primary">{t("landingLean.programme.about", "About the programme →")}</Link>
      </div>
    </section>
  );
}

export default GalaBandSection;
