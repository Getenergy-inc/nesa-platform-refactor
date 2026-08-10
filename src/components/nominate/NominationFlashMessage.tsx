import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { IntegrityNotice } from "./IntegrityNotice";

export function NominationFlashMessage({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation("nomination");
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">
          {t("flow.flash.eyebrow")}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
          {t("flow.flash.title")}
        </h1>
      </div>

      <div className="space-y-4 text-sm md:text-base text-white/80 leading-relaxed">
        <p>{t("flow.flash.p1")}</p>
        <p>{t("flow.flash.p2")}</p>
        <p>{t("flow.flash.p3")}</p>
        <p>{t("flow.flash.p4")}</p>
      </div>

      <IntegrityNotice />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          size="lg"
          onClick={onStart}
          className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-gold"
        >
          {t("flow.flash.startCta")}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold gap-2"
        >
          <Link to="/policies/nomination-integrity">
            <BookOpen className="h-4 w-4" />
            {t("flow.flash.guidelinesCta")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
