// About NESA-Africa — consolidated page (22-page architecture).
// Governance moved to its own /governance route.
//
// Density model: the About narrative is the page. SCEF, Vision 2035 and the FAQ
// are full documents that used to be stacked inline — they are now collapsed
// behind disclosures (nothing removed) and also reachable as standalone pages
// at /about/scef, /about/vision and /about/faq.
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { AboutSeo } from "@/pages/about/AboutSeo";
import About from "@/pages/about/About";
import SCEF from "@/pages/about/SCEF";
import Vision2035 from "@/pages/about/Vision2035";
import FAQ from "@/pages/FAQ";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "scef", label: "SCEF" },
  { id: "vision-2035", label: "Vision 2035" },
  { id: "faq", label: "FAQs" },
];

function Disclosure({
  id,
  eyebrow,
  title,
  line,
  standalone,
  children,
  defaultOpen = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  line: string;
  standalone: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash?.replace("#", "") === id) setOpen(true);
  }, [id]);

  return (
    <section id={id} className="scroll-mt-28 border-t border-gold/10 bg-charcoal">
      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-20">
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold font-semibold">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold text-ivory leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-lg md:text-xl text-ivory/75 leading-snug max-w-2xl">{line}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2 text-sm font-medium text-gold hover:bg-gold/10 transition"
          >
            {open ? "Close" : "Read in full"}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          <a href={standalone} className="text-sm text-ivory/60 hover:text-gold underline">
            Open as its own page
          </a>
        </div>
      </div>
      {open && <div>{children}</div>}
    </section>
  );
}

export default function AboutConsolidated() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
    }
  }, []);

  return (
    <>
      <AboutSeo
        title="About NESA-Africa · Vision, Mission, SCEF & Vision 2035"
        description="About NESA-Africa — vision, mission, our SCEF relationship, history, Vision 2035 continental roadmap, and answers to frequently asked questions."
        path="/about/overview"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Overview", path: "/about/overview" },
        ]}
      />
      <nav aria-label="About sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="about"><About /></section>

      <Disclosure
        id="scef"
        eyebrow="Parent organisation"
        title="Santos Creations Educational Foundation"
        line="NESA-Africa is a service of SCEF — a registered Pan-African foundation building toward Education for All since 1997."
        standalone="/about/scef"
      >
        <SCEF />
      </Disclosure>

      <Disclosure
        id="vision-2035"
        eyebrow="Continental roadmap"
        title="Vision 2035"
        line="A decade-long roadmap from recognition to intervention across Africa's education systems."
        standalone="/about/vision"
      >
        <Vision2035 />
      </Disclosure>

      <Disclosure
        id="faq"
        eyebrow="Answers"
        title="Frequently Asked Questions"
        line="Eligibility, verification, nomination, judging and recognition — answered."
        standalone="/about/faq"
      >
        <FAQ />
      </Disclosure>

      <section className="py-8 px-4 max-w-4xl mx-auto text-center border-t border-gold/10">
        <p className="text-white/70 text-sm">
          Governance, Integrity Firewall, NRC and Conflict-of-Interest policies now live on the dedicated{" "}
          <a href="/governance" className="text-gold underline">Governance & Integrity</a> page.
        </p>
      </section>
    </>
  );
}
