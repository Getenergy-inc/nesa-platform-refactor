import { Award, Vote, Ticket, Heart, Handshake, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function GetInvolvedSection() {
  const { t } = useTranslation("pages");

  const actions = [
    { icon: Award, label: "Nominate", href: "/nominate", primary: true },
    { icon: Vote, label: "Vote", href: "/vote", primary: true },
    { icon: Ticket, label: "Get Tickets", href: "/buy-your-ticket", primary: false },
    { icon: Heart, label: "Donate", href: "/donate", primary: false },
    { icon: Handshake, label: "Partner", href: "/partners", primary: false },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.getInvolved.title")}
          </h2>
          
          {/* AGC Strip */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
            <Coins className="h-4 w-4 text-gold" />
            <span className="text-sm text-white/80">
              Vote with AGC voting points during official windows
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {actions.map((action) => (
            <Link key={action.label} to={action.href}>
              <Button
                size="lg"
                className={action.primary 
                  ? "bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-gold"
                  : "bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-8 gap-2 border border-white/20"
                }
              >
                <action.icon className="h-5 w-5" />
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
