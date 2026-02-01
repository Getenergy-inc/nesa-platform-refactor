import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AGCDisclaimer } from "./AGCDisclaimer";

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "Can I withdraw AGC?",
    answer: "No. AGC is non-tradeable voting credit. There is no cash-out, no withdrawals, and no payouts.",
  },
  {
    question: "Is AGC cryptocurrency?",
    answer: "No. AGC is an internal voting credit used only within the SCEF/NESA-Africa ecosystem.",
  },
  {
    question: "What do I receive after payment?",
    answer: "You receive instant receipts, QR e-tickets (for ticket purchases), donation confirmations, or sponsorship acknowledgements.",
  },
  {
    question: "How do I earn AGC from payments?",
    answer: "$1 = 5 Bonus AGC for eligible transactions. Credits are added to your wallet after successful payment.",
  },
  {
    question: "Where do I see my AGC?",
    answer: "Visit your Wallet (/wallet) to view your balance and complete transaction history.",
  },
];

export function GFAWzipFAQ() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8">
            <AGCDisclaimer />
          </div>
        </div>
      </div>
    </section>
  );
}
