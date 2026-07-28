// About NESA-Africa — consolidated page (22-page architecture).
// Governance moved to its own /governance route.
import { useEffect } from "react";
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
      <section id="scef"><SCEF /></section>
      <section id="vision-2035"><Vision2035 /></section>
      <section id="faq"><FAQ /></section>
      <section className="py-8 px-4 max-w-4xl mx-auto text-center border-t border-gold/10">
        <p className="text-white/70 text-sm">
          Governance, Integrity Firewall, NRC and Conflict-of-Interest policies now live on the dedicated{" "}
          <a href="/governance" className="text-gold underline">Governance & Integrity</a> page.
        </p>
      </section>
    </>
  );
}
