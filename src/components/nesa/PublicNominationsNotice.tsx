import { ArrowRight, Megaphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NOMINATION_WINDOW_LABEL } from "@/config/nominationWindows2026";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";

/** Canonical 2026–2027 nomination and continuous certificate window. */
export function PublicNominationsNotice({ compact = false }: { compact?: boolean } = {}) {
  const { t } = useTranslation("pages");
  if (compact) {
    return (
      <section aria-label={t("nominationsNotice.label", "Public Notice — Nominations Open")} className="border-y border-amber-400/30 bg-amber-500/10">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-sm text-white">
          <Megaphone className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
          <span>{t("nominationsNotice.compact", "Public nominations are open. Nomination is free.")}</span>
          <span className="text-white/70">{NOMINATION_WINDOW_LABEL}</span>
          <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-amber-300 underline-offset-4 hover:underline">
            {t("nominationsNotice.cta", "Nominate")}<ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </section>
    );
  }
  return (
    <section aria-label={t("nominationsNotice.label", "Public Notice — Nominations Open")} className="border-y border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/[0.07] to-amber-500/10">
      <div className="container mx-auto flex flex-col items-start gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Megaphone className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden />
          <div className="text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">{t("nominationsNotice.eyebrow", "Important Public Notice")}</p>
            <p className="mt-0.5 font-serif text-base text-white sm:text-lg">{t("nominationsNotice.compact", "Public nominations are open. Nomination is free.")}</p>
            <p className="mt-0.5 text-xs text-white/70 sm:text-sm">{t("nominationsNotice.window", `Nomination window: ${NOMINATION_WINDOW_LABEL}. Continuous verified 2026 certificate downloads are available throughout this window.`)}</p>
          </div>
        </div>
        <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-charcoal transition hover:bg-amber-400">
          {t("nominationsNotice.cta", "Nominate")}<ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
