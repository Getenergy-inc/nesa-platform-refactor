import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAwardResearch, RESEARCH_EVIDENCE_NOTE, RESEARCH_REGIONS, researchPath } from "@/config/awardResearch2026";
import { AWARD_RESEARCH_SOURCES } from "@/config/awardResearchSources";

export function AwardResearchContext({ categorySlug }: { categorySlug?: string }) {
  const research = getAwardResearch(categorySlug);
  if (!research) return null;
  return (
    <section className="border-y border-border bg-background py-10 text-foreground" aria-label="Research scope and pathways">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div>
          <h2 className="font-serif text-2xl">Education impact pathways</h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">{research.intro}</p>
        </div>
        {research.pathways.length > 0 && <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {research.pathways.map((pathway) => <li key={pathway.slug} className="rounded-lg border border-border p-5">
            <h3 className="font-serif text-lg">{pathway.title}</h3>
            <p className="my-3 text-sm text-muted-foreground">{pathway.description}</p>
            <Button asChild variant="outline" size="sm"><Link to={researchPath(research, pathway)}>View pathway</Link></Button>
          </li>)}
        </ul>}
        {research.lenses && <div><h3 className="mb-3 text-sm font-semibold">Supporting research lenses</h3><div className="flex flex-wrap gap-2">{research.lenses.map((lens) => <Badge key={lens} variant="secondary" className="whitespace-normal">{lens}</Badge>)}</div></div>}
        <div><h3 className="mb-3 text-sm font-semibold">Eight Africa regions · Two global communities</h3><div className="flex flex-wrap gap-2">{RESEARCH_REGIONS.map((region) => <Badge variant="outline" key={region}>{region}</Badge>)}</div></div>
        <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">{RESEARCH_EVIDENCE_NOTE}</p>
        <div><h3 className="mb-3 text-sm font-semibold">Research sources</h3><ul className="space-y-2">{research.sourceFiles.map((file) => <li key={file}><a href={AWARD_RESEARCH_SOURCES[file]} target="_blank" rel="noopener noreferrer" className="break-words text-sm text-primary underline">{file.replace(/_/g, " ").replace(".pdf", "")} (PDF)</a></li>)}</ul></div>
      </div>
    </section>
  );
}