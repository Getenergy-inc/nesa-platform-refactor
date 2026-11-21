import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VOTING_OPEN } from "@/config/schoolSupport";
import { ParticipationInterestForm } from "./ParticipationInterestForm";
import { DonateForm } from "./DonateForm";
import { SponsorPartnerForm } from "./SponsorPartnerForm";
import { useSupportPage } from "./SupportPageContext";
import type { InterestKind } from "@/config/participationForms2027";

const TABS = [
  { id: "involved", label: "Get involved", kind: "involved" },
  { id: "nominate", label: "Nominate a school", kind: "school" },
  { id: "vote", label: "Vote", kind: "reminder" },
  { id: "donate", label: "Donate", kind: "items" },
  { id: "scholarships", label: "Scholarships & school fees", kind: "scholarships" },
  { id: "offers", label: "Support offers", kind: "offers" },
  { id: "edutourism", label: "EduTourism", kind: "edutourism" },
  { id: "academy", label: "Academy", kind: "academy" },
] as const;
export function TakePartTabs() {
  const { t } = useTranslation("pages");
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const [tab, setTab] = useState("involved");
  const { setSponsorMode } = useSupportPage();
  useEffect(() => {
    const requested = params.get("participation") || hash.slice(1);
    if (TABS.some(item => item.id === requested)) setTab(requested);
    if (requested === "partner") setSponsorMode("partner");
  }, [params, hash, setSponsorMode]);
  return <Tabs value={tab} onValueChange={setTab}>
    <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-ea-sand p-1">
      {TABS.map(item => <TabsTrigger key={item.id} value={item.id} className="min-h-10 whitespace-normal rounded-full px-4 data-[state=active]:bg-ea-green data-[state=active]:text-ea-cream">{t(`participation2027.tabs.${item.id}`, item.label)}</TabsTrigger>)}
    </TabsList>
    {TABS.map(item => <TabsContent key={item.id} value={item.id} className="mt-6">
      <div className="rounded-2xl border border-ea-line bg-ea-cream p-4 sm:p-6">
        <h3 className="mb-5 text-2xl">{t(`participation2027.tabs.${item.id}`, item.label)}</h3>
        {item.id === "vote" && <p role="status" className="mb-5 font-semibold">{!VOTING_OPEN ? t("participation2027.votingClosed", "Voting is not open yet. It opens in September 2027 after approval.") : t("participation2027.votingApproval", "Voting requires approved ballots, verified participation and operational approval.")}</p>}
        {item.id === "donate" ? <><DonateForm /><div className="mt-8 border-t border-ea-line pt-6"><h4 className="mb-4 text-xl">{t("participation2027.itemDonation", "Offer an item instead")}</h4><ParticipationInterestForm kind="items" /></div></> : <ParticipationInterestForm kind={item.kind as InterestKind} />}
      </div>
    </TabsContent>)}
  </Tabs>;
}
