import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Crown, Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentRequired } from "@/components/nesa/ContentRequired";
import { IconSelectionCriteria } from "@/components/awards/IconSelectionCriteria";
import { ONLINE_GALA, PROGRAMME_END_LABEL } from "@/config/programme";
import { useTranslation } from "react-i18next";

const SECTIONS = [
  { id: "overview", label: "overview" },
  { id: "icons", label: "icons" },
  { id: "selection-criteria", label: "criteriaNav" },
  { id: "broadcast", label: "broadcastNav" },
  { id: "faq", label: "faqsNav" },
];

/** Online-only 2026 programme. No physical event, ticket, voting or venue content. */
export default function GalaConsolidated() {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>NESA-Africa 2026 Online Awards Gala</title>
        <meta name="description" content={t("onlineGala.summary")} />
        <meta property="og:title" content="NESA-Africa 2026 Online Awards Gala" />
        <meta property="og:description" content={t("onlineGala.summary")} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <nav aria-label="Online Awards Gala sections" className="sticky top-14 z-30 overflow-x-auto border-b border-gold/20 bg-charcoal/95 backdrop-blur sm:top-16">
        <ul className="flex gap-4 whitespace-nowrap px-4 py-3 text-sm">
          {SECTIONS.map((section) => (
            <li key={section.id}><a href={`#${section.id}`} className="text-white/80 transition-colors hover:text-gold">{t(`onlineGala.${section.label}`)}</a></li>
          ))}
        </ul>
      </nav>

      <section id="overview" className="border-b border-gold/15 bg-charcoal py-16 text-white md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">28 December 2026 · Online only</p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">NESA-Africa 2026 <span className="text-gold">Online Awards Gala</span></h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            {t("onlineGala.summary")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/awards/africa-education-icon">{t("onlineGala.exploreIcons")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/media">{t("onlineGala.exploreMedia")}</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">{t("onlineGala.restrictions")}</p>
        </div>
      </section>

      <section id="icons" className="bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <Crown className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">{t("onlineGala.focus")}</h2>
            <h3 className="mt-2 text-sm font-semibold text-gold">{t("onlineGala.categoriesHeading")}</h3>
            <ul className="mt-2 list-inside list-disc space-y-2 text-sm leading-relaxed text-white/70">
              {ONLINE_GALA.copy.categories.map((category, index) => <li key={category}>{t(`onlineGala.categories.${index}`)}</li>)}
            </ul>
          </article>
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <CalendarDays className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">{t("onlineGala.programmeDate")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{PROGRAMME_END_LABEL}. {t("onlineGala.production")}</p>
          </article>
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <ShieldCheck className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">{t("onlineGala.independentRecognition")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{t("onlineGala.integrity")}</p>
          </article>
        </div>
      </section>

      <IconSelectionCriteria />

      <section className="bg-charcoal py-16 text-white">
        <div className="container mx-auto max-w-4xl space-y-8 px-4">
          <div>
            <h2 className="font-display text-3xl font-bold">{t("onlineGala.presentationHeading")}</h2>
            <p className="mt-3 leading-relaxed text-white/70">{t("onlineGala.presentation")}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">{t("onlineGala.continuationHeading")}</h2>
            <p className="mt-3 leading-relaxed text-white/70">{t("onlineGala.continuation")}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t("onlineGala.nominationNotice")}</p>
          </div>
        </div>
      </section>

      <section id="broadcast" className="bg-charcoal py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Radio className="mx-auto h-8 w-8 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-bold">{t("onlineGala.watch")}</h2>
          <p className="mt-3 text-white/70">{t("onlineGala.broadcast")}</p>
          <ContentRequired title={t("onlineGala.broadcastRequired")} className="mx-auto mt-6 max-w-2xl">
            {t("onlineGala.broadcastPending")}
          </ContentRequired>
        </div>
      </section>

      <section id="faq" className="border-t border-gold/15 bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold">{t("onlineGala.faq")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gold/20 p-5"><h3 className="font-semibold text-gold">{t("onlineGala.ticketQuestion")}</h3><p className="mt-2 text-sm text-white/70">{t("onlineGala.ticketAnswer")}</p></div>
            <div className="rounded-xl border border-gold/20 p-5"><h3 className="font-semibold text-gold">{t("onlineGala.voteQuestion")}</h3><p className="mt-2 text-sm text-white/70">{t("onlineGala.voteAnswer")}</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
