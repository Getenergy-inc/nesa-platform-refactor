import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AGCDisclaimer } from "./AGCDisclaimer";

interface FAQ {
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    question: "What is the GFAwzip Wallet used for?",
    answer:
      "It is the approved payment channel for authorised NESA-Africa, EduAid-Africa and SCEF transactions: sponsorship, merchandise, gala and event payments, approved programme contributions and other authorised transactions.",
  },
  {
    question: "Are there voting credits in the wallet?",
    answer:
      "No. There is no public voting for the 2026 cycle and no voting credits exist in any form. The wallet is a payment channel only.",
  },
  {
    question: "Can a payment influence recognition?",
    answer:
      "No. No payment, donation, sponsorship or membership can increase a nominee's score, influence NRC verification or assessment, or purchase finalist or award status.",
  },
  {
    question: "What do I receive after payment?",
    answer:
      "You receive an instant receipt, plus a QR e-ticket for ticket purchases, a donation confirmation for EduAid-Africa donations, or a sponsorship acknowledgement.",
  },
  {
    question: "Who receives my money?",
    answer:
      "Each payment path is separated. NESA-Africa receives tickets, merchandise and sponsorship. EduAid-Africa receives education donations. SCEF receives membership sign-up and dues. The receiving organisation is shown before you pay.",
  },
  {
    question: "Where do I see my payment history?",
    answer: "Visit your wallet at /wallet to view your balance, payments and receipts.",
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
