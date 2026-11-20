// Support a Special-Needs School Across Africa — RMSA / EduAid-Africa service presented with NESA-Africa.
// Page body only uses the scoped EduAid-Africa theme (.eduaid-page); the NESA header/footer are untouched.
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Accessibility, Brain, Ear, Eye, Layers, Mail, MessageCircle, Puzzle, Sprout, type LucideIcon } from "lucide-react";
import eduaidLogo from "@/assets/partners/eduaid-africa-logo.jpeg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useImpactSchools } from "@/hooks/useImpactSchools";
import {
  CAMPAIGN_VIDEOS, CAT_VIDEOS, CONTINENTAL_TARGET_USD, COUNTRY_MAP_APPROVED, REGION_TARGET_USD, REGION_VIDEOS,
  SCHOOL_SUPPORT_DONATION_STATUSES, SCHOOL_SUPPORT_DUE_DILIGENCE, SCHOOL_SUPPORT_INTERVENTIONS, SCHOOL_SUPPORT_POSSIBILITIES,
  SCHOOL_SUPPORT_PROGRAMME, SCHOOL_SUPPORT_SPONSOR_TYPES, SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY, SCHOOL_SUPPORT_TIMETABLE,
  SCHOOL_SUPPORT_TIMETABLE_NOTICE, SCHOOL_SUPPORT_VOTING_REQUIREMENTS, SCHOOL_SUPPORT_VOTING_SAFEGUARDS,
  SNS_ABOUT_CARDS, SNS_ATTEND_ITEMS, SNS_BANK_ACCOUNTS, SNS_BANK_HOLDER, SNS_BANK_NAME, SNS_BODY_BAND, SNS_CANONICAL,
  SNS_CATEGORIES, SNS_CATEGORY_RULE, SNS_COUNTRIES, SNS_CTAS, SNS_FAQ, SNS_FIVE_WAYS, SNS_HERO_IMAGE, SNS_MAP_DRAFT_NOTE, SNS_NARRATION_NOTICE,
  SNS_NEXT_ELIGIBLE_NOTE, SNS_NOT_A_TIER, SNS_PERSONAL_ACCOUNT_WARNING, SNS_PRINCIPLES, SNS_PROCESS_STEPS, SNS_REGIONS,
  SNS_RMSA_ROUTE, SNS_UTILITY_LINE, SNS_VIDEO_CAPTION, SNS_VIDEOS, SNS_VOTE_FOOTNOTE, SNS_ACCOUNTS,
  SCHOOL_SUPPORT_NOMINATION_NOTICE, VOTING_PENDING_LABEL, canPublishSupportSchool, type RegionKey,
} from "@/config/schoolSupport";
import { SupportPageProvider, useSupportPage } from "@/components/school-support/SupportPageContext";
import { DonateForm } from "@/components/school-support/DonateForm";
import { SponsorPartnerForm } from "@/components/school-support/SponsorPartnerForm";
import { AfricaRegionMap } from "@/components/school-support/AfricaRegionMap";
import { TakePartTabs } from "@/components/school-support/TakePartTabs";
import { AccountabilityDashboard } from "@/components/school-support/AccountabilityDashboard";
import { ClickToLoadVideo } from "@/components/school-support/ClickToLoadVideo";
import { SectionHead, Wrap, card, dash, fmtMoney, pillOnDark, pillOutline, pillPrimary } from "@/components/school-support/ui";
import { RecognitionIntegrityLine } from "@/components/nesa/SiteWideContent2026";

const ICONS: Record<string, LucideIcon> = { eye: Eye, ear: Ear, accessibility: Accessibility, puzzle: Puzzle, "message-circle": MessageCircle, brain: Brain, layers: Layers, sprout: Sprout };
const SNS_DESCRIPTION = "Nominate, donate to, sponsor or partner with specialist and inclusive schools serving learners with disabilities across eight African regions. A Rebuild My School Africa service of EduAid-Africa, presented with NESA-Africa.";

function OwnershipLine({ dark }: { dark?: boolean }) {
  return (
    <p className={"text-sm leading-relaxed " + (dark ? "text-ea-cream/80" : "text-ea-muted")}>
      Support a Special-Needs School Across Africa is a service of{" "}
      <Link to={SNS_RMSA_ROUTE} className={"font-semibold underline " + (dark ? "text-ea-tan" : "text-ea-green")}>Rebuild My School Africa</Link>{" "}
      (RMSA), an EduAid-Africa programme of Santos Creations Educational Foundation (SCEF).
    </p>
  );
}

function ActionTiles({ dark }: { dark?: boolean }) {
  const { goDonate, goSponsor, goAnchor } = useSupportPage();
  const act: Record<string, () => void> = {
    nominate: () => { window.location.href = SNS_CTAS.nominate.href; },
    vote: () => goAnchor("vote"), donate: () => goDonate(), sponsor: () => goSponsor("sponsor"), attend: () => goAnchor("edutourism"),
  };
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {SNS_FIVE_WAYS.map((w) => {
        const vote = w.key === "vote"; const gold = w.key === "nominate";
        return (
          <li key={w.key}>
            <button type="button" onClick={vote ? undefined : act[w.key]} disabled={vote} aria-describedby={vote ? "vote-footnote" : undefined}
              className={"flex h-full w-full flex-col items-start gap-1 rounded-2xl p-4 text-left transition-colors " +
                (gold ? "bg-ea-tan text-ea-deep" : vote ? "border-2 border-dashed border-ea-tan/70 text-ea-cream" : dark ? "bg-ea-cream/10 text-ea-cream hover:bg-ea-cream/15" : "bg-ea-sand text-ea-ink")}>
              <span className="text-xs font-bold">{w.n}</span>
              <span className="font-serif text-lg font-semibold">{w.title}</span>
              <span className="text-xs opacity-80">{vote ? "Opens September 2027" : w.timing}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function RegionCards() {
  const { goDonate, goSponsor, goAnchor } = useSupportPage();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {SNS_REGIONS.map((r, i) => {
        const countries = SNS_COUNTRIES.filter((c) => c.region === r.key);
        const vid = REGION_VIDEOS[r.key];
        return (
          <article key={r.key} className="flex flex-col overflow-hidden rounded-2xl border border-ea-line bg-ea-cream">
            <div className="p-4 text-ea-cream" style={{ background: r.color }}>
              <p className="text-[11px] font-bold tracking-[0.14em]">EDUAID-AFRICA · REGION {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-xl">{r.name}</h3>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4 text-sm">
              <p><strong>{fmtMoney(REGION_TARGET_USD, "USD")}</strong> target</p>
              <div className="h-2 overflow-hidden rounded-full bg-ea-sand" role="img" aria-label={`${r.name}: reconciled funds not yet reported`}><span className="block h-full w-0" style={{ background: r.color }} /></div>
              <p className="text-xs text-ea-muted">Reconciled funds: —</p>
              <p>Selected school: to be announced after verification</p>
              <p>EduTourism 2027: regional visit Oct–Nov 2027</p>
              <p>Grant awarding &amp; commissioning ceremony · host city TBA</p>
              {COUNTRY_MAP_APPROVED && <details className="rounded-xl bg-ea-sand p-2">
                <summary className="cursor-pointer text-xs font-semibold">{countries.length} countries</summary>
                <p className="mt-1 text-xs text-ea-muted">{countries.map((c) => c.name).join(" · ")}</p>
              </details>}
              <a href={`mailto:${r.desk}`} className="break-all text-xs font-semibold text-ea-green underline">{r.desk}</a>
              <p className="text-xs font-semibold">Status: nominations open April 2027</p>
              {vid && <ClickToLoadVideo id={vid} title={`${r.name} illustrative video`} caption={SNS_VIDEO_CAPTION} />}
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <button type="button" className={pillPrimary + " px-3 text-xs"} onClick={() => goDonate(r.key as RegionKey)}>Donate to this region</button>
                <button type="button" className={pillOutline + " px-3 text-xs"} onClick={() => goSponsor("sponsor", r.key as RegionKey)}>Sponsor</button>
                <a href={SNS_CTAS.nominate.href} className={pillOutline + " px-3 text-xs"}>Nominate</a>
                <button type="button" className={pillOutline + " px-3 text-xs"} onClick={() => goAnchor("edutourism")}>Attend</button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function VerifiedSchools() {
  const { schools, loading } = useImpactSchools();
  const approved = schools.filter((s) => canPublishSupportSchool(s));
  const heads = ["School", "Country", "Region", "Learners", "Identified need", "Accessibility", "Intervention", "Funding target", "Progress", "Outcome"];
  return (
    <div className="overflow-x-auto rounded-2xl border border-ea-line bg-ea-cream">
      <table className="w-full min-w-[900px] text-left text-sm">
        <caption className="sr-only">Verified and approved school profiles</caption>
        <thead className="bg-ea-sand"><tr>{heads.map((h) => <th key={h} scope="col" className="px-3 py-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody>
          {loading ? <tr><td colSpan={10} className="px-3 py-6 text-ea-muted">Loading…</td></tr>
            : approved.length === 0 ? <tr><td colSpan={10} className="px-3 py-6 font-semibold text-ea-muted">No verified and approved school profiles yet. Nominations open in April 2027.</td></tr>
            : approved.map((s) => (
              <tr key={s.id} className="border-t border-ea-line">
                <td className="px-3 py-3 font-semibold">{dash(s.name)}</td><td className="px-3 py-3">{dash(s.country)}</td><td className="px-3 py-3">{dash(s.region?.name)}</td>
                <td className="px-3 py-3">{dash(s.studentCount)}</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td>
                <td className="px-3 py-3">{dash(s.interventionStatus)}</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function Body() {
  const { t } = useTranslation();
  const { goDonate, goSponsor } = useSupportPage();
  const [size, setSize] = useState(0);
  const [contrast, setContrast] = useState(false);
  const tr = (k: string, d: string) => t(`schoolSupportPage.${k}`, { defaultValue: d });

  return (
    <div className="eduaid-page" data-size={size} data-contrast={contrast ? "high" : "normal"}>
      <p className="bg-ea-brown px-4 py-1.5 text-center text-xs font-semibold text-ea-cream">{tr("band", SNS_BODY_BAND)}</p>
      <RecognitionIntegrityLine className="border-ea-line bg-ea-deep text-ea-cream" />
      <div className="border-b border-ea-line bg-ea-sand px-4 py-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-ea-muted">{tr("utility", SNS_UTILITY_LINE)}</p>
          <div className="flex items-center gap-1" role="group" aria-label="Page text size and contrast">
            {["A", "A+", "A++"].map((l, i) => <button key={l} type="button" aria-pressed={size === i} onClick={() => setSize(i)} className={"min-h-9 min-w-9 rounded-full px-2 text-xs font-bold " + (size === i ? "bg-ea-green text-ea-cream" : "text-ea-ink")}>{l}</button>)}
            <button type="button" aria-pressed={contrast} onClick={() => setContrast(!contrast)} className={"min-h-9 rounded-full px-3 text-xs font-bold " + (contrast ? "bg-ea-ink text-ea-cream" : "text-ea-ink")}>High contrast</button>
          </div>
        </div>
      </div>

      <nav aria-label="On this page" className="sticky top-0 z-20 border-b border-ea-line bg-ea-cream/95 px-4 backdrop-blur">
        <ul className="mx-auto flex max-w-6xl gap-4 overflow-x-auto py-2 text-xs font-semibold">
          {[["about", "About"], ["donate", "Donate"], ["sponsor-form", "Sponsor"], ["regions", "Regions"], ["take-part", "Take part"], ["verified-schools", "Verified schools"], ["vote", "Vote"], ["faq", "FAQ"], ["connect", "Connect"]].map(([id, l]) => (
            <li key={id}><a href={`#${id}`} className="inline-block whitespace-nowrap py-2 text-ea-green hover:underline">{l}</a></li>
          ))}
        </ul>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-ea-deep via-ea-dark to-ea-deep px-4 py-14 text-ea-cream sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <img src={eduaidLogo} alt="EduAid-Africa — Empowering Africa's Education Enablers · Funding Education Through Partnerships" className="h-20 w-auto rounded-xl bg-ea-cream p-1.5 sm:h-24" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-ea-tan">Nominate · Vote · Donate · Sponsor · Attend</p>
            <h1 className="text-4xl leading-tight sm:text-5xl lg:text-6xl">Support a Special-Needs School <span className="text-ea-tan">Across Africa</span></h1>
            <p className="max-w-2xl text-base leading-relaxed text-ea-cream/85">Help find, verify and support specialist and inclusive schools serving learners with disabilities and additional support needs — one approved school in each of eight African regions in 2027.</p>
            <ActionTiles dark />
            <p id="vote-footnote" className="text-xs text-ea-cream/70">{SNS_VOTE_FOOTNOTE}</p>
            <div className="flex flex-wrap gap-2">
              <a href={SNS_CTAS.verified.href} className={pillOnDark}>{SNS_CTAS.verified.label}</a>
              <button type="button" className={pillOnDark} onClick={() => goSponsor("partner")}>{SNS_CTAS.partner.label}</button>
              <a href={SNS_CTAS.volunteer.href} className={pillOnDark}>{SNS_CTAS.volunteer.label}</a>
            </div>
            <OwnershipLine dark />
          </div>
          <aside className="self-start rounded-3xl border border-ea-tan/40 bg-ea-cream/5 p-6">
            <h2 className="text-2xl text-ea-tan">2027 at a glance</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              {[["8", "regions"], [String(SNS_CATEGORIES.length), "categories"], ["US$150k", "per region"], [`US$${(CONTINENTAL_TARGET_USD / 1e6).toFixed(1)}M`, "continental"]].map(([v, l]) => (
                <div key={l}><dt className="sr-only">{l}</dt><dd><span className="block font-serif text-3xl font-semibold">{v}</span><span className="text-xs text-ea-cream/70">{l}</span></dd></div>
              ))}
            </dl>
            <p className="mt-4 text-xs font-semibold text-ea-tan">Targets, not secured funding.</p>
          </aside>
        </div>
        <figure className="mx-auto mt-10 max-w-6xl overflow-hidden rounded-3xl border border-ea-tan/30">
          <img src={SNS_HERO_IMAGE.src} alt={SNS_HERO_IMAGE.alt} className="aspect-square w-full object-cover sm:aspect-auto" />
          <figcaption className="bg-ea-deep/80 px-4 py-2 text-xs text-ea-cream/80">Owner-supplied illustrative images of inclusive learning.</figcaption>
        </figure>
      </section>

      <p role="note" className="bg-ea-tan px-4 py-3 text-center text-sm font-semibold text-ea-deep">{tr("nominationNotice", "A nomination begins verification. It does not guarantee publication, voting eligibility, funding, a grant or an intervention. Only verified and approved schools are profiled.")}</p>

      <Wrap id="about">
        <SectionHead eyebrow="About the programme" title="About the programme" />
        <div className="max-w-3xl space-y-4 text-base leading-relaxed">
          <p>Support a Special-Needs School Across Africa is a service of <Link to={SNS_RMSA_ROUTE} className="font-semibold text-ea-green underline">Rebuild My School Africa</Link> (RMSA), the EduAid-Africa programme that rebuilds and equips schools across the continent. It finds, verifies and supports specialist and inclusive schools that serve learners with disabilities and additional support needs, in every region of Africa.</p>
          <p>Rebuild My School Africa is delivered by EduAid-Africa, the funding and partnerships arm of SCEF. The programme is presented jointly with NESA-Africa, and supported by Friends of EduAid-Africa and the Africa Education Enablers Network.</p>
          <p>The 2027 aim is to identify one verified priority school in each of the eight regions, with a fundraising target of US$150,000 per region — targets, not secured funding.</p>
          <p className="rounded-2xl border-l-4 border-ea-brown bg-ea-sand p-4 font-semibold">It is not a NESA-Africa award tier. {tr("notATier", SNS_NOT_A_TIER)}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SNS_ABOUT_CARDS.map((c) => <div key={c.title} className={card}><h3 className="text-xl">{c.title}</h3><p className="mt-2 text-sm text-ea-muted">{c.text}</p></div>)}
        </div>
        <ul className="mt-8 grid gap-2 rounded-3xl bg-ea-deep p-6 text-ea-cream sm:grid-cols-4">
          {SNS_PRINCIPLES.map((p) => <li key={p} className="font-serif text-lg font-semibold text-ea-tan">{p}</li>)}
        </ul>
      </Wrap>

      <Wrap className="bg-ea-sand">
        <SectionHead eyebrow="Five ways to take part" title="Five ways to take part" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SNS_FIVE_WAYS.map((w) => <div key={w.key} className={card}><p className="text-xs font-bold text-ea-green">{w.n}</p><h3 className="text-xl">{w.title}</h3><p className="mt-1 text-xs font-semibold text-ea-brown">{w.timing}</p><p className="mt-2 text-sm text-ea-muted">{w.text}</p></div>)}
        </div>
        {CAMPAIGN_VIDEOS.fiveWays && <div className="mt-6 max-w-2xl"><ClickToLoadVideo id={CAMPAIGN_VIDEOS.fiveWays} title="Five ways to take part" caption={SNS_VIDEO_CAPTION} /></div>}
      </Wrap>

      <Wrap id="donate">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHead eyebrow="Ring-fenced 100%" title="Donate to the Support Fund" intro="Give once, monthly or annually by bank transfer to EduAid Africa Ltd. Support Fund money is ring-fenced for approved school interventions." />
            <BankList />
          </div>
          <div className="rounded-3xl border border-ea-line bg-ea-cream p-5 shadow-sm sm:p-7"><DonateForm /></div>
        </div>
      </Wrap>

      <Wrap id="sponsor-form" className="bg-ea-sand">
        <span id="partner" className="block scroll-mt-28" />
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead eyebrow="Sponsors & partners" title="Sponsor a Regional School / Become a Programme Partner" intro={<>Sponsor a whole region, a share of a regional target, a verified school, a specific project or in-kind support — or offer your expertise as a programme partner. Any support is subject to due diligence, available funds and written approval. Sponsors and partners are listed only after a written agreement or verified contribution.</>} />
          <div className="rounded-3xl border border-ea-line bg-ea-cream p-5 shadow-sm sm:p-7"><SponsorPartnerForm /></div>
        </div>
      </Wrap>

      <Wrap label="Watch">
        <SectionHead eyebrow="Watch" title="Watch" />
        <div className="grid gap-6 md:grid-cols-2">{SNS_VIDEOS.map((v) => <ClickToLoadVideo key={v.id} id={v.id} title={v.title} />)}</div>
      </Wrap>

      <Wrap id="categories" className="bg-ea-sand">
        <SectionHead eyebrow="Fourteen categories" title="Fourteen categories of special-needs education" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SNS_CATEGORIES.map((c, i) => {
            const Icon = ICONS[c.icon] ?? Sprout;
            return (
              <article key={c.title} className="overflow-hidden rounded-2xl border border-ea-line bg-ea-cream">
                <figure className="relative aspect-[4/3]" style={c.image ? undefined : { background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)` }}>
                  {c.image ? <img src={c.image.src} alt={c.image.alt} loading="lazy" className="h-full w-full object-cover" /> : <Icon className="absolute inset-0 m-auto h-14 w-14 text-ea-cream" aria-hidden />}
                  <figcaption className="absolute bottom-2 left-2 rounded-full bg-ea-ink/70 px-2 py-0.5 text-[10px] text-ea-cream">Illustrative image{c.image?.credit ? ` · ${c.image.credit}` : ""}</figcaption>
                </figure>
                <div className="p-4">
                  <h3 className="text-lg leading-snug">{c.title}</h3>
                  <p className="mt-1 text-sm text-ea-muted">{c.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{c.tags.map((tg) => <span key={tg} className="rounded-full bg-ea-sand px-2 py-0.5 text-[11px] font-semibold">{tg}</span>)}</div>
                  {CAT_VIDEOS[i] && <div className="mt-3"><ClickToLoadVideo id={CAT_VIDEOS[i]!} title={c.title} caption={SNS_VIDEO_CAPTION} /></div>}
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 rounded-2xl border-l-4 border-ea-green bg-ea-cream p-4 text-sm font-semibold">{SNS_CATEGORY_RULE}</p>
      </Wrap>

      <Wrap id="regions">
        <SectionHead eyebrow="Eight regions" title="Eight African Regions. Eight Supported Schools. One Inclusive Future." intro={!COUNTRY_MAP_APPROVED ? SNS_MAP_DRAFT_NOTE : undefined} />
        <AfricaRegionMap />
        <div className="mt-10"><RegionCards /></div>
      </Wrap>

      <Wrap id="edutourism" dark>
        <SectionHead dark eyebrow="October – December 2027" title="EduTourism 2027 & Regional Grant Awarding and Commissioning Ceremonies" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div><h3 className="text-xl text-ea-tan">What participants can join</h3><ul className="mt-3 space-y-2 text-sm text-ea-cream/85">{SNS_ATTEND_ITEMS.map((x) => <li key={x}>• {x}</li>)}</ul></div>
          <div className="rounded-2xl border border-ea-tan/40 p-5"><p className="text-xs font-bold text-ea-tan">October – December 2027</p>
            <ul className="mt-2 space-y-1 text-sm"><li>A regional ceremony in each region</li><li>A continental outcome presentation in December 2027</li><li>Impact reporting from 2028</li></ul></div>
        </div>
        {CAMPAIGN_VIDEOS.eduTourism && <div className="mt-6 max-w-2xl"><ClickToLoadVideo id={CAMPAIGN_VIDEOS.eduTourism} title="EduTourism 2027" caption={SNS_VIDEO_CAPTION} /></div>}
        <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
          <thead><tr className="border-b border-ea-tan/40 text-ea-tan">{["Region", "EduTourism window", "Ceremony", "Host school"].map((h) => <th key={h} scope="col" className="py-2 pr-4">{h}</th>)}</tr></thead>
          <tbody>{SNS_REGIONS.map((r) => <tr key={r.key} className="border-b border-ea-cream/10"><td className="py-2 pr-4 font-semibold">{r.name}</td><td className="py-2 pr-4">Oct–Nov 2027</td><td className="py-2 pr-4">Date &amp; host city to be announced</td><td className="py-2 pr-4">Pending verification</td></tr>)}</tbody>
        </table></div>
      </Wrap>

      <Wrap>
        <SectionHead eyebrow="Process" title="How the programme works" />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{SNS_PROCESS_STEPS.map((s, i) => <li key={s} className={card}><span className="text-xs font-bold text-ea-green">{String(i + 1).padStart(2, "0")}</span><p className="mt-1 font-serif text-lg font-semibold">{s}</p></li>)}</ol>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div><h3 className="text-xl">What a selected school may receive</h3><p className="mt-1 text-xs text-ea-muted">Subject to due diligence, available funds and written approval.</p><ul className="mt-3 space-y-1 text-sm">{SCHOOL_SUPPORT_POSSIBILITIES.map((x) => <li key={x}>• {x}</li>)}</ul></div>
          <div><h3 className="text-xl">Intervention classifications</h3><div className="mt-3 flex flex-wrap gap-1.5">{SCHOOL_SUPPORT_INTERVENTIONS.map((x) => <span key={x} className="rounded-full border border-ea-line px-2.5 py-1 text-xs">{x}</span>)}</div></div>
          <div><h3 className="text-xl">Final support depends on</h3><div className="mt-3 flex flex-wrap gap-1.5">{SCHOOL_SUPPORT_DUE_DILIGENCE.map((x) => <span key={x} className="rounded-full bg-ea-sand px-2.5 py-1 text-xs">{x}</span>)}</div></div>
        </div>
        <p className="mt-6 text-sm text-ea-muted">{SNS_NEXT_ELIGIBLE_NOTE}</p>
      </Wrap>

      <Wrap id="take-part" className="bg-ea-sand">
        <span id="nominate" className="block scroll-mt-28" />
        <SectionHead eyebrow="Take part" title="Take part" />
        <TakePartTabs />
      </Wrap>

      <Wrap id="verified-schools">
        <SectionHead eyebrow="Accountability" title="View Verified Schools" intro={SCHOOL_SUPPORT_NOMINATION_NOTICE} />
        <VerifiedSchools />
        <div className="mt-10"><AccountabilityDashboard /></div>
      </Wrap>

      <Wrap id="vote" className="bg-ea-sand">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHead eyebrow="2027 timetable" title="2027 timetable" intro={SCHOOL_SUPPORT_TIMETABLE_NOTICE} />
            <ol className="space-y-2">{SCHOOL_SUPPORT_TIMETABLE.filter((x, i, a) => a.findIndex((y) => y.period === x.period && y.activity === x.activity) === i).map((x) => <li key={x.period + x.activity} className="grid grid-cols-[9rem_1fr] gap-3 rounded-xl bg-ea-cream p-3 text-sm"><strong>{x.period}</strong><span>{x.activity}</span></li>)}</ol>
          </div>
          <div>
            <SectionHead eyebrow="Vote" title="Vote" />
            <span aria-disabled="true" className={pillOutline + " cursor-not-allowed border-dashed"}>{VOTING_PENDING_LABEL}</span>
            <h3 className="mt-6 text-lg">Voting may open only after</h3><ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">{SCHOOL_SUPPORT_VOTING_REQUIREMENTS.map((x) => <li key={x}>{x}</li>)}</ol>
            <h3 className="mt-6 text-lg">Safeguards</h3><ul className="mt-2 space-y-1 text-sm">{SCHOOL_SUPPORT_VOTING_SAFEGUARDS.map((x) => <li key={x}>• {x}</li>)}</ul>
            <p className="mt-6 rounded-2xl bg-ea-deep p-4 font-serif text-xl font-semibold text-ea-tan">Votes are never sold.</p>
          </div>
        </div>
      </Wrap>

      <Wrap>
        <SectionHead eyebrow="Sponsorship & partnership" title="Sponsorship & partnership overview" />
        <div className="flex flex-wrap gap-1.5">{SCHOOL_SUPPORT_SPONSOR_TYPES.map((x) => <span key={x} className="rounded-full bg-ea-sand px-3 py-1 text-xs font-semibold capitalize">{x}</span>)}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className={card}><h3 className="text-xl">Sponsor a regional school</h3><p className="mt-2 text-sm text-ea-muted">US$150,000 per region, a share of a target, one verified school or a specific project.</p><button type="button" className={pillPrimary + " mt-4"} onClick={() => goSponsor("sponsor")}>{SNS_CTAS.sponsor.label}</button></div>
          <div className={card}><h3 className="text-xl">Become a programme partner</h3><p className="mt-2 text-sm text-ea-muted">Expertise, equipment, logistics, safeguarding, monitoring or audit.</p><button type="button" className={pillPrimary + " mt-4"} onClick={() => goSponsor("partner")}>{SNS_CTAS.partner.label}</button></div>
          <div className={card}><h3 className="text-xl">Donate</h3><p className="mt-2 text-sm text-ea-muted">Any amount, to a region or where most needed, by bank transfer.</p><button type="button" className={pillPrimary + " mt-4"} onClick={() => goDonate()}>{SNS_CTAS.donate.label}</button></div>
        </div>
        <h3 className="mt-10 text-2xl">How your donation is tracked</h3>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{SCHOOL_SUPPORT_DONATION_STATUSES.map((x, i) => <li key={x} className="rounded-xl border border-ea-line p-3 text-sm"><span className="text-xs font-bold text-ea-green">{i + 1}</span> <span className="capitalize">{x}</span></li>)}</ol>
        {CAMPAIGN_VIDEOS.donationTracking && <div className="mt-6 max-w-2xl"><ClickToLoadVideo id={CAMPAIGN_VIDEOS.donationTracking} title="How your donation is tracked" caption={SNS_VIDEO_CAPTION} /></div>}
        <p className="mt-6 rounded-2xl border-l-4 border-ea-brown bg-ea-sand p-4 text-sm font-semibold">Integrity firewall: {SCHOOL_SUPPORT_SPONSORSHIP_INTEGRITY}</p>
      </Wrap>

      <Wrap id="faq" className="bg-ea-sand">
        <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="max-w-3xl">
          {SNS_FAQ.map((f, i) => <AccordionItem key={f.q} value={`f${i}`} className="border-ea-line"><AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger><AccordionContent className="text-sm leading-relaxed text-ea-muted">{f.a}</AccordionContent></AccordionItem>)}
        </Accordion>
      </Wrap>

      <Wrap dark>
        <h2 className="max-w-3xl text-3xl text-ea-cream sm:text-4xl">{SCHOOL_SUPPORT_PROGRAMME.campaignLine}</h2>
        <div className="mt-6"><ActionTiles dark /></div>
        <p className="mt-4 text-xs text-ea-cream/70">{SNS_VOTE_FOOTNOTE}</p>
      </Wrap>

      <Wrap id="connect">
        <SectionHead eyebrow="Connect" title="Connect with EduAid-Africa" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SNS_ACCOUNTS.map((a) => <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={card + " block hover:border-ea-green"}><p className="text-xs font-bold uppercase text-ea-green">{a.label}</p><p className="mt-1 font-semibold">{a.value}</p></a>)}
        </div>
        <div className="mt-6 rounded-3xl bg-ea-deep p-6 text-ea-cream">
          <h3 className="text-2xl text-ea-tan">Regional desks</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">{SNS_REGIONS.map((r) => <li key={r.key} className="flex items-start gap-2 text-sm"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-ea-tan" aria-hidden /><span><strong>{r.name}</strong><br /><a href={`mailto:${r.desk}`} className="break-all underline">{r.desk}</a></span></li>)}</ul>
        </div>
        <div className="mt-6"><BankList /></div>
        <p className="mt-4 font-semibold text-ea-brown">{SNS_PERSONAL_ACCOUNT_WARNING}</p>
        <div className="mt-6"><OwnershipLine /></div>
      </Wrap>
    </div>
  );
}

function BankList() {
  return (
    <div className="rounded-2xl border border-ea-line bg-ea-cream p-5">
      <h3 className="text-lg">Official bank accounts · {SNS_BANK_HOLDER} · {SNS_BANK_NAME}</h3>
      <ul className="mt-3 divide-y divide-ea-line text-sm">{SNS_BANK_ACCOUNTS.map((a) => <li key={a.currency} className="flex flex-wrap justify-between gap-2 py-2"><span><strong>{a.currency}</strong> · {a.purpose}</span><span className="font-mono font-semibold">{a.number}</span></li>)}</ul>
      <p className="mt-3 text-xs font-semibold text-ea-brown">{SNS_NARRATION_NOTICE}</p>
    </div>
  );
}

export default function SpecialNeedsSchools() {
  const title = "Support a Special-Needs School Across Africa | EduAid-Africa";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "NGO", name: "EduAid-Africa", url: "https://eduaid.africa",
    parentOrganization: { "@type": "Organization", name: "Santos Creations Educational Foundation", url: "https://santoscreations.org" },
    potentialAction: { "@type": "DonateAction", name: "Donate to the Africa Special Needs Education Support Fund", target: `${SNS_CANONICAL}#donate`, recipient: { "@type": "NGO", name: "EduAid Africa Ltd" } },
  };
  return (
    <SupportPageProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={SNS_DESCRIPTION} />
        <link rel="canonical" href={SNS_CANONICAL} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={SNS_DESCRIPTION} />
        <meta property="og:url" content={SNS_CANONICAL} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Body />
    </SupportPageProvider>
  );
}
