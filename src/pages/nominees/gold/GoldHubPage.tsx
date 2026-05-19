import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Trophy, Globe, Users, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GOLD_CATEGORIES } from "@/data/goldSpecialRecognition";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";

const HERO_STATS = [
  { icon: Trophy, label: "3 Recognition Categories" },
  { icon: Globe, label: "Africa-wide Participation" },
  { icon: Vote, label: "Public Voting Enabled" },
  { icon: Sparkles, label: "Cultural Impact Recognition" },
];

export default function GoldHubPage() {
  const canonical = "https://nesaafrica.lovable.app/nominees/gold-special-recognition";
  const totalNominees = GOLD_CATEGORIES.reduce((sum, c) => sum + c.nominees.length, 0);

  return (
    <>
      <Helmet>
        <title>Gold Special Recognition Nominees | NESA Africa 2026</title>
        <meta
          name="description"
          content="Explore Gold Special Recognition nominees in sports, music, and social media who are advancing education advocacy and impact across Africa."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Gold Special Recognition — NESA Africa 2026" />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Gold Special Recognition Nominees",
            url: canonical,
            mainEntity: { "@type": "ItemList", numberOfItems: totalNominees },
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal min-h-screen py-10 md:py-14">
        <div className="container">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: "Gold Special Recognition" },
            ]}
          />

          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-charcoal-light via-charcoal to-charcoal mb-8 shadow-[0_0_80px_-20px_rgba(212,175,55,0.35)]"
          >
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[44rem] h-[44rem] bg-gold/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
            </div>
            <div className="absolute inset-3 rounded-2xl border border-gold/10 pointer-events-none" />

            <div className="relative px-6 py-12 md:px-10 md:py-16 text-center flex flex-col items-center">
              <div className="mb-5 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/40 shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)]">
                <Sparkles className="w-10 h-10 text-gold" />
              </div>
              <Badge className="mb-4 bg-gold/15 text-gold border-gold/30 uppercase tracking-[0.2em] text-[10px] px-3 py-1">
                <Trophy className="w-3 h-3 mr-1.5" /> 2026 Edition
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-ivory mb-4 leading-[1.1] max-w-4xl">
                Gold Special Recognition
              </h1>
              <p className="text-ivory/70 max-w-2xl text-base md:text-lg mb-7">
                Celebrating influential public figures, creatives, athletes, musicians, digital voices, and cultural leaders using their platforms to advance education awareness, advocacy, and impact across Africa.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 text-sm">
                {HERO_STATS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-ivory/85">
                    <s.icon className="w-4 h-4 text-gold" />
                    <span className="text-ivory/80">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <a href="#categories">
                  <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-7 gap-2 shadow-lg shadow-gold/20">
                    <Trophy className="w-4 h-4" /> Explore Gold Nominees
                  </Button>
                </a>
                <Link to="/nominate">
                  <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-7 gap-2 bg-charcoal/40 backdrop-blur">
                    Nominate a Candidate <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Category Navigation */}
          <div id="categories" className="scroll-mt-24">
            <div className="text-center mb-8">
              <Badge className="bg-gold/10 text-gold border-gold/30 mb-3 uppercase tracking-[0.18em] text-[10px]">
                Choose a Pathway
              </Badge>
              <h2 className="font-display text-2xl md:text-4xl font-bold text-ivory mb-3">
                Three Cultural Impact Categories
              </h2>
              <p className="text-ivory/60 max-w-2xl mx-auto text-sm md:text-base">
                Each pathway recognises leaders using their unique platform to move the needle on Education for All.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
              {GOLD_CATEGORIES.map((cat, i) => (
                <motion.article
                  key={cat.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-3xl border border-gold/20 bg-charcoal-light hover:border-gold/50 transition-all hover:shadow-[0_0_45px_-10px_rgba(212,175,55,0.4)]"
                >
                  {/* Banner image — first nominee */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={cat.nominees[0]?.image}
                      alt={cat.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light via-charcoal-light/30 to-transparent" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} mix-blend-overlay opacity-50`} />
                    <div className="absolute top-3 left-3 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-charcoal/80 backdrop-blur border border-gold/40">
                      <cat.icon className="w-5 h-5 text-gold" />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-gold text-charcoal border-0 font-bold text-[10px]">
                      {cat.nominees.length} Nominees
                    </Badge>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-ivory group-hover:text-gold transition-colors mb-2">
                      {cat.title}
                    </h3>
                    <p className="text-ivory/65 text-sm leading-relaxed mb-5 line-clamp-3">
                      {cat.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4 text-xs text-ivory/50">
                      <Users className="w-3.5 h-3.5 text-gold/70" />
                      <span>{cat.nominees.length} nominees · {cat.filters.length - 1} sub-tracks</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/nominees/gold-special-recognition/${cat.slug}`} className="flex-1">
                        <Button size="sm" className="w-full bg-gold hover:bg-gold/90 text-charcoal font-bold gap-1.5">
                          Explore Nominees <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link to={`/nominees/gold-special-recognition/${cat.slug}#vote`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full border-gold/40 text-gold hover:bg-gold/10 gap-1.5">
                          <Vote className="w-3.5 h-3.5" /> Vote Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-14 rounded-3xl border border-gold/20 bg-gradient-to-br from-charcoal-light to-charcoal p-8 md:p-12 text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-3">
              Know someone who deserves recognition?
            </h3>
            <p className="text-ivory/60 max-w-xl mx-auto mb-6">
              Submit a nominee championing education through sports, music, or social media.
            </p>
            <Link to="/nominate">
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-charcoal font-bold rounded-full px-8 gap-2">
                Nominate a Candidate <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
