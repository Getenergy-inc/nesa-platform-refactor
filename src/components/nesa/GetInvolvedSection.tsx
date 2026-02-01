import { Award, Vote, Ticket, Heart, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function GetInvolvedSection() {
  const { t } = useTranslation("pages");

  const actions = [
    { icon: Award, labelKey: "landing.getInvolved.actions.nominate", href: "/nominate" },
    { icon: Vote, labelKey: "landing.getInvolved.actions.vote", href: "#vote" },
    { icon: Ticket, labelKey: "landing.getInvolved.actions.getTickets", href: "#tickets" },
    { icon: Heart, labelKey: "landing.getInvolved.actions.donate", href: "#donate" },
    { icon: Handshake, labelKey: "landing.getInvolved.actions.partner", href: "#partner" },
  ];

  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("landing.getInvolved.title")}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {actions.map((action) => (
            <Link key={action.labelKey} to={action.href}>
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8 gap-2 shadow-gold"
              >
                <action.icon className="h-5 w-5" />
                {t(action.labelKey)}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
