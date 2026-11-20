import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { cn } from "@/lib/utils";

export const RECOGNITION_INTEGRITY_STATEMENT = "Recognition cannot be bought. Sponsorship, donations, partnerships, endorsements and media participation do not influence eligibility, scoring, school selection or recognition decisions.";

export function RecognitionIntegrityLine({ className }: { className?: string }) {
  const { t } = useTranslation("pages");
  return (
    <p role="note" className={cn("border-y border-gold/15 bg-gold/5 px-4 py-3 text-center text-sm leading-relaxed text-white/75", className)}>
      {t("siteWide.integrity", RECOGNITION_INTEGRITY_STATEMENT)}
    </p>
  );
}

export function SiteClosingBand() {
  const { t } = useTranslation("pages");
  return (
    <section aria-labelledby="site-closing-heading" className="border-t border-gold/15 bg-charcoal px-4 py-12 text-center">
      <div className="container mx-auto max-w-4xl">
        <h2 id="site-closing-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
          {t("siteWide.closing.heading", "Know an education enabler?")}
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-gold px-5 py-2 text-sm font-semibold text-charcoal hover:bg-gold/90">
            {t("siteWide.closing.nominate", "Submit a Nomination")}
          </a>
          <Link to="/impact/special-needs-schools" className="inline-flex min-h-11 items-center rounded-full border border-gold/40 px-5 py-2 text-sm font-semibold text-gold hover:bg-gold/10">
            {t("siteWide.closing.support", "Support a Special-Needs School")}
          </Link>
        </div>
      </div>
    </section>
  );
}
