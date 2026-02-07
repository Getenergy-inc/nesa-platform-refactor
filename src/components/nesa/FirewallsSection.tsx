import { Shield, Vote, Scale, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function FirewallsSection() {
  const { t } = useTranslation("pages");

  const firewalls = [
    {
      icon: Shield,
      title: "Platinum",
      description: "Non-competitive. Verification + governance checks.",
      href: "/awards/platinum",
    },
    {
      icon: Vote,
      title: "Gold",
      description: "Public participation only. Transparent audit trail.",
      href: "/awards/gold",
    },
    {
      icon: Scale,
      title: "Blue Garnet",
      description: "Jury + public participation balance. Anti-fraud controls.",
      href: "/awards/blue-garnet",
    },
    {
      icon: Users,
      title: "Icon",
      description: "Lifetime achievement recognition for education leaders.",
      href: "/awards/icon",
    },
  ];

  return (
    <section className="bg-charcoal-light py-16 md:py-20 border-y border-gold/20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.firewalls.title")}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Merit-based integrity controls protect every stage of the awards process.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {firewalls.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group bg-charcoal rounded-xl p-6 border border-gold/20 text-center hover:border-gold/40 hover:bg-charcoal-light transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
              <p className="text-white/70 text-sm mb-3">{item.description}</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gold/60 group-hover:text-gold transition-colors">
                <span>Learn more</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* AGC Disclaimer */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-warning/10 border border-warning/30">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning">
              <span className="font-semibold">AGC is non-tradeable</span>—no withdrawals, no cash-out, no payouts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
