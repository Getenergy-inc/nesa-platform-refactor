import { Shield, Vote, Scale, Users, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import platinumImg from "@/assets/cards/platinum-recognition.jpg";
import goldImg from "@/assets/cards/gold-public-voting.jpg";
import blueGarnetImg from "@/assets/cards/blue-garnet-gala.jpg";
import iconImg from "@/assets/cards/icon-lifetime.jpg";

export function FirewallsSection() {
  const { t } = useTranslation("pages");

  const firewalls = [
    {
      icon: Shield,
      title: "Platinum",
      description: "Non-competitive. Verification + governance checks.",
      href: "/awards/platinum",
      image: platinumImg,
    },
    {
      icon: Vote,
      title: "Gold",
      description: "Public participation only. Transparent audit trail.",
      href: "/awards/gold",
      image: goldImg,
    },
    {
      icon: Scale,
      title: "Blue Garnet",
      description: "Jury + public participation balance. Anti-fraud controls.",
      href: "/awards/blue-garnet",
      image: blueGarnetImg,
    },
    {
      icon: Users,
      title: "Icon",
      description: "Lifetime achievement recognition for education leaders.",
      href: "/awards/icon",
      image: iconImg,
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
              className="group bg-charcoal rounded-xl border border-gold/20 text-center hover:border-gold/40 hover:bg-charcoal-light transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                  <item.icon className="h-5 w-5 text-gold" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
                <p className="text-white/70 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-gold/60 group-hover:text-gold transition-colors">
                  <span>Learn more</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
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
