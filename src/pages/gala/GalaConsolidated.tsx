import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Crown, Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONLINE_GALA, PROGRAMME_END_LABEL, PROGRAMME_PUBLIC_NOTICE } from "@/config/programme";
import { useTranslation } from "react-i18next";

const SECTIONS = [
  { id: "overview", label: "overview" },
  { id: "icons", label: "icons" },
  { id: "participation", label: "participationNav" },
  { id: "broadcast", label: "broadcastNav" },
  { id: "faq", label: "faqsNav" },
];

const PROGRAMME_ELEMENTS = [
  "Africa Education Icon recognition",
  "Icon documentaries",
  "Authorised interviews",
  "Education-impact stories",
  "Regional and international contributions",
  "Approved Certificates of Recognition",
  "NESA-Africa TV coverage",
  "Africa Education Enablers Podcast features",
];

/** Online-only 2026 programme. No physical event, ticket, voting or venue content. */
export default function GalaConsolidated() {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>NESA-Africa 2026 Online Recognition Programme</title>
        <meta name="description" content={t("onlineGala.summary")} />
        <link rel="canonical" href="https://nesa.africa/programme/2026" />
        <meta property="og:title" content="NESA-Africa 2026 Online Recognition Programme" />
        <meta property="og:description" content={t("onlineGala.summary")} />
        <meta property="og:url" content="https://nesa.africa/programme/2026" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <nav aria-label="Online Recognition Programme sections" className="sticky top-14 z-30 overflow-x-auto border-b border-gold/20 bg-charcoal/95 backdrop-blur sm:top-16">
        <ul className="flex gap-4 whitespace-nowrap px-4 py-3 text-sm">
          {SECTIONS.map((section) => (
            <li key={section.id}><a href={`#${section.id}`} className="text-white/80 transition-colors hover:text-gold">{section.id === "participation" ? "Participation" : t(`onlineGala.${section.label}`)}</a></li>
          ))}
        </ul>
      </nav>

      <section id="overview" className="border-b border-gold/15 bg-charcoal py-16 text-white md:py-24">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Monday, 28 December 2026 · Online only</p>
          <h1 className="mt-4 font-display text-4xl font-bold md:text-6xl">NESA-Africa 2026 <span className="text-gold">Online Recognition Programme</span></h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            {t("onlineGala.summary")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-gold text-charcoal hover:bg-gold/90">
              <Link to="/contact?subject=media">Receive Programme Updates</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/recognition/africa-education-icon">{t("onlineGala.exploreIcons")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Link to="/media/tv">{t("onlineGala.watch")}</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">{t("onlineGala.restrictions")}</p>
        </div>
      </section>

      <section id="icons" className="bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-3">
          <article className="rounded-2xl border border-gold/20 bg-charcoal/60 p-6">
            <Crown className="h-7 w-7 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">Purpose</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">To bring verified education contributions into public view through responsible storytelling, documentaries, interviews and approved recognition moments.</p>
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

      <section className="bg-charcoal py-16 text-white">
        <div className="container mx-auto max-w-4xl space-y-8 px-4">
          <div>
            <h2 className="font-display text-3xl font-bold">Programme elements</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {PROGRAMME_ELEMENTS.map((item) => <li key={item} className="rounded-xl border border-gold/20 bg-charcoal-light/20 p-4 text-sm text-white/75">{item}</li>)}
            </ul>
            <p className="mt-5 text-sm text-white/65">Three Icon categories: {ONLINE_GALA.copy.categories.join(" · ")}.</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold">{t("onlineGala.continuationHeading")}</h2>
            <p className="mt-3 leading-relaxed text-white/70">{t("onlineGala.continuation")}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{t("onlineGala.nominationNotice")}</p>
          </div>
        </div>
      </section>

      <section id="participation" className="border-t border-gold/15 bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="font-display text-3xl font-bold">Participation</h2>
          <p className="mt-4 leading-relaxed text-white/75">{PROGRAMME_PUBLIC_NOTICE}</p>
        </div>
      </section>

      <section id="broadcast" className="bg-charcoal py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <Radio className="mx-auto h-8 w-8 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-bold">{t("onlineGala.watch")}</h2>
          <p className="mt-3 text-white/70">Public viewing information will be released after approval and technical testing.</p>
        </div>
      </section>

      <section id="faq" className="border-t border-gold/15 bg-charcoal-light/20 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl font-bold">{t("onlineGala.faq")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gold/20 p-5"><h3 className="font-semibold text-gold">Is live participation open to the public?</h3><p className="mt-2 text-sm text-white/70">Live participation is by invitation and operational approval.</p></div>
            <div className="rounded-xl border border-gold/20 p-5"><h3 className="font-semibold text-gold">Does media participation confirm recognition?</h3><p className="mt-2 text-sm text-white/70">No. Appearing in an interview, webinar, podcast, documentary or programme does not confirm nomination, selection or recognition.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
