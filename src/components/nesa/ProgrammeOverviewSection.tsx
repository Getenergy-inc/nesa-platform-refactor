import { BookOpen, Award, Building } from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    category: "Public Education & Awareness",
    title: "EduAid-Africa Webinar Series",
    description: "Stakeholder education on challenges, standards, and informed participation",
  },
  {
    icon: Award,
    category: "Recognition & Standards",
    title: "NESA-Africa Awards Cycle",
    description: "Standards-based continental education recognition and accountability",
  },
  {
    icon: Building,
    category: "Legacy Impact",
    title: "Rebuild My School Africa",
    description: "Post-award infrastructure projects for inclusive education",
  },
];

export function ProgrammeOverviewSection() {
  return (
    <section className="bg-secondary py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-medium mb-2">October 2025 – June 2027</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Programme Overview
          </h2>
          <p className="text-secondary-foreground/70 max-w-3xl mx-auto">
            NESA-Africa 2025 is a standards-based continental education recognition and accountability
            programme designed to document verified education service, engage the public through
            structured participation, and leave a post-award legacy through inclusive education
            infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-charcoal/50 rounded-2xl p-6 border border-primary/10 text-center hover:border-primary/30 transition-colors"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <pillar.icon className="h-7 w-7 text-primary" />
              </div>
              <p className="text-primary text-sm font-medium mb-2">{pillar.category}</p>
              <h3 className="text-lg font-bold text-white mb-2">{pillar.title}</h3>
              <p className="text-secondary-foreground/70 text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
