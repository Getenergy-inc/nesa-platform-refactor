/**
 * VisionMissionObjectivesSection — homepage summary of Vision, Mission, and
 * the 15 Strategic Objectives. Detail lives on /about.
 */
import { Link } from "react-router-dom";
import { Eye, Target, CheckCircle2 } from "lucide-react";

const OBJECTIVES = [
  "Continental Recognition",
  "Educator Visibility",
  "Institutional Partnerships",
  "Scholarship Pipelines",
  "Special Needs Inclusion",
  "Teacher Empowerment",
  "Youth Development",
  "Research & Publications",
  "Edu-Tourism Exchange",
  "Local Chapter Activation",
  "Diaspora Engagement",
  "Policy Influence",
  "School Infrastructure",
  "Media for Education",
  "Vision 2035 Ecosystem",
];

export function VisionMissionObjectivesSection() {
  return (
    <section className="py-14 md:py-20 bg-charcoal-light/20 border-y border-gold/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
            What guides us
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ivory mt-2">
            Vision, Mission & Strategic Objectives
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-8">
          <div className="rounded-2xl border border-gold/25 bg-charcoal/60 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-gold" />
              <h3 className="font-display text-lg font-bold text-ivory">Vision</h3>
            </div>
            <p className="text-ivory/75 text-sm leading-relaxed">
              An Africa where every learner, educator, and institution is
              recognised, supported, and equipped to transform education.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-charcoal/60 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-gold" />
              <h3 className="font-display text-lg font-bold text-ivory">Mission</h3>
            </div>
            <p className="text-ivory/75 text-sm leading-relaxed">
              To turn recognition into measurable impact through visibility,
              partnerships, funding, intervention, and legacy programs.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-ivory/80 text-sm uppercase tracking-wider mb-4">
            15 Strategic Objectives
          </h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {OBJECTIVES.map((o, i) => (
              <li
                key={o}
                className="flex items-center gap-2 rounded-lg border border-gold/15 bg-charcoal/50 px-3 py-2.5 text-ivory/85 text-xs md:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                <span><span className="text-gold/70 font-mono mr-1">{String(i + 1).padStart(2, "0")}</span>{o}</span>
              </li>
            ))}
          </ul>
          <div className="text-center mt-6">
            <Link to="/about" className="text-gold text-sm hover:underline">
              Read the full Vision &amp; Mission →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisionMissionObjectivesSection;
