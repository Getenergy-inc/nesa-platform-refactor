import { Shield, Vote, Scale, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FirewallsSection() {
  const { t } = useTranslation("pages");

  const firewalls = [
    {
      icon: Shield,
      titleKey: "landing.firewalls.items.platinum.title",
      descriptionKey: "landing.firewalls.items.platinum.description",
    },
    {
      icon: Vote,
      titleKey: "landing.firewalls.items.gold.title",
      descriptionKey: "landing.firewalls.items.gold.description",
    },
    {
      icon: Scale,
      titleKey: "landing.firewalls.items.blueGarnet.title",
      descriptionKey: "landing.firewalls.items.blueGarnet.description",
    },
    {
      icon: Users,
      titleKey: "landing.firewalls.items.sponsors.title",
      descriptionKey: "landing.firewalls.items.sponsors.description",
    },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.firewalls.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {firewalls.map((item) => (
            <div
              key={item.titleKey}
              className="bg-charcoal-light rounded-xl p-6 border border-gold/20 text-center hover:border-gold/40 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-semibold text-white mb-2">{t(item.titleKey)}</h3>
              <p className="text-white/70 text-sm">{t(item.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
