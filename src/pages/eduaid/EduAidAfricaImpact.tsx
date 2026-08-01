// EduAid-Africa Impact — one consolidated post-award social-impact page.
// Mounts Rebuild, Special-Needs, Afri-EduTourism, EduAid content verbatim.
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { EDUAID_CROSS_REFERENCE, EDUAID_SERIES_META } from "@/data/eduaidWebinarSeries2026";
import EduAid from "@/pages/EduAid";
import Rebuild from "@/pages/Rebuild";
import AfriEduTourismPage from "@/pages/AfriEduTourismPage";
import NominateSchool from "@/pages/impact/NominateSchool";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "webinars", label: "Webinars" },
  { id: "rebuild-my-school", label: "Rebuild My School" },
  { id: "nominate-special-needs-school", label: "Nominate a School" },
  { id: "afri-edutourism", label: "Afri-EduTourism" },
  { id: "scholarships", label: "Scholarships" },
  { id: "training", label: "Training" },
  { id: "impact-reporting", label: "Impact Reporting" },
];

export default function EduAidAfricaImpact() {
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
        <title>EduAid-Africa Impact · NESA-Africa 2026</title>
        <meta name="description" content="EduAid-Africa: webinars, Rebuild My School Africa, Special-Needs school nominations, Afri-EduTourism, scholarships, training and continental impact reporting." />
      </Helmet>
      <nav aria-label="EduAid sections" className="sticky top-14 sm:top-16 z-30 bg-charcoal/95 backdrop-blur border-b border-gold/20 overflow-x-auto">
        <ul className="flex gap-4 px-4 py-3 text-sm whitespace-nowrap">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-white/80 hover:text-gold transition-colors">{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="overview"><EduAid /></section>
      <section id="webinars" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Pre-Award Webinars, FGDs & Podcasts</h2>
        <p className="text-white/80 mb-2">
          {EDUAID_CROSS_REFERENCE.text}{" "}
          <a href={EDUAID_CROSS_REFERENCE.href} target="_blank" rel="noopener noreferrer" className="text-gold underline">
            {EDUAID_CROSS_REFERENCE.linkLabel}
          </a>
        </p>
        <p className="text-white/60 text-sm">
          {EDUAID_SERIES_META.strapline} ·{" "}
          <Link to="/media/webinars" className="text-gold underline">View the full timetable</Link>
        </p>
      </section>
      <section id="rebuild-my-school"><Rebuild /></section>
      <section id="nominate-special-needs-school"><NominateSchool /></section>
      <section id="afri-edutourism"><AfriEduTourismPage /></section>
      <section id="scholarships" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Scholarships</h2>
        <p className="text-white/80">EduAid-Africa scholarship pipelines route through recognised Education Enablers. Details are published as regional partners come online.</p>
      </section>
      <section id="training" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Training & Capacity Development</h2>
        <p className="text-white/80">Teacher training, leadership development and continental capacity-building programmes delivered with EduAid-Africa partners.</p>
      </section>
      <section id="impact-reporting" className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">Continental Impact Reporting</h2>
        <p className="text-white/80">Public dashboards, annual reports and regional impact briefs — coming into full release with the 2026 season.</p>
      </section>
    </>
  );
}
