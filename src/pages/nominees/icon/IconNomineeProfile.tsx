import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ICON_AWARD,
  byClassification,
  classificationUrl,
  getClassification,
  getIconNominee,
  getSubcategory,
  profileUrl,
  subcategoryUrl,
} from "@/data/iconAward";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FinalCTA,
  IconBreadcrumbs,
  NomineeCard,
} from "@/components/iconAward/shared";
import { MapPin, ShieldCheck, Trophy } from "lucide-react";

export default function IconNomineeProfile() {
  const { slug } = useParams<{ slug: string }>();
  const nominee = slug ? getIconNominee(slug) : undefined;
  if (!nominee)
    return <Navigate to="/nominees/africa-education-icon-award" replace />;

  const sub = getSubcategory(nominee.award_subcategory_slug)!;
  const cls = getClassification(nominee.classification_slug)!;
  const related = byClassification(sub.slug, cls.slug)
    .filter((n) => n.slug !== nominee.slug)
    .slice(0, 3);

  const url = `https://nesaafrica.lovable.app${profileUrl(nominee.slug)}`;
  const title =
    nominee.seo_title ||
    `${nominee.name} | ${sub.title} | Africa Education Icon Nominee`;
  const description = nominee.seo_description || nominee.impact_summary;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: nominee.name,
          nationality: nominee.country,
          description: nominee.impact_summary,
          award: ICON_AWARD.title,
          url,
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 pt-6">
          <IconBreadcrumbs
            items={[
              { label: "Africa Education Icon Award", href: "/nominees/africa-education-icon-award" },
              { label: sub.short, href: subcategoryUrl(sub.slug) },
              { label: cls.short, href: classificationUrl(sub.slug, cls.slug) },
              { label: nominee.name },
            ]}
          />
        </div>

        {/* Hero */}
        <section className="border-b border-gold/15 bg-gradient-to-b from-black to-charcoal">
          <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-gold/30 bg-black/40 aspect-square">
              <img
                src={nominee.image_url}
                alt={nominee.name}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/africaicons/placeholder-icon.svg";
                }}
              />
            </div>
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-gold/15 text-gold border-gold/30">Icon Award</Badge>
                <Badge variant="outline" className="border-gold/30 text-white/80">
                  {sub.short}
                </Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-300/90">
                  {cls.short}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/70 capitalize">
                  {nominee.jury_status.replace(/_/g, " ")}
                </Badge>
                {nominee.verification_status === "verified" && (
                  <Badge className="bg-gold/90 text-charcoal">
                    <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
                {nominee.name}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="h-4 w-4" /> {nominee.country} · {nominee.region}
              </div>
              <p className="mt-5 max-w-2xl text-white/75 leading-relaxed">
                {nominee.impact_summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="bg-gold text-charcoal hover:bg-gold/90">
                  <Link to={`/nominate?endorse=${nominee.slug}`}>Endorse Icon</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gold/40 text-white hover:bg-gold/10"
                >
                  <Link to={classificationUrl(sub.slug, cls.slug)}>
                    Back to {cls.short}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Lifetime Impact Story */}
        <section className="bg-charcoal py-14">
          <div className="container mx-auto px-4 grid gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-bold text-white mb-4">
                Individual Contribution to African Education (2006–2026)
              </h2>
              <p className="text-white/75 leading-relaxed whitespace-pre-line">
                {nominee.full_impact_story || nominee.impact_summary}
              </p>
              {nominee.impact_area.length > 0 && (
                <>
                  <h3 className="mt-8 font-display text-lg font-semibold text-white">
                    Impact Areas
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {nominee.impact_area.map((a) => (
                      <Badge
                        key={a}
                        variant="outline"
                        className="border-gold/30 text-white/80"
                      >
                        {a}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="rounded-xl border border-gold/20 bg-charcoal-light p-6 h-fit">
              <h3 className="font-display text-lg font-semibold text-white mb-4">
                Recognition Status
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-white/80">
                  <Trophy className="h-4 w-4 text-gold" /> Jury status:{" "}
                  <span className="capitalize">{nominee.jury_status.replace(/_/g, " ")}</span>
                </li>
                <li className="flex items-center gap-2 text-white/80">
                  <ShieldCheck className="h-4 w-4 text-gold" /> Verification:{" "}
                  <span className="capitalize">{nominee.verification_status}</span>
                </li>
                <li className="text-white/70">
                  Years of contribution: {nominee.years_of_contribution}
                </li>
                {nominee.sector && (
                  <li className="text-white/70">Sector: {nominee.sector}</li>
                )}
              </ul>
              {nominee.impact_metrics && Object.keys(nominee.impact_metrics).length > 0 && (
                <>
                  <h4 className="mt-6 font-display text-base font-semibold text-white">
                    Impact Metrics
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-white/70">
                    {Object.entries(nominee.impact_metrics).map(([k, v]) => (
                      <li key={k}>
                        <span className="text-gold">{v}</span> {k.replace(/_/g, " ")}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </aside>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-charcoal-light/40 py-14">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                Related Nominees in {cls.short}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <NomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            </div>
          </section>
        )}

        <FinalCTA />
      </div>
    </>
  );
}
