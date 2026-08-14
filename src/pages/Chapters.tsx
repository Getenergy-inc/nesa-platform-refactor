import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Users, 
  Globe2, 
  ArrowRight,
  Flag,
  CheckCircle,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  listAfricaRegions,
  AFRICAN_DIASPORA_SLUG,
  REGIONAL_TAGLINE,
  REGION_STATS,
} from "@/config/regions/africaRegions";
import { useChapterRegionCounts } from "@/hooks/useChapterRegionCounts";

/**
 * Canonical 8 Africa regions (+ the African Diaspora community) come from the
 * single source of truth in src/config/regions/africaRegions.ts.
 * Chapter counts are read live from the database — never hardcoded.
 */
const AFRICA_REGION_LIST = listAfricaRegions();

const chapterBenefits = [
  "Lead nominations in your country",
  "Host regional recognition events",
  "Build local educator networks",
  "Access exclusive training programs",
  "Represent NESA at national forums",
  "Coordinate with Ministry of Education"
];

const chapterRoles = [
  {
    title: "Chapter Lead",
    description: "Overall leadership and strategic direction for the country chapter",
    requirements: ["10+ years in education sector", "Strong network", "Leadership experience"]
  },
  {
    title: "Nominations Coordinator",
    description: "Manage nomination outreach and submission quality in your region",
    requirements: ["5+ years experience", "Attention to detail", "Communication skills"]
  },
  {
    title: "Events Manager",
    description: "Organize local ceremonies, workshops, and educator gatherings",
    requirements: ["Event planning experience", "Vendor management", "Budget oversight"]
  },
  {
    title: "Communications Lead",
    description: "Handle media relations, social media, and stakeholder communications",
    requirements: ["PR/Communications background", "Writing skills", "Media contacts"]
  }
];

export default function Chapters() {
  const { bySlug, total, loading } = useChapterRegionCounts();
  const diasporaChapters = bySlug[AFRICAN_DIASPORA_SLUG] ?? bySlug["diaspora"] ?? 0;

  return (
    <div className="min-h-screen bg-charcoal text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(196,160,82,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
              Friends of EduAid-Africa · SCEF International Chapters
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Friends of EduAid-Africa <span className="text-gold">International Chapters</span>
            </h1>
            <p className="text-lg text-white/70 mb-4">
              The international chapters of the <span className="text-gold">Santos Creations
              Educational Foundation (SCEF)</span> — the institution behind EduAid-Africa and
              NESA-Africa.
            </p>
            <p className="text-xl text-white/70 mb-8">
              {REGIONAL_TAGLINE} Chapters organise across the eight Africa regions and the
              African Diaspora community, mobilising Friends of EduAid-Africa to fund, verify and
              celebrate the Education Enablers advancing Education for All.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold" asChild>
                <Link to="/contact">
                  <Flag className="w-5 h-5 mr-2" />
                  Start a Chapter
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10" asChild>
                <Link to="/impact/friends-of-eduaid-africa">
                  Join Friends of EduAid-Africa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="py-12 border-y border-gold/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-gold">
                {loading ? "—" : total}
              </p>
              <p className="text-white/60">Active Chapters</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gold">{REGION_STATS.africaRegions}</p>
              <p className="text-white/60">Africa Regions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gold">1</p>
              <p className="text-white/60">Diaspora Community</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gold">{REGION_STATS.totalCountries}</p>
              <p className="text-white/60">Countries Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCEF institutional band */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl border border-gold/20 bg-charcoal-light p-8">
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              One Foundation, <span className="text-gold">One Global Chapter Network</span>
            </h2>
            <p className="text-white/70 mb-4">
              Every chapter listed here is an international chapter of the Santos Creations
              Educational Foundation (SCEF). Members serve as <span className="text-gold">Friends of
              EduAid-Africa</span>: they raise and steward EduAid-Africa support, host local
              education dialogues, and surface credible Education Enablers into the NESA-Africa
              recognition pipeline.
            </p>
            <ul className="grid sm:grid-cols-3 gap-3 text-sm text-white/70">
              <li className="rounded-lg border border-gold/10 p-3">
                <span className="block text-gold font-semibold mb-1">SCEF</span>
                Institutional owner and governance body of the chapter network.
              </li>
              <li className="rounded-lg border border-gold/10 p-3">
                <span className="block text-gold font-semibold mb-1">EduAid-Africa</span>
                The programme infrastructure chapters fund and deliver locally.
              </li>
              <li className="rounded-lg border border-gold/10 p-3">
                <span className="block text-gold font-semibold mb-1">NESA-Africa</span>
                The recognition cycle chapters mobilise their communities around.
              </li>
            </ul>
            <div className="mt-6">
              <Link
                to="/impact/friends-of-eduaid-africa"
                className="inline-flex items-center text-gold hover:underline"
              >
                Learn about Friends of EduAid-Africa
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Eight Africa Regions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white">
              Chapters Across the <span className="text-gold">Eight Africa Regions</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mt-3">
              Every African country belongs to exactly one of the eight canonical regions.
              Chapter counts below are live from the SCEF chapter register.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AFRICA_REGION_LIST.map((region) => {
              const count = bySlug[region.slug] ?? 0;
              return (
                <Card
                  key={region.code}
                  className="bg-charcoal-light border-gold/10 hover:border-gold/30 transition-all hover:shadow-[0_0_20px_rgba(196,160,82,0.1)]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-xs font-semibold text-gold">
                        {region.order}
                      </span>
                      <CardTitle className="text-white text-lg">{region.name}</CardTitle>
                    </div>
                    <Badge className="w-fit bg-gold/20 text-gold border-gold/30">
                      {loading
                        ? "Loading chapters…"
                        : count === 0
                          ? "Chapter forming"
                          : `${count} Active ${count === 1 ? "Chapter" : "Chapters"}`}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/60 mb-4">{region.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {region.countries.map((country) => (
                        <Badge
                          key={country}
                          variant="outline"
                          className="text-xs border-white/20 text-white/70"
                        >
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* The African Diaspora community sits alongside — not inside — the 8 regions */}
          <Card className="mt-6 bg-charcoal-light border-gold/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Globe2 className="h-6 w-6 text-gold" />
                <CardTitle className="text-white text-lg">African Diaspora Community</CardTitle>
              </div>
              <Badge className="w-fit bg-gold/20 text-gold border-gold/30">
                {loading
                  ? "Loading chapters…"
                  : diasporaChapters === 0
                    ? "Chapter forming"
                    : `${diasporaChapters} Active ${diasporaChapters === 1 ? "Chapter" : "Chapters"}`}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60">
                Africans and Friends of EduAid-Africa outside the continent organise as one
                global SCEF chapter community alongside the eight Africa regions — not as a
                ninth region.

              </p>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* Chapter Roles */}
      <section className="py-16 border-y border-gold/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4 text-white">Chapter Leadership Roles</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Join the leadership team driving education enablers in your country
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {chapterRoles.map((role, index) => (
              <Card key={index} className="bg-charcoal-light border-gold/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-gold" />
                    {role.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 mb-4">{role.description}</p>
                  <div className="space-y-2">
                    {role.requirements.map((req, reqIndex) => (
                      <div key={reqIndex} className="flex items-center gap-2 text-sm text-white/80">
                        <CheckCircle className="w-4 h-4 text-gold" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-4 text-white">Chapter Benefits</h2>
              <p className="text-white/60">
                As a chapter leader, you'll have the opportunity to shape education recognition in your country
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {chapterBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-charcoal-light border border-gold/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-white/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gold/10 bg-gradient-to-r from-gold/5 to-gold/10">
        <div className="container mx-auto px-4 text-center">
          <Globe2 className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-4 text-white">Ready to Lead in Your Country?</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Whether you want to start a new chapter or join an existing one, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-semibold">
                Apply to Lead a Chapter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
              <Mail className="w-5 h-5 mr-2" />
              Contact Regional Lead
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
