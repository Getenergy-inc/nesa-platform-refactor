import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronRight, Share2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NomineeBreadcrumbs } from "@/components/nominees/NomineeBreadcrumbs";
import { getGoldNominee, getGoldCategory } from "@/data/goldSpecialRecognition";
import { useResolveNomineeMedia } from "@/hooks/useNomineeMedia";
import { HonoureeImage } from "@/components/honourees/HonoureeImage";
import { NomineeProfileGovernance } from "@/components/nominees/NomineeProfileGovernance";

export default function GoldNomineeProfilePage() {
  const { categorySlug, nomineeSlug } = useParams<{ categorySlug: string; nomineeSlug: string }>();
  const data = categorySlug && nomineeSlug ? getGoldNominee(categorySlug, nomineeSlug) : null;
  const resolveMedia = useResolveNomineeMedia();

  if (!data) return <Navigate to={`/nominees/gold-special-recognition/${categorySlug ?? ""}`} replace />;

  const { category, nominee } = data;
  const media = resolveMedia(nominee.slug, nominee.image, nominee.name);
  const heroImage = media.image ?? nominee.image;
  const ogImage = media.og ?? heroImage;
  const imageAlt = media.alt ?? nominee.name;
  const canonical = `https://nesaafrica.lovable.app/nominees/gold-special-recognition/${category.slug}/${nominee.slug}`;
  const related = category.nominees.filter((n) => n.slug !== nominee.slug).slice(0, 3);
  const sameCountry = getGoldCategory(category.slug)?.nominees.filter(
    (n) => n.slug !== nominee.slug && n.country === nominee.country,
  ) ?? [];

  const handleShare = async () => {
    const shareData = {
      title: `${nominee.name} — NESA Africa Influencers Education Impact Award Nominee`,
      text: nominee.summary,
      url: canonical,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(canonical);
      toast.success("Profile link copied to clipboard");
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${nominee.name} | NESA Africa Influencers Education Impact Award Nominee`}</title>
        <meta
          name="description"
          content={`Learn about ${nominee.name}, their education advocacy impact, nomination category, and contribution to Education for All across Africa.`}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${nominee.name} — Influencers Education Impact Award`} />
        <meta property="og:description" content={nominee.summary} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: nominee.name,
            nationality: nominee.country,
            url: canonical,
            image: ogImage,
            description: nominee.summary,
            award: `NESA Africa 2026 — ${category.title}`,
          })}
        </script>
      </Helmet>

      <section className="bg-charcoal min-h-screen pb-20 md:pb-14">
        <div className="container pt-8">
          <NomineeBreadcrumbs
            items={[
              { label: "Nominees", href: "/nominees" },
              { label: "Influencers Education Impact Award", href: "/nominees/gold-special-recognition" },
              { label: category.shortName, href: `/nominees/gold-special-recognition/${category.slug}` },
              { label: nominee.name },
            ]}
          />
        </div>

        {/* Hero */}
        <div className="relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl border border-gold/25 bg-charcoal-light shadow-[0_0_70px_-20px_rgba(212,175,55,0.35)]"
            >
              <div className="grid md:grid-cols-[1fr,1.2fr]">
                {/* Image */}
                <div className="relative h-72 md:h-[28rem]">
                  <HonoureeImage slug={nominee.slug} name={nominee.name} fallbackImage={nominee.image} flag={nominee.flag} />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal-light via-charcoal-light/30 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur text-gold border-gold/40">
                    <Sparkles className="w-3 h-3 mr-1" /> Influencers Education Impact Award
                  </Badge>
                </div>
                {/* Content */}
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-ivory/55 mb-3">
                    <span className="text-base">{nominee.flag}</span>
                    <span>{nominee.country} · {nominee.region}</span>
                  </div>
                  <h1 className="font-display text-3xl md:text-5xl font-bold text-ivory mb-3 leading-[1.1]">
                    {nominee.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge className="bg-gold/15 text-gold border-gold/30">{category.shortName}</Badge>
                    <Badge variant="outline" className="border-gold/30 text-ivory/75">{nominee.discipline}</Badge>
                    {nominee.verified && (
                      <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 gap-1">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </Badge>
                    )}
                    {nominee.followers && (
                      <Badge variant="outline" className="border-gold/30 text-ivory/75">{nominee.followers}</Badge>
                    )}
                  </div>
                  <p className="text-ivory/75 text-base md:text-lg mb-6">{nominee.summary}</p>

                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Button asChild size="lg" className="bg-gold font-bold text-charcoal hover:bg-gold/90 rounded-full px-7">
                      <Link to={`/nominees/gold-special-recognition/${category.slug}`}>Learn More</Link>
                    </Button>
                    <Button onClick={handleShare} size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10 rounded-full px-6 gap-2 bg-charcoal/40 backdrop-blur">
                      <Share2 className="w-4 h-4" /> Share Profile
                    </Button>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <NomineeProfileGovernance tierName="Influencers Education Impact" tierHref="/awards/influencer-education-impact#nominees" showShare={false} />

        <div className="container mt-10 grid lg:grid-cols-[1fr,320px] gap-8">
          {/* Main */}
          <main className="space-y-10">
            {/* Impact story */}
            <section>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-gold" /> Impact Story
              </h2>
              <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-6 md:p-8">
                <p className="text-ivory/80 leading-relaxed text-base md:text-lg whitespace-pre-line">
                  {nominee.impactStory}
                </p>
              </div>
            </section>

            {/* Metrics */}
            {nominee.metrics && nominee.metrics.length > 0 && (
              <section>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-4">Impact Metrics</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {nominee.metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl border border-gold/20 bg-gradient-to-br from-charcoal-light to-charcoal p-5 text-center">
                      <div className="font-display text-2xl md:text-3xl font-bold text-gold mb-1">{m.value}</div>
                      <div className="text-xs uppercase tracking-wider text-ivory/60">{m.label}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Media & Campaigns placeholder */}
            <section>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-4">Media & Campaigns</h2>
              <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-6 md:p-8 text-ivory/65">
                Photos, interviews, and campaign highlights for {nominee.name} will appear here as the 2026 cycle progresses.
              </div>
            </section>



            {/* Social proof placeholder */}
            <section>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ivory mb-4">Endorsements & Press</h2>
              <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-6 md:p-8 text-ivory/65">
                Public endorsements, testimonials, and partner mentions for {nominee.name} will be curated here ahead of the awards gala.
              </div>
            </section>
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-5">
              <h3 className="font-display text-sm font-bold text-ivory mb-3 uppercase tracking-wider">
                More in {category.shortName}
              </h3>
              <ul className="space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to={`/nominees/gold-special-recognition/${category.slug}/${r.slug}`}
                      className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gold/5 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <HonoureeImage slug={r.slug} name={r.name} fallbackImage={r.image} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-ivory group-hover:text-gold transition-colors line-clamp-1">{r.name}</div>
                        <div className="text-[11px] text-ivory/50 line-clamp-1">{r.flag} {r.country}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gold/60 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {sameCountry.length > 0 && (
              <div className="rounded-2xl border border-gold/15 bg-charcoal-light/60 p-5">
                <h3 className="font-display text-sm font-bold text-ivory mb-3 uppercase tracking-wider">
                  Other Nominees from {nominee.country}
                </h3>
                <ul className="space-y-1">
                  {sameCountry.map((r) => (
                    <li key={r.slug}>
                      <Link
                        to={`/nominees/gold-special-recognition/${category.slug}/${r.slug}`}
                        className="block text-sm text-ivory/70 hover:text-gold px-2 py-1.5 rounded-lg hover:bg-gold/5 transition-colors"
                      >
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link to={`/nominees/gold-special-recognition/${category.slug}`}>
              <Button variant="outline" className="w-full border-gold/30 text-gold hover:bg-gold/10 rounded-full gap-2">
                Back to {category.shortName} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </aside>
        </div>


      </section>
    </>
  );
}
