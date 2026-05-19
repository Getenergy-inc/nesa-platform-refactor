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

  const [params, setParams] = useSearchParams();
  const country = params.get("country") || "all";
  const verification = params.get("verification") || "all";
  const jury = params.get("jury") || "all";
  const q = params.get("q") || "";

  const countries = useMemo(
    () => Array.from(new Set(all.map((n) => n.country))).sort(),
    [all]
  );

  const filtered = useMemo(() => {
    return all.filter((n) => {
      if (country !== "all" && n.country !== country) return false;
      if (verification !== "all" && n.verification_status !== verification) return false;
      if (jury !== "all" && n.jury_status !== jury) return false;
      if (q && !`${n.name} ${n.impact_summary}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [all, country, verification, jury, q]);

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (!v || v === "all") next.delete(k);
    else next.set(k, v);
    setParams(next, { replace: true });
  };

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
        <section className="border-y border-gold/15 bg-charcoal-light/40 py-6 sticky top-0 z-10 backdrop-blur">
          <div className="container mx-auto px-4 grid gap-3 md:grid-cols-4">
            <Input
              placeholder="Search nominees…"
              value={q}
              onChange={(e) => setParam("q", e.target.value)}
              className="bg-charcoal border-gold/20 text-white placeholder:text-white/40"
            />
            <Select value={country} onValueChange={(v) => setParam("country", v)}>
              <SelectTrigger className="bg-charcoal border-gold/20 text-white">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={verification} onValueChange={(v) => setParam("verification", v)}>
              <SelectTrigger className="bg-charcoal border-gold/20 text-white">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={jury} onValueChange={(v) => setParam("jury", v)}>
              <SelectTrigger className="bg-charcoal border-gold/20 text-white">
                <SelectValue placeholder="Jury status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any jury status</SelectItem>
                <SelectItem value="nominated">Nominated</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="jury_reviewed">Jury reviewed</SelectItem>
                <SelectItem value="laureate">Laureate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

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
