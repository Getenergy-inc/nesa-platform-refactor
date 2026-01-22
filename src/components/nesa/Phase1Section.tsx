import { Calendar } from "lucide-react";

const webinarTopics = [
  "Education for All & SDG 4",
  "CSR & Private Sector Education Impact",
  "NGOs & Community-Driven Education",
  "STEM & Innovation",
  "Creative Arts & Education",
  "Inclusion, Disability & Special Needs",
];

export function Phase1Section() {
  return (
    <section className="bg-charcoal py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-primary text-sm font-medium mb-2">Phase 1 — Public Education & Awareness</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            EduAid-Africa Webinar Series
          </h2>
          
          <div className="flex items-center gap-2 text-secondary-foreground/70 mb-6">
            <Calendar className="h-4 w-4 text-primary" />
            <span>14 October 2025 – June 2026</span>
          </div>

          <p className="text-secondary-foreground/70 mb-8 leading-relaxed">
            The official public education and engagement framework for NESA-Africa — educating
            stakeholders on education challenges, NESA standards, and preparing the public for
            nominations and voting.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {webinarTopics.map((topic) => (
              <div
                key={topic}
                className="bg-secondary rounded-lg px-4 py-3 border border-primary/10 text-secondary-foreground text-sm"
              >
                {topic}
              </div>
            ))}
          </div>

          <div className="bg-secondary rounded-xl p-4 border border-primary/10">
            <p className="text-secondary-foreground/70 text-sm text-center">
              <span className="text-primary">Frequency:</span> 2–4 webinars monthly •{" "}
              <span className="text-primary">Pan-African speakers & practitioners</span> •{" "}
              Recorded and archived for public access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
