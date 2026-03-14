/**
 * Premium dashboard content cards — black/gold theme
 */

import { Link } from "react-router-dom";
import { Trophy, FileCheck, Shield, Building, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCard {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: React.ElementType;
  accent?: boolean;
}

const cards: DashboardCard[] = [
  {
    title: "Awards Season",
    description: "Explore the current award cycle — Platinum, Gold, Blue Garnet, and Africa Icons.",
    href: "/awards",
    cta: "Explore Awards",
    icon: Trophy,
    accent: true,
  },
  {
    title: "Nomination Portal",
    description: "Submit or review your nominations for education excellence recognition.",
    href: "/nominate",
    cta: "Submit Nomination",
    icon: FileCheck,
  },
  {
    title: "Education Development Index",
    description: "Access the integrity backbone of NESA-Africa — the EDI evaluation framework.",
    href: "/guidelines/edi-matrix",
    cta: "View EDI Matrix",
    icon: Shield,
  },
  {
    title: "Rebuild My School Africa",
    description: "Our 2025 post-award legacy project — nominate special needs schools for intervention.",
    href: "/eduaid-africa/rebuild-my-school",
    cta: "Learn More",
    icon: Building,
  },
];

export function InstitutionalCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            to={card.href}
            className={cn(
              "group relative rounded-xl border p-5 md:p-6 transition-all duration-300",
              "hover:shadow-[0_4px_20px_-4px_hsla(42,85%,52%,0.15)] hover:-translate-y-0.5",
              card.accent
                ? "bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border-gold/20 hover:border-gold/40"
                : "bg-[hsl(30_8%_8%)] border-white/5 hover:border-gold/20"
            )}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
                card.accent ? "bg-gold/20" : "bg-white/5"
              )}>
                <Icon className={cn("h-5 w-5", card.accent ? "text-gold" : "text-white/50")} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base mb-1">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-3">{card.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:gap-2.5 transition-all">
                  {card.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
