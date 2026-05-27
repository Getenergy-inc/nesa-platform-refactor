import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CategoryFaq } from "@/config/awardCategories";

interface Props {
  faqs: CategoryFaq[];
  title?: string;
}

export function CategoryFaqSection({ faqs, title = "Frequently asked questions" }: Props) {
  return (
    <section className="py-10 md:py-16 bg-charcoal-light/30">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="font-playfair text-2xl sm:text-3xl text-gold mb-5 md:mb-8 leading-tight">{title}</h2>
        <Accordion type="single" collapsible className="border border-gold/20 rounded-lg bg-charcoal-light/40">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-gold/10 px-3 sm:px-4">
              <AccordionTrigger className="text-left text-sm sm:text-base text-foreground hover:text-gold py-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-foreground/75 leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
