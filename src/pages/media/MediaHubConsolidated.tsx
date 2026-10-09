// Media & Events — one consolidated hub (30-page refactor).
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import MediaHub from "@/pages/media/MediaHub";
import NESATV from "@/pages/media/NESATV";
import Shows from "@/pages/media/Shows";
import Webinars from "@/pages/media/Webinars";
import UpcomingEventsPage from "@/pages/UpcomingEvents";

const SECTIONS = [
  { id: "hub", label: "Hub" },
  { id: "nesa-tv", label: "NESA TV" },
  { id: "webinars", label: "Webinars" },
  { id: "recognition-shows", label: "Shows" },
  { id: "interviews", label: "Interviews" },
  { id: "podcasts", label: "Podcasts" },
  { id: "news", label: "News & Press" },
  { id: "galleries", label: "Galleries" },
  { id: "events", label: "Events" },
  { id: "accreditation", label: "Accreditation" },
];

export default function MediaHubConsolidated() {
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
        <title>Media & Events · NESA-Africa 2026</title>
        <meta name="description" content="NESA-Africa TV, EduAid webinars, recognition shows, interviews, documentaries, podcasts, news, photo and video galleries, upcoming events and media accreditation." />
      </Helmet>
      <nav aria-label="Media sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="hub"><MediaHub /></section>
      <section id="nesa-tv"><NESATV /></section>
      <section id="webinars"><Webinars /></section>
      <section id="recognition-shows"><Shows /></section>
      <section id="interviews" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Interviews & Documentaries</h2>
        <p className="text-white/80">Long-form interviews and documentaries featuring recognised Education Enablers, laureates and continental education leaders — publishing across the season.</p>
      </section>
      <section id="podcasts" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Podcasts & Radio</h2>
        <p className="text-white/80">NESA-Africa audio programming — weekly conversations, radio segments and archival episodes hosted through partner networks.</p>
      </section>
      <section id="news" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">News & Press Releases</h2>
        <p className="text-white/80">Official press releases, media statements and season announcements. Journalists can request quotes and interview time via Media Accreditation below.</p>
      </section>
      <section id="galleries" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Photo & Video Galleries</h2>
        <p className="text-white/80"><a className="text-gold underline" href="/gallery">Browse the full media gallery →</a></p>
      </section>
      <section id="events"><UpcomingEventsPage /></section>
      <section id="accreditation" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Media Accreditation</h2>
        <p className="text-white/80">Working journalists and content partners can request media accreditation for the 2026 season via <a href="/support#contact" className="text-gold underline">Contact & Help</a>.</p>
      </section>
    </>
  );
}
