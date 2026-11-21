import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function NomineeProfileGovernance({ tierName, tierHref, showShare = true }: { tierName: string; tierHref: string; showShare?: boolean }) {
  const { t } = useTranslation("pages");
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t("profile.shareCopied", "Profile link copied"));
      }
    } catch { /* The visitor dismissed the share dialog. */ }
  };
  return (
    <section aria-label={t("profile.publicationHeading", "Profile publication and actions")} className="border-y border-gold/15 bg-gold/5 py-5">
      <div className="container mx-auto max-w-5xl px-4">
        <p className="text-sm leading-relaxed text-white/75">{t("profile.publicationNotice", "Publication of a profile does not guarantee selection or recognition. Information may be corrected as verification continues.")}</p>
        <Link to="/contact?topic=correction" className="mt-2 inline-block text-sm font-semibold text-gold hover:underline">{t("profile.correction", "Is something wrong? Request a correction")}</Link>
        <div className="mt-4 flex flex-wrap gap-3">
          {showShare && <Button type="button" variant="outline" onClick={share} className="border-gold/40 text-gold hover:bg-gold/10"><Share2 className="mr-2 h-4 w-4" />{t("profile.share", "Share profile")}</Button>}
          <Button asChild variant="outline" className="border-gold/40 text-gold hover:bg-gold/10"><Link to={tierHref}><ArrowLeft className="mr-2 h-4 w-4" />{t("profile.backToTier", `Back to ${tierName}`)}</Link></Button>
        </div>
      </div>
    </section>
  );
}

export default NomineeProfileGovernance;
