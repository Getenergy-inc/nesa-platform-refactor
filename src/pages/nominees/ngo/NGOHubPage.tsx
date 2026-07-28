import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Award, MapPin, Users, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import {
  NGO_NOMINEES,
  NGO_REGIONS,
  NGO_SUBCATEGORIES,
  getNGOStats,
  getNGOsByRegion,
} from "@/data/ngoEducationAfrica";

const URL = "https://nesaafrica.lovable.app/nominees/best-ngo-contribution-to-education";

export default function NGOHubPage() {
  const stats = getNGOStats();
  const featured = NGO_NOMINEES.filter((n) => n.verificationStatus === "verified").slice(0, 6);

  return (
    <>
      <Helmet>
        <title>Best NGO Contribution to Education Nominees | NESA Africa</title>
        <meta
          name="description"
          content="Explore NGOs across Africa recognised for education infrastructure, teacher and student support, learning aid, and youth and girls' empowerment."
        />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Best NGO Contribution to Education Nominees | NESA Africa" />
        <meta property="og:url" content={URL} />
      </Helmet>

      <div className="min-h-screen bg-charcoal text-foreground">
        {/* Hero */}
        <section className="border-b border-gold/10 bg-gradient-to-b from-black to-charcoal">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-gold/15 text-gold border-gold/30">
                <Award className="mr-1.5 h-3.5 w-3.5" /> 5-Africa Regional Award
              </Badge>
              <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                Best NGO Contribution to Education
              </h1>
              <p className="text-lg md:text-xl text-white/70 mb-8">
                Honouring NGOs driving education infrastructure, teacher and student support,
                educational aid, and youth and girls' empowerment across Africa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-gold text-black hover:bg-gold/90">
                  <Link to="/awards/gold-blue-garnet">Learn More</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Link to="/nominate?category=best-ngo-for-education-advancement-africa-regional">Nominate an NGO</Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total NGOs", value: stats.total, icon: Users },
                { label: "Regions", value: 5, icon: MapPin },
                { label: "Impact Pillars", value: 3, icon: Sparkles },
                { label: "Verified", value: stats.verified, icon: ShieldCheck },
              ].map((s) => (
                <Card key={s.label} className="border-gold/10 bg-white/5 p-5">
                  <s.icon className="mb-2 h-5 w-5 text-gold" />
                  <div className="font-serif text-3xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-white/60">{s.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact pillars */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-serif text-3xl font-bold text-white mb-2">Three Impact Pillars</h2>
          <p className="text-white/60 mb-8 max-w-2xl">
            Every NGO nominee is classified into one of three impact pillars based on its primary
            education contribution.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {NGO_SUBCATEGORIES.map((sub) => {
              const count = stats.bySubcategory[sub.slug];
              return (
                <Card key={sub.slug} className="border-gold/10 bg-white/5 p-6 hover:bg-white/[0.07] transition">
                  <Badge className="mb-3 bg-gold/15 text-gold border-gold/30">
                    {count} NGOs
                  </Badge>
                  <h3 className="font-serif text-xl font-bold text-white mb-2">{sub.name}</h3>
                  <p className="text-sm text-white/60">{sub.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Regions */}
        <section className="border-t border-gold/10 bg-black/30">
          <div className="container mx-auto px-4 py-16">
            <h2 className="font-serif text-3xl font-bold text-white mb-2">Explore by Region</h2>
            <p className="text-white/60 mb-8 max-w-2xl">
              NGO nominees are organised across the 8 African regions. Click into any region to
              browse by impact pillar.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {NGO_REGIONS.map((r) => {
                const count = getNGOsByRegion(r.slug).length;
                return (
                  <Link key={r.slug} to={`/nominees/best-ngo-contribution-to-education/${r.slug}`}>
                    <Card className="group h-full border-gold/10 bg-white/5 p-6 hover:border-gold/40 hover:bg-white/[0.08] transition">
                      <div className="flex items-start justify-between mb-3">
                        <MapPin className="h-6 w-6 text-gold" />
                        <Badge variant="outline" className="border-gold/30 text-gold">
                          {count} {count === 1 ? "NGO" : "NGOs"}
                        </Badge>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-white mb-1">{r.name}</h3>
                      <p className="text-xs text-white/50 line-clamp-2">{r.countries.slice(0, 5).join(" • ")}…</p>
                      <div className="mt-4 flex items-center text-sm text-gold group-hover:translate-x-1 transition">
                        View nominees <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="font-serif text-3xl font-bold text-white mb-2">Featured Verified NGOs</h2>
          <p className="text-white/60 mb-8">Pre-verified from the 2025 nominee dataset.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((n) => (
              <NGOCardMini key={n.id} nominee={n} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function NGOCardMini({ nominee }: { nominee: typeof NGO_NOMINEES[number] }) {
  return (
    <Link to={`/nominees/best-ngo-contribution-to-education/profile/${nominee.slug}`}>
      <Card className="group h-full overflow-hidden border-gold/10 bg-white/5 hover:border-gold/40 transition flex flex-col">
        <div className="relative h-36">
          <NomineeAvatar
            name={nominee.name}
            src={nominee.logoUrl || nominee.imageUrl}
            kind="organization"
            shape="square"
            interactive
            context={nominee.country}
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/40 backdrop-blur-sm">
              <ShieldCheck className="mr-1 h-3 w-3" /> Verified
            </Badge>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-gold transition">
            {nominee.name}
          </h3>
          <p className="text-xs text-white/50 mb-3">
            {nominee.country} · {nominee.region.replace("-", " ")}
          </p>
          <p className="text-sm text-white/70 line-clamp-3">{nominee.impactSummary}</p>
        </div>
      </Card>
    </Link>
  );
}
