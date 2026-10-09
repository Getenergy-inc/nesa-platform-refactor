// Gala & Tickets — one consolidated page (30-page refactor).
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Gala from "@/pages/media/Gala";
import Tickets from "@/pages/Tickets";
import BuyYourTicket from "@/pages/BuyYourTicket";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "tickets", label: "Tickets" },
  { id: "tables", label: "Tables" },
  { id: "delegates", label: "Delegates" },
  { id: "hospitality", label: "Sponsor Hospitality" },
  { id: "media", label: "Media Accreditation" },
  { id: "faq", label: "FAQs" },
];

export default function GalaConsolidated() {
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
        <title>Gold-Blue Garnet Awards Gala · NESA-Africa 2026</title>
        <meta name="description" content="NESA-Africa 2026 Gold-Blue Garnet Awards Gala — Lagos, 13 December 2026. Individual tickets, tables, delegates, sponsor hospitality, invitations, media accreditation and QR check-in." />
      </Helmet>
      <nav aria-label="Gala sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <section id="overview"><Gala /></section>
      <section id="tickets"><Tickets /></section>
      <section id="tables"><BuyYourTicket /></section>
      <section id="delegates" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Institutional Delegates</h2>
        <p className="text-white/80">Ministries, universities, NGOs and corporate partners can register delegate parties via <a href="/support#contact" className="text-gold underline">Contact & Help</a>.</p>
      </section>
      <section id="hospitality" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Sponsor Hospitality</h2>
        <p className="text-white/80">Sponsor tables, hospitality suites and named recognition packages are curated under <a href="/support#sponsors" className="text-gold underline">Support & Get Involved</a>.</p>
      </section>
      <section id="media" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Media Accreditation</h2>
        <p className="text-white/80">Working press can apply for Gala media accreditation via <a href="/media#accreditation" className="text-gold underline">Media & Events → Accreditation</a>.</p>
      </section>
      <section id="faq" className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gold mb-4 text-center">Gala FAQs</h2>
        <p className="text-white/80 text-center">General ticketing, dress code, arrival and QR check-in questions are answered in the <a href="/support#faq" className="text-gold underline">Support FAQs</a>.</p>
      </section>
    </>
  );
}
