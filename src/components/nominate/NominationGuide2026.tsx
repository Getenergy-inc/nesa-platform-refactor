import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Mail, School } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IntegrityNotice } from "@/components/nominate/IntegrityNotice";
import { PUBLIC_ACTIONS_2026 } from "@/config/publicActions2026";
import { CATEGORIES } from "@/config/recognition2026/categories";

export function NominationGuide2026() {
  const { t } = useTranslation("nomination");
  const configuredRules = Array.from(new Set(CATEGORIES.flatMap((category) => category.eligibility)));
  const faqs = [
    [t("guide.faq.freeQ", "Is it free?"), t("guide.faq.freeA", "Yes.")],
    [t("guide.faq.selfQ", "Can I nominate myself?"), t("guide.faq.selfA", "Organisations yes; individuals where the award allows.")],
    [t("guide.faq.hearQ", "How will I hear back?"), t("guide.faq.hearA", "By email.")],
    [t("guide.faq.votingQ", "Is there public voting?"), t("guide.faq.votingA", "Not for the 2026 awards.")],
  ];
  return (
    <div className="space-y-8">
      <section aria-labelledby="nomination-guide-heading" className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold/80">{t("guide.eyebrow", "Start here")}</p>
          <h2 id="nomination-guide-heading" className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">{t("guide.title", "How NESA-Africa nominations work")}</h2>
        </div>
        <p className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm leading-relaxed text-white/85">
          {t("guide.notice", "Submitting a nomination begins a review process. It does not confirm identity verification, eligibility, shortlisting, judging, recognition or certificate entitlement.")}
        </p>
        <ol className="grid gap-3 md:grid-cols-3">
          {[t("guide.step1", "Check eligibility"), t("guide.step2", "Choose a tier and award"), t("guide.step3", "Submit the form")].map((step, index) => (
            <li key={step} className="rounded-xl border border-gold/20 bg-white/[0.03] p-4 text-sm font-semibold text-white"><span className="mr-2 text-gold">{index + 1}.</span>{step}</li>
          ))}
        </ol>
        <Button asChild size="lg" className="rounded-full bg-gold px-8 font-semibold text-charcoal hover:bg-gold/90">
          <a href={PUBLIC_ACTIONS_2026.nominate.href} target="_blank" rel="noopener noreferrer">{t("guide.open", "Open the nomination form")}<ArrowRight className="ml-2 h-4 w-4" /></a>
        </Button>
        <p className="text-sm text-white/75">{t("guide.emailPrefix", "Or email")} <a href="mailto:nominate.nesa2026@gmail.com" className="inline-flex items-center gap-1 text-gold hover:underline"><Mail className="h-3.5 w-3.5" />nominate.nesa2026@gmail.com</a>. {t("guide.free", "Nomination is free.")}</p>
        <IntegrityNotice />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section id="eligibility" aria-labelledby="eligibility-heading" className="scroll-mt-28 rounded-2xl border border-gold/20 bg-white/[0.03] p-5">
            <h2 id="eligibility-heading" className="font-display text-2xl text-white">{t("guide.eligibility", "Eligibility")}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/75">
              <li>{t("guide.ruleOrganisations", "Organisations may nominate themselves.")}</li>
              <li>{t("guide.ruleIndividuals", "Individuals may nominate themselves only where the award allows.")}</li>
              <li>{t("guide.ruleMultiple", "One nominee may enter more than one award.")}</li>
              {configuredRules.map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
          </section>
          <section aria-labelledby="next-heading" className="rounded-2xl border border-gold/20 bg-white/[0.03] p-5">
            <h2 id="next-heading" className="font-display text-2xl text-white">{t("guide.next", "What happens next")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gold">{t("guide.nextFlow", "Received → Under review → Awaiting nominee → In research → Decision made")}</p>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border border-gold/25 bg-gold/5 p-5">
          <School className="h-6 w-6 text-gold" aria-hidden />
          <h2 className="mt-3 font-display text-xl text-white">{t("guide.school", "Want to nominate a special-needs school instead?")}</h2>
          <Link to="/impact/special-needs-schools#nominate" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">{t("guide.schoolLink", "Nominate a school →")}</Link>
        </aside>
      </div>

      <section aria-labelledby="nomination-faq-heading">
        <h2 id="nomination-faq-heading" className="font-display text-2xl text-white">{t("guide.faqTitle", "Frequently asked questions")}</h2>
        <Accordion type="single" collapsible className="mt-4">
          {faqs.map(([question, answer], index) => <AccordionItem key={question} value={`guide-${index}`} className="border-gold/15"><AccordionTrigger className="text-left text-white hover:text-gold">{question}</AccordionTrigger><AccordionContent className="text-white/75">{answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>
    </div>
  );
}

export default NominationGuide2026;
