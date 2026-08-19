// Programs & Initiatives — real SCEF/NESA-Africa programmes.
// Local routes are used where the programme already exists in this app;
// everything else links out to santoscreations.org.

import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Users,
  Award,
  Wrench,
  BookOpen,
  HeartHandshake,
  Backpack,
} from "lucide-react";

interface Program {
  title: string;
  kicker: string;
  description: string;
  href: string;
  external?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const PROGRAMS: Program[] = [
  {
    title: "EduAid-Africa",
    kicker: "Funding & Partnerships",
    description:
      "Funding education support through partnerships, scholarships, school aid, teacher development, and community programs.",
    href: "/eduaid",
    icon: GraduationCap,
  },
  {
    title: "EduAid Africa Teacher Corps",
    kicker: "Volunteer Movement",
    description:
      "Mobilising teachers, mentors, special needs experts, digital volunteers, diaspora professionals and friends of Africa to support schools and learners.",
    href: "https://www.santoscreations.org/programs/eduaid-africa-teacher-corps",
    external: true,
    icon: Users,
  },
  {
    title: "NESA-Africa",
    kicker: "Recognition & Awards",
    description:
      "Recognising educators, schools, leaders, and organisations advancing education excellence across Africa.",
    href: "/",
    icon: Award,
  },
  {
    title: "Rebuild My School Africa",
    kicker: "School Transformation",
    description:
      "Supporting school improvement, infrastructure advocacy, learning spaces, and community-driven school transformation.",
    href: "/rebuild",
    icon: Wrench,
  },
  {
    title: "eLibrary Africa",
    kicker: "Digital Learning",
    description:
      "Expanding access to digital learning resources, online libraries, and education technology.",
    href: "https://www.santoscreations.org/programs/elibrary-nigeria",
    external: true,
    icon: BookOpen,
  },
  {
    title: "Women & Girls Empowerment",
    kicker: "Inclusion & Leadership",
    description:
      "Supporting girls' education, women leadership, STEM inclusion, safeguarding, mentorship, and wellbeing.",
    href: "https://www.santoscreations.org/programs/women-girls-empowerment",
    external: true,
    icon: HeartHandshake,
  },
  {
    title: "Send a Child to School",
    kicker: "Scholarships & Access",
    description: "Sponsor a child's school fees, uniforms, books, and learning support.",
    href: "https://www.santoscreations.org/programs/send-a-child-to-school",
    external: true,
    icon: Backpack,
  },
];

export default function ProgramsInitiativesSection() {
  return (
    <section className="bg-charcoal text-white px-4 pb-12" aria-labelledby="friends-programs">
      <div className="max-w-6xl mx-auto">
        <h2 id="friends-programs" className="font-playfair text-2xl font-bold text-gold mb-2">
          Programs &amp; Initiatives
        </h2>
        <p className="mb-6 max-w-3xl text-sm text-white/65">
          Explore the programmes your support powers across the Santos Creations Educational
          Foundation ecosystem.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => {
            const inner = (
              <>
                <p.icon className="h-5 w-5 text-gold" aria-hidden />
                <h3 className="mt-3 font-playfair text-lg font-bold text-gold">{p.title}</h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-white/50">
                  {p.kicker}
                </p>
                <p className="mt-2 text-sm text-white/65">{p.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  {p.external ? "Visit programme" : "Explore"}
                  {p.external ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </>
            );

            const cls =
              "group flex flex-col rounded-2xl border border-gold/25 bg-white/[0.03] p-6 transition-colors hover:border-gold/60 hover:bg-gold/[0.06]";

            return p.external ? (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <Link key={p.title} to={p.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
