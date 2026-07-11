import { CheckCircle2, FileCheck, FlaskConical, ShieldCheck, Download } from "lucide-react";

/**
 * Excellence in Research & Development for Education (Nigeria)
 * Platinum · Batch 2 — SCEF × NESA-Africa × AU-STRC framework.
 * Renders the 3 sub-categories, 15-point R&D eligibility grid, and required
 * supporting documents so nominators can prepare before submitting the form.
 */

const SUBCATEGORIES: { n: number; title: string }[] = [
  { n: 1, title: "Best Agricultural Research Institute in Nigeria" },
  { n: 2, title: "Best Pharmaceutical & Drug Research Institute in Nigeria" },
  { n: 3, title: "Best Environmental & Ecological Research Institute in Nigeria" },
];

const CRITERIA: string[] = [
  "Federally or university-established research institute/centre with ≥15 years of active operation.",
  "Currently runs accredited postgraduate (M.Sc./Ph.D.) programmes in the relevant field.",
  "Minimum 50 full-time researchers/scientists with Ph.D. or equivalent.",
  "Published ≥100 peer-reviewed articles in Scopus/Web of Science-indexed journals (2020–2025).",
  "Secured ≥₦500 million in competitive research grants (national or international) in the last 5 years.",
  "Produced ≥20 patented innovations or registered varieties/technologies since 2020.",
  "Active collaboration with ≥3 African or international research institutions.",
  "Runs a functional technology transfer / incubation unit benefiting farmers, industries, or communities.",
  "Demonstrated direct impact on policy, industry, or community (e.g., new crop varieties, drugs, eco-policy).",
  "Commitment to share research data with the SCEF Continental Education & Research Observatory.",
  "Gender balance (≥35% female researchers/postgraduate students).",
  "Evidence of green/sustainable laboratory practices (solar power, waste management, etc.).",
  "Aligns with ≥3 objectives of AU Continental Education Strategy (CESA 16-25) and STISA-2024.",
  "Measurable contribution to SDGs (especially SDG 2, 3, 9, 13, 15).",
  "Endorsed by TETFund, Raw Materials Research Council (NOTAP), or relevant professional body.",
];

const DOCUMENTS: string[] = [
  "Current establishment mandate & organogram",
  "List of researchers with qualifications",
  "Publication list 2020–2025 (Scopus / Web of Science)",
  "Grant & patent certificates",
  "Technology transfer / impact stories",
  "Two endorsement letters (TETFund, NOTAP, or professional body)",
  "Photos of laboratories & field stations",
  "Sustainability report",
  "Signed Declaration of Authenticity",
];

export function ResearchDevelopmentStandardsSection() {
  return (
    <section
      id="research-standards"
      className="py-14 md:py-20 bg-charcoal border-y border-gold/20"
      aria-labelledby="research-standards-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <header className="mb-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-3 py-1 text-xs text-gold mb-3">
            <FlaskConical className="h-3.5 w-3.5" />
            Platinum · Batch 2 — Research & Development Standards
          </div>
          <h2
            id="research-standards-heading"
            className="font-playfair text-3xl md:text-4xl text-gold leading-tight mb-3"
          >
            Enablers of Education for All Across Africa — R&amp;D Excellence Framework
          </h2>
          <p className="text-foreground/80 text-sm md:text-base">
            Organised by <strong>Santos Creations Educational Foundation (SCEF)</strong> in partnership with{" "}
            <strong>NESA-Africa 2026</strong> and the{" "}
            <strong>African Union Scientific, Technical & Research Commission (AU-STRC)</strong>.
            3 sub-categories · 10 real institutes each · 30 research bodies recognised.
          </p>
        </header>

        {/* 3 Sub-Categories */}
        <div className="mb-12">
          <h3 className="font-playfair text-xl md:text-2xl text-gold mb-4 flex items-center gap-2">
            <FileCheck className="h-5 w-5" /> The 3 Sub-Categories
          </h3>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <ShieldCheck className="h-5 w-5" /> 15-Point SCEF R&amp;D Eligibility &amp; Excellence Criteria (2025)
          </h3>
          <p className="text-foreground/70 text-sm mb-4">
            All 15 criteria must be satisfied. Nominators should be prepared to evidence each point.
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
            Submissions reviewed by the SCEF Research Standards Committee, AU-STRC focal points and the NESA-Africa
            Awards Unit. Nominator declaration of authenticity is required with every submission. Winning institutes
            will be celebrated at the continental ceremony and permanently showcased on the SCEF Research Observatory
            Platform.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ResearchDevelopmentStandardsSection;
