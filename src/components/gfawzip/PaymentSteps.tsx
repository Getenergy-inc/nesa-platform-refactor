import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface PaymentStep {
  step: number;
  title: string;
  description: string;
}

const PAYMENT_STEPS: PaymentStep[] = [
  { step: 1, title: "Choose", description: "Ticket / Donate / Sponsor" },
  { step: 2, title: "Checkout", description: "GFAWzip Wallet (2% markup included)" },
  { step: 3, title: "Receive", description: "Receipt/confirmation instantly" },
  { step: 4, title: "Earn", description: "AGC voting credits in your wallet" },
];

export function PaymentSteps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {PAYMENT_STEPS.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="bg-card border-border h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold text-secondary font-bold text-xl flex items-center justify-center mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < PAYMENT_STEPS.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 text-muted-foreground z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
