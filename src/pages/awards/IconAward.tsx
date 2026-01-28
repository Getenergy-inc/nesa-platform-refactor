import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { AwardTVShowSection } from "@/components/awards/AwardTVShowSection";
import { AwardHeroSection } from "@/components/awards/AwardHeroSection";
import { getTVShowByAward } from "@/config/awardTVShows";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Globe, Heart, Star, Trophy, Users } from "lucide-react";

const iconTVShow = getTVShowByAward("icon");

const subcategories = [
  {
    title: "Africa Education Icon",
    description: "Lifetime achievement in education within the African continent.",
    icon: Globe,
    count: 3,
  },
  {
    title: "Diaspora Education Icon",
    description: "African diaspora members driving education transformation from abroad.",
    icon: Users,
    count: 3,
  },
  {
    title: "Friends of Africa Education Icon",
    description: "Non-African individuals with exceptional contributions to African education.",
    icon: Heart,
    count: 3,
  },
];

export default function IconAward() {
  return (
    <>
      <Helmet>
        <title>Africa Education Icon Award | NESA-Africa Lifetime Achievement</title>
        <meta
          name="description"
          content="The Africa Education Icon Award honors individuals with lifetime contributions to education transformation across Africa."
        />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        {/* Hero */}
        <AwardHeroSection
          variant="icon"
          title="Africa Education"
          titleAccent="Icon"
          description="Honouring 9 exceptional individuals who have shaped education across Africa over 10 continuous years of advocating education for all in Africa (2005–2025)."
          features={["3 Icons per subcategory", "Selected across Africa, Diaspora & Friends of Africa"]}
          primaryAction={{
            label: "Nominate an Icon",
            href: "/nominate",
            icon: Award,
          }}
          secondaryAction={{
            label: "Icon Show: 28 Mar 2026",
          }}
        />

        {/* Subcategories */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Three Icon Categories
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {subcategories.map((cat) => (
                <Card key={cat.title} className="border-white/10 bg-gradient-to-br from-gold/10 to-transparent">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                      <cat.icon className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-white">{cat.title}</CardTitle>
                    <CardDescription className="text-white/60">{cat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="border-gold/30 text-gold">
                      {cat.count} Icons per Season
                    </Badge>
                  </CardContent>
                </Card>
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
                  "Demonstrated impact at national or continental level",
                  "Innovation or pioneering work in education sector",
                  "Mentorship and development of other education leaders",
                  "Advocacy for Education for All principles",
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

        {/* Certificate Gallery */}
        <CertificateGallery />

        {/* CTA */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-white">
              Know an Education Icon?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-white/60">
              Help us recognize the legends who have dedicated their lives to African education.
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
