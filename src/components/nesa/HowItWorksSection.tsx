import { BookOpen, Award, Star, Trophy, Medal, Building } from "lucide-react";

const steps = [
  { icon: BookOpen, label: "Webinar" },
  { icon: Award, label: "Platinum" },
  { icon: Star, label: "Icon" },
  { icon: Medal, label: "Gold" },
  { icon: Trophy, label: "Blue Garnet" },
  { icon: Building, label: "RMSA Legacy" },
];

export function HowItWorksSection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            How NESA Works
          </h2>
          <p className="text-secondary-foreground/70 max-w-2xl mx-auto">
            A structured lifecycle from public education to lasting legacy impact.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-primary/20 hidden md:block" />

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="relative z-10 h-16 w-16 rounded-full bg-charcoal border-2 border-primary/30 flex items-center justify-center mb-3">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <span className="text-secondary-foreground text-sm font-medium">{step.label}</span>

                  {/* Arrow (except last) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 -right-2 text-primary/50">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
