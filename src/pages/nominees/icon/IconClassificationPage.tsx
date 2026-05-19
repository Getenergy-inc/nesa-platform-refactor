import { Helmet } from "react-helmet-async";
import { Navigate, useParams } from "react-router-dom";
import {
  IconClassificationSlug,
  IconSubcategorySlug,
  byClassification,
  getClassification,
  getSubcategory,
} from "@/data/iconAward";
import {
  FinalCTA,
  IconBreadcrumbs,
  IconHero,
  NomineeCard,
  RelatedClassifications,
} from "@/components/iconAward/shared";
import {
  NomineeFilterBar,
  useNomineeFilters,
} from "@/components/iconAward/NomineeFilterBar";

export default function IconClassificationPage() {
  const { sub, cls } = useParams<{ sub: string; cls: string }>();
  const subcategory = sub ? getSubcategory(sub) : undefined;
  const classification = cls ? getClassification(cls) : undefined;
  if (!subcategory)
    return <Navigate to="/nominees/africa-education-icon-award" replace />;
  if (!classification)
    return (
      <Navigate
        to={`/nominees/africa-education-icon-award/${subcategory.slug}`}
        replace
      />
    );

  const subSlug = subcategory.slug as IconSubcategorySlug;
  const clsSlug = classification.slug as IconClassificationSlug;
  const all = byClassification(subSlug, clsSlug);

  const { state, filtered, countries, regions, setParam, clear, activeCount } =
    useNomineeFilters(all);

  const url = `https://nesaafrica.lovable.app/nominees/africa-education-icon-award/${subSlug}/${clsSlug}`;
  const title = `${classification.title} — ${subcategory.title} Nominees | NESA Africa`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={`${classification.description} (${subcategory.title}, 2006–2026)`}
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={classification.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-charcoal">
        <div className="container mx-auto px-4 pt-6">
          <IconBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: "Africa Education Icon Award",
                href: "/nominees/africa-education-icon-award",
              },
              { label: subcategory.short, href: `/nominees/africa-education-icon-award/${subSlug}` },
              { label: classification.short },
            ]}
          />
        </div>

        <IconHero
          eyebrow={`${subcategory.short} · ${classification.short}`}
          title={`${classification.title} — ${subcategory.title}`}
          subtitle={classification.description}
          meta={[
            { label: "Nominees", value: all.length },
            { label: "Years", value: "2006–2026" },
          ]}
          primary={{ label: "View Nominees", href: "#grid" }}
        />

        {/* Filters */}
        <NomineeFilterBar
          state={state}
          countries={countries}
          regions={regions}
          setParam={setParam}
          clear={clear}
          activeCount={activeCount}
          total={all.length}
          filteredCount={filtered.length}
        />


        <section id="grid" className="bg-charcoal py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-xl font-bold text-white">
                {filtered.length} of {all.length} nominees
              </h2>
            </div>
            {filtered.length === 0 ? (
              <p className="text-white/60">No nominees match the current filters.</p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((n) => (
                  <NomineeCard key={n.id} nominee={n} />
                ))}
              </div>
            )}
          </div>
        </section>

        <RelatedClassifications sub={subSlug} current={clsSlug} />
        <FinalCTA />
      </div>
    </>
  );
}
