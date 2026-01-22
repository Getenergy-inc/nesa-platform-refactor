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
    <section className="bg-nesa-navy-dark py-16 md:py-20">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <p className="text-nesa-gold text-sm font-medium mb-2">Phase 1 — Public Education & Awareness</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            EduAid-Africa Webinar Series
          </h2>
          
          <div className="flex items-center gap-2 text-nesa-text-muted mb-6">
            <Calendar className="h-4 w-4 text-nesa-gold" />
            <span>14 October 2025 – June 2026</span>
          </div>

          <p className="text-nesa-text-muted mb-8 leading-relaxed">
            The official public education and engagement framework for NESA-Africa — educating
            stakeholders on education challenges, NESA standards, and preparing the public for
            nominations and voting.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {webinarTopics.map((topic) => (
              <div
                key={topic}
                className="bg-nesa-navy rounded-lg px-4 py-3 border border-nesa-gold/10 text-nesa-text text-sm"
              >
                {topic}
              </div>
            ))}
          </div>

          <div className="bg-nesa-navy rounded-xl p-4 border border-nesa-gold/10">
            <p className="text-nesa-text-muted text-sm text-center">
              <span className="text-nesa-gold">Frequency:</span> 2–4 webinars monthly •{" "}
              <span className="text-nesa-gold">Pan-African speakers & practitioners</span> •{" "}
              Recorded and archived for public access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
