import { Shield, Vote, Scale, Users } from "lucide-react";

const firewalls = [
  {
    icon: Shield,
    title: "Platinum",
    description: "Non-competitive. NRC verification + governance checks.",
  },
  {
    icon: Vote,
    title: "Gold Stage",
    description: "100% public voting only — no judges.",
  },
  {
    icon: Scale,
    title: "Blue Garnet",
    description: "60% jury + 40% public. Audit logs & anti-fraud controls.",
  },
  {
    icon: Users,
    title: "Sponsors",
    description: "Sponsors and endorsers cannot influence or select winners.",
  },
];

export function FirewallsSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Firewalls & Integrity
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {firewalls.map((item) => (
            <div
              key={item.title}
              className="bg-secondary rounded-xl p-6 border border-primary/10 text-center hover:border-primary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-secondary-foreground/70 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
