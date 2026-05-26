// PageFAQ — auto-injected page-aware FAQ section + floating helper.
// Pulls route-specific FAQs from src/config/pageFAQs.ts

import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, X, MessageCircleQuestion, Sparkles, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { getFAQsForPath } from "@/config/pageFAQs";
import { cn } from "@/lib/utils";

// ============================================================
// Inline FAQ section — auto-injected above the footer
// ============================================================
export function PageFAQSection({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const data = useMemo(() => getFAQsForPath(pathname), [pathname]);

  // FAQPage JSON-LD for SEO (visible Qs/As only)
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    [data],
  );

  // Hide on auth/dashboard routes where FAQs would feel intrusive
  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) return null;

  return (
    <section
      className={cn(
        "relative bg-charcoal border-t border-gold/10 py-14 sm:py-20",
        className,
      )}
    >
      <div className="container px-4 sm:px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gold">
              FAQ
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-white/65 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {data.faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
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

        {data.viewAllHref && (
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-6 py-2.5 shadow-[0_8px_30px_-8px_hsl(var(--gold)/0.5)]"
            >
              <Link to={data.viewAllHref}>
                {data.viewAllLabel || "View Full FAQ"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        <p className="text-center text-white/50 text-xs sm:text-sm mt-8">
          Have more questions?{" "}
          <a
            href="mailto:info@nesa.africa"
            className="text-gold hover:underline font-medium"
          >
            Contact us at info@nesa.africa
          </a>
        </p>
      </div>
    </section>
  );
}

// ============================================================
// Floating FAQ helper button — opens a side sheet
// ============================================================
export function FloatingFAQButton() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const data = useMemo(() => getFAQsForPath(pathname), [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Hide on auth flows
  if (pathname.startsWith("/auth") || pathname.startsWith("/admin") || hidden) return null;

  return (
    <>
      {/* Floating trigger — bottom-right, above mobile bottom-nav */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
        className="fixed right-3 sm:right-5 bottom-24 lg:bottom-20 z-[60]"
      >
        <div className="relative group">
          <Button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open FAQ helper"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gold hover:bg-gold-dark text-charcoal shadow-[0_8px_30px_-8px_hsl(var(--gold)/0.6)] hover:shadow-[0_10px_40px_-8px_hsl(var(--gold)/0.8)] transition-all p-0"
          >
            <MessageCircleQuestion className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          {/* Dismiss x */}
          <button
            type="button"
            aria-label="Dismiss FAQ button"
            onClick={(e) => {
              e.stopPropagation();
              setHidden(true);
            }}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-charcoal border border-gold/40 text-white/70 hover:text-white hover:bg-charcoal-light flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </motion.div>

      {/* Side panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg bg-charcoal border-l border-gold/30 text-white overflow-y-auto"
        >
          <SheetHeader className="text-left pb-4 border-b border-gold/15">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-9 w-9 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-gold" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                Page FAQ
              </span>
            </div>
            <SheetTitle className="font-display text-xl sm:text-2xl text-white">
              {data.title}
            </SheetTitle>
            {data.subtitle && (
              <SheetDescription className="text-white/65 text-sm">
                {data.subtitle}
              </SheetDescription>
            )}
          </SheetHeader>

          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  {data.faqs.map((faq, i) => (
                    <AccordionItem
                      key={i}
                      value={`sheet-item-${i}`}
                      className="border-b border-gold/15 last:border-b-0"
                    >
                      <AccordionTrigger className="text-left text-white hover:text-gold hover:no-underline py-3 text-sm font-semibold">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70 text-sm leading-relaxed pb-3">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 p-4 rounded-xl bg-gold/5 border border-gold/20">
              <p className="text-white/70 text-xs sm:text-sm">
                Still need help?{" "}
                <a
                  href="mailto:info@nesa.africa"
                  className="text-gold font-semibold hover:underline"
                >
                  info@nesa.africa
                </a>
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default PageFAQSection;
