// 15 Strategic Objectives — verbatim copy.
// Charcoal/Gold tokens, no custom CSS, no inline styles.
import {
  Award, Eye, FileText, Handshake, GraduationCap, School,
  Megaphone, Users, Microscope, Sparkles, MapPin, Plane,
  Coins, Accessibility, Globe2,
} from "lucide-react";

const OBJECTIVES = [
  { icon: Award,         title: "Recognition of Excellence" },
  { icon: Eye,           title: "Visibility for Changemakers" },
  { icon: FileText,      title: "Documentation of Impact Stories" },
  { icon: Handshake,     title: "Partnerships & Collaboration" },
  { icon: GraduationCap, title: "Scholarships & Funding" },
  { icon: School,        title: "School Infrastructure Support" },
  { icon: Megaphone,     title: "Media & Storytelling" },
  { icon: Users,         title: "Volunteer & Community Engagement" },
  { icon: Microscope,    title: "Research & Innovation" },
  { icon: Sparkles,      title: "Youth Leadership Development" },
  { icon: MapPin,        title: "Local Chapter Growth" },
  { icon: Plane,         title: "Afri-EduTourism" },
  { icon: Coins,         title: "Resource Mobilisation" },
  { icon: Accessibility, title: "Inclusive & Special Needs Education" },
  { icon: Globe2,        title: "Continental Education Ecosystem Building" },
];

export function FifteenObjectivesSection() {
  return (
    <section id="objectives" className="bg-charcoal py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-gold text-sm font-medium mb-2 uppercase tracking-wide">
            Strategic Framework
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            15 Strategic Objectives
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto leading-relaxed">
            Our commitment to advancing Education for All across Africa.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {OBJECTIVES.map((o, i) => {
            const Icon = o.icon;
            return (
              <li
                key={o.title}
                className="rounded-2xl border border-gold/20 bg-charcoal-light p-5 hover:border-gold/50 transition-colors flex items-start gap-3"
              >
                <span className="inline-flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-gold/15 text-gold font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <Icon className="h-4 w-4 text-gold mb-1.5" />
                  <h3 className="font-display text-base font-bold text-white leading-tight">
                    {o.title}
                  </h3>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
