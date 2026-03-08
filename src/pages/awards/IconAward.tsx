import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardHeroSection } from "@/components/awards/AwardHeroSection";
import { AwardCategoriesGrid } from "@/components/awards/AwardCategoriesGrid";

import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";

import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Award, Globe, Heart, Star, Trophy, Users, Shield, Clock, BookOpen } from "lucide-react";

const iconTVShow = getTVShowByAward("icon");

const subcategories = [
  {
    title: "Africa Education Icon",
    description: "3 Icons living and working in Africa who have dedicated 20+ years to transforming education on the continent through direct impact, policy, or institutional leadership.",
    icon: Globe,
    count: 3,
    examples: "School founders, education ministers, university chancellors, community education pioneers across African nations.",
  },
  {
    title: "Diaspora Education Icon",
    description: "3 Africans in the diaspora who have achieved lasting education impact in Africa through activities, funding, mentorship, and institutional support from abroad.",
    icon: Users,
    count: 3,
    examples: "Diaspora professionals funding schools, running scholarship programmes, building ed-tech platforms, or leading NGOs serving African learners.",
  },
  {
    title: "Friends of Africa Education Icon",
    description: "3 non-African individuals who have achieved lasting education impact in Africa through activities, partnerships, philanthropy, and sustained institutional support.",
    icon: Heart,
    count: 3,
    examples: "International philanthropists, development partners, global education advocates who have invested 20+ years in African education systems.",
  },
];

export default function IconAward() {
  return (
    <>
      <Helmet>
        <title>Africa Education Icon Award | NESA-Africa Lifetime Achievement</title>
        <meta
          name="description"
          content="The Africa Education Icon Award honors 9 individuals with lifetime contributions to education transformation across Africa — 3 Africa, 3 Diaspora, 3 Friends of Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-20">
          <Breadcrumbs 
            items={[
              { label: "Awards", href: "/categories" },
              { label: "Icon Award" },
            ]}
            className="text-ivory/60"
          />
        </div>

        {/* Hero */}
        <AwardHeroSection
          variant="icon"
          title="Africa Education"
          titleAccent="Icon Blue Garnet"
          description="Honouring 9 exceptional individuals who have shaped education across Africa over 20+ continuous years. A once-in-a-lifetime award — 3 Africa Icons, 3 Diaspora Icons, 3 Friends of Africa Icons."
          features={["9 Icons total", "Once-in-a-lifetime honour", "20+ years documented impact"]}
          primaryAction={{
            label: "Nominate an Icon",
            href: "/nominate",
            icon: Award,
          }}
          secondaryAction={{
            label: "Icon Show: 28 Mar 2026",
          }}
        />

        {/* Once-in-a-Lifetime Explainer */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center mb-12">
              <Badge variant="outline" className="border-gold/40 text-gold mb-4 px-4 py-1.5">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Once Every 20 Years
              </Badge>
              <h2 className="mb-4 font-display text-3xl font-bold text-white">
                A Lifetime Honour — Not a Repeat Award
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                The Africa Education Icon Award is conferred once in a lifetime. Recipients are evaluated on 
                a minimum of 10 years of documented activities, with profiles spanning up to 20 years of 
                sustained contribution. This is embedded in the EDI Matrix as the highest tier of recognition.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-charcoal-light rounded-xl p-6 border border-gold/20 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                  <Clock className="h-6 w-6 text-gold" />
                </div>
                <h4 className="text-white font-semibold mb-2">20-Year Cycle</h4>
                <p className="text-white/60 text-sm">Award is conferred once every 20 years per individual — a true once-in-a-lifetime recognition.</p>
              </div>
              <div className="bg-charcoal-light rounded-xl p-6 border border-gold/20 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                  <BookOpen className="h-6 w-6 text-gold" />
                </div>
                <h4 className="text-white font-semibold mb-2">10-Year Profile</h4>
                <p className="text-white/60 text-sm">A minimum of 10 years of documented education activities is used as part of the EDI Matrix evaluation.</p>
              </div>
              <div className="bg-charcoal-light rounded-xl p-6 border border-gold/20 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <h4 className="text-white font-semibold mb-2">EDI Matrix Verified</h4>
                <p className="text-white/60 text-sm">The 10-year activity profile is independently verified through the Education Development Index framework.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories — 3+3+3 = 9 Icons */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="border-purple-500/40 text-purple-400 mb-4 px-4 py-1.5">
                <Star className="h-3.5 w-3.5 mr-1.5" />
                3 + 3 + 3 = 9 Icons
              </Badge>
              <h2 className="mb-3 font-display text-3xl font-bold text-white">
                Three Pathways to Icon Status
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Each pathway honours 3 Icons per season — individuals whose 20+ year legacy has reshaped African education.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {subcategories.map((cat, i) => (
                <div
                  key={cat.title}
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-purple-500/10 via-charcoal-light to-charcoal overflow-hidden transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  {/* Number accent */}
                  <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/15 border border-purple-500/30">
                    <span className="text-lg font-bold text-purple-400">{cat.count}</span>
                  </div>

                  <div className="p-6 pt-8">
                    {/* Icon */}
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-gold/10 border border-purple-500/20">
                      <cat.icon className="h-7 w-7 text-purple-400 group-hover:text-gold transition-colors" />
                    </div>

                    {/* Title & description */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gold transition-colors">{cat.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-5">{cat.description}</p>

                    {/* Divider */}
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">Example profiles</p>
                      <p className="text-xs text-white/50 leading-relaxed">{cat.examples}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Criteria */}
        <section className="bg-charcoal/95 py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center font-display text-3xl font-bold text-white">
                Selection Criteria
              </h2>
              <div className="space-y-4">
                {[
                  "Minimum 20 years of documented contribution to education",
                  "10-year activity profile evaluated via the EDI Matrix",
                  "Demonstrated impact at national or continental level",
                  "Innovation or pioneering work in education sector",
                  "Mentorship and development of other education leaders",
                  "Advocacy for Education for All principles",
                  "Once-in-a-lifetime award — not repeatable for the same individual",
                ].map((criterion, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-white/5 p-4">
                    <Trophy className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                    <span className="text-white/80">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TV Show Section */}
        {iconTVShow && <AwardTVShowSection show={iconTVShow} accentColor="gold" />}

        {/* Award Subcategories */}
        <AwardCategoriesGrid 
          tier="icon"
          accentColor="purple"
          title="Icon Award Subcategories"
          description="3 subcategories recognising distinct dimensions of lifetime contribution to African education."
        />

        {/* Certificate Gallery */}
        <CertificateGallery tier="icon" />

        {/* CTA */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Know an Education Icon?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Help us recognize the legends who have dedicated their lives to African education — whether living in Africa, in the diaspora, or as friends of Africa.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground">
              <Link to="/nominate">Submit a Nomination</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
