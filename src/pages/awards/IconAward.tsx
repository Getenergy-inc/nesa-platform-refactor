import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { NESAHeader } from "@/components/nesa/NESAHeader";
import { NESAFooter } from "@/components/nesa/NESAFooter";
import { CertificateGallery } from "@/components/nesa/CertificateGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Award, Globe, Heart, Star, Trophy, Users } from "lucide-react";

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
        <NESAHeader />

        {/* Hero */}
        <section className="relative bg-gradient-to-b from-charcoal to-charcoal/95 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <Link
              to="/categories"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Link>
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-blue-500/20 text-blue-400">Lifetime Achievement</Badge>
              <h1 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl">
                Africa <span className="text-blue-400">Education Icon</span> Award
              </h1>
              <p className="mb-8 text-lg text-white/70">
                The highest personal honour recognizing individuals with exceptional lifetime
                contributions to education transformation across Africa and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground">
                  <Link to="/nominate">
                    <Star className="mr-2 h-5 w-5" />
                    Nominate an Icon
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-charcoal/95 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-3xl gap-8 text-center md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold text-blue-400">9</div>
                <div className="text-white/60">Icons per Season</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-blue-400">3</div>
                <div className="text-white/60">Subcategories</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold text-blue-400">Lifetime</div>
                <div className="text-white/60">Recognition</div>
              </div>
            </div>
          </div>
        </section>

        {/* Subcategories */}
        <section className="bg-charcoal py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center font-display text-3xl font-bold text-white">
              Three Icon Categories
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {subcategories.map((cat) => (
                <Card key={cat.title} className="border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                      <cat.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-white">{cat.title}</CardTitle>
                    <CardDescription className="text-white/60">{cat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">
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
                    <Trophy className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
                    <span className="text-white/80">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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

        <NESAFooter />
      </div>
    </>
  );
}
