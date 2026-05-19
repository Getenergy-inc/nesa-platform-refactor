import { Helmet } from "react-helmet-async";
import { Navigate, useParams, Link } from "react-router-dom";
import {
  ICON_CLASSIFICATIONS,
  IconSubcategorySlug,
  bySubcategory,
  byClassification,
  classificationUrl,
  featured,
  getSubcategory,
} from "@/data/iconAward";
import {
  ClassificationCard,
  FinalCTA,
  IconBreadcrumbs,
  IconHero,
  NomineeCard,
} from "@/components/iconAward/shared";
import { Button } from "@/components/ui/button";

export default function IconSubcategoryPage() {
  const { sub } = useParams<{ sub: string }>();
  const subcategory = sub ? getSubcategory(sub) : undefined;
  if (!subcategory)
    return <Navigate to="/nominees/africa-education-icon-award" replace />;

  const subSlug = subcategory.slug as IconSubcategorySlug;
  const all = bySubcategory(subSlug);
  const spotlight = featured(subSlug, undefined, 3);
  const url = `https://nesaafrica.lovable.app/nominees/africa-education-icon-award/${subSlug}`;
  const title = `${subcategory.title} Nominees | Africa Education Icon Award | NESA Africa`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={subcategory.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={subcategory.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 pt-6">
          <IconBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Africa Education Icon Award", href: "/nominees/africa-education-icon-award" },
              { label: subcategory.short },
            ]}
          />
        </div>

        <IconHero
          eyebrow="Icon Subcategory · 2006–2026"
          title={subcategory.title}
          subtitle={subcategory.description}
          meta={[
            { label: "Classifications", value: 3 },
            { label: "Nominees", value: all.length },
          ]}
          primary={{ label: "View All Nominees", href: "#all" }}
        />

        <section className="bg-charcoal py-14">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Classifications
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {ICON_CLASSIFICATIONS.map((c) => (
                <ClassificationCard
                  key={c.slug}
                  sub={subSlug}
                  classification={c}
                  count={byClassification(subSlug, c.slug).length}
                />
              ))}
            </div>
          </div>
        </section>

        {spotlight.length > 0 && (
          <section className="bg-charcoal-light/40 py-14">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-white mb-6">
                Featured Icon Spotlight
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {spotlight.map((n) => (
                  <NomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="all" className="bg-charcoal py-14">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-white">
                All Nominees · {all.length}
              </h2>
            </div>
            {all.length === 0 ? (
              <p className="text-white/60">No nominees yet — be the first to nominate.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {all.map((n) => (
                  <NomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {ICON_CLASSIFICATIONS.map((c) => (
                <Button
                  key={c.slug}
                  asChild
                  variant="outline"
                  className="border-gold/30 text-white hover:bg-gold/10"
                >
                  <Link to={classificationUrl(subSlug, c.slug)}>
                    View {c.title} →
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <FinalCTA />
      </div>
    </>
  );
}
