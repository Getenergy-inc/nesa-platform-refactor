import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, MapPin, Award, Share2, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NomineeAvatar } from "@/components/nominees/NomineeAvatar";
import {
  NGO_SUBCATEGORIES,
  getNGOBySlug,
  getNGOsByRegion,
  getNGORegionMeta,
  getNGOSubcategoryMeta,
} from "@/data/ngoEducationAfrica";

export default function NGONomineeProfile() {
  const { slug } = useParams<{ slug: string }>();
  const ngo = slug ? getNGOBySlug(slug) : undefined;

  if (!ngo) {
    return <Navigate to="/nominees/best-ngo-contribution-to-education" replace />;
  }

  const region = getNGORegionMeta(ngo.region);
  const sub = getNGOSubcategoryMeta(ngo.subcategory);
  const URL = `https://nesaafrica.lovable.app/nominees/best-ngo-contribution-to-education/profile/${ngo.slug}`;
  const related = getNGOsByRegion(ngo.region).filter((n) => n.slug !== ngo.slug).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{`${ngo.name} | Best NGO Contribution to Education Nominee | NESA Africa`}</title>
        <meta
          name="description"
          content={`Learn about ${ngo.name}, nominated for its contribution to education across Africa through ${sub.name.toLowerCase()}.`}
        />
        <link rel="canonical" href={URL} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: ngo.name,
          description: ngo.impactSummary,
          address: { "@type": "PostalAddress", addressCountry: ngo.country },
          url: URL,
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-charcoal text-foreground">
        <div className="container mx-auto px-4 py-10">
          <Button asChild variant="ghost" className="mb-6 text-white/70 hover:text-gold">
            <Link to={`/nominees/best-ngo-contribution-to-education/${ngo.region}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {region.name} NGOs
            </Link>
          </Button>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-[1fr_320px] gap-8 mb-12"
          >
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {ngo.verificationStatus === "verified" ? (
                  <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified Nominee
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                    Under Review
                  </Badge>
                )}
                <Badge variant="outline" className="border-gold/30 text-gold">
                  <Award className="mr-1 h-3 w-3" /> {sub.name}
                </Badge>
                <Badge variant="outline" className="border-gold/30 text-gold">
                  <MapPin className="mr-1 h-3 w-3" /> {ngo.country}
                </Badge>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
                {ngo.name}
              </h1>
              <p className="text-lg text-white/70 mb-6">{ngo.impactSummary}</p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-gold text-black hover:bg-gold/90">
                  <Heart className="mr-2 h-4 w-4" /> Learn More
                </Button>
                <Button size="lg" variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <Share2 className="mr-2 h-4 w-4" /> Share Profile
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative h-56 w-full overflow-hidden rounded-2xl ring-1 ring-gold/20 shadow-[0_10px_40px_-12px_hsl(42_85%_52%/0.35)]">
                <NomineeAvatar
                  name={ngo.name}
                  src={ngo.logoUrl || ngo.imageUrl}
                  kind="organization"
                  shape="square"
                  context={`${region.name} · ${ngo.country}`}
                />
              </div>
              <Card className="border-gold/10 bg-white/5 p-6 h-fit">
                <h3 className="font-serif text-sm uppercase tracking-wide text-gold mb-4">
                  At a Glance
                </h3>
                <dl className="space-y-3 text-sm">
                  <Row k="Organisation" v={ngo.organizationType} />
                  <Row k="Country" v={ngo.country} />
                  <Row k="Region" v={region.name} />
                  <Row k="Impact Pillar" v={sub.name} />
                  <Row k="Nomination Year" v={String(ngo.nominationYear)} />
                  <Row k="Status" v={ngo.verificationStatus} />
                </dl>
              </Card>
            </div>
          </motion.div>

          {/* Impact story */}
          <section className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-gold/10 bg-white/5 p-6">
              <h2 className="font-serif text-xl font-bold text-white mb-3">Impact Story</h2>
              <p className="text-white/70">{ngo.educationContribution}</p>
            </Card>
            <Card className="border-gold/10 bg-white/5 p-6">
              <h2 className="font-serif text-xl font-bold text-white mb-3">Why It Matters</h2>
              <p className="text-white/70">{sub.description}</p>
              {ngo.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {ngo.tags.map((t) => (
                    <Badge key={t} variant="outline" className="border-gold/30 text-gold/80 text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          </section>

          {/* Migration metadata */}
          {ngo.previousCategories.length > 0 && (
            <Card className="border-gold/10 bg-white/5 p-6 mb-12">
              <h3 className="font-serif text-sm uppercase tracking-wide text-gold mb-3">
                Nominee Lineage
              </h3>
              <p className="text-sm text-white/60 mb-2">
                Migrated from: {ngo.previousCategories.join(", ")}
              </p>
              {ngo.previousSubcategories.length > 0 && (
                <p className="text-sm text-white/60">
                  Legacy subcategory: {ngo.previousSubcategories.join(" · ")}
                </p>
              )}
            </Card>
          )}

          {/* Related */}
          {related.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold text-white mb-5">
                Other NGOs in {region.name}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((n) => (
                  <Link
                    key={n.id}
                    to={`/nominees/best-ngo-contribution-to-education/profile/${n.slug}`}
                  >
                    <Card className="group h-full overflow-hidden border-gold/10 bg-white/5 hover:border-gold/40 transition">
                      <div className="relative h-32">
                        <NomineeAvatar
                          name={n.name}
                          src={n.logoUrl || n.imageUrl}
                          kind="organization"
                          shape="square"
                          interactive
                        />
                      </div>
                      <div className="p-5">
                        <Badge variant="outline" className="mb-2 border-gold/30 text-gold text-xs">
                          {NGO_SUBCATEGORIES.find((s) => s.slug === n.subcategory)?.name}
                        </Badge>
                        <h3 className="font-serif text-lg font-bold text-white mb-1">{n.name}</h3>
                        <p className="text-xs text-white/50 mb-2">{n.country}</p>
                        <p className="text-sm text-white/70 line-clamp-2">{n.impactSummary}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/5 pb-2 last:border-0">
      <dt className="text-white/50">{k}</dt>
      <dd className="text-white text-right capitalize">{v}</dd>
    </div>
  );
}
