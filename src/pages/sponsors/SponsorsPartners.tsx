// Sponsors & Partners — consolidated page (22-page architecture).
// Mounts existing Partners and SponsorsHub content, plus a call to become a sponsor/partner.
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import SponsorsHub from "@/pages/sponsors/SponsorsHub";
import Partners from "@/pages/Partners";

const SECTIONS = [
  { id: "sponsors", label: "Sponsors" },
  { id: "partners", label: "Partners" },
  { id: "donate", label: "Donate" },
  { id: "become", label: "Become a Sponsor" },
];

export default function SponsorsPartners() {
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
        <title>Sponsors & Partners · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Sponsorship packages, official partners, donations and hospitality opportunities for NESA-Africa 2026 — Enablers of Education for All Across Africa."
        />
      </Helmet>
      <nav aria-label="Sponsors sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="sponsors"><SponsorsHub /></section>
      <section id="partners"><Partners /></section>

      <section id="donate" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Donate to NESA-Africa</h2>
        <p className="text-white/80">
          Support the recognition season, EduAid-Africa scholarships, Rebuild My School Africa infrastructure and
          Special-Needs inclusion programmes. Every donation is receipted and reported to the SCEF board.
        </p>
        <a href="/donate" className="inline-block mt-6 px-6 py-3 rounded-lg bg-gold text-charcoal font-semibold hover:bg-gold/90">
          Donate now
        </a>
      </section>

      <section id="become" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Become a Sponsor or Partner</h2>
        <p className="text-white/80">
          Sponsorship packages, official partnerships, hospitality tables and named recognition packages are curated by
          the NESA-Africa Secretariat. Media accreditation is coordinated separately via the <a href="/media" className="text-gold underline">Media & Stories</a> hub.
        </p>
        <a href="/sponsorship-packages" className="inline-block mt-6 px-6 py-3 rounded-lg bg-gold text-charcoal font-semibold hover:bg-gold/90">
          View sponsorship packages
        </a>
      </section>
    </>
  );
}
