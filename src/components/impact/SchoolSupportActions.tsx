import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HeartHandshake, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { SCHOOL_SUPPORT_ACTIONS } from "@/config/schoolSupport";

export function SchoolSupportActions({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button asChild className="h-auto min-h-11 py-3 whitespace-normal text-center bg-gold text-charcoal hover:bg-gold/90">
        <Link to={SCHOOL_SUPPORT_ACTIONS.nominate.href}><School className="h-4 w-4 shrink-0 mr-2" aria-hidden />{t(compact ? "schoolSupport.nominateShort" : "schoolSupport.nominate")}</Link>
      </Button>
      <Button asChild variant="outline" className="h-auto min-h-11 py-3 whitespace-normal text-center border-gold/40 bg-transparent text-gold hover:bg-gold/10 hover:text-gold">
        <Link to={SCHOOL_SUPPORT_ACTIONS.support.href}><HeartHandshake className="h-4 w-4 shrink-0 mr-2" aria-hidden />{t(compact ? "schoolSupport.supportShort" : "schoolSupport.support")}</Link>
      </Button>
    </div>
  );
}

export function SchoolSupportChoice() {
  const { t } = useTranslation("common");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-auto min-h-11 whitespace-normal text-gold hover:text-gold hover:bg-gold/10">
          <HeartHandshake className="h-4 w-4 mr-2 shrink-0" aria-hidden />{t("schoolSupport.mobile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-charcoal text-cream border-gold/30">
        <DialogHeader>
          <DialogTitle className="font-display text-gold">{t("schoolSupport.mobile")}</DialogTitle>
          <DialogDescription className="text-cream/75">{t("schoolSupport.notice")}</DialogDescription>
        </DialogHeader>
        <SchoolSupportActions compact />
      </DialogContent>
    </Dialog>
  );
}