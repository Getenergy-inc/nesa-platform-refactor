// Local Chapters & Volunteers — one consolidated page (22-page architecture).
// Mounts Chapters + Volunteer + Ambassadors verbatim.
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Chapters from "@/pages/Chapters";
import Volunteer from "@/pages/Volunteer";
import Ambassadors from "@/pages/Ambassadors";

const SECTIONS = [
  { id: "chapters", label: "Local Chapters" },
  { id: "volunteers", label: "Volunteers" },
  { id: "ambassadors", label: "Ambassadors" },
];

export default function ChaptersConsolidated() {
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
        <title>Local Chapters, Volunteers & Ambassadors · NESA-Africa 2026</title>
        <meta
          name="description"
          content="Join a NESA-Africa local chapter, volunteer with the movement or apply as an official ambassador for Enablers of Education for All Across Africa."
        />
      </Helmet>
      <nav aria-label="Chapters sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="chapters"><Chapters /></section>
      <section id="volunteers"><Volunteer /></section>
      <section id="ambassadors"><Ambassadors /></section>
    </>
  );
}
