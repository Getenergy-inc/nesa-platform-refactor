// Impact Stories & Media — "Stories of Education Impact".
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BookOpen, Camera, Video, Users } from "lucide-react";
import { IMPACT_BRAND, IMPACT_CTAS, IMPACT_NAV_FOOTER } from "@/config/educationSocialImpact";

const STORY_STRANDS = [
  { icon: BookOpen, title: "School stories", body: "How a school changed once its learning environment was rebuilt, restored or made accessible." },
  { icon: Users, title: "Teacher & learner voices", body: "First-hand accounts from the educators and learners closest to each intervention." },
  { icon: Camera, title: "Before & after documentation", body: "Photographic records of each site before work begins and after delivery is verified." },
  { icon: Video, title: "Video & community features", body: "Short films documenting community involvement and the Friends of EduAid-Africa behind each project." },
];

export default function ImpactStories() {
  return (
    <>
      <Helmet>
        <title>Impact Stories &amp; Media · NESA-Africa Education Social Impact</title>
        <meta name="description" content="Stories of Education Impact — school, teacher, learner and community stories, before-and-after documentation, video and photography from across Africa." />
        <link rel="canonical" href="https://nesa.africa/impact/stories" />
      </Helmet>

      <section className="bg-charcoal text-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
            <Link to="/" className="hover:text-gold">NESA-Africa</Link>
            <span className="mx-2">/</span>
            <Link to="/impact" className="hover:text-gold">Education Social Impact</Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Impact Stories &amp; Media</span>
          </nav>

          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-gold">Stories of Education Impact</h1>
          <p className="mt-3 max-w-3xl text-sm md:text-base text-white/70">
            {IMPACT_BRAND.overviewMessage} Every story published here is tied to a verified intervention record.
          </p>
          <p className="mt-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {IMPACT_BRAND.fundingLine}
          </p>
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-12">
        <div className="max-w-6xl mx-auto grid gap-5 md:grid-cols-2">
          {STORY_STRANDS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6">
                <Icon className="h-6 w-6 text-gold" />
                <h2 className="mt-3 font-playfair text-lg font-bold text-white">{s.title}</h2>
                <p className="mt-2 text-sm text-white/70">{s.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-charcoal text-white px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl border border-gold/20 bg-white/[0.03] p-8 text-center">
            <p className="text-white/75">
              The first stories of the 2026–2027 cycle publish alongside the interventions they document.
            </p>
            <p className="mt-2 text-sm text-white/55">
              Stories are published with the consent of the schools, learners, communities and Friends of
              EduAid-Africa involved. No private supporter information is published without consent.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/journal" className="rounded-lg border border-gold/40 px-5 py-3 text-sm font-semibold text-gold hover:bg-gold/10">
              EduAid-Africa Journal
            </Link>
            <Link to="/media" className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white/85 hover:border-gold/40 hover:text-gold">
              Media &amp; Events
            </Link>
            <Link to={IMPACT_NAV_FOOTER.ctaHref} className="rounded-lg bg-gold px-5 py-3 text-sm font-semibold text-charcoal hover:bg-gold/90">
              {IMPACT_CTAS.friend}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
