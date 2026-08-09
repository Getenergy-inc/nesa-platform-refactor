import { CheckCircle2, FileCheck, BookOpen, ShieldCheck, Download } from "lucide-react";

/**
 * Best Library in Nigerian Tertiary Institutions — Platinum, Batch 1.
 * SCEF × NESA-Africa × Nigerian Library Association (NLA) framework.
 * Renders the 8 sub-categories, 15-point eligibility grid, and required
 * supporting documents so nominators can prepare before submitting the form.
 */

const SUBCATEGORIES: { n: number; title: string }[] = [
  { n: 1, title: "Best University Library in Nigeria (Public)" },
  { n: 2, title: "Best University Library in Nigeria (Private)" },
  { n: 3, title: "Best Polytechnic Library in Nigeria (Public)" },
  { n: 4, title: "Best Polytechnic Library in Nigeria (Private)" },
  { n: 5, title: "Best College of Education Library in Nigeria (Public)" },
  { n: 6, title: "Best College of Education Library in Nigeria (Private)" },
  { n: 7, title: "Best College of Nursing Library in Nigeria (Public)" },
  { n: 8, title: "Best College of Nursing Library in Nigeria (Private)" },
];

const CRITERIA: string[] = [
  "Library is part of a fully accredited Nigerian tertiary institution (NUC, NBTE, NCCE or NMCN).",
  "Minimum 50,000 physical volumes OR 100,000+ e-resources (verified catalogue 2025–2026).",
  "Fully functional OPAC / KOHA / Integrated Library System accessible 24/7.",
  "Minimum 200 seating capacity with dedicated postgraduate/research zones.",
  "Active institutional repository (DSpace, EPrints, etc.) with ≥5,000 full-text items.",
  "Subscription to ≥10 international databases (Scopus, Web of Science, EBSCOhost, JSTOR, etc.).",
  "Minimum 15 professional librarians (≥ Master’s degree or Chartered Librarians of Nigeria).",
  "2023–2026 evidence of automation, RFID or digital transformation project.",
  "Documented user education / information literacy programme reaching ≥3,000 students annually.",
  "24/7 virtual access + physical opening hours ≥12 hours/day on weekdays.",
  "Gender-inclusive, disability-friendly facilities (ramps, screen readers, braille section, etc.).",
  "Evidence of sustainability (solar power, e-resource preservation, green library practices).",
  "Active collaboration with at least two other Nigerian / African libraries (consortia, resource sharing).",
  "Published annual library report 2024 & 2025 with usage statistics and impact metrics.",
  "Commitment to contribute library data to the forthcoming SCEF National Education Observatory Dashboard.",
];

const DOCUMENTS: string[] = [
  "Current NUC/NBTE/NCCE accreditation certificate of parent institution",
  "Library organogram + list of professional staff (with qualifications)",
  "Latest library annual report (2024 & 2025)",
  "Screenshots/links: OPAC · Institutional Repository · Database subscriptions",
  "Photos of physical library (interior, seating, automation, accessibility features)",
  "Evidence of information literacy programme (brochures, attendance records)",
  "Sustainability report (solar panels, recycling, etc.)",
  "Two letters of endorsement (e.g., Vice-Chancellor + NLA Chapter Chair)",
  "Signed Declaration of Authenticity",
];

export function LibraryNigeriaStandardsSection() {
  return (
    <section
      id="library-standards"
      className="py-14 md:py-20 bg-charcoal border-y border-gold/20"
      aria-labelledby="library-standards-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-gold mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            Platinum · Batch 1 — Best Library Standards
          </div>
          <h2
            id="library-standards-heading"
            className="font-playfair text-3xl md:text-4xl text-gold leading-tight mb-3"
          >
            Enablers of Education for All Across Africa — Library Standards Framework
          </h2>
          <p className="text-foreground/80 text-sm md:text-base">
            Organised by <strong>Santos Creations Educational Foundation (SCEF)</strong> in partnership with{" "}
            <strong>NESA-Africa 2026</strong> and the <strong>Nigerian Library Association (NLA)</strong>.
            8 sub-categories · 10 real nominees each · 80 institutions recognised.
          </p>
        </header>

        {/* 8 Sub-Categories */}
        <div className="mb-12">
          <h3 className="font-playfair text-xl md:text-2xl text-gold mb-4 flex items-center gap-2">
            <FileCheck className="h-5 w-5" /> The 8 Sub-Categories
          </h3>
          <ol className="grid gap-3 sm:grid-cols-2">
            {SUBCATEGORIES.map((s) => (
              <li
                key={s.n}
                className="flex items-start gap-3 rounded-xl border border-gold/20 bg-charcoal-light/40 p-4 hover:border-gold/50 transition-colors"
              >
                <span className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold font-semibold text-sm">
                  {s.n}
                </span>
                <span className="text-foreground/90 text-sm md:text-base leading-snug">
                  {s.title}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* 15-Point Criteria */}
        <div className="mb-12">
          <h3 className="font-playfair text-xl md:text-2xl text-gold mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> 15-Point SCEF Library Eligibility &amp; Excellence Criteria (2026)
          </h3>
          <p className="text-foreground/70 text-sm mb-4">
            All criteria must be satisfied. Nominators should be prepared to evidence each point.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {CRITERIA.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-gold/15 bg-charcoal-light/30 p-3"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span className="text-foreground/85 text-sm">
                  <span className="text-gold/80 font-semibold mr-1">{i + 1}.</span>
                  {c}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supporting Documents */}
        <div>
          <h3 className="font-playfair text-xl md:text-2xl text-gold mb-2 flex items-center gap-2">
            <Download className="h-5 w-5" /> Supporting Documents (all mandatory)
          </h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {DOCUMENTS.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 rounded-lg border border-gold/15 bg-charcoal-light/30 p-3"
              >
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                <span className="text-foreground/85 text-sm">{d}</span>
              </li>
            ))}
          </ul>

          <p className="text-foreground/60 text-xs mt-6">
            Submissions reviewed by the SCEF Library Standards Committee, the NLA National Secretariat and the
            NESA-Africa Awards Unit. Nominator declaration of authenticity is required with every submission.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LibraryNigeriaStandardsSection;
