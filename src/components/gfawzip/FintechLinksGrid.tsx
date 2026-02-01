import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, CreditCard, Banknote, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PaymentProvider {
  name: string;
  description: string;
  url: string;
  currencies: string[];
  icon: LucideIcon;
  featured?: boolean;
}

interface RegionProviders {
  region: string;
  flag: string;
  providers: PaymentProvider[];
}

const FINTECH_LINKS: RegionProviders[] = [
  {
    region: "Pan-African",
    flag: "🌍",
    providers: [
      {
        name: "Paystack",
        description: "Cards, bank transfers, mobile money",
        url: "https://paystack.com",
        currencies: ["NGN", "GHS", "KES", "ZAR"],
        icon: CreditCard,
        featured: true,
      },
      {
        name: "Flutterwave",
        description: "Multi-currency payments across Africa",
        url: "https://flutterwave.com",
        currencies: ["NGN", "GHS", "KES", "UGX", "TZS"],
        icon: Globe,
      },
      {
        name: "Transactpay",
        description: "Cross-border payment solutions",
        url: "https://transactpay.io",
        currencies: ["USD", "NGN", "GHS"],
        icon: Banknote,
      },
    ],
  },
  {
    region: "East Africa",
    flag: "🇰🇪",
    providers: [
      {
        name: "M-Pesa",
        description: "Mobile money payments",
        url: "https://www.safaricom.co.ke/personal/m-pesa",
        currencies: ["KES", "TZS"],
        icon: Smartphone,
        featured: true,
      },
      {
        name: "TapTap Send",
        description: "Remittances to East Africa",
        url: "https://www.taptapsend.com",
        currencies: ["KES", "UGX", "TZS"],
        icon: Banknote,
      },
    ],
  },
  {
    region: "North America",
    flag: "🇺🇸",
    providers: [
      {
        name: "Zelle",
        description: "Bank-to-bank transfers (US)",
        url: "https://www.zellepay.com",
        currencies: ["USD"],
        icon: Banknote,
        featured: true,
      },
      {
        name: "Bancable",
        description: "USD wire transfers",
        url: "https://bancable.com",
        currencies: ["USD"],
        icon: CreditCard,
      },
    ],
  },
  {
    region: "Europe",
    flag: "🇪🇺",
    providers: [
      {
        name: "SEPA Transfer",
        description: "Euro bank transfers",
        url: "#",
        currencies: ["EUR"],
        icon: Banknote,
      },
      {
        name: "Wise",
        description: "International transfers",
        url: "https://wise.com",
        currencies: ["EUR", "GBP", "USD"],
        icon: Globe,
      },
    ],
  },
];

function ProviderCard({ provider }: { provider: PaymentProvider }) {
  const Icon = provider.icon;
  
  return (
    <a
      href={provider.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <Card className={`h-full bg-card shadow-card border-border transition-all hover:shadow-lg hover:border-primary/30 ${provider.featured ? 'ring-1 ring-primary/20' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{provider.name}</h4>
                  {provider.featured && (
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{provider.description}</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-wrap gap-1">
            {provider.currencies.map((currency) => (
              <Badge key={currency} variant="outline" className="text-xs px-2 py-0">
                {currency}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export function FintechLinksGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30 font-semibold">
              GFAWzip for NESA-Africa 2025 — Earn AfriGold Coins
            </Badge>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Available Payment Methods
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from multiple payment providers based on your region. <span className="text-gold font-medium">Every $1 = 5 AGC voting credits!</span>
            </p>
          </div>

          <div className="space-y-10">
            {FINTECH_LINKS.map((region) => (
              <div key={region.region}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{region.flag}</span>
                  <h3 className="text-lg font-semibold text-foreground">{region.region}</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {region.providers.map((provider) => (
                    <ProviderCard key={provider.name} provider={provider} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-lg bg-muted/30 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Don't see your preferred method?</span>{" "}
              Contact us at <a href="mailto:payments@nesa-africa.org" className="text-primary hover:underline">payments@nesa-africa.org</a> for alternative options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
