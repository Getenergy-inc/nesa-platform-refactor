import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, Trophy, Users, Sparkles, Award, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { getRegionHubBySlug, REGION_HUBS } from "@/config/regionHubs";
import { RegionLegacySection } from "@/components/region/RegionLegacySection";
import { FeaturedNomineesBlock } from "@/components/nominees/FeaturedNomineesBlock";
import { trackEvent } from "@/lib/analytics";

const LEGACY_SLUG_MAP: Record<string, string> = {
  "west-africa": "west-africa",
  "east-africa": "east-africa",
  "central-africa": "central-africa",
  "southern-africa": "southern-africa",
  "north-africa": "north-africa",
  "indian-ocean-islands": "indian-ocean-islands",
  "diaspora": "diaspora",
  "friends-of-africa": "friends-of-africa",
  "sahel": "west-africa",
  "horn-of-africa": "east-africa",
};

const regionImages: Record<string, string> = {};
const imageModules = import.meta.glob("@/assets/regions/*.jpg", { eager: true, import: "default" }) as Record<string, string>;
Object.entries(imageModules).forEach(([path, url]) => {
  const filename = path.split("/").pop()?.replace(".jpg", "") || "";
  regionImages[filename] = url;
});

export function AwardsRegionPage() {
  const { slug } = useParams<{ slug: string }>();
  const hub = slug ? getRegionHubBySlug(slug) : undefined;

  if (slug && !hub) {
    return <Navigate to="/awards" replace />;
  }
  if (!hub) return null;

  const heroImg = regionImages[hub.heroImage] || "";
  const track = (cta_label: string, destination: string) =>
    trackEvent("awards_region_cta_click", {
      region_slug: hub.slug,
      region_name: hub.name,
      cta_label,
      destination,
      page: `/awards/regions/${hub.slug}`,
    });

  const recognitionPillars = [
    { icon: Trophy, title: "Award Subcategories", body: `Nominees from ${hub.shortName} compete across Blue Garnet, Platinum, Africa Education Icon, and Influencers Education Impact tracks.` },
    { icon: Award, title: "Regional Excellence", body: `Recognising educators, institutions, and innovators who have transformed learning outcomes in ${hub.name}.` },
    { icon: Sparkles, title: "Cultural Impact", body: `${hub.tagline}. Each nominee contributes to Africa's continental learning story.` },
    { icon: Globe2, title: "Continental Reach", body: `${hub.countries.length} ${hub.countries.length === 1 ? "territory" : "countries / territories"} represented in this region's awards pipeline.` },
  ];

  return (
    <>
      <Helmet>
        <title>{`${hub.name} Awards & Nominees | NESA-Africa 2026`}</title>
        <meta name="description" content={`Explore NESA-Africa 2026 nominees, award subcategories and regional education impact across ${hub.name}. ${hub.tagline}.`} />
        <link rel="canonical" href={`https://nesa.africa/awards/regions/${hub.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <NESAHeader />

        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            {heroImg && <img src={heroImg} alt={`${hub.name} education and culture`} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />
          </div>

          <div className="container relative z-10 pb-16 pt-32 max-w-6xl mx-auto px-4">
            <Link
              to="/awards"
              onClick={() => track("Back to Awards", "/awards")}
              className="inline-flex items-center gap-2 text-ivory/70 hover:text-gold text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Awards
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-semibold mb-4 tracking-widest uppercase">
                NESA-Africa 2026 · {hub.shortName} Region
              </span>
              <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-ivory mb-4 leading-tight">
                {hub.name} <span className="text-gold">Awards & Nominees</span>
              </h1>
              <p className="text-xl md:text-2xl text-gold/90 font-medium mb-4">{hub.tagline}</p>
              <p className="text-ivory/80 text-base md:text-lg max-w-3xl leading-relaxed">{hub.description}</p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button asChild className="rounded-full bg-gold hover:bg-gold-dark text-charcoal font-semibold gap-2">
                  <Link to={`/nominees?region=${hub.slug}`} onClick={() => track("View All Nominees", `/nominees?region=${hub.slug}`)}>
                    View All {hub.shortName} Nominees <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-gold/40 text-gold hover:bg-gold/10 gap-2">
                  <Link to={`/nominate?region=${hub.slug}`} onClick={() => track("Nominate from Region", `/nominate?region=${hub.slug}`)}>
                    Nominate from {hub.shortName} <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Countries strip */}
        <section className="py-8 border-y border-gold/10 bg-charcoal-light/30">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-xs font-semibold text-ivory/60 uppercase tracking-widest mb-3">Eligible Territories</h2>
            <div className="flex flex-wrap gap-2">
              {hub.countries.map(c => (
                <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal-light/60 border border-gold/15 rounded-full text-ivory/80 text-sm">
                  <MapPin className="w-3 h-3 text-gold" /> {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recognition pillars */}
        <section className="py-16 md:py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold text-ivory mb-3">
                Recognition Across <span className="text-gold">{hub.shortName}</span>
              </h2>
              <p className="text-ivory/70 max-w-2xl mx-auto">
                How NESA-Africa 2026 recognises and elevates education champions from this region.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recognitionPillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-charcoal-light/60 border border-gold/15 rounded-xl p-6 hover:border-gold/40 hover:bg-gold/5 transition-all"
                >
                  <p.icon className="w-7 h-7 text-gold mb-3" />
                  <h3 className="text-ivory font-semibold mb-2">{p.title}</h3>
                  <p className="text-ivory/70 text-sm leading-relaxed">{p.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Nominees in this region */}
        <section className="py-12 bg-charcoal-light/20 border-y border-gold/10">
          <div className="container max-w-6xl mx-auto px-4">
            <FeaturedNomineesBlock
              title={`Featured Nominees from ${hub.name}`}
              subtitle="Approved education changemakers competing for NESA-Africa 2026 recognition."
              region={hub.name}
              limit={6}
              viewAllHref={`/nominees?region=${hub.slug}`}
            />
          </div>
        </section>

        {/* Regional impact / legacy */}
        <RegionLegacySection slug={LEGACY_SLUG_MAP[hub.slug] ?? hub.slug} />

        {/* Award pathways shortcut */}
        <section className="py-16 md:py-20">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-ivory text-center mb-8">
              Explore Award Subcategories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Blue Garnet Awards", to: "/awards/blue-garnet-categories" },
                { label: "Platinum Recognition", to: "/awards/platinum-certificate-categories" },
                { label: "Africa Education Icon", to: "/awards/africa-education-icon" },
                { label: "Influencers Education Impact", to: "/awards/influencers-education-impact" },
              ].map(a => (
                <Link
                  key={a.label}
                  to={a.to}
                  onClick={() => track(a.label, a.to)}
                  className="rounded-lg border border-gold/20 bg-charcoal-light/60 px-4 py-4 text-sm text-ivory/85 hover:text-gold hover:border-gold/50 hover:bg-gold/5 transition-colors text-center font-medium"
                >
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-charcoal to-charcoal-light/40 border-t border-gold/10">
          <div className="container max-w-3xl mx-auto px-4 text-center">
            <Users className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-ivory mb-4">
              Know an Education Champion in {hub.shortName === "Friends" ? "Friends of Africa" : hub.name}?
            </h2>
            <p className="text-ivory/70 mb-8 max-w-xl mx-auto">
              Submit a nomination, endorse a champion, or partner with NESA-Africa to expand recognition across this region.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="rounded-full bg-gold hover:bg-gold-dark text-charcoal font-semibold gap-2 px-8 py-3">
                <Link to="/nominate" onClick={() => track("Nominate Now", "/nominate")}>
                  Nominate Now <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-gold/30 text-gold hover:bg-gold/10 px-8 py-3 gap-2">
                <Link to={`/region/${hub.slug}`} onClick={() => track("Cultural Profile", `/region/${hub.slug}`)}>
                  Cultural Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Other regions */}
        <section className="py-14 border-t border-gold/10">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-sm font-semibold text-ivory/60 uppercase tracking-widest mb-5 text-center">
              Explore Other Regions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {REGION_HUBS.filter(r => r.slug !== hub.slug).map(region => (
                <Link
                  key={region.slug}
                  to={`/awards/regions/${region.slug}`}
                  onClick={() => track(`Switch to ${region.shortName}`, `/awards/regions/${region.slug}`)}
                  className="group bg-charcoal-light/60 border border-gold/10 rounded-lg p-3 text-center hover:bg-gold/10 hover:border-gold/40 transition-all"
                >
                  <p className="text-ivory/80 group-hover:text-ivory text-sm font-medium">{region.shortName}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <NESAFooter />
      </div>
    </>
  );
}

export default AwardsRegionPage;
