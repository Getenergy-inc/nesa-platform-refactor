import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Clock, Users, Coins, type LucideIcon } from "lucide-react";
import { AGCDisclaimer } from "./AGCDisclaimer";

interface EarningMethod {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EARNING_METHODS: EarningMethod[] = [
  { icon: Gift, title: "Support Bonus", description: "$1 = 5 Bonus AGC (eligible transactions)" },
  { icon: Clock, title: "Daily Sign-in", description: "+1 AGCc/day (10 AGCc = 1 AGC)" },
  { icon: Users, title: "Referral (1st Payment)", description: "+3 AGC when referred user pays" },
  { icon: Users, title: "Referral (2nd Payment)", description: "+1 AGC on second payment" },
];

export function EarningMethods() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30 font-semibold">
              GFAWzip for NESA-Africa 2025
            </Badge>
            <h2 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Coins className="h-8 w-8 text-gold" />
              Earn AfriGold Coins (AGC)
            </h2>
            <p className="text-lg text-gold font-semibold mb-2">
              Vote for your favorite nominees with AGC!
            </p>
            <p className="text-muted-foreground">
              Participate and earn voting credits through various activities.
            </p>
          </div>

          <AGCDisclaimer />

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {EARNING_METHODS.map((method) => (
              <Card key={method.title} className="bg-card shadow-card border-border">
                <CardContent className="pt-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Sponsors may fund public participation pools that grant claimable AGC voting credits (where enabled).
          </p>
        </div>
      </div>
    </section>
  );
}
