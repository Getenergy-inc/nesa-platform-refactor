import { Award, Vote, Ticket, Heart, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const actions = [
  { icon: Award, label: "Nominate", href: "/nominate" },
  { icon: Vote, label: "Vote", href: "#vote" },
  { icon: Ticket, label: "Get Tickets", href: "#tickets" },
  { icon: Heart, label: "Donate", href: "#donate" },
  { icon: Handshake, label: "Partner", href: "#partner" },
];

export function GetInvolvedSection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Get Involved
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {actions.map((action) => (
            <Link key={action.label} to={action.href}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 gap-2"
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
