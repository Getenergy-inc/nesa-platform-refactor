import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { REGIONAL_PARTICIPATION_PENDING_LABEL, SNS_CTAS, SNS_GOOGLE_FORM, SNS_GOOGLE_FORM_EMBED, SNS_NOT_A_TIER } from "@/config/schoolSupport";
import { DonateForm } from "./DonateForm";
import { SponsorPartnerForm } from "./SponsorPartnerForm";
import { useSupportPage } from "./SupportPageContext";
import { pillOutline, pillPrimary } from "./ui";

const TABS = [
  { id: "nominate", label: "Nominate", text: "Put forward a specialist or inclusive school serving learners with disabilities. A nomination begins verification. It does not guarantee publication, regional selection eligibility, funding, a grant or an intervention." },
  { id: "participate", label: "Participate", text: `${REGIONAL_PARTICIPATION_PENDING_LABEL}. Participation is free, governed by published regional rules and never linked to money.` },
  { id: "donate", label: "Donate", text: "Give to the ring-fenced Africa Special Needs Education Support Fund by bank transfer, to a region or where most needed." },
  { id: "sponsor", label: "Sponsor", text: "Sponsor a whole region (US$150,000), share a regional target, support one verified school, a specific project or give in kind — or become a programme partner." },
  { id: "attend", label: "Attend", text: "Register interest in EduTourism 2027 regional visits (Oct–Nov 2027) and the Regional Grant Awarding and Commissioning Ceremonies." },
] as const;
type TabId = (typeof TABS)[number]["id"];
const isTab = (v: string | null): v is TabId => !!v && TABS.some((t) => t.id === v);

export function TakePartTabs() {
  const [params] = useSearchParams();
  const p = params.get("participation");
  const [tab, setTab] = useState<TabId>(isTab(p) ? p : p === "partner" ? "sponsor" : "nominate");
  const { setSponsorMode } = useSupportPage();
  useEffect(() => { if (p === "partner") setSponsorMode("partner"); }, [p, setSponsorMode]);

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-ea-sand p-1">
        {TABS.map((t) => <TabsTrigger key={t.id} value={t.id} className="min-h-10 rounded-full px-4 data-[state=active]:bg-ea-green data-[state=active]:text-ea-cream">{t.label}</TabsTrigger>)}
      </TabsList>
      {TABS.map((t) => (
        <TabsContent key={t.id} value={t.id} className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-4">
              <h3 className="text-2xl">{t.label}</h3>
              <p className="text-sm leading-relaxed text-ea-muted">{t.text}</p>
              {t.id === "nominate" && <a href={SNS_CTAS.nominate.href} className={pillPrimary}>{SNS_CTAS.nominate.label}</a>}
              {t.id === "participate" && <span aria-disabled="true" className={pillOutline + " cursor-not-allowed border-dashed opacity-80"}>{REGIONAL_PARTICIPATION_PENDING_LABEL}</span>}
              {t.id === "attend" && <a href="#edutourism" className={pillPrimary}>See EduTourism 2027</a>}
              <p className="text-xs text-ea-muted">
                {t.id === "donate" ? "Prefer the form? Complete the donation form on the right. It is already set to 'Donate', so there is no participation type to choose."
                  : t.id === "sponsor" ? "Prefer the form? Complete it on the right. Choose 'Sponsor a Regional School' or 'Become a Programme Partner' at the top of the form."
                  : `Prefer the form? Complete it on the right. Choose '${t.label}' as your participation type where the form asks.`}
              </p>
              <p className="text-xs text-ea-muted">{SNS_NOT_A_TIER}</p>
            </div>
            <div className="rounded-2xl border border-ea-line bg-ea-cream p-4 sm:p-6">
              {t.id === "donate" ? <DonateForm /> : t.id === "sponsor" ? <SponsorPartnerForm /> : (
                <>
                  <iframe src={SNS_GOOGLE_FORM_EMBED} title={`${t.label} — EduAid-Africa participation form`} loading="lazy" className="h-[640px] w-full rounded-xl border-0 bg-ea-cream" />
                  <a href={SNS_GOOGLE_FORM} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ea-green underline">Open in new tab <ExternalLink className="h-3.5 w-3.5" aria-hidden /></a>
                </>
              )}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
