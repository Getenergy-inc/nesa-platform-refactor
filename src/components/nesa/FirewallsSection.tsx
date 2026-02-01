import { Shield, Vote, Scale, Users, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FirewallsSection() {
  const { t } = useTranslation("pages");

  const firewalls = [
    {
      icon: Shield,
      title: "Platinum",
      description: "Non-competitive. Verification + governance checks.",
    },
    {
      icon: Vote,
      title: "Gold Stage",
      description: "Public participation only. Transparent audit trail.",
    },
    {
      icon: Scale,
      title: "Blue Garnet",
      description: "Jury + public participation balance. Anti-fraud controls.",
    },
    {
      icon: Users,
      title: "Sponsors",
      description: "Sponsors and endorsers cannot influence winners.",
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
            <div
              key={item.title}
              className="bg-charcoal rounded-xl p-6 border border-gold/20 text-center hover:border-gold/40 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm">{item.description}</p>
            </div>
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
