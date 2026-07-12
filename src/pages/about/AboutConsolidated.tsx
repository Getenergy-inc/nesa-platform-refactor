// About & Governance — one consolidated page (30-page refactor).
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import About from "@/pages/about/About";
import Governance from "@/pages/about/Governance";
import SCEF from "@/pages/about/SCEF";
import Vision2035 from "@/pages/about/Vision2035";
import FAQ from "@/pages/FAQ";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "scef", label: "SCEF" },
  { id: "vision-2035", label: "Vision 2035" },
  { id: "governance", label: "Governance & Integrity" },
  { id: "nrc", label: "NRC" },
  { id: "coi", label: "Conflict of Interest" },
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
      <Helmet>
        <title>About NESA-Africa · Mission, Governance, SCEF & Vision 2035</title>
        <meta name="description" content="About NESA-Africa, our SCEF relationship, mission, history, governance, integrity firewalls, NRC, judge scope, conflict-of-interest rules, sponsor firewall and FAQs." />
      </Helmet>
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
      <section id="governance"><Governance /></section>
      <section id="nrc" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Nominee Review Committee (NRC)</h2>
        <p className="text-white/80">The NRC verifies every nomination against evidence and eligibility criteria before any judging begins. Full scope described under Governance above.</p>
      </section>
      <section id="coi" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Conflict of Interest & Sponsor Firewall</h2>
        <p className="text-white/80">Judges, NRC members and staff sign COI declarations. Sponsors have no visibility into scoring. Full policies published under Governance.</p>
      </section>
      <section id="faq"><FAQ /></section>
    </>
  );
}
