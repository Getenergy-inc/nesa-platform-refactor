import { Badge } from "@/components/ui/badge";
import { GFAWalletIcon } from "@/components/ui/GFAWalletIcon";
import { Globe, FileText, Shield, type LucideIcon } from "lucide-react";

interface TrustFeature {
  icon: LucideIcon | null;
  label: string;
  isMarkup?: boolean;
  isGFA?: boolean;
}

const TRUST_FEATURES: TrustFeature[] = [
  { icon: Globe, label: "Multi-Currency" },
  { icon: FileText, label: "Instant Receipts" },
  { icon: Shield, label: "Secure Checkout" },
  { icon: null, label: "2% Processing Fee", isMarkup: true },
  { icon: null, label: "Wallet Audit Trail", isGFA: true },
];

export function TrustBar() {
  return (
    <section className="py-8 bg-secondary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {TRUST_FEATURES.map((feature) => (
            <div key={feature.label} className="flex items-center justify-center gap-3">
              {feature.isMarkup ? (
                <Badge variant="secondary" className="text-xs">2%</Badge>
              ) : feature.isGFA ? (
                <GFAWalletIcon size={24} />
              ) : feature.icon ? (
                <feature.icon className="h-6 w-6 text-primary" />
              ) : null}
              <span className="text-foreground font-medium">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
