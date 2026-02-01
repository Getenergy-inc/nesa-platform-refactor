import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Ticket, Star, Sparkles, Gift, QrCode } from "lucide-react";
import { TICKET_TIERS, type TicketTier } from "@/config/galaConfig";
import { cn } from "@/lib/utils";

const TIER_ICONS: Record<string, typeof Ticket> = {
  GENERAL: Ticket,
  PREMIUM: Star,
  VIP: Sparkles,
  VVIP: Gift,
};

interface TicketTierCardsProps {
  selectedTier: string;
  onSelectTier: (tierId: string) => void;
}

export function TicketTierCards({ selectedTier, onSelectTier }: TicketTierCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {TICKET_TIERS.map((tier, index) => {
        const Icon = TIER_ICONS[tier.id] || Ticket;
        const isSelected = selectedTier === tier.id;

        return (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "relative cursor-pointer transition-all hover:shadow-lg",
                isSelected 
                  ? "border-primary ring-2 ring-primary/30 shadow-lg" 
                  : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelectTier(tier.id)}
            >
              {/* Popular badge for VIP */}
              {tier.id === "VIP" && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary shadow-md">
                  Popular Choice
                </Badge>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">
                  ${tier.price}
                  <span className="text-sm font-normal text-muted-foreground"> USD</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  {tier.seatingNote}
                </p>
                
                <Separator />
                
                <ul className="space-y-2">
                  {tier.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {tier.features.length > 5 && (
                    <li className="text-sm text-primary font-medium">
                      +{tier.features.length - 5} more benefits
                    </li>
                  )}
                </ul>
                
                {/* QR ticket note */}
                <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 p-2 text-xs">
                  <QrCode className="h-4 w-4 text-primary" />
                  <span>Instant QR e-ticket + receipt</span>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-lg ring-2 ring-primary pointer-events-none" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
