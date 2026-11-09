import { Download, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ICON_SELECTION_CRITERIA } from "@/config/iconSelectionCriteria";
import { cn } from "@/lib/utils";

interface IconSelectionCriteriaProps {
  id?: string;
  className?: string;
  showDownload?: boolean;
  downloadHref?: string;
}

/** Shared public explanation of the existing eight-part Icon jury rubric. */
export function IconSelectionCriteria({
  id = "selection-criteria",
  className,
  showDownload = false,
  downloadHref,
}: IconSelectionCriteriaProps) {
  const { t } = useTranslation("common");
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("border-t border-gold/15 bg-charcoal-light/20 py-16 text-foreground", className)}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              {t("onlineGala.selectionEyebrow")}
            </p>
            <h2 id={headingId} className="mt-3 font-display text-3xl font-bold md:text-4xl">
              {t("onlineGala.selectionTitle")}
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/70">
              {t("onlineGala.selectionIntro")}
            </p>
          </div>
          {showDownload && downloadHref ? (
            <Button asChild className="shrink-0 bg-gold text-charcoal hover:bg-gold/90">
              <a href={downloadHref} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" aria-hidden />
                {t("onlineGala.downloadEdi")}
              </a>
            </Button>
          ) : null}
        </div>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ICON_SELECTION_CRITERIA.map((criterion, index) => (
            <li key={criterion.slug}>
              <article className="h-full rounded-xl border border-gold/20 bg-charcoal/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-gold">
                    EDI · {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold">
                    {criterion.weight}%
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{criterion.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{criterion.description}</p>
              </article>
            </li>
          ))}
        </ol>

        <div role="note" className="mt-6 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/5 p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
          <p className="text-sm leading-relaxed text-foreground/75">{t("onlineGala.selectionNote")}</p>
        </div>
      </div>
    </section>
  );
}
