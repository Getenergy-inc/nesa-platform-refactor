import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gavel, Users, Award, LayoutGrid, ShieldCheck } from "lucide-react";

const stats = [
  { value: "50+", label: "Expert Judges", icon: Users },
  { value: "17", label: "Categories", icon: LayoutGrid },
  { value: "141", label: "Sub-Categories", icon: Award },
  { value: "100%", label: "Transparency", icon: ShieldCheck },
];

export function JudgesSection() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Gavel className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">Our Esteemed Panel</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Meet Our Distinguished <span className="text-gold">Judges</span>
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            At the New Education Standard Award Africa (NESA-Africa) 2025, our esteemed panel of 
            judges brings together education leaders, innovators, philanthropists, policymakers, 
            and experts across Africa and the diaspora.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-xl bg-charcoal-light border border-gold/20 hover:border-gold/40 transition-colors"
            >
              <stat.icon className="h-6 w-6 text-gold mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-gold mb-1">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold-dark text-charcoal font-semibold rounded-full px-8"
          >
            <Link to="/judges">See All Judges</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
