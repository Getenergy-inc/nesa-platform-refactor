import { Link, Navigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { getAwardResearch, RESEARCH_EVIDENCE_NOTE } from "@/config/awardResearch2026";
import { CategoryPictureCatalogue } from "@/components/awards/branded/CategoryPictureCatalogue";
import { AwardResearchContext } from "@/components/awards/AwardResearchContext";

export default function ResearchPathwayPage() {
  const { categorySlug, pathwaySlug } = useParams();
  const research = getAwardResearch(categorySlug);
  const pathway = research?.pathways.find((entry) => entry.slug === pathwaySlug);
  if (!research || !pathway) return <Navigate to="/recognition/categories" replace />;
  return <>
    <Helmet><title>{`${pathway.title} | NESA-Africa`}</title><meta name="description" content={pathway.description} /><link rel="canonical" href={`https://nesa.africa/recognition/research/${research.categorySlug}/${pathway.slug}`} /></Helmet>
    <section className="border-b border-gold/20 bg-charcoal py-12 text-ivory"><div className="mx-auto max-w-6xl px-4">
      <Link to={`/recognition/subpage/${research.canonicalSlug}`} className="text-sm text-gold">Back to award category</Link>
      <h1 className="mt-5 font-serif text-3xl md:text-5xl">{pathway.title}</h1>
      <p className="mt-5 max-w-3xl text-ivory/75">{pathway.description}</p>
      <div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link to={`/nominate?category=${research.categorySlug}`}>Nominate an Education Enabler</Link></Button><Button asChild variant="outline"><a href="#existing-nominees">Meet Africa's Education Enablers</a></Button></div>
    </div></section>
    <section className="bg-background py-10"><div className="mx-auto max-w-6xl space-y-4 px-4"><h2 className="font-serif text-2xl">Evidence and review</h2><p className="max-w-3xl text-muted-foreground">{pathway.evidence}</p><p className="max-w-3xl text-sm text-muted-foreground">{RESEARCH_EVIDENCE_NOTE}</p><p className="text-sm text-muted-foreground">The nomination form retains the existing category and subcategory choices. Research labels do not silently reclassify existing nominees.</p></div></section>
    {!pathway.legacyPrefixes.length && <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-muted-foreground">Category-wide public register. Existing nominees have not been individually mapped to this research pathway.</p>}
    <CategoryPictureCatalogue categorySlug={research.categorySlug} subcategoryPrefixes={pathway.legacyPrefixes.length ? pathway.legacyPrefixes : undefined} />
    <AwardResearchContext categorySlug={research.categorySlug} />
  </>;
}