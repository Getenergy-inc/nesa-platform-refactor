import { Award, Trophy, Medal, GraduationCap, Users, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CategoryCard {
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
}

const categories: CategoryCard[] = [
  {
    icon: Award,
    badge: "Lifetime",
    title: "Africa Icon Blue Garnet Award",
    description: "Lifetime Achievement (10+ years of institutional impact)",
  },
  {
    icon: Trophy,
    badge: "Competitive",
    title: "Blue Garnet & Gold Certificate Awards",
    description: "Public voting + expert judging across 135 subcategories",
  },
  {
    icon: Medal,
    badge: "Non-Competitive",
    title: "Platinum Certificate of Recognition",
    description: "Merit-based recognition through expert panel evaluation",
  },
  {
    icon: GraduationCap,
    badge: "Competitive",
    title: "Outstanding Student Award",
    description: "Recognizing academic excellence and leadership",
  },
  {
    icon: Users,
    badge: "Competitive",
    title: "Teacher of Excellence",
    description: "Honoring educators making exceptional impact",
  },
  {
    icon: Lightbulb,
    badge: "Competitive",
    title: "Innovation in Education",
    description: "Rewarding creative teaching approaches",
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-nesa-navy-dark py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Award Categories
          </h2>
          <p className="text-nesa-text-muted max-w-2xl mx-auto">
            Multiple award tracks recognizing excellence at every level of education across Africa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-nesa-navy rounded-xl p-6 border border-nesa-gold/10 hover:border-nesa-gold/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-nesa-gold/10 flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-nesa-gold" />
                </div>
                <span className="text-xs font-medium text-nesa-gold uppercase tracking-wider">
                  {cat.badge}
                </span>
              </div>
              <h3 className="font-semibold text-white mb-2">{cat.title}</h3>
              <p className="text-nesa-text-muted text-sm">{cat.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/categories">
            <Button
              variant="outline"
              size="lg"
              className="border-nesa-gold text-nesa-gold hover:bg-nesa-gold/10 rounded-full"
            >
              View All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
