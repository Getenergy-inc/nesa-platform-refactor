import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import { SchoolSupportActions } from "./SchoolSupportActions";

export function SchoolSupportFundSection() {
  const { t } = useTranslation("common");
  return (
    <section id="special-needs-support-fund" aria-label={t("schoolSupport.heading")} className="bg-charcoal text-cream border-y border-gold/20 px-5 py-14 md:py-16 scroll-mt-32">
      <div className="max-w-6xl mx-auto">
        <p className="text-gold text-sm font-semibold mb-4">{t("schoolSupport.fund")}</p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight max-w-3xl">{t("schoolSupport.heading")}</h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-cream/85">{t("schoolSupport.intro")}</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/70">{t("schoolSupport.delivery")}</p>
        <div className="mt-7"><SchoolSupportActions /></div>
        <p className="mt-6 flex items-start gap-2 max-w-3xl text-sm leading-relaxed text-cream/70"><ShieldCheck className="h-4 w-4 shrink-0 mt-1 text-gold" aria-hidden />{t("schoolSupport.independence")}</p>
      </div>
    </section>
  );
}