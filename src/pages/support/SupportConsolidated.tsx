// Support & Get Involved — one consolidated page (30-page refactor).
// Mounts existing pages verbatim so every word of copy is preserved.
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Partners from "@/pages/Partners";
import Donate from "@/pages/Donate";
import Volunteer from "@/pages/Volunteer";
import Ambassadors from "@/pages/Ambassadors";
import Chapters from "@/pages/Chapters";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import EndorseNESA from "@/pages/EndorseNESA";

const SECTIONS = [
  { id: "sponsors", label: "Sponsors" },
  { id: "partners", label: "Partners" },
  { id: "donate", label: "Donate" },
  { id: "endorse", label: "Endorse" },
  { id: "volunteers", label: "Volunteer" },
  { id: "ambassadors", label: "Ambassadors" },
  { id: "chapters", label: "Chapters" },
  { id: "merchandise", label: "Merchandise" },
  { id: "contact", label: "Contact" },
  { id: "faq", label: "FAQs" },
];

export default function SupportConsolidated() {
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
        <title>Support & Get Involved · NESA-Africa 2026</title>
        <meta name="description" content="Sponsor, partner, donate, volunteer, become an ambassador, join a local chapter, buy merchandise, or contact NESA-Africa — all in one place." />
      </Helmet>
      <nav aria-label="Support sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <section id="sponsors"><Partners /></section>
      <section id="partners" aria-hidden="true" />
      <section id="donate"><Donate /></section>
      <section id="endorse"><EndorseNESA /></section>
      <section id="volunteers"><Volunteer /></section>
      <section id="ambassadors"><Ambassadors /></section>
      <section id="chapters"><Chapters /></section>
      <section id="merchandise" className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Merchandise</h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          Explore official NESA-Africa merchandise — apparel, accessories, and legacy items that support our education programmes.
        </p>
        <a href="/shop" className="inline-block mt-6 px-6 py-3 bg-gold text-charcoal font-semibold rounded-lg">Visit the Shop</a>
      </section>
      <section id="contact"><Contact /></section>
      <section id="faq" aria-label="Help and FAQs"><FAQ /></section>
    </>
  );
}
