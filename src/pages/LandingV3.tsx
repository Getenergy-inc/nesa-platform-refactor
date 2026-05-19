// Landing V3 — Award Almanac direction
// Conversion-focused refactor of the NESA Africa homepage based on the UX audit.
// Locked design tokens: Charcoal background, Gold (hsl(42 85% 52%)) accents,
// Instrument Serif display, Work Sans body. Magazine almanac layout.

import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";

const stats = [
  { value: "54", label: "Countries Represented" },
  { value: "1,760+", label: "Global Nominees" },
  { value: "27", label: "Executive Judges" },
  { value: "10", label: "African Regions" },
];

const partners = [
  "Santos Creations Educational Foundation",
  "SCEF Nigeria Local Chapter",
  "Civil Society Action Coalition",
  "Forum for African Education",
  "GFA Wzip",
  "GetEnergy.ng",
];

const steps = [
  {
    n: "01.",
    title: "Nominate",
    text: "Identify visionaries and institutions reshaping the educational landscape across Africa.",
  },
  {
    n: "02.",
    title: "Review",
    text: "Our executive panel of 27 judges evaluates impact, evidence and sustainability.",
  },
  {
    n: "03.",
    title: "Recognise",
    text: "Honouring the champions at the annual Blue Garnet gala — visibility, funding and partnerships.",
  },
];

const categories = [
  { tag: "Category 01", title: "Institutional", title2: "Innovation", featured: false, to: "/categories" },
  { tag: "Featured Category", title: "Excellence in", title2: "Rural Pedagogy", featured: true, to: "/categories" },
  { tag: "Category 03", title: "STEM Impact", title2: "Leadership", featured: false, to: "/categories" },
  { tag: "Category 04", title: "Digital", title2: "Transformation", featured: false, to: "/categories" },
];

export default function LandingV3() {
  return (
    <>
      <Helmet>
        <title>NESA Africa 2026 — The New Education Standard Award</title>
        <meta
          name="description"
          content="The continental platform recognising African education changemakers across 54 countries. Nominations now open for the NESA Africa 2026 Awards."
        />
      </Helmet>

      <PublicLayout>
        <div className="bg-charcoal text-white font-body">
          <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10">
            <div className="max-w-7xl mx-auto border-l border-r border-white/10">

              {/* Internal almanac header strip */}
              <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-white/10">
                <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-medium text-gold">
                  NESA Africa &copy; 2026
                </div>
                <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-widest font-semibold text-white/60">
                  <Link to="/categories" className="hover:text-gold transition-colors">Categories</Link>
                  <Link to="/judges" className="hover:text-gold transition-colors">Judges</Link>
                  <Link to="/programs" className="hover:text-gold transition-colors">Archive</Link>
                  <Link to="/partners" className="hover:text-gold transition-colors">Partners</Link>
                </nav>
              </div>

              {/* Main Almanac Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">

                {/* Sidebar: stats + partners */}
                <aside className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/10 p-6 md:p-8 space-y-10">
                  <div className="space-y-7">
                    {stats.map((s) => (
                      <div key={s.label}>
                        <div className="font-serif text-4xl md:text-5xl font-light italic mb-1 text-white">
                          {s.value}
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-10 border-t border-white/10">
                    <p className="text-[11px] leading-relaxed text-white/50 uppercase tracking-wider mb-5">
                      Strategic Partners
                    </p>
                    <ul className="space-y-3">
                      {partners.map((p) => (
                        <li
                          key={p}
                          className="text-xs text-white/55 leading-snug border-l border-gold/40 pl-3"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Main content */}
                <div className="lg:col-span-9">
                  {/* Hero block */}
                  <div className="p-6 md:p-12 lg:p-16 border-b border-white/10">
                    <div className="max-w-3xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold text-gold text-[10px] font-bold uppercase tracking-widest mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        Nominations Now Open
                      </div>
                      <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] mb-8 text-white">
                        The New Education Standard Award{" "}
                        <span className="text-gold italic">2026</span>
                      </h1>
                      <p className="text-lg md:text-xl lg:text-2xl font-light text-white/70 leading-relaxed mb-10">
                        Recognising excellence and driving continental impact through the
                        most prestigious education honours in Africa.
                      </p>
                      <div className="flex flex-wrap gap-3 md:gap-4">
                        <Link to="/nominate">
                          <button className="bg-gold text-charcoal font-bold uppercase text-xs tracking-widest px-8 md:px-10 py-4 md:py-5 transition-transform hover:scale-105 active:scale-95">
                            Nominate a Champion
                          </button>
                        </Link>
                        <Link to="/categories">
                          <button className="border border-white/20 text-white font-bold uppercase text-xs tracking-widest px-8 md:px-10 py-4 md:py-5 hover:bg-white/5 transition-colors">
                            Explore Categories
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* How it works */}
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {steps.map((step, i) => (
                      <div
                        key={step.title}
                        className={`p-6 md:p-8 ${
                          i < steps.length - 1
                            ? "border-b md:border-b-0 md:border-r border-white/10"
                            : ""
                        }`}
                      >
                        <div className="text-gold text-sm font-serif italic mb-4">{step.n}</div>
                        <h3 className="text-lg font-semibold mb-3 text-white uppercase tracking-wide">
                          {step.title}
                        </h3>
                        <p className="text-sm text-white/55 leading-relaxed">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories mosaic */}
              <section className="p-6 md:p-10 lg:p-12 bg-white/[0.02]">
                <div className="flex justify-between items-end mb-10 md:mb-12 border-b border-white/10 pb-5">
                  <h2 className="font-serif text-3xl md:text-4xl italic text-white">
                    Award Classifications
                  </h2>
                  <Link
                    to="/categories"
                    className="text-[10px] uppercase tracking-widest font-bold text-gold border-b border-gold pb-1 hover:text-gold-light hover:border-gold-light"
                  >
                    View All Categories
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {categories.map((c) => (
                    <Link
                      key={c.title + c.title2}
                      to={c.to}
                      className={`aspect-[3/4] border p-5 md:p-6 flex flex-col justify-end transition-colors cursor-pointer ${
                        c.featured
                          ? "bg-gold text-charcoal border-gold"
                          : "border-white/10 hover:border-gold"
                      }`}
                    >
                      <div
                        className={`text-[10px] uppercase mb-2 tracking-widest ${
                          c.featured ? "text-charcoal/60" : "text-white/40"
                        }`}
                      >
                        {c.tag}
                      </div>
                      <h4
                        className={`font-serif text-xl md:text-2xl leading-tight ${
                          c.featured ? "font-semibold" : ""
                        }`}
                      >
                        {c.title}
                        <br />
                        {c.title2}
                      </h4>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Final CTA bar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 md:p-8 border-t border-white/10">
                <p className="text-xs text-white/40 uppercase tracking-widest text-center md:text-left">
                  Ready to shape the future of African Education?
                </p>
                <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                  <Link
                    to="/partners"
                    className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-gold-light"
                  >
                    Partner with NESA
                  </Link>
                  <Link
                    to="/nominate"
                    className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-gold"
                  >
                    Nominate a Champion
                  </Link>
                  <Link
                    to="/contact"
                    className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-gold"
                  >
                    Join the Newsletter
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Mobile sticky primary CTA */}
          <div className="fixed bottom-16 left-0 right-0 z-40 px-4 pb-2 lg:hidden">
            <Link to="/nominate" className="block">
              <button className="w-full bg-gold text-charcoal font-bold uppercase text-xs tracking-widest py-4 shadow-xl shadow-gold/30">
                Nominate a Champion
              </button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    </>
  );
}
