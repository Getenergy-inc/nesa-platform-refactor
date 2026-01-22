import { Award, Vote, Users, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PathCard {
  icon: React.ElementType;
  badge: string;
  title: string;
  period: string;
  description: string;
  bullets: string[];
}

const nominationPaths: PathCard[] = [
  {
    icon: Award,
    badge: "Lifetime Achievement",
    title: "Africa Icon Blue Garnet Award",
    period: "2005–2025",
    description: "Reserved for lifetime achievement. Nominees must have 10+ years institutional achievements.",
    bullets: ["Institutional Achievements", "Long-term Impact", "Legacy Recognition"],
  },
  {
    icon: Vote,
    badge: "Public Voting",
    title: "Blue Garnet & Gold Certificate Awards",
    period: "Annual Competition",
    description: "Open competition with public participation through AGC voting and expert judging.",
    bullets: ["Public Voting", "Expert Judging", "135 Subcategories"],
  },
  {
    icon: Users,
    badge: "Expert Selection",
    title: "Platinum Certificate of Recognition",
    period: "Merit-Based",
    description: "Merit-based recognition through expert panel evaluation and institutional review.",
    bullets: ["No Voting", "Internal Judging", "Global Nomination"],
  },
];

export function NominationPathSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Choose Your Nomination Path
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            Select the appropriate award category based on the nominee's achievements and recognition type.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {nominationPaths.map((path) => (
            <div
              key={path.title}
              className="bg-secondary rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <path.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">
                  {path.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{path.title}</h3>
              <p className="text-primary text-sm mb-3">{path.period}</p>
              <p className="text-secondary-foreground/70 text-sm mb-4">{path.description}</p>

              <ul className="space-y-2 mb-6">
                {path.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <Link to="/nominate">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full">
                  Nominate Now
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
