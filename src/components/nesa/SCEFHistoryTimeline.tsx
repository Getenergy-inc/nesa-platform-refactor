// SCEFHistoryTimeline — verified 8-point history and 2026-27 roadmap.
// No invented dates; use only the milestones confirmed in the master prompt.

const MILESTONES = [
  { year: "1997", label: "SCEF founded", detail: "Minna, Niger State" },
  { year: "2006", label: "Registered as a business name", detail: "" },
  { year: "2010", label: "Incorporated as an NGO", detail: "RC-41501" },
  { year: "2024", label: "New Education Standard Award Africa Ltd", detail: "RC-7381138" },
  { year: "2026", label: "NESA-Africa inaugural public cycle", detail: "" },
  { year: "1 Aug 2026", label: "Public nominations open", detail: "All four tiers" },
  { year: "22 Oct 2026", label: "NESA-Africa 2026 Recognition Gala", detail: "Lagos" },
  { year: "2027", label: "Special Needs School Intervention begins", detail: "8 schools, 1 per region" },
] as const;

export function SCEFHistoryTimeline() {
  return (
    <section aria-label="Our story so far" className="bg-charcoal py-14 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[0.2em] uppercase text-gold/70">Our Story So Far</p>
          <h2 className="font-display text-2xl md:text-3xl text-white font-bold mt-1">
            Nearly Three Decades of Building Toward This Moment
          </h2>
        </div>
        <ol className="max-w-4xl mx-auto relative border-l border-gold/25 pl-6 space-y-6">
          {MILESTONES.map((m) => (
            <li key={m.year} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-gold border-2 border-charcoal" />
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <p className="font-display text-gold font-bold text-sm sm:text-base whitespace-nowrap min-w-[7rem]">{m.year}</p>
                <div>
                  <p className="text-white font-semibold">{m.label}</p>
                  {m.detail && <p className="text-white/60 text-sm">{m.detail}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default SCEFHistoryTimeline;
