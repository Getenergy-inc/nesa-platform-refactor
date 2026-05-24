// FAQ / Help-Center — full continental participation guide
// Categorised accordion grouped by NESA-Africa 2026 journey themes.

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FULL_FAQ_GROUPS } from "@/config/pageFAQs";

export default function FAQPage() {
  // Build FAQ JSON-LD for rich snippets
  const jsonLd = useMemo(() => {
    const mainEntity = FULL_FAQ_GROUPS.flatMap((g) =>
      g.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    );
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>FAQ & Participation Guide | NESA-Africa 2026</title>
        <meta
          name="description"
          content="Full continental participation guide for NESA-Africa 2026 — nominations, AGC voting, Blue Garnet Awards Gala, regions, EduAid Africa and partnerships."
        />
        <link rel="canonical" href="/faq" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="min-h-screen bg-charcoal text-white">
        {/* Hero */}
        <section className="relative border-b border-gold/15 py-16 sm:py-20">
          <div className="container px-4 sm:px-6 max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-5">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold">
                  Help Center
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                NESA-Africa 2026 — Frequently Asked Questions
              </h1>
              <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Everything you need to know about nominations, AGC voting, the Blue Garnet Awards
                Gala, regional participation, and post-award education impact through EduAid Africa
                and Rebuild My School Africa.
              </p>
            </motion.div>

            {/* Quick category jump nav */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {FULL_FAQ_GROUPS.map((g) => {
                const id = slugify(g.title);
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/15 transition-colors"
                  >
                    {g.title}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Groups */}
        <section className="py-14 sm:py-20">
          <div className="container px-4 sm:px-6 max-w-4xl space-y-12">
            {FULL_FAQ_GROUPS.map((group) => {
              const id = slugify(group.title);
              return (
                <div key={id} id={id} className="scroll-mt-24">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                        {group.title}
                      </h2>
                      {group.description && (
                        <p className="text-white/60 text-sm mt-1">{group.description}</p>
                      )}
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {group.faqs.map((faq, i) => (
                      <AccordionItem
                        key={i}
                        value={`${id}-${i}`}
                        className="border-b border-gold/15 last:border-b-0"
                      >
                        <AccordionTrigger className="text-left text-white hover:text-gold hover:no-underline py-4 sm:py-5 text-sm sm:text-base font-semibold">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-white/70 text-sm sm:text-base leading-relaxed pb-4">
                          <p>{faq.a}</p>
                          {faq.ctas && faq.ctas.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {faq.ctas.map((cta, j) => (
                                <Link
                                  key={j}
                                  to={cta.href}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-colors"
                                >
                                  {cta.label}
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-gold/15 py-12 sm:py-16">
          <div className="container px-4 sm:px-6 max-w-3xl text-center">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-white/70 text-sm sm:text-base mb-6">
              Our team responds within 2 business days. You can also explore the 2026 journey or
              jump straight into nominations and voting.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-5"
              >
                <Link to="/nominate">
                  Nominate for 2026
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
              >
                <a href="mailto:info@nesa.africa">Contact info@nesa.africa</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/^[a-z]\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
