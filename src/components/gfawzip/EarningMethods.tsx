import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, ShoppingBag, Heart, Users, Award, type LucideIcon } from "lucide-react";
import { AGCDisclaimer } from "./AGCDisclaimer";
import { PAYMENT_DESTINATIONS, WALLET_NAME } from "@/config/walletBranding";

interface PaymentPath {
  icon: LucideIcon;
  title: string;
  description: string;
  payee: string;
}

const PAYMENT_PATHS: PaymentPath[] = [
  {
    icon: Ticket,
    title: "Gala & Event Tickets",
    description: "Instant QR e-ticket and receipt after payment.",
    payee: PAYMENT_DESTINATIONS.nesa.payee,
  },
  {
    icon: ShoppingBag,
    title: "Merchandise",
    description: "Official NESA-Africa merchandise in your local currency.",
    payee: PAYMENT_DESTINATIONS.nesa.payee,
  },
  {
    icon: Award,
    title: "Sponsorship & Partnership",
    description: "Settle sponsorship invoices with full reconciliation records.",
    payee: PAYMENT_DESTINATIONS.nesa.payee,
  },
  {
    icon: Heart,
    title: "Education Donations",
    description: "Rebuild My School Africa, scholarships and school interventions.",
    payee: PAYMENT_DESTINATIONS.eduaid.payee,
  },
  {
    icon: Users,
    title: "Membership & Dues",
    description: "Membership sign-up, ambassador and local chapter dues.",
    payee: PAYMENT_DESTINATIONS.scef.payee,
  },
];

/** What the GFAwzip Wallet can be used to pay for, and who receives the money. */
export function EarningMethods() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30 font-semibold">
              GFAWzip for NESA-Africa 2026
            </Badge>
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              What you can pay for
            </h2>
            <p className="text-muted-foreground">
              {WALLET_NAME} handles authorised payments across NESA-Africa, EduAid-Africa and SCEF.
              Every payment shows the receiving organisation before checkout.
            </p>
          </div>

          <AGCDisclaimer />

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {PAYMENT_PATHS.map((path) => (
              <Card key={path.title} className="bg-card shadow-card border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <path.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                    <p className="text-xs text-gold mt-1">Payment goes to: {path.payee}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
